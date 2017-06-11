function addRowtoTable(id, name) {
    var tr = $('<tr class="tr' + id + '"></tr>');
    var tdId = $('<td>' + id + '</td>');
    var tdName = $('<td>' + name + '</td>');
    var tdButton = $('<td>' +
        '<form id="form' + id + '" ' +
        ' method="post" onsubmit="return removeFromBasket(' + id + ')">' +
        '<button type="submit" class="btn btn-danger btn-block">X</button>' +
        '</form>' +
        '</td>');
    tr.append(tdId);
    tr.append(tdName);
    tr.append(tdButton);
    $(".tbody-basket").append(tr);

}


function removeFromBasket(bid) {
    console.log('Removing ' + bid);
    var url = "/internal/remove-from-basket";
    var method = "POST";

    var postData = JSON.stringify({bid: bid});
    var async = true;

    var request = new XMLHttpRequest();

    request.onload = function () {
    };

    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData.toString());
    $(".tr" + bid).remove();
    return false;
}

function getName(pid, products) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === pid)
            return products[i].name;
    }
}

$(document).ready(function () {
    $.getJSON('/internal/get-basket', function (basket) {
        $.getJSON('/internal/products', function (products) {
            if (basket.length === 0)
                $(".table-basket").hide();
            else
                $(".table-basket").show();
            for (var i = 0; i < basket.length; i++) {
                addRowtoTable(basket[i].id, getName(basket[i].product_id, products))
            }
        });
    });
});