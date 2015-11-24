/* jshint node:true */
'use strict';

module.exports = function (grunt) {

	// grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			dev: {
				options: {
					mangle: false,
					compress: false,
					sourceMap: false,
					beautify: true
				},
				files: {
					'build/mediaelement-playlist-plugin.js': 'src/js/mediaelement-playlist-plugin.js'
				}
			},
			build: {
				options: {
					mangle: true,
					compress: {
						warnings: true
					},
					sourceMap: true,
					sourceMapIncludeSources: true
				},
				files: {
					'build/mediaelement-playlist-plugin.min.js': 'src/js/mediaelement-playlist-plugin.js'
				}
			}
		},
		sass: {
			dev: {
				options: {
					force: true,
					precision: 10,
					style: 'expanded',
					loadPath: 'sass'
				},
				files: {
					'build/mediaelement-playlist-plugin.css': 'src/sass/mediaelement-playlist-plugin.scss'
				}
			},
			build: {
				options: {
					force: true,
					precision: 10,
					style: 'compressed',
					loadPath: 'sass'
				},
				files: {
					'build/mediaelement-playlist-plugin.min.css': 'src/sass/mediaelement-playlist-plugin.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				map: true           // updates existing map from sass
			},
			dev: {
				src: 'build/mediaelement-playlist-plugin.css'
			},
			build: {
				src: 'build/mediaelement-playlist-plugin.min.css'
			}
		},
		copy: {
			images: {
				files: [
					// copy PNGs
					{expand: true, cwd: 'src/img/', src: ['*.png'], dest: 'build/'},
					{expand: true, cwd: 'src/img/', src: ['*.svg'], dest: 'build/'}
				]
			}
		},
		watch: {
			options: {
				livereload : true
			},
			uglify: {
				files: ['src/js/*.js'],
				tasks: ['uglify:dev']
			},
			scss: {
				files: ['src/sass/*.scss'],
				tasks: ['css:dev']
			},
			copyfiles: {
				files: [
					'demo.html',
					'src/img/*.png',
					'src/img/*.svg'
				],
				tasks: [
					'copy:images'
				]
			}
		}
	});

	// load modules
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-replace');

	// all task(s)
	grunt.registerTask('js:dev',    ['uglify:dev']);
	grunt.registerTask('js:build',  ['uglify:build']);
	grunt.registerTask('css:dev',   ['sass:dev', 'autoprefixer:dev']);
	grunt.registerTask('css:build', ['sass:build', 'autoprefixer:build']);
	
	grunt.registerTask('build:dev',  ['js:dev',   'css:dev',   'copy:images']);
	grunt.registerTask('build',      ['js:build', 'css:build', 'copy:images']);

	grunt.registerTask('default', ['build:dev', 'watch']);
};
