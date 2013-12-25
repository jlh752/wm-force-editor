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
wmForceEd.directive('setupDirective', function() {
	return function(scope, element, attrs) {
		//if(scope.$last){
			makeDraggable(element);//setupSidebar(element);
		//}
	};
});