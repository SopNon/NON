//$('#nav_acer>ul>li a').bind('mouseover',function(){
//    $('.acer-dropdown').css('display','block');
//});
//$('#nav_acer>ul>li').bind('mouseout',function(){
//    $('.acer-dropdown').css('display','none');
//});
$('.list-title').click(function(){
    if($(this).children('h4').children('span').html()=='-'){
        $(this).children('h4').children('span').html('+');
        $(this).nextAll('li').css('display','none');
    }else{
        $(this).children('h4').children('span').html('-');
        $(this).nextAll('li').css('display','block');
    }
})
