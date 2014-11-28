$(document).ready(function(){
    // Drawing with the mouse

    loading = false;
    $(".sketch_button").on("click", function() {
        //console.log(loading);
        if(loading==false){
            loading = true;
            buttonAction(this);
        }
    });

    var bempala = ".sketch:not(#" + sketch_id + ")";
    $(bempala).hide();
    $("#" + sketch_id).show();

    loadSketch(sketch_id);
/*     $("#drawing > #erase").click(resetCanvas);
    $("#drawing > #slow").click(function(){redrawSlow(0);}); */

    $("#add_sketch").click(function(){
        //$("#formGamma").submit();

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
        $.post("/sketch/add_sketch/", {
            projectName: project_id
        }, function(data) {
            sketch_id = data;
            var y = "<button class='sketch_button' data-panelid=" + sketch_id + ">" + "bla" + "</button>";
            $("#sketch_bar").find("button:eq(-1)").after(y);
            var x = "<canvas id=" + sketch_id + " class='sketch' width='800' height='500'></canvas>"
            $("#classroom").find("canvas:eq(-1)").after(x);

            var bempala = ".sketch:not(#" + sketch_id + ")";
            $(bempala).hide();
            $("#" + sketch_id).show();

            $(".sketch_button").unbind();
            $(".sketch_button").on("click", function() {
                if(loading==false) {
                    loading = true;
                    buttonAction(this);
                }
            });

            loadSketch(sketch_id);

        });

    });

});

function buttonAction(e) {
    var panelId = $(e).attr("data-panelid");

    //var bempal = ".sketch:not(#" + panelId + ")";
    $(".sketch").hide();
    $("#" + panelId).show();

    sketch_id = panelId;

    loadSketch(sketch_id);

}