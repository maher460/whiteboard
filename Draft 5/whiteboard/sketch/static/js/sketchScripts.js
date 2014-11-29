
$(document).ready(function(){
    // Drawing with the mouse

    loading = false;
    /*$(".sketch_button").on("click", function() {
        //console.log(loading);
        if(loading==false){
            loading = true;
            buttonAction(this);
        }
    });*/
    $("#controls1").on("click", function(){
        if(loading==false){
            if ($("canvas#" + sketch_id).prev().length > 0){
                sketch_id=$("canvas#" + sketch_id).prev().attr('id');
            }
            else{
                sketch_id = $("#classroom").find("canvas:eq(-1)").attr('id');
            }
            loading=true;
            $(".sketch").hide();
            $("#" + sketch_id).show();
            loadSketch(sketch_id);
        }

    });

    $("#controls2").on("click", function(){
        if(loading==false){
            if ($("canvas#" + sketch_id).next().length > 0){
                sketch_id=$("canvas#" + sketch_id).next().attr('id');
            }
            else{
                sketch_id = $("#classroom").find("canvas:eq(0)").attr('id');
            }
            loading=true;
            $(".sketch").hide();
            $("#" + sketch_id).show();
            loadSketch(sketch_id);
        }

    });

    var bempala = ".sketch:not(#" + sketch_id + ")";
    $(bempala).hide();
    $("#" + sketch_id).show();

    loading=true;
    loadSketch(sketch_id);

	/*var w=screen.width;
	var h=screen.height-145;
	$('#classroom').append('<canvas id="'+sketch_id+'" class="sketch" width="'+w+'" height="'+h+'" > </canvas>');*/
/*     $("#drawing > #erase").click(resetCanvas);
    $("#drawing > #slow").click(function(){redrawSlow(0);}); */

    $("#add_sketch").click(function(){
        //$("#formGamma").submit();


		$.ajaxSetup({ 
			     beforeSend: function(xhr, settings) {
			         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
			             // Only send the token to relative URLs i.e. locally.
			             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
			         }
			     } 
			});
        $.post("/sketch/add_sketch/", {
            projectName: project_id
        }, function(data) {
            sketch_id = data;

            var x = "<canvas id=" + sketch_id + " class='sketch' width='800' height='500'></canvas>"
            $("#classroom").find("canvas:eq(-1)").after(x);

            var bempala = ".sketch:not(#" + sketch_id + ")";
            $(bempala).hide();
            $("#" + sketch_id).show();

           /* $(".sketch_button").unbind();
            $(".sketch_button").on("click", function() {
                if(loading==false) {
                    loading = true;
                    buttonAction(this);
                }
            });*/
            setTimeout(function(){channel.send("addSketch_" + sketch_id);}, 0);
            loading=true;
            loadSketch(sketch_id);

        });

    });

    /*window.addEventListener('resize', function(){

        canvas = $("#"+sketch_id)[0];
        canvas.width = window.innerWidth;
        canvas.height = screen.height;
        loadSketch(sketch_id);

    });*/

});



/*function resizeCanvas() {
				htmlCanvas.width = window.innerWidth;
				htmlCanvas.height = window.innerHeight;
				redraw();
			}*/

/*
function buttonAction(e) {
    var panelId = $(e).attr("data-panelid");

    //var bempal = ".sketch:not(#" + panelId + ")";
    $(".sketch").hide();
    $("#" + panelId).show();

    sketch_id = panelId;

    loadSketch(sketch_id);

}*/
