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