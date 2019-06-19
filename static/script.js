// ADD A FADE TO THE BOTTOM OF LONG DESCRIPTIONS
let tasks = $('.index-description');
tasks.each((id,item) => {
    if($(item).height() >= 55){
        $(item).addClass('index-description-fade');
    }
});

// MAKES SURE CHECKBOXES ARE CHECKED CORRECTLY ON PAGE LOAD
let checkboxes = $('.checkBoxButton');
checkboxes.each((id,checkbox) => {
    if($(checkbox).attr("value") == 1){
        checkbox.checked = 1;
        $(checkbox).next().addClass('checkBoxActive');
        $(checkbox).next().removeClass('checkBox');
        $(checkbox).next().next().show();           // SHOW THE CHECK MARK
        // CROSS OUT THE TASK TEXT AND DESCRIPTION TEXT
        $(checkbox).parent().next().css('text-decoration','line-through');
        $(checkbox).parent().next().next().css('text-decoration','line-through');
    }
});

// FUNCTION THAT GIVES A BUTTON THE FUNCTIONALITY OF A CHECKBOX
$('ul.index-ul').on('click','li .checkBoxButton',function(){
    if(!this.checked){
        // BY DEFAULT, checked DOESN'T EXIST, SO IT WILL THROW FALSE
        this.checked = 1;
        $(this).next().addClass("checkBoxActive");
        $(this).next().removeClass("checkBox");
        $(this).next().next().show();           // SHOW THE CHECK MARK
        // CROSS OUT THE TASK TEXT AND DESCRIPTION TEXT
        $(this).parent().next().css('text-decoration','line-through');
        $(this).parent().next().next().css('text-decoration','line-through');
    } else {
        this.checked = 0;
        $(this).next().addClass("checkBox");
        $(this).next().removeClass("checkBoxActive");
        $(this).next().next().hide();           // HIDE THE CHECK MARK
        // REMOVE CROSS OUT ON THE TASK TEXT AND DESCRIPTION TEXT
        $(this).parent().next().css('text-decoration','none');
        $(this).parent().next().next().css('text-decoration','none');
    }
    
    // TELL THE SERVER TO UPDATE THE CHECKED STATE OF THE TO-DO ITEM
    $.get(`/checkbox`,{
        is_done: this.checked,
        id: $(this).parent().parent().attr("value")
    });
});
