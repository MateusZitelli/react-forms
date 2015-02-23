/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React     = require('react/addons');
var Hint      = require('./Hint');
var cx        = React.addons.classSet;

var Label = React.createClass({displayName: "Label",

  propTypes: {
    label: React.PropTypes.string,
    hint: React.PropTypes.string,
    className: React.PropTypes.string
  },

  render:function(): ?ReactElement {
    var $__0=     this.props,hint=$__0.hint,label=$__0.label,className=$__0.className,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{hint:1,label:1,className:1});
    if (!hint && !label) {
      return null;
    }
    return (
      React.createElement("label", React.__spread({},  props, {className: cx(className, 'rf-Label')}), 
        React.createElement("span", {className: "rf-Label__label"}, label), 
        hint && React.createElement(Hint, {hint: hint})
      )
    );
  },

  shouldComponentUpdate:function(nextProps: {label: ?string; hint: ?string; className: ?string}): bool {
    return (
      nextProps.label !== this.props.label ||
      nextProps.hint !== this.props.hint ||
      nextProps.className !== this.props.className
    );
  }
});

module.exports = Label;
