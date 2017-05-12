const React = require('react');

const HelloExample = (props) => {
  return (
    <div>
      <h2>hello example !!!</h2>
      { props.message ?
        <div className="hello-example--message">{props.message}</div> : null
      }
    </div>
  );
};

module.exports = HelloExample;
