'use strict';

/* Filters */
wmForceEd.filter('unitCategoryFilter', function() {
	return function(input, type) {
		var out = [];
		for(var i in input){
			if(input[i].unitClass == type){
				out.push(input[i]);
			}
		}
		return out;
	};
});
wmForceEd.filter('subtypeFilter', function() {
	return function(input, type){
		var out = [];
		if(type == '' || type == undefined) return input;
		for(var i in input){
			if(input[i].unitType1 == type || input[i].unitType2 == type)
				out.push(input[i]);
		}
		return out;
	};
});
wmForceEd.filter('hidden', function() {
	return function(input, hide){
		var out = [];
		if(!hide) return input;
		for(var i in input){
			if(input[i].unitHidden === '0')
				out.push(input[i]);
		}
		return out;
	};
});
wmForceEd.filter('toarray', function() {
	return function(input, type){
		var out = [];
		for(var i in input){
			input[i].id = i;
			out.push(input[i]);
		}
		return out;
	};
});