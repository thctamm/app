
// get the arguments that were passed in.
var args = arguments[0] || {};

// create a view and window if one has not already been made
if (typeof formsWin == 'undefined' ) 
{
	var formsWin = Titanium.UI.createWindow({
	    backgroundColor: '#F2F2F2',
	    layout:'vertical',
	    title: args.title
	});
}
else
{
	
	// for iOS make a navbar, for android, only the window.
	if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
	{
		var nav = Titanium.UI.iOS.createNavigationWindow({
	   		window: formsWin,
	   		title: args.title
		});
		var back = Titanium.UI.createButton({title:'Back'});
	    nav.leftNavButton = back;
	    back.addEventListener('click', function()
	    {
	       nav.close();
	    });
		nav.open();
	}
	else
	{
		formsWin.open();
	}
}

// create a view
var formsview = Titanium.UI.createView({
    left:'0dp',
    width:'100%'
});

// event listener for swipe functionality
formsview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
		{
			nav.close();
		}
		else
		{
		formsWin.close();
		}
	}
});

// variable for keeping track of the timer and time
var time = 0;
var time_exists = false;
var timer;

// for keeping track of the forms
var forms = [];
var timefield;

// for keeping track of the submit button
var submit_button = null;

// query the database to know what forms need to be created
var chosen = args.db.execute("SELECT * FROM list where name = ?", args.title);

// delete any previous forms
for (i = 0; i < forms.length; i++)
{
	formsview.remove(forms[i]);
}

// variables for creating the froms
var p = 0;
var options = ['time', 'sets', 'reps', 'weight'];

// create the necessary forms
for (z = 0; z < options.length; z++)
{
	// check if any of the 4 options are used for this exercise
	if (chosen.fieldByName(options[z]) == 1)
	{
		// if they are, create a field for it.
		var field = Ti.UI.createTextField({
			keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD,
			color: '#336699',
			hintText: options[z],
			height: 35,
			top: 10 + 45 * p,
			width: '100%',
		});
		
		// add it to the view and  keep track of it in forms
		forms.push(field);
		formsview.add(field);
		p++;
		
		// add a stopper, if time is in the exercise
		if (options[z] == 'time')
		{
			time_exists = true;
			
			// keep track of the time field so the value from the stopper could be inserted into it
			timefield = field;
		}
	}
}

// create the stopper
if (time_exists)
{
	// label for time
	var timebox = Titanium.UI.createLabel({
	    text:'00:00:00',
	    font: {
			fontSize: 24
		},
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    color: 'black',
	    left: 10,
	    right: 10,
	    top: 10 + p * 45,
	    height: 40
	});
	p++;
	
	// buttons for stopper
	var startstop = $.UI.create('Button', {
	   top: 10 + p * 45,
	   left: "2%",
	   width: "47%",
	   title: 'Start',
	   id: "button",
	   backgroundColor: 'green'
	});
	
	// event listener for the start and stop button
	startstop.addEventListener('click', function (e) {
		
		// if the button is in the start state
		if (startstop.getTitle() == 'Start')
		{
			// change button appearance to Stop
			startstop.setTitle("Stop");
			startstop.setBackgroundColor('red');
			
			// start the timer
			time = 0;
			timer = setInterval(stopper, 10);
			
			// keep the screen from sleeping
			if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
			{
				Titanium.App.idleTimerDisabled = true;
			}
			else
			{
				formsview.keepScreenOn = true;
			}
			
		}
		
		// else if the button is in its stop state
		else
		{
			// change button appearance to start
			startstop.setTitle("Start");
			startstop.setBackgroundColor('green');
			
			// stop the timer
			clearInterval(timer);
			timer = null;
			
			// set the time field value
			timefield.setValue(time / 100);
			
			// let the screen sleep again
			if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
			{
				Titanium.App.idleTimerDisabled = false;
			}
			else
			{
				formsview.keepScreenOn = false;
			}
			
			
		}
	});
	
	// the reset button for the stopper
	var reset = $.UI.create('Button', {
	   top: 10 + p * 45,
	   right: "2%",
	   width: "47%",
	   title: 'Reset',
	   id: "button",
	});
	p++;
	
	// event listener for the reset button
	reset.addEventListener('click', function (e) {
		
		// stop the timer if it is on and reset the startstop button
		if (startstop.getTitle() == 'Stop')
		{
			// stop the interval
			clearInterval(timer);
			
			// clear the interval
			timer = null;
			
			// change button appearance
			startstop.setTitle("Start");
			startstop.setBackgroundColor('green');
			
			// let the screen sleep
			if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
			{
				Titanium.App.idleTimerDisabled = false;
			}
			else
			{
				formsview.keepScreenOn = false;
			}			
		}
		// reset the timer box
		timebox.setText('00:00:00');
	});
	
	// add the stopper with its buttons to the view
	formsview.add(timebox);
	formsview.add(startstop);
	formsview.add(reset);
}

