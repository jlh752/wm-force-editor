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
wmForceEd.directive('keyChecker', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			$(element).on({
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