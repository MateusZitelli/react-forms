/**
 * `<Element />` component renders form value into one of then `<Field />`,
 * `<Fieldset />` or `<RepeatingFieldset />` component:
 *
 *    <Element value={...} />
 *
 * This component is the main building block for composite form elements such as
 * `<Fieldset />` and `<RepeatingFieldset />` which use it to render its
 * children.
 *
 * @jsx React.DOM
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var $__0=                                   require('immutable'),is=$__0.is;
var React                                 = require('react/addons');
var cloneWithProps                        = React.addons.cloneWithProps;
var PropTypes                             = require('./PropTypes');
var invariant                             = require('./invariant');
var $__1=    require('./schema'),ScalarNode=$__1.ScalarNode,CompositeNode=$__1.CompositeNode,ListNode=$__1.ListNode;

var Element = React.createClass({displayName: "Element",

  propTypes: {
    value: PropTypes.Value
  },

  render:function() {
    var Component;
    var $__0=   this.props,$__1=$__0.value,node=$__1.node;

    Component = node.props.get('component');
    if (Component) {
      return React.isValidElement(Component) ?
        cloneWithProps(Component, this.props) :
        React.createElement(Component, this.props);
    } else {
      if (node instanceof ListNode) {
        Component = require('./RepeatingFieldset');
      } else if (node instanceof CompositeNode) {
        Component = require('./Fieldset');
      } else if (node instanceof ScalarNode) {
        Component = require('./Field');
      } else {
        invariant(false, 'invalid schema node: ' + node);
      }
      return React.createElement(Component, React.__spread({},  this.props));
    }
  },

  shouldComponentUpdate:function(props) {
    var shouldUpdate = false;
    for (var name in props) {
      if (!is(props[name], this.props[name])) {
        shouldUpdate = true;
        break;
      }
    }
    return shouldUpdate;
  }
});

module.exports = Element;
