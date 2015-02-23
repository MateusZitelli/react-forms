/**
 * Infer default value from schema node.
 *
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var $__0=                 require('immutable'),Map=$__0.Map,List=$__0.List; // jshint ignore:line
var $__1=     require('./schema'),MappingNode=$__1.MappingNode,ListNode=$__1.ListNode;

var EMPTY_MAP = Map(); // jshint ignore:line
var EMPTY_LIST = List(); // jshint ignore:line

function defaultValue(node) {
  if (node.defaultValue !== undefined) {
    return node.defaultValue;
  } else if (node instanceof MappingNode) {
    return EMPTY_MAP;
  } else if (node instanceof ListNode) {
    return EMPTY_LIST;
  } else {
    return undefined;
  }
}

module.exports = defaultValue;
