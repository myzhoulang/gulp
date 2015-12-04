(function(){
  "use strict";
  var gulp = require('gulp');
  var fs = require('fs');
  //jshint
  var jshint = require('gulp-jshint');
  var browserSync = require('browser-sync').create();
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var clean = require('gulp-clean');
  var rev = require('gulp-rev');
  var wiredep = require('wiredep').stream;
  var ngHtml2Js = require('gulp-ng-html2js');
  var useref = require('gulp-useref');
  var revCollector = require('gulp-rev-collector');


  /**
   * gulp-rev: 给修改后的静态资源文件名添加哈希值  unicorn.css => unicorn-d41d8cd98f.css
   *
   * 使用rev.mainfest() 产生一个 原资源和添加哈希后文件对应的json 文件
   *  {
   *    "css/unicorn.css": "css/unicorn-d41d8cd98f.css",
   *    "js/unicorn.js": "js/unicorn-273c2cin3f.js"
   *  }

   * gulp.task('rev', function(){
   *  return gulp.src(src/*.css)
   *          .pipe(rev())
   *          .pipe(gulp.dest('dist'))
   *          .pipe(rev.marinfest())
   *          .pipe(gulp.dest('build/'))
   * })
   */



  /**
   * 文件改变浏览器同步刷新
   */
  gulp.task('browser-sync', function(){
    browserSync.init({
      server: {
        //文件访问路径
        baseDir:'./'
      }
    });
  });


  /**
   * 将angualrjs 项目中模板 打包成js 文件 减少请求
   */
  gulp.task('ngHtml2Js',['clean'], function(){
    return gulp.src('./src/tpl/**.html')
        .pipe(ngHtml2Js({
          moduleName:'tpl'
        }))
        .pipe(gulp.dest('./dist/tpl/'))
        .pipe(concat('./dist/tpl/tpl.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
  });

  /**
   * 监视 通过bower添加的静态资源 自动在html中插入这些资源
   */
  gulp.task('bower', function(){
    gulp.src('./index.html')
        .pipe(wiredep({
          optional: 'configuration',
          goes: 'here'
        }))
        .pipe(gulp.dest('./'));
  });

  /**
   * js 文件检查
   */
  gulp.task("jshint", function(){
    return gulp.src(['src/scripts/**.js'])
        .pipe(jshint({strict: true}))
        .pipe(jshint.reporter("default"));
  });

  /**
   * 文件监视
   */
  gulp.task('watch', function(){
    gulp.watch(['src/scripts/**.js'], ['jshint']).on('change', browserSync.reload);
    // 首页改变
    gulp.watch(['index.html']).on('change', browserSync.reload);
  });

  /**
   * 判断文件是否有修改 如果有修改 文件名后自动加上MD5
   * useref()  执行html 中 bulid:js  之类的指令
   * 案例：
   *    <!-- build:js scripts/vendor.js -->
   *    <!-- bower:js -->
   *    </script src="bower_components/angular/angular.js"></script>
   *    <script src="bower_components/jquery/dist/jquery.js"></script>
   *    <!-- endbower -->
   *    <!-- endbuild -->
   */
  gulp.task('rev',['uglify', 'concat'], function(){
    return gulp.src('dist/scripts/**.js')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/'));
  });

  gulp.task('revCollecotr', ['rev'], function(){
    return gulp.src(['./rev/*.json', 'dist/index.html'])
        .pipe(revCollector({
          replaceReved: true
        }))
        .pipe(gulp.dest('dist/'));
  })


  /**
   * 文件压缩
   */
  gulp.task('uglify', ['concat'], function(){
    return gulp.src(['tmp/scripts/**.js'])
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/scripts/'));
  });

  /**
   * 文件合并
   */
  gulp.task('concat',['jshint', 'clean'], function(){
    return gulp.src('src/scripts/**.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./tmp/scripts/'));
  });

  /**
   * 文件清除
   */
  gulp.task('clean', function(){
    return gulp.src(['dist/','rev/','tmp/'],{
    }).pipe(clean());
  });

  gulp.task('useref',['clean'], function(){
    return gulp.src('index.html')
      .pipe(useref())
      .pipe(gulp.dest('dist/'));
  });

  gulp.watch('./bower.json', ['bower']);


  gulp.task('default', ['jshint', 'concat','uglify', 'browser-sync']);

  gulp.task('bulid', ['clean', 'jshint', 'ngHtml2Js','useref', 'concat','uglify',  'rev','revCollecotr']);
  //gulp.task('bulid', ['clean', 'jshint', 'ngHtml2Js', 'concat', 'uglify','rev','revCollecotr','moveHtml']);
})();

