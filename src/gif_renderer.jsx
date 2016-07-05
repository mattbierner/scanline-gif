import React from 'react';
import ReactDOM from 'react-dom';

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
        const propsToCheck = ['imageData', 'mode', 'tileWidth', 'tileHeight', 'diagonalWidth', 'diagonalAngle', 'initialFrame', 'currentFrame', 'frameIncrement'];
        const isDiff = propsToCheck.some(prop => this.props[prop] !== newProps[prop]);
        if (isDiff) {
            this.drawGifForOptions(newProps.imageData, newProps);
        }
    }

    drawGifForOptions(imageData, state) {
        if (!imageData)
            return;

        switch (state.mode) {
            case 'columns':
                this.drawGrid(imageData, imageData.width / imageData.frames.length, imageData.height, state.initialFrame + state.currentFrame, state.frameIncrement);
                break;

            case 'rows':
                this.drawGrid(imageData, imageData.width, imageData.height / imageData.frames.length, state.initialFrame + state.currentFrame, state.frameIncrement);
                break;

            case 'grid':
            default:
                this.drawGrid(imageData, state.tileWidth, state.tileHeight, state.initialFrame + state.currentFrame, state.frameIncrement);
                break;

            case 'diagonal':
                this.drawDiag(imageData, state.diagonalWidth, state.diagonalAngle, state.initialFrame + state.currentFrame, state.frameIncrement);
                break;
        }
    }

    drawDiag(imageData, tileWidth, angle, initialFrame, increment) {
        if (!imageData)
            return;

        const radAngle = angle * (Math.PI / 180);

        const ctx = this._ctx;
        const canvas = this._canvas;
        const {width, height} = imageData;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const len = imageData.frames.length;

        const diag = Math.sqrt(Math.pow(imageData.width, 2) + Math.pow(imageData.height, 2));

        let count = 0
        let i = initialFrame;
        let i2 = initialFrame - increment;
        
        while (count <= Math.ceil((diag / tileWidth) / 2)) {
            // draw first
            ctx.save();

            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(radAngle);
            ctx.translate(-width / 2, -height / 2);

            ctx.rect(-diag, height / 2 + (count * tileWidth), diag * 2, tileWidth);
            
            ctx.restore();

            ctx.clip();
            const frameNumber = i % len;
            ctx.drawImage(imageData.frames[frameNumber].canvas, 0, 0);

            ctx.restore();

            // draw second
            ctx.save();

            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(radAngle);
            ctx.translate(-width / 2, -height / 2);

            ctx.beginPath();
            ctx.rect(-diag, height / 2 - (count * tileWidth), diag * 2, tileWidth);

            ctx.restore();

            ctx.clip();
            const frameNumber2 = Math.abs(i2 < 0 ? len - i2 : i2) % len;

            ctx.drawImage(imageData.frames[frameNumber2].canvas, 0, 0);

            ctx.restore();

            ++count;
            i += increment;
            i2 -= increment;
        }
    }

    drawGrid(imageData, tileWidth, tileHeight, initialFrame, increment) {
        if (!imageData)
            return;

        const ctx = this._ctx;
        const canvas = this._canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const len = imageData.frames.length;
        const dy = imageData.height

        let i = initialFrame;
        for (let x = 0; x < imageData.width; x += tileWidth) {
            for (let y = 0; y < imageData.height; y += tileHeight) {
                const frameNumber = i % len;
                i += increment;
                ctx.save();

                // Create clipping rect.
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + tileWidth, y);
                ctx.lineTo(x + tileWidth, y + tileHeight);
                ctx.lineTo(x, y + tileHeight);
                ctx.clip();

                // Draw gif with clipping applied
                ctx.drawImage(imageData.frames[frameNumber].canvas, 0, 0);

                ctx.restore();
            }
        }
    }

    render() {
        return (<canvas className="gif-canvas" width="0" height="0" />);
    }
};