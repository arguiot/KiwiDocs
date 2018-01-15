var gulp = require("gulp"),
	rename = require("gulp-rename");
uglify = require("gulp-uglify");
babel = require("gulp-babel");
babili = require("gulp-babili");
rigger = require("gulp-rigger");

gulp.task("copy", function () {
	gulp.src("src/html/*.!(png|json)")
    .pipe(gulp.dest("dist/"));
});

gulp.task("default", [ "copy" ]);
