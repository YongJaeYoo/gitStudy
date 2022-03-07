
const gulp = require('gulp');

const port = 7000;
 /*=============================
 @Path 정의
 ==============================*/
 const root = './';
 const paths = {
	input: './src/**/*',
	output: './dist',
	styles: {
		input: 'src/sass/*.scss',
		inputFile: 'src/sass/*.scss',
		output: 'dist/event/css'
	},
	images: {
		input: 'src/images/**/**/*',
		inputFile: 'src/images/**/**/*',
		output: 'dist/event/images/'
	},
	html: {
		input: 'src/html/**/*.html',
		output: 'dist/html/'
	},
	js: {
		input : 'src/js/',
		output : 'dist/js/'
	}
};

//browser-sync
const browserSync = require('browser-sync');
function bs(){
	browserSync.init({
		server : {baseDir : paths.output},
        port: port,
        ui: { port: port + 1 },
        ghostMode: false,
        directory: true
    });
};

// sass
const gulpsass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require("gulp-autoprefixer");//벤더프리픽스 설정
function sass(){
	return gulp.src(paths.styles.inputFile)
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(gulpsass.sync().on('error', gulpsass.logError))
	.pipe(gulpsass({ errLogToConsole: true, outputStyle: "compact" }).on("error", gulpsass.logError)) //nested compact expanded compressed
	.pipe(autoprefixer({
		browsers: [
			// "ie >= 7",
			"last 10 Chrome versions",
			"last 10 Firefox versions",
			"last 2 Opera versions",
			"iOS >= 7",
			"Android >= 4.1"
		],
		cascade: true,
		remove: false
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(paths.styles.output))
    .pipe(browserSync.stream({ match: "**/*.css" }))
    // .on('finish',browserSync.reload)
}

// html-include
const include = require('gulp-html-tag-include');
function htmlInclude(){
	return gulp.src([
		paths.html.input,
		'./src/html/**/**/*.*',
		'!./src/html/include/',
		'!./src/html/include/**.*'
	])
	.pipe(include())
	.pipe(gulp.dest(paths.html.output))
    .on('finish',browserSync.reload);
};


const del = require("del");
function delHtml(){
    return del(paths.html.output)
}

// js 이동
function jsCopy(done){
	gulp.src(paths.js.input+'*.js')
	.pipe(gulp.dest(paths.js.output))
	.on('finish',browserSync.reload)
	done();
}

// img 이동 
function imgCopy(done){
	gulp.src([
		paths.images.input+'*.*'
	])
	.pipe(gulp.dest(paths.images.output))
	.on('finish',browserSync.reload)
	done();
}

function watchFile() {
	gulp.watch(paths.styles.inputFile, sass);
	gulp.watch(paths.js.input+'*.js', jsCopy);
	gulp.watch(paths.images.input+'*.*', imgCopy);
	gulp.watch(paths.html.input, htmlInclude);
};

// 취합 다중 실행
const watch = gulp.parallel(watchFile, bs);

// tasks 선언
exports.watch = watch;
exports.bs = bs;
exports.sass = sass;
exports.htmlInclude = gulp.series(delHtml,htmlInclude);
exports.delHtml = delHtml;
exports.jsCopy = jsCopy;
exports.imgCopy = imgCopy;
exports.default = watch; // 파일와치와 브라우저싱크 자동실행