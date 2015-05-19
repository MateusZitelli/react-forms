/**
 * @jsx React.DOM
 */
'use strict';

var assert            = require('assert');
var React             = require('react');
var ReactTestUtils    = require('react/lib/ReactTestUtils');
var sinon             = require('sinon');
var ReactForms        = require('../');
var Value             = require('../Value');
var $__0=           require('../schema'),Scalar=$__0.Scalar;
var Field             = require('../Field');
var ValidationResult  = require('../ValidationResult');

describe('React Forms', function()  {

  describe('<Field /> component', function()  {

    var onUpdate;
    var _onUpdate;
    var component;

    beforeEach(function()  {
      onUpdate = sinon.spy();
      _onUpdate = function(value) {
        component.setProps({value:value});
        onUpdate.apply(this, arguments);
      }
    }.bind(this));

    function renderComponent(props) {
      props = props || {};
      var root = function()  {return value;};
      var value = Value.create(
        props.schema || Scalar(),
        props.value || 'value',
        _onUpdate,
        root
      );
      var field = React.createElement(Field, React.__spread({},  props, {value: value}));

      component = ReactTestUtils.renderIntoDocument(field);
      return component;
    }

    it('sets .rf-Field className to DOM element', function() {
      var field = renderComponent();
      assert.ok(field.getDOMNode().classList.contains('rf-Field'));
    });

    it('sets --requied modifier to className for required fields', function() {
      var field = renderComponent({schema: Scalar({required: true})});
      assert.ok(field.getDOMNode().classList.contains('rf-Field--required'));
    });

    it('transfers className prop to DOM element', function() {
      var field = renderComponent({className: 'className'});
      assert.ok(field.getDOMNode().classList.contains('className'));
    });

    it('reacts on onChange event', function()  {
      renderComponent();
      var input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
      input.getDOMNode().value = 'newvalue';
      ReactTestUtils.Simulate.change(input);
      assert.strictEqual(onUpdate.callCount, 1);
      var updated = onUpdate.firstCall.args[0];
      assert.deepEqual(updated.value, 'newvalue');
      //assert.ok(updated.isDirty);
    });

    it('reacts on onBlur event', function()  {
      renderComponent();
      assert.ok(!component.props.value.isDirty);
      var input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
      ReactTestUtils.Simulate.blur(input);
      assert.strictEqual(onUpdate.callCount, 1);
      assert.ok(component.props.value.isDirty);
    });

    describe('input rendering', function()  {

      it('renders into <input /> by default', function()  {
        renderComponent({
          value: 42
        });
        var input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'input');
        assert.strictEqual(input.getDOMNode().value, '42');
      });

      it('renders into component injected via schema', function()  {
        renderComponent({
          schema: Scalar({input: React.createElement("textarea", null)}),
          value: 42
        });
        var input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'textarea');
        assert.strictEqual(input.getDOMNode().value, '42');
      });

      it('renders into component injected via props', function()  {
        renderComponent({
          input: React.createElement("textarea", null),
          value: 42
        });
        var input = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'textarea');
        assert.strictEqual(input.getDOMNode().value, '42');
      });
    });

    describe('label rendering', function()  {

      function assertLabel(value) {
        var label = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'rf-Label');
        var node = label.getDOMNode();
        assert.strictEqual((node.textContent || node.innerText).trim(), value);
      }

      it('renders no label if no label is provided via schema or props', function()  {
        renderComponent();
        var labels = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Label');
        assert.strictEqual(labels.length, 0);
      });

      it('renders no label if noLabel prop is set', function()  {
        renderComponent({noLabel: true});
        var labels = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Label');
        assert.strictEqual(labels.length, 0);
      });

      it('renders label via schema', function()  {
        renderComponent({
          schema: Scalar({label: 'label via schema'})
        });
        assertLabel('label via schema');
      });

      it('renders label passed via props', function()  {
        renderComponent({
          label: 'label via props'
        });
        assertLabel('label via props');
      });
    });

    describe('validation rendering', function()  {

      function assertMessages(values) {
        var messages = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Message');
        assert.equal(messages.length, values.length);
        values.forEach(function(value, idx)  {
          var node = messages[idx].getDOMNode();
          assert.strictEqual((node.textContent || node.innerText).trim(), value);
        });
      }

      function markDirty() {
        var value = component.props.value.makeDirty();
        component.setProps({value:value});
      }

      it('renders no validation errors if value is valid', function()  {
        renderComponent();
        assertMessages([]);
      });

      it('renders no validation error if value is invalid but not dirtied', function()  {
        renderComponent({
          value: 'some',
          schema: Scalar({validate: function(value)  {return new Error('validation.failure');}})
        });
        assertMessages([]);
      });

      it('renders a validation error if value is invalid and dirtied', function()  {
        renderComponent({
          value: 'some',
          schema: Scalar({validate: function(value)  {return new Error('validation.failure');}})
        });
        markDirty();
        assertMessages(['validation.failure']);
      });

      it('renders an external validation error', function()  {
        renderComponent();
        var externalValidation = ValidationResult.error('externalValidation.failure');
        component.props.value.setExternalValidation(externalValidation);
        assertMessages(['externalValidation.failure']);
      });

      it('renders only external validation error if value is invalid but not dirtied', function()  {
        renderComponent({
          value: 'some',
          schema: Scalar({validate: function(value)  {return new Error('validation.failure');}})
        });
        var externalValidation = ValidationResult.error('externalValidation.failure');
        component.props.value.setExternalValidation(externalValidation);
        assertMessages(['externalValidation.failure']);
      });

      it('renders both validation error and external validation error if value is invalid', function()  {
        renderComponent({
          value: 'some',
          schema: Scalar({validate: function(value)  {return new Error('validation.failure');}})
        });
        var externalValidation = ValidationResult.error('externalValidation.failure');
        component.props.value.setExternalValidation(externalValidation);
        markDirty();
        assertMessages(['externalValidation.failure', 'validation.failure']);
      });

      it('renders a dirty className if value is valid or invalid and dirtied', function()  {
        renderComponent({
          value: 'some'
        });

        markDirty();
        var validDirtied = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Field--dirty');
        assert.strictEqual(validDirtied.length, 1);

        renderComponent({
          value: 'some',
          schema: Scalar({validate: function(value)  {return new Error('error');}})
        });
        markDirty();

        var dirtied = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Field--dirty');
        assert.strictEqual(dirtied.length, 1);
      });
    });

    describe('hint rendering', function()  {

      function assertHint(form, value) {
        var hint = ReactTestUtils.findRenderedDOMComponentWithClass(form, 'rf-Hint');
        var node = hint.getDOMNode();
        assert.strictEqual((node.textContent || node.innerText).trim(), value);
      }

      it('renders no hint if no hint is provided via schema or props', function()  {
        renderComponent();
        var hints = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rf-Hint');
        assert.strictEqual(hints.length, 0);
      });

      it('renders hint via schema', function()  {
        renderComponent({
          schema: Scalar({hint: 'hint via schema'})
        });
        assertHint(component, 'hint via schema');
      });

      it('renders hint passed via props', function()  {
        renderComponent({
          hint: 'hint via props'
        });
        assertHint(component, 'hint via props');
      });
    });
  }.bind(this));
}.bind(this));
