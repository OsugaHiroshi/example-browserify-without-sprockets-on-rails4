const assert = require('power-assert');
const React = require('react');
const { shallow } = require('enzyme');

const HelloExample = require('../../../src/examples/components/HelloExample');
describe('examples/components/HelloExample', function () {
  it('render with h2', function () {
    const wrapper = shallow( React.createElement( HelloExample ) );
    assert.strictEqual(wrapper.find('h2').length, 1);
    assert.strictEqual(wrapper.find('.hello-example--message').length, 0);
  });

  it('render with specified message by props', function () {
    const wrapper = shallow( React.createElement( HelloExample, { message: 'my message' } ) );
    assert.strictEqual(wrapper.find('.hello-example--message').text(), 'my message');
  });
});
