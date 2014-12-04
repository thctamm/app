// get the arguments that were passed in.
var args = arguments[0] || {};

// for keeping track of the buttons you've created
var exercise_buttons = [];

// function for editing exercises view
function editExercises(exercises, second, third)
{
	var k = 0;
	
	// remove already existing buttons if any
	for (i = 0; i < exercise_buttons.length; i++)
	{
		exercisesview.remove(exercise_buttons[i]);
	}
	
	// create the buttons for the exercises and add them to the view
	while (exercises.isValidRow())
	{
		var button = $.UI.create('Button', {
		    top: 10 + k * 50,
		    title: exercises.fieldByName('name'),
		    id: 'button'
		});
		exercise_buttons.push(button);
		exercisesview.add(button);
		exercises.next();
		k++;
	}
	if (second.isValidRow() || third.isValidRow())
	{
		var sec_label = Titanium.UI.createLabel({
		    text:'Secondary exercises',
		    font: {
				fontSize: 20
			},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    color: 'black',
		    backgroundColor: '#C4C4C4',
		    left: '2%',
		    right: '2%',
		    top: 10 + k * 50,
		    height: 30
		});
		exercise_buttons.push(sec_label);
		exercisesview.add(sec_label);
	}
	if (typeof second != "undefined")
	{
		while (second.isValidRow())
		{
			var button = $.UI.create('Button', {
			    top: 50 + k * 50,
			    title: second.fieldByName('name'),
			    id: 'button'
			});
			exercise_buttons.push(button);
			exercisesview.add(button);
			second.next();
			k++;
		}
	}
	if (typeof third != "undefined")
	{
		while (third.isValidRow())
		{
			var button = $.UI.create('Button', {
			    top: 10 + k * 50,
			    title: third.fieldByName('name'),
			    id: 'button'
			});
			exercise_buttons.push(button);
			exercisesview.add(button);
			third.next();
			k++;
		}
	}
	
	// close the queryd info
	exercises.close();
	if (typeof second !== 'undefined')
	{
		second.close();
	}
	if (typeof third !== 'undefined')
	{
		third.close();
	}
	
	// add the exercises view to the window
	exercisesWin.add(exercisesview);
}

// create a window and view for muscle groups
var mainWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Muscle groups'
});

var groupview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%',
    height: '80%'
});

// event listener for swipe functionality
groupview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		mainWin.close();
	}
});

// create a window and view for exercises   
var exercisesWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
});

var exercisesview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});

// event listeners for when a exercise is selected
exercisesview.addEventListener('click', function(e) {
	if (e.source.title != null)
	{
		// open a forms window that is controleld by forms.js and give it necessary variables
		Alloy.createController('forms', {title: e.source.title, db: args.db, workout_id: args.workout_id, Win: exercisesWin}).getView;
	}
});

// event listener for swipe functionality
exercisesview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		exercisesWin.close();
	}
});

// get the muscle groups
var groups = args.db.execute('SELECT * FROM groups ORDER BY name COLLATE NOCASE ASC');
var i = 0;

// create the buttons for the muscle groups
while (groups.isValidRow())
{
	groupview.add($.UI.create('Button', {
	    top: 10 + i * 50,
	    title: groups.fieldByName('name'),
	    id: 'button'
	}));
	groups.next();
	i++;
}

// close the queryd info
groups.close();

// event listener for when a muscle group button is pressed
groupview.addEventListener('click', function (e) {
	// to make sure a blank area was not clicked
	if (e.source.title != null)
	{
		
		// change the title of the exercise win
		exercisesWin.setTitle(e.source.title);
		
		// get the relevant exercises from the database
		var exercises = args.db.execute("SELECT * FROM list where muscle_group = ? ORDER BY name COLLATE NOCASE ASC", e.source.title);
		var secondary = args.db.execute("SELECT * FROM list where second = ? ORDER BY name COLLATE NOCASE ASC", e.source.title);
		var tertiary = args.db.execute("SELECT * FROM list where third = ? ORDER BY name COLLATE NOCASE ASC", e.source.title);
		
		// edit the exercisesview and open the window
		editExercises(exercises, secondary, tertiary);
		exercisesWin.open();
	}
});

// a view for the end workout button in the bottom
var endview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    bottom:'0dp',
    width:'100%',
    height: '20%'
});

// button for ending a workout
var endBut = $.UI.create('Button', {
    bottom: '5%',
    height: '42.5%',
    font: {
		fontSize: 20
	},
    title: 'End Workout',
    id: 'botbutton'
});

endBut.addEventListener('click', function(e) {
	
	// fire a global event that index.js is listening for
	Ti.App.fireEvent('workout_ended');
	
	// close the window
	mainWin.close();
});

// button for favorite exercises
var favoritesBut = $.UI.create('Button', {
    top: '5%',
    height: '42.5%',
    left: '2%',
    width: '47%',
    font: {
		fontSize: 20
	},
    title: 'Favorites',
    id: 'botbutton'
});

favoritesBut.addEventListener('click', function(e) {
	
	// change the title of the exercise win
	exercisesWin.setTitle('Favorites');
	
	// get the relevant exercises from the database
	var exercises = args.db.execute("SELECT * FROM list where favorite = 1 ORDER BY name COLLATE NOCASE ASC");
	editExercises(exercises);
		
	// open the window
	exercisesWin.open();
});

// button for top exercises
var topBut = $.UI.create('Button', {
    top: '5%',
    height: '42.5%',
    right: '2%',
    width: '47%',
    font: {
		fontSize: 20
	},
    title: 'Most used',
    id: 'botbutton'
});

topBut.addEventListener('click', function(e) {
	
	// change the title of the exercise win
	exercisesWin.setTitle('Most used');

	// get the relevant exercises from the database
	var exercises = args.db.execute("SELECT * FROM list where used > 0 ORDER BY used DESC limit 15");
	editExercises(exercises);
	
	// open the winow
	exercisesWin.open();
});

// app event listener to check if favorites have been updated
Ti.App.addEventListener('favorites_updated', function(e){
	
	if (exercisesWin.getTitle() == 'Favorites')
	{
		// get the relevant exercises from the database
		var exercises = args.db.execute("SELECT * FROM list where favorite = 1 ORDER BY name COLLATE NOCASE ASC");
		editExercises(exercises);	
	}	
});

// add the buttons to the view
endview.add(endBut);
endview.add(favoritesBut);
endview.add(topBut);

// add the views to the main window and open it
mainWin.add(groupview);
mainWin.add(endview);
mainWin.open();

