/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var WORMS;
	(function (WORMS) {
	    var Base = (function () {
	        function Base(length) {
	            this.step = 0;
	            this.bone = new ROUTES.Line();
	            this.setLength(length);
	        }
	        Base.prototype.setLength = function (length) {
	            this.prevLength = Math.floor(length);
	            this.allocLength(length);
	        };
	        Base.prototype.updateLength = function () {
	            this.setLength(this.length);
	        };
	        Base.prototype.allocLength = function (length) {
	            length = Math.floor(length);
	            this.diffLength = length - this.prevLength;
	            this.bone.clear();
	            var L = this.prevLength > length ? this.prevLength : length;
	            for (var i = 0; i < L; i++) {
	                this.bone.push(new UTILS.Pos());
	            }
	            // re set bones
	            this.setStep(this.step);
	        };
	        Base.prototype.push = function (x, y) {
	            // 先頭に加えて、１つずつずらす。
	            var i = this.bone.getLength() - 1;
	            for (; i >= 1; i--) {
	                this.bone.at(i).x = this.bone.at(i - 1).x;
	                this.bone.at(i).y = this.bone.at(i - 1).y;
	            }
	            var bbone = this.bone.at(0);
	            bbone.x = x;
	            bbone.y = y;
	        };
	        Base.prototype.render = function () {
	        };
	        Base.prototype.setRoute = function (line, nextLength) {
	            if (line.getLength() < this.prevLength)
	                return;
	            this.step = 0;
	            this.route = line;
	            this.allocLength(UTILS.def(nextLength, this.length));
	        };
	        Base.prototype.addStep = function (step) {
	            var length = this.route.getLength() - this.prevLength;
	            var p = step / length;
	            if (p < 0) {
	                this.setStep(1);
	                return false;
	            }
	            return this.setStep(this.step + p);
	        };
	        Base.prototype.setStep = function (step) {
	            if (step < 0)
	                step = 0;
	            if (step > 1)
	                step = 1;
	            var s = step * 1.2;
	            s = s > 1 ? 1 : s;
	            this.length = Math.floor(s * this.diffLength + this.prevLength);
	            this.step = step;
	            if (!this.route)
	                return false;
	            var beginIndex = this.prevLength - 1;
	            var length = this.route.getLength() - beginIndex - 1;
	            var posIndex = Math.floor(length * step);
	            var offset = (length * step - posIndex);
	            for (var i = 0; i < this.bone.getLength(); i++) {
	                var id = beginIndex - i + posIndex;
	                var b = this.bone.at(i);
	                var l = this.route.at(id);
	                var nl = this.route.at(id + 1);
	                if (!l)
	                    continue;
	                var dx = 0;
	                var dy = 0;
	                if (nl) {
	                    dx = (nl.x - l.x) * offset;
	                    dy = (nl.y - l.y) * offset;
	                }
	                b.x = l.x + dx;
	                b.y = l.y + dy;
	            }
	            return true;
	        };
	        Base.prototype.getStep = function () {
	            return this.step;
	        };
	        Base.prototype.reverse = function () {
	            this.bone.reverse();
	        };
	        Base.prototype.getCurrentLine = function () {
	            // console.log(this.bone);
	            var line = new ROUTES.Line();
	            var current = this.bone.clone();
	            for (var i = 0; i < this.length; i++) {
	                line.push(current.at(i).clone());
	            }
	            return line.reverse();
	        };
	        Base.prototype.getHeadVecPos = function () {
	            return this.bone.getHeadVecPos().add(Math.PI);
	        };
	        Base.prototype.getTailVecPos = function () {
	            return this.bone.getTailVecPos().add(Math.PI);
	        };
	        Base.prototype.getRoute = function () {
	            return this.route;
	        };
	        Base.prototype.getLength = function () {
	            return this.prevLength;
	        };
	        Base.prototype.getCurrentLength = function () {
	            return this.length;
	        };
	        return Base;
	    }());
	    WORMS.Base = Base;
	})(WORMS || (WORMS = {}));
	///<reference path='@base.ts' />
	var WORMS;
	(function (WORMS) {
	    var Simple = (function (_super) {
	        __extends(Simple, _super);
	        function Simple(length, option) {
	            var _this = _super.call(this, length) || this;
	            _this.bodyGraphics = new PIXI.Graphics();
	            _this.shadowGraphics = new PIXI.Graphics();
	            _this.setOption(option);
	            _this.setVisible(true);
	            return _this;
	        }
	        Simple.prototype.setOption = function (option) {
	            this.option = option;
	            option.fillColor = UTILS.def(option.fillColor, 0xff0000);
	            option.shadow = UTILS.def(option.shadow, false);
	            option.shadowColor = UTILS.def(option.shadowColor, 0xCCCCCC);
	            option.shadowPosition = UTILS.def(option.shadowPosition, new UTILS.Pos());
	            option.shadowThickness = UTILS.def(option.shadowThickness, option.thickness);
	        };
	        Simple.prototype.getOption = function () {
	            return this.option;
	        };
	        Simple.prototype.render = function () {
	            if (this.option.shadow) {
	                this.renderWith(this.shadowGraphics, this.option.shadowColor, this.option.shadowThickness, this.option.shadowPosition.x, this.option.shadowPosition.y);
	            }
	            this.renderWith(this.bodyGraphics, this.option.fillColor, this.option.thickness, 0, 0);
	        };
	        Simple.prototype.renderWith = function (graphics, color, thickness, offsetX, offsetY) {
	            graphics.clear();
	            var bbone = this.bone.at(0);
	            var ebone = this.bone.at(this.length - 1);
	            graphics.beginFill(color);
	            graphics.drawCircle(bbone.x + offsetX, bbone.y + offsetY, thickness / 2);
	            graphics.endFill();
	            graphics.lineStyle(thickness, color);
	            graphics.moveTo(bbone.x + offsetX, bbone.y + offsetY);
	            for (var i = 1; i < this.length - 1; i++) {
	                var nbone = this.bone.at(i);
	                graphics.lineTo(nbone.x + offsetX, nbone.y + offsetY);
	            }
	            graphics.lineTo(ebone.x + offsetX, ebone.y + offsetY);
	            graphics.lineStyle();
	            graphics.beginFill(color);
	            graphics.drawCircle(ebone.x + offsetX, ebone.y + offsetY, thickness / 2);
	            graphics.endFill();
	        };
	        Simple.prototype.setVisible = function (visible) {
	            this.visible = visible;
	            this.bodyGraphics.visible = this.shadowGraphics.visible = visible;
	        };
	        Simple.prototype.getVisible = function () {
	            return this.visible;
	        };
	        return Simple;
	    }(WORMS.Base));
	    WORMS.Simple = Simple;
	})(WORMS || (WORMS = {}));
	///<reference path='@base.ts' />
	///<reference path='simple.ts' />
	window['WORMS'] = WORMS;
	///<reference path='@base.ts' />
	var WORMS;
	(function (WORMS) {
	    var Nasty = (function (_super) {
	        __extends(Nasty, _super);
	        function Nasty(length, option) {
	            if (option === void 0) { option = { thickness: 10 }; }
	            var _this = _super.call(this, length) || this;
	            _this.setOption(option);
	            _this.graphics = new PIXI.Graphics();
	            return _this;
	        }
	        Nasty.prototype.allocLength = function (length) {
	            _super.prototype.allocLength.call(this, length);
	            this.bodyPos = [];
	            for (var i = 0; i < this.bone.getLength(); i++) {
	                this.bodyPos.push(new BodyPos());
	            }
	        };
	        Nasty.prototype.setOption = function (option) {
	            this._option = option;
	            option.headLength = UTILS.def(option.headLength, 0.5);
	            option.tailLength = UTILS.def(option.tailLength, 0.5);
	            option.fillColor = UTILS.def(option.fillColor, 0xff0000);
	            option.borderColor = UTILS.def(option.borderColor, 0x0000ff);
	            option.borderThickness = UTILS.def(option.borderThickness, 5);
	        };
	        Nasty.prototype.getOption = function () {
	            return this._option;
	        };
	        Nasty.prototype.render = function () {
	            var bbone = this.bone.at(0);
	            // ワームの外殻を生成
	            var ebone = this.bone.at(this.length - 1);
	            var bbody = this.bodyPos[0];
	            var ebody = this.bodyPos[this.length - 1];
	            bbody.left.x = bbone.x;
	            bbody.left.y = bbone.y;
	            var L = this.length - 1;
	            for (var i = 1; i < L; i++) {
	                var nbone = this.bone.at(i);
	                var nbody = this.bodyPos[i];
	                var vx = this.bone.at(i - 1).x - nbone.x;
	                var vy = this.bone.at(i - 1).y - nbone.y;
	                var radian = Matthew.H_PI;
	                var headLength = this.length * this._option.headLength;
	                var tailLength = this.length * this._option.tailLength;
	                if (i < headLength) {
	                    radian = i / headLength * Matthew.H_PI;
	                }
	                else if (i > L - tailLength) {
	                    radian = (i - (L - tailLength)) / tailLength * Matthew.H_PI + Matthew.H_PI;
	                }
	                var r = Math.sin(radian) * this._option.thickness;
	                var vl = vx * vx + vy * vy;
	                var vr = Math.sqrt(vl);
	                vx = vx / vr * r;
	                vy = vy / vr * r;
	                nbody.left.x = nbone.x + -vy;
	                nbody.left.y = nbone.y + vx;
	                nbody.right.x = nbone.x + vy;
	                nbody.right.y = nbone.y + -vx;
	            }
	            ebody.left.x = ebone.x;
	            ebody.left.y = ebone.y;
	            this.graphics.clear();
	            this.graphics.lineStyle(this._option.borderThickness, this._option.borderColor);
	            this.graphics.beginFill(this._option.fillColor);
	            this.graphics.moveTo(bbody.left.x, bbody.left.y);
	            for (var i = 1; i < this.length; i++) {
	                this.graphics.lineTo(this.bodyPos[i].left.x, this.bodyPos[i].left.y);
	            }
	            for (var i = this.length - 2; i >= 2; i--) {
	                this.graphics.lineTo(this.bodyPos[i].right.x, this.bodyPos[i].right.y);
	            }
	            this.graphics.lineTo(bbody.left.x, bbody.left.y);
	            this.graphics.endFill();
	        };
	        return Nasty;
	    }(WORMS.Base));
	    WORMS.Nasty = Nasty;
	    var BodyPos = (function () {
	        function BodyPos() {
	            this.left = new UTILS.Pos();
	            this.right = new UTILS.Pos();
	        }
	        return BodyPos;
	    }());
	})(WORMS || (WORMS = {}));
	///<reference path='@base.ts' />
	var WORMS;
	(function (WORMS) {
	    var SimpleLight = (function (_super) {
	        __extends(SimpleLight, _super);
	        function SimpleLight(length, option) {
	            var _this = _super.call(this, length) || this;
	            _this.setOption(option);
	            _this.id = SimpleLight._id;
	            SimpleLight.worms[_this.id] = _this;
	            SimpleLight._id++;
	            return _this;
	        }
	        SimpleLight.render = function () {
	            //console.log('render');
	            this.graphics.clear();
	            for (var id in this.worms) {
	                var worm = this.worms[id];
	                worm.render();
	                //console.log(worm.id);
	            }
	        };
	        SimpleLight.prototype.setOption = function (option) {
	            this.option = option;
	            option.fillColor = UTILS.def(option.fillColor, 0xff0000);
	        };
	        SimpleLight.prototype.getOption = function () {
	            return this.option;
	        };
	        SimpleLight.prototype.render = function () {
	            this.renderWith(SimpleLight.graphics, this.option.fillColor, this.option.thickness, 0, 0);
	        };
	        SimpleLight.prototype.dispose = function () {
	            this.option = null;
	            SimpleLight.worms[this.id] = null;
	            delete SimpleLight.worms[this.id];
	        };
	        SimpleLight.prototype.renderWith = function (graphics, color, thickness, offsetX, offsetY) {
	            var bbone = this.bone.at(0);
	            var ebone = this.bone.at(this.length - 1);
	            graphics.beginFill(color);
	            graphics.drawCircle(bbone.x + offsetX, bbone.y + offsetY, thickness / 2);
	            graphics.endFill();
	            graphics.lineStyle(thickness, color);
	            graphics.moveTo(bbone.x + offsetX, bbone.y + offsetY);
	            for (var i = 1; i < this.length - 1; i++) {
	                var nbone = this.bone.at(i);
	                graphics.lineTo(nbone.x + offsetX, nbone.y + offsetY);
	            }
	            graphics.lineTo(ebone.x + offsetX, ebone.y + offsetY);
	            graphics.lineStyle();
	            graphics.beginFill(color);
	            graphics.drawCircle(ebone.x + offsetX, ebone.y + offsetY, thickness / 2);
	            graphics.endFill();
	        };
	        return SimpleLight;
	    }(WORMS.Base));
	    SimpleLight.worms = {};
	    SimpleLight._id = 0;
	    WORMS.SimpleLight = SimpleLight;
	})(WORMS || (WORMS = {}));


/***/ }
/******/ ]);