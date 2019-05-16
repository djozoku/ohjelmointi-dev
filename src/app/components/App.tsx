import React from 'react';

class App extends React.Component {
  public render() {
    return <div>{this.props.children}</div>;
  }
}

export default App;
