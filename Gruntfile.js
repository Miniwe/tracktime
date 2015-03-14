'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  // https://www.npmjs.com/package/load-grunt-tasks
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  require('grunt-express-server')(grunt);

  // require('grunt-contrib-copy')(grunt);

  require('grunt-bower-concat')(grunt);


  grunt.initConfig({
    express: {
      options: { // Override defaults here
        node_env: 'dev',
        port: 3000,
        hostname: '*',
        logs: '/logs'
      },
      dev: {
        options: {
          script: 'server/server.js'
        }
      },
      prod: {
        options: {
          script: 'server/server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server/server.js'
        }
      }
    },
    jshint: {
      all: [
      'Gruntfile.js',
      'tasks/*.js',
      '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    htmlhint: {
      build: {
        options: {
          'tag-pair': true,
          'tagname-lowercase': true,
          'attr-lowercase': true,
          'attr-value-double-quotes': true,
          'doctype-first': true,
          'spec-char-escape': true,
          'id-unique': true,
          'head-script-disabled': true,
          'style-disabled': true
        },
        src: ['index.html']
      }
    },
    bower_concat: {
      all: {
        dest: 'public/assets/js/script.js',
        cssDest: 'public/assets/css/style.css',
        // exclude: [
        // 'jquery',
        // 'modernizr'
        // ],
        dependencies: {
          'underscore': 'jquery',
          'backbone': 'underscore'
        },
        bowerOptions: {
          relative: false
        }
      }
    }
  });

grunt.registerTask('client', 'Start the app client', ['bower_concat']);

grunt.registerTask('server', 'Start the app server', ['express:dev:stop', 'express:dev:start']);

grunt.registerTask('default', []);
};
