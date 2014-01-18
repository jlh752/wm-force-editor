'use strict';

/* Directives */
wmForceEd.directive('backImg', function(){
	var executor = function(scpe, el, value) {
		if(value in scpe.units){
			var url = "http://www.joshhummel.com/images/units/"+scpe.units[value].unitImage;
			if(url.charAt(url.length-1) == '/') url += "!.jpg";
			el.css({
				'background-image': 'url(' + url +')',
				'background-size' : 'cover'
			});
		}
	};
	
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			scope.$watch(
				function(){return element.attr('mid');},
				function(v){executor(scope, element, v);},
				true
			);
			executor(scope, element, element.attr('mid'));
		}
	};
});
wmForceEd.directive('stickySidebar', function(){
	var sticky_relocate = function(){
		var window_top = $(window).scrollTop();
		$('#scroller').removeClass('sticky');
		$("#scroller").height($(window).height()-$("#scroller").offset().top +window_top);
		$("#unused").height($("#scroller").height()-$(".topbox").height());
		$("#force").height($(window).height()-$("#force").offset().top +window_top);
	};
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			$(window).on({
				scroll: function(e){
					sticky_relocate();
				},
				resize: function(e){
					sticky_relocate();
				}
			});
			$('#scroller').css("min-height", $(window).height()+$(window).scrollTop() - $("#unused").offset().top);
			setInterval(sticky_relocate, 1000);
		}
	};
});

wmForceEd.directive('keyChecker', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			$("body").on({
				keydown: function(e){
					scope.shiftDown = e.shiftKey;
				},
				keyup: function(e){
					scope.shiftDown = e.shiftKey;
				}
			});
		}
	};
});

wmForceEd.directive('layout', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			var params = eval("("+attrs['layout']+")");
			$(element).layout(params);
		}
	};
});
