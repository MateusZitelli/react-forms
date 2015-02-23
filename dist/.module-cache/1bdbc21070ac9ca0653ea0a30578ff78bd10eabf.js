/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React     = require('react/addons');
var PropTypes = React.PropTypes;
var cx        = React.addons.classSet;

var Hint = React.createClass({displayName: "Hint",

  propTypes: {
    hint: PropTypes.string.isRequired,
    className: PropTypes.string
  },

  render:function(): ?ReactElement {
    var $__0=    this.props,hint=$__0.hint,className=$__0.className,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{hint:1,className:1});
    return (
      React.createElement("span", React.__spread({},  props, {className: cx('rf-Hint', className)}), hint)
    );
  }
});

module.exports = Hint;
