/*global $ */
/*jslint plusplus: true */
/*jslint bitwise: true */

/**
* Строит динамический layout блоков разного размера
* Динамический т.е. блоки располагают/строятся в контейнере в зависимости от его размеров
*
* @param {string} className Строка - имя класса блоков, которые должны перестраиваться
*/
function buildGrid(className) {
    'use strict';
    var arElements = $(className),
        shift = 0,
        w_width = arElements.parent().width(),
        counter = 0,
        arrHeight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        h = 0,
        i;
    arElements.css({
        'top': 0,
        'opacity' : 0,
        'filter' : 'alpha(opacity = 0)'
    });
    
    for (i = 0; i < arElements.length; i++) {

        if ((shift + $(arElements[i]).width()) > w_width) {
            shift = 0;

            var z = i,
                j;

            for (j = 0; j < counter; j++) {
                arrHeight[j] += $(arElements[z - counter]).outerHeight(true);
                $(arElements[z]).css({
                    'top' : arrHeight[j]
                });
                z++;
            }
            counter = 0;
        }

        $(arElements[i]).css({
            'left' : shift
            //'opacity' : 1
        });


        shift += $(arElements[i]).innerWidth();
        counter++;
        if (h < $(arElements[i]).position().top + $(arElements[i]).height()) {
            h = $(arElements[i]).position().top + $(arElements[i]).height();
        }
        arElements.parent().height(h);
    }

    arElements.css({
        'opacity' : '1',
        'filter' : 'alpha(opacity = 100)',
        'zoom' : 1
    });
    
}

/**
* Строит Подменю для среднего и большого экрана
*/

function buildSubmenu() {
    'use strict';
    $('.header__submenu').width($('.header__menu').outerWidth());
     
    $('.header__submenu').css({
        'left': -($('.menu__list').offset().left - $('.header__menu').offset().left)
    });
}

/**
* Перестраивает Подменю для маленького экрана
*/

function reBuildSubmenu() {
    'use strict';
    $('.header__submenu').css({
        'width': 100 + '%',
        'left' : 0
    });
}

function isRequired(val) {
    'use strict';
    return val !== undefined && val !== null && val !== '';
}

/**
* Функция проверки обязательных для заполения инпутов при фокусе и снятие фокуса
*
*  @param {object} elem 
*/

function inputTringger(elem) {
    'use strict';
    var holderText,
        arrHolderText = [
            "Поле *",
            " обязательно"
        ];
    
    /**
    * Добавляет сообщения об ошибке или успехе при снятии фокуса
    */
    
    inputTringger.blurIs = function () {

        if (isRequired(elem.val())) {
            elem
                .parent().find('.form__ico-result')
                .addClass('form__ico-result--success')
                .append('<i class="font-ico font-ico-okay"></i>');
        } else {
            elem
                .addClass('form__item--error')
                .parent().find('.form__ico-result')
                .addClass('form__ico-result--error')
                .append('<i class="font-ico font-ico-error"></i>');
            if (elem.attr('placeholder')) {
                elem.attr('placeholder', arrHolderText[0] + elem.attr('placeholder') + arrHolderText[1]);
            } else {
                elem.attr('placeholder', 'Заполните это поле');
            }
        }
    };
    
    /**
    * Удаляет сообщения об ошибке или успехе в фокусе
    */
    
    inputTringger.focusIs = function () {
        if (elem.hasClass('form__item--error')) {
            holderText = elem.attr('placeholder');
            elem.removeClass('form__item--error');
            if (elem.attr('placeholder') !== 'Заполните это поле') {
                elem.attr('placeholder', holderText
                      .replace(holderText.substring(0, 6), "")
                      .replace(holderText.substring(holderText.lastIndexOf(" обязательно"), holderText.length), ""));
            } else {
                elem.attr('placeholder', '');
            }
        }
        elem
            .parent().find('.form__ico-result')
            .removeClass('form__ico-result--error form__ico-result--success')
            .empty();
    };
}


/**
* Находит нужное имя класса
*
* @param {object} t $this 
* @param {string} requiredString строка, которая будет искаться в именах классов обекта $this
* @return {string} className искомое имя класса
*/

function defineClassName(t, requiredString) {
    'use strict';
    var nameClickClass = '.',
        requiredName = t.attr('class'),
        foundPos = requiredName.indexOf(requiredString, 0),
        substring = requiredName.substring(foundPos),
        spacePos,
        className;

    if (~substring.indexOf(" ")) {
        spacePos = substring.indexOf(' ', 0);
        nameClickClass += substring.substring(0, spacePos);
    } else {
        nameClickClass += substring;
    }
    className = nameClickClass.substring(('.' + requiredString).length);
    
    /**
    * Делает объекты с именами классов className и className__list невидимыми
    * Удаляет у объекта с классом className класс  className--show
    * Удаляет у объекта с классом className__list класс  className__list--show
    */

    function removeClases() {
        $('.' + className).removeClass(className + '--show');
        $('.' + className + '__list').removeClass(className + '__list--show');
    }
    
    /**
    * Находит в объекте с именем класса className объекты с именем класса form__input
    * И очищает их содержимое
    */
    
    function removeInputs() {
        if ($('.' + className).find('form')) {
            var arrInputs = $('.' + className).find('.form__input').map(function (i, item) {
                inputTringger($(item));
                inputTringger.focusIs();
                $(item).val("");
            });
        }
    }
    
    /**
    * Делает объекты с классом js-overlay_className, className, className__list видимыми
    * За счет добавления соответствующих классов
    */
    
    defineClassName.showOverlay = function () {
        $('.js-overlay_' + className).addClass('overlay--show');
        $('.' + className).addClass(className + '--show');
        $('.' + className + '__list').addClass(className + '__list--show');
        document.body.classList.toggle('no-scrolled');
    };
    
    defineClassName.hideOverlay = function () {
        t.removeClass('overlay--show');
        removeClases();
        removeInputs();
        document.body.classList.toggle('no-scrolled');
    };
    
    defineClassName.closeOverlay = function () {
        $('.js-overlay_' + className).removeClass('overlay--show');
        removeClases();
        removeInputs();
        document.body.classList.toggle('no-scrolled');
    };
    
    /**
    * Сворачивание
    */
    
    defineClassName.roll = function () {
        
        /**
        * Перевороты стрелки в зависимости от открытого или закрытого состояния
        */
        function turnArrow() {
            $('.' + className).find('.turn-item').toggleClass('turn-item--closed');
            t.find('.turn-item').toggleClass('turn-item--closed');
        }

        if (t.next().hasClass(className)) {
            t.next().slideToggle(800);
            turnArrow();
        }

        if (t.parent().hasClass(className)) {
            t.parent().slideToggle(800);
            turnArrow();
            $(nameClickClass).find('.turn-item').toggleClass('turn-item--closed');
        }

        if (t.prev().hasClass(className)) {
            t.prev().slideToggle(800);
            turnArrow();
        }
        return false;
    };
}

/**
* Определяет минимальную высоту для нужного класса
*
* @param {string} className - имя класса объекта, высота которого будет считаться минимальной для объекта с именем класса curClassName
* @param {string} curClassName - имя класса объекта, минимальная высота которого будет равна высоте объекта с именем класса className
*/

function defineMinHeight(className, curClassName) {
    'use strict';
    var h = $(className).height();
    $(curClassName).css({
        'min-height' : h
    });
}

/**
* Находит максимальную высоту для блока с вакансиями
* Присваивает найденую максимальную высоту всем блокам с именем класса vacancies__elem
*/

function defineMaxHeight(p, element) {
    'use strict';
    var h = 0,
        parent = $(p),
        i,
        j,
        elem;
    for (j = 0; j < parent.length; j++) {
        elem = $(parent[j]).find(element);
        elem.height('auto');
        for (i = 0; i < elem.length; i++) {
            h = ($(elem[i]).height() > h) ? $(elem[i]).height() : h;
        }
        elem.height(h);
    }
    
}

function autoHeight(element) {
    'use strict';
    var el = $(element);
    el.height('auto');
}



function windowSize() {
    'use strict';
    if ($(window).width() >= '768') {
        buildSubmenu();
        defineMaxHeight('.track-table__row', '.track-table__content');
    } else {
        reBuildSubmenu();
        autoHeight('.track-table__content');
    }
    
    if ($(window).width() >= '992') {
        defineMinHeight('.detail-product__foto', '.detail-product__desk');
        defineMaxHeight('.vacancies__row', '.vacancies__elem');
    } else {
        autoHeight('.vacancies__elem');
    }
    
}


/**
* Имитация загрузки
*/

function createUpload() {
    'use strict';
    var wrapper = $(".form__upload"),
        file = wrapper.find(".form__file"),
        btn = wrapper.find(".form__upload-btn"),
        txt = wrapper.find(".form__upload-txt"),
        file_api = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
    
    file.change(function () {
        var file_name;
        if (file_api && file[0].files[0]) {
            file_name = file[0].files[0].name;
        } else {
            file_name = file.val().replace("C:\\fakepath\\", '');
        }
        
        if (!file_name.length) {
            return;
        }
        
        if (txt.is(":visible")) {
            txt.text(file_name);
            btn.text("Прикрепить");
        } else {
            btn.text(file_name);
        }
    }).change();
}

/**
* Закрепляет/фиксирует позицию ползунка с калькулятором и livechat
*/

function stopFixPanel() {
    'use strict';
    var scrolled = window.pageYOffset || document.documentElement.scrollTop,
        pTop = $('.footer__bottom').offset().top,
        windowH = $(window).height(),
        fixpanel = document.querySelector('.fix-panel');
    
    if (windowH - (pTop - scrolled)  >= 0) {
        fixpanel.classList.add('fix-panel--absolute');
    } else {
        fixpanel.classList.remove('fix-panel--absolute');
    }
}



$(function () {
    'use strict';
    
    
    $('.js-show_overlay').click(function (event) {
         
        defineClassName($(this), 'js-btn_');
        defineClassName.showOverlay();
        event.preventDefault();
    });
    
    $('.js-hide_overlay').click(function () {
        defineClassName($(this), 'js-overlay_');
        defineClassName.hideOverlay();
    });
    
    $('.js-close_overlay').click(function (e) {
        e.preventDefault();
        defineClassName($(this), 'js-close-btn_');
        defineClassName.closeOverlay();
    });
    
    $('.delivery__turn').click(function () {
        $(this).toggleClass('delivery__turn--white');
    });
    
    $('.roll').click(function (e) {
        
        defineClassName($(this), 'js-turn-item_');
        
        defineClassName.roll();
        
        e.preventDefault();
    });
    
    /**
    * stopPropagation()
    */
    
    $('.js-stopProp').click(function (e) {
        e.stopPropagation();
    });
    
    /**
    * Возможность посмотреть пароль в тектовом виде
    */
    
    $('.form__password-ico').on('click', function () {
        var t;
        t = ($(this).parent().find('input').attr('type') === 'text') ? 'password' : 'text';
        $(this).parent().find('input').attr('type', t);
        $(this).toggleClass('form__password-ico--active');
    });
    
    /**
    * Показать подсказку
    */
    
    $('.form__hint-ico', this).on('click', function () {
        this.classList.toggle('form__hint-ico--active');
        this.nextElementSibling.classList.toggle('form__hint--show');
    });
        
    
    function goodAnswer(submit) {
    //Только для визцального представления,
    //Этот скрипт не будет существовать

        var arrPhrases = [
            "<p class='paragraph paragraph--centered'>На ваш E-mail был отправлен запрос на восстановление пароля. <br>Пожалуйста, воспользуйтесь ссылкой, указанной в письме.</p>",
            "<p class='paragraph paragraph--centered'>Ваше сообщение успешно отправлено. Мы ответим вам в ближайшее время. <br>Спасибо!</p>",
            "<p class='paragraph paragraph--centered'>Вы заказали у нас обратный звонок. <br>В течение нескольких минут мы перезвоним Вам.<br>Спасибо!</p>",
            "<p class='paragraph paragraph--centered'>Ваша заявка принята. В течение ближайшего времени мы перезвоним Вам.</p>",
            "<p class='paragraph paragraph--centered'>В течение нескольких минут на Ваш E-mail придет письмо с уведомлением о регистрации и ссылкой на ее подтверждение.</p>",
            "<p class='paragraph paragraph--centered'>Операция выполнена успешно.<br>Будет выполнен переход в личный кабинет.</p>"
        ],
            count;

         
        count = submit.data('i');
        submit
            .parent()
            .html(arrPhrases[count]);
        setTimeout(function () {
            location.reload();
        }, 2000);
 
    //
    }
    
    $('.js-required-check').change(function () {
        if (this.checked) {
            $('.form_checkLabel').removeClass('form_checkLabel--error');
        }
    });
    
    
    $('.form').on('submit', function (e) {
        e.preventDefault();
        
        var arrRequired = $('.js-required', this).map(function (i, item) {
            inputTringger($(item));
            inputTringger.focusIs();
            inputTringger.blurIs();
        });
       
        if ($('.form_checkLabel', this).length) {
            $('.form_checkLabel', this)[
                ($('.js-required-check').prop('checked')) ? 'removeClass' : 'addClass'
            ]('form_checkLabel--error');
        }
        if (!($('.form_checkLabel', this).hasClass('form_checkLabel--error')) && !($('.js-required', this).hasClass('form__item--error'))) {
            goodAnswer($('.form__submit', this));
        }
        
        return false;
    });
    
    $('.js-required').on('blur', function () {
        inputTringger($(this));
        inputTringger.blurIs();
    });

    
   
    $('.js-required').on('focus', function () {
        inputTringger($(this));
        inputTringger.focusIs();
    });

    
    windowSize();
    
    createUpload();
    
    window.onscroll = function () {
        stopFixPanel();
    };
    
    $('window').on('touchmove', function (e) {
        //Prevent the window from being scrolled
        e.preventDefault();
        stopFixPanel();
    });
    
    var $images = $('.top-slider__slide img'),
        counter = 0;
// Проходимся по каждой картинке и навешиваем обработчик
    $images.each(function () {
        $(this).one('load', function () {
            counter++;
            if ($images.length === counter) {
                $('.top-slider').addClass('top-slider--ready');
            }
        })
            .attr('src', $(this).attr('src'))
            .each(function () {
                if (this.complete) {
                    $(this).load();
                }
            });
    });
    /*$images.each(function () {
        $(this).load(function () {
            counter++;
            // Если подгрузились все картинки, то инициализируем слайдер
            if ($images.length === counter) {
                $('.top-slider').addClass('top-slider--ready');
            }
            
        });
        // Меняем src для инициализации load
        $(this).attr('src', $(this).attr('src'));
    });*/
    
});



window.onload = function () {
    'use strict';
    buildGrid('.blog__prev');
    buildGrid('.detail-product__col');
    defineMinHeight('.reviews__img', '.reviews__txt-container');
};


$(window).resize(function () {
    'use strict';
    
    autoHeight('.track-table__content');
    windowSize();
    buildGrid('.blog__prev');
    buildGrid('.detail-product__col');
    defineMinHeight('.reviews__img', '.reviews__txt-container');
    stopFixPanel();
});




