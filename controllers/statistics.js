var args = arguments[0] || {};

// create a window and view
var Win = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Add Exercise'
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

View.add(label1);
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