/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React           = require('react/addons');
var cloneWithProps  = React.addons.cloneWithProps;
var FormPropTypes   = require('./PropTypes');

var Input = React.createClass({displayName: "Input",

  propTypes: {
    value: FormPropTypes.Value.isRequired,
    input: React.PropTypes.any,
    markDirty: React.PropTypes.bool
  },

  render:function(): ?ReactElement {
    var $__0=      this.props,Component=$__0.input,value=$__0.value,dirtyOnBlur=$__0.dirtyOnBlur,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{input:1,value:1,dirtyOnBlur:1});
    props = Object.assign({},
      props,
      {ref: 'input',
      value: value.serialized,
      name: value.node.props.get('name') || value.keyPath.join('__'),
      onChange: this.onChange,
      onBlur: dirtyOnBlur && this.onBlur,
      dirtyOnBlur: undefined,
      dirtyOnChange: undefined
    });
    Component = Component || value.node.props.get('input');
    if (Component) {
      return React.isValidElement(Component) ?
        cloneWithProps(Component, props) :
        React.createElement(Component, React.__spread({},  props));
    } else {
      return React.createElement("input", React.__spread({},  props, {type: "text"}));
    }
  },

  getDefaultProps:function() {
    return {
      dirtyOnBlur: true,
      dirtyOnChange: true
    };
  },

  focus:function() {
    var input = this.refs.input;
    if (input.focus) {
      input.focus();
    } else {
      input.getDOMNode().focus();
    }
  },

  onChange:function(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    var serialized = getValueFromEvent(e);
    this.props.value.setSerialized(
      serialized, {dirty: this.props.dirtyOnChange});
  },

  onBlur:function() {
    var $__0=  this.props,value=$__0.value;
    if (!value.isDirty) {
      value.makeDirty();
    }
  }

});

/**
 * Extract value from event
 *
 * We support both React.DOM 'change' events and custom change events
 * emitted from custom components.
 *
 * @param {Event} e
 * @returns {Any}
 */
function getValueFromEvent(e: {target: {value: any}} | any) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = Input;
