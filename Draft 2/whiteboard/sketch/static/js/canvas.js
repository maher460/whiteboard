var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var paint = false;

var currentColor = "#000000";

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currentColor);
  
}

function prepareCanvas(){
    canvas = $('#159410')[0];
    context = canvas.getContext("2d");
    // clearCanvas();
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    clickColor = new Array();
	
	channel.onmessage = function(data, userid, latency) {

					//console.debug(userid, 'posted', data);
					var z = JSON.parse(data);
					addClick(z[0],z[1],z[2]);
					redraw()
					//console.log('latency:', latency, 'ms');
	
                };

      $(canvas).mousedown(function(e){
          var mouseX = e.pageX - this.offsetLeft;
          var mouseY = e.pageY - this.offsetTop;
      
          paint = true;
          addClick(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top,false);
          redraw();
		  var jsonclicks = JSON.stringify([e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, currentColor]);
		  setTimeout(function(){channel.send(jsonclicks);}, 0);
		  
    });

    $(canvas).mousemove(function(e){
      if(paint){
        addClick(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        redraw();
		var jsonclicks = JSON.stringify([e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, currentColor]);
		setTimeout(function(){channel.send(jsonclicks);}, 0);
      }
    });

    $(canvas).mouseup(function(e){
      paint = false;
    });

    $(canvas).mouseleave(function(e){
      paint = false;
    });
}

function redraw(){
  //clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 5;
  if(clickX.length>2){var x = clickX.length - 2;}
  else{var x = 0;}
  for(var i=x; i < clickX.length; i++)
      {        
        if(clickDrag[i]){
                  context.beginPath();
                  context.moveTo(clickX[i-1], clickY[i-1]);
                  context.lineTo(clickX[i], clickY[i]);
                  context.closePath();
                  context.strokeStyle = clickColor[i];
                  context.stroke();
        }
      }
}

function redrawSlow(k){
    setTimeout(function(){
        partialRedraw(k);
        if (k<clickX.length) redrawSlow(k+1);
    },100);
}

function partialRedraw(k){
  clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 5;
  for(var i=0; i < clickX.length && i < k; i++)
      {        
        if(clickDrag[i]){
                  context.beginPath();
                  context.moveTo(clickX[i-1], clickY[i-1]);
                  context.lineTo(clickX[i], clickY[i]);
                  context.closePath();
                  context.strokeStyle = clickColor[i];
                  context.stroke();
        }
      }
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function resetCanvas()
{
    clickX=[];
    clickY=[];
    clickDrag=[];
    clearCanvas();
}