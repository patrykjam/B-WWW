$(document).ready(function () {

    $.getJSON('/internal/loggedIn', function (logged) {
        if(logged.loggedIn){
            $(".container-register").hide();
        } else {
            $(".container-register").show();
        }
    });
});