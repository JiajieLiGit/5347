$(document).ready(function(){

    $("#showProfileId").on('click', function() {
        console.log("showProfileId 进来了");
        $("#changePassword").css("display","none");
        $("#phoneList").css("display","none");
        $("#comment").css("display","none");
        $("#Editprofile").css("display","block"); 
    });
    $("#changePasswordId").on('click', function () {
        console.log("changePasswordId 进来了");
        $("#changePassword").css("display","block");
        $("#phoneList").css("display","none");
        $("#comment").css("display","none");
        $("#Editprofile").css("display","none");  
    });

    $("#showCommentId").on('click', function(){
        console.log("showCommentId 进来了");
        $("#comment").css("display","block");
        $("#phoneList").css("display","none");
        $("#Editprofile").css("display","none");  
        $("#changePassword").css("display","none");

    });
    $("#showPhoneListId").on('click', function(){
        console.log("showPhoneListId 进来了");
        $("#phoneList").css("display","block");
        $("#comment").css("display","none");
        $("#Editprofile").css("display","none");  
        $("#changePassword").css("display","none");

    });

    $("#editprofileBnt").on('click', function(){
        console.log("editprofileBnt 进来了");
        $("#myModal").css("display","block");
    });

    $("#modalCloseId").on('click',function(){
        $("#myModal").css("display","");
    });

    $(".close").on("click", function(){
        let myAnswerModalObj = document.getElementById("myModal");
        myAnswerModalObj.style.display = "";
    });

    $("#modalConfirmId").on('click', function(){
        password = $("#passwordInput").val();
        var parameter = {password:password};
        var jqxhr = $.post("/confirmPassword", parameter);
        jqxhr.done(function(result){
            console.log("加密后的密码:" + result );
            console.log("modalConfirm get success!");
            currentPassword = $("#passwordId").text();
            console.log(currentPassword );
            if(currentPassword == result){
                console.log("密码验证成功");
                for (let i = 0; i < $(".inputArea").length; i++){
                    console.log("解锁input");
                    $(".inputArea").eq(i).attr("disabled",false);
                }
                $("#myModal").css("display","");

                $("#editprofileBnt").css("display","none");
                $("#updateProfileBnt").css("display","block");

            }
        })
        jqxhr.fail(function(jqXHR) {
            console.log("modalConfirm get wrong!" + jqXHR.status);
        });
    

    })

    $("#updateProfileBnt").on('click', function(){
        userId = $("#userId").text();
        firstname = $("#firstname").val();
        lastname = $("#lastname").val();
        email = $("#email").val();
        var parameter = {firstname:firstname, lastname:lastname, email:email, userId:userId};
        var jqxhr = $.get("/updateProfile", parameter);
        jqxhr.done(function(result){
            console.log("更新成功");
            if(result == "1" ){
                $(location).attr('href','http://localhost:3000/showUserPage');
            }
        });

        jqxhr.fail(function(jqXHR) {
            console.log("modalConfirm get wrong!" + jqXHR.status);
        });
    
    });
    
    $("#passWordConfirm").on('click', function(){
        var currentPassword=$("#currentPassword").val();
        var newPassword=$("#newPassword").val();
    
        var parameter = {password:currentPassword};
        var jqxhr = $.post("/confirmPassword", parameter);
        jqxhr.done(function(result){
            console.log("加密后的密码:" + result );
            correctPassword = $("#passwordId").text();
            if(correctPassword == result) {
                console.log("验证成功");
                var parameter = {newPassword:newPassword};
                var jqxhr = $.post("/updatePassword", parameter);
                jqxhr.done(function(result){
                    console.log("updatePassword get ok!");
                    if(result=="1") {
                        alert("change success!");
                    }
                    else{
                        alert("change have errors!");
                    }
                });
                jqxhr.fail(function(jqXHR) {
                    console.log("updatePassword get wrong!" + jqXHR.status);
                });
            }else{
                alert("Please retype your password!");
            }
        })
        jqxhr.fail(function(jqXHR) {
            console.log("confirmPassword get wrong!" + jqXHR.status);
        });
    

    });

    $("#addNewPhone").on('click',function(){
        brand = $("#brand").val();
        title = $("#titleInput").val();
        stock = $("#stock").val();
        price =  $("#price").val();
        disabled = $("#disabled").prop('checked');
        console.log(brand);
        console.log(title);
        console.log(stock);
        console.log(price);
        console.log(disabled);
        if(brand=="" || title=="" || stock=="" || price==""){
            alert("Iuput cannot be Null");
            return;
        }
        seller = $("#userId").text();
        var parameter = {brand:brand, title:title, stock:stock, price:price, disabled:disabled, seller:seller};
        var jqxhr = $.get("/addPhoneList", parameter);
        jqxhr.done(function(result) {

            console.log("addPhoneList get ok!");
            if(result == "1"){
                $(location).attr('href','http://localhost:3000/showUserPage/2');
                //$( "#showPhoneListId" ).trigger( "click" );
            }else{
                alert("Add error");
            }
        });
        jqxhr.fail(function(jqXHR) {
            console.log("addPhoneList get wrong!" + jqXHR.status);
        });

    });

    $(".delete").on('click',function(){
        phoneID=$(this).parent().find("#phoneId").text();
        console.log(phoneID);
        var parameter = {phoneID:phoneID};
        var jqxhr = $.get("/deletePhoneList", parameter);
        jqxhr.done(function(result) {
            console.log("deletePhoneList get ok!");
            if(result == "1"){
                $(location).attr('href','http://localhost:3000/showUserPage/2');
                //$( "#showPhoneListId" ).trigger( "click" );
            }else{
                alert("delete error");
            }
        });
        jqxhr.fail(function(jqXHR) {
            console.log("deletePhoneList get wrong!" + jqXHR.status);
        });
    });

       $("#disabled").on('click',function(){
        phoneID=$(this).parent().find("#phoneId").text();
        console.log(phoneID);
        var parameter = {phoneID:phoneID};
        var jqxhr = $.get("/disabledPhoneList", parameter);
        jqxhr.done(function(result) {
            console.log("disabledPhoneList get ok!");
            if(result == "1"){
                $(location).attr('href','http://localhost:3000/showUserPage/2');
                //$( "#showPhoneListId" ).trigger( "click" );
            }else{
                alert("disabled error");
            }
        });
        jqxhr.fail(function(jqXHR) {
            console.log("disabledPhoneList get wrong!" + jqXHR.status);
        });
    });

    $("#enabled").on('click',function(){
        phoneID=$(this).parent().find("#phoneId").text();
        console.log(phoneID);
        var parameter = {phoneID:phoneID};
        var jqxhr = $.get("/enabledPhoneList", parameter);
        jqxhr.done(function(result) {
            console.log("enabledPhoneList get ok!");
            if(result == "1"){
                $(location).attr('href','http://localhost:3000/showUserPage/2');
                //$( "#showPhoneListId" ).trigger( "click" );
            }else{
                alert("enabled error");
            }
        });
        jqxhr.fail(function(jqXHR) {
            console.log("enabledPhoneList get wrong!" + jqXHR.status);
        });
    });

    //  $("#showCommentId").on('click',function(){

    // }

    autoEvent();

});

function autoEvent() {
    console.log("autoEvent 进来了");
    statusCode = $("#statusId").text();
    console.log(statusCode);
    if(statusCode == "2"){
        console.log("相等了");
        $("#showPhoneListId").trigger("click");
    }
}