// get the database arguments that were passed in.
var args = arguments[0] || {};

// gets the type of graph (time, sets, reps, weight)
var typestr = args.type;

// gets name of exercise
var title = args.name;

// event listener for swipe functionality
$.chartWebView.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
		{
			nav.close();
		}
		else
		{
			$.graphmap.close();
		}
	}
});

// event listener for creating graph
$.chartWebView.addEventListener('load', function() {

 	var data = [];
 	var points = [];
 	var days = [];
 	
 	// get 14 most recent rows in workout_info where user did that exercise
 	var info = args.db.execute('select * from workout_info where exercise = ? ORDER by id ASC LIMIT 14', title);
 	
 	while(info.isValidRow())
 	{
		// get all cooresponding timestamps when user did exercise 
 		var infodays = args.db.execute('select * from workouts where id = ?', info.fieldByName('workout_id'));
 		if (infodays.isValidRow())
 		{
 			// puts value from info by graph category selected (reps, time, set, or weight) into points array
	 		points.push(info.fieldByName(typestr));
	 		
	 		// puts timestamp from infodays into days array
	 		days.push(infodays.fieldByName('timestamp'));
 		}
 		// advances to next row in info
 		info.next();
 	}
 	// makes y-axis the points for the graph
 	var data = "[{name: '";
 	data = data + typestr;
 	data = data + "', data: [";
 	for (i = 0; i < points.length; i++)
 	{
  		data = data + points[i];
  		if (i != points.length - 1)
 	 	{
 	 		data = data + ", ";
 		}
 	 }
 	 	data = data + "]}]";
 	 	
	// makes the x-axis categories for the graph
	var cat = "['";
	
 	for (k = 0; k < days.length; k++)
 	{
  		cat = cat + days[k];
  		if (k != days.length - 1)
 	 	{
 	 		cat = cat + "', '";
 		}
 	}
 	 	cat = cat + "']";
 	
 	// passes in title, categories, and points to graph as JSON object	
    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');


});

// if IOS creates navigation bar and makes graph window 
if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
{
	var nav = Titanium.UI.iOS.createNavigationWindow({
   		window: $.graphmap,
   		title: title,
	});
	
	// makes back button
	var back = Titanium.UI.createButton({title:'Back'});
	    $.graphmap.leftNavButton = back;
	    back.addEventListener('click', function()
	    {
	       nav.close();
	    });
	nav.open();
}
// if android it just opens the graph
else
{
	$.graphmap.open();
}
