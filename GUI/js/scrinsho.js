function takeScreenshot (){
    $.ajax({
        type: 'POST',
        url: "../python shit/takeScreenshot.py",
        success: function(response){
        output = response;
        alert(output);
        }
    }).done(function(){
    console.log("asd");
    alert();
    });
}