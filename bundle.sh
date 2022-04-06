#!/bin/bash
touch nou.txt
mkdir dist 2> nou.txt
cd src/StarterGUI/Scripts/Main
node ../../../../bundle/index.js
cd ../../../..
rm nou.txt
