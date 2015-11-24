module.exports = (grunt) ->

  grunt.initConfig
    copy:
      lib_dev:
        options:
          flatten: true
        files: [
          {src: ['./bower_components/d3/d3.js'], dest: './test/js/d3.js'}
        ]
      lib_prod:
        options:
          flatten: true
        files: [
          {src: ['./bower_components/d3/d3.min.js'], dest: './out/js/d3.js'}
          {src: ['./bower_components/bootstrap/dist/js/bootstrap.min.js'], dest: './out/js/bootstrap.js'}
          {src: ['./bower_components/jquery/dist/jquery.min.js'], dest: './out/js/jquery.js'}
          {src: ['./bower_components/react/react.min.js'], dest: './out/js/react.js'}
          {src: ['./bower_components/react/react-dom.min.js'], dest: './out/js/react-dom.js'}
        ]
      sam_dev:
        options:
          flatten: true
        files: [
          {src: ['./build/tmp/compileBrowserify/dist.js'], dest: './test/js/dashboard4sam.js'}
        ]
      sam_prod:
        options:
          flatten: true
        files: [
          {src: ['./build/tmp/compileBrowserify/dist.js'], dest: './out/js/dashboard4sam.js'}
        ]
      css_prod:
        options:
          flatten: true
        files: [
          # Bootstrap
          {src: ['./bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: './out/style/bootstrap.css'}
          # Main Style
          {src : ['./src/style/main.css'], dest: './out/style/main.css'}
        ]

    watch:
      source:
        files: ['./src/**']
        tasks: ['build-dev']
        options:
          spawn: false

    clean:
      babel: ['./build/tmp/compileBabel']

    babel:
      code:
        options:
          sourceMap: true
          presets: ['es2015']
          plugins: ["syntax-async-functions","transform-regenerator", "transform-react-jsx"]
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
  grunt.registerTask 'build-prod', ['babel:code', 'browserify:code', 'copy:css_prod', 'copy:lib_prod', 'copy:sam_prod']

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'