'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var moment = require('moment');
var uuid = require('uuid');

var _require = require('ramda');

var curry = _require.curry;
var compose = _require.compose;
var lensProp = _require.lensProp;
var set = _require.set;
var map = _require.map;
var join = _require.join;
var prop = _require.prop;
var append = _require.append;
var concat = _require.concat;
var _ = _require._;

var _map = map(lensProp, ['subject', 'verb', 'object', 'actor', 'from', 'to', 'dateSubmitted']);

var _map2 = _slicedToArray(_map, 7);

var subjectNode = _map2[0];
var verbNode = _map2[1];
var objectNode = _map2[2];
var actorNode = _map2[3];
var fromNode = _map2[4];
var toNode = _map2[5];
var dateSubmittedNode = _map2[6];

var build = curry(function (type, node, object) {
  return prop(node, object) + '-' + type;
});

var EventMessage = curry(function (subject, verb, object) {
  var actor = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
  return compose(set(dateSubmittedNode, moment().utc().format()), set(toNode, '/' + join('/', [subject, verb])), set(fromNode, uuid.v4()), set(actorNode, actor), set(objectNode, object), set(verbNode, verb), set(subjectNode, subject))({});
});

var R = curry(function (type, event, object) {
  return compose(set(lensProp('duration'), moment().diff(prop('dateSubmitted', event))), set(toNode, prop('from', event)), set(fromNode, prop('to', event)), set(objectNode, object), set(verbNode, build(type, 'verb', event)), set(subjectNode, build(type, 'subject', event)))(event);
});

var Response = R('response');
var ResponseError = R('error');

module.exports = { EventMessage: EventMessage, Response: Response, ResponseError: ResponseError };