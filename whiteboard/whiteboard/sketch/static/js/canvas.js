function getCookie(name)
	{
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?

	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}

function loadSketch(sketch_id){

	$.ajaxSetup({
	     beforeSend: function(xhr, settings) {
	         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
	             // Only send the token to relative URLs i.e. locally.
	             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	         }
	     }
	});
    $.post("/sketch/loadSketch/", {
        sketch_id: sketch_id
    }, function(data) {
        var result = data;
        //console.log(result);
        prepareCanvas(result);
        loading = false;
    });

}

function saveSketch(sketch_id, clickMap){

    $.ajaxSetup({
	     beforeSend: function(xhr, settings) {
	         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
	             // Only send the token to relative URLs i.e. locally.
	             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	         }
	     }
	});

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
var redrawing = false;
var currentColor = "#000000";
var backup_id = "";
var backup_color = "";

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
    canvas.width = screen.width;
    canvas.height = screen.height;
    var context = canvas.getContext("2d");
	
    // clearCanvas();
    //console.log(clickMap);
    context = redraw_start(clickMap, context);

    if(clickMap[user_id]!=undefined){
        if(clickMap[user_id][3]){
            currentColor = clickMap[user_id][3][0];
        }
        else{
            if(currentColor == "#000000"){
                currentColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            }

        }
    }
    else{
          if(currentColor == "#000000"){
                currentColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
          }
    }
	
	channel.onmessage = function(data, userid, latency) {

                    if(data=="clearCanvas"){
                        clickMap = {};
                        context = clearCanvas(context,canvas);
                    }

                    else if(data=="clear_highlighter"){
                        setTimeout(function(){

                            delete clickMap['highlighter'];
                            context = clearCanvas(context,canvas);
                            context = redraw_start(clickMap,context);

                        }, 5000);
                    }

                    else if(data.split("_")[0]=="addSketch"){
                        var nsketch_id = data.split("_")[1];

                        var x = "<canvas id=" + nsketch_id + " class='sketch' width='800' height='500'></canvas>"
                        $("#classroom").find("canvas:eq(-1)").after(x);
                    }

                    else{
                        //console.debug(userid, 'posted', data);
                        var z = JSON.parse(data);
                        //console.log(z[0]);
                        if(z[5]==sketch_id){
                            clickMap = addClick(clickMap, z[1],z[2],z[3],z[4], z[0]);
                            context = redraw(clickMap, context);
                        }

                        //console.log('latency:', latency, 'ms');
                    }


	
                };

      $(canvas).mousedown(function(e){
          if(redrawing==false){
              var mouseX = e.pageX - this.offsetLeft;
              var mouseY = e.pageY - this.offsetTop;

              paint = true;
              clickMap = addClick(clickMap, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, currentColor, user_id);
              context = redraw(clickMap, context);
              var jsonclicks = JSON.stringify([user_id, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false, currentColor, sketch_id]);
              setTimeout(function(){channel.send(jsonclicks);}, 0);
          }


    });

    $(canvas).mousemove(function(e){
      if(paint && redrawing==false){
        clickMap = addClick(clickMap, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, currentColor, user_id);
        context = redraw(clickMap, context);
		var jsonclicks = JSON.stringify([user_id, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true, currentColor, sketch_id]);
		setTimeout(function(){channel.send(jsonclicks);}, 0);
      }
    });

    $(canvas).mouseup(function(e){
        if(redrawing==false){
        paint = false;
        saveSketch(sketch_id, clickMap);
        }

    });

    /*$(canvas).mouseleave(function(e){
      paint = false;
        saveSketch(sketch_id, clickMap);
    });*/

    $("#erase_sketch").click(function(){
        if(redrawing == false){
            /*z = z.split(" ")
            alert(z[0]);*/
            context = clearCanvas(context, canvas);
            clickMap = {};
            saveSketch(sketch_id,clickMap);
            setTimeout(function(){channel.send("clearCanvas");}, 0);
        }


    });

    $("#redraw_slow").click(function(){

        var m = 0;
        for(var key in clickMap){
            var value = clickMap[key];
            if(value[0].length>m) m = value[0].length;
        }

        context = clearCanvas(context, canvas);
        context = redrawSlow(0, m, context,clickMap);

    });

    /*$('#myonoffswitch').on('change', function() {
        if ($(this).is(':checked')) {
             //alert("ON");
            backup_id = user_id;
            user_id = "highlighter";
            backup_color = currentColor;
            currentColor = "#D6FF8F";

        } else {
             //alert("OFF");
            setTimeout(function(){channel.send("clear_highlighter");}, 0);
            user_id = backup_id;
            currentColor = backup_color;
            setTimeout(function(){

                delete clickMap['highlighter'];
                context = clearCanvas(context,canvas);
                context = redraw_start(clickMap,context);
                saveSketch(sketch_id,clickMap);

            }, 5000);


        }
    });*/
    $('#blah').click(function() {
		$(this).addClass('active');
        backup_id = user_id;
        user_id = "highlighter";
        backup_color = currentColor;
        currentColor = "#D6FF8F";
		setTimeout(function(){
			$('#blah').removeClass('active')
            setTimeout(function(){channel.send("clear_highlighter");}, 0);
            user_id = backup_id;
            currentColor = backup_color;
            setTimeout(function(){

                delete clickMap['highlighter'];
                context = clearCanvas(context,canvas);
                context = redraw_start(clickMap,context);
                saveSketch(sketch_id,clickMap);

            }, 5000);
            
	    }, 5000);
	});


}

function redraw(clickMap, context){
  //clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 10;

    for(var key in clickMap){
        if(key=="highlighter"){
            context.lineWidth = 20;
        }
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
  context.lineWidth = 10;
    for(var key in clickMap){
        var value = clickMap[key];
        var clickX = value[0];
        var clickY = value[1];
        var clickDrag = value[2];
        var clickColor = value[3];
//		alert(clickColor);

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


function redrawSlow(k, m, context, clickMap){
    //console.log("recursion!");
    redrawing=true;
    setTimeout(function(){
        context = redraw_slow(k, context, clickMap);
        if(k<m){
            context = redrawSlow(k+1, m, context, clickMap);
        }
        else{
            redrawing=false;
        }

    },50);
    return context;
}

function redraw_slow(k, context, clickMap){
  //clearCanvas();
  context.lineJoin = "round";
  context.lineWidth = 10;
    for(var key in clickMap){
        var value = clickMap[key];
        var clickX = value[0];
        var clickY = value[1];
        var clickDrag = value[2];
        var clickColor = value[3];

        if(k>1){var x = k - 2;}
        else{var x = 0;}

        for(var i=x; i < clickX.length && i<k; i++)
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

/*function partialRedraw(k){
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
}*/



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
