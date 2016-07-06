import React from 'react';
import ReactDOM from 'react-dom';

import * as scanline_renderer from './scanline_renderer';

/**
 * Renders a scanlined gif. 
 */
export default class GifRenderer extends React.Component {
    componentDidMount() {
        this._canvas = ReactDOM.findDOMNode(this);
        this._ctx = this._canvas.getContext('2d');
    }

    componentWillReceiveProps(newProps) {
        this.drawGifForOptions(newProps.imageData, newProps);
    }

    drawGifForOptions(imageData, state) {
        if (imageData) {
            scanline_renderer.drawForOptions(this._canvas, this._ctx, imageData, state);
        }
    }

    render() {
        return (<canvas className="gif-canvas" width="0" height="0" />);
    }
};