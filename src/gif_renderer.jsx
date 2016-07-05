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
        const propsToCheck = ['imageData', 'mode', 'gridColumns', 'gridRows', 'diagonalWidth', 'diagonalAngle', 'initialFrame', 'currentFrame', 'frameIncrement'];
        const isDiff = propsToCheck.some(prop => this.props[prop] !== newProps[prop]);
        if (isDiff) {
            this.drawGifForOptions(newProps.imageData, newProps);
        }
    }

    drawGifForOptions(imageData, state) {
        if (!imageData)
            return;

        const startFrame = state.initialFrame + state.currentFrame;

        switch (state.mode) {
            case 'columns':
                this.drawGrid(imageData, imageData.width / imageData.frames.length, imageData.height, startFrame, state.frameIncrement);
                break;

            case 'rows':
            default:
                this.drawGrid(imageData, imageData.width, imageData.height / imageData.frames.length, startFrame, state.frameIncrement);
                break;

            case 'grid':
                this.drawGrid(
                    imageData,
                    imageData.width / state.gridColumns,
                    imageData.height / state.gridRows,
                    startFrame,
                    state.frameIncrement);
                break;

            case 'diagonal':
                this.drawDiag(imageData, state.diagonalWidth, state.diagonalAngle, startFrame, state.frameIncrement);
                break;
        }
    }

    drawDiag(imageData, gridColumns, angle, initialFrame, increment) {
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

        for (let i = 0, numDraws = Math.ceil((diag / gridColumns) / 2); i <= numDraws; ++i) {
            const frame1 = (initialFrame + i * increment) % len;
            const frame2Start = (initialFrame - ((i + 1) * increment)) % len;
            const frame2 = frame2Start < 0 ? len - 1 - Math.abs(frame2Start) : frame2Start;

            // draw first
            ctx.save();
            {
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.rotate(radAngle);
                ctx.translate(-width / 2, -height / 2);
                ctx.beginPath();
                ctx.rect(-diag, height / 2 + (i * gridColumns), diag * 2, gridColumns);
                ctx.restore();

                ctx.clip();

                ctx.drawImage(imageData.frames[frame1].canvas, 0, 0);
            }
            ctx.restore();

            // draw second
            ctx.save();
            {
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.rotate(radAngle);
                ctx.translate(-width / 2, -height / 2);
                ctx.beginPath();
                ctx.rect(-diag, height / 2 - (i * gridColumns), diag * 2, gridColumns);
                ctx.restore();
                ctx.clip();

                ctx.drawImage(imageData.frames[frame2].canvas, 0, 0);
            }
            ctx.restore();
        }
    }

    drawGrid(imageData, gridColumns, gridRows, initialFrame, increment) {
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
        for (let x = 0; x < imageData.width; x += gridColumns) {
            for (let y = 0; y < imageData.height; y += gridRows) {
                const frameNumber = i % len;
                i += increment;
                ctx.save();

                // Create clipping rect.
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + gridColumns, y);
                ctx.lineTo(x + gridColumns, y + gridRows);
                ctx.lineTo(x, y + gridRows);
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