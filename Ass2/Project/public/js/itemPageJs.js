
currentIndex = 3;
$(document).ready(function(){
    ifLoadTopBar();
    hiddenComment();

    $(".showFullComment").on('click',function(){
        
        if($(this).parent().find("#shortCommentId").is(':visible')) {
            console.log("1111111")
            $(this).parent().find("#shortCommentId").css("display","none");
            $(this).parent().find("#fullCommentId").css("display","block");
        }else{
            console.log("2222222")
            $(this).parent().find("#shortCommentId").css("display","block");
            $(this).parent().find("#fullCommentId").css("display","none");
        }
        
        
    })

    $(".starImg").on('click', function(){
        console.log("huanxingxing");
        for (let i = 0; i <= 4; i++ ) {
            $(".starImg").eq(i).attr("src", "/phone_default_images/star.png");
        }
        for (let i = 0; i <= $(this).attr("value"); i++ ) {
            $(".starImg").eq(i).attr("src", "/phone_default_images/star_yellow.png");
        }
       
    })

    $("#moreThreeComments").on('click', displayMoreThreeComments);

   // $("#modalConfirmId").on('click',addToCart );

    $("#addToCartBntId").on('click',function(){
        console.log("modal打开了");
        $("#myModal").css("display","block");
    })
    $("#modalConfirmId").on('click',function(){
        currentBuyNumber =   parseInt($("#buyNumberInput").val());
        //availableStockNumer = parseInt( parseInt($("#stockId").text()) - parseInt($("#buy_number").text()) );
        availableStockNumer =  parseInt($("#stockId").text());
        if(currentBuyNumber > availableStockNumer){
            $("#modalBody").append( $("<p id='warningStatmentId' style='color:red;'> Inventory shortage! </p>") );
            //$("#warningStatmentId").css("color","red");
            $("#buyNumberInput").css("border-color","red");
            console.log("输入无效");

            return;
        }else{
            $("#warningStatmentId").css("display","none");
            $("#buyNumberInput").css("border","0.5px solid black");
            addToCart();
            $("#myModal").css("display","");
        }
        
    })
    $("#modalCloseId").on('click',function(){
        $("#myModal").css("display","");
    })
    $("#addCommentBntId").on('click',addOneComment);
    $(".close").on("click", function(){
        let myAnswerModalObj = document.getElementById("myModal");
        myAnswerModalObj.style.display = "";
    });

});

function refreshMaxBuyNumber() {
   // console.log(parseInt($("#stockId").text()) - parseInt($("#buy_number").text()) );
   console.log("库存:" + $("#stockId").text() );
   console.log("目前已经加购"+ $("#buy_number").text());
    //$("#buyNumberInput").attr("max", parseInt($("#stockId").text()) - parseInt($("#buy_number").text()) );
    $("#buyNumberInput").val( $("#buy_number").text());
    //console.log("可以购买数:"+ (parseInt($("#stockId").text()) - parseInt($("#buy_number").text())) );

    
}

function hiddenComment (){
    //设置购买上限;
    refreshMaxBuyNumber();

    for (let i = currentIndex; i < $(".oneReviewRow").length; i++) {
        $(".oneReviewRow").eq(i).css("display","none");
    }
}

function displayMoreThreeComments(){
    commentLength = $(".oneReviewRow").length;
   
    if ( currentIndex + 3 < commentLength) {
        for (var i = currentIndex; i < currentIndex + 3; i++) {
            $(".oneReviewRow").eq(i).css("display","block");
        }
        currentIndex += 3;
    }else {
        for (var i = currentIndex; i < commentLength; i++) {
            $(".oneReviewRow").eq(i).css("display","block");
        }
        currentIndex = commentLength - 1;
    }

   
}

function addToCart(){ 
    
    console.log("更新cart");
    //$("#buy_number").text($("#buyNumberInput").val());
 
    if($("#buyNumberInput").val() == "") {
        return;
    }
    //url = "/search/phoneDetails/" + $("#titleArea").text() + "/" + $("#buyNumberInput").val()+"/" + $("#phoneId").text() + "/" + $("#brandId").text() +"/"+$("#priceId").text();

    // title = req.body.title;
	// value = req.body.value;
	// phoneId = req.body.phoneId;
	// brand = req.body.brand;
	// price = req.body.price;
    var params = {title: $("#titleArea").text(),value:$("#buyNumberInput").val(),phoneId:$("#phoneId").text(), brand:$("#brandId").text(), price:$("#priceId").text()};
    var jqxhr = $.post("/showDetail/addCart",params);
    jqxhr.done(function(result){
        if(result == "") {
            $(location).attr("href","/login");
        }else{
            $("#buy_number").text(result);
            console.log("updateSession get success!");
            refreshMaxBuyNumber();
        }

    })
    jqxhr.fail(function(jqXHR) {
        console.log("updateSession get wrong!" + jqXHR.status);
    });
}

function ifLoadTopBar() {
    if( !$("*").hasClass('topBar') ) {
        //$(location).attr('href', '/');
        //$("#contentAreaId").css("display","none");
        var jqxhr = $.get("/renderTop/1");
        jqxhr.done(function(result){
            //$("*").prepend(result);
            $("#reloadTopBarAreaId").html(result);
            //console.log(result);
            $("#contentAreaId").empty();
            $("#contentAreaId").append($(".contentBox"));

            console.log("reloadTopBao get success!");
        })
        jqxhr.fail(function(jqXHR) {
            console.log("reloadTopBao get wrong!" + jqXHR.status);
        });
    }
    
}

function addOneComment() {

    rating = 0;
    for (let i= 0; i < $(".starImg").length; i++ ) {
        if($(".starImg").eq(i).attr("src") == "/phone_default_images/star_yellow.png"){
            rating++;
        }
    }
    phoneId = $("#phoneId").text();
   // phoneTitle = $("#titleArea").text();       
    comment = $("#yourCommentId").val();
    console.log(rating);
    console.log(comment);
    url = "/search/phoneDetails/" + rating +"/"+ comment +"/"+ phoneId;
    console.log(url);
    $(location).attr("href",url);

    
}