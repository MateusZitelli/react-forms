/**
 * @jsx React.DOM
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React         = require('react/addons');
var PropTypes     = React.PropTypes;
var cx            = React.addons.classSet;
var FormPropTypes = require('./PropTypes');
var Label         = require('./Label');
var Element       = require('./Element');

/**
 * A component which renders a set of fields.
 *
 * It is used by <Form /> component at top level to render its fields.
 */
var Fieldset = React.createClass({displayName: "Fieldset",

  propTypes: {
    value: FormPropTypes.Value,
    label: PropTypes.string,
    noLabel: PropTypes.bool,
    hint: PropTypes.string
  },

  render:function() {
    var $__0=       this.props,value=$__0.value,className=$__0.className,label=$__0.label,noLabel=$__0.noLabel,hint=$__0.hint,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{value:1,className:1,label:1,noLabel:1,hint:1});
    return (
      React.createElement("div", React.__spread({},  props, {className: cx(className, 'rf-Fieldset')}), 
        !noLabel &&
          React.createElement(Label, {
            className: "rf-Fieldset__label", 
            label: label || value.node.props.get('label'), 
            hint: hint || value.node.props.get('hint')}
            ), 
        value.map(function(value, key)  {return React.createElement(Element, {key: key, value: value});})
      )
    );
  }
});

module.exports = Fieldset;
