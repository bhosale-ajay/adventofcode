var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var exec = require("child_process").exec;
var tsProject = ts.createProject("./tsconfig.json");

gulp.task("build", function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["build"], function() {
    return exec("node dist/run", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});
