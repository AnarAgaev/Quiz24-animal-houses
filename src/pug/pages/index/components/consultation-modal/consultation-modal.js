import $ from "jquery";
import IMask from 'imask';

$(document).ready(() => {
    // Показываем модальное окно
    $('.consultation-show-btn').click(showConsultationModal);

    // Скрываем модальное окно
    $('.consultation-modal__close')
        .toArray()
        .forEach(el => $(el).click(hideConsultationModal));

    // Скрываем модальное окно по клику вне модалки
    $('.consultation-modal').click(function (e) {
        if ( $(e.target).hasClass('consultation-modal')) {
            hideConsultationModal();
        }
    });

    function showConsultationModal() {
        $('#modalHeader').removeClass('visible');
        $('#consultationModal').addClass('visible');
        $('body').addClass('modal-open');
        $('#header').removeClass('visible');

        setTimeout(
            () =>  $('#consultationModalDialog')
                .removeClass('invisible'),
            300);
    }

    function hideConsultationModal() {
        $('#consultationModalDialog').addClass('invisible');
        $('#consultationModalThanks').addClass('invisible');
        $('body').removeClass('modal-open');

        setTimeout(
            () => {
                $('#consultationModal')
                    .removeClass('visible');

                $('#consultationModalDialog')
                    .removeClass('hidden');

                $('#consultationModalThanks')
                    .addClass('hidden');
            },
            300);
    }

    // Обработка отправки формы
    $('#consultationModal form').submit(function (e) {
        e.preventDefault();

        if (validatePhone(STATE.phone) && STATE.callbackTime !== undefined) {

            let data = Object.assign({}, STATE);
            data.from = "Быстрая консультация";
            data.id = '#fastConsultation';

            if (IS_DEBUGGING) {
                console.log('Данные, отправляемые на сервер:', data);
            }

            let request = $.ajax({
                method: 'post',
                url: 'http://quiz24/send-post.php',
                data: { json: JSON.stringify(data) },
                dataType: 'json'
            });

            request.done(response => {
                if (IS_DEBUGGING) console.log(response);
                if (!response.error) {
                    $('#consultationModalDialog').addClass('invisible');

                    setTimeout(
                        () => {
                            $('#consultationModalDialog').addClass('hidden')
                            $('#consultationModalThanks').removeClass('hidden');

                            setTimeout(
                                () => $('#consultationModalThanks').removeClass('invisible'),
                                100
                            );
                        },
                        300
                    );
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;
    });
});