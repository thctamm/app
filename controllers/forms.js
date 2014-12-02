//comment

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
	formsWin.open();
}

var formsview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});

// event listener for swipe functionality
formsview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		formsWin.close();
	}
});

// for keeping track of the forms
var forms = [];

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
	if (chosen.fieldByName(options[z]) == 1)
	{
		var field = Ti.UI.createTextField({
			keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD,
			color: '#336699',
			hintText: options[z],
			height: 35,
			top: 10 + 45 * p,
			width: '100%',
		});
		forms.push(field);
		formsview.add(field);
		p++;
	}
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
		
		// update usage
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
		
		// update stats
		if (check1 == true && check2 == true)
		{
			args.db.execute('UPDATE stats SET weight = weight + ?', lifted);
		}
		
		// return to the muscle groups view
		formsWin.close();
		args.Win.close();
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
formsWin.open();
