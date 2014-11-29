$(document).ready(function(){
    $("#publishButton").click(function(){
		$("#formAlpha").submit();
	});

    $(".project_button").click(function(){
		var project_id = $(this).attr('id');
        $("#project_input").val(project_id);

        $("#formBeta").submit();

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
    context = redraw_start(clickMap, context);
}