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
});
