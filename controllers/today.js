/**
 * @author Sofia Shapiro
 */
// create a window and view for today's exercises
var pastWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Past exercises'
});

var pastview = Titanium.UI.createScrollView({
    scrollType:"vertical",
    left:'0dp',
    width:'100%'
});

// event listener for swipe functionality
pastview.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		pastWin.close();
	}
});