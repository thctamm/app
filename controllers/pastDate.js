
// get the arguments that were passed in.
var args = arguments[0] || {};
var date = args.date;

// create a window and view for display of exercises
var displayWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: date
});

var displayview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});


// event listener for swipe functionality
displayview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		displayWin.close();
	}
});


// get previous workouts
var query = args.db.execute("SELECT * FROM workouts WHERE date(timestamp) = ?", date);
if (query.isValidRow())
{
	var first = 0;
	var data = [];
	while (query.isValidRow())
	{
		var details = args.db.execute("SELECT * FROM workout_info WHERE  workout_id = ?", query.fieldByName('id'));
	
		// generate tabel headers
		var header = Ti.UI.createTableViewRow({
		    height:'8%',
		});
		
		var label0 = Titanium.UI.createLabel({
		    text:query.fieldByName('timestamp'),
		    color: 'gray',
		    textAlign: 'center',
		    right: '2%',
		    left: '2%',
		    font: {
		    	//fontWeight: 'bold',
				fontSize: 20
			}
		});
		header.add(label0);
		data.push(header);
		if (first == 0)
		{
			label0.setTop(10);
			first++;
		}
		
		var row = Ti.UI.createTableViewRow({
		    height:'auto',
		});
		var label1 = Titanium.UI.createLabel({
		    text:'Exercise',
		    color: 'black',
		    width: '53%',
		    left: '2%',
		    font: {
				fontSize: 15
			}
		});
		var label2 = Titanium.UI.createLabel({
		    text:'Time',
		    textAlign: 'center',
		    color: 'black',
		    left: '55%',
		    width: '10%',
		    font: {
				fontSize: 15
			}
		});
		var label3 = Titanium.UI.createLabel({
		    text:'Sets',
		    textAlign: 'center',
		    color: 'black',
		    left: '65%',
		    width: '10%',
		    font: {
				fontSize: 15
			}
		});
		var label4 = Titanium.UI.createLabel({
		    text:'Reps',
		    textAlign: 'center',
		    color: 'black',
		    left: '75%',
		    width: '10%',
		    font: {
				fontSize: 15
			}
		});
		var label5 = Titanium.UI.createLabel({
		    text:'Weight',
		    textAlign: 'center',
		    color: 'black',
		    left: '85%',
		    width: '15%',
		    font: {
				fontSize: 15
			}
		});
		
		// add headers to data
		row.add(label1);
		row.add(label2);
		row.add(label3);
		row.add(label4);
		row.add(label5);
		data.push(row);
		
		// populate the table
		while (details.isValidRow())
		{
			var row = Ti.UI.createTableViewRow({
			    height:'auto',
			});
			var label1 = Titanium.UI.createLabel({
			    text: details.fieldByName('exercise'),
			    color: 'black',
			    width: '53%',
			    left: '2%',
			    font: {
					fontSize: 15
				}
			});
			var label2 = Titanium.UI.createLabel({
			    text: details.fieldByName('time'),
			    textAlign: 'center',
			    color: 'black',
			    left: '55%',
			    width: '10%',
			    font: {
					fontSize: 15
				}
			});
			var label3 = Titanium.UI.createLabel({
			    text: details.fieldByName('sets'),
			    textAlign: 'center',
			    color: 'black',
			    left: '65%',
			    width: '10%',
			    font: {
					fontSize: 15
				}
			});
			var label4 = Titanium.UI.createLabel({
			    text: details.fieldByName('reps'),
			    textAlign: 'center',
			    color: 'black',
			    left: '75%',
			    width: '10%',
			    font: {
					fontSize: 15
				}
			});
			var label5 = Titanium.UI.createLabel({
			    text: details.fieldByName('weight'),
			    textAlign: 'center',
			    color: 'black',
			    left: '85%',
			    width: '15%',
			    font: {
					fontSize: 15
				}
			});
			row.add(label1);
			row.add(label2);
			row.add(label3);
			row.add(label4);
			row.add(label5);
			data.push(row);
			details.next();
		}
		query.next();
	}
	// create the table with data
	table = Titanium.UI.createTableView({
		data: data,
		separatorColor: "black"
	});
	
	// delete button for deleting a workout
	var del = $.UI.create('Button', {
	   title: 'Delete',
	   id: "botbutton",
	   bottom: 10,
	   width: '96%'
	});
	del.addEventListener('click', function (e) {
		
		// clear the workout from list of workouts
		args.db.execute("DELETE FROM workouts where id = ?", workout_id);
		
		// remove all exercises from that workout
		args.db.execute("DELETE FROM workout_info where workout_id = ?", workout_id);
		
		//return to list of workouts
		displayWin.close();
	});
	
	// add table and button to view and open window.
	displayview.add(table);
	displayview.add(del);
	displayWin.add(displayview);
	displayWin.open();
}

else 
{
	alert("No workout on this day");
	displayWin.close();
}
