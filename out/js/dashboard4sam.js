(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _mixin = require('./util/mixin');

var _TLoggable = require('./util/logging/TLoggable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Parents = (0, _mixin.mixin)(null, _TLoggable.TLoggable);

var Application = exports.Application = (function (_Parents) {
    _inherits(Application, _Parents);

    function Application() {
        _classCallCheck(this, Application);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Application).apply(this, arguments));
    }

    _createClass(Application, null, [{
        key: 'start',
        value: function start() {}
    }]);

    return Application;
})(Parents);


},{"./util/logging/TLoggable":9,"./util/mixin":10}],2:[function(require,module,exports){
'use strict';

var _Page = require('./ui/main/Page');

var React = window.React; /*
                          const margin = {top: -5, right: -5, bottom: -5, left: -5},
                              width = 960 - margin.left - margin.right,
                              height = 500 - margin.top - margin.bottom;
                          
                          // D3 Zoom
                          let zoom = d3.behavior.zoom()
                              .scaleExtent([1, 10])
                              .on("zoom", zoomed);
                          
                          let drag = d3.behavior.drag()
                              .origin(function(d) { return d; })
                              .on("dragstart", dragstarted)
                              .on("drag", dragged)
                              .on("dragend", dragended);
                          
                          let svg = d3.select("body").append("svg")
                              .attr("width", width + margin.left + margin.right)
                              .attr("height", height + margin.top + margin.bottom)
                              .append("g")
                              .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
                              .call(zoom);
                          
                          let container = svg.append("g");
                          
                          container.append("g")
                              .attr("class", "x axis")
                              .selectAll("line")
                              .data(d3.range(0, width, 10))
                              .enter().append("line")
                              .attr("x1", function(d) { return d; })
                              .attr("y1", 0)
                              .attr("x2", function(d) { return d; })
                              .attr("y2", height);
                          
                          container.append("g")
                              .attr("class", "y axis")
                              .selectAll("line")
                              .data(d3.range(0, height, 10))
                              .enter().append("line")
                              .attr("x1", 0)
                              .attr("y1", function(d) { return d; })
                              .attr("x2", width)
                              .attr("y2", function(d) { return d; });
                          
                          let barOuterPad = .2
                          let barPad = .1
                          let xBand = d3.scale.ordinal()
                              .domain(data.map((d) => d.letter))
                              .rangeRoundBands([0, width], barPad, barOuterPad)
                          
                          
                          function zoomed() {
                              container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
                          }
                          
                          function dragstarted(d) {
                              d3.event.sourceEvent.stopPropagation();
                              d3.select(this).classed("dragging", true);
                          }
                          
                          function dragged(d) {
                              d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
                          }
                          
                          function dragended(d) {
                              d3.select(this).classed("dragging", false);
                          }
                          
                          
                          d3.json('../src/test/data.json', (err, res) =>  {
                              console.log(res)
                          });
                          */

var ReactDOM = window.ReactDOM;
ReactDOM.render(React.createElement(_Page.Page, null), $('body')[0]);
//test


},{"./ui/main/Page":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseElement = exports.BaseElement = function BaseElement() {
  _classCallCheck(this, BaseElement);
};


},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Project = exports.Project = (function () {
    _createClass(Project, [{
        key: "name",
        get: function get() {
            return this.json.name;
        }
    }, {
        key: "json",
        get: function get() {}
    }]);

    function Project(json) {
        _classCallCheck(this, Project);

        this._json = json;
    }

    return Project;
})();


},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Content = undefined;

var _mixin = require('../../util/mixin');

var _TLoggable = require('../../util/logging/TLoggable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = window.React;
var Parents = (0, _mixin.mixin)(React.Component, _TLoggable.TLoggable);

var Content = exports.Content = (function (_Parents) {
    _inherits(Content, _Parents);

    function Content() {
        _classCallCheck(this, Content);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Content).call(this));
    }

    _createClass(Content, [{
        key: 'render',
        value: function render() {
            return React.createElement('div', null);
        }
    }]);

    return Content;
})(Parents);


},{"../../util/logging/TLoggable":9,"../../util/mixin":10}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;

var _mixin = require('../../util/mixin');

var _TLoggable = require('../../util/logging/TLoggable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = window.React;
var Parents = (0, _mixin.mixin)(React.Component, _TLoggable.TLoggable);

var Menu = exports.Menu = (function (_Parents) {
    _inherits(Menu, _Parents);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).call(this));
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            return React.createElement('div', { className: 'menu' });
        }
    }]);

    return Menu;
})(Parents);


},{"../../util/logging/TLoggable":9,"../../util/mixin":10}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Page = undefined;

var _mixin = require('../../util/mixin');

var _TLoggable = require('../../util/logging/TLoggable');

var _Menu = require('./Menu');

var _Topbar = require('./Topbar');

var _Content = require('./Content');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = window.React;
var Parents = (0, _mixin.mixin)(React.Component, _TLoggable.TLoggable);

var Page = exports.Page = (function (_Parents) {
    _inherits(Page, _Parents);

    function Page() {
        _classCallCheck(this, Page);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Page).call(this));
    }

    _createClass(Page, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'wrapper' },
                React.createElement(_Topbar.Topbar, null),
                ',',
                React.createElement(_Menu.Menu, null),
                ',',
                React.createElement(_Content.Content, null)
            );
        }
    }]);

    return Page;
})(Parents);


},{"../../util/logging/TLoggable":9,"../../util/mixin":10,"./Content":5,"./Menu":6,"./Topbar":8}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Topbar = undefined;

var _mixin = require('../../util/mixin');

var _TLoggable = require('../../util/logging/TLoggable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Parents = (0, _mixin.mixin)(React.Component, _TLoggable.TLoggable);

var Topbar = exports.Topbar = (function (_Parents) {
    _inherits(Topbar, _Parents);

    function Topbar() {
        _classCallCheck(this, Topbar);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Topbar).call(this));
    }

    _createClass(Topbar, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'topbar' },
                React.createElement('div', { className: 'topbar-left' })
            );
        }
    }]);

    return Topbar;
})(Parents);


},{"../../util/logging/TLoggable":9,"../../util/mixin":10}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logTypes = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'

};

var LoggingConfiguration = (function () {
    function LoggingConfiguration() {
        _classCallCheck(this, LoggingConfiguration);
    }

    _createClass(LoggingConfiguration, null, [{
        key: 'isDebuggingEnabled',
        get: function get() {
            return true;
        }
    }]);

    return LoggingConfiguration;
})();

var DefaultLogger = (function () {
    _createClass(DefaultLogger, [{
        key: '_logMessage',
        value: function _logMessage(type, message) {
            var time = new Date().toUTCString();
            console.log(time + ' - [' + type + '] - [' + this._clazz + '] - ' + message);
        }
    }, {
        key: 'debug',
        value: function debug(msg) {
            if (LoggingConfiguration.isDebuggingEnabled) {
                this._logMessage(logTypes['DEBUG'], msg);
            }
        }
    }, {
        key: 'info',
        value: function info(msg) {
            this._logMessage(logTypes['INFO'], msg);
        }
    }, {
        key: 'error',
        value: function error(msg) {
            this._logMessage(logTypes['ERROR'], msg);
        }
    }]);

    function DefaultLogger(clazz) {
        _classCallCheck(this, DefaultLogger);

        this._clazz = clazz;
    }

    return DefaultLogger;
})();

var StaticLog = exports.StaticLog = (function () {
    function StaticLog() {
        _classCallCheck(this, StaticLog);
    }

    _createClass(StaticLog, null, [{
        key: 'log',
        value: function log(type, clazz, msg) {
            var time = new Date().toUTCString();
            console.log(time + ' - [' + type + '] - [' + clazz + '] - ' + msg);
        }
    }]);

    return StaticLog;
})();

var TLoggable = exports.TLoggable = {
    debug: function debug(msg) {
        StaticLog.log('DEBUG', this.__proto__.constructor.name, msg);
    },
    info: function info(msg) {
        StaticLog.log('INFO', this.__proto__.constructor.name, msg);
    },
    warn: function warn(msg) {
        StaticLog.log('WARN', this.__proto__.constructor.name, msg);
    }
};


},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mixin = mixin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Combine traits to one new class to inherit from
 * @param Parent must be a class or null
 * @param mixins must be objects
 */
function mixin(Parent) {
    var newParent = Parent || Object;

    var Mixed = (function (_newParent) {
        _inherits(Mixed, _newParent);

        function Mixed() {
            _classCallCheck(this, Mixed);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(Mixed).apply(this, arguments));
        }

        return Mixed;
    })(newParent);

    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

        for (var _iterator = mixins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _mixin = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(_mixin)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var prop = _step2.value;

                    Mixed.prototype[prop] = _mixin[prop];
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return Mixed;
};


},{}]},{},[1,2,3,4,5,6,7,8,9,10]);
