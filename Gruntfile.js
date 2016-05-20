module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			lessDev: {
				files: 'tests/css/*.less',
				tasks: ['less:development']
			},
			jsDev: {
				files: 'tests/*.js',
				tasks: ['browserify:development', 'jshint']
			}
		},
		browserify: {
			development: {
				files: {
					'tests/main.js': ['tests/social-wall.js', 'tests/app.js']
				}
			},
			production: {
				files: {
					'dist/social-wall.js': 'tests/social-wall.js'
				}
			}
		},
		less: {
			development: {
				options: {
					paths: ['tests/css/assets'],
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ['> 5%']}),
						new (require('less-plugin-clean-css'))()
					]
				},
				files: {
					'tests/css/social-wall.css': 'tests/css/social-wall.less'
				}
			},
			production: {
				options: {
					paths: ['tests/css/assets'],
					compress: true,
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ['> 5%']}),
						new (require('less-plugin-clean-css'))()
					]
				},
				files: {
					'dist/social-wall.min.css': 'tests/css/social-wall.less'
				}
			},
			productionUnminified: {
				options: {
					paths: ['tests/css/assets'],
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ['> 5%']}),
						new (require('less-plugin-clean-css'))()
					]
				},
				files: {
					'dist/social-wall.css': 'tests/css/social-wall.less'
				}
			}
		},
		uglify: {
			production: {
				options: {
					compress: {
						drop_console: true
					},
				},
				files: {
					'dist/social-wall.min.js': 'dist/social-wall.js'
				}
			},
			productionUnminified: {
				options: {
					compress: false,
				},
				files: {
					'dist/social-wall.js': 'dist/social-wall.js'
				}
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				browserify: true,
				jquery: true,
				strict: 'implied',
				devel: true,
				globals: {
					masonry: true,
					social: true,
					imagesloaded: true
				}
			},
			all: ['tests/app.js', 'tests/social-wall.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('production', ['browserify:production', 'uglify:production', 'uglify:productionUnminified', 'less:production',  'less:productionUnminified']);
	grunt.registerTask('default', ['watch']);
};