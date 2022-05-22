// Copyright (c) 2022 YieldingCoder. Licensed under the AGPL-3.0-OR-LATER
const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const BundleDir = path.resolve(__filename, '..')
const ProjectRoot = path.resolve(BundleDir, '..');

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
};

// Get Arguments
const files = walk(path.resolve(process.cwd()));
const outFile = path.resolve(ProjectRoot, 'dist', 'out.tmp-1.lua');
let arguments = '-o ' + path.relative(process.cwd(), outFile) + '';
arguments +=
  ' ' + path.relative(process.cwd(), path.resolve(process.cwd(), 'init')) + '';
for (const index in files) {
  if (Object.hasOwnProperty.call(files, index)) {
    if (files[index].endsWith('.lua')) {
      const filePath = path
        .relative(process.cwd(), files[index])
        .replace('.lua', '');
      if (
        filePath !== 'src\\StarterGUI\\Scripts\\Main\\init' &&
        filePath !== 'src/StarterGUI/Scripts/Main/init' &&
        !filePath.endsWith('.client')
      ) {
        arguments += ' ' + filePath.replace(/\\/g, '/') + '';
      }
    }
  }
}

// Luacc command
const command = `"${path.resolve(
  BundleDir,
  'luacc.lua',
)}" ${arguments}`;
// Write to build script and run it
if (process.platform === 'win32') {
  fs.writeFileSync(
    'build.bat',
    `"${path.resolve(
      BundleDir,
      'lua',
      'win32',
      'lua53',
    )}" ${command}`,
  );
  execSync(`"${path.resolve('build.bat')}"`);
  fs.rmSync('build.bat');
} else {
  fs.writeFileSync(
    'build.sh',
    `#!/bin/bash
luajit ${command}`,
  ); //assume luajit is installed fuck off
  execSync('build.sh');
  fs.rmSync('build.sh');
}
// Polyfill it
const output =
  fs.readFileSync(path.resolve(__filename,'..','polyfill.lua')) + fs.readFileSync(outFile, 'utf-8').replace(/src\//g, '').replace(/NOT_BUNDLED/g,'BUNDLED');
// Remove the temporary output
fs.rmSync(outFile);
// Replace hash
const final = output.replace(
  /\#\#\#hash\#\#\#/g,
  crypto.createHash('sha256').update(output).digest('hex'),
);
// Write Output File
fs.writeFileSync(path.resolve(outFile, '..', 'out.lua'), final);
