module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/jquery/jquery-1.10.2.min.js',
      'app/lib/jquery/jquery-ui.min.js',
      'app/lib/jquery/jquery.layout.min.js',
      'app/lib/jquery/jvfloat.min.js',
      'app/lib/angular/angular.min.js',
      'app/lib/angular/angular-sanitize.min.js',
      'app/lib/angular/angular-dragdrop.min.js',
      'app/js/wmed.controllers.js',
      'app/js/wmed.filters.js',
      'app/js/wmed.directives.js',
	  
	  'test/lib/angular/angular-mocks.js',
	  'test/lib/jquery.simulate.js',
	  
	  'test/unit/controllersSpec.js',
	  'test/unit/filtersSpec.js',
	  'test/unit/directivesSpec.js',
	  'test/unit/servicesSpec.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
