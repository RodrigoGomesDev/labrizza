// window.domain = 'agproex.com.br'; colocar o domain do site nas funções de cookie


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

(function ($, root, undefined) {
    
    window.theme = {

        ...window.theme,

        settings :{
            lastScrollPosition        : 0,
            offerInfiniteCron         : false,
            productThumbs             : null,
            productGallery            : null
        },
        
        header: function(){
            
            var nav_left = (parseFloat($('.header-logo-menu .nav').offset().left) * 2) - 10;
            
            $('.nav .list .second-level > ul').css('max-width', 'calc(100% - (' + nav_left + 'px))');

            if ($('.header .benefits').length) {
                new Swiper('.header .benefits-slide', {
                    loop: true,
                    effect: 'fade',
                    autoplay :{
                        delay: 3000,
                        disableOnInteraction : false
                    }
                });
            }

            $('.header-search-wrapper .header-search-button').click(function(){
                $('.header-search-wrapper').toggleClass('active');
                $('.header-search-form').toggleClass('active');

                if ($('.header-search-form').hasClass('active')) {
                    $('.header-search-form-content input.input-search').trigger('focus');
                }
            });

            $(document).delegate('.nav-mobile li.sub > a', 'click', function(element){
                element.preventDefault();

                $(this).closest('li').toggleClass('open');

                return false;
            });

            $(document).delegate('#btn-nav-toggle', 'click', function(){
                theme.menuToggle();
            });
            
            $(document).delegate('.menu-toggle-item-has-subcategories > a', 'click', function(){
                var item_link = $(this).closest('.menu-toggle-item-has-subcategories').find('.menu-toggle-nav-subcategories li:first-child a').attr('href');
                var item_name = $(this).text();

                $(this).closest('.menu-toggle-container').addClass('open-subcategories');
                $(this).closest('.menu-toggle-item-has-subcategories').addClass('open');
                $(this).closest('.menu-toggle-item-has-subcategories').closest('.menu-toggle-nav-subcategories').children('li:not(.open)').addClass('hidden');

                $('#menu-toggle .account').hide();
                $('.menu-toggle-header').append('<a class="menu-toggle-header-item" href="javascript: void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12"><path d="M18.829,13.8l-6-6-2,2,4,4-4,4,2,2Z" transform="translate(18.829 19.803) rotate(180)" fill="#fff"/></svg> ' + item_name + '</a>');
            });

            $(document).delegate('.menu-toggle-header-item', 'click', function(){
                $('.menu-toggle-item-has-subcategories.open:last').closest('.menu-toggle-nav-subcategories').children('li:not(.open)').removeClass('hidden');
                $('.menu-toggle-item-has-subcategories.open:last').removeClass('open');
                
                if (!$('.menu-toggle-item-has-subcategories.open').length) {
                    $('#menu-toggle .account').show();
                    $('.menu-toggle-container').removeClass('open-subcategories');
                }
                
                $(this).remove();
            });
            
            $(document).delegate('.header-menu', 'click', function(){
                theme.menuToggle();
            });

        },
        
        toggleSidebar: function(){
            
            $(document).delegate('.toggle-sidebar-close', 'click', function(element){
                if ($(element.target).hasClass('toggle-sidebar-close')) {
                    $('.toggle-sidebar').removeClass('open-content');

                    setTimeout(function(){
                        $('.toggle-sidebar').fadeOut('fast', function(){
                            $('.toggle-sidebar').removeClass('open');
                        });
                    }, 500);
                }
            });

            $(document).delegate('.toggle-sidebar-close', 'touchstart', function(element){
                if ($(element.target).hasClass('toggle-sidebar-close')) {
                    $('.toggle-sidebar').removeClass('open-content');

                    setTimeout(function(){
                        $('.toggle-sidebar').fadeOut('fast', function(){
                            $('.toggle-sidebar').removeClass('open');
                        });
                    }, 500);
                }
            });
            
        },
        
        bannersCarousel: function(){
            
            var banners_carousel_number = 1;
        
            $('.banners-carousel').each(function(){
                $(this).attr('id', 'banners-carousel-' + banners_carousel_number);

                new Swiper('#banners-carousel-' + banners_carousel_number + ' .swiper-container', {
                    preloadImages : false,
                    loop          : true,
                    autoHeight    : true,
                    effect        : 'slide',
                    autoplay :{
                        delay : 10000,
                        disableOnInteraction : true
                    },
                    lazy :{
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '#banners-carousel-' + banners_carousel_number + ' .next',
                        prevEl: '#banners-carousel-' + banners_carousel_number + ' .prev',
                    },
                    pagination: {
                        el                : '#banners-carousel-' + banners_carousel_number + ' .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                });

                banners_carousel_number++;
            });
            
        },
        
        menuCarousel: function(){
            
            var menu_carousel_number = 1;
        
            $('.menu-carousel').each(function(){
                $(this).attr('id', 'menu-carousel-' + menu_carousel_number);

                var menu_total = $(this).find('.swiper-slide').length;
            
               $(this).addClass('menu-carousel-' + menu_total);

               if (menu_total >= 8) {
                   $(this).removeClass('menu-carousel-no-slide');

                   new Swiper('#menu-carousel-' + menu_carousel_number + ' .swiper', {
                        spaceBetween: 20,
                        slidesPerView: 'auto',
                        slidesPerGroupAuto: true,
                        loop: false,
                        navigation: {
                            nextEl: '#menu-carousel-' + menu_carousel_number + ' .next',
                            prevEl: '#menu-carousel-' + menu_carousel_number + ' .prev'
                        },
                        breakpoints: {
                          768: {
                            spaceBetween: 40
                          }
                        }
                   }); 
               } else {
                   $(this).addClass('menu-carousel-' + menu_total);
               }

                menu_carousel_number++;
            });
            
        },
        
        spotCarousel: function(){
            
            async function loadSpotCarousel(spot_carousel_number) {
                var hotsite = $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-hotsite');
                
                if (hotsite) {
                    var variables = {
                        url: $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-hotsite'),
                        sortKey: $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-sort'),
                        sortDirection: $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-direction')
                    };

                    var response = await client.snippet.render('spot_carousel.html', 'SnippetQueries/spot_carousel_hotsite.graphql', variables);
                } else {
                    var variables = {
                        sortKey: $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-sort'),
                        sortDirection: $('#spot-carousel-snippet-' + spot_carousel_number).attr('data-direction')
                    };

                    var response = await client.snippet.render('spot_carousel.html', 'SnippetQueries/spot_carousel.graphql', variables);
                }

                $('#spot-carousel-snippet-' + spot_carousel_number).addClass('loaded');
                $('#spot-carousel-snippet-' + spot_carousel_number).html(response);
                $('#spot-carousel-snippet-' + spot_carousel_number).find('.title-section').text($('#spot-carousel-snippet-' + spot_carousel_number).attr('data-title'));
                var swiper_slides = parseInt($('#spot-carousel-snippet-' + spot_carousel_number).find('.spot-carousel-items').attr('data-slides'));
                var swiper_limit_slides = swiper_slides + 1;

                $('#spot-carousel-snippet-' + spot_carousel_number).find('.spot-carousel-items .swiper').each(function(){
                    if ($(this).find('.item').length < swiper_limit_slides) {
                        var aux = 1;
                        var total = swiper_limit_slides / parseInt($(this).find('.item').length);
                        var html = $(this).find('.swiper-wrapper').html();

                        while (aux <= total) {
                            $(this).find('.swiper-wrapper').append(html);

                            aux++;
                        }
                    }

                    new Swiper(this, {
                        spaceBetween: 10,
                        loop: true,
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        navigation: {
                          nextEl: '#spot-carousel-snippet-' + spot_carousel_number + ' .next',
                          prevEl: '#spot-carousel-snippet-' + spot_carousel_number + ' .prev',
                        },
                        breakpoints: {
                          1201: {
                            spaceBetween: 25,
                            slidesPerView: swiper_slides,
                            slidesPerGroup: swiper_slides
                          },
                          921: {
                            spaceBetween: 25,
                            slidesPerView: 4,
                            slidesPerGroup: 4
                          },
                          768: {
                            spaceBetween: 20,
                            slidesPerView: 3,
                            slidesPerGroup: 3
                          }
                        }
                    });
                });
            }
            
            var spot_carousel_number = 1;
            
            $('.spot-carousel-snippet').each(function(){
                $(this).attr('id', 'spot-carousel-snippet-' + spot_carousel_number);

                loadSpotCarousel(spot_carousel_number);

                spot_carousel_number++;
            });
            
            var spot_carousel_count = 1;
            
            $('.spot-carousel:not(.spot-carousel-snippet)').each(function(){
                var swiper_slides = parseInt($(this).find('.spot-carousel-items').attr('data-slides'));
                var swiper_limit_slides = swiper_slides + 1;
                
                $(this).attr('id', 'spot-carousel-' + spot_carousel_count);
                $(this).addClass('loaded');

                $(this).find('.spot-carousel-items .swiper').each(function(){
                    if ($(this).find('.item').length < swiper_limit_slides) {
                        var aux = 1;
                        var total = swiper_limit_slides / parseInt($(this).find('.item').length);
                        var html = $(this).find('.swiper-wrapper').html();

                        while (aux <= total) {
                            $(this).find('.swiper-wrapper').append(html);

                            aux++;
                        }
                    }

                    new Swiper(this, {
                        spaceBetween: 10,
                        loop: true,
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        navigation: {
                          nextEl: '#spot-carousel-' + spot_carousel_count + ' .next',
                          prevEl: '#spot-carousel-' + spot_carousel_count + ' .prev',
                        },
                        breakpoints: {
                          1201: {
                            spaceBetween: 25,
                            slidesPerView: swiper_slides,
                            slidesPerGroup: swiper_slides
                          },
                          921: {
                            spaceBetween: 25,
                            slidesPerView: 4,
                            slidesPerGroup: 4
                          },
                          768: {
                            spaceBetween: 20,
                            slidesPerView: 3,
                            slidesPerGroup: 3
                          }
                        }
                    });
                });
                
                spot_carousel_count++;
            });
            
        },
        
        brandsCarousel: function(){
            
            var brands_carousel_number = 1;
            
            $('.brands-carousel').each(function(){
                $(this).attr('id', 'brands-carousel-' + brands_carousel_number);
                
                var brands_total = $('#brands-carousel-' + brands_carousel_number + ' .swiper-slide').length;

                if (brands_total >= 8) {
                   $(this).removeClass('featured-brands-no-slide');

                   new Swiper('#brands-carousel-' + brands_carousel_number + ' .swiper', {
                        spaceBetween: 20,
                        loop: false,
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        navigation: {
                            nextEl: '#brands-carousel-' + brands_carousel_number + ' .next',
                            prevEl: '#brands-carousel-' + brands_carousel_number + ' .prev'
                        },
                        breakpoints: {
                          768: {
                            spaceBetween: 40,
                            slidesPerView: 'auto',
                            slidesPerGroupAuto: true
                          }
                        }
                    });
               } else {
                   $(this).addClass('brands-carousel-' + brands_total);
               }
            });
            
        },
        
        filter: function(){
            
            $(document).delegate('#btn-filter-toggle', 'click', function(){
                $('#filter-toggle').fadeIn('fast', function(){
                    $('#filter-toggle').addClass('open');
                    $('#filter-toggle').addClass('open-content');
                });
            });
            
        },
        
        instagramFeed: function(){
            
            if ($('.section-instagram-content li').length) {
                $('.section-instagram').addClass('active');
                
                theme.instagramFeedSlide();
            } else {
                var instagramToken = ($('input[name="data-token"]').val()).split('*').join('');
                var instagramFields = 'id,media_type,media_url,thumbnail_url,timestamp,permalink,caption';
                var instagramLimit = 5;

                $.ajax ({
                    url: 'https://graph.instagram.com/me/media?fields=' + instagramFields + '&access_token=' + instagramToken + '&limit=' + instagramLimit,
                    type: 'GET',
                    success: function(instagramResponse) {
                        var instagramGallery__images = $('.section-instagram-content');

                        $.each(instagramResponse.data, function(instagramResponse_key, instagramResponse_item) {
                            if (instagramResponse_item.media_type == 'VIDEO') {
                                instagramGallery__images.append('<li><a href="' + instagramResponse_item.permalink + '" target="_blank" aria-label="Post do Instagram"><img src="' + instagramResponse_item.thumbnail_url + '" alt="Post do Instagram"></a></li>');
                            } else {
                                instagramGallery__images.append('<li><a href="' + instagramResponse_item.permalink + '" target="_blank" aria-label="Post do Instagram"><img src="' + instagramResponse_item.media_url + '" alt="Post do Instagram"></a></li>');
                            }
                        });
                        
                        $('.section-instagram').addClass('active');
                        
                        theme.instagramFeedSlide();
                    },
                    error: function(data) {
                      console.log('Instagram error:');
                      console.log(data);
                    }
                });
            }
            
        },
        
        instagramFeedSlide: function(){
            
            if (window.matchMedia('screen and (max-width: 767px)').matches && $('.section-instagram-content li').length) {
                var instagram_html = $('.section-instagram').html();
                
                $('.section-instagram').addClass('swiper-container');
                $('.section-instagram').html(instagram_html.replace('<ul', '<div class="swiper"><ul').replace('</ul>', '</ul></div>'));
                $('.section-instagram-content').addClass('swiper-wrapper');
                $('.section-instagram-content li').addClass('swiper-slide');

                new Swiper('.section-instagram .swiper', {
                    loop: true,
                    spaceBetween: 10,
                    slidesPerView: 3,
                    slidesPerGroup: 3
                });    
            }
            
        },

        initCookieAlert: function(){

            if ($('#msg-cookie').length) {
                if (!getCookie('msg_cookie_close')) {
                    $('body').addClass('msg-cookie');
                    $('#msg-cookie').addClass('active');
                }

                $('#msg-cookie > a').click(function(){
                  setCookie('msg_cookie_close', '1', 7);

                  $('#msg-cookie').remove();
                  $('body').removeClass('msg-cookie');
                });

                $('#msg-cookie p a').click(function(element){
                  element.preventDefault();

                  setCookie('msg_cookie_close', '1', 7);

                  window.location = $(this).attr('href');
                });
            }

        },
        
        initPopupNewsletter: function(){

            if ($('#popup-news').length) {
                if (!getCookie('popup_news_close')) {
                    $('#popup-news').addClass('active');
                }
                
                $(document).delegate('.popup-news-close', 'click', function(element){
                    if ($(element.target).hasClass('popup-news-close')) {
                        $('#popup-news').remove();
                        setCookie('popup_news_close', '1', 2);
                    }
                });
            }

        },

        scrollToElement: function (target, adjust = 0) {
            if (target && target !== "#") {
                $('html, body').animate({
                    scrollTop : Math.round($(target).offset().top) - adjust
                }, 600);
            }
        },
        
        menuToggle: function() {
            
            $('#menu-toggle').fadeIn('fast', function(){
                $('#menu-toggle').addClass('open');
                $('#menu-toggle').addClass('open-content');
            });
            
        },
        
        offerbutton: function(){
            
            var offerbutton_cron_day = '';
            var offerbutton_cron_month = '';
            var offerbutton_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerbutton_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerbutton_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerbutton_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerbutton-cron-date').length) {
                var offerbutton_cron_date = $('#offerbutton-cron-date').val();
                var offerbutton_cron_date_val = moment(offerbutton_cron_date, 'YYYY-MM-DD');

                if (offerbutton_cron_date_val.isValid()) {
                    var offerbutton_cron_date_start = new Date();
                    var offerbutton_cron_date_end = new Date(offerbutton_cron_date + ' 23:59:59');

                    if (offerbutton_cron_date_end > offerbutton_cron_date_start) {
                        offerbutton_cron_day = offerbutton_cron_date.split('-')[2];
                        offerbutton_cron_month = offerbutton_cron_date.split('-')[1];
                        offerbutton_cron_year = offerbutton_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-button-products').length && !getCookie('offerbutton_close') && (($('#offer-button-products .offer-button-top p').length && offerbutton_cron_day && offerbutton_cron_month && offerbutton_cron_year) || !$('#offer-button-products .offer-button-top p').length)) {
                
                $('#offer-button-products').addClass('active');
                
                $(document).delegate('#offer-button-products .offer-button-thumb div', 'click', function(){                    
                    $('#offer-button-products .offer-button-content').fadeIn('fast', function(){
                        $('#offer-button-products').addClass('open');
                        $('#offer-button-products').addClass('open-content');
                    });
                });
                
                $(document).delegate('#offer-button-products .offer-button-top .offer-button-close', 'click', function(){
                    $('#offer-button-products').removeClass('open-content');
                    
                    setTimeout(function(){
                        $('#offer-button-products .offer-button-content').fadeOut('fast', function(){
                            $('#offer-button-products').removeClass('open');
                        });
                    }, 500);
                });
                
                $(document).delegate('#offer-button-products .offer-button-content', 'click', function(element){
                    if ($(element.target).hasClass('offer-button-content')) {
                        $('#offer-button-products').removeClass('open-content');
                    
                        setTimeout(function(){
                            $('#offer-button-products .offer-button-content').fadeOut('fast', function(){
                                $('#offer-button-products').removeClass('open');
                            });
                        }, 500);
                    }
                });
                
                $(document).delegate('#offer-button-products .offer-button-thumb a', 'click', function(){
                    $('#offer-button-products').removeClass('active');
                    
                    setCookie('offerbutton_close', '1', 3);
                });
                
                if (offerbutton_cron_day && offerbutton_cron_month && offerbutton_cron_year) {
                    var start = new Date();
                    var end = new Date(offerbutton_cron_year + '-' + offerbutton_cron_month + '-' + offerbutton_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerbuttonCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-button-products .offer-button-top p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-button-products .offer-button-top p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-button-products .offer-button-top p span').html('00:00:00');
                        $('#offer-button-products').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerbuttonCountdown(time); }, 1000);
                      }
                    }

                    offerbuttonCountdown(time);
                } else {
                    $('#offer-button-products .offer-button-top p').remove();
                    $('.offer-button-container').addClass('offer-button-no-cron');
                }
                
                function offerbuttonScroll() {
                    var scroll = $(document).scrollTop() + window.innerHeight;
                    var element_height = (window.innerHeight - $('#offer-button-products .offer-button-thumb').height()) / 2;
                    
                    if ($('.newsletter').length) {
                        var element_top = $('.newsletter').offset().top - $('#offer-button-products .offer-button-thumb').height();
                        var footer = $('.newsletter').offset().top + element_height;
                    } else {
                        var element_top = $('.footer').offset().top - $('#offer-button-products .offer-button-thumb').height();
                        var footer = $('.footer').offset().top + element_height;
                    }
                    
                    if (scroll > footer) {
                        $('#offer-button-products .offer-button-thumb').css('top', element_top + 'px');
                        $('#offer-button-products .offer-button-thumb').css('position', 'absolute');
                    } else {
                        $('#offer-button-products .offer-button-thumb').removeAttr('style');
                    }
                }
                
                $(document).scroll(function(){
                    offerbuttonScroll();
                });
                
                offerbuttonScroll();
                
            }
            
        },
        
        offerbar: function(){
            
            var offerbar_cron_day = '';
            var offerbar_cron_month = '';
            var offerbar_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerbar_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerbar_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerbar_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerbar-cron-date').length) {
                var offerbar_cron_date = $('#offerbar-cron-date').val();
                var offerbar_cron_date_val = moment(offerbar_cron_date, 'YYYY-MM-DD');

                if (offerbar_cron_date_val.isValid()) {
                    var offerbar_cron_date_start = new Date();
                    var offerbar_cron_date_end = new Date(offerbar_cron_date + ' 23:59:59');

                    if (offerbar_cron_date_end > offerbar_cron_date_start) {
                        offerbar_cron_day = offerbar_cron_date.split('-')[2];
                        offerbar_cron_month = offerbar_cron_date.split('-')[1];
                        offerbar_cron_year = offerbar_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-bar').length && !getCookie('offerbar_close') && (($('#offer-bar p').length && offerbar_cron_day && offerbar_cron_month && offerbar_cron_year) || !$('#offer-bar p').length)) {
                
                $('#offer-bar').addClass('active');
                
                $(document).delegate('#offer-bar .offer-bar-close', 'click', function(){
                    $('#offer-bar').removeClass('active');
                    
                    setCookie('offerbar_close', '1', 3);
                });
                
                if (offerbar_cron_day && offerbar_cron_month && offerbar_cron_year) {
                    var start = new Date();
                    var end = new Date(offerbar_cron_year + '-' + offerbar_cron_month + '-' + offerbar_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerbarCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-bar p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-bar p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-bar p span').html('00:00:00');
                        $('#offer-bar').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerbarCountdown(time); }, 1000);
                      }
                    }

                    offerbarCountdown(time);
                } else {
                    $('#offer-bar p').remove();
                }
                
            }
            
        },
        
        offerslide: function(){
            
            var offerslide_cron_day = '';
            var offerslide_cron_month = '';
            var offerslide_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerslide_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerslide_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerslide_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerslide-cron-date').length) {
                var offerslide_cron_date = $('#offerslide-cron-date').val();
                var offerslide_cron_date_val = moment(offerslide_cron_date, 'YYYY-MM-DD');

                if (offerslide_cron_date_val.isValid()) {
                    var offerslide_cron_date_start = new Date();
                    var offerslide_cron_date_end = new Date(offerslide_cron_date + ' 23:59:59');

                    if (offerslide_cron_date_end > offerslide_cron_date_start) {
                        offerslide_cron_day = offerslide_cron_date.split('-')[2];
                        offerslide_cron_month = offerslide_cron_date.split('-')[1];
                        offerslide_cron_year = offerslide_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-slide').length && (($('#offer-slide .section-header p').length && offerslide_cron_day && offerslide_cron_month && offerslide_cron_year) || !$('#offer-slide .section-header p').length)) {
                
                $('#offer-slide').addClass('active');
                
                var swiper_slides = parseInt($('.section-showcase .list-product-offer').attr('data-slides'));
                var swiper_limit_slides = swiper_slides + 1;
                var swiper_number = $('.section-showcase .list-product-offer').length + 1;
                
                $('.section-showcase .list-product-offer .swiper').each(function(){
                    if ($(this).find('.item').length < swiper_limit_slides) {
                        var aux = 1;
                        var total = swiper_limit_slides / parseInt($(this).find('.item').length);
                        var html = $(this).find('.swiper-wrapper').html();

                        while (aux <= total) {
                            $(this).find('.swiper-wrapper').append(html);

                            aux++;
                        }
                    }

                    $(this).addClass('list-product-swiper-' + swiper_number);

                    new Swiper(this, {
                        spaceBetween: 10,
                        loop: true,
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        pagination: {
                            el                : '.list-product-swiper-' + swiper_number + ' .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : true
                        },
                        navigation: {
                          nextEl: '.list-product-swiper-' + swiper_number + ' .next',
                          prevEl: '.list-product-swiper-' + swiper_number + ' .prev',
                        },
                        breakpoints: {
                          1201: {
                            spaceBetween: 25,
                            slidesPerView: swiper_slides,
                            slidesPerGroup: swiper_slides
                          },
                          921: {
                            spaceBetween: 25,
                            slidesPerView: 4,
                            slidesPerGroup: 4
                          },
                          768: {
                            spaceBetween: 20,
                            slidesPerView: 3,
                            slidesPerGroup: 3
                          }
                        }
                    });

                    swiper_number++;
                });
                
                if (offerslide_cron_day && offerslide_cron_month && offerslide_cron_year) {
                    var start = new Date();
                    var end = new Date(offerslide_cron_year + '-' + offerslide_cron_month + '-' + offerslide_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerslideCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-slide .section-header p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-slide .section-header p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-slide .section-header p span').html('00:00:00');
                        $('#offer-slide').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerslideCountdown(time); }, 1000);
                      }
                    }

                    offerslideCountdown(time);
                } else {
                    $('#offer-slide .section-header p').remove();
                }
                
            }
            
        },
        
        product: function(){
            
            theme.initProductGallery();
            
            $('.product-form .product-rating').click(function(){
                var scroll = parseInt($('.product-reviews').offset().top) - 20;

                $('html, body').animate({
                    scrollTop: scroll
                }, 1000);
            });
            
            $(document).delegate('#btn-product-quantity-minus', 'click', function(){
                var input = $(this).closest('div').find('input');
                var min = parseInt(input.attr('min'));
                var quantity = parseInt(input.val()) - 1;

                if (quantity < min) {
                    quantity = min;
                }
                
                input.val(quantity);
            });
            
            $(document).delegate('#btn-product-quantity-plus', 'click', function(){
                var input = $(this).closest('div').find('input');
                var max = parseInt(input.attr('max'));
                var quantity = parseInt(input.val()) + 1;

                if (max > 0 && quantity > max) {
                    quantity = max;
                }
                
                input.val(quantity);
            });
            
            $(document).delegate('.product-social-share > button', 'click', function(){            
                $(this).closest('.product-social-share').find('.product-social-share-content').slideToggle();
            });
            
        },
        
        initProductGallery: function(){
            
            let productGalleryQty = $('.product-gallery .swiper-slide').length;
            
            if (productGalleryQty > 1) {
                $('.product-wrapper .product-box').removeClass('product-box-one-image');
                
                if (!$('.product-wrapper .product-gallery .product-images .swiper-button').length) {
                    $('.product-wrapper .product-gallery .product-images').append('<div class="swiper-button prev"><svg xmlns="http://www.w3.org/2000/svg" width="12.125" height="22.666" viewBox="0 0 12.125 22.666"><path d="M21.109.265a.917.917,0,0,1,1.29,0,.9.9,0,0,1,0,1.277L11.978,11.86a.917.917,0,0,1-1.29,0L.267,1.542a.9.9,0,0,1,0-1.277.917.917,0,0,1,1.29,0l9.776,9.41L21.108.265Z" transform="translate(12.125) rotate(90)" fill="#151414"/></svg></div>');
                    $('.product-wrapper .product-gallery .product-images').append('<div class="swiper-button next"><svg xmlns="http://www.w3.org/2000/svg" width="12.125" height="22.666" viewBox="0 0 12.125 22.666"><path d="M21.109.265a.917.917,0,0,1,1.29,0,.9.9,0,0,1,0,1.277L11.978,11.86a.917.917,0,0,1-1.29,0L.267,1.542a.9.9,0,0,1,0-1.277.917.917,0,0,1,1.29,0l9.776,9.41L21.108.265Z" transform="translate(0 22.666) rotate(-90)" fill="#151414"/></svg></div>');
                    $('.product-wrapper .product-gallery .product-images').append('<div class="dots"></div>');
                }
                
                if ($('.product-wrapper .product-box').hasClass('product-box-kit')) {
                    var desktopSlidesPerView = 1;
                } else {
                    var desktopSlidesPerView = 2;
                }
                  
                let gallerySettings = {
                    loop: true,
                    spaceBetween: 10,
                    breakpoints :{
                        0 :{
                            slidesPerView: 1,
                            slidesPerGroup: 1
                        },
                        1200 :{
                            slidesPerView: desktopSlidesPerView,
                            slidesPerGroup: 1
                        }
                    },
                    navigation: {
                        nextEl: '.product-gallery .product-images .next',
                        prevEl: '.product-gallery .product-images .prev',
                    },
                    pagination: {
                        el : '.product-gallery .product-images .dots',
                        bulletClass : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable : true
                    },
                    on: {
                        init: function() {
                            if (this.slides.length === 1) {
                                this.unsetGrabCursor();
                                this.allowTouchMove = false;
                            }
    
                            let wrapper1 = $('.product-wrapper .product-gallery').find(`.image[data-index="1"]:first .image-zoom`);

                            if (!wrapper1.find('img:first').next().length) {
                                wrapper1.zoom({
                                    touch : false,
                                    url : wrapper1.find('img').attr('src').split('?w=')[0]
                                });
                            }
                            
                            let wrapper2 = wrapper1.closest('.image').next('.image').find('.image-zoom');
    
                            if (!wrapper2.find('img:first').next().length) {
                                wrapper2.zoom({
                                    touch : false,
                                    url : wrapper2.find('img').attr('src').split('?w=')[0]
                                });
                            }
    
                        },
                        slideChangeTransitionEnd: function() {                            
                            let wrapper1 = $('.product-wrapper .product-gallery').find(`.image.swiper-slide-next .image-zoom`);

                            if (wrapper1.find('img').attr('src') && !wrapper1.find('img:first').next().length) {
                                wrapper1.zoom({
                                    touch : false,
                                    url : wrapper1.find('img').attr('src').split('?w=')[0]
                                });
                            }
    
                        }
                    }
                };
    
                this.settings.productGallery = new Swiper('.product-wrapper .product-gallery .product-images', gallerySettings);
            } else {
                $('.product-wrapper .product-box').addClass('product-box-one-image');
                
                let wrapper1 = $('.product-wrapper .product-gallery .image .image-zoom');
    
                if (!wrapper1.find('img:first').next().length) {
                    wrapper1.zoom({
                        touch : false,
                        url   : wrapper1.find('img').attr('src').split('?w=')[0]
                    });
                }
            }
            
            if ($('#selected-quantity').length) {
                $('#selected-quantity').mask('0#');
                
                $('#selected-quantity').on('input', function(){
                    var input = $(this);
                    var min = parseInt(input.attr('min'));
                    var max = parseInt(input.attr('max'));
                        
                    setTimeout(function(){
                        var quantity = parseInt(input.val());
                        
                        if (quantity < min) {
                            quantity = min;
                            
                            input.val(quantity);
                        } else if (max > 0 && quantity > max) {
                            quantity = max;
                            
                            input.val(quantity);
                        }
                    }, 100);
                });
            }
            
        }

    };

	$(function() {
        
        theme.header();
        theme.toggleSidebar();
        theme.bannersCarousel();
        theme.menuCarousel();
        theme.spotCarousel();
        theme.brandsCarousel();
        theme.filter();
        // theme.instagramFeed();
        // theme.offerbutton();
        // theme.offerbar();
        // theme.offerslide();
        
        if ($('body').hasClass('page-product')) {
            theme.product();
            // theme.toggleProductVideo();
            // theme.goToProductReviews();
        }
        
    });

})(jQuery, this);