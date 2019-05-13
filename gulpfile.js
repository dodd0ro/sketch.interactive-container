'use strict';

var isDev = true;

var stylesMainPath = './src/styles/main.scss',
	stylesPath = './src/styles/**/*',
	distPath = './public_dev',
	distProdPath = './public',
	assetsPath = 'src/assets/**/*',
	htmlPath = 'src/html/**/*',
	jsPath = 'src/js/**/*',
	jsMainPath = 'src/js/main.js';

const gulp = require('gulp'),
	gp = require('gulp-load-plugins')(),
	del = require('del'),
	browserSync = require('browser-sync').create(),
	uglify = require('gulp-uglify'),
	babelify = require('babelify');

//

var Server = {
	_isRunning: false,
	start: () => {
		this._isRunning = true;
		browserSync.init({
			server: {
				baseDir: distPath
			}
		});
	},
	reload: () => {
		if (this._isRunning) browserSync.reload();
	}
};

function turnDevModeOn(callback) {
	isDev = true;
	callback();
}
function turnDevModeOff(callback) {
	isDev = false;
	distPath = distProdPath;
	callback();
}

// Tasks //

gulp.task('clean', function() {
	return del(distPath + '/*');
});

gulp.task('styles', function() {
	return gulp
		.src(stylesMainPath)
		.pipe(gp.if(isDev, gp.sourcemaps.init()))
		.pipe(
			gp
				.sass({ outputStyle: isDev ? 'compressed' : 'nested' })
				.on('error', gp.sass.logError)
		)
		.pipe(
			gp.autoprefixer({
				browsers: [ 'last 2 versions' ],
				cascade: false
			})
		)
		.pipe(gp.if(!isDev, gp.csso()))
		.pipe(gp.if(isDev, gp.sourcemaps.write('./source/styles')))
		.pipe(gulp.dest(distPath))
		.pipe(gp.debug({ title: 'styles:dest' }))
		.on('end', Server.reload);
});

gulp.task('assets', function() {
	return gulp
		.src(assetsPath)
		.pipe(gulp.dest(distPath + '/assets'))
		.pipe(gp.debug({ title: 'assets:dest' }))
		.on('end', Server.reload);
});

gulp.task('html', function() {
	return gulp
		.src(htmlPath)
		.pipe(gulp.dest(distPath))
		.pipe(gp.debug({ title: 'html:dest' }))
		.on('end', Server.reload);
});

gulp.task('js', function() {
	return gulp
		.src(jsMainPath)
		.pipe(
			gp.browserify({
				insertGlobals: true,
				debug: isDev,
				transform: [
					babelify.configure({
						compact: false, //QUEST
						presets: [
							['@babel/env', {
								"targets": { "browsers": "> 0.5%, last 2 versions, Firefox ESR, not dead" }
							}]
						],
						sourceMaps: true
					})
				]
			})
		)
		.pipe(gp.if(isDev, gp.sourcemaps.init({ loadMaps: true })))
		.pipe(gp.if(!isDev, uglify()))
		.pipe(gp.if(isDev, gp.sourcemaps.write('./source/js')))
		.pipe(gulp.dest(distPath))
		.pipe(gp.debug({ title: 'js:dest' }))
		.on('end', Server.reload);
});

// Main tasks //

gulp.task(
	'build',
	gulp.series('clean', gulp.parallel('styles', 'assets', 'html', 'js'))
);

gulp.task('watch', function(callback) {
	gulp.watch(stylesPath, gulp.series('styles'));
	gulp.watch(assetsPath, gulp.series('assets'));
	gulp.watch(htmlPath, gulp.series('html'));
	gulp.watch(jsPath, gulp.series('js'));
	callback();
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('build:production', gulp.series(turnDevModeOff, 'build'));

gulp.task('server', gulp.series('build', gulp.parallel('watch', Server.start)));
