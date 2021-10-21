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

        setTimeout(
            () =>  $('#consultationModalDialog')
                .removeClass('invisible'),
            300);
    }

    function hideConsultationModal() {
        $('#consultationModalDialog')
            .addClass('invisible');
        $('#consultationModalThanks')
            .addClass('invisible');

        setTimeout(
            () => {
                $('#consultationModal')
                    .removeClass('visible');

                $('#consultationModalDialog')
                    .removeClass('hidden');

                $('#consultationModalThanks')
                    .addClass('hidden');

                cleanConsultationControllers();
            },
            300);
    }

    function cleanConsultationControllers() {
        $('#fastCallbackTime').val('');
        delete STATE.fastCallbackTime;

        if (!validatePhone(STATE.phone)) {
            STATE.phone = '';
            delete STATE.phone;
        }
    }

    // Маска для телефона
    let fastPhone = document.getElementById('fastPhone');
    window.fastPhoneMask = IMask(fastPhone, phoneMaskOptions);

    $('#fastPhone').focus(() => {
        fastPhoneMask.updateOptions({
            lazy: false,
        });
    });

    $('#fastPhone').blur(() => {
        fastPhoneMask.updateOptions({
            lazy: true,
        });
    });

    $('#fastPhone').on(
        'input',
        () => {
            pushPhoneToState(fastPhoneMask.unmaskedValue);

            if (validatePhone(fastPhoneMask.unmaskedValue)) {
                $('#consultationModal [type="submit"]').removeClass('btn_inactive');
            } else {
                $('#consultationModal [type="submit"]').addClass('btn_inactive');
            }
        }
    );

    $('#fastCallbackTime').on(
        'input',
        function () {
            STATE.fastCallbackTime = $(this).val();
        }
    );

    // Обработка отправки формы
    $('#consultationModal form').submit(function (e) {
        e.preventDefault();

        if (validatePhone(STATE.phone)) {

            if (IS_DEBUGGING) {
                console.log(
                    'Данные, отправляемые на сервер:',
                    Object.assign({}, STATE)
                );
            }

            let request = $.ajax({
                url: 'https://jsonplaceholder.typicode.com/todos/1', // !!!!!!!!!!!!!!! тестовый сервер
                method: "GET", // !!!!!!!!!!!!!!! при реальном запросе поменять на POST
                data: JSON.stringify(Object.assign({}, STATE)),
                dataType: "JSON"
            });

            request.done(response => {

                console.log(response);

                if (response) { // !!!!!!!!!!!!!!! проверить переменную ответа на корректность отправки данных

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