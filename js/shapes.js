$(document).ready(function() {
    /*============================================
     Page Preloader
     ==============================================*/

    $(window).load(function(){
        $('#page-loader').fadeOut(500);
    })

    /*============================================
     Background Slider
     ==============================================*/
    var backImages = $('#backgrounds').data('backgrounds').split(',');

    $.backstretch(backImages, {
        fade: 500,
        duration: 4000
    });

    if(!$('#color-overlay').length){$('body').addClass('no-overlay');}

    /*============================================
     Navigation Functions
     ==============================================*/
    if ($(window).scrollTop()===0){
        $('#main-nav').removeClass('scrolled');
    }
    else{
        $('#main-nav').addClass('scrolled');
    }

    $(window).scroll(function(){
        if ($(window).scrollTop()===0){
            $('#main-nav').removeClass('scrolled');
        }
        else{
            $('#main-nav').addClass('scrolled');
        }
    });

    $('#main-nav').css({'top':-100,'opacity':0});

    $(window).load(function(){
        $('#main-nav').delay(500).animate({'top':0,'opacity':1},500);
    });
    /*============================================
     ScrollTo Links
     ==============================================*/
    $('a.scrollto').click(function(e){
        $('html,body').scrollTo(this.hash, this.hash, {gap:{y:-120}});
        e.preventDefault();

        if ($('.navbar-collapse').hasClass('in')){
            $('.navbar-collapse').removeClass('in').addClass('collapse');
        }
    });

    /*============================================
     Header Functions
     ==============================================*/
    $('.jumbotron').height($(window).height());
    $('.header-logo').css({'marginTop':$(window).height()*0.25});
    $('.jumbotron .container').addClass('scale-in');

    $('.home-slider').flexslider({
        animation: "slide",
        directionNav: false,
        controlNav: false,
        direction: "vertical",
        slideshowSpeed: 3000,
        animationSpeed: 500,
        pauseOnHover:false,
        pauseOnAction:false,
        smoothHeight: true
    });

    $(window).scroll( function() {
        var st = $(this).scrollTop();
        $('.jumbotron').css({ 'opacity' : (1 - st/250) });
        //$('.jumbotron .container').css({'top':st});
    });

    $(window).load(function(){
        $('.jumbotron').delay(500).animate({'height':$(window).height()-80},500);

        setTimeout(function(){
            $('.jumbotron .container').addClass('in');
        },1000);
    });
    /*============================================
     About Functions
     ==============================================*/

    $('#about .collapse').on('show.bs.collapse', function () {
        $(this).prev('.details-btn')
            .find('.fa')
            .removeClass('fa-plus')
            .addClass('fa-minus');
    });

    $('#about .collapse').on('hide.bs.collapse', function () {
        $(this).prev('.details-btn')
            .find('.fa')
            .removeClass('fa-minus')
            .addClass('fa-plus');;
    });

    $('#about .collapse').on('shown.bs.collapse', function () {
        scrollSpyRefresh();
        waypointsRefresh();
    });

    $('#about .collapse').on('hidden.bs.collapse', function () {
        scrollSpyRefresh();
        waypointsRefresh();
    });

    /*============================================
     Project thumbs - Masonry
     ==============================================*/
    $(window).load(function(){

        $('#projects-container').css({visibility:'visible'});

        $('#projects-container').masonry({
            itemSelector: '.project-item:not(.filtered)',
            columnWidth:350,
            isFitWidth: true,
            isResizable: true,
            isAnimated: !Modernizr.csstransitions,
            gutterWidth: 20
        });

        scrollSpyRefresh();
        waypointsRefresh();
    });

    /*============================================
     Filter Projects
     ==============================================*/
    var filters = [];

    $('#filter-works ul').each(function(i){
        filters[i] = {
            name:$(this).data('filter'),
            val : '*'
        };
    });

    $('#filter-works a').click(function(e){
        e.preventDefault();

        closePreview();

        $(this).parents('ul').find('li').removeClass('active');

        $(this).parent('li').addClass('active');

        for (var i=0; i<filters.length; i++){
            if($(this).data(filters[i].name)){filters[i].val = $(this).data(filters[i].name);}
        }

        $('.project-item').each(function(){

            var match;

            for (var i=0; i<filters.length; i++){
                if($(this).is(filters[i].val)){match = true;}
                else{match = false;break;}
            }

            if(match){
                $(this).removeClass('filtered');
            }
            else{
                $(this).addClass('filtered');
            }

        });

        $('#projects-container').masonry('reload');

        var results = $('.project-item').not('.filtered').length;
        $('.filter-results span').html(results+'');
        $('.filter-results').slideDown();


        scrollSpyRefresh();
        waypointsRefresh();
    });

    /*============================================
     Project Preview
     ==============================================*/
    $('.project-item').click(function(e){
        e.preventDefault();

        if($(this).hasClass('active')){return false;}
        $('.project-item').removeClass('active');


        var elem =$(this);

        $('html,body').scrollTo(0,'#preview-scroll',
            {
                gap:{y:-120},
                animation:{
                    duration:600
                }
            });

        $('#preview-loader').addClass('show');

        if($('#project-preview').hasClass('open')){
            closePreview();
            elem.addClass('active');
            setTimeout(function(){
                buildPreview(elem);
            },1000);
        }else{
            elem.addClass('active');
            buildPreview(elem);
        }

    });

    $('.close-preview').click(function(e){
        e.preventDefault();

        closePreview();
    });

    function buildPreview(elem){

        var previewElem = $('#project-preview'),
            title = elem.find('.project-title').text(),
            descr = elem.find('.project-description').html();

        previewElem.find('.preview-title').text(title);

        previewElem.find('#preview-details ul').empty();
        elem.find('.project-attributes .newline').each(function(){
            previewElem.find('#preview-details ul').append('<li>'+$(this).html()+'</li>')
        });

        previewElem.find('#preview-content').html(descr);

        /*----Project with Image-----*/
        if(elem.find('.project-media').data('images')){

            var slidesHtml = '<ul class="slides">',
                slides = elem.find('.project-media').data('images').split(',');

            for (var i = 0; i < slides.length; ++i) {
                slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
            }

            slidesHtml = slidesHtml + '</ul>';
            previewElem.find('#preview-media').addClass('flexslider').html(slidesHtml);

            $('#preview-media img').load(function(){
                $('#preview-media.flexslider').flexslider({
                    slideshowSpeed: 3000,
                    animation: 'slide',
                    pauseOnAction: false,
                    pauseOnHover: true,
                    start: function(){
                        setTimeout(function(){
                            openPreview();
                            $('#preview-loader').removeClass('show');
                            $(window).trigger('resize');
                        },1000)
                    }
                });
            });

        }

        /*----Project with Video-----*/
        if(elem.find('.project-media').data('video')){

            var media = elem.find('.project-media').data('video');

            previewElem.find('#preview-media').html(media);

            $('#preview-media iframe').load(function(){
                $('#preview-media').fitVids();

                setTimeout(function(){
                    openPreview();
                    $('#preview-loader').removeClass('show');
                },1000);

            });
        }

        /*----Project with PDF-----*/
        if(elem.find('.project-media').data('pdf')){

            var slidesHtml = '<ul class="slides">',
                slides = elem.find('.project-media').data('pdf').split(',');

            for (var i = 0; i < slides.length; ++i) {
                slidesHtml = slidesHtml + '<li class="pdf" style="height:450px"><img src="'+slides[i]+'" alt=""></li>';
            }

            slidesHtml = slidesHtml + '</ul>';
            previewElem.find('#preview-media').addClass('flexslider').html(slidesHtml);

            $('#preview-media img').load(function(){

                $('#preview-media.flexslider').flexslider({
                    slideshowSpeed: 3000,
                    animation: 'slide',
                    pauseOnAction: false,
                    pauseOnHover: true,
                    start: function(){
                        setTimeout(function(){
                            openPreview();
                            $('#preview-loader').removeClass('show');
                            $(window).trigger('resize');
                            var a=document.getElementsByClassName('pdf flex-active-slide');
                            a[0].innerHTML='<iframe src="'+elem.find('.project-media').data('granth')+'" height = "100%" frameborder="no" width = "100%"></iframe>';
                        },1000)
                    }
                });
            });

        }

    }

    function openPreview() {

        $('#project-preview-wrapper').slideDown(600,function(){

            scrollSpyRefresh();
            waypointsRefresh();
        });
        $('#project-preview').addClass('open');


    }

    function closePreview() {

        $('#project-preview-wrapper').slideUp(600,function(){
            if($('#preview-media').hasClass('flexslider')){
                $('#preview-media').removeClass('flexslider')
                    .flexslider('destroy');
            }

            $('#preview-media').html('');
            scrollSpyRefresh();
            waypointsRefresh();
        });
        $('#project-preview').removeClass('open');
        $('.project-item').removeClass('active');
    }

    /*============================================
     Twitter Functions
     ==============================================*/
    // var tweetsLength = $('#twitter-slider').data('tweets-length'),
    // 	widgetID = $('#twitter-slider').data('widget-id');

    // twitterFetcher.fetch(widgetID, 'twitter-slider', tweetsLength, true, false, true, '', false, handleTweets);

    // function handleTweets(tweets){

    // 	var x = tweets.length,
    // 		n = 0,
    // 		tweetsHtml = '<ul class="slides">';

    // 	while(n < x) {
    // 		tweetsHtml += '<li>' + tweets[n] + '</li>';
    // 		n++;
    // 	}

    // 	tweetsHtml += '</ul>';
    // 	$('#twitter-slider').html(tweetsHtml);

    // 	$('.twitter_reply_icon').html("<i class='fa fa-reply'></i>");
    // 	$('.twitter_retweet_icon').html("<i class='fa fa-retweet'></i>");
    // 	$('.twitter_fav_icon').html("<i class='fa fa-star'></i>");

    // 	$('.twitter_reply_icon').data({'toggle':'tooltip','placement':'bottom'}).attr({'title':'Reply'}).tooltip();
    // 	$('.twitter_retweet_icon').data({'toggle':'tooltip','placement':'bottom'}).attr({'title':'Retweet'}).tooltip();
    // 	$('.twitter_fav_icon').data({'toggle':'tooltip','placement':'bottom'}).attr({'title':'Favorite'}).tooltip();
    // 	$('#twitter-slider').flexslider({
    // 		prevText: '<i class="fa fa-angle-left"></i>',
    // 		nextText: '<i class="fa fa-angle-right"></i>',
    // 		slideshowSpeed: 5000,
    // 		useCSS: true,
    // 		controlNav: false,
    // 		pauseOnAction: false,
    // 		pauseOnHover: true,
    // 		smoothHeight: false
    // 	});


    // }

    /*============================================
     Testimonials Slider
     ==============================================*/

    $('#testimonials-slider').flexslider({
        prevText: '<i class="fa fa-angle-left"></i>',
        nextText: '<i class="fa fa-angle-right"></i>',
        animation: 'slide',
        slideshowSpeed: 5000,
        useCSS: true,
        directionNav: false,
        pauseOnAction: false,
        pauseOnHover: true,
        smoothHeight: false
    });

    /*============================================
     Resize Functions
     ==============================================*/
    $(window).resize(function(){
        $('.jumbotron').height($(window).height()-80);
        $('.header-logo').css({'marginTop':$(window).height()*0.25});
        scrollSpyRefresh();
        waypointsRefresh();
    });

    /*============================================
     Project Loader on IE
     ==============================================*/
    $('.no-cssanimations #preview-loader').html('<div class="loader-gif"></div>');

    /*============================================
     Tooltips
     ==============================================*/
    $("[data-toggle='tooltip']").tooltip();

    /*============================================
     Placeholder Detection
     ==============================================*/
    if (!Modernizr.input.placeholder) {
        $('#contact-form').addClass('no-placeholder');
    }

    /*============================================
     Scrolling Animations
     ==============================================*/
    $('.scrollimation').waypoint(function(){
        $(this).addClass('in');
    },{offset:function(){
        var h = $(window).height();
        if ($('body').height() - $(this).offset().top > h*0.3){
            return h*0.7;
        }else{
            return h;
        }
    }
    });

    /*============================================
     Refresh scrollSpy function
     ==============================================*/
    function scrollSpyRefresh(){
        setTimeout(function(){
            $('body').scrollspy('refresh');
        },1000);
    }

    /*============================================
     Refresh waypoints function
     ==============================================*/
    function waypointsRefresh(){
        setTimeout(function(){
            $.waypoints('refresh');
        },1000);
    }

});	