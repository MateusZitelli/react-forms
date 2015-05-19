/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

var Message = React.createClass({displayName: "Message",

  propTypes: {
    className: React.PropTypes.string
  },

  render:function(): ?ReactElement {
    var $__0=   this.props,className=$__0.className,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1});
    return (
      React.createElement("span", React.__spread({},  props, {className: cx('rf-Message', className)}), 
        this.props.children
      )
    );
  }
});

module.exports = Message;
