'use strict';

var path = require('path');
var config = require('./config/config.json');

module.exports = function (grunt) {


  // Load grunt config and tasks automatically
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(),'config/grunt'), //path to task.js files, defaults to grunt dir
    init: true, //auto grunt.initConfig
    data: { //data passed into config.  Can use with <%= test %>
      test: false,
      curPath: process.cwd(),
      tmpPath: path.join(process.cwd(), config.tmpPath)
    },
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    },
    postProcess: function(config) {}, //can post process config object before it gets passed to grunt
    preMerge: function(config, data) {}
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  grunt.registerTask('app:start', 'Start stanalone app', function() {
    grunt.util.spawn({
      cmd: ['nw'],
      args: ['.'],
    }, function done() { /* grunt.log.ok('app started');*/ });
  });

  grunt.registerTask('tmp:create', 'Create tmp folder', function() {
    grunt.task.run('tmp:delete');
    grunt.file.mkdir(path.join(process.cwd(), config.tmpPath));
    grunt.file.mkdir(path.join(process.cwd(), config.logPath));
  });

  grunt.registerTask('tmp:delete', 'Delete tmp folder', function() {
    grunt.file.delete(path.join(process.cwd(), config.tmpPath), {
      force: true
    });
  });

};
