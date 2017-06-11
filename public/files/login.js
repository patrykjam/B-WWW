$(document).ready(function () {

    $.getJSON('/internal/loggedIn', function (logged) {
        if(logged.loggedIn){
            $(".container-login").hide();
        } else {
            $(".container-login").show();
        }
    });
});