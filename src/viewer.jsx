import React from 'react';
import ReactDOM from 'react-dom';

import loadGif from './loadGif';

/**
 * 
*/
export default class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
            tileWidth: 10,
            tileHeight: 10
        };
    }

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('gif-canvas')[0];
        const ctx = canvas.getContext('2d');

        this._canvas = canvas;
        this._ctx = ctx;

        this.loadGif(this.props.file);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.file && newProps.file.length && newProps.file !== this.props.file) {
            this.loadGif(newProps.file);
        }
    }

    loadGif(file) {
        loadGif(file).then(data => {
            this.setState({ imageData: data });
            this.drawGif(data, this.state.tileWidth, this.state.tileHeight);
        }).catch(e => console.error(e));
    }

    drawGif(imageData, tileWidth, tileHeight) {
        if (!imageData)
            return;

        const ctx = this._ctx;
        const canvas = this._canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const len = imageData.frames.length;
        const dy = imageData.height

        let i = 0;
        for (let x = 0; x < imageData.width; x += tileWidth) {
            for (let y = 0; y < imageData.height; y += tileHeight) {
                const frameNumber = i++ % len;
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + tileWidth, y);
                ctx.lineTo(x + tileWidth, y + tileHeight);
                ctx.lineTo(x, y + tileHeight);

                ctx.clip();

                ctx.drawImage(imageData.frames[frameNumber].canvas, 0, 0);

                ctx.restore();
            }
        }
    }

    onTileWidthChange(e) {
        const value = +e.target.value;
        this.setState({ tileWidth: value });
        this.drawGif(this.state.imageData, value, this.state.tileHeight);
    }

    onTileHeightChange(e) {
        const value = +e.target.value;
        this.setState({ tileHeight: value });
        this.drawGif(this.state.imageData, this.state.tileWidth, value);
    }

    render() {
        return (
            <div className="gif-viewer" id="viewer">
                <canvas className="gif-canvas" width="0" height="0" />
                <div className="view-controls">
                    Width: <input type="range" min="1" max="500" value={this.state.tileWidth}
                        onChange={this.onTileWidthChange.bind(this) }/>

                    Height: <input type="range" min="1" max="500" value={this.state.tileHeight}
                        onChange={this.onTileHeightChange.bind(this) }/>
                </div>
            </div>);
    }
};
