/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React         = require('react');
var PropTypes     = React.PropTypes;
var emptyFunction = require('./emptyFunction');

function renderEmptyOption(props, onChange) {
  return (
    React.createElement("div", {
        className: "rf-RadioButtonGroup__button", 
        key: ""}, 
      React.createElement("label", {
        className: "rf-RadioButtonGroup__label"}, 
        React.createElement("input", {
          checked: props.checked, 
          className: "rf-RadioButtonGroup__radio", 
          type: "radio", 
          name: props.name, 
          onChange: onChange.bind(null, null), 
          value: ""}), 
        React.createElement("span", {className: "rf-RadioButtonGroup__caption"}, 
          "none"
        )
      )
    )
  );
}

                                             

var RadioButtonGroup = React.createClass({displayName: "RadioButtonGroup",

    propTypes: {
      options: PropTypes.array.isRequired,
      allowEmpty: PropTypes.bool,
      value: PropTypes.string,
      onChange: PropTypes.func
    },

    render:function()                {
      var options = this.props.options.map(this.renderOption);

      if (this.props.allowEmpty) {
        options.unshift(renderEmptyOption({
            name: this._rootNodeID,
            checked: !this.props.value
        }, this.onChange));
      }

      return (
        React.createElement("div", {className: "rf-RadioButtonGroup"}, 
          options
        )
      );
    },

    renderOption:function(option        )                {
      var name = this._rootNodeID;
      var checked = this.props.value ?
          this.props.value === option.value :
          false;
      return (
        React.createElement("div", {
          className: "rf-RadioButtonGroup__button", 
          key: option.value}, 
          React.createElement("label", {
            className: "rf-RadioButtonGroup__label"}, 
            React.createElement("input", {
              checked: checked, 
              className: "rf-RadioButtonGroup__radio", 
              type: "radio", 
              name: name, 
              onChange: this.onChange.bind(null, option.value), 
              value: option.value}), 
            React.createElement("span", {className: "rf-RadioButtonGroup__caption"}, 
              option.name
            )
          )
        )
      );
    },

    getDefaultProps:function() {
      return {onChange: emptyFunction};
    },

    onChange:function(value         ) {
      this.props.onChange(value);
    }
});

module.exports = RadioButtonGroup;
