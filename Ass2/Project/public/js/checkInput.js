function checkEmail() {
    var email = document.getElementsByName('email');
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!filter.test(email[0].value)) {
        alert('Please provide a valid email address');
        email[0].focus();
        return false;
    }
}

function checkPasswordSame() {
    var password = document.getElementsByName('password')[0].value;
    var confirmPassword = document.getElementsByName('passwordConfirm')[0].value;

    if (password != confirmPassword) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Passwords do NOT match';
    } else {
        document.getElementById('message').innerHTML = '';
    }
}