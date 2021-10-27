import $ from "jquery";

// Import Fancybox into this
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";

$(document).ready(function () {
    $('.question-controller')
        .toArray()
        .forEach(el => {
            $(el).on(
                'click',
                function (e) {
                    e.preventDefault();

                    let controller = $(this).find('input'),
                        data = getControllerData(controller),
                        question = getQuestion(controller),
                        title = $(question).find('.question__title').text();

                    // Устанавливам input
                    $(controller)[0].checked = true;

                    // Добавляем данные в стэйт (в прокси стэйта)
                    STATE[data.prop] = [title, data.val];

                    // Добавляем картинку в баннер следующего вопроса
                    pushImgToQuestion(data.id, data.img);

                    // Даваляем данные в кнопку назад у следующего вопроса
                    pushDataToBackBtn(controller, data.id, data.pos - 1);

                    // Сбрасываем классы хедера, чтобы не прыгал экран
                    $('#header').removeClass('visible');

                    // С небольшой задержкой меняем вопросы
                    setTimeout(() => {
                        // Обновляем прогресс бар
                        setProgress(data.pos);

                        // Что бы не подбирать timeout, забираем из CSS свойств
                        let timeout = inactiveQuestion(question);

                        // Скрываем и показываем новый вопрос
                        hideQuestion(question, timeout);
                        showQuestion(data.id, timeout);
                        activeQuestion(data.id, timeout + 100);
                    }, 1000);
            });
        });

    // Обрабатываем клики по кнопке назад
    $('.question__back')
        .toArray()
        .forEach(el => {
            $(el).on(
                'click',
                function () {
                    let question = getQuestion(this),
                        pos = $(this).data('prevProgressPosition'),
                        id = '#' + $(this).data('prevQuestionId');

                    // Сбрасываем предыдущий вопрос (только интерфейс)
                    $(id).find('input').prop('checked', false);
                    $('label.open-comment').removeClass('open-comment');

                    // Обновляем прогресс бар
                    setProgress(pos);

                    // Что бы не подбирать timeout, забираем из CSS свойств
                    let timeout = inactiveQuestion(question);

                    // Скрываем и показываем новый вопрос
                    hideQuestion(question, timeout);
                    showQuestion(id, timeout);
                    activeQuestion(id, timeout + 100);
                }
            );
        });

    // Переключаем подсказки для размера собак
    $('#dogQuestion3 .toggle')
        .toArray()
        .forEach(el => {
            $(el).on(
                'click',
                function (e) {
                    e.stopPropagation();
                    $(this)
                        .closest('.question-controller')
                        .toggleClass('open-comment');
                }
            );
        });

    function getControllerData (controller) {
        return {
            prop: $(controller).attr('name'),
            val: $(controller).val(),
            id: $(controller).data('nextQuestionId'),
            pos: $(controller).data('nextProgressPosition'),
            img: $(controller).data('nextBannerImg')
        };
    }

    function setProgress(pos) {
        let points = $('#progressBar .progress-bar__step');

        $(points).removeClass('active');

        for (let i = 0; i < pos; i++) {
            $(points[i]).addClass('active');
        }
    }

    function getQuestion(el) {
        return $(el)
            .closest('.active');
    }

    function inactiveQuestion(question) {
        $(question).removeClass('active');

        return parseFloat($(question)
            .find('.question__title')
            .css('transition-duration')) * 1000;
    }

    function hideQuestion(el, timeout) {
        setTimeout(
            () => {
                $(el).addClass('hidden');
                $('#header').addClass('blocked');
            },
            timeout
        );
    }

    function pushImgToQuestion(id, img) {

        if (id === '#sleepingInBad') {
            let pic = $('#sleepingInBad [data-next-banner-img]');

            if (STATE['animal'][1] === 'Кошка.') {
                pic.data('nextBannerImg', 'renovation-question-cat.jpg');

            } else {
                switch(STATE['size'][1]) {
                    case 'Маленькая собака.':
                        pic.data('nextBannerImg', 'renovation-question-small-dog.jpg');
                        break;

                    case 'Среднего размера.':
                        pic.data('nextBannerImg', 'renovation-question-medium-dog.jpg');
                        break;

                    case 'Большая собака.':
                        pic.data('nextBannerImg', 'renovation-question-large-dog.jpg');
                        break;
                }
            }
        }

        $(id)
            .find('.question__image')
            .css('backgroundImage', `url(/img/${img})`);
    }

    function showQuestion(id, timeout) {
        setTimeout(
            () => {
                $(id).removeClass('hidden');

                if (id === '#loader') {
                    moveProgressPercents();

                    $('#header')
                        .removeClass('fixed visible')
                        .addClass('blocked');
                }
            },
            timeout
        );
    }

    function activeQuestion(id, timeout) {
        setTimeout(
            () => {
                $(id).addClass('active');
                $('#header').removeClass('blocked');
            },
            timeout
        )
    }

    function pushDataToBackBtn(curController, nextQuestionId, pos) {
        let backBtn = $(nextQuestionId).find('.question__back')[0],
            id = $(curController).closest('.question').attr('id');

        if (backBtn) {
            backBtn.dataset.prevQuestionId = id;
            backBtn.dataset.prevProgressPosition = pos;
        }
    }

    function moveProgressPercents() {
        let num = 0;
        let setTime = setInterval(countUp, 33);

        function countUp () {
            if (num > 99) {
                window.clearInterval(setTime);
            } else {
                num++;
                $('#progressVal').text(num + '%');
            }
        }

        setTimeout(showGetContact, 5000);
    }
    
    function showGetContact() {
        let loader = $('#loader')[0],
            timeout = 400;

        // Скрываем лоадер и паказваем секцию захват контактов
        inactiveQuestion(loader);
        hideQuestion(loader, timeout);
        showQuestion('#getContact', timeout);
        activeQuestion('#getContact', timeout + 100);

        setTimeout(() => $('#header').removeClass('blocked'), 1000);

        // Собираем слайдера с примерами домиков
        if (STATE['animal'][1] === 'Кошка.') {
            switch(STATE['count'][1]) {
                case 'У меня один любимец.':
                    buildSlider('/img/slider/cat-single/pic',13);
                    break;
                case 'У меня два котика.':
                case 'Три и более.':
                    buildSlider('/img/slider/cat-more/pic',7);
                    break;
            }
        } else {
            switch(STATE['size'][1]) {
                case 'Маленькая собака.':
                    buildSlider('/img/slider/dog-small/pic',12);
                    break;
                case 'Среднего размера.':
                    buildSlider('/img/slider/dog-medium/pic',10);
                    break;
                case 'Большая собака.':
                    buildSlider('/img/slider/dog-large/pic',9);
                    break;
            }
        }

        function buildSlider(path, countPic) {
            let node = document.getElementById('sliderHousesWrapper');
            let last;

            for (let i = 1; i <= countPic; last = i++ === countPic) {
                let slide = document.createElement('div'),
                    wrap = document.createElement('div'),
                    pic = document.createElement('div');

                slide.classList.add('slider__slide');
                slide.classList.add('swiper-slide');
                wrap.classList.add('slider__image-wrap');
                pic.classList.add('slider__image');
                pic.style.backgroundImage = `url("${path}${i}.jpg"`;

                wrap.append(pic);
                slide.append(wrap);
                node.append(slide);

                if (last) SLIDER_RESULT.update();
            }
        }
    }

    // Галерея стилей интерьера
    $('#apartmentRenovationStyle .zoom').on(
        'click',
        function (e) {
            e.stopPropagation();
            console.log($(e.target).next()[0].click())
        }
    );

    // Start Fancybox gallery
    Fancybox.bind('[data-fancybox="gallery"]', {
        Thumbs: false,
        Toolbar: false,
        closeButton: "inside",
    });
});