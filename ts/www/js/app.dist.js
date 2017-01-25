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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(1);
	var route_1 = __webpack_require__(3);
	var worm_1 = __webpack_require__(4);
	var renderer;
	var stage = new PIXI.Container();
	var canvas;
	var sw, sh;
	var init = function () {
	    renderer = PIXI.autoDetectRenderer(800, 800, { antialias: true });
	    canvas = document.getElementById("content");
	    canvas.appendChild(renderer.view);
	    renderer.view.style.width = "100%";
	    renderer.view.style.height = "100%";
	    window.addEventListener("resize", resize);
	    var shape = new PIXI.Graphics();
	    shape.lineStyle(2, 0xffffff);
	    shape.moveTo(0, 0);
	    shape.lineTo(100, 100);
	    shape.drawCircle(50, 50, 50);
	    stage.addChild(shape);
	    window.onresize = function () {
	        resize();
	    };
	    draw();
	    resize();
	    stage.addChild(g);
	    window.addEventListener("mousemove", function (e) {
	        mouse.x = e.clientX * 2;
	        mouse.y = e.clientY * 2;
	    });
	    stage.addChild(w);
	};
	var g = new PIXI.Graphics();
	var rg = new route_1.RouteGenerator(g);
	var mouse = new utils_1.Pos();
	var L = 30;
	var w = new worm_1.FollowWorm(L);
	var draw = function () {
	    requestAnimationFrame(draw);
	    g.clear();
	    g.lineStyle(2, 0xff0000);
	    var routes = rg.getAllRoute(new utils_1.VecPos(mouse.x, mouse.y, 0.1), new utils_1.VecPos(600, 600, 0), 250, 150);
	    var min = Number.MAX_VALUE;
	    var route;
	    routes.forEach(function (r) {
	        if (r.getLength() < min) {
	            min = r.getLength();
	            route = r;
	        }
	    });
	    var vecs = route.generateRoute(20);
	    w.setRoute(vecs);
	    w.step();
	    renderer.render(stage);
	};
	var resize = function () {
	    var width = canvas.offsetWidth * 2;
	    var height = canvas.offsetHeight * 2;
	    sw = width;
	    sh = height;
	    renderer.resize(width, height);
	};
	window.onload = init;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var matthew_1 = __webpack_require__(2);
	var Pos = (function () {
	    function Pos(x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this.x = 0;
	        this.y = 0;
	        this.x = x;
	        this.y = y;
	    }
	    return Pos;
	}());
	exports.Pos = Pos;
	var VecPos = (function () {
	    function VecPos(x, y, r) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        if (r === void 0) { r = 0; }
	        this.r = 0;
	        this.pos = new Pos(x, y);
	        this.r = r;
	    }
	    return VecPos;
	}());
	exports.VecPos = VecPos;
	var Circle = (function () {
	    function Circle(x, y, r, d, tr) {
	        this.pos = new Pos(x, y);
	        this.r = r;
	        this.d = d;
	        this.tr = matthew_1.default.normalize(tr);
	    }
	    return Circle;
	}());
	exports.Circle = Circle;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Matthew = (function () {
	    function Matthew() {
	    }
	    Matthew.normalize = function (r) {
	        r = r % this.D_PI;
	        if (r < 0)
	            return this.D_PI + r;
	        return r;
	    };
	    Matthew.abs = function (v) {
	        return v < 0 ? -v : v;
	    };
	    return Matthew;
	}());
	Matthew.PI = Math.PI;
	Matthew.H_PI = Math.PI / 2;
	Matthew.D_PI = Math.PI * 2;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Matthew;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(1);
	var matthew_1 = __webpack_require__(2);
	var Route = (function () {
	    function Route(c1, c2, c1rb, c2rb, c1rl, c2rl) {
	        this.c1 = c1;
	        this.c2 = c2;
	        this.c1rb = c1rb;
	        this.c2rb = c2rb;
	        this.c1rl = c1rl;
	        this.c2rl = c2rl;
	    }
	    Route.prototype.generateRoute = function (res, route) {
	        if (route === void 0) { route = null; }
	        var _route;
	        if (route) {
	            _route = route;
	            _route.length = 0;
	        }
	        else {
	            _route = new Array();
	        }
	        var c1rres = res / (this.c1.r * 2 * matthew_1.default.PI) * matthew_1.default.D_PI;
	        var c2rres = res / (this.c2.r * 2 * matthew_1.default.PI) * matthew_1.default.D_PI;
	        var _x = Math.cos(this.c1rb) * this.c1.r + this.c1.pos.x;
	        var _y = Math.sin(this.c1rb) * this.c1.r + this.c1.pos.y;
	        var tr;
	        var L = matthew_1.default.abs(this.c1rl);
	        for (var r = 0; r < L; r += c1rres) {
	            tr = this.c1rb + r * this.c1.d;
	            _x = Math.cos(tr) * this.c1.r + this.c1.pos.x;
	            _y = Math.sin(tr) * this.c1.r + this.c1.pos.y;
	            _route.push(new utils_1.VecPos(_x, _y, tr + matthew_1.default.H_PI * this.c1.d));
	        }
	        _route.pop();
	        this.getLineRoot(new utils_1.Pos(_x, _y), new utils_1.Pos(Math.cos(this.c2rb) * this.c2.r + this.c2.pos.x, Math.sin(this.c2rb) * this.c2.r + this.c2.pos.y), res, _route);
	        //trace(_x, _y, Math.cos(c2rb) * c2.r + c2.pos.x, Math.sin(c2rb) * c2.r + c2.pos.y)
	        var LL = matthew_1.default.abs(this.c2rl) - c2rres;
	        for (var r = 0; r < LL; r += c2rres) {
	            tr = this.c2rb + r * this.c2.d;
	            _x = Math.cos(tr) * this.c2.r + this.c2.pos.x;
	            _y = Math.sin(tr) * this.c2.r + this.c2.pos.y;
	            _route.push(new utils_1.VecPos(_x, _y, tr + matthew_1.default.H_PI * this.c2.d));
	        }
	        _route.push(new utils_1.VecPos(Math.cos(this.c2rb + (matthew_1.default.abs(this.c2rl)) * this.c2.d) * this.c2.r + this.c2.pos.x, Math.sin(this.c2rb + (matthew_1.default.abs(this.c2rl)) * this.c2.d) * this.c2.r + this.c2.pos.y, this.c2rb + matthew_1.default.abs(this.c2rl) * this.c2.d + matthew_1.default.H_PI * this.c2.d));
	        return _route;
	    };
	    Route.prototype.getLength = function () {
	        var l = 0;
	        l += this.c1.r * 2 * matthew_1.default.PI * (matthew_1.default.abs(this.c1rl) / (matthew_1.default.D_PI));
	        l += this.c2.r * 2 * matthew_1.default.PI * (matthew_1.default.abs(this.c2rl) / (matthew_1.default.D_PI));
	        var t1x = Math.cos(this.c1rb + this.c1rl) * this.c1.r + this.c1.pos.x;
	        var t1y = Math.sin(this.c1rb + this.c1rl) * this.c1.r + this.c1.pos.y;
	        var t2x = Math.cos(this.c2rb) * this.c2.r + this.c2.pos.x;
	        var t2y = Math.sin(this.c2rb) * this.c2.r + this.c2.pos.y;
	        var dx = t1x - t2x;
	        var dy = t1y - t2y;
	        l += Math.sqrt(dx * dx + dy * dy);
	        return l;
	    };
	    Route.prototype.getLineRoot = function (bp, ep, res, vector) {
	        var tx = ep.x - bp.x;
	        var ty = ep.y - bp.y;
	        var r = Math.atan2(ty, tx);
	        var dx = Math.cos(r) * res;
	        var dy = Math.sin(r) * res;
	        var l = Math.sqrt(tx * tx + ty * ty) - res;
	        var L = l / res;
	        for (var i = 0; i < L; i++) {
	            vector.push(new utils_1.VecPos(dx * i + bp.x, dy * i + bp.y, r));
	        }
	    };
	    return Route;
	}());
	exports.Route = Route;
	var RouteGenerator = (function () {
	    function RouteGenerator(graphics) {
	        if (graphics === void 0) { graphics = null; }
	        this.graphics = graphics;
	    }
	    RouteGenerator.prototype.getAllRoute = function (vposB, vposE, rB, rE) {
	        var cB1 = new utils_1.Circle(Math.cos(vposB.r + matthew_1.default.H_PI) * rB + vposB.pos.x, Math.sin(vposB.r + matthew_1.default.H_PI) * rB + vposB.pos.y, rB, 1, vposB.r - matthew_1.default.H_PI);
	        var cB2 = new utils_1.Circle(Math.cos(vposB.r - matthew_1.default.H_PI) * rB + vposB.pos.x, Math.sin(vposB.r - matthew_1.default.H_PI) * rB + vposB.pos.y, rB, -1, vposB.r + matthew_1.default.H_PI);
	        var cE1 = new utils_1.Circle(Math.cos(vposE.r + matthew_1.default.H_PI) * rE + vposE.pos.x, Math.sin(vposE.r + matthew_1.default.H_PI) * rE + vposE.pos.y, rE, 1, vposE.r - matthew_1.default.H_PI);
	        var cE2 = new utils_1.Circle(Math.cos(vposE.r - matthew_1.default.H_PI) * rE + vposE.pos.x, Math.sin(vposE.r - matthew_1.default.H_PI) * rE + vposE.pos.y, rE, -1, vposE.r + matthew_1.default.H_PI);
	        var allRoute = [];
	        var route;
	        route = this.getRoute(cB1, cE1);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB1, cE2);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB2, cE1);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB2, cE2);
	        if (route)
	            allRoute.push(route);
	        return allRoute;
	    };
	    RouteGenerator.prototype.getRoute = function (c1, c2) {
	        var dx = c2.pos.x - c1.pos.x;
	        var dy = c2.pos.y - c1.pos.y;
	        var l = dx * dx + dy * dy;
	        var a1 = new utils_1.Pos(), a2 = new utils_1.Pos(), b1 = new utils_1.Pos(), b2 = new utils_1.Pos();
	        var br = Math.atan2(c2.pos.y - c1.pos.y, c2.pos.x - c1.pos.x);
	        var c1tr = c1.tr;
	        var c2tr = c2.tr;
	        var c1r;
	        var c2r;
	        var c1dr;
	        var c2dr;
	        this.circle(c1.pos.x + Math.cos(c1tr) * c1.r, c1.pos.y + Math.sin(c1tr) * c1.r, 3);
	        this.circle(c2.pos.x + Math.cos(c2tr) * c2.r, c2.pos.y + Math.sin(c2tr) * c2.r, 3);
	        if (c1.d == c2.d) {
	            var d = l - (c2.r - c1.r) * (c2.r - c1.r);
	            if (d < 0)
	                return null;
	            d = Math.sqrt(d);
	            a1.x = c1.r * ((c1.r - c2.r) * dx + d * dy) / l + c1.pos.x;
	            a1.y = c1.r * ((c1.r - c2.r) * dy - d * dx) / l + c1.pos.y;
	            a2.x = c1.r * ((c1.r - c2.r) * dx - d * dy) / l + c1.pos.x;
	            a2.y = c1.r * ((c1.r - c2.r) * dy + d * dx) / l + c1.pos.y;
	            b1.x = c2.r * ((c2.r - c1.r) * -dx - d * -dy) / l + c2.pos.x;
	            b1.y = c2.r * ((c2.r - c1.r) * -dy + d * -dx) / l + c2.pos.y;
	            b2.x = c2.r * ((c2.r - c1.r) * -dx + d * -dy) / l + c2.pos.x;
	            b2.y = c2.r * ((c2.r - c1.r) * -dy - d * -dx) / l + c2.pos.y;
	            var r = Math.atan2(a1.y - c1.pos.y, a1.x - c1.pos.x) - br;
	            if (c1.d > 0) {
	                c2r = c1r = matthew_1.default.normalize(r + br);
	                this.line(a1.x, a1.y, b1.x, b1.y);
	            }
	            else {
	                c2r = c1r = matthew_1.default.normalize(-r + br);
	                this.line(a2.x, a2.y, b2.x, b2.y);
	            }
	            this.line(c1.pos.x, c1.pos.y, Math.cos(c1r) * c1.r + c1.pos.x, Math.sin(c1r) * c1.r + c1.pos.y);
	            this.line(c2.pos.x, c2.pos.y, Math.cos(c2r) * c2.r + c2.pos.x, Math.sin(c2r) * c2.r + c2.pos.y);
	        }
	        else if (c1.d != c2.d) {
	            var d = l - (c2.r + c1.r) * (c2.r + c1.r);
	            if (d < 0)
	                return null;
	            d = Math.sqrt(d);
	            a1.x = c1.r * ((c2.r + c1.r) * dx + d * dy) / l + c1.pos.x;
	            a1.y = c1.r * ((c2.r + c1.r) * dy - d * dx) / l + c1.pos.y;
	            a2.x = c1.r * ((c2.r + c1.r) * dx - d * dy) / l + c1.pos.x;
	            a2.y = c1.r * ((c2.r + c1.r) * dy + d * dx) / l + c1.pos.y;
	            b1.x = c2.r * ((c1.r + c2.r) * -dx + d * -dy) / l + c2.pos.x;
	            b1.y = c2.r * ((c1.r + c2.r) * -dy - d * -dx) / l + c2.pos.y;
	            b2.x = c2.r * ((c1.r + c2.r) * -dx - d * -dy) / l + c2.pos.x;
	            b2.y = c2.r * ((c1.r + c2.r) * -dy + d * -dx) / l + c2.pos.y;
	            var r = Math.atan2(a1.y - c1.pos.y, a1.x - c1.pos.x) - br;
	            if (c1.d > 0) {
	                c1r = matthew_1.default.normalize(r + br);
	                c2r = matthew_1.default.normalize(r + br + matthew_1.default.PI);
	                this.line(a1.x, a1.y, b1.x, b1.y);
	            }
	            else {
	                c1r = matthew_1.default.normalize(-r + br);
	                c2r = matthew_1.default.normalize(-r + br + matthew_1.default.PI);
	                this.line(a2.x, a2.y, b2.x, b2.y);
	            }
	            this.line(c1.pos.x, c1.pos.y, Math.cos(c1r) * c1.r + c1.pos.x, Math.sin(c1r) * c1.r + c1.pos.y);
	            this.line(c2.pos.x, c2.pos.y, Math.cos(c2r) * c2.r + c2.pos.x, Math.sin(c2r) * c2.r + c2.pos.y);
	        }
	        if (c1.d > 0) {
	            if (c1.tr < c1r) {
	                c1dr = c1r - c1.tr;
	            }
	            else {
	                c1dr = matthew_1.default.D_PI - (c1.tr - c1r);
	            }
	        }
	        else {
	            if (c1.tr < c1r) {
	                c1dr = matthew_1.default.D_PI - (c1r - c1.tr);
	            }
	            else {
	                c1dr = c1.tr - c1r;
	            }
	        }
	        if (c2.d > 0) {
	            if (c2r < c2.tr) {
	                c2dr = c2.tr - c2r;
	            }
	            else {
	                c2dr = matthew_1.default.D_PI - (c2r - c2.tr);
	            }
	        }
	        else {
	            if (c2r < c2.tr) {
	                c2dr = matthew_1.default.D_PI - (c2.tr - c2r);
	            }
	            else {
	                c2dr = c2r - c2.tr;
	            }
	        }
	        this.circle(c1.pos.x, c1.pos.y, 2);
	        this.circle(c2.pos.x, c2.pos.y, 2);
	        this.circle(c1.pos.x, c1.pos.y, c1.r);
	        this.circle(c2.pos.x, c2.pos.y, c2.r);
	        return new Route(c1, c2, c1.tr, c2r, c1dr * c1.d, c2dr * c2.d);
	    };
	    RouteGenerator.prototype.line = function (x1, y1, x2, y2) {
	        if (!this.graphics)
	            return;
	        this.graphics.moveTo(x1, y1);
	        this.graphics.lineTo(x2, y2);
	    };
	    RouteGenerator.prototype.circle = function (x, y, r) {
	        if (!this.graphics)
	            return;
	        this.graphics.drawCircle(x, y, r);
	    };
	    return RouteGenerator;
	}());
	exports.RouteGenerator = RouteGenerator;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var utils_1 = __webpack_require__(1);
	var Worm = (function (_super) {
	    __extends(Worm, _super);
	    function Worm(length) {
	        var _this = _super.call(this) || this;
	        _this.length = length;
	        _this.bone = [];
	        _this.body = [];
	        for (var i = 0; i < length; i++) {
	            _this.bone.push(new utils_1.Pos());
	            _this.body.push(new BodyPos());
	        }
	        return _this;
	    }
	    Worm.prototype.push = function (x, y) {
	        //先頭に加えて、１つずつずらす。
	        var i = this.bone.length - 1;
	        for (; i >= 1; i--) {
	            this.bone[i].x = this.bone[i - 1].x;
	            this.bone[i].y = this.bone[i - 1].y;
	        }
	        var bbone = this.bone[0];
	        bbone.x = x;
	        bbone.y = y;
	        //ワームの外殻を生成
	        var ebone = this.bone[this.bone.length - 1];
	        var bbody = this.body[0];
	        var ebody = this.body[this.body.length - 1];
	        bbody.left.x = bbone.x;
	        bbody.left.y = bbone.y;
	        for (i = 1; i < this.bone.length - 1; i++) {
	            var nbone = this.bone[i];
	            var nbody = this.body[i];
	            var vx = this.bone[i - 1].x - nbone.x;
	            var vy = this.bone[i - 1].y - nbone.y;
	            var r = ((Math.sin(i / (this.bone.length - 1) * (Math.PI)))) * 30;
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
	    };
	    Worm.prototype.render = function () {
	        this.clear();
	        this.lineStyle(2, 0xffffff);
	        //this.beginFill(0xff0000);
	        this.moveTo(this.body[0].left.x, this.body[0].left.y);
	        for (var i = 1; i < this.body.length; i++) {
	            this.lineTo(this.body[i].left.x, this.body[i].left.y);
	        }
	        for (var i = this.body.length - 2; i >= 2; i--) {
	            this.lineTo(this.body[i].right.x, this.body[i].right.y);
	        }
	        this.lineTo(this.body[0].left.x, this.body[0].left.y);
	        this.endFill();
	    };
	    return Worm;
	}(PIXI.Graphics));
	exports.Worm = Worm;
	var FollowWorm = (function (_super) {
	    __extends(FollowWorm, _super);
	    function FollowWorm(length) {
	        var _this = _super.call(this, length) || this;
	        _this.routeIndex = 0;
	        return _this;
	    }
	    FollowWorm.prototype.setRoute = function (route) {
	        if (route.length <= this.length)
	            return;
	        this.route = route;
	        //this.routeIndex = 0;
	        this.routeLength = this.route.length;
	        var ri = 0;
	        for (var ii = 0; ii < route.length; ii++) {
	            var rr = Math.sin(ri) * (50 * Math.sin(Math.PI * (ii / (this.routeLength))));
	            ri += 0.2;
	            var vpos = route[ii];
	            vpos.pos.x = vpos.pos.x + Math.cos(vpos.r + Math.PI / 2) * rr;
	            vpos.pos.y = vpos.pos.y + Math.sin(vpos.r + Math.PI / 2) * rr;
	        }
	    };
	    FollowWorm.prototype.gotoHead = function () {
	        this.routeIndex = 0;
	        for (var i = 0; i < this.length; i++) {
	            this.step();
	        }
	    };
	    FollowWorm.prototype.step = function () {
	        if (!this.route)
	            return;
	        if (this.routeIndex >= this.routeLength) {
	            this.routeIndex = 0;
	            this.gotoHead();
	            return;
	        }
	        var pos = this.route[this.routeIndex].pos;
	        this.push(pos.x, pos.y);
	        this.routeIndex++;
	        this.render();
	        return;
	    };
	    return FollowWorm;
	}(Worm));
	exports.FollowWorm = FollowWorm;
	var BodyPos = (function () {
	    function BodyPos() {
	        this.left = new utils_1.Pos();
	        this.right = new utils_1.Pos();
	    }
	    return BodyPos;
	}());


/***/ }
/******/ ]);