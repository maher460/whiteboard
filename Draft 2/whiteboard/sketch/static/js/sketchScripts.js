$(document).ready(function(){
    // Drawing with the mouse
    loadSketch(sketch_id);
/*     $("#drawing > #erase").click(resetCanvas);
    $("#drawing > #slow").click(function(){redrawSlow(0);}); */

    $("#add_sketch").click(function(){
        $("#formGamma").submit();
    });

});