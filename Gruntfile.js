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
         "tw-css/style.css": "tw-scss/tw-sass.scss"
    },
    // watch all .scss files in our sass directory
    // for changes
    watched_sass_files = [ 'tw-scss/tw-sass.scss' ],
    uglify_source_files = [
        'js/vendor/**/*.js',
        'js/custom/javascript.js',
    ],
    uglify_files = {
        'js/javascript.min.js': uglify_source_files
    },
    watched_js_files = [
        'js/vendor/**/*.js',
        'js/custom/*.js',
    ],
    watched_jade_files = [
        'tw-jade/*.jade',
        '_bootstrap.jade',
        'components/*.jade'
    ];

module.exports = function(grunt) {
    "use strict";

  // Project configuration.
  grunt.initConfig({
    /* disabling js uglify for now LR
	    uglify: {
	      // `grunt uglify:dev`
	        dev: {
	            files: uglify_files,
	            options: {
	                beautify: true,
	                mangle: false
	            },
	        },
	        // `grunt uglify:prod`
	        prod: {
	            files: uglify_files
	        },*/
    
   
     // `grunt watch`
    watch: {
        sass: {
            files: watched_sass_files,
            tasks: ["sass:"+build_state],
            options: {
                livereload: true,
            }
        },
        jade: {
        	files: watched_jade_files,
        	tasks: ["jade:"+build_state],
        	options: {
        		livereload: true,
        	}
        }
    }, // watch
     //Pulled from my AAAA Mini
    //https://github.com/sindresorhus/grunt-sass
    sass: {                            
    // `grunt sass:dev`
        dev: {
            options: { outputStyle: "nested", sourceMap: true },
            files: sass_files,
        },
        // `grunt sass:prod`
        prod: {
            options: { outputStyle: "compressed", sourceMap: true },
            files: sass_files,
        },
        releaseUnmin: {
            options: { style: "normal" },
            files: {
                "tw-css/style.css": "tw-scss/tw-sass.scss"
            },
        }
    },
    //https://github.com/gruntjs/grunt-contrib-jade
    jade: {
	  dev: {
	    options: {
	    	pretty: true,
	      data: {
	        debug: false  
	      }
	    },
	    files: {
	      "tw-html/index.html": "tw-jade/index.jade"
	    }
	  },
	  prod: {
	  	 options: {
	    	pretty: true,
	      data: {
	        debug: false  
	      }
	    },
	    files: {
	      "tw-html/index.html": "tw-jade/index.jade"
	    }
	  }
	} // jade
  });


    // when `grunt` is run, do the following tasks
    // run all tasks associated with build_state
    // (either prod or dev), start watch
    // (note: watch also uses build_state when generating output)
    grunt.registerTask('default', [build_state, 'watch']);

    // when `grunt prod` is run, do the following tasks
    grunt.registerTask('prod', ['sass:prod', 'jade:prod']);

    // when `grunt dev` is run, do the following tasks
    grunt.registerTask('dev', ['sass:dev', 'jade:prod']);

     // load these tasks (necessary to allow use of sass, watch, and uglify
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jade");
};