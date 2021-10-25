import $ from "jquery";

$(document).ready(() => {
    let scrollCounter = 0,
        scrollDirection = 0;

    $(window).scroll(() => {
        let scrollTop = $(document).scrollTop(),
            direction = scrollTop > scrollDirection;

        scrollDirection = scrollTop;

        if (scrollTop > 100) {
            $('#header').addClass('fixed');
        } else {
            $('#header').removeClass('fixed');
        }

        if (scrollTop < 400) {
            $('#header').removeClass('visible');
        }

        if (direction) {
            scrollCounter = scrollTop;
            $('#header').removeClass('visible');
        } else {
            if (scrollTop < scrollCounter - 100) {
                $('#header').addClass('visible');
            }
        }
    });
});

