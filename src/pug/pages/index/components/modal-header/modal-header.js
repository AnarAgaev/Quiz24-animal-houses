import $ from "jquery";

$(document).ready(() => {
    $('.modal-header-toggle')
        .toArray()
        .forEach(el => $(el).click(toggleModalHeader));

    function toggleModalHeader () {
        $('#modalHeader').toggleClass('visible');
    }
});