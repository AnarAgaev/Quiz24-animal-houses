import $ from "jquery";
import IMask from 'imask';

$(document).ready(() => {
    // Показываем модальное окно
    $('#consultationShowBtn').click(showConsultationModal);

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

            if (!STATE.callbackTime) {
                data.callbackTime = "Удобное время для звонка не указано.";
            }

            if (IS_DEBUGGING) {
                console.log('Данные, отправляемые на сервер:', data);
            }

            let request = $.ajax({
                url: 'https://jsonplaceholder.typicode.com/todos/1', // !!!!!!!!!!!!!!! тестовый сервер
                method: "GET", // !!!!!!!!!!!!!!! при реальном запросе поменять на POST
                data: JSON.stringify(data),
                dataType: "JSON"
            });

            request.done(response => {

                // !!!!!!!!!!!!!!! проверить переменную ответа на корректность отправки данных
                console.log(response);

                if (response) {
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
                alert( "Request failed: " + textStatus );
            });

        } else return false;
    });
});