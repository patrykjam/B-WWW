addCommentFun = function (rowNumber, columnNumber, device) {
    console.log("Adding comment");
    var numOfKey = device + "num" + rowNumber + "_" + columnNumber;

    var keyname = device + "name" + rowNumber + "_" + columnNumber;
    var wartname = $("#name" + rowNumber + "_" + columnNumber).val();
    var keycomment = device + "com" + +rowNumber + "_" + columnNumber;
    var wartcomment = $("#comment" + rowNumber + "_" + columnNumber).val();

    addComment(wartcomment, wartname, rowNumber, columnNumber);
    if (typeof(Storage) !== "undefined") {
        // check num of comments stored
        var numOfV = localStorage.getItem(numOfKey);
        var numOf;
        if (numOfV === null) {
            numOfV = "0";
        }
        numOf = parseInt(numOfV);
        keyname += "_" + numOf;
        keycomment += "_" + numOf;
        numOf += 1;
        localStorage.setItem(numOfKey, numOf);
        localStorage.setItem(keyname, wartname);
        localStorage.setItem(keycomment, wartcomment);
    } else {
        console.log("No local storage access");
    }
    var form = document.getElementById("form" + rowNumber + "_" + columnNumber);
    form.reset();
    return false;
};

addComment = function (wartcomment, wartname, rowNumber, columnNumber) {
    var comment = $("<p></p>").text(wartcomment);
    var commentDiv = $("<div class='commentText'></div>");
    var author = $("<span class='sub-text'></span>").text(wartname);
    var li = $("<li></li>");

    commentDiv.append(comment);
    li.append(commentDiv);
    li.append(author);
    $(".commentList" + rowNumber + "_" + columnNumber).append(li);
};

goNext = function (carousel) {
    $(carousel).carousel("next");
};

function checkRow(rowNumber, device, j) {
    if (typeof(Storage) !== "undefined") {
        for (var i = 1; i <= j; i++) {
            var numOfKey = device + "num" + rowNumber + "_" + i;
            var numOfV = localStorage.getItem(numOfKey);
            if (numOfV !== null) {
                var numOf = parseInt(numOfV);
                // console.log("numof checkrow " + numOf);
                for (var q = 0; q < numOf; q++) {
                    var keyname = device + "name" + rowNumber + "_" + i + "_" + q;
                    var keycomment = device + "com" + rowNumber + "_" + i + "_" + q;
                    var vname = localStorage.getItem(keyname);
                    var vcomment = localStorage.getItem(keycomment);
                    addComment(vcomment, vname, rowNumber, i)
                }
            }
        }
    }
}


function addRow(rowNumber) {
    var txt = "<div class=\"row row" + rowNumber + "\"></div>";
    var row = $(txt);
    $(".container-products").append(row);
}

