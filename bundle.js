// Copyright (c) 2022 YieldingCoder. Licensed under the AGPL-3.0-OR-LATER
const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
const outFile = path.resolve(__filename, '..', 'dist', 'out.tmp-1.lua');
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
  __filename,
  '..',
  'bundle',
  'luacc.lua',
)}" ${arguments}`;
// Write to build script and run it
if (process.platform === 'win32') {
  fs.writeFileSync(
    'build.bat',
    `"${path.resolve(
      __filename,
      '..',
      'bundle',
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
  `---@diagnostic disable: undefined-global
------ https://github.com/Conglomeration/Lua/blob/main/dist/combine-fixtmp.js | https://github.com/BreadCity/LuaCC-Template/blob/main/bundle.js
-- Localize Globals
local require = require;local math = math;local bit = bit or bit32;local error = error;local table = table;local string = string;local pairs = pairs;local setmetatable = setmetatable;local print = print;local tonumber = tonumber;local ipairs = ipairs;local getfenv = getfenv;local getgenv = getgenv;
-- General Polyfill
local fenv = (getfenv or function()return _ENV end)();local package = --[[fenv.package or]] {["searchers"]={[2]=function(p) error("Module not bundled: "..p) end}}
-- Roblox Polyfill
if _VERSION == "Luau" then require = (function(...) return package["searchers"][2](...)() end);math = setmetatable({["mod"]=math.fmod},{__index=fenv.math});end;
` + fs.readFileSync(outFile, 'utf-8').replace(/src\//g, '').replace(/NOT_BUNDLED/g,'BUNDLED');
// Remove the temporary output
fs.rmSync(outFile);
// Replace hash
const final = output.replace(
  /\#\#\#hash\#\#\#/g,
  crypto.createHash('sha256').update(output).digest('hex'),
);
// Write Output File
fs.writeFileSync(path.resolve(outFile, '..', 'out.lua'), final);
