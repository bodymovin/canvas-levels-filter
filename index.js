var levelsFilter = require('levels-filter');

var canvasLevelsFactory = (function(){

	var filterProto = {
		init: init,
		compose: compose,
		destroyCanvasData: destroyCanvasData,
		resetCanvasData: resetCanvasData,
		setLevelValues: setLevelValues,
		_applyToCanvas: _applyToCanvas,
		_createImageData: _createImageData
	}

	Object.defineProperty(filterProto, 'gamma', {
		get: function() { return this._filterLevels.gamma; },
  		set: function(newValue) { this._filterLevels.gamma = newValue; }
	})

	Object.defineProperty(filterProto, 'inputBlack', {
		get: function() { return this._filterLevels.inputBlack; },
  		set: function(newValue) { this._filterLevels.inputBlack = newValue; }
	})

	Object.defineProperty(filterProto, 'inputWhite', {
		get: function() { return this._filterLevels.inputWhite; },
  		set: function(newValue) { this._filterLevels.inputWhite = newValue; }
	})

	Object.defineProperty(filterProto, 'outputBlack', {
		get: function() { return this._filterLevels.outputBlack; },
  		set: function(newValue) { this._filterLevels.outputBlack = newValue; }
	})

	Object.defineProperty(filterProto, 'outputWhite', {
		get: function() { return this._filterLevels.outputWhite; },
  		set: function(newValue) { this._filterLevels.outputWhite = newValue; }
	})

	Object.defineProperty(filterProto, 'values', {
		get: function() { return this._filterLevels.getLevelValues(); }
	})

	Object.defineProperty(filterProto, 'color', {
		get: function() { return this._color; },
  		set: function(newValue) { this._color = newValue; }
	})

	Object.defineProperty(filterProto, 'canvas', {
		get: function() { return this._canvas; },
  		set: function(newValue) { this._createImageData(newValue); this._canvas = newValue; }
	})

	function init(color) {
		if(color === 'rgb') {
			this._color = 'rgb';
		} else if(color === 'r' || color === 'red') {
			this._color = 'r';
		} else if(color === 'g' || color === 'green') {
			this._color = 'g';
		} else if(color === 'b' || color === 'blue') {
			this._color = 'b';
		} else if(color === 'a' || color === 'alpha') {
			this._color = 'a';
		}
	}

	function resetCanvasData() {
		var ctx = this._canvas.getContext('2d');
		ctx.drawImage(this._canvasHelper, 0, 0);
	}

	function destroyCanvasData() {
		this._canvasHelper = null;
	}

	function _createImageData(value) {
		this._canvasHelper = document.createElement('canvas');
		this._canvasHelper.width = value.width;
		this._canvasHelper.height = value.height;
		var ctx = this._canvasHelper.getContext('2d');
		ctx.drawImage(value, 0, 0);
	}

	function _applyToCanvas() {
		var _helperData = this._canvasHelper.getContext('2d').getImageData(0,0,this._canvasHelper.width,this._canvasHelper.height).data
		var ctx = this._canvas.getContext('2d');
		var imageData = ctx.getImageData(0,0,this._canvas.width,this._canvas.height);
		var imageDataPixels = imageData.data;
		var tableValues = this._filterLevels.getTableValues();
		var i, len;
		len = tableValues.length;
		for(i = 0; i < len; i += 1) {
			tableValues[i] *= 255;
		}
		len = imageDataPixels.length;
		var color = this._color;
		for(i = 0; i < len; i += 4) {
			if(color === 'rgb' || color === 'r') {
				imageDataPixels[i] = tableValues[_helperData[i]];
			}
			if(color === 'rgb' || color === 'g') {
				imageDataPixels[i + 1] = tableValues[_helperData[i + 1]];
			}
			if(color === 'rgb' || color === 'b') {
				imageDataPixels[i + 2] = tableValues[_helperData[i + 2]];
			}
			if(color === 'a') {
				imageDataPixels[i + 3] = tableValues[_helperData[i + 3]];
			}
		}
		ctx.putImageData(imageData, 0, 0);
	}

	function compose(cvsData) {
		this._canvas = cvsData || this._canvas;
		if(!this._canvas){
			return;
		}
		this._applyToCanvas();
		
	}

	function setLevelValues(values) {
		this._filterLevels.setLevelValues(values);
	}

	return function(color, canvas){
		var filterLevels = levelsFilter();
		var filterInstance = Object.create(filterProto, {
			_color: {
				value: 'rgb',
				writable: true
			},
			_filterLevels: {
				value: filterLevels
			},
			_canvas: {
				value: canvas,
				writable: true
			},
			_canvasHelper: {
				value: null,
				writable: true
			}
		});
		filterInstance.init(color);
		return filterInstance;
	}
}())

if (typeof module !== 'undefined' && 'exports' in module) {
	module.exports = canvasLevelsFactory;
}