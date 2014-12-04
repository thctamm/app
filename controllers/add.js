/*
 * the code for the checkboxes is by Mitchell Amihod from:
 * http://developer.appcelerator.com/question/74921/switchbox-vs-checkbox
 * 
 */

var args = arguments[0] || {};

// create a window and view for adding   
var addWin = Titanium.UI.createWindow({
    backgroundColor: '#F2F2F2',
    layout:'vertical',
    title: 'Add Exercise'
});

var addView = Titanium.UI.createView({
	left: 0,
});

// event listener for swipe functionality
addView.addEventListener('swipe', function(e){
	if (e.direction == 'right')
	{
		addWin.close();
	}
});

// labels for checkboxes
var label2 = Titanium.UI.createLabel({
    text: 'Time',
    color: 'black',
    top: 90,
    height: 30,
    left: 10
});

var label3 = Titanium.UI.createLabel({
    text: 'Sets',
    color: 'black',
    top: 90,
    height: 30,
    left: 50
});

var label4 = Titanium.UI.createLabel({
    text: 'Reps',
    color: 'black',
    top: 90,
    height: 30,
    left: 90
});
var label5 = Titanium.UI.createLabel({
    text: 'Weight',
    color: 'black',
    top: 90,
    height: 30,
    left: 130
});

// create a dropdown list
var picker = Ti.UI.createPicker({
	top: 10, 
	height: 35,
	left: 10,
	backgroundColor: '#939393' 
});

// variables for tracking checkbox states
var time = 0;
var sets = 0;
var reps = 0;
var weight = 0;

// text field for exercise name
var nameField = Ti.UI.createTextField({
	color: '#336699',
	hintText: 'Exercise name',
	height: 35,
	top: 130,
	width: '100%',
});

var checkbox1 = Ti.UI.createButton({
title: '',
top: 55,
left: 10,
width: 30,
height: 30,
borderColor: '#666',
borderWidth: 2,
borderRadius: 3,
backgroundColor: '#aaa',
color: '#fff',
font:{fontSize: 25, fontWeight: 'bold'},
value: false //value is a custom property in this casehere.
});

// sets checkbox
var checkbox2 = Ti.UI.createButton({
title: '',
top: 55,
left: 50,
width: 30,
height: 30,
borderColor: '#666',
borderWidth: 2,
borderRadius: 3,
backgroundColor: '#aaa',
color: '#fff',
font:{fontSize: 25, fontWeight: 'bold'},
value: false //value is a custom property in this casehere.
});

// reps checkbox
var checkbox3 = Ti.UI.createButton({
title: '',
top: 55,
left: 90,
width: 30,
height: 30,
borderColor: '#666',
borderWidth: 2,
borderRadius: 3,
backgroundColor: '#aaa',
color: '#fff',
font:{fontSize: 25, fontWeight: 'bold'},
value: false //value is a custom property in this casehere.
});

// weight checkbox
var checkbox4 = Ti.UI.createButton({
title: '',
top: 55,
left: 130,
width: 30,
height: 30,
borderColor: '#666',
borderWidth: 2,
borderRadius: 3,
backgroundColor: '#aaa',
color: '#fff',
font:{fontSize: 25, fontWeight: 'bold'},
value: false //value is a custom property in this casehere.
});

//change checkbox heights for ios
if (Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad") 
{
		checkbox1.setHeight(200);
		checkbox2.setHeight(200);
		checkbox3.setHeight(200);
		checkbox4.setHeight(200);
		label1.setHeight(260);
		label2.setHeight(260);
		label3.setHeight(260);
		label4.setHeight(260);
		namefield.setHeight(300);
}

//Attach some simple on/off actions
checkbox1.on = function() {
    this.backgroundColor = '#007690';
    this.title='\u2713';
    this.value = true;
};
 
checkbox1.off = function() {
    this.backgroundColor = '#aaa';
    this.title='';
    this.value = false;
};
 
checkbox1.addEventListener('click', function(e) {
    if(false == e.source.value) {
        e.source.on();
        time = 1;
    } else {
        e.source.off();
        time = 0;
    }
});
 
//Attach some simple on/off actions
checkbox2.on = function() {
    this.backgroundColor = '#007690';
    this.title='\u2713';
    this.value = true;
};
 
checkbox2.off = function() {
    this.backgroundColor = '#aaa';
    this.title='';
    this.value = false;
};
 
checkbox2.addEventListener('click', function(e) {
    if(false == e.source.value) {
        e.source.on();
        sets = 1;
    } else {
        e.source.off();
        sets = 0;
    }
});



//Attach some simple on/off actions
checkbox3.on = function() {
    this.backgroundColor = '#007690';
    this.title='\u2713';
    this.value = true;
};
 
checkbox3.off = function() {
    this.backgroundColor = '#aaa';
    this.title='';
    this.value = false;
};
 
checkbox3.addEventListener('click', function(e) {
    if(false == e.source.value) {
        e.source.on();
        reps = 1;
    } else {
        e.source.off();
        reps = 0;
    }
});

 
//Attach some simple on/off actions
checkbox4.on = function() {
    this.backgroundColor = '#007690';
    this.title='\u2713';
    this.value = true;
};
 
checkbox4.off = function() {
    this.backgroundColor = '#aaa';
    this.title='';
    this.value = false;
};
 
checkbox4.addEventListener('click', function(e) {
    if(false == e.source.value) {
        e.source.on();
        weight = 1;
    } else {
        e.source.off();
        weight = 0;
    }
});

groupsdata = [];

// make a hint for the drop-down menu
var row = Ti.UI.createPickerRow({title: 'Muscle Group'});
groupsdata.push(row);

// get the muscle groups
var groups = args.db.execute('SELECT * FROM groups ORDER BY name COLLATE NOCASE ASC');

// add muscle groups to drop-down list
while (groups.isValidRow())
{
	row = Ti.UI.createPickerRow({title: groups.fieldByName('name')});
	groupsdata.push(row);
	groups.next();
}

// close the queryd info
groups.close();

// create a submit button
var submit = $.UI.create('Button', {
   bottom: 10,
   title: 'Submit',
   id: "botbutton"
});

// add an event listener for the submit button
submit.addEventListener('click', function (e) {
	
	// check if name field has been filled
	var not_filled = false;
	if (nameField.getValue() == '')
	{
		not_filled = true;
	}
	
	// check if muscle group has been chosen
	if (picker.getSelectedRow(0).title == 'Muscle Group')
	{
		not_filled = true;
	}
		
	// if all forms have been filled
	if (not_filled == false)
	{
		
		// dynamically create the query for adding an exercise
		var query = "INSERT INTO list (name, muscle_group, sets, reps, time, weight) VALUES (";
		query = query.concat("'" + nameField.getValue() + "', ");
		query = query.concat("'" + picker.getSelectedRow(0).title + "', ");
		query = query.concat(sets);
		query = query.concat(", ");
		query = query.concat(reps);
		query = query.concat(", ");
		query = query.concat(time);
		query = query.concat(", ");
		query = query.concat(weight);
		query = query.concat(")");
		
		// run the query
		args.db.execute(query);
		
		// return to the main view
		addWin.close();
	}
	
	// if fields haven't been filled alert the user
	else
	{
		alert('All fields have not been filled');
	}
});

picker.add(groupsdata);
addView.add(picker);
addView.add(checkbox1);
addView.add(checkbox2);
addView.add(checkbox3);
addView.add(checkbox4);
addView.add(label2);
addView.add(label3);
addView.add(label4);
addView.add(label5);
addView.add(nameField);
addView.add(submit);
addWin.add(addView);
addWin.open();
