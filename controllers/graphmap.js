// get the arguments that were passed in.
var args = arguments[0] || {};
var typestr = args.type;
var title = args.name;

$.chartWebView.addEventListener('load', function() {
	Ti.API.info('chartWebView working');

 	var numbers = [];
 	var points = [];
 	var info = args.db.execute('select * from workout_info where exercise = ?', title);
 	
 	Ti.API.info('DB Output:' +info.isValidRow());
 	
 	//stops running here
 	if(info.isValidRow())
 	{
 		points.push(info.fieldByName(typestr));
 		Ti.API.info("Point: " +info.fieldByName(typestr));
 	}
 	
 	var data = {
 		name: typestr,
 		numbers: points
 	};
 	//numbers.push(data);
    var cat = "['Day 1']";
    //var cat = "['Day 1', 'Day 2', 'Day 3']";
	//Ti.API.info('Info:' +data);
	alert(data);
	alert(data.numbers);
	alert(data.name);
	alert(title);
	
	Ti.API.info('Info:' +data.numbers);
	Ti.API.info('Info:' +data.name);
	Ti.API.info('Info:' +cat);
	Ti.API.info('Info:' +title);
    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');

});

$.graphmap.open();

