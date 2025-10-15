#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function readJSON(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function concatFiles(files, outFile) {
	const content = files.map(f => fs.readFileSync(f, 'utf8')).join('');
	fs.writeFileSync(outFile, content, 'utf8');
}

function uglify(inputFile, outFile) {
	// Always use uglify-js Node API for cross-platform compatibility
	try {
		const UglifyJS = require('uglify-js');
		const code = fs.readFileSync(inputFile, 'utf8');
		const result = UglifyJS.minify(code);
		if (result.error) throw result.error;
		fs.writeFileSync(outFile, result.code, 'utf8');
	}
	catch (err) {
		console.error('Uglify failed:', err && err.message ? err.message : err);
		process.exit(1);
	}
}

function main() {
	const root = process.cwd();
	const pkg = readJSON(path.join(root, 'package.json'));
	const version = pkg.version;
	const year = new Date().getFullYear();

	const distDir = path.join(root, 'dist');
	const srcDir = path.join(root, 'src');
	ensureDir(distDir);

	const banner = `/*! hellojs v${version} - (c) 2012-${year} Andrew Dodson - MIT https://adodson.com/hello.js/LICENSE */`;

	// Prepare banner files
	fs.writeFileSync(path.join(distDir, 'hello.js'), banner + '\n', 'utf8');
	fs.writeFileSync(path.join(distDir, 'hello.min.js'), banner + '\n', 'utf8');
	fs.writeFileSync(path.join(distDir, 'hello.all.js'), banner + '\n', 'utf8');
	fs.writeFileSync(path.join(distDir, 'hello.all.min.js'), banner + '\n', 'utf8');

	// hello.js core
	concatFiles([
		path.join(srcDir, 'hello.polyfill.js'),
		path.join(srcDir, 'hello.js'),
		path.join(srcDir, 'hello.chromeapp.js'),
		path.join(srcDir, 'hello.phonegap.js'),
		path.join(srcDir, 'hello.amd.js'),
		path.join(srcDir, 'hello.commonjs.js')
	], path.join(distDir, 'hello.js'));

	// hello.all.js with modules
	concatFiles([
		path.join(srcDir, 'hello.polyfill.js'),
		path.join(srcDir, 'hello.js'),
		path.join(srcDir, 'hello.chromeapp.js'),
		path.join(srcDir, 'hello.phonegap.js'),
		path.join(srcDir, 'modules', 'dropbox.js'),
		path.join(srcDir, 'modules', 'facebook.js'),
		path.join(srcDir, 'modules', 'flickr.js'),
		path.join(srcDir, 'modules', 'foursquare.js'),
		path.join(srcDir, 'modules', 'github.js'),
		path.join(srcDir, 'modules', 'google.js'),
		path.join(srcDir, 'modules', 'instagram.js'),
		path.join(srcDir, 'modules', 'joinme.js'),
		path.join(srcDir, 'modules', 'linkedin.js'),
		path.join(srcDir, 'modules', 'soundcloud.js'),
		path.join(srcDir, 'modules', 'spotify.js'),
		path.join(srcDir, 'modules', 'twitter.js'),
		path.join(srcDir, 'modules', 'vk.js'),
		path.join(srcDir, 'modules', 'windows.js'),
		path.join(srcDir, 'modules', 'yahoo.js'),
		path.join(srcDir, 'hello.amd.js'),
		path.join(srcDir, 'hello.commonjs.js')
	], path.join(distDir, 'hello.all.js'));

	// Minify
	uglify(path.join(distDir, 'hello.js'), path.join(distDir, 'hello.min.js'));
	uglify(path.join(distDir, 'hello.all.js'), path.join(distDir, 'hello.all.min.js'));
}

main();


