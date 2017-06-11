var number_of_tvs;
var number_of_rows;
var current_row_count;
var current_col_count;
var current;
var data;

var scrollListener = function () {
    $(window).one("scroll", function () { //unbinds itself every time it fires
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            addNextTV();
        }
        if (current <= number_of_tvs)
            scrollListener();
        else {
        }
    });
};
addNextTV = function () {
    if (current > number_of_tvs) {
    }
    else {
        var row = Math.ceil(current / 2);
        if (current_row_count === row) {
            current_col_count += 1;

            if (data[current - 1].images.length === 1)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id, data[current - 1].images[0]);
            if (data[current - 1].images.length === 2)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id,
                    data[current - 1].images[0], data[current - 1].images[1]);
            if (data[current - 1].images.length === 3)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id,
                    data[current - 1].images[0], data[current - 1].images[1], data[current - 1].images[2]);
            if (data[current - 1].images.length === 4)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id, data[current - 1].images[0],
                    data[current - 1].images[1],
                    data[current - 1].images[2], data[current - 1].images[3]);

            current += 1;
        } else {
            current_row_count += 1;
            current_col_count = 1;
            addRow(current_row_count);
            if (data[current - 1].images.length === 1)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id, data[current - 1].images[0]);
            if (data[current - 1].images.length === 2)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id, data[current - 1].images[0], data[current - 1].images[1]);
            if (data[current - 1].images.length === 3)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id,
                    data[current - 1].images[0], data[current - 1].images[1], data[current - 1].images[2]);
            if (data[current - 1].images.length === 4)
                addColumnWithElement(6, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 700, 500, 2, data[current - 1].id, data[current - 1].images[0], data[current - 1].images[1],
                    data[current - 1].images[2], data[current - 1].images[3]);
            current += 1;
        }
        if (current % 2 === 0) {
            addNextTV();
        }
    }
};

$(document).ready(function () {

    $.getJSON('/internal/tvs', function (tvs) {
        number_of_tvs = tvs.length;
        number_of_rows = Math.ceil(number_of_tvs / 2);
        current = 1;
        current_row_count = 0;
        current_col_count = 1;
        data = tvs;


        while ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            addNextTV();
        }
        scrollListener();

        $('.carousel').carousel({
            interval: false
        });
    });
});