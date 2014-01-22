'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
	
	var testData = {
		"units":{
			"1000":{"unitID":"1000","unitName":"Hirst","unitImage":"maskedsoldierportraitD.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"1","unitDefence":"1","unitAbilities":"","unitPriority":1,"unitIronwill":"0","unitStealth":"0"},
			"1304":{"unitID":"1304","unitName":"Anastasia","unitImage":"femalepilotD.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"10","unitDefence":"11","unitAbilities":"1|0.4;","unitPriority":15,"unitIronwill":"0","unitStealth":"0"},
			"1403":{"unitID":"1403","unitName":"The Magistrate","unitImage":"magistrate.jpg","unitUnique":"1","unitClass":"1","unitType1":"0","unitType2":"0","unitAttack":"22","unitDefence":"24","unitAbilities":"7|0.35;","unitPriority":50,"unitIronwill":"0","unitStealth":"0"},
			"2001":{"unitID":"2001","unitName":"Infantry","unitImage":"basicinfantry.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"1","unitDefence":"1","unitAbilities":"","unitPriority":1,"unitIronwill":"0","unitStealth":"0"},
			"2004":{"unitID":"2004","unitName":"Bazooka Marine","unitImage":"mission14.jpg","unitUnique":"0","unitClass":"2","unitType1":"3","unitType2":"0","unitAttack":"12","unitDefence":"8","unitAbilities":"3|0.25;","unitPriority":13,"unitIronwill":"0","unitStealth":"0"}
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
	 
	describe('wmForceEdCtrl', function(){
		var scope, ctrl, $httpBackend;
		beforeEach(module('wmForceEd'));
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('data.json').
			respond(testData);
			
			scope = $rootScope.$new();
			ctrl = $controller('wmForceEdCtrl', {$scope: scope});
			scope.downloadData('data.json');
		}));

		it('should create some models based on xhr', function() {
			expect(scope.units).toBeUndefined();
			expect(scope.formations).toBeUndefined();
			expect(scope.skills).toBeUndefined();
			expect(scope.types).toBeUndefined();
			expect(scope.subtypes).toBeUndefined();
			
			$httpBackend.flush();

			expect(scope.units.length).toEqual(testData['units'].length);
			expect(scope.formations.length).toEqual(testData['formations'].length);
			expect(scope.skills.length).toEqual(testData['skills'].length);
			expect(scope.types.length).toEqual(testData['types'].length);
			expect(scope.subtypes.length).toEqual(testData['subtypes'].length);
		});
		
		/* binding related */
		
		it('create an array of n length', function() {
			expect(scope.getNumber(5).length).toBe(5);
			expect(scope.getNumber(0).length).toBe(0);
			expect(scope.getNumber().length).toBe(0);
		});
		
		it('gets the number of elements in the formation for that section', function() {			
			$httpBackend.flush();
			expect(scope.getFormationCount(1).length).toEqual(1);
			expect(scope.getFormationCount(2).length).toEqual(2);
			scope.formationActualSelect = '36';
			expect(scope.getFormationCount(1).length).toEqual(3);
			expect(scope.getFormationCount(4).length).toEqual(4);
			expect(scope.getFormationCount(11).length).toEqual(0);
		});
		
		it('0/1 notation to string for unique', function() {
			expect(scope.unique(0, "unique")).toBe("");
			expect(scope.unique(1, "unique")).toBe("unique");
			expect(scope.unique(1, "")).toBe("");
		});
		
		it('see if unique unit exists in formation', function() {			
			$httpBackend.flush();
			scope.forceData = {'1':[],'2':[],'50':[]};
			expect(scope.uniqueExists(1, '1000')).toEqual(false);
			scope.forceData = {'1':[1000],'2':[],'50':[]};
			expect(scope.uniqueExists(1, '1000')).toEqual(true);
			scope.forceData = {'1':[1000],'2':[2001],'50':[]};
			expect(scope.uniqueExists(2, '2001')).toEqual(false);//because 2001 is not unique
			scope.forceData = {'1':[1000],'2':[],'50':[1304]};
			expect(scope.uniqueExists(1, '1304')).toEqual(true);
		});
		
		it('see if formation changes correctly', function() {			
			$httpBackend.flush();
			expect(scope.forceData['1'].length).toEqual(1);
			scope.formationSelect = '36';
			scope.setFormation();
			expect(scope.forceData['1'].length).toEqual(3);
			expect(scope.forceData['2'].length).toEqual(12);
		});
	});
});
