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

$(document).ready(function(){
    $("#publishButton").click(function(){
		$("#formAlpha").submit();
	});

    $(".project_button").click(function(){
		var project_id = $(this).attr('id');
        $("#project_input").val(project_id);

        $("#formBeta").submit();

	});

    $(".delete_project").on("click", function(){
        var project = $(this).parent();
        var project_name = $(this).attr("data-panelid");


	$.ajaxSetup({
	     beforeSend: function(xhr, settings) {
	         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
	             // Only send the token to relative URLs i.e. locally.
	             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	         }
	     }
	});
        $.post("/sketch/delete_project/", {
            project_name: project_name
        }, function(data) {
            project.remove();
        });
    });

});

function prepareCanvasproject(clickMap, sketch_id){
    //var sketch_id = $(".sketch")[0].id;

    var canvas = $("#"+sketch_id)[0];
	//	alert('HEYORE'+sketch_id);
    var context = canvas.getContext("2d");
//	alert(clickMap[0]);
	
    // clearCanvas();
    //console.log(clickMap);
    redraw_start(clickMap, context);
}