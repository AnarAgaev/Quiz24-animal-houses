import $ from "jquery";

// Import Swiper JS
import Swiper from "swiper/swiper-bundle";
import SwiperCore, { Pagination } from "swiper/swiper-bundle";
import { Lazy } from 'swiper/swiper-bundle';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// configure Swiper to use modules
SwiperCore.use([Pagination]);

$(document).ready(() => {
    // Скролл к слайдеру с подобранными домиками
    $('#goToSliderHouses').click((e) => {
        e.preventDefault();

        let top = $('#slicerHouses').offset().top - 20;

        $('body,html')
            .animate({scrollTop: top}, 1000);
    });

    // Инициализируем слайдер производство
    window.SLIDER_PRODUCTION =  new Swiper('#sliderProduction .swiper', {
        slidesPerView: 'auto',
        speed: 500,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        pagination: {
            el: '#sliderProductionPagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            768: {
                centeredSlides: true,
                initialSlide: 1,
            }
        }
    });

    // Инициализируем слайдер с подобранными домиками
    window.SLIDER_RESULT = new Swiper('#sliderHouses .swiper', {
        slidesPerView: 'auto',
        speed: 500,
        preloadImages: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        pagination: {
            el: '#sliderHousesPagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            768: {
                centeredSlides: true,
                initialSlide: 1,
            }
        }
    });

    $(window).resize(() => {
        SLIDER_PRODUCTION.update();
        SLIDER_RESULT.update();
    });

    // Обработка отправки формы Изменить телефон
    $('#present form').submit(function (e) {
        e.preventDefault();

        let submitBtn = $(e.target).find('[type="submit"]'),
            isValidBtn = !$(submitBtn).hasClass('btn_inactive');

        if (validatePhone(STATE.phone) && isValidBtn) {
            let data = Object.assign({}, STATE);
            data.from = "Изменить номер телефона";
            data.id = '#changePhone';

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
                if (!response.error) {
                    showThanksModal('#thanksPresentModal');
                    $(submitBtn).addClass('btn_inactive');
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;
    });

    // Обработка отправки формы Проверьте номер телефона
    $('#checkPhone form').submit(function (e) {
        e.preventDefault();

        // Валидаци удобного времени звонка STATE.callbackTime !== undefined
        if (validatePhone(STATE.phone)) {
            let data = Object.assign({}, STATE);
            data.from = 'Проверьте номер телефона';
            data.id = '#checkPhone';

            if (!STATE.callbackTime) {
                data.callbackTime = "Не указано";
            }

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
                if (!response.error) {
                    showThanksModal('#thanksCheckPhoneModal');
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;
    });

    // Обработка отправки формы С фотографиями комнаты
    $('#setPhoto form').submit(e => {
        e.preventDefault();

        let from = e.target,
            isPhoneValid = validatePhone(STATE.phone),
            isUploadFile = $('#filePreviews label').length > 0;

        if (isPhoneValid && isUploadFile) {
            showLoading(from);

            let data = Object.assign({}, STATE);
            data.from = 'Отправьте фото комнаты и питомца';
            data.id = '#sendPhoto';

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
                if (!response.error) {

                    // setTimeout для теста, на бою урабть
                    setTimeout(() =>
                        $(from)
                            .removeClass('prefinish')
                            .addClass('loaded'),
                        3000
                    );

                    setTimeout(() => showThanksModal('#thanksSendPhotos'), 5000);
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;

        function showLoading(form) {
            $(form).addClass('loading prefinish');
        }
    });

    function showThanksModal(modalId) {
        $(modalId).addClass('visible');
        $('body').addClass('modal-open');
    }

    // Обработка клика по кнопке закрыть модальное окно Спасибо
    $('.thanks-modal__close').on(
        'click',
        function () {
            $(this).closest('.visible').removeClass('visible');
            $('body').removeClass('modal-open');
        }
    );

    // Обработка клика по пустой области вокруг модального окна Спасибо
    $('.thanks-modal').on(
        'click',
        function () {
            if ($(this).hasClass('visible')) {
                $(this).removeClass('visible');
                $('body').removeClass('modal-open');
            }
        }
    );

    // Добавляем файл в форму и удаляем из нее
    let fileCounter = 1;

    $('#addFile').click(() => {

        let label = document.createElement('label'),
            input = document.createElement('input'),
            span = document.createElement('span');

        input.classList.add('unvisible');
        input.type = 'file';
        input.accept = "image/png, image/jpg, image/jpeg, image/gif, video/avi, video/mp4, video/quicktime";
        input.name = 'file-' + fileCounter++;
        span.classList.add('delete-file');

        label.append(input);
        label.append(span);
        label.click();

        input.addEventListener('change', e => {

            let file = e.target.files[0], // files[0], т.к. грузим 1 файл. При массовй загрузке перебирать files
                name = file.name.split('.'),
                format = name[name.length - 1],
                type = file.type.split('/')[0],
                path = URL.createObjectURL(file);

            if (format === 'png'
                || format === 'jpg'
                || format === 'jpeg'
                || format === 'gif'
                || format === 'avi'
                || format === 'mp4'
                || format === 'mov') {

                if (type === 'image') {
                    label.style.backgroundImage = `url(${path})`;
                    label.style.backgroundSize = 'cover';
                } else {
                    label.style.backgroundImage = `url(/img/icon-video.svg)`;
                    label.style.backgroundSize = '50%';
                }

                $('#filePreviews')[0].append(label);
                checkForms(label);
            }
        });

        // Удаляем, добавленные ранне файл
        span.addEventListener('click', e => {
            e.preventDefault();
            checkForms($('#filePreviews'));
            setTimeout(() => $(e.target).closest('label').remove(), 100);
        });
    });
});