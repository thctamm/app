
// get the arguments that were passed in.
var args = arguments[0] || {};

/*// create a window and view for past exercises
var pastWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Past exercises'
});

var pastview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});


// event listener for swipe functionality
pastview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		pastWin.close();
	}
});
*/
// Create a window and view for workout details
var detailWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'past exercises'
});

var detailview = Titanium.UI.createView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});

// event listener for swipe functionality
detailview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		detailWin.close();
	}
});

var workout_id;

// variables, where table contents are stored
var data = [];
var table;


// Event listener for when a workout is chosen
detailview.addEventListener('click', function (e) {
	// to make sure a blank area was not clicked
	if (e.date.value != null)
	{
		
		// change the title of the window
		detailWin.setTitle(e.date.value);
		
		// clear table if previously used
		if (typeof table != 'undefined' )
		{
			detailview.remove(table);
		}
		data = [];
		
		// get workout_id
		workout_id = e.date.value;
		
		// get previous workouts
		var details = args.db.execute("SELECT * FROM workout_info where workout_id = ?", workout_id);
		
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
			detailWin.close();
		});
		
		// add table and button to view and open window.
		detailview.add(table);
		detailview.add(del);
		detailWin.add(detailview);
		detailWin.open();
	}
	
});

// add view to window and open list of workouts.
detailWin.add(detailview);
detailWin.open();