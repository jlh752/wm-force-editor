'use strict';

describe('directives', function() {	
	var testData = {
		"units":{
			"2001":{"unitID":"2001","unitName":"Infantry","unitImage":"basicinfantry.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"1","unitDefence":"1","unitAbilities":"","unitPriority":1,"unitIronwill":"0","unitHidden":"0","unitStealth":"0"},
			"2003":{"unitID":"2003","unitName":"Marine","unitImage":"spacemarineJ.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"18","unitDefence":"18","unitAbilities":"","unitPriority":26,"unitIronwill":"0","unitHidden":"0","unitStealth":"0"}
		},
		"formations":{"1":{"formationName":"Standard","formationAbility":"","1":"1","2":"2","4":"0","11":"0","12":"0"}},
		"skills":{},
		"types":{"2":{"typeName":"Assault"}},
		"subtypes":{"3":{"subtypeName":"Infantry"}}
	};
	beforeEach(module('wmForceEd'));
	
	var $scope, element, ctrl;
	
	it('background image binds to mid', inject(function ($rootScope, $compile, $controller){
		$scope = $rootScope.$new();
		ctrl = $controller('wmForceEdCtrl', {$scope: $scope});
		$scope.loadData(testData);
		
		element = angular.element("<div><div class='unit-sidebar' ng-repeat='(unitID,unit) in units' mid={{unitID}} back-img></div></div>");
		element = $compile(element)($scope);
		$rootScope.$digest();
		
		var el = $(element.find(".unit-sidebar")[0]);
		expect(el.css('background-image')).toBe('url("http://www.joshhummel.com/images/units/basicinfantry.jpg")');
		el.attr("mid", '2003');
		$rootScope.$digest();
		expect(el.css('background-image')).toBe('url("http://www.joshhummel.com/images/units/spacemarineJ.jpg")');
	}));
	
	it('keypress test', inject(function ($rootScope, $compile, $controller){
		$scope = $rootScope.$new();
		ctrl = $controller('wmForceEdCtrl', {$scope: $scope});
		element = angular.element("<body><div id='holder' key-checker></div></body>");
		element = $compile(element)($scope);
		$rootScope.$digest();
		
		expect($scope.shiftDown).toBe(false);
		$('body').trigger(jQuery.Event('keydown', {shiftKey: true}));
		expect($scope.shiftDown).toBe(true);
	}));
});
