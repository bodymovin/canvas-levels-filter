# canvas-levels-filter
A module for applying a level filter effect to a canvas

### Usage  

`var canvasLevels = require('canvas-levels-filter');
var canvasLevelsInstance = svgLevels();
levelsInstance.setLevelValues({
	inputBlack: 0,
    inputWhite: 127,
    gamma: 1,
    outputBlack: 127,
    outputWhite: 255
})
levelsInstance.canvas = canvas;
var svgFilter = levelsInstance.compose();

### Properties  
* inputBlack
* outputBlack
* gamma
* outputBlack
* inputBlack
* color: the color channel
* values: an object with one or more of the previous properties
* filter: you can pass your own filter element


### Methods  

* setLevelValues: accepts an object with one or more of the level properties
* compose: applies the filter to the specified canvas
* resetCanvasData: restore the canvas image to it's original image