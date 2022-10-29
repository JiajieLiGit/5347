window.onload = function() {
    var url = document.location.toString();
    
    // var firstName = urlParams.get('firstName');
    // document.getElementsByName("firstName")[0].value = firstName;
    // var lastName = urlParams.get('lastName');
    // document.getElementsByName("lastName")[0].value = lastName;
    // var email = urlParams.get('email');
    // document.getElementsByName("email")[0].value = email;
    // var hashedPw = urlParams.get('hashedPw');
    // document.getElementsByName("hashedPw")[0].value = hashedPw;
    
    
    var arrUrl = url.split("//");
    var urlParams = arrUrl[1].split('/');

    document.getElementsByName("firstName")[0].value = urlParams[2];
    document.getElementsByName("lastName")[0].value = urlParams[3];
    document.getElementsByName("email")[0].value = urlParams[4];
    document.getElementsByName("hashedPw")[0].value = urlParams[5];
}