// function for updating the time
function stopper()
{
	
	// increment the time
	time += 1;
	
	// convert time to milliseconds, seconds and minutes using some clever maths
	var milliseconds = time % 100;
	if (milliseconds < 10)
	{
		milliseconds = '0' + milliseconds;
	}
	var seconds = Math.floor(time / 100) % 60;
	if (seconds < 10)
	{
		seconds = '0' + seconds;
	}
	var minutes = Math.floor(time / 6000) % 100;
	if (minutes < 10)
	{
		minutes = '0' + minutes;
	}
	
	// update the timers label to the current time
	timebox.setText(minutes + ':' + seconds + ':' + milliseconds);
}


// remove an already existing submit button if there is one
if (submit_button != null)
{
	formsview.remove(submit_button);
}

// create a submit button
var submit = $.UI.create('Button', {
   top: 10 + p * 45,
   title: 'Submit',
   id: "botbutton"
});

// Favorites checkbox
var checkbox1 = Ti.UI.createButton({
    title: '',
    top: 60 + p * 45,
    left: 10,
    width: 30,
    height: 30,
    borderColor: '#666',
    borderWidth: 2,
    borderRadius: 3,
    backgroundColor: '#aaa',
    color: '#fff',
    font:{fontSize: 25, fontWeight: 'bold'},
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
checkbox1.on = function() {
    this.backgroundColor = '#007690';
    this.title='\u2713';
    this.value = true;
    args.db.execute('UPDATE list set favorite = 1 where name = ?', args.title);
    
    // fire a global event that favorites have been updated
	Ti.App.fireEvent('favorites_updated');
};
 
checkbox1.off = function() {
    this.backgroundColor = '#aaa';
    this.title='';
    this.value = false;
    args.db.execute('UPDATE list set favorite = 0 where name = ?', args.title);
    
    // fire a global event that favorites have been updated
	Ti.App.fireEvent('favorites_updated');
};
 
checkbox1.addEventListener('click', function(e) {
    if(false == e.source.value) {
        e.source.on();
    } else {
        e.source.off();
    }
});

// set the checkbox state
if (chosen.fieldByName('favorite') == 1)
{
	checkbox1.on();
}
else
{
	checkbox1.off();
}

// favorites label
var label1 = Titanium.UI.createLabel({
    text:'Favorite exercise',
    color: 'black',
    left: 50,
    top: 60 + p * 45,
    height: 30
});

// keep track of the button
submit_button = submit;

// add an event listener for the submit button
submit.addEventListener('click', function (e) {
	
	// check if all forms have been filled
	var not_filled = false;
	for (i = 0; i < forms.length; i++)
	{
		if (forms[i].getValue() == '')
		{
			alert("All fields aren't filled");
			not_filled = true;
		}
	}
	
	// if all forms have been filled
	if (not_filled == false)
	{
		// make a new workout if one has not been made yet
		var check = args.db.execute('SELECT * FROM workout_info WHERE workout_id = ?', args.workout_id);
		if(!check.isValidRow())
		{
			args.db.execute('INSERT INTO workouts (id) values (?)', args.workout_id);
			
			// update stats
			args.db.execute('UPDATE stats SET workouts = workouts + 1');
		}
		
		// update usage of the exercise
		args.db.execute('UPDATE list SET used = used + 1 WHERE name = ?', args.title);
		
		// dynamically create the query for adding an exercise
		var query = "INSERT INTO workout_info (exercise, workout_id, ";
		for (i = 0; i < forms.length; i++)
		{
			query = query.concat(forms[i].hintText);
			if (i+1 != forms.length)
			{
				query = query.concat(", ");
			}
		}
		query = query.concat(") VALUES (");
		query = query.concat("'" + args.title + "'");
		query = query.concat(", ");
		query = query.concat(args.workout_id);
		query = query.concat(", ");
		for (i = 0; i < forms.length; i++)
		{
			query = query.concat(forms[i].getValue());
			if (i+1 != forms.length)
			{
				query = query.concat(", ");
			}
		}
		query = query.concat(")");
		
		// run the query
		args.db.execute(query);
		
		//check if weight was lifted
		var lifted = 1;
		var check1 = false;
		var check2 = false;
		for (i = 0; i < forms.length; i++)
		{
			if (forms[i].getHintText() == 'weight')
			{
				check1 = true;
				lifted *= forms[i].getValue();
			}
			if (forms[i].getHintText() == 'sets' || forms[i].getHintText() == 'reps')
			{
				check2 = true;
				lifted *= forms[i].getValue();
			}
		}
		
		// if weight was lifted update total ammount of weight lifted
		if (check1 == true && check2 == true)
		{
			args.db.execute('UPDATE stats SET weight = weight + ?', lifted);
		}
		
		// return to the muscle groups view
		if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
		{
			// the app event is to make the previous window go back to the muscle groups window
			Ti.App.fireEvent('submitted');
			nav.close();
		}
		else
		{
			formsWin.close();
			args.Win.close();
		}
	}
});

// add the submit button and favorites checkbox to the view
formsview.add(submit);
formsview.add(checkbox1);
formsview.add(label1);

// close the queryd info
chosen.close();

// add the view to the window and open the window
formsWin.add(formsview);
if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
{
	var nav = Titanium.UI.iOS.createNavigationWindow({
   		window: formsWin,
   		title: args.title
	});
	var back = Titanium.UI.createButton({title:'Back'});
    formsWin.leftNavButton = back;
    back.addEventListener('click', function()
    {
       nav.close();
    });
	nav.open();
}
else
{
	formsWin.open();
}
