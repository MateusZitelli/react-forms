/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

var Checkbox = React.createClass({displayName: "Checkbox",

  propTypes: {
    value: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  },

  render:function(): ?ReactElement {
    var $__0=     this.props,value=$__0.value,onChange=$__0.onChange,className=$__0.className,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{value:1,onChange:1,className:1});
    return (
      React.createElement("input", React.__spread({},  props, 
        {type: "checkbox", 
        className: cx('rf-Checkbox', className), 
        onChange: this.onChange, 
        checked: value})
        )
    );
  },

  onChange:function(e: {target: {checked: boolean}}) {
    var checked = e.target.checked;
    this.props.onChange(checked);
  }
});

module.exports = Checkbox;
