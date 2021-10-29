import $ from "jquery";

$(document).ready(() => {

    $('.get-contact__form').on(
        'submit',
        function (e) {
            e.preventDefault();

            let phoneIsValid = validatePhone(STATE.phone),
                error = $(e.target).find('.error');
                //connectIsValid = STATE.connect !== undefined;

            if (phoneIsValid) {

                let data = Object.assign({}, STATE);
                data.from = 'Форма захвата контактов';
                data.id = '#getContact';

                if (IS_DEBUGGING) {
                    console.log('Данные, отправляемые на сервер:', data);
                }

                let request = $.ajax({
                    method: 'post',
                    url: 'https://quiz24.ru/portfolio/houses_for_pets/send-post.php',
                    data: { json: JSON.stringify(data) },
                    dataType: 'json'
                });

                request.done(response => {
                    if (IS_DEBUGGING) console.log(response);
                    if (!response.error) changeSlide();
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log("Request failed: " + jqXHR + " --- " + textStatus);
                });
            } else {
                $(error).addClass('visible');
            }
        }
    );

    function changeSlide() {
        $('#results').removeClass('hidden').addClass('active');
        $('#getContact').addClass('collapsed');

        let top = $('#progressBar').offset().top,
            offset = $(window).width() < 768 ? 30 : 60;

        $('body,html').animate(
            { scrollTop: top - offset},
            900
        );
    }
});