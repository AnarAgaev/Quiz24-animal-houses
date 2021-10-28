import $ from "jquery";

// Import Swiper JS
import Swiper from "swiper/swiper-bundle";
import SwiperCore, { Pagination } from "swiper/swiper-bundle";

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

        if (validatePhone(STATE.phone)) {
            let data = Object.assign({}, STATE);
            data.from = "Изменить номер телефона";
            data.id = '#changePhone';

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
                    showThanksModal('#thanksPresentModal');
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

        if (validatePhone(STATE.phone) && STATE.callbackTime !== undefined) {
            let data = Object.assign({}, STATE);
            data.from = 'Проверьте номер телефона';
            data.id = '#checkPhone';

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
                    showThanksModal('#thanksCheckPhoneModal');
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;
    });

    // Обработка отправки формы С фотографиями комнаты
    $('#setPhoto form').submit(function (e) {
        e.preventDefault();

        if (true) {
            let data = Object.assign({}, STATE);
            data.from = 'Отправьте фото комнаты и питомца';
            data.id = '#sendPhoto';

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
                    showThanksModal('#thanksSendPhotos');
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("Request failed: " + jqXHR + " --- " + textStatus);
            });
        } else return false;
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
});