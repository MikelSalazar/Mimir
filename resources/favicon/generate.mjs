/** A small Node script that generates the PNG favicons from the SVG file. */

// Node Modules
import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Get the current file name and folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global variables
let inkskapePath = '\"C:/Program Files/Inkscape/bin/inkscape.exe\"';
let outputPath = '/../../dist/imgs/favicons/';
let iconFileName = 'favicon.svg';
let iconFilePath = path.join(__dirname, iconFileName);
let iconSizes = [32, 48, 64, 128, 144, 192];

// Entry point
console.log('Generating Icons:');
iconSizes.forEach(iconSize => {
	let filePath = path.join(__dirname, outputPath, 'favicon' + iconSize + '.png');
	console.log('Creating ' + filePath);
	execSync(inkskapePath + ' ' + iconFilePath + ' -o ' + filePath + ' -w ' + iconSize);
});
fs.copyFileSync(iconFilePath, path.join(__dirname, outputPath, iconFileName));
console.log('Copy icon: ' + iconFilePath);

console.log('All icons Generated');

