/**
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React     = require('react');
var Immutable = require('immutable');
var invariant = require('./invariant');

var state = Immutable.Map();

function getComponentFingerprint(component) {
  return (component._rootNodeID + "__" + component._mountDepth);
}

var ContextTypes = {
  focusScope: React.PropTypes.object
};

var ScopeMixin = {

  childContextTypes: ContextTypes,

  getChildContext:function() {
    return {focusScope: this};
  },

  componentWillMount:function() {
    FocusStore.registerScope(this);
  },

  componentWillUnmount:function() {
    FocusStore.unregisterScope(this);
  },

  /**
   * Put focus on an element.
   *
   * @param {Array<String>} keyPath
   */
  focusElement:function(keyPath) {
    FocusStore.focusElement(this, keyPath);
  }

};

var FocusableMixin = {

  contextTypes: ContextTypes,

  _getFocusScope:function() {
    var focusScope = this.context.focusScope;
    if (focusScope === undefined && typeof this.getFocusScope === 'function') {
      focusScope = this.getFocusScope();
    }
    return focusScope;
  },

  _getKeyPath:function() {
    if (typeof this.getKeyPath === 'function') {
      return this.getKeyPath();
    } else {
      return this.props.value.keyPath;
    }
  },

  componentDidMount:function() {
    var scope = this._getFocusScope();
    if (!scope) {
      return;
    }
    var keyPath = this._getKeyPath();
    FocusStore.registerFocusable(scope, keyPath, this);
  },

  componentWillUnmount:function() {
    var scope = this._getFocusScope();
    if (!scope) {
      return;
    }
    var keyPath = this._getKeyPath();
    FocusStore.unregisterFocusable(scope, keyPath, this);
  }
};

var FocusStore = {

  ScopeMixin:ScopeMixin,
  FocusableMixin:FocusableMixin,

  registerScope:function(scopeComponent) {
    var scopeID = getComponentFingerprint(scopeComponent);
    state = state.set(scopeID, Immutable.Map());
  },

  unregisterScope:function(scopeComponent) {
    var scopeID = getComponentFingerprint(scopeComponent);
    state = state.remove(scopeID);
  },

  registerFocusable:function(scopeComponent, keyPath, focusableComponent) {
    var key = keyPath.join('.');
    var scopeID = getComponentFingerprint(scopeComponent);
    state = state.update(scopeID, function(scope)  {return scope.set(key, focusableComponent);});
  },

  unregisterFocusable:function(scopeComponent, keyPath, focusableComponent) {
    var key = keyPath.join('.');
    var scopeID = getComponentFingerprint(scopeComponent);
    state = state.updateIn(scopeID, function(scope)  {return scope && scope.remove(key);});
  },

  focusElement:function(scopeComponent, keyPath) {
    var key = keyPath.join('.');
    var scopeID = getComponentFingerprint(scopeComponent);
    var component = state.getIn([scopeID, key]);
    if (typeof component.focus === 'function') {
      component.focus();
    } else {
      var node = component.getDOMNode();
      if (node) {
        node.focus();
      }
    }
  },

  _getState:function() {
    return state;
  }

};

module.exports = FocusStore;
