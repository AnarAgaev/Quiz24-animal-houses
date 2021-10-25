import $ from "jquery";
import IMask from 'imask';

window.IS_DEBUGGING = true;

// В суперглобальной переменной храним все дынные, введенные пользователем
window.STATE = {};

// С помощью проксирования слушаем изменение стэйта
STATE = new Proxy(STATE, {
    set: function (target, prop, val) {

        target[prop] = val;

        /*
         * Если в стейте меняется телефон,
         * то сразу меняем телефон во всех
         * полях ввода телефона.
         */
        if (prop === 'phone') {
            fastPhoneMask.unmaskedValue = val;
        }

        if (IS_DEBUGGING) {
            setTimeout(() => console.log(target), 100);
        }

        return true;
    }
});

window.validatePhone = phone => {
    let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
    return regular.test(phone);
};

// Маска для телефона. Испльзуется во всех телефонал
window.phoneMaskOptions = {
    mask: '+{7} ({9}00) 000-00-00',
    lazy: true,
    placeholderChar: '0'
};

window.pushPhoneToState = (value) => {
    STATE['phone'] = value;
};