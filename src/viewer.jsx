import React from 'react';
import ReactDOM from 'react-dom';

import loadGif from './loadGif';

/**
 * Display modes
 */
const modes = {
    'columns': 'columns',
    'rows': 'rows',
    'custom': 'custom'
};


/**
 * Renders a scanlined gif. 
 */
class GifRenderer extends React.Component {
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this);
        const ctx = canvas.getContext('2d');

        this._canvas = canvas;
        this._ctx = ctx;
    }

    componentWillReceiveProps(newProps) {
        const propsToCheck = ['imageData', 'mode', 'tileWidth', 'tileHeight', 'initialFrame'];
        const isDiff = propsToCheck.some(prop => this.props[prop] !== newProps[prop]);
        if (isDiff) {
            this.drawGifForOptions(newProps.imageData, newProps);
        }
    }

    drawGifForOptions(imageData, state) {
        if (!imageData)
            return;

        switch (state.mode) {
            case modes.columns:
                this.drawGif(imageData, imageData.width / imageData.frames.length, imageData.height, 0);
                break;

            case modes.rows:
                this.drawGif(imageData, imageData.width, imageData.height / imageData.frames.length, 0);
                break;

            default:
                this.drawGif(imageData, state.tileWidth, state.tileHeight, state.initialFrame);
        }
    }

    drawGif(imageData, tileWidth, tileHeight, initialFrame) {
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
                const frameNumber = i++ % len;
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

/**
 * Property of a gif
 */
class GifProperty extends React.Component {
    render() {
        return (
            <div className="property">
                <span className="key">{this.props.label}</span>: <span className="value">{this.props.value}</span>
            </div>
        );
    }
};

/**
 * Property of a gif
 */
class GifProperties extends React.Component {
    render() {
        return (
            <div className="gif-properties">
                <GifProperty label="Frames" value={this.props.imageData ? this.props.imageData.frames.length : ''} />
                <GifProperty label="Width" value={this.props.imageData ? this.props.imageData.width : ''} />
                <GifProperty label="Height" value={this.props.imageData ? this.props.imageData.height : ''} />
            </div>
        );
    }
};

/**
 * Displays a scannedlined gif plus metadata info about it.
 */
class GifFigure extends React.Component {
    render() {
        return (
            <div className="gif-figure">
                <GifRenderer {...this.props} />
                <GifProperties {...this.props} />
            </div>
        );
    }
};

/**
 * Displays an interative scanlined gif with controls. 
 */
export default class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
            mode: Object.keys(modes)[0],
            tileWidth: 10,
            tileHeight: 10,
            initialFrame: 0
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
        loadGif(file)
            .then(data => {
                this.setState({ imageData: data });
            })
            .catch(e => console.error(e));
    }

    onModeChange(e) {
        const value = e.target.value;
        this.setState({ mode: value });
    }

    onTileWidthChange(e) {
        const value = +e.target.value;
        this.setState({ tileWidth: value });
    }

    onInitialFrameChange(e) {
        const value = +e.target.value;
        this.setState({ initialFrame: value });
    }

    onTileHeightChange(e) {
        const value = +e.target.value;
        this.setState({ tileHeight: value });
    }

    render() {
        const options = Object.keys(modes).map(x =>
            <option value={x} key={x}>{modes[x]}</option>);

        return (
            <div className="gif-viewer" id="viewer">
                <GifFigure {...this.state} />

                <div className="view-controls">
                    <select value={this.state.mode} onChange={this.onModeChange.bind(this) }>
                        {options}
                    </select>

                    <div className={"custom-controls " + (this.state.mode === modes.custom ? '' : 'hidden') }>
                        Width: <input type="range" min="1" max="500" value={this.state.tileWidth}
                            onChange={this.onTileWidthChange.bind(this) }/>

                        Height: <input type="range" min="1" max="500" value={this.state.tileHeight}
                            onChange={this.onTileHeightChange.bind(this) }/>

                        Initial frame: <input type="range" min="0" max="60" value={this.state.initialFrame}
                            onChange={this.onInitialFrameChange.bind(this) }/>
                    </div>
                </div>
            </div>);
    }
};
