
// Gruntfile.js
module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
			dist: '_site',
      assets: '_assets'
		},

    /*
     =====================================================================================================================================
     start of watch
     =====================================================================================================================================
     *
     */

        watch: {
            content: {
                files: ['<%= project.dist %>/**/*.*'],
                tasks: [],
                options: {
                    livereload: false,
                    spawn: false
                }
            },
            images: {
                files: ['images/**/*.*'],
                tasks: []
            }, // watch images added to src
            css: {
                files: ['<%= project.assets %>/styles/**/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false,
                }
            },

            scripts: {
                files: [
                  '<%= project.assets %>/scripts/**/*.js'
                ],
                tasks: ['manifest', 'uglify'],
                options: {
                    livereload: true,
                    spawn: true,
                }
            },
        },

        /*
         =====================================================================================================================================
         end of watch
         =====================================================================================================================================
         *
         */

        sass: {
            dist: {
                options: {
                    includePaths: ['bower_components'],
					outputStyle: 'expanded',
					sourceMap: true
				},
                files: {
                    'styles/app.css': '<%= project.assets %>/styles/app.scss'
                }
            }
        }, // sass

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 version, IE 9'
                    }), // add vendor prefixes. for more: https://github.com/ai/browserslist
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'styles/main.css'
            }
        },

        manifest: {
            dist: {
                src: '<%= project.assets %>/scripts',
                dest: 'scripts'
            }
        }, // concat

        uglify: {
            dist: {
                src: 'scripts/app.js',
                dest: 'scripts/app.min.js'
            }
        }, // uglify

        imagemin: {
            dynamic: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'images-src/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
                    dest: 'images/' // Destination path prefix
                }]
            }
        }, // imagemin

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: '_site/',
                src: ['**/*.html'],
                dest: '_site/'
            }
        }, // htmlmin

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['<%= project.dist %>/**/*.*']
                },
                options: {
                    proxy: "localhost:4000",
                    watchTask: true
                }
            }
        } //browserSync
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-manifest-concat');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('build', [
      'sass',
      'postcss',
      'manifest',
      'uglify'
    ]);
    grunt.registerTask('default', ['build', 'browserSync', 'watch']);
};