function addColumnWithElement(colSize, rowNumber, columnNumber, elementName, specs, width, height, device) { //+images
    var N = 8;
    var column = $("<div class=\"col-sm-" + colSize + " col" + columnNumber + "\"></div>");
    var name = $("<p></p>").text(elementName);
    if (arguments.length > 4) {
        var carouselA = $("<a href=\"#\" id=\"carLink" + rowNumber + "_" + columnNumber + "\"></a>");
        var slide = $("<div id=\"carousel" + rowNumber + "_" + columnNumber + "\" class='carousel slide' " +
            "data-ride='carousel' onclick=\"goNext('#carousel" + rowNumber + "_" + columnNumber + "')\" ></div>");
        var ol = $("<ol class=\"carousel-indicators\"></ol>");
        for (var i = N; i < arguments.length; i++) {
            var el = i - N;
            var li = "<li data-target=\"#myCarousel\" data-slide-to=\"" + el + "\"";
            if (el == 0) {
                li += " class=\"active\"></li>"
            } else {
                li += "></li>"
            }
            var elLi = $(li);
            ol.append(elLi)
        }
        var inner = $("<div class='carousel-inner'></div>");
        var itemSel, imageSRC, image;
        for (var j = N; j < arguments.length; j++) {
            var itemSelInside = "<div class=\"item";
            if (j == N) {
                itemSelInside += " active\"></div>"
            } else {
                itemSelInside += "\"></div>"
            }
            imageSRC = "<img src=\"" + arguments[j] + "\" " +
                "class='img-thumbnail' alt='Image' style='width:100%;height: " + height + "px;' '>";
            image = $(imageSRC);
            itemSel = $(itemSelInside);
            itemSel.append(image);
            inner.append(itemSel);
        }
        slide.append(ol);
        slide.append(inner);
    }
    carouselA.append(slide);
    column.append(name);
    column.append(carouselA);
//specs
    var specButton = $("<button type='button' class='btn btn-info btn-block' data-toggle='collapse' " +
        "data-target='#button" + rowNumber + "_" + columnNumber + "'></button>").text("Specyfikacja");

    var specificationSel = "<div id='button" + rowNumber + "_" + columnNumber + "' class='collapse'></div>";
    var specification = $(specificationSel);
    var specText = $('<pre></pre>').text(specs);
    var paragraph = $('<p></p>').append(specText);

    specification.append(paragraph);

    column.append(specButton);

    column.append(specification);

    //add comment box
    var commentBoxButton = $("<button type='button' class='btn btn-info btn-block' data-toggle='collapse' " +
        "data-target='#comments" + rowNumber + "_" + columnNumber + "'></button>").text("Komentarze");

    var commentListSel = "<div id='comments" + rowNumber + "_" + columnNumber + "' class='collapse'></div>";
    var commentList = $(commentListSel);

    var actionBox = $('<div class="actionBox"></div>');
    var ulListSel = "<ul class='commentList commentList" + rowNumber + "_" + columnNumber + "'></ul>";
    var ulList = $(ulListSel);

    actionBox.append(ulList);
    commentList.append(actionBox);


// add comment
    var addCommentButton = $("<button type='button' class='btn btn-info btn-block' data-toggle='collapse' " +
        "data-target='#addcomment" + rowNumber + "_" + columnNumber + "'></button>").text("Dodaj komentarz");

    var commentSel = "<div id='addcomment" + rowNumber + "_" + columnNumber + "' class='collapse'></div>";
    var comment = $(commentSel);

    var formSel = "<form id=\"form" + rowNumber + "_" + columnNumber + "\" " +
        "onsubmit=\"return addCommentFun(" + rowNumber + "," + columnNumber + "," + device + ")\"></form>";

    var form = $(formSel);

    var formGroup1 = $('<div class="form-group"></div>');
    var nameLabel = $('<label for="name"></label>').text("Imię:");
    var inputNameSel = "<input type=\"text\" class=\"form-control\" id=\"name" + rowNumber + "_" + columnNumber
        + "\" required>";
    var inputName = $(inputNameSel);

    var formGroup2 = $('<div class="form-group"></div>');
    var commentLabel = $('<label for="comment"></label>').text("Komentarz:");
    var textAreaSel = "<textarea class=\"form-control\" id=\"comment" + rowNumber + "_" + columnNumber
        + "\" required></textarea>";
    var textArea = $(textAreaSel);

    var submitButton = $('<button type="submit" class="btn btn-default btn-block"></button>').text("Dodaj komentarz");


    //basket button
    var addToBasketButton = $('<form id="form' + rowNumber + "and" + columnNumber + '" ' +
        ' method="post">' +
        '<button type="submit" class="btn btn-default">Add to basket</button>' +
        '</form>');

    formGroup1.append(nameLabel);
    formGroup1.append(inputName);

    formGroup2.append(commentLabel);
    formGroup2.append(textArea);
    formGroup2.append(submitButton);

    form.append(formGroup1);
    form.append(formGroup2);

    comment.append(form);

    specification.append(paragraph);

    column.append(specButton);

    column.append(specification);

    column.append(commentBoxButton);
    column.append(commentList);

    column.append(addCommentButton);
    column.append(comment);

    column.append(addToBasketButton);

    $(".row" + rowNumber).append(column);

    $("#carLink" + rowNumber + "_" + columnNumber).click(function (e) {
        console.log("Carlink" + rowNumber + "_" + columnNumber);
        e.preventDefault();
        e.stopPropagation();
    });

    $("#form" + rowNumber + "and" + columnNumber).submit(function(e) {
        e.preventDefault();
        console.log("logg");
        $.post("/addToBasket?name=" + elementName, function (receivedData) {
        });
    });
}