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
        const propsToCheck = ['imageData', 'mode', 'gridColumns', 'gridRows', 'diagonalWidth', 'diagonalAngle', 'reverseFrameOrder', 'currentFrame', 'frameIncrement', 'radiusWidth'];
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
                return this.drawGrid(
                    imageData,
                    imageData.width / imageData.frames.length,
                    imageData.height,
                    state.currentFrame,
                    increment);
            
            case 'rows':
            default:
                return this.drawGrid(
                    imageData,
                    imageData.width,
                    imageData.height / imageData.frames.length,
                    state.currentFrame,
                    increment);

            case 'grid':
                return this.drawGrid(
                    imageData,
                    imageData.width / state.gridColumns,
                    imageData.height / state.gridRows,
                    state.currentFrame,
                    increment);

            case 'diagonal':
                return this.drawDiag(
                    imageData,
                    state.diagonalWidth,
                    state.diagonalAngle,
                    state.currentFrame,
                    increment);
            
            case 'circle':
                return this.drawCircle(
                    imageData,
                    state.radiusWidth,
                    state.currentFrame,
                    increment);

        }
    }

    drawDiag(imageData, gridColumns, angle, initialFrame, increment) {
        const radAngle = angle * (Math.PI / 180);
        const {width, height} = imageData;

        const ctx = this._ctx;
        const canvas = this._canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const diag = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

        for (let i = 0, numDraws = Math.ceil((diag / gridColumns) / 2); i <= numDraws; ++i) {
            const frame1 = this.getFrame(imageData, initialFrame + i * increment);
            const frame2 = this.getFrame(imageData, initialFrame - ((i + 1) * increment));

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

                ctx.drawImage(frame1.canvas, 0, 0);
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

                ctx.drawImage(frame2.canvas, 0, 0);
            }
            ctx.restore();
        }
    }

    getFrame(imageData, index) {
        const len = imageData.frames.length;
        index %= len;
        if (index < 0)
            return imageData.frames[len - 1 - Math.abs(index)];
        return imageData.frames[index];
    }

    drawGrid(imageData, columnWidth, columnHeight, initialFrame, increment) {
        const ctx = this._ctx;
        const canvas = this._canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        let i = initialFrame;
        for (let x = 0; x < imageData.width; x += columnWidth) {
            for (let y = 0; y < imageData.height; y += columnHeight) {
                const frame = this.getFrame(imageData, i);
                ctx.save();

                // Create clipping rect.
                ctx.beginPath();
                ctx.rect(x, y, columnWidth, columnHeight)
                ctx.clip();

                // Draw gif with clipping applied
                ctx.drawImage(frame.canvas, 0, 0);

                ctx.restore();

                i += increment;
            }
        }
    }

    drawCircle(imageData, radiusStep, initialFrame, increment) {
        const {width, height} = imageData;

        const ctx = this._ctx;
        const canvas = this._canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        let i = initialFrame;
        for (let r = 0, len = Math.max(width, height); r < len; r += radiusStep) {
            const frame = this.getFrame(imageData, i);
            ctx.save();

            // Create clipping rect.
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, r + radiusStep, 0, Math.PI * 2, false);
            ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2, true);
            ctx.clip()

            // Draw gif with clipping applied
            ctx.drawImage(frame.canvas, 0, 0);

            ctx.restore();

            i += increment;
        }
    }

    render() {
        return (<canvas className="gif-canvas" width="0" height="0" />);
    }
};