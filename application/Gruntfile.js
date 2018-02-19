'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'compressed',
          compass: false,
          sourcemap: false
        },
        files: {
          'css/style.min.css': [
            'sass/style.scss'
          ]
        }
      }
    },
    uglify: {
        options: {
            mangle: false // don't change variables during minify
        },
      dist: {
        files: {
          'js/app.min.js': [
            'js/**/*.js',
            '!js/{,**/}*.min.js', // Ignore minify files
            '!js/bootstrap.js' // Ignore bootstrap.js
          ]
        },
      }
    },
    // compress Images
    imagemin: {
        dist: {
            options: {
                optimizationLevel: 6
            },
            files: [{
                expand: true,
                cwd: 'img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'img_min/'
            }]
        }
    },
    //watch files for changes
     watch: {
      css: {
        files: ['sass/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['js/*.js'],
        tasks: ['uglify']
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Register tasks
  grunt.registerTask('default', [
    'sass',
    'uglify',
    'imagemin'
  ]);

};