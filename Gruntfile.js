'use strict';

var path = require('path');

module.exports = function (grunt) {

  var config = {
    'tmpPath': '.tmp'
  };

  // Load grunt tasks automatically
  // https://www.npmjs.com/package/load-grunt-tasks
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  require('grunt-express-server')(grunt);

  // require('grunt-bower-concat')(grunt);


  // require('grunt-contrib-copy')(grunt);
  // require('grunt-contrib-jshint')(grunt); // ?? not working for me :(
  // grunt.require('grunt-contrib-coffee');
  // grunt.loadNpmTasks('grunt-contrib-concat');


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
      path.resolve(config.tmpPath) + '/app.coffee.js'
      // , '<%= nodeunit.tests %>'
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
        dest: path.resolve(config.tmpPath , 'bower_components.js'),
        cssDest: path.resolve(config.tmpPath , 'bower_components.css'),
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
    },
    coffee: {
      compile: {
        options: {
          join: true,
          sourceMap: true
        },
        files: {
          '.tmp/app.coffee.js': ['app/**/*.coffee']

        }
      }
    },
    concat: {
      dist: {
        src: [
        path.resolve(config.tmpPath) + '/*.js'
        ],
        dest: path.resolve(config.tmpPath) + '/script.js'
      }
    },
    uglify: {
      build: {
        src: path.resolve(config.tmpPath) + '/script.js',
        dest: path.resolve(config.tmpPath) + '/script.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: path.resolve('assets/sass'),
          cssDir: path.resolve(config.tmpPath) + '/css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: path.resolve('assets/sass'),
          cssDir: path.resolve(config.tmpPath) + '/css'
        }
      }
    },
    copy: {
      main: {
        files: [
        {
          expand: true,
          cwd: path.resolve(config.tmpPath),
          src: 'css/**',
          dest: path.resolve('public/assets')
        },
        {
          // cwd: path.resolve(config.tmpPath),
          src: '.tmp/script.js',
          dest: 'public/assets/js/script.js'
        }

        ],
      },
    }

  });

grunt.registerTask('tmp:create', 'Create tmp folder', function() {
  grunt.file.mkdir(path.resolve(config.tmpPath));
});

grunt.registerTask('tmp:delete', 'Delete tmp folder', function() {
  grunt.file.delete(path.resolve(config.tmpPath), {
    force: true
  });
});

grunt.registerTask('client', 'Build client standalone', [
  'tmp:create',
  'coffee',
  'jshint', //@todo fix pathes to work
  'bower_concat',
  'concat',
  'compass',
  'copy',
  // 'uglify', // @all working - turn on in production
  'tmp:delete'
  ]);

grunt.registerTask('server', 'Start the app server', ['express:dev:stop', 'express:dev:start']);

grunt.registerTask('default', []);
};
