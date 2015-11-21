module.exports = (grunt) ->

  grunt.initConfig
    copy:
      lib_dev:
        options:
          flatten: true
        files: [
          {src: ['./bower_components/d3/d3.js'], dest: './test/js/d3.js'}
        ]
      sam_dev:
        options:
          flatten: true
        files: [
          {src: ['./build/tmp/compileBrowserify/dist.js'], dest: './test/js/dashboard4sam.js'}
        ]

    clean:
      babel: ['./build/tmp/compileBabel']

    babel:
      code:
        options:
          sourceMap: true
          presets: ['es2015']
        files: [
          cwd: 'src'
          src: ['**/*.js','**/*.jsx']
          dest: 'build/tmp/compileBabel'
          ext: '.js'
          expand: true
        ]
    browserify:
      code:
        dest: 'build/tmp/compileBrowserify/dist.js'
        src: ['build/tmp/compileBabel/**/*.js']

  grunt.loadNpmTasks 'grunt-babel'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.registerTask 'init-dev', ['copy:lib_dev']
  grunt.registerTask 'build-dev', ['babel:code', 'browserify:code', 'copy:sam_dev']
  grunt.registerTask 'build-prod', []

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'