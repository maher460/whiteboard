function loadSketch(sketch_id){
    /*$.ajaxSetup({
        beforeSend: function(xhr, settings) {
            // generate CSRF token using jQuery
            var csrftoken = $.cookie('csrftoken');
            if (!(/^http:.*//*.test(settings.url) || /^https:.*//*.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });*/
    $.post("/sketch/loadSketch/", {
        sketch_id: sketch_id
    }, function(data) {
        var result = data;
        //console.log(result);
        prepareCanvas(result);
    });

}

function saveSketch(sketch_id, clickMap){

    /*$.ajaxSetup({
        beforeSend: function(xhr, settings) {
            // generate CSRF token using jQuery
            var csrftoken = $.cookie('csrftoken');
            if (!(/^http:.*//*.test(settings.url) || /^https:.*//*.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });*/

    $.post("/sketch/saveSketch/", {
        sketch_id: sketch_id, clickMap: JSON.stringify(clickMap)
    }, function(data) {

    });

}

/*var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();*/
var paint = false;

var currentColor = "#000000";

function addClick(clickMap, x, y, dragging, color, user_id)
{
    //console.log(user_id in clickMap);
    if(user_id in clickMap){
        //console.log(user_id);
        clickMap[user_id][0].push(x);
        clickMap[user_id][1].push(y);
        clickMap[user_id][2].push(dragging);
        clickMap[user_id][3].push(color);
    }
    else{
        clickMap[user_id] = [[x],[y],[dragging],[color]];
    }

    return clickMap;
  
}

function prepareCanvas(clickMap){
    //var sketch_id = $(".sketch")[0].id;
    var canvas = $("#"+sketch_id)[0];
    var context = canvas.getContext("2d");
    // clearCanvas();
    //console.log(clickMap);
    context = redraw_start(clickMap, context);
	
	channel.onmessage = function(data, userid, latency) {

                    if(data=="clearCanvas"){
                        context = clearCanvas(context,canvas);
                    }

                    else{
                        //console.debug(userid, 'posted', data);
                        var z = JSON.parse(data);
                        //console.log(z[0]);
                        clickMap = addClick(clickMap, z[1],z[2],z[3],z[4], z[0]);
                        context = redraw(clickMap, context);
                        //console.log('latency:', latency, 'ms');
                    }


	
                };

      $(canvas).mousedown(function(e){
          var mouseX = e.pageX - this.offsetLeft;
          var mouseY = e.pageY - this.offsetTop;
      
          paint = true;
          clickMap = addClick(clickMap, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, currentColor, user_id);
          context = redraw(clickMap, context);
		  var jsonclicks = JSON.stringify([user_id, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, currentColor]);
		  setTimeout(function(){channel.send(jsonclicks);}, 0);
		  
    });

    $(canvas).mousemove(function(e){
      if(paint){
        clickMap = addClick(clickMap, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, currentColor, user_id);
        context = redraw(clickMap, context);
		var jsonclicks = JSON.stringify([user_id, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, currentColor]);
		setTimeout(function(){channel.send(jsonclicks);}, 0);
      }
    });

    $(canvas).mouseup(function(e){
      paint = false;
        saveSketch(sketch_id, clickMap);
    });

    $(canvas).mouseleave(function(e){
      paint = false;
        saveSketch(sketch_id, clickMap);
    });

    $("#erase_sketch").click(function(){

        /*z = z.split(" ")
        alert(z[0]);*/
        context = clearCanvas(context, canvas);
        clickMap = {};
        saveSketch(sketch_id,clickMap);
        setTimeout(function(){channel.send("clearCanvas");}, 0);

    })
}

function redraw(clickMap, context){
  //clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 5;
    for(var key in clickMap){
        var value = clickMap[key];
        var clickX = value[0];
        var clickY = value[1];
        var clickDrag = value[2];
        var clickColor = value[3];
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

    return context;

}

function redraw_start(clickMap, context){
  //clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 5;
    for(var key in clickMap){
        var value = clickMap[key];
        var clickX = value[0];
        var clickY = value[1];
        var clickDrag = value[2];
        var clickColor = value[3];

        for(var i=0; i < clickX.length; i++)
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

    return context;

}

/*
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

*/

function clearCanvas(context, canvas){
    context.clearRect(0, 0, canvas.width, canvas.height);
    return context
}

/*function resetCanvas()
{
    clickX=[];
    clickY=[];
    clickDrag=[];
    clearCanvas();
}*/
