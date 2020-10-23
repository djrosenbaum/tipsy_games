const cssimport = require('gulp-cssimport');
const del = require('del');
const { exec } = require('child_process');
const gulp = require('gulp');
const include = require('gulp-include');
const minifier = require('gulp-minifier');
const path = require('path');
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');

// The name of the project selected in cli.js
const project = process.env.CLIENT;

// The client directory
const base = path.join('projects', project);

let docs = '';
if (project === 'home') {
  docs = path.join('../', 'docs');
} else {
  docs = path.join('../', 'docs', project);
}

// Server
let shouldStartServer = false;

/**
 * Clean dist directory.
 */
async function clean() {
  const directories = [];
  directories.push(path.resolve(base, 'dist'));
  if (project !== 'home') {
    directories.push(path.resolve(docs))
  }
  await del(directories);
}

/**
 * Pack the CSS files.
 */
function css() {
  return gulp.src(path.resolve(base, 'src', 'css', 'index.css'))
  	.pipe(cssimport())
    .pipe(gulp.dest(path.resolve(base, 'dist', 'css')));
}

/**
 *Bundle the javascript files
 */
async function javascript() {
	const bundle = await rollup.rollup(rollupConfig);

	await bundle.write(rollupConfig.output);
}

/**
 * Copy static image files.
 */
function copyImages() {
  const files = [];

  // copy all images
  files.push(
    gulp.src(path.resolve(base, 'src', 'images', '**', '*'))
      .pipe(gulp.dest(path.resolve(docs, 'images')))
  );

  // copy favicon
  files.push(
    gulp.src(path.resolve(base, 'src', 'images', 'favicon.ico'))
      .pipe(gulp.dest(path.resolve(docs)))
  );

  return Promise.all(files);
}

function includes() {
	return gulp.src(path.resolve(base, 'src', 'index.html'))
	.pipe(include({
    hardFail: true
  }))
	.on('error', console.log)
	.pipe(gulp.dest(path.resolve(base, 'dist')))
}

function minifyHTML() {
  return gulp.src(path.resolve(base, 'dist', 'index.html')).pipe(minifier({
    minify: true,
    minifyHTML: {
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  })).pipe(gulp.dest(path.resolve(base, 'dist')));
}

async function watch() {
  shouldStartServer = true;
  return gulp.watch([path.resolve(base, 'src')],
    {
      ignoreInitial: false,
    },
    build
  );
}

function outputToDocs() {
  const files = [];

  // copy index
  files.push(
    gulp.src(path.resolve(base, 'dist', 'index.html'))
      .pipe(gulp.dest(path.resolve(docs)))
  );

  return Promise.all(files);
}

function startServer(cb) {
  if (!shouldStartServer) {
    return cb();
  }
  const port = '8081';
  console.log(`localhost:${port}`);
  shouldStartServer = false;

  let childProcess = exec(`http-server ${path.resolve(docs)} -o -p ${port}`, (err, stdout, stderr) => {
    // child process
  });

  childProcess.stdout.on('data', data => console.log(data.toString()));

  cb();
}

const build = gulp.series(clean, gulp.parallel(css, javascript, copyImages), includes, minifyHTML, outputToDocs, startServer);

exports.build = build;
exports.watch = watch;