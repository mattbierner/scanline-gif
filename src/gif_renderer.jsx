import React from 'react';
import ReactDOM from 'react-dom';

import * as scanline_renderer from './scanline_renderer';

const propsToCheck = ['imageData', 'mode', 'gridColumns', 'gridRows', 'diagonalWidth', 'diagonalAngle', 'reverseFrameOrder', 'currentFrame', 'frameIncrement', 'radiusWidth'];

/**
 * Renders a scanlined gif. 
 */
export default class GifRenderer extends React.Component {
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this);
        const ctx = canvas.getContext('2d');

        this._canvas = canvas;
        this._ctx = ctx;
    }

    componentWillReceiveProps(newProps) {
        const isDiff = propsToCheck.some(prop => this.props[prop] !== newProps[prop]);
        if (isDiff) {
            this.drawGifForOptions(newProps.imageData, newProps);
        }
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