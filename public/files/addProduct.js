$(document).ready(function () {

    $.getJSON('/internal/loggedIn', function (logged) {
        if (logged.loggedIn && logged.admin) {
            $(".add-product").show();
        } else {
            $(".add-product").hide();
        }
    });
});