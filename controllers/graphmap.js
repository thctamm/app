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
 	
 	
 	/*var numbers = {
 		name: typestr,
 		x: points
 	};*/
 		
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
 	//data.push(numbers);
 	//numbers.push(data);
    //var cat = "['Day 1']";
    //var data = data1.stringifyObject();
    var cat = "['Day 1', 'Day 2', 'Day 3']";
	//Ti.API.info('Info:' +data);
	//alert(numbers);
	//alert(data.name);
	//var s1 = (+ '"' + data +'"');
	
	//var s1 = numbers;
	//var s1 = (+ '"[' + numbers.name + numbers.numbers + ']"');
	//data.push(s1);
	//alert(s1);
	alert(title);
	Ti.API.info('Info:' +data);
	//Ti.API.info('N:' +numbers);
	//Ti.API.info('Info:' +numbers.name);
	//Ti.API.info('Info:' +numbers.x);
	Ti.API.info('Info:' +cat);
	Ti.API.info('Info:' +title);
    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');


});

$.graphmap.open();
