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
wmForceEd.directive('setupDraggable', function() {
	return function(scope, element, attrs){
		makeDraggable(element);
	}

});
wmForceEd.directive('setupDroppable', function() {
	//watch the variable sid instead of running right away
	//it is needed in the function but is not interpolated before the function is called
	return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.sid, function(value){
                makeDroppable(element);
            });
        }
    };
});
wmForceEd.directive('keyChecker', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			$(element).on({
				keydown: function(e){
					setShift(e.shiftKey);
				},
				keyup: function(e){
					setShift(e.shiftKey);
				}
			});
		}
	};
});