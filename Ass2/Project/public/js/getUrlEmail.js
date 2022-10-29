window.onload = function() {
    var url = document.location.toString();
    
    var arrUrl = url.split("//");
    var urlParams = arrUrl[1].split('/');

    document.getElementsByName("email")[0].value = urlParams[2];
    
}

