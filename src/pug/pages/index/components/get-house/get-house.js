import $ from "jquery";

$(document).ready(() => {
    $('#getHouseBtn').click(() => {
        let top = $('#progressBar').offset().top - 30;

        $('body,html')
            .animate({scrollTop: top}, 1000);
    });
});