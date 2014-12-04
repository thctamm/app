
// get the arguments that were passed in.
var args = arguments[0] || {};
var date = args.date;

// create a window and view for display of exercises
var displayWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Past exercises'
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
var query = args.db.execute("SELECT id FROM workouts WHERE dmy = ?", date);
if (query.isValidRow())
{
	var details = args.db.execute("SELECT * FROM workout_info WHERE  workout_id = ?", query.fieldByName('id'));
	var data = [];

	// generate tabel headers
	var row = Ti.UI.createTableViewRow({
	    height:'auto',
	});
	var label1 = Titanium.UI.createLabel({
	    text:'Exercise',
	    color: 'black',
	    width: '53%',
	    left: '2%'
	});
	var label2 = Titanium.UI.createLabel({
	    text:'Time',
	    textAlign: 'center',
	    color: 'black',
	    left: '55%',
	    width: '10%'
	});
	var label3 = Titanium.UI.createLabel({
	    text:'Sets',
	    textAlign: 'center',
	    color: 'black',
	    left: '65%',
	    width: '10%'
	});
	var label4 = Titanium.UI.createLabel({
	    text:'Reps',
	    textAlign: 'center',
	    color: 'black',
	    left: '75%',
	    width: '10%'
	});
	var label5 = Titanium.UI.createLabel({
	    text:'Weight',
	    textAlign: 'center',
	    color: 'black',
	    left: '85%',
	    width: '15%'
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
		    left: '2%'
		});
		var label2 = Titanium.UI.createLabel({
		    text: details.fieldByName('time'),
		    textAlign: 'center',
		    color: 'black',
		    left: '55%',
		    width: '10%'
		});
		var label3 = Titanium.UI.createLabel({
		    text: details.fieldByName('sets'),
		    textAlign: 'center',
		    color: 'black',
		    left: '65%',
		    width: '10%'
		});
		var label4 = Titanium.UI.createLabel({
		    text: details.fieldByName('reps'),
		    textAlign: 'center',
		    color: 'black',
		    left: '75%',
		    width: '10%'
		});
		var label5 = Titanium.UI.createLabel({
		    text: details.fieldByName('weight'),
		    textAlign: 'center',
		    color: 'black',
		    left: '85%',
		    width: '15%'
		});
		row.add(label1);
		row.add(label2);
		row.add(label3);
		row.add(label4);
		row.add(label5);
		data.push(row);
		details.next();
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
	   bottom: 10
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
