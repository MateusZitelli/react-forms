/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React       = require('react/addons');
var cx          = React.addons.classSet;
var PropTypes   = require('./PropTypes');
var Message     = require('./Message');
var Label       = require('./Label');
var Input       = require('./Input');
var FocusStore  = require('./FocusStore');

/**
 * Field component represents values which correspond to Scalar schema nodes
 * and so received PropetyValue as value.
 *
 * It provides basic markup which include <input /> component (can be customized
 * via schema) and <label /> (label text and hint text).
 */
var Field = React.createClass({displayName: "Field",

  mixins: [FocusStore.FocusableMixin],

  propTypes: {
    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    value: PropTypes.Value,
    input: React.PropTypes.oneOfType,
    noLabel: React.PropTypes.bool
  },

  render:function(): ?ReactElement {
    var $__0=        this.props,value=$__0.value,hint=$__0.hint,label=$__0.label,noLabel=$__0.noLabel,input=$__0.input,className=$__0.className,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{value:1,hint:1,label:1,noLabel:1,input:1,className:1});
    var $__1=     value,node=$__1.node,validation=$__1.validation,isDirty=$__1.isDirty,externalValidation=$__1.externalValidation;
    var isInvalid = isDirty && (validation.isFailure || externalValidation.isFailure);

    var classNames = cx({
      'rf-Field': true,
      'rf-Field--invalid': isInvalid,
      'rf-Field--dirty': isDirty,
      'rf-Field--required': node.props.get('required')
    });

    var id = this._rootNodeID;

    return (
      React.createElement("div", React.__spread({},  props, {className: cx(classNames, className)}), 
        !noLabel &&
          React.createElement(Label, {
            htmlFor: id, 
            className: "rf-Field__label", 
            label: label || node.props.get('label'), 
            hint: hint || node.props.get('hint')}
            ), 
        React.createElement(Input, {
          ref: "input", 
          id: id, 
          value: value, 
          input: input, 
          dirtyOnBlur: node.props.get('dirtyOnBlur', true), 
          dirtyOnChange: node.props.get('dirtyOnChange', true)}
          ), 
        validation.isFailure && isDirty &&
          React.createElement(Message, null, validation.error), 
        externalValidation.isFailure &&
          React.createElement(Message, null, externalValidation.error)
      )
    );
  },

  focus:function() {
    this.refs.input.focus();
  }
});

module.exports = Field;
