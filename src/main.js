import React from 'react';
import ReactDOM from 'react-dom';

import Viewer from './viewer';

class Main extends React.Component {
    constructor(props) {
        super(props);
      
    }

    render() {
        return (
            <div className="main container">
                <Viewer file="./examples/cat.gif" />
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));