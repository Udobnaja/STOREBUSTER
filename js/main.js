    
 function buildGrid(className) {
     
     var arElements = $(className),
         shift = 0,
         w_width = arElements.parent().width(),
         counter = 0,
         arrHeight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         h = 0,
         i;
     arElements.css({'top': 0});
     for (i = 0; i < arElements.length; i++) {
            
            if((shift + $(arElements[i]).width()) > w_width) {
                shift = 0;
                
                var z = i,
                    j;
                
                for (j = 0; j < counter; j++) {
                    arrHeight[j] += $(arElements[z-counter]).outerHeight(true);
                    $(arElements[z]).css({
                        'top' : arrHeight[j]
                     });
                    
                    z++;
                }
                
                counter = 0;
            }

            $(arElements[i]).css({
                'left' : shift
            });
            
            shift += $(arElements[i]).innerWidth();
            counter++;
            if (h < $(arElements[i]).position().top + $(arElements[i]).height()) {
                h = $(arElements[i]).position().top + $(arElements[i]).height();
            }
            arElements.parent().height(h); 
    }
    arElements.css({'opacity' : 1});
   
};

function buildSubmenu(){
    $('.header__submenu').width($('.header__menu').outerWidth());
     
    $('.header__submenu').css({
        'left': -($('.menu__list').offset().left - $('.header__menu').offset().left)
    });
};

function reBuildSubmenu(){
    $('.header__submenu').css({
        'width': 100 + '%',
        'left' : 0
    });
};

function defineClassName(t, requiredString){
    
    var nameClickClass = '.',
            requiredName = t.attr('class'),
            foundPos = requiredName.indexOf(requiredString, 0),
            substring = requiredName.substring(foundPos),
            spacePos,
            className;
         
         if (~substring.indexOf(" ")) {
            spacePos = substring.indexOf(' ', 0);
            nameClickClass += substring.substring(0,spacePos);
        } else {
            nameClickClass += substring;
        }
        className = nameClickClass.substring(('.' + requiredString).length);
    
    function removeClases(){
        $('.' + className).removeClass(className + '--show');
        $('.' + className + '__list').removeClass(className + '__list--show');
    };
    
    function removeInputs(){
        if($('.' + className ).find('form')){
           var arrInputs = $('.' + className ).find('.form__input');
            for(var i = 0; i<arrInputs.length; i++){
                inputTringger($(arrInputs[i]));
                inputTringger.focusIs();
                $(arrInputs[i]).val("");
            };
        };
    };
    
    defineClassName.showOverlay = function(){
        $('.js-overlay_' + className).addClass('overlay--show');
        $('.' + className ).addClass(className + '--show');
        $('.' + className + '__list').addClass(className + '__list--show');
    };
    
    defineClassName.hideOverlay = function(){
        t.removeClass('overlay--show');
        removeClases();
        removeInputs();
    };
    
    defineClassName.closeOverlay = function(){
        $('.js-overlay_' + className).removeClass('overlay--show');
        removeClases();
        removeInputs();
    };
    
    defineClassName.roll = function(){
        
        function turnArrow(){
            $('.' + className).find('.turn-item').toggleClass('turn-item--closed');
            t.find('.turn-item').toggleClass('turn-item--closed');
        }

        if (t.next().hasClass(className)){
            t.next().slideToggle(800);
            turnArrow();    
        }

        if (t.parent().hasClass(className)){
            t.parent().slideToggle(800);
            turnArrow();
            $(nameClickClass).find('.turn-item').toggleClass('turn-item--closed');
        }

         if (t.prev().hasClass(className)){
            t.prev().slideToggle(800);
             turnArrow();
        }
        return false;
    }
};

function inputTringger(elem){
    var holderText,
        arrHolderText = [
            "Поле *",
            " обязательно для заполнения"
        ];
    
    inputTringger.blurIs = function(){
 
            if (elem.val().replace(/\s+/g, '') == "") {
                elem
                    .addClass('form__item--error')
                    .parent().find('.form__ico-result')
                    .addClass('form__ico-result--error')
                    .append('<i class="fa fa-exclamation-triangle"></i>');
                elem.attr('placeholder', arrHolderText[0] + elem.attr('placeholder') + arrHolderText[1]);
            } else {
                elem
                    .parent().find('.form__ico-result')
                    .addClass('form__ico-result--success')
                    .append('<i class="fa fa-check"></i>');
            }
    };
    
    inputTringger.focusIs = function(){
        if (elem.hasClass('form__item--error')){
            holderText = elem.attr('placeholder');
            elem
                .removeClass('form__item--error')
                .attr('placeholder', holderText
                      .replace(holderText.substring(0,6),"")
                      .replace(holderText.substring(holderText.lastIndexOf(" обязательно для заполнения"),holderText.length),""));
        }
        elem
            .parent().find('.form__ico-result')
            .removeClass('form__ico-result--error form__ico-result--success')
            .empty();
    };
}

function windowSize(){
     if ($(window).width() >= '768'){
         buildSubmenu();
     }
    else reBuildSubmenu();
    
    if ($(window).width() >= '992'){
         defineMinHeight('.detail-product__foto','.detail-product__desk');
     }
    
};

function defineMinHeight(className, curClassName){
    var h = $(className).height();
    $(curClassName).css({
        'min-height' : h
    });
};

function defineMaxVacanciescHeight(){
    var h = 0,
        elem = $('.vacancies__elem');
        elem.height('auto');
    for(var i = 0; i < elem.length; i++){
        h = ($(elem[i]).height() > h) ? $(elem[i]).height() : h;
    }
    elem.height(h);
};

function createUpload(){
     var wrapper = $( ".form__upload" ),
        file = wrapper.find( ".form__file" ),
        btn = wrapper.find( ".form__upload-btn" ),
        txt = wrapper.find( ".form__upload-txt" );
    
    var file_api = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;
    
    file.change(function(){
        var file_name;
        if( file_api && file[ 0 ].files[ 0 ] )
            file_name = file[ 0 ].files[ 0 ].name;
        else
            file_name = file.val().replace( "C:\\fakepath\\", '' );
        
        if( ! file_name.length )
            return;
        
        if( txt.is( ":visible" ) ){
            txt.text( file_name );
            btn.text( "Прикрепить" );
        }else
            btn.text( file_name );
    }).change();
};

$(function(){ 
    
     
    
     $('.js-show_overlay').click(function(event){
        defineClassName($(this),'js-btn_', event);
        defineClassName.showOverlay();
        $('body').css('overflow', 'hidden');
        event.preventDefault();
     });
    
    $('.js-hide_overlay').click(function(){
        defineClassName($(this),'js-overlay_');
        defineClassName.hideOverlay();
        $('body').css('overflow', 'auto');
    });
    
    $('.js-close_overlay').click(function(e){
        e.preventDefault();
        defineClassName($(this),'js-close-btn_');
        defineClassName.closeOverlay();
        $('body').css('overflow', 'auto');
    });
    
    $('.delivery__turn').click(function(){
        $(this).toggleClass('delivery__turn--white');
    });
    
    $('.roll').click(function(e){
        
        defineClassName($(this),'js-turn-item_');
        
        defineClassName.roll();
        
        e.preventDefault();
    });
    
     $('.js-stopProp').click(function(e){
        e.stopPropagation();
     });
    
    $('.form__password-ico').on('click',function(){
        var t;
        t = ($(this).parent().find('input').attr('type') == 'text') ? 'password' : 'text';
        $(this).parent().find('input').attr('type', t);
        $(this).toggleClass('form__password-ico--active');
    });
        
    
    
    //Только для визцального представления,
    //Этот скрипт не будет существовать

    var arrPhrases = [
        "<p class='paragraph paragraph--centered'>На ваш E-mail был отправлен запрос на восстановление пароля. <br>Пожалуйста, воспользуйтесь ссылкой, указанной в письме.</p>",
        "<p class='paragraph paragraph--centered'>Ваше сообщение успешно отправлено. Мы ответим вам в ближайшее время. <br>Спасибо!</p>",
        "<p class='paragraph paragraph--centered'>Вы заказали у нас обратный звонок. <br>В течение нескольких минут мы перезвоним Вам.<br>Спасибо!</p>",
        "<p class='paragraph paragraph--centered'>Ваша заявка принята. В течение ближайшего времени мы перезвоним Вам.</p>"
    ],
        count;
    
     $('.reestablish').click(function(e){
         count = $(this).data('i');
         $(this).parent()
         .html(arrPhrases[count]);
         setTimeout(function() {
             location.reload();
            }, 2000
         );
    });  
    //
    
   $('.js-required').on('blur',function() {
        inputTringger($(this));
        inputTringger.blurIs();
   });

    
   
    $('.js-required').on('focus',function() {
        inputTringger($(this));
        inputTringger.focusIs();
    });

    
    windowSize();
    
    
    defineMinHeight('.reviews__img','.reviews__txt-container');   
    defineMaxVacanciescHeight();
    createUpload();
    
});

window.onload = function() {
    buildGrid('.blog__prev');
    buildGrid('.detail-product__col');
};


 $( window ).resize(function() {
        windowSize();
        buildGrid('.blog__prev');
        buildGrid('.detail-product__col');
        defineMinHeight('.reviews__img','.reviews__txt-container');
        defineMaxVacanciescHeight();
});



