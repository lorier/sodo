 /*
Usage
--------------
# run build tasks is build_state (default dev)
# start watching for changes and build on changes
grunt

# build with compressed css and js
# does NOT start watch
grunt prod
*/

// we can set our default build state to either
    // 'prod' or 'dev'
    // this value will be used for both the
    // initial process when `grunt` alone is run
    // as well as the tasks run via watch
var build_state = 'prod',
    // sass src files are loaded with sass includes
    // no need to list them here (i.e. only one sass src)
    sass_files = {
         "dev/tw-css/style.css": "dev/tw-scss/tw-sass.scss"
    },
    // watch all .scss files in our sass directory
    // for changes
    watched_sass_files = [ 
        'dev/tw-scss/tw-sass.scss' 
    ],
    watched_jade_files = [
        'dev/tw-jade/*.jade',
        'dev/tw-jade/inc/*.*',
        '_bootstrap.jade',
        'components/*.jade'
    ];

module.exports = function(grunt) {
    "use strict";

  // Project configuration.
  grunt.initConfig({
     // `grunt watch`
    watch: {
        sass: {
            files: watched_sass_files,
            tasks: ["sass:"+build_state],
            options: {
                livereload: true,
            },
        },
        jade: {
        	files: watched_jade_files,
        	tasks: ["jade:"+build_state],
            options: {
                livereload: true,
            },
        }
    }, // watch
    //https://github.com/sindresorhus/grunt-sass
    sass: {                            
    // `grunt sass:dev`
        dev: {
            options: { outputStyle: "nested", sourceMap: true },
            files: {
                "dev/css/style.css": "dev/tw-scss/tw-sass.scss"
            }
        },
        // `grunt sass:prod`
        prod: {
            options: { outputStyle: "compressed", sourceMap: false },
            files: {
                "dist/css/style.css": "dev/tw-scss/tw-sass.scss"
            }
        }
    },
    //https://github.com/gruntjs/grunt-contrib-jade
    jade: {
	  dev: {
	    options: {
	    	pretty: true,
	      data: {
	        debug: true  
	      }
	    },
	    files: [ { 
          expand: true, 
          src: "**/*.jade", 
          dest: "dev/", 
          cwd: "dev/tw-jade/", 
          ext: '.html'
        } ]
	  },
	  prod: {
	  	options: {
            pretty: false,
            data: {
	           debug: false  
            }
	    },
        // http://stackoverflow.com/questions/14089921/how-to-copy-compiled-jade-files-to-a-destination-folder-using-grunt
	    files: [ { 
          expand: true, 
          src: "**/*.jade", 
          dest: "dist/", 
          cwd: "dev/tw-jade/", 
          ext: '.html'
        } ]
	  }
	}, //jade
    imagemin: {
        prod: {                         // Another target
              files: [{
                expand: true,                  // Enable dynamic expansion
                cwd: 'dev/tw-images/',                   // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif,svg}'],   // Actual patterns to match
                dest: 'dist/tw-images/'                  // Destination path prefix
              },
              {
                expand: true,                  // Enable dynamic expansion
                cwd: 'dev/lease-images/',                   // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif,svg,pdf}'],   // Actual patterns to match
                dest: 'dist/lease-images/'                  // Destination path prefix
              }
              ]
            }
    },
    copy: {
        prod: {
           expand: true, 
           cwd: 'dev/fonts/',                   // Src matches are relative to this path
           src: ['**/*'], 
           dest: 'dist/fonts/', 
           filter: 'isFile'
       }
    }
  });


    // when `grunt` is run, do the following tasks
    // run all tasks associated with build_state
    // (either prod or dev), start watch
    // (note: watch also uses build_state when generating output)
    grunt.registerTask('default', [build_state, 'watch']);

    //to minify images
    grunt.registerTask('minify', ['newer:imagemin:prod']);
    
    //TODO set up to be used with minify
    // grunt.registerTask('newer', ['newer:jshint:all']);
    
    // when `grunt prod` is run, do the following tasks
    grunt.registerTask('prod', ['sass:prod', 'jade:prod', 'newer:imagemin:prod', 'newer:copy:prod']);

    // when `grunt dev` is run, do the following tasks
    grunt.registerTask('dev', ['sass:dev', 'jade:dev']);

    grunt.registerTask('copy', ['copy:prod']);

     // load these tasks (necessary to allow use of sass, watch, and uglify
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-newer");

};