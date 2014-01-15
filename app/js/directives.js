'use strict';

/* Directives */
wmForceEd.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
		if(url.charAt(url.length-1) == '/') url += "!.jpg";
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
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