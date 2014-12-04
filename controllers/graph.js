// get the arguments that were passed in.
var args = arguments[0] || {};

// for keeping track of the buttons you've created
var exercise_buttons = [];

// function for editing exercises view
function editExercises(exercises)
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
	
	// close the queryd info
	exercises.close();
	
	// add the exercises view to the window
	exercisesWin.add(exercisesview);
}

// function for editing data view
function editData(data)
{
	var k = 0;
	
	if (setsBut != null)
	{
		dataview.remove(setsBut);
	}
	
	if (repsBut != null)
	{
		dataview.remove(repsBut);
	}
	
	if (weightBut != null)
	{
		dataview.remove(weightBut);
	}
	
	if (timeBut != null)
	{
		dataview.remove(timeBut);
	}
				
		
	if (data.isValidRow())
	{
		// create the buttons for the data and add them to the view
		if (data.fieldByName('sets') == 1)
		{
				var setsBut = $.UI.create('Button', {
		    	top: 20,
		    	title: 'Sets',
		    	id: 'button'
				});
				
				dataview.add(setsBut);
		
				setsBut.addEventListener('click', function(e) {
				var setsView = Alloy.createController('graphmap', {db:db.args, type: 'sets', name: data.fieldByName('name')}).getView();
				});
		}
		
		if (data.fieldByName('reps') == 1)
		{
				var repsBut = $.UI.create('Button', {
		    	top: 70,
		    	title: 'Reps',
		    	id: 'button'
				});
				
				dataview.add(repsBut);
		
				repsBut.addEventListener('click', function(e) {
				var repsView = Alloy.createController('graphmap', {db:db.args, type: 'reps', name: data.fieldByName('name')}).getView();
				});
		}
		
		if (data.fieldByName('time') == 1)
		{
				var timeBut = $.UI.create('Button', {
		    	top: 130,
		 	   	title: 'Time',
		    	id: 'button'
				});
				
				dataview.add(timeBut);
		
				setsBut.addEventListener('click', function(e) {
				var setsView = Alloy.createController('graphmap', {db:db.args, type: 'time', name: data.fieldByName('name')}).getView();
				});
		}
		
		if (data.fieldByName('weight') == 1)
		{
				var weightBut = $.UI.create('Button', {
		    	top: 20,
		    	title: 'Weight',
		    	id: 'button'
				});
				
				dataview.add(weightBut);
		
				weightBut.addEventListener('click', function(e) {
				var weightView = Alloy.createController('graphmap', {db:db.args, type: 'weight', name: data.fieldByName('name')}).getView();
				});
	
		}
	}
	// close the queryd info
	data.close();
	
	// add the exercises view to the window
	dataWin.add(dataview);
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
    height: '90%'
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

// create a window and view for data 
var dataWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
});

var dataview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});


// endview
var endview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    bottom:'0dp',
    width:'100%',
    height: '10%'
});



// event listener for swipe functionality
exercisesview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		exercisesWin.close();
	}
});

// event listener for  swipe funtionality
dataview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		dataWin.close();
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
		
		// edit the exercisesview and open the window
		editExercises(exercises);
		exercisesWin.open();
	}
});

// event listener for when an excercise button is clicked
exercisesview.addEventListener('click', function (e) {
	// to make sure a blank area was not clicked
	if (e.source.title != null)
	{
		
		// change the title of the exercise win
		dataWin.setTitle(e.source.title);
		
		// get the relevant exercises from the database
		var data = args.db.execute("SELECT * FROM list where name = ? ORDER BY name COLLATE NOCASE ASC", e.source.title);
		
		// edit the exercisesview and open the window
		editData(data);
		dataWin.open();
	}
});



// button for favorite exercises
var favoritesBut = $.UI.create('Button', {
    top: '10%',
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
    top: '10%',
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

endview.add(favoritesBut);
endview.add(topBut);

// add the views to the main window and open it
mainWin.add(groupview);
mainWin.open();
