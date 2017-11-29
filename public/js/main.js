//AJAX https://github.com/bradtraversy/nodekb/blob/master/public/js/main.js
//Löscht Datensätze aus der Datenbank ohne die Seite neu zu laden--> asynchron
$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target = $(e.target);
        const id =$target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/articles/'+id,
            success: function(response){
                alert('Eintrag löschen?');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});