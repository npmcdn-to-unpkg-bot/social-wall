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
				tasks: ['browserify', 'jshint']
			}
		},
		browserify: {
			'tests/main.js': ['tests/<%= pkg.name %>.js', 'tests/app.js']
		},
		less: {
			development: {
				options: {
					paths: ['tests/css/assets'],
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ['> 5%']})
					]
				},
				files: {
					'tests/css/<%= pkg.name %>.css': 'tests/css/<%= pkg.name %>.less'
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
					'dist/<%= pkg.name %>.min.css': 'tests/css/<%= pkg.name %>.less'
				}
			}
		},
		uglify: {
			main: {
				options: {
					banner: '/*!\n * jQuery <%= pkg.name %> plugin <%= pkg.version %>\n * https://github.com/thiervoj/social-wall\n *\n * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors\n * http://jquery.org/license\n *\n * Modifications Copyright <%= grunt.template.today("yyyy") %> Jordan Thiervoz\n * https://github.com/thiervoj\n *\n * Released under the <%= pkg.license %> license\n *\n * Date: <%= grunt.template.today("dd-mm-yyyy")%>\n */',
					compress: {
						drop_console: true
					}
				},
				files: {
					'dist/social-wall.min.js': 'tests/social-wall.js'
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
			all: ['tests/app.js', 'tests/<%= pkg.name %>.js']
		},
		copy: {
			main: {
				files: [
					{
						src: 'tests/<%= pkg.name %>.js',
						dest: 'dist/<%= pkg.name %>.js'
					},
					{
						src: 'tests/css/<%= pkg.name %>.css',
						dest: 'dist/<%= pkg.name %>.css'
					},
					{
						src: 'tests/<%= pkg.name %>.php',
						dest: 'dist/<%= pkg.name %>.php'
					},
					{
						src: 'tests/css/<%= pkg.name %>.less',
						dest: 'dist/<%= pkg.name %>.less'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('production', ['uglify', 'less:production', 'copy']);
	grunt.registerTask('default', ['watch']);
};