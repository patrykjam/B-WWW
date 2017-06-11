function addRow(id, name) {
    var tr = $('<tr class="tr' + id + '"></tr>');
    var tdId = $('<td>' + id + '</td>');
    var tdName = $('<td>' + name + '</td>');
    var tdButton = $('<td>' +
        '<form id="form' + id + '" ' +
        ' method="post" onsubmit="return removeProduct(' + id + ')">' +
        '<button type="submit" class="btn btn-danger btn-block">X</button>' +
        '</form>' +
        '</td>');
    tr.append(tdId);
    tr.append(tdName);
    tr.append(tdButton);
    $(".tbody-remove-product").append(tr);

}


function removeProduct(pid) {
    console.log('Removing ' + pid);
    var url = "/internal/remove-product";
    var method = "POST";

    var postData = JSON.stringify({product_id: pid});
    var async = true;

    var request = new XMLHttpRequest();

    request.onload = function () {
    };

    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData.toString());
    $(".tr" + pid).remove();
    return false;
}

function getName(pid, products) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === pid)
            return products[i].name;
    }
}

$(document).ready(function () {
    $.getJSON('/internal/products', function (products) {
            if (products.length === 0)
                $(".table-remove-product").hide();
            else
                $(".table-remove-product").show();
            for (var i = 0; i < products.length; i++) {
                addRow(products[i].id, getName(products[i].id, products))
            }
    });
});