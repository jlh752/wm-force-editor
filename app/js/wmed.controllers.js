'use strict';

/* Controllers */

var wmForceEd = angular.module('wmForceEd', ['ngSanitize', 'ngDragDrop']);

wmForceEd.controller('wmForceEdCtrl', function($scope, $http) {
	$scope.formationSelect = 1;
	$scope.formationActualSelect = 1;
	$scope.shiftDown = false;
	$scope.forceData = {};
	
	//parse the url GET parameters
	//http://stackoverflow.com/a/3855394/1690495
	var qs = (function(a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i)
		{
			var p=a[i].split('=');
			if (p.length != 2) continue;
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.substr(1).split('&'));
	$scope.hide = ('full' in qs)?false:true;//hide unreleased units
	
	$(".button").button();
	
	$scope.downloadData = function(file){
		$http.get(file).success(function(data){
			$scope.loadData(data);
		});
	};
	
	$scope.loadData = function(data){
		$scope.units = data['units'];
		$scope.formations = data['formations'];
		$scope.skills = data['skills'];
		$scope.types = data['types'];
		$scope.subtypes = data['subtypes'];
		
		//generate the html text version of the tooltip
		for(var u in $scope.units){
			var unitSkills = $scope.units[u]['unitAbilities'].split(';');
			var text = "";
			for(var i = 0, n = unitSkills.length; i < n; i++){
				var sk = unitSkills[i];
				if(sk === '') break;
				var s_explode = sk.split('|'),
					sid = s_explode[0],
					sp = s_explode[1];
				text += "<b>"+$scope.skills[sid]['skillName']+" ("+Math.round(100*sp, 10)+"%): </b>"+$scope.skills[sid]['skillDescription']+"<br />";
			}
			$scope.units[u].unitDescription = text;
		}
		$scope.padForce();
	};
	
	/*
		BINDING RELATED FUNCTIONS
	*/
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
	$scope.uniqueExists = function(sec, id){
		id = parseInt(id);
		if($scope.units[id].unitUnique == 0) return false;
		return($scope.forceData[sec].indexOf(id) != -1 || $scope.forceData[50].indexOf(id) != -1);
	};
	$scope.setFormation = function(){
		$scope.formationActualSelect = $scope.formationSelect;
		$scope.padForce();
	};
	
	/*
		DRAG DROP FUNCTIONS
	*/
	$scope.sidebarOptions = {
		revert: 'invalid',
		cursor: 'move',
		helper: 'clone',
		appendTo: 'body',
		opacity: 0.7,
		cursorAt:{top:24,left:24},
		revertDuration: 0
	};
	$scope.lastDragged = null;
	//when a unit is dropped on a valid spot
	$scope.dropUnit = function(event, ui){
		var $tar = $(event.target);
		var $src = $(ui.draggable);
		$src.removeClass("unit-fake-disabled");

		var src_mid = $src.attr('mid');
		var tar_sid = $tar.attr('sid');
		var tar_aid = $tar.attr('aid');
		
		if($src.is(".unit-force")){
			var src_sid = $src.parent().attr('sid');
			var src_aid = $src.parent().attr('aid');
			var tar_mid = $tar.children().attr('mid');
			
			if(!$scope.shiftDown || $scope.units[src_mid].unitUnique == 1 || $src.parent().attr("sid") == 50)
				$scope.removeSlot(src_sid, src_aid);
			
			if($tar.children().length > 0){
				$scope.removeSlot(tar_sid, tar_aid);
				$scope.addToSlot(src_sid, src_aid, tar_mid);
			}
		}

		$scope.addToSlot(tar_sid, tar_aid, src_mid);
	};
	//stop dragging an in-force unit
	$scope.dragStart = function(event, ui){
		var $src = $(event.target);
		$scope.lastDragged = $src;
		if(!$scope.shiftDown || $scope.units[$src.attr("mid")].unitUnique == 1 || $src.parent().attr("sid") == 50){
			$src.addClass("unit-fake-disabled");
		}
	};
	//stop dragging an in-force unit
	$scope.dragStop = function(event, ui){
		$(event.target).removeClass("unit-fake-disabled");
	};
	$scope.removeRevert = function(a){
		if(a == false){
			$scope.removeSlot($scope.lastDragged.parent().attr("sid"), $scope.lastDragged.parent().attr("aid"));
			return false;
		}
		return true;
	};
	var dragCloneHelper = function(){return $(this).clone().appendTo('body').show();};

	/*
		OTHER INTERFACE
	*/
	$scope.showCode = function(){
		var out = "<span style='font-size:14px'>Copy this force code to use the force elsewhere</span><textarea>1,";
		out += $scope.formationActualSelect + ",";
		var reCount = 0, firstReinf = true;
		$('.unit-force').each(function(ind, e){
			if($(e).is("[aid]")){
				var isReinf = ($(e).attr("sid") == 50);
				if(isReinf && firstReinf){//boost slot to add compatibility with older tools
					out += "0,0,";
					firstReinf = false;
				}
				if($(e).children().length == 0){
					out += $(e).attr("sid") + ",";
					if(isReinf){
						reCount++;
					}
				}
			}else{
				out += $(e).attr("mid") + ",";
				reCount = 0;
			}
		});
		out = out.substr(0, out.length-3*reCount);
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
	$scope.getDescription = function(id){
		return $scope.units[id].unitDescription;
	};
	//generate tooltip suitable version of description text
	$scope.copyTooltip_in = function(id, $event){
		var content = document.getElementById('unit-' + id).innerHTML;
		var el = document.getElementById('tooltip');
		if(el != null){
			var t = $event.clientY+10, l = $event.clientX, w = el.style.width;
			var efp = (document.elementFromPoint?document.elementFromPoint(l+w, t):el);
			if(efp == null || efp.tagName == "HTML") l -= w;
			el.innerHTML = content;
			el.style.top = t+"px";
			el.style.left = l+"px";
			el.style.display = 'inline';
		}
	};
	$scope.copyTooltip_out = function(id, $event){
		var el = document.getElementById('tooltip').style.display = 'none';
	};
	
	
	/*
		FORCE BUILDING FUNCTIONS
	*/
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
	//adds unit to specific slot
	$scope.addToSlot = function(section, slot, id){
		var unitType, valid = true;
		id = parseInt(id);
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
		if(section == 50 && $scope.forceData[50].indexOf(id) !== -1 && id > 50)
				valid = false;
				
		if(valid)
			$scope.forceData[section][slot] = id;
	};
	//remove unit from specific slot
	$scope.removeSlot = function(section, position){
		$scope.forceData[section][position] = 0;
	};
	//load force code into slots
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
	//fills up the force data array with empty slots in necessary
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
});
