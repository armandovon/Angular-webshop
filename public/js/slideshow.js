/*
Bildspelet, hämtad från https://css-tricks.com/snippets/jquery/simple-auto-playing-slideshow/
*/
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
}, 3000);