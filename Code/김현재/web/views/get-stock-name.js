$("#get-name tr").click(function(){
    var tr = $(this);
    var td = tr.children();
    var name = td.eq(0).text();

    $("#select-stock").html(name);
})