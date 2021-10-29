import $ from "jquery";
import IMask from 'imask';

// Блокируем зум экрана на IOS
document.addEventListener('touchmove', function(event) {
    event = event.originalEvent || event;
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, false);

window.IS_DEBUGGING = true;

window.validatePhone = phone => {
    let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
    return regular.test(phone);
};

// В суперглобальной переменной храним все дынные, введенные пользователем
window.STATE = {
    connect: "WhatsApp",
};

// С помощью проксирования слушаем изменение стэйта
STATE = new Proxy(STATE, {
    set: function (target, prop, val) {

        target[prop] = val;

        /*
         * Если в стейте меняется телефон, то сразу меняем
         * телефон во всех полях ввода телефона.
         */
        if (prop === 'phone') {
            for (let i = 0; i < PHONE_MASKS.length; i++) {
                PHONE_MASKS[i].unmaskedValue = val;
            }
        }

        /*
         * Если в стейте меняется удобное время для звонка, то
         * сразу меняем это значение во всех аналогичных полях ввода.
         */
        if (prop === 'callbackTime') {
            $('.callback-time-controller').val(val);
        }

        /*
         * Если в стейте меняется удобный способ контакта, то
         * сразу меняем это значение во всех аналогичных чекбоксах.
         */
        if (prop === 'connect') {
            $(`input[value="${val}"]`).prop('checked', true);
        }

        if (IS_DEBUGGING) {
            setTimeout(() => console.log(target), 100);
        }

        return true;
    }
});

// Маски для всех телефонов сохраняем в отдельный суперглобальный массив
const PHONE_MASKS = [];

// Маска для телефона. Испльзуется во всех телефонал
const phoneMaskOptions = {
    mask: '+{7} ({9}00) 000-00-00',
    lazy: true,
    placeholderChar: '_'
};

window.checkForms = (el) => {

    let formType = $(el)
        .closest('form')
        .data('formType');

    switch(formType) {
        case 'connectType': checkFormConnectType();
            break;
        case 'singlePhone': checkFormSinglePhone();
            break;
        case 'callbackTime': checkFormCallbackTime();
            break;
        case 'setPhoto': checkFormSetPhoto();
            break;
    }

    function checkFormConnectType() {
        let submitsConnectType = $('form[data-form-type="connectType"] [type="submit"]'),
            submitsCallbackTime = $('form[data-form-type="callbackTime"] [type="submit"]'),
            submitsSetPhoto = $('form[data-form-type="setPhoto"] [type="submit"]'),
            phoneIsValid = validatePhone(STATE.phone),
            connectIsValid = STATE.connect !== undefined;

        if (phoneIsValid && connectIsValid) {
            submitsConnectType.removeClass('btn_inactive');
            submitsCallbackTime.removeClass('btn_inactive');
            submitsSetPhoto.removeClass('btn_inactive');
        } else {
            submitsConnectType.addClass('btn_inactive');
            submitsCallbackTime.addClass('btn_inactive');
            submitsSetPhoto.addClass('btn_inactive');
        }
    }

    function checkFormSinglePhone() {
        let submits = $('form[data-form-type="singlePhone"] [type="submit"]'),
            submitsCallbackTime = $('form[data-form-type="callbackTime"] [type="submit"]'),
            submitsSetPhoto = $('form[data-form-type="setPhoto"] [type="submit"]'),
            phoneIsValid = validatePhone(STATE.phone);

        if (phoneIsValid) {
            submits.removeClass('btn_inactive');
            submitsCallbackTime.removeClass('btn_inactive');
            submitsSetPhoto.removeClass('btn_inactive');
        } else {
            submits.addClass('btn_inactive');
            submitsCallbackTime.addClass('btn_inactive');
            submitsSetPhoto.addClass('btn_inactive');
        }
    }

    function checkFormCallbackTime() {
        let submits = $('form[data-form-type="callbackTime"] [type="submit"]'),
            submitsConnectType = $('form[data-form-type="connectType"] [type="submit"]'),
            submitsSetPhoto = $('form[data-form-type="setPhoto"] [type="submit"]'),
            phoneIsValid = validatePhone(STATE.phone),
            connectIsValid = STATE.callbackTime !== '';

        if (phoneIsValid) {
            submits.removeClass('btn_inactive');
            submitsConnectType.removeClass('btn_inactive');
            submitsSetPhoto.removeClass('btn_inactive');
        } else {
            submits.addClass('btn_inactive');
            submitsConnectType.addClass('btn_inactive');
            submitsSetPhoto.addClass('btn_inactive');
        }
    }

    function checkFormSetPhoto() {
        let submits = $('form[data-form-type="setPhoto"] [type="submit"]'),
            submitsCallbackTime = $('form[data-form-type="callbackTime"] [type="submit"]'),
            phoneIsValid = validatePhone(STATE.phone);

        if (phoneIsValid) {
            submits.removeClass('btn_inactive');
            submitsCallbackTime.removeClass('btn_inactive');
        } else {
            submits.addClass('btn_inactive');
            submitsCallbackTime.addClass('btn_inactive');
        }

        // setTimeout(() => {
        //     let photosIsValid = $('#filePreviews label').length > 0;
        //
        //     if (phoneIsValid && photosIsValid) {
        //         submits.removeClass('btn_inactive');
        //     } else {
        //         submits.addClass('btn_inactive');
        //     }
        // }, 300);
    }
}

window.checkPhoneController = () => {
    let ctrls = $('[name="phone"]');

    if (validatePhone(STATE['phone'])) {
        $(ctrls).addClass('valid');
    } else {
        $(ctrls).removeClass('valid');
    }
}

window.checkCallbackTimeController = () => {
    let ctrls = $('[name="time"]');

    if (STATE.callbackTime) {
        $(ctrls).addClass('valid');
    } else {
        $(ctrls).removeClass('valid');
    }
}

$(document).ready(() => {
    // Слушаем редактирование на всех контроллерах с Удобным временем для звонка
    $('.callback-time-controller')
        .on(
            'input',
            function () {
                STATE.callbackTime = $(this).val();
                checkForms(this);
                checkCallbackTimeController();
            }
        );

    // Слушаем редактирование на всех контроллерах с Удобным способом контакта
    $('input[name="connect"]')
        .on(
            'input',
            function () {
                STATE[$(this).attr('name')] = $(this).val();
                checkForms(this);
            }
        );

    // Слушаем события на всех контроллерах с Телефонами
    let phones = document.getElementsByClassName('phone-controller');
    [].slice
        .call(phones)
        .forEach((el, num) => {
            PHONE_MASKS.push(IMask(el, phoneMaskOptions));
            el.dataset.maskNum = num.toString();
        });

    $('.phone-controller')
        .focus(function () {
            let maskNum = $(this).data('maskNum');
            PHONE_MASKS[maskNum].updateOptions({
                lazy: false,
            });
        })
        .blur(function () {
            let maskNum = $(this).data('maskNum');
            PHONE_MASKS[maskNum].updateOptions({
                lazy: true,
            });

            if (!validatePhone(STATE.phone)) {
                STATE.phone = '';
                delete STATE.phone;
            }
        })
        .on(
            'input',
            function () {
                let maskNum = $(this).data('maskNum');
                STATE['phone'] = PHONE_MASKS[maskNum].unmaskedValue;
                checkForms(this);
                checkPhoneController();

                // При изменении телефона чистим все ошибки
                $('.error').removeClass('visible');
            }
        );
});