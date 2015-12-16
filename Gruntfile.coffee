module.exports = (grunt) ->

  grunt.initConfig
    copy:
      lib_dev:
        options:
          flatten: true
        files: [
          {src: ['./bower_components/d3/d3.js'], dest: './test/js/d3.js'}
          {src: ['./bower_components/bootstrap/dist/js/bootstrap.js'], dest: './test/js/bootstrap.js'}
          {src: ['./bower_components/jquery/dist/jquery.js'], dest: './test/js/jquery.js'}
          {src: ['./bower_components/react/react.js'], dest: './test/js/react.js'}
          {src: ['./bower_components/react/react-dom.js'], dest: './test/js/react-dom.js'}
          {src: ['./bower_components/plotly/index.js'], dest: './test/js/plotly.js'}
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
          {src: ['./bower_components/plotly/index.js'], dest: './out/js/plotly.js'}
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
          # Images
          {expand: true, flatten: true, src: ['./resources/images/**'], dest: './out/images/'}
        ]
      css_dev:
        options:
          flatten: true
        files: [
          {src: ['./bower_components/bootstrap/dist/css/bootstrap.css'], dest: './test/style/bootstrap.css'}
          # Main Style
          {src : ['./src/style/main.css'], dest: './test/style/main.css'}
          # Images
          {expand: true, flatten: true, src: ['./resources/images/**'], dest: './test/images/'}
        ]

    watch:
      source:
        files: ['./src/**']
        tasks: ['build-dev']
        options:
          spawn: false
      test:
        files: ['./src/**', './src-test/**']
        tasks: ['build-test']
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
      test:
        options:
          sourceMap: true
          presets: ['es2015']
          plugins: ["syntax-async-functions","transform-regenerator", "transform-react-jsx"]
        files: [{
            cwd: 'src'
            src: ['**/*.js', '**/*.jsx']
            dest: 'build/tmp/compileBabelTest'
            ext: '.js'
            expand: true
          },
          {
            cwd: 'src-test'
            src: ['**/*.js', '**/*.jsx']
            dest: 'build/tmp/compileBabelTest'
            ext: '.js'
            expand: true
          }
        ]
    browserify:
      code:
        dest: 'build/tmp/compileBrowserify/dist.js'
        src: ['build/tmp/compileBabel/**/*.js']
    mochaTest:
      test:
        options:
          reporter: 'spec'
          captureFile: 'test-results.txt'
          quiet: false
          clearRequireCache: false
        src: ['build/tmp/compileBabelTest/model/**/*.js']

  grunt.loadNpmTasks 'grunt-babel'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.registerTask 'init-dev', ['copy:lib_dev', 'copy:css_dev']
  grunt.registerTask 'build-dev', ['babel:code', 'browserify:code', 'copy:sam_dev']
  grunt.registerTask 'build-test', ['babel:test']
  grunt.registerTask 'build-prod', ['babel:code', 'browserify:code', 'copy:css_prod', 'copy:lib_prod', 'copy:sam_prod']

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'