import $ from "jquery";

// Import Swiper JS
import Swiper from "swiper/swiper-bundle";
import SwiperCore, { Pagination } from "swiper/swiper-bundle";

// Import Swiper styles
import 'swiper/swiper-bundle.css';

// configure Swiper to use modules
SwiperCore.use([Pagination]);

$(document).ready(() => {
    new Swiper('#sliderProduction .swiper', {
        slidesPerView: 'auto',
        speed: 500,
        // centeredSlides: true,
        pagination: {
            el: '#sliderProductionPagination',
            clickable: true,
            dynamicBullets: true,
        },
    });

    const SLIDER_RESULT = new Swiper('#sliderHouses .swiper', {
        slidesPerView: 'auto',
        speed: 500,
        // centeredSlides: true,
        pagination: {
            el: '#sliderHousesPagination',
            clickable: true,
            dynamicBullets: true,
        },
    });

    buildSlider(
        SLIDER_RESULT,
        '#sliderHouses',
        '/img/slider/cat-single/pic',
        13
    );

    function buildSlider(slider, sliderId, path, countPic) {
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

            if (last) slider.update();
        }
    }
});
