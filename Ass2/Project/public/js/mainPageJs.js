$(document).ready(function(){
    readRangeId();
    $("#searchButtonId").on('click',searchButtomObjClickReaction);
    $("#rangeId").on('change',displayRangeValue);
    $("#brandSelectId").on('change', displayByBrand);
    //$(".oneResultRow").on('click', productRowClickReaction);
    $(".displayBox").on('click', function() {
        
        var parameter = {phoneID:  $(this).find(".phoneIdArea").text()}
        var jqxhr = $.get("/search/phoneDetails", parameter);
        jqxhr.done(function(result){
            $("#contentAreaId").html(result);
            console.log("productRowClickReaction get success!");
        })
        jqxhr.fail(function(jqXHR) {
            console.log("productRowClickReaction get wrong!" + jqXHR.status);
        });
    })

});


function searchButtomObjClickReaction() {
    
    var parameter = {partOfTitle: $("#searchInputId").val()};
    console.log(parameter);
    if($("#searchInputId").val()=="") {
        $("#searchInputId").css("border"," 2px solid red");
        return;
    }else{
        $("#searchInputId").css("border"," 0px");
        $("#filter").css("display","block");
    }
    var jqxhr = $.get("/search",parameter);
    jqxhr.done(function(result) {
        $("#contentAreaId").html(result);
        console.log("searchButtomObjClickReaction get success!");
    });
    jqxhr.fail(function(jqXHR) {
        console.log("searchButtomObjClickReaction get wrong!" + jqXHR.status);
    });
}

function readRangeId() {
    $("#rangeSlideValue").html( $("#rangeId").val() );
}
function displayRangeValue() {
   
    $("#rangeSlideValue").html( $("#rangeId").val() );
    var parameters =  { partOfTitle: $("#searchInputId").val(), brand: $("#brandSelectId").val(), price: $("#rangeId").val() };

    var jqxhr = $.get("/search/byFilter", parameters);
    
    jqxhr.done(function(result) {
        
        $("#contentAreaId").html(result); 
        console.log("Ranger filter get success!");
    });
    jqxhr.fail(function(jqXHR) {
        console.log("Ranger filter get wrong!" + jqXHR.status);
    });
}

function displayByBrand() {
   
    $("#rangeSlideValue").html( $("#rangeId").val() );
    var parameters =  { partOfTitle: $("#searchInputId").val(), brand: $("#brandSelectId").val()};

    var jqxhr = $.get("/search/byBrand", parameters);
    
    jqxhr.done(function(result) {
        
        $("#contentAreaId").html(result); 
        console.log("Brand filter get success!");
    });
    jqxhr.fail(function(jqXHR) {
        console.log("Brand filter get wrong!" + jqXHR.status);
    });
}