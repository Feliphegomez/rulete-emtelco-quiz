//=========================================
// CLOUD PARALLAX - Robby leonardi http://www.rleonardi.com/tutorial-animation/
//=========================================


// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0;
var tempY = 0;

var objectArray = new Array();

fillObjectArray();
positionDivs();

function fillObjectArray()
{
	var cloud1 = document.getElementById("cloud-1");
	var cloud1X = 76;
	var cloud1Y = 264;
	var cloud1Factor = 0.01; //parallax shift factor, the bigger the value, the more it shift for parallax movement
	var cloud1Array = new Array();
	cloud1Array.push(cloud1, cloud1X, cloud1Y, cloud1Factor);
	objectArray.push(cloud1Array);

	var cloud2 = document.getElementById("cloud-2");
	var cloud2X = 738;
	var cloud2Y = 236;
	var cloud2Factor = 0.04;
	var cloud2Array = new Array();
	cloud2Array.push(cloud2, cloud2X, cloud2Y, cloud2Factor);
	objectArray.push(cloud2Array);

	var cloud3 = document.getElementById("cloud-3");
	var cloud3X = 866;
	var cloud3Y = 336;
	var cloud3Factor = 0.01;
	var cloud3Array = new Array();
	cloud3Array.push(cloud3, cloud3X, cloud3Y, cloud3Factor);
	objectArray.push(cloud3Array);

	var cloud4 = document.getElementById("cloud-4");
	var cloud4X = 266;
	var cloud4Y = 136;
	var cloud4Factor = 0.01;
	var cloud4Array = new Array();
	cloud4Array.push(cloud4, cloud4X, cloud4Y, cloud4Factor);
	objectArray.push(cloud4Array);
	
}

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e)
{
	  if (IE)
	  {
		// grab the x-y pos.s if browser is IE
		tempX = event.clientX + document.body.scrollLeft
		tempY = event.clientY + document.body.scrollTop
	  } 
	  else 
	  {
		// grab the x-y pos.s if browser is NS
		tempX = e.pageX
		tempY = e.pageY
	  }  
	  // catch possible negative values in NS4
	  if (tempX < 0){tempX = 0}
	  if (tempY < 0){tempY = 0}  
	  
	  moveDiv(tempX);
	  
	  return true
}

var windowWidth = $(window).width();

function moveDiv(tempX)
{	
	for (var i=0;i<objectArray.length;i++)
	{
		var yourDivPositionX = objectArray[i][3] * (0.5 * windowWidth - tempX) + objectArray[i][1];
		objectArray[i][0].style.left = yourDivPositionX + 'px';
	}
}

function positionDivs()
{
	for (var i=0;i<objectArray.length;i++)
	{
		objectArray[i][0].style.left = objectArray[i][1] + "px";
		objectArray[i][0].style.top = objectArray[i][2] + "px";
	}
}