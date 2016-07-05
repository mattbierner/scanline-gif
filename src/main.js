import React from 'react';
import ReactDOM from 'react-dom';

import Search from './search';
import Viewer from './viewer';
import * as url_persist from './url_persist'; 

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGif: "./examples/cat.gif"
        };
    }

    componentDidMount() {
        const state = url_persist.read(['gif']);
        if (state.gif) {
            this.onGifSelected(state.gif);
        }
    }

    onGifSelected(src) {
        this.setState({ selectedGif: src });
        const state = url_persist.write(['gif'], { 'gif': src });
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