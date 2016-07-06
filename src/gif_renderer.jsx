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
        if (!imageData)
            return;

        const increment = state.reverseFrameOrder ? -state.frameIncrement : state.frameIncrement;

        switch (state.mode) {
            case 'columns':
                return scanline_renderer.drawGrid(
                    this._canvas,
                    this._ctx,
                    imageData,
                    imageData.width / imageData.frames.length,
                    imageData.height,
                    state.currentFrame,
                    increment);
            
            case 'rows':
            default:
                return scanline_renderer.drawGrid(
                    this._canvas,
                    this._ctx,
                    imageData,
                    imageData.width,
                    imageData.height / imageData.frames.length,
                    state.currentFrame,
                    increment);

            case 'grid':
                return scanline_renderer.drawGrid(
                    this._canvas,
                    this._ctx,
                    imageData,
                    imageData.width / state.gridColumns,
                    imageData.height / state.gridRows,
                    state.currentFrame,
                    increment);

            case 'diagonal':
                return scanline_renderer.drawDiag(
                    this._canvas,
                    this._ctx,
                    imageData,
                    state.diagonalWidth,
                    state.diagonalAngle,
                    state.currentFrame,
                    increment);
            
            case 'circle':
                return scanline_renderer.drawCircle(
                    this._canvas,
                    this._ctx,
                    imageData,
                    state.radiusWidth,
                    state.currentFrame,
                    increment);
        }
    }

    render() {
        return (<canvas className="gif-canvas" width="0" height="0" />);
    }
};