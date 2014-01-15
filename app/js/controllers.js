'use strict';

/* Controllers */

var wmForceEd = angular.module('wmForceEd', ['ngSanitize']);

wmForceEd.controller('wmForceEdCtrl', function($scope, $http) {
	$scope.formationSelect = 1;
	$scope.formationActualSelect = 1;
	$scope.hide = 1;//hide unreleased units
	$scope.shiftDown = false;
	$scope.forceData = {};
	
	$http.get('data.json').success(function(data) {
		$scope.units = data['units'];
		$scope.formations = data['formations'];
		$scope.skills = data['skills'];
		$scope.types = data['types'];
		$scope.subtypes = data['subtypes'];
		
		$scope.padForce();
	});
	$scope.padForce = function(){
		for(var t in $scope.types){
			if(typeof $scope.forceData[t] === "undefined")
				$scope.forceData[t] = [];
			var l = $scope.formations[$scope.formationActualSelect][t];
			if(t == 50) l = 50;
			while($scope.forceData[t].length < l)
				$scope.forceData[t].push(0);
			if($scope.forceData[t].length >= l)
				$scope.forceData[t] = $scope.forceData[t].slice(0, l);
		}
	};
	
	$scope.getNumber = function(num) {
		var a = [];
		for(var i = 0; i < num; i++)
			a.push(i);
		return a;
	};
	$scope.getFormationCount = function(num) {
		if(typeof $scope.formations === 'undefined') return [];
		return $scope.getNumber(num != 50?$scope.formations[$scope.formationActualSelect][num]:50);   
	};
	$scope.unique = function(u, text){//converts 0/1 notation into text for unique
		if(u == 0) return "";
		else return text;
	};
	
	//generate tooltip suitable version of description text
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
	};
	
	$scope.setFormation = function(){
		$scope.formationActualSelect = $scope.formationSelect;
		$scope.padForce();
	};
	$scope.showCode = function(){
		var out = "<textarea>1,";
		out += $scope.formationActualSelect + ",";
		$('.unit-force').each(function(ind, e){
			if($(e).is("[aid]")){
				if($(e).children().length == 0)
					out += $(e).attr("sid") + ",";
			}else{
				out += $(e).attr("mid") + ",";
			}
		});
		$('#save_output').html(out+"</textarea>").dialog({
			title: 'Force Code',
			buttons: {
				"OK": function() {
					$(this).dialog("close");
				},
			}
		});
	};
	$scope.initLoader = function(){
		$("#forceLoader").dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				"Load": function() {
					$scope.loadForceCode($("#forcecode").val());
					$(this).dialog("close");
				},
				"Cancel": function(){
					$(this).dialog("close");
				}
			}
		});
	};
	$scope.loadForce = function(){
		$("#forceLoader").dialog("open");
	};
	
	//add a unit to first free slot
	$scope.addUnit = function(id){
		var I = parseInt(id);
		if(isNaN(I)) return;
		
		var unitType = I <= 50?I:$scope.units[I].unitClass, valid = true;
		var pos = 0, maxl = $scope.formations[$scope.formationActualSelect][unitType];
		if(unitType == 50) maxl = 50;
		
		while(pos < maxl){
			if($scope.forceData[unitType][pos] == 0)
				break;
			pos++;
		}

		//overflow into reinforcements
		if(pos == maxl){
			unitType = 50;
			pos = 0;
			while(pos < 50){
				if($scope.forceData[unitType][pos] == 0)
					break;
				pos++;
			}
			if(pos == 50)
				valid = false;
		}
		
		if(valid){
			$scope.addToSlot(unitType, pos, I);
		}
	};
	
	$scope.addToSlot = function(section, slot, id){
		var unitType, valid = true;
		if(id <= 50){
			unitType = id;
		}else{
			unitType = $scope.units[id].unitClass;
			//no duplicate uniques
			if($scope.units[id].unitUnique == 1){
				if($scope.forceData[unitType].indexOf(id) != -1 || $scope.forceData[50].indexOf(id) != -1){
					valid = false;
				}
			}
		}
		
		//no duplicate reinforcements
		if(unitType == 50 && $scope.forceData[unitType].indexOf(id) !== -1)
				valid = false;
				
		if(valid)
			$scope.forceData[section][slot] = id;
	};
	
	$scope.uniqueExists = function(sec, id){
		id = parseInt(id);
		if($scope.units[id].unitUnique == 0) return false;
		return($scope.forceData[sec].indexOf(id) != -1 || $scope.forceData[50].indexOf(id) != -1);
	};
	$scope.removeUnit = function(section, position){
		$scope.forceData[section][position] = 0;
	};
	$scope.loadForceCode = function(str){
		var ids = str.split(",");
		var formation = ids[1];
		$scope.formationSelect = formation;
		$scope.formationActualSelect = formation;
		ids.splice(0,2);

		$scope.forceData = {};
		$scope.padForce();

		for(var i in ids){
			$scope.addUnit(ids[i]);
		}
		
		//cleanup the blank spaces
		for(var t in $scope.types){
			for(var i in $scope.forceData[t])
				if($scope.forceData[t][i] <= 50)
					 $scope.forceData[t][i] = 0;
		}
		
		$scope.$apply();
	};
	
});
