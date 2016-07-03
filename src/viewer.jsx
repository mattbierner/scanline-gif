import React from 'react';
import ReactDOM from 'react-dom';

import loadGif from './loadGif';

const modes = {
    'columns': 'columns',
    'rows': 'rows',
    'custom': 'custom'
};

/**
 * 
*/
export default class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
            mode: Object.keys(modes)[0],
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
            this.drawGifForOptions(data, this.state);
        }).catch(e => console.error(e));
    }

    drawGifForOptions(imageData, state) {
        if (!imageData)
            return;
        
        switch (state.mode) {
        case modes.columns:
            this.drawGif(imageData, imageData.width / imageData.frames.length, imageData.height);
            break;

        case modes.rows:
            this.drawGif(imageData, imageData.width, imageData.height / imageData.frames.length);
            break;
        
        default:
            this.drawGif(imageData, state.tileWidth, state.tileHeight);
        }
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

    onModeChange(e) {
        const value = e.target.value;
        this.setState({ mode: value });
        this.drawGifForOptions(this.state.imageData, Object.assign({}, this.state, {mode: value}));
    }

    onTileWidthChange(e) {
        const value = +e.target.value;
        this.setState({ tileWidth: value });
        this.drawGifForOptions(this.state.imageData, Object.assign({}, this.state, {tileWidth: value}));
    }

    onTileHeightChange(e) {
        const value = +e.target.value;
        this.setState({ tileHeight: value });
        this.drawGifForOptions(this.state.imageData, Object.assign({}, this.state, {tileHeight: value}));
    }

    render() {
        const options = Object.keys(modes).map(x =>
            <option value={x} key={x}>{modes[x]}</option>);

        return (
            <div className="gif-viewer" id="viewer">
                <canvas className="gif-canvas" width="0" height="0" />
                <div className="view-controls">
                    <select value={this.state.mode} onChange={this.onModeChange.bind(this)}>
                        {options}
                    </select>

                    Width: <input type="range" min="1" max="500" value={this.state.tileWidth}
                        onChange={this.onTileWidthChange.bind(this) }/>

                    Height: <input type="range" min="1" max="500" value={this.state.tileHeight}
                        onChange={this.onTileHeightChange.bind(this) }/>
                </div>
            </div>);
    }
};
