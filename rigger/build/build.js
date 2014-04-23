/* Build script for StageSoc game rigger, parser, combiner, minifier and optional compresser */
/*
	StageSoc Games (Including Rigger)
	Copyright (C) 2014  Corin Chaplin

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

"use strict";

var fs = require("fs");
var querystring = require('querystring');
var http = require('http');


// Get the command line input (to check for compression) + filename
var useCompress, filename = "rigger.js";
if(useCompress = (process.argv[2] || false)){
	if(useCompress === true){
		filename = process.argv[3] || "rigger.zip";
	}else{
		filename = useCompress; // Assume file if it's not a bool
		useCompress = false;
	}
}

console.log("Build file for Rigger");
console.log("Using compression = "+useCompress);
console.log("Output file = "+filename);
console.log();

/*
	Read each file (assumes that root dir is the parent of the current dir)
	Remove bits before @start and after @end on each file
	Then combine them into one file
*/
var rootDir = "../";
var dir = rootDir + "js/";
var suffix = ".rigger.js";
var prefix = "";

var files = ["main", "gels", "assets", "objects", "keybind", "audio", "def"];

console.log("Reading files");
var strings = files.map(function(a){
	var fn = dir + prefix + a + suffix;
	console.log("    "+fn);
	var f = fs.readFileSync(fn); // Synconous to make dep order eaiser
	if(!f){throw new Error();}
	f = f.toString();

	// Simple split
	//f = f.split("@start")[1] || f;
	//f = f.split("@end")[0] || f;
	// Remove the last line
	//f = f.substring(0, f.lastIndexOf("\n")) || f;

	return f;
});

console.log("Combining Files");
var full = strings.reduce(function(p, c){
	return p + c;
}, "");



console.log("Minifying - Google Closure Compiler");

var post_data = querystring.stringify({
	'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
	'output_format': 'json',
	'output_info': 'compiled_code',
	'warning_level' : 'QUIET',
	'js_code' : full
});

// An object of options to indicate where to post to
var post_options = {
	host: 'closure-compiler.appspot.com',
	port: '80',
	path: '/compile',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
  }
};

var chunkAcc = "";

// Set up the request
var post_req = http.request(post_options, function(res) {
	res.setEncoding('utf8');
	res.on("data", function(chunk){
		chunkAcc += chunk;
	});
	res.on("end", postProcess);
});

// post the data
console.log("Sending request to Google");
post_req.write(post_data);
post_req.end();



function postProcess(){
	console.log("Got response!");
	var s = JSON.parse(chunkAcc).compiledCode;

	// Writing data to file
	fs.writeFileSync(filename, s);

	console.log("Done");
}