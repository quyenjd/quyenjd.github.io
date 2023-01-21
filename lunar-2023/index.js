$(document).ready(function () {
    var $viewport = $('.viewport');
    var fadeTransitionDuration = 1000; // seconds
    var $window = $(window);

    $viewport.each(function (index, e) {
        $(e)
            .css('display', index ? 'none' : '').find('button')
            .click(function(evt) {
                evt.preventDefault();
                $(e).fadeOut(fadeTransitionDuration / 2, function() {
                    $viewport.eq(index + 1 >= $viewport.length ? 0 : index + 1).fadeIn(fadeTransitionDuration / 2);
                    $window.trigger('resize');
                });
            });
    });

    $window.resize(function () {
        $('#pinkboard')
            .attr('height', $window.height() + 'px')
            .attr('width', $window.width() + 'px');
    });
    $window.trigger('resize');
});