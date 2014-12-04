// get the arguments that were passed in.
var args = arguments[0] || {};


$.chartWebView.addEventListener('load', function() {
	Ti.API.info('chartWebView ready');

	var title =args.name;
 	var data = "[{
            name: 'Data1',
            data: [150, 142, 138]
          },{
	            name: 'Data2',
	            data: [70,78,85]
	        }, {
	            name: 'Data3',
	            data: [121, 116, 101]
	        }]";
    var cat = "['6/25/2014', '6/26/2014', '6/27/2014']";

    $.chartWebView.evalJS('plotChart("'+title+'",'+cat+','+data+')');

});

$.graph.open();

