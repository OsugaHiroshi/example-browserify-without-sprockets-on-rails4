const React = require('react');
const ReactDOM = require('react-dom');

const HelloExample = require('./components/HelloExample');

window.document.addEventListener('DOMContentLoaded', () => {
  const app = React.createElement( HelloExample, {message: 'hello world!'} );

  const placement = window.document.querySelector('.js-application-container');

  ReactDOM.render(app, placement);
});
