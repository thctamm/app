// get the arguments that were passed in.
var args = arguments[0] || {};
var typestr = args.type;
var title = args.name;

$.chartWebView.addEventListener('load', function() {
	Ti.API.info('chartWebView working');

 	var data = [];
 	var points = [];
 	var info = args.db.execute('select * from workout_info where exercise = ?', title);
 	
 	Ti.API.info('DB Output:' +info.isValidRow());
 	
 	//stops running here
 	while(info.isValidRow())
 	{
 		points.push(info.fieldByName(typestr));
 		Ti.API.info("Point: " +info.fieldByName(typestr));
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
	// two weeks for graph
    var cat = "['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14']";
	
    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');


});

$.graphmap.open();
