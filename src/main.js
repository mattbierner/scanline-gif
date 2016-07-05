import React from 'react';
import ReactDOM from 'react-dom';

import Search from './search';
import Viewer from './viewer';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGif: "./examples/cat.gif"
        };
    }

    onGifSelected(src) {
        this.setState({ selectedGif: src });
    }

    render() {
        return (
            <div className="main container">
                <Viewer file={this.state.selectedGif} />
                <Search onGifSelected={this.onGifSelected.bind(this) } />
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));