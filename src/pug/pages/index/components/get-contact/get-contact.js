import $ from "jquery";

$(document).ready(() => {

    $('.get-contact__form').on(
        'submit',
        function (e) {
            e.preventDefault();

            let phoneIsValid = validatePhone(STATE.phone),
                connectIsValid = STATE.connect !== undefined;

            if (phoneIsValid && connectIsValid) {
                $('#getContact').removeClass('active');
                $('#results').removeClass('hidden');

                $('#header')
                    .removeClass('fixed visible')
                    .addClass('blocked');

                // Показываем секцию с результатми
                setTimeout(
                    () => {
                        $('#getContact').addClass('hidden');
                        $('#results').addClass('active');
                    },
                    100
                );

                setTimeout(
                    () => {
                        $('body,html').animate(
                            { scrollTop: $('#results').offset().top },
                            700
                        );
                    },
                    200
                )

                setTimeout(
                    () => $('#header').removeClass('blocked'),
                    1000
                );
            }
        }
    );
});