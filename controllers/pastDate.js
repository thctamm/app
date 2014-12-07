
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
		if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
		{
			// close the nav bar if on ios
			nav.close();
		}
		else
		{
			// close the window if on android
			displayWin.close();
		}
	}
});


// get previous workouts
var query = args.db.execute("SELECT * FROM workouts WHERE date(timestamp) = ?", date);
if (query.isValidRow())
{
	// generate the table info
	var data = [];
	
	// for every workout on that day
	while (query.isValidRow())
	{
		
		// get the exercises done
		var details = args.db.execute("SELECT * FROM workout_info WHERE  workout_id = ?", query.fieldByName('id'));
	
		// generate tabel headers
		var header = Ti.UI.createTableViewRow({
		});
		
		// set height of headers based on OS
		if (Ti.Platform.osname == "android")
		{
			header.setHeight('auto');
		}
		else
		{
			header.setHeight('8%');
		}
		
		// format the timestamp to only display hours and minutes
		var format_time = args.db.execute("SELECT strftime('%H:%M', ?) as time", query.fieldByName('timestamp'));
		
		// create the label for the the time an workout was started
		var label0 = Titanium.UI.createLabel({
		    text: format_time.fieldByName('time'),
		    color: 'gray',
		    textAlign: 'center',
		    right: '2%',
		    left: '2%',
		    font: {
				fontSize: 20
			}
		});
		
		// add the label to the header row and push the row to data
		header.add(label0);
		data.push(header);
		
		// create the column headers
		var row = Ti.UI.createTableViewRow({
		    height:'auto',
		    backgroundColor: 'gray',
		});
		var label1 = Titanium.UI.createLabel({
		    text:'Exercise',
		    color: 'white',
		    width: '53%',
		    left: '2%',
		    font: {
				fontSize: 15
			}
		});
		var label2 = Titanium.UI.createLabel({
		    text:'Time',
		    textAlign: 'center',
		    color: 'white',
		    left: '55%',
		    width: '10%',
		    font: {
				fontSize: 13
			}
		});
		var label3 = Titanium.UI.createLabel({
		    text:'Sets',
		    textAlign: 'center',
		    color: 'white',
		    left: '65%',
		    width: '10%',
		    font: {
				fontSize: 13
			}
		});
		var label4 = Titanium.UI.createLabel({
		    text:'Reps',
		    textAlign: 'center',
		    color: 'white',
		    left: '75%',
		    width: '10%',
		    font: {
				fontSize: 13
			}
		});
		var label5 = Titanium.UI.createLabel({
		    text:'Weight',
		    textAlign: 'center',
		    color: 'white',
		    left: '85%',
		    width: '15%',
		    font: {
				fontSize: 13
			}
		});
		
		// add column headers to a row and add them to data
		row.add(label1);
		row.add(label2);
		row.add(label3);
		row.add(label4);
		row.add(label5);
		data.push(row);
		
		// populate the table with every exercise
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
			
			// add the data to a row and and push the row to data
			row.add(label1);
			row.add(label2);
			row.add(label3);
			row.add(label4);
			row.add(label5);
			data.push(row);
			
			// go to the next exercise
			details.next();
		}
		
		// go to the next workout
		query.next();
	}
	
	// create the table with data
	table = Titanium.UI.createTableView({
		data: data,
		separatorColor: "black"
	});
	
	// add table and button to view and open window.
	displayview.add(table);
	displayWin.add(displayview);
	if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
	{
		// if on iOS add a navigation bar to the top with a back button
		var nav = Titanium.UI.iOS.createNavigationWindow({
	   		window: displayWin,
	   		title: "Muscle groups"
		});
		var back = Titanium.UI.createButton({title:'Back'});
	    displayWin.leftNavButton = back;
	    back.addEventListener('click', function()
	    {
	       nav.close();
	    });
		    
		nav.open();
	}
	else
	{
		displayWin.open();
	}
}

// if there wasn't an exercise on the chosen date, alert the user and close the window.
else 
{
	alert("No workout on this day");
	// if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
	// {
// 		
		// // on iOS close the navigation windo
		// nav.close();
	// }
	// else
	// {
		// displayWin.close();
	// }
}
