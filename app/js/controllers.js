'use strict';

/* Controllers */

var wmForceEd = angular.module('wmForceEd', ['ngSanitize']);

wmForceEd.controller('wmForceEdCtrl', function($scope, $http) {
	$http.get('data.json').success(function(data) {
		$scope.units = data['units'];
		$scope.formations = data['formations'];
		$scope.skills = data['skills'];
		$scope.types = data['types'];
		$scope.subtypes = data['subtypes'];
	});
	$scope.getNumber = function(num) {
		var a = [];
		for(var i = 0; i < num; i++)
			a.push(i);
		return a;   
	};
	$scope.getFormationCount = function(num) {
		if(typeof $scope.formations === 'undefined') return [];
		return $scope.getNumber($scope.formations[$scope.formationActualSelect][num]);   
	};
	$scope.unique = function(u){
		if(u == 0) return "";
		else return "Unique";
	};
	$scope.getDescription = function(id){
		var unitSkills = $scope.units[id]['unitAbilities'].split(';');
		var text = "";
		for(var i = 0, n = unitSkills.length; i < n; i++){
			var sk = unitSkills[i];
			if(sk === '') break;
			var s_explode = sk.split('|'),
				sid = s_explode[0],
				sp = s_explode[1];
			text += "<b>"+$scope.skills[sid]['skillName']+" ("+(100*sp)+"%): </b>"+$scope.skills[sid]['skillDescription']+"<br />";
		}
		return text;
	};
	$scope.copyTooltip = function(id){
		var el = document.getElementById('unit-' + id);
		if(el != null)
			document.getElementById('tooltip').innerHTML = el.innerHTML;
	}
	$scope.formationSelect = 1;
	$scope.formationActualSelect = 1;
});
