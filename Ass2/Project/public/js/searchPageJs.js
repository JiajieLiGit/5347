$(document).ready(function(){
    $(".oneResultRow").on('click', productRowClickReaction);

});

function productRowClickReaction() {
    $("#filter").css("display","none");
    var parameter = {phoneID:  $(this).find("#phoneIdArea").text()}
    var jqxhr = $.get("/search/phoneDetails", parameter);
    jqxhr.done(function(result){
        $("#contentAreaId").html(result);
        console.log("productRowClickReaction get success!");
    })
    jqxhr.fail(function(jqXHR) {
        console.log("productRowClickReaction get wrong!" + jqXHR.status);
    });

}