'use strict';

/* jasmine specs for filters go here */

describe('filter tests', function() {
	var scope;
	beforeEach(module('wmForceEd'));
	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	var testData = {
		"units":{
			"1000":{"unitID":"1000","unitName":"Hirst","unitImage":"maskedsoldierportraitD.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"1","unitDefence":"1","unitAbilities":"","unitPriority":1,"unitIronwill":"0","unitHidden":"0","unitStealth":"0"},
			"1304":{"unitID":"1304","unitName":"Anastasia","unitImage":"femalepilotD.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"10","unitDefence":"11","unitAbilities":"1|0.4;","unitPriority":15,"unitIronwill":"0","unitHidden":"1","unitStealth":"0"},
			"1403":{"unitID":"1403","unitName":"The Magistrate","unitImage":"magistrate.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"22","unitDefence":"24","unitAbilities":"7|0.35;","unitPriority":50,"unitIronwill":"0","unitHidden":"0","unitStealth":"0"},
			"2001":{"unitID":"2001","unitName":"Infantry","unitImage":"basicinfantry.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"1","unitDefence":"1","unitAbilities":"","unitPriority":1,"unitIronwill":"0","unitHidden":"0","unitStealth":"0"},
			"2004":{"unitID":"2004","unitName":"Bazooka Marine","unitImage":"mission14.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"12","unitDefence":"8","unitAbilities":"3|0.25;","unitPriority":13,"unitIronwill":"0","unitHidden":"1","unitStealth":"0"}
		},
		"formations":{
			"1":{"formationName":"Standard","formationAbility":"","1":"1","2":"2","4":"0","11":"0","12":"0"},
			"36":{"formationName":"Fortification","formationAbility":"34|0.3;","1":"3","2":"12","4":"4","11":"0","12":"0"}
		},
		"skills":{
			"1":{"skillName":"Rally Cry","skillDescription":"Heal for 3"},
			"3":{"skillName":"Concussive Blast","skillDescription":"Damage for 1-5"},
			"7":{"skillName":"Imperial Rage","skillDescription":"Heal for 5 and Damage for 3-9"}
		},
		"types":{
			"1":{"typeName":"Commander"},
			"2":{"typeName":"Assault"}
		},
		"subtypes":{
			"3":{"subtypeName":"Infantry"}
		}
	};


/*wmForceEd.filter('hidden', function() {
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
});*/
	it('filter by units types',
		inject(function(unitCategoryFilter){
			expect(unitCategoryFilter(testData["units"], 1).length).toBe(3);
			expect(unitCategoryFilter(testData["units"], 2).length).toBe(2); 
		})
	);
	it('filter by units subtypes',
		inject(function(unitSubtypeFilter){
			expect(unitSubtypeFilter(testData["units"], 3).length).toBe(2);
		})
	);
	it('filter by hidden',
		inject(function(hiddenFilter){ 
			expect(hiddenFilter(testData["units"], true).length).toBe(3);
			expect(hiddenFilter(testData["units"], false).length).toBe(5);
		})
	);
});