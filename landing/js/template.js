$(document).ready(function() {
/** ---------------------------------
*	Init
*/	 ---------------------------------
	'use strict';
	
	$('#navbar').scrollspy();
	
/** ---------------------------------
* FlexSlider
*/---------------------------------
	$('#main-slider').flexslider({
		directionNav: true,
		controlNav: false,
		prevText: "",
		nextText: "", 
		slideshow: true,

	});
	
	$('#main-slider .slides li').css('height', $(window).height());

    $('#main-slider .slides li').each(function () {
        var background_src = $('.slider-bg').attr('src');
        $(this).children('.slider-bg').remove();
        $(this).css('background', 'url("' + background_src + '")');
    });

/** ---------------------------------
*	Template elements Animations
*/ ---------------------------------
	
	var left_items = $(".left"),
		right_items = $(".right"),
		bottom_items = $(".bottom"),
		left_top_items = 0,
		right_top_items = 0,
		bottom_top_items = 0;
	
	$(window).load(function () {
		left_top_items = left_items.map(function() { return $(this).position().top; });
		right_top_items = right_items.map(function() { return $(this).position().top; });
		bottom_top_items = bottom_items.map(function() { return $(this).position().top; });
		
		if($(window).scrollTop() > $(window).height())
		{
			var scrollonscreen = $(window).scrollTop() + $(window).height();
			
			$(left_top_items).each(function (i) {
				if (scrollonscreen > this)
					$(left_items[i]).css({left: 0});
			});
		
			$(right_top_items).each(function (i) {
				if (scrollonscreen > this)
					$(right_items[i]).css({right: 0});
			});
		
			$(bottom_top_items).each(function (i) {
				if (scrollonscreen > this - 1100)
					$(bottom_items[i]).css({bottom: 0});
			});
			
		}
	});
	
	$('#main-slider .slides li').css('padding-top', ($(window).height() / 2) - ($('.slide-content').height() / 2));
	$('.flex-control-nav').css('top',( $(window).height() - 100));
	$('.flex-direction-nav a').css('top',( $(window).height()/2));
	
	$(window).scroll(function () {
		
		// Parralax
		var scaleBg = -$(window).scrollTop() / 4;
		
		var iOS = false,
			device = navigator.platform;
	
		if (device === 'iPad' || device === 'iPhone' || device === 'iPod') {
			iOS = true;
		}
		
		if (iOS === false) {
			$('#main-slider .slides li').css('background-position-y', scaleBg);
			$('.content-block.contact').css('background-position-y', scaleBg + $('.content-block.contact').offset().top - 120);
			
		}
			
		var scrollonscreen = $(window).scrollTop() + $(window).height();
		
		$(left_top_items).each(function (i) {
			if (scrollonscreen > this)
				$(left_items[i]).css({left: 0});
		});
	
		$(right_top_items).each(function (i) {
			if (scrollonscreen > this)
				$(right_items[i]).css({right: 0});
		});
	
		$(bottom_top_items).each(function (i) {
			if (scrollonscreen > this - 1100)
				$(bottom_items[i]).css({bottom: 0});
		});
	
		if ($(window).scrollTop() >= $(".homepage").height()) {
			$(".navbar").css({position: "fixed", top: "0px"});
		} else {
			$(".navbar").css({position: "relative", top: "-70px"});
		}
	
	});

	
	
/** ---------------------------------
*	Resize events
*/ ---------------------------------
	
	$(window).resize(function () {
		
    	$('#main-slider .slides li').css('padding-top', ($(window).height() / 2) - ($('.slide-content').height() / 2));
		$('.flex-control-nav').css('top',( $(window).height() - 100));
		$('.flex-direction-nav a').css('top',( $(window).height()/2));
		
		$(".portfolio-item-block .details").css('width', $("body").width());
		$(".intro-block").css("height", $(window).height());
		$(".fullwidthbanner-container").css("height", $(window).height());
		
	});

/** ---------------------------------
*	Portfolio
*/ ---------------------------------
	
	$(".portfolio-item-block").on('click',function() {
		
		var current_portfolio_item = this;
		
		if ($("body").width() >= 734) {
			
			if ($(this).is(".open")) {
				$(".portfolio-item-block").css("margin-bottom", 0);
				$(".details").fadeOut();
				$(".portfolio-item-block").removeClass("open");
				
			} else {
				$(".portfolio-item-block").css("margin-bottom", 0);
				$(".portfolio-item-block").removeClass("open");
				$(".details").fadeOut();
				$(".portfolio-list").addClass("static");
				$(current_portfolio_item).addClass("open");
				
				/* Uncomment this line if you wish to auto scroll to opened details block 
				
				$("html, body").animate({scrollTop: $(current_portfolio_item).position().top + $(current_portfolio_item).height() }, 500);
				
				*/
				
				if($(current_portfolio_item).attr("data-item") == 1)
				{
				
						$(current_portfolio_item).css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).next(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).next(".portfolio-item-block").next(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
				}
				if($(current_portfolio_item).attr("data-item") == 2)
				{	
					
						$(current_portfolio_item).css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).prev(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).next(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
				}
				if($(current_portfolio_item).attr("data-item") == 3)
				{
				
						$(current_portfolio_item).css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).prev(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
						$(current_portfolio_item).prev(".portfolio-item-block").prev(".portfolio-item-block").css("margin-bottom", $(".details", current_portfolio_item).height() + 80);
				
				}
				
				$(".details", current_portfolio_item).fadeIn(100);
		
			}
		} 
		else 
		{
			if ($(this).is(".open")) {
				$(".portfolio-item-block").css("margin-bottom", 0).removeClass("open");
				$(".details").fadeOut();
			} else {
				
				$(".portfolio-item-block").css("margin-bottom", 0).removeClass("open");
				$(".details").fadeOut();
				$(".portfolio-list").addClass("static");
				$(current_portfolio_item).addClass("open");
				$(current_portfolio_item).css("margin-bottom", $(".details", current_portfolio_item).height() + 75);
				$(".details", current_portfolio_item).fadeIn();

			}	
		}
	});
	
	
	$(".close-details").on('click',function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(".portfolio-item-block").css("margin-bottom", 0);
		$(".details").fadeOut();
		$(".portfolio-item-block").removeClass("open");
	});
	
	$(".details").on('click',function(e) {
		e.stopPropagation();
		return false;
	});
	
/** ---------------------------------
*	Other scripts
*/ ---------------------------------

	$(".intro-block").css("height", $(window).height());
	$(".fullwidthbanner-container").css("height", $(window).height());
	
	$(".navbar a").on('click',function() {
		if($($(this).attr("href")).position())
		{
			$("html, body").animate({scrollTop: $($(this).attr("href")).position().top - 70}, 500);
			$(".nav-collapse").css("height", 0);
			$(".nav-collapse").removeClass("in");
			return false;
		}
		
	});
	
	$(".skip-intro").on('click',function() {
		$("html, body").animate({scrollTop: $(".intro-block").height() }, 500);
		return false;
	});



$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').on('click',function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	

	'use strict';



    	$('.animated').appear(function() {

	        var elem = $(this);

	        var animation = elem.data('animation');

	        if ( !elem.hasClass('visible') ) {

	        	var animationDelay = elem.data('animation-delay');

	            if ( animationDelay ) {



	                setTimeout(function(){

	                    elem.addClass( animation + " visible" );

	                }, animationDelay);



	            } else {

	                elem.addClass( animation + " visible" );

	            }

	        }

	    });




});