// get the database arguments that were passed in.
var args = arguments[0] || {};
// gets the type of graph (time, sets, reps, weight)
var typestr = args.type;

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

$.chartWebView.addEventListener('load', function() {
	Ti.API.info('chartWebView working');

 	var data = [];
 	var points = [];
 	var days = [];
 	
 	var info = args.db.execute('select * from workout_info where exercise = ?', title);
 
 	
 	Ti.API.info('DB Output:' +info.isValidRow());
 	
 	//stops running here
 	while(info.isValidRow())
 	{
 		var infodays = args.db.execute('select * from workouts where id = ?', info.fieldByName('workout_id'));
 		if (infodays.isValidRow())
 		{
	 		points.push(info.fieldByName(typestr));
	 		Ti.API.info("Point: " +info.fieldByName(typestr));
	 		
	 		days.push(infodays.fieldByName('timestamp'));
	 		Ti.API.info("Day: " +infodays.fieldByName('timestamp'));
 		}
 		info.next();
 	}
 	// makes the points for the graph
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
 	 	
    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');


});
if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad")
{
	var nav = Titanium.UI.iOS.createNavigationWindow({
   		window: $.graphmap,
   		title: title,
	});
	var back = Titanium.UI.createButton({title:'Back'});
	    $.graphmap.leftNavButton = back;
	    back.addEventListener('click', function()
	    {
	       nav.close();
	    });
	nav.open();
}
else
{
	$.graphmap.open();
}
