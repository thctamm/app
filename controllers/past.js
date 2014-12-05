var args = arguments[0] || {};

// platform specific height constant
var offset;
if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad") 
{
	offset = 250;
}
else
{
	offset = 150;
}

// create a window and view for past exercises
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

// Create a window and view for workout details
var detailWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'past exercise'
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

var picker = Ti.UI.createPicker({
    type : Ti.UI.PICKER_TYPE_DATE,
    //useSpinner for Android Only
    useSpinner : true, 
    minDate : new Date(1977, 4, 29),
    maxDate : new Date(2018, 11, 31),
    value : new Date(), 
    font: {
    fontWeight: 'bold',
    fontSize:50,
    },
    width: '96%',
    height: 135,
    top : 10, 
});
   
var setBut = $.UI.create('Button', {
	   top: offset,
	   title: 'GO',
	   id: "button",
	});
 
 
pastview.add(picker);
pastview.add(setBut);

// for keeping track of workouts
listed = [];

// function for listing workouts
function list_workouts ()
{
	// delete previous list
	for (i = 0; i < listed.length; i++)
	{
		pastview.remove(listed[i]);
	}
	listed = [];
	
	// Generate a header
	var header = Titanium.UI.createLabel({
	    text:'Or choose previous',
	    font: {
			fontSize: 20
		},
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    color: 'black',
	    backgroundColor: 'none',
	    left: '2%',
	    right: '2%',
	    top: offset + 50,
	    height: 30
	});
	listed.push(header);
	pastview.add(header);
	
	// get previous workouts
	var query = args.db.execute("SELECT * FROM workouts ORDER BY id DESC");

	// generate a list of previous workouts
	var i = 0;
	while (query.isValidRow())
	{
		var format_time = args.db.execute("SELECT strftime('%Y-%m-%d %H:%M', ?) as time LIMIT 100", query.fieldByName('timestamp'));
		var new_but =$.UI.create('Button', {
		    top: offset + 90 + i * 50,
		    title: format_time.fieldByName('time'),
		    code: query.fieldByName('id'),
		    id: 'button',
		    color: "black"
		});
		pastview.add(new_but);
		listed.push(new_but);
		query.next();
		i++;
		
		// close the queryd time
		format_time.close();
	}
	
	// close the queryd info
	query.close();
}


// list the workouts
list_workouts();

// Event listener for when a workout is chosen
pastview.addEventListener('click', function (e) {
	// to make sure a blank area was not clicked
	if (e.source.title != null)
	{
		if (e.source.title == 'GO')
		{
			var month = picker.value.getMonth() + 1;
			if (month < 10)
			{
				month = '0' + month;
			}
			var year = picker.value.getFullYear();
			var day = picker.value.getDate();
			if (day < 10)
			{
				day = '0' + day;
			}
			var datestring = year + '-' + month + '-' + day;
		    var dateView = Alloy.createController('pastDate', {db:args.db, date:datestring}).getView();
		}
		else
		{
			if (typeof detailWin == 'undefined')
			{
				var detailWin = Titanium.UI.createWindow({
				    backgroundColor: '#F2F2F2',
				    layout:'vertical',
				    title: 'past exercise'
				});
				
				// event listener for swipe functionality
				detailview.addEventListener('swipe', function(e){
					if (e.direction == 'right')
					{
						detailWin.close();
					}
				});
				
			}
			// change the title of the window
			detailWin.setTitle(e.source.title);
			
			// clear table if previously used
			if (typeof table != 'undefined' )
			{
				detailview.remove(table);
			}
			
			data = [];
			
			// get workout_id
			workout_id = e.source.code;
			
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
				
				// update the list of workouts
				list_workouts();
				
				//return to list of workouts
				detailWin.close();
			});
			
			// add table and button to view and open window.
			detailview.add(table);
			detailview.add(del);
			detailWin.add(detailview);
			detailWin.open();
		}
	}
});

// add view to window and open list of workouts.
pastWin.add(pastview);
pastWin.open();
