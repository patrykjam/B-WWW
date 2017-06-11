$(document).ready(function () {

    $.getJSON('/internal/loggedIn', function (logged) {
        if(logged.loggedIn && logged.admin){
            $(".adminPanel").show();
        } else {
            $(".adminPanel").hide();

        }
    });
});