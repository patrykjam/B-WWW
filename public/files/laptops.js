var number_of_pcs;
var number_of_rows;
var current_row_count;
var current_col_count;
var current;
var data;

var scrollListener = function () {
    $(window).one("scroll", function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            switch (counter) {
                case 1:
                    addSecondColumn();
                    break;
                case 2:
                    addThirdColumn();
                    break;
                case 3:
                    addLastColumn();
                    break;
                default:
                    break;
            }
            console.log("Loaded " + counter);
        }
        if (counter < 4)
            scrollListener()
    });
};

var scrollListener = function () {
    $(window).one("scroll", function () { //unbinds itself every time it fires
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            addNextPC();
        }
        if(current <= number_of_pcs)
            scrollListener();
        else {
            console.log("Scroll over");
        }
    });
};


addNextPC = function () {
    console.log('Adding next');
    if (current > number_of_pcs) {
    }
    else {
        var row = Math.ceil(current / 4);
        if (current_row_count === row) {
            current_col_count += 1;

            if (data[current - 1].images.length === 1)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0]);
            if (data[current - 1].images.length === 2)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0], data[current - 1].images[1]);
            if (data[current - 1].images.length === 3)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1,
                    data[current - 1].images[0], data[current - 1].images[1], data[current - 1].images[2]);
            if (data[current - 1].images.length === 4)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0], data[current - 1].images[1],
                    data[current - 1].images[2], data[current - 1].images[3]);

            current += 1;
        } else {
            current_row_count += 1;
            current_col_count = 1;
            addRow(current_row_count);
            if (data[current - 1].images.length === 1)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0]);
            if (data[current - 1].images.length === 2)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0], data[current - 1].images[1]);
            if (data[current - 1].images.length === 3)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1,
                    data[current - 1].images[0], data[current - 1].images[1], data[current - 1].images[2]);
            if (data[current - 1].images.length === 4)
                addColumnWithElement(3, current_row_count, current_col_count, data[current - 1].name,
                    data[current - 1].specs, 350, 228, 1, data[current - 1].images[0], data[current - 1].images[1],
                    data[current - 1].images[2], data[current - 1].images[3]);
            current += 1;
        }
        if(current % 4 === 0){
            addNextPC();
        }
    }
};

$(document).ready(function () {

    $.getJSON('/internal/pcs', function (pcs) {
        number_of_pcs = pcs.length;
        number_of_rows = Math.ceil(number_of_pcs / 4);
        current = 1;
        current_row_count = 0;
        current_col_count = 1;
        data = pcs;


        while ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
            addNextPC();
        }
        scrollListener();

        $('.carousel').carousel({
            interval: false
        });
    });
});