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
					'_dev/mediaelement-playlist-plugin.js': 'js/mediaelement-playlist-plugin.js'
				}
			},
			build: {
				options: {
					mangle: true,
					compress: true,
					sourceMap: true,
					sourceMapIncludeSources: true
				},
				files: {
					'_build/mediaelement-playlist-plugin.min.js': 'js/mediaelement-playlist-plugin.js'
				}
			}
		},
		sass: {
			dev: {
				options: {
					sourcemap: true,
					force: true,
					precision: 10,
					style: 'expanded',
					loadPath: 'sass'
				},
				files: {
					'_dev/mediaelement-playlist-plugin.css': 'sass/mediaelement-playlist-plugin.scss'
				}
			},
			build: {
				options: {
					sourcemap: true,
					force: true,
					precision: 10,
					style: 'compressed',
					loadPath: 'sass'
				},
				files: {
					'_build/mediaelement-playlist-plugin.min.css': 'sass/mediaelement-playlist-plugin.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: '> 2%',   // all browser with more than 2% global usage
				map: true           // updates existing map from sass
			},
			dev: {
				src: '_dev/mediaelement-playlist-plugin.css'
			},
			build: {
				src: '_build/mediaelement-playlist-plugin.min.css'
			}
		},
		copy: {
			dev: {
				files: [
					// copy PNGs
					{expand: true, cwd: 'img/', src: ['*.png'], dest: '_dev/'},
					// copy html
					{src: './demo.html', dest: '_dev/demo.html'},
					// copy _demo files
					{expand: true, cwd: '_demo/', src: [
						'loading.gif',
						'mediaelement-and-player.js',
						'mediaelementplayer.css',
						'controls.svg',
						'jquery-2.1.0.js'
					], dest: '_dev/_demo/'}
				]
			},
			build: {
				files: [
					// copy PNGs
					{expand: true, cwd: 'img/', src: ['*.png'], dest: '_build/'},
					// copy html
					{src: './demo.html', dest: '_dev/demo.html'},
					// copy _demo files
					{expand: true, cwd: '_demo/', src: [
						'loading.gif',
						'mediaelement-and-player.js',
						'mediaelementplayer.css',
						'controls.svg',
						'jquery-2.1.0.js'
					], dest: '_build/_demo/'}
				]
			},
			demo: {
				files: [
					// copy built ass
					{expand: true, cwd: '_build/', src: [
						'bigplay.png',
						'controls-playlist.png',
						'mediaelement-playlist-plugin.min.css',
						'mediaelement-playlist-plugin.min.css.map',
						'mep-playlist-icons.png',
						'no-video-playlist.png',
						'mediaelement-playlist-plugin.min.js',
						'mediaelement-playlist-plugin.min.map'
					], dest: '_demo/'}
				]
			}
		},
		replace: {
			dev: {
				options: {
					patterns: [
						{
							match: /_demo\/mediaelement-playlist-plugin.min.js/g,
							replacement: './mediaelement-playlist-plugin.js'
						},
						{
							match: /_demo\/mediaelement-playlist-plugin.min.css/g,
							replacement: './mediaelement-playlist-plugin.css'
						},
						{
							match: /_demo\/bigplay.png/g,
							replacement: './bigplay.png'
						},
						{
							match: /_demo\/no-video-playlist.png/g,
							replacement: './no-video-playlist.png'
						}
						
					]
				},
				files: [
					{expand: true, flatten: true, src: ['./demo.html'], dest: '_dev/'}
				]
			},
			build: {
				options: {
					patterns: [
						{
							match: /_dev\/mediaelement-playlist-plugin.min.js/g,
							replacement: './mediaelement-playlist-plugin.min.js'
						},
						{
							match: /_dev\/mediaelement-playlist-plugin.min.css/g,
							replacement: './mediaelement-playlist-plugin.min.css'
						},
						{
							match: /_demo\/bigplay.png/g,
							replacement: './bigplay.png'
						},
						{
							match: /_demo\/no-video-playlist.png/g,
							replacement: './no-video-playlist.png'
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['./demo.html'], dest: '_build/'}
				]
			}
		},
		watch: {
			options: {
				livereload : true
			},
			uglify: {
				files: ['mediaelement-playlist-plugin.js'],
				tasks: ['uglify:dev']
			},
			scss: {
				files: ['sass/mediaelement-playlist-plugin.scss'],
				tasks: ['css:dev']
			},
			copyfiles: {
				files: [
					'demo.html',
					'img/*.png'
				],
				tasks: [
					'copy:dev',
					'replace:dev'
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
	
	grunt.registerTask('build:dev',  ['js:dev',   'css:dev',   'copy:dev',   'replace:dev']);
	grunt.registerTask('build',      ['js:build', 'css:build', 'copy:build', 'replace:build']);
	// builds the "root" demo.html using "_build" assets
	grunt.registerTask('build:demo', ['build', 'copy:demo']);

	grunt.registerTask('default', ['build:dev', 'watch']);
};
