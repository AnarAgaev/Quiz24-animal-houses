import $ from "jquery";

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
            () => $(el).addClass('hidden'),
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

                if (id === '#loader') moveProgressPercents();
            },
            timeout
        );
    }

    function activeQuestion(id, timeout) {
        setTimeout(
            () => $(id).addClass('active'),
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
    }
});