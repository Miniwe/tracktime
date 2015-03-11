// Generated on 2014-06-23 using generator-angular 0.9.1
'use strict';


module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  // Define the configuration for all the tasks
  grunt.initConfig({
    default: {}
  });

  grunt.registerTask('run', 'Start the app server', function() {
    console.log('start server');
    // var done = this.async();

    // var connectConfig = grunt.config.get().connect.options;
    // process.env.LIVE_RELOAD = connectConfig.livereload;
    // process.env.NODE_ENV = this.args[0];

    // var keepAlive = this.flags.keepalive || connectConfig.keepalive;

    // var server = require('./server');
    // server.set('port', connectConfig.port);
    // server.set('host', connectConfig.hostname);
    // server.start()
    // .on('listening', function() {
    //   if (!keepAlive) done();
    // })
    // .on('error', function(err) {
    //   if (err.code === 'EADDRINUSE') {
    //     grunt.fatal('Port ' + connectConfig.port +
    //       ' is already in use by another process.');
    //   } else {
    //     grunt.fatal(err);
    //   }
    // });
  });
  grunt.registerTask('default', function(target){
    // if (taskExist(target)) {
    //   return grunt.task.run([target]);
    // }
    console.log('default task');

  });
};
