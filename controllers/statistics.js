var args = arguments[0] || {};

// create a window and view
var Win = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Statistics'
});

var View = Titanium.UI.createView({
	left: 0,
});

var total_weight = 0;
var total_workouts = 0;

var data = args.db.execute('SELECT * FROM stats');

if (data.isValidRow())
{
	total_weight = data.fieldByName('weight');
	total_workouts = data.fieldByName('workouts');
}

var label1 = Titanium.UI.createLabel({
    text:'Total weight lifted: ' + total_weight,
    color: 'black',
    left: 10,
    top: 10,
    height: 30
});

var label2 = Titanium.UI.createLabel({
    text:'Total number of workouts: ' + total_workouts,
    color: 'black',
    left: 10,
    top: 50,
    height: 30
});

var most_used = args.db.execute('SELECT * FROM list where used > 0 ORDER BY used DESC LIMIT 1');

if (most_used.isValidRow())
{
	var label3 = Titanium.UI.createLabel({
	    text:'Most used exercise: ' + most_used.fieldByName('name') + ', ' + most_used.fieldByName('used') + ' times',
	    color: 'black',
	    left: 10,
	    top: 90,
	    height: 30
	});	
	View.add(label3);
}

View.add(label1);
View.add(label2);
Win.add(View);

if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
{
	var nav = Titanium.UI.iOS.createNavigationWindow({
   		window: Win,
   		title: "Statistics"
	});
	var back = Titanium.UI.createButton({title:'Back'});
	    Win.leftNavButton = back;
	    back.addEventListener('click', function()
	    {
	       nav.close();
	    });
	nav.open();
}
else
{
	Win.open();
}