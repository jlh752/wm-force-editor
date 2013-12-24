'use strict';

/* Controllers */

var wmForceEd = angular.module('wmForceEd', []);

wmForceEd.controller('wmForceEdCtrl', function($scope, $http) {
	$http.get('data.json').success(function(data) {
		$scope.units = data['units'];
		$scope.formations = data['formations'];
		$scope.skills = data['skills'];
		$scope.types = data['types'];
		$scope.subtypes = data['subtypes'];
	});

	$scope.copyTooltip = function(id){console.log(id);
		var el = document.getElementById('unit-' + id);
		if(el != null)
			document.getElementById('tooltip').innerHTML = el.innerHTML;
	}
	$scope.formationSelect = 1;
	$scope.formationActualSelect = 1;
});
