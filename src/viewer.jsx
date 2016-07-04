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

const playbackSpeeds = {
    '1x': 1,
    '2x': 2,
    '4x': 4,
    '8x': 8,
    '1/2': 0.5,
    '1/4': 0.25,
    '1/8': 0.125,
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
        const propsToCheck = ['imageData', 'mode', 'tileWidth', 'tileHeight', 'initialFrame', 'currentFrame'];
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
                this.drawGif(imageData, imageData.width / imageData.frames.length, imageData.height, state.initialFrame + state.currentFrame);
                break;

            case modes.rows:
                this.drawGif(imageData, imageData.width, imageData.height / imageData.frames.length, state.initialFrame + state.currentFrame);
                break;

            default:
                this.drawGif(imageData, state.tileWidth, state.tileHeight, state.initialFrame + state.currentFrame);
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
    constructor(props) {
        super(props)
        this.state = {
            currentFrame: 0,
            playing: false,
            loop: true,
            playbackSpeed: 1
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.props.imageData !== newProps.imageData) {
            this.setState({
                //    playing: false,
                currentFrame: 0
            })
        }
    }

    onToggle() {
        this.setState({ playing: !this.state.playing });

        if (!this.state.playing) {
            this.scheduleNextFrame(0, true);
        }
    }

    getNumFrames() {
        if (!this.props.imageData)
            return 0;
        return this.props.imageData.frames.length;
    }

    scheduleNextFrame(delay, forcePlay) {
        if (!this.props.imageData || (!forcePlay && !this.state.playing))
            return;

        const start = Date.now();
        setTimeout(() => {
            let nextFrame = (this.state.currentFrame + 1);
            if (nextFrame >= this.getNumFrames() && !this.state.loop) {
                this.setState({ playing: false });
                return;
            }

            nextFrame %= this.getNumFrames();

            const interval = ((this.props.imageData.frames[nextFrame].info.delay || 1) * 10) / this.state.playbackSpeed;
            const elapsed = (Date.now() - start);
            const next = Math.max(0, interval - (elapsed - delay));
            this.setState({
                currentFrame: nextFrame
            });
            this.scheduleNextFrame(next);
        }, delay);
    }

    onSliderChange(e) {
        const frame = +e.target.value % this.getNumFrames();
        this.setState({ currentFrame: frame });
    }

    onReplay() {
        this.setState({
            currentFrame: 0
        });
    }

    onLoopToggle() {
        this.setState({ loop: !this.state.loop });
    }

    onPlaybackSpeedChange(e) {
        const value = +e.target.value;
        this.setState({ playbackSpeed: value });
    }

    render() {
        const playbackSpeedOptions = Object.keys(playbackSpeeds).map(x =>
            <option value={playbackSpeeds[x]} key={x}>{x}</option>);

        return (
            <div className="gif-figure">
                <GifRenderer {...this.props} currentFrame={this.state.currentFrame} />
                <div className="content-wrapper">
                    <GifProperties {...this.props} />
                    <div className="playback-controls">
                        <div className="playback-tracker">
                            <input type="range" className="playback-slider"
                                min="0"
                                max={this.getNumFrames() - 1}
                                value={this.state.currentFrame}
                                onChange={this.onSliderChange.bind(this) }/>
                            <span className="min">0</span>
                            <span className="max">{this.getNumFrames() }</span>
                            <span className="value">{this.state.currentFrame}</span>
                        </div>
                        <button
                            title="Restart"
                            className="material-icons"
                            onClick={this.onReplay.bind(this) }>replay</button>
                        <button
                            className="material-icons"
                            onClick={this.onToggle.bind(this) }>{this.state.playing ? 'pause' : 'play_arrow'}</button>
                        <select value={this.state.playbackSpeed} onChange={this.onPlaybackSpeedChange.bind(this) }>
                            {playbackSpeedOptions}
                        </select>
                    </div>
                </div>
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
            initialFrame: 0,
            playbackSpeed: 1
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
                this.setState({
                    imageData: data,
                    playbackSpeed: 1,
                    initialFrame: 0,
                    tileWidth: 10,
                    tileHeight: 10
                });
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

                    Initial frame: <input type="range"
                        min="0"
                        max={this.state.imageData ? this.state.imageData.frames.length - 1 : 0}
                        value={this.state.initialFrame}
                        onChange={this.onInitialFrameChange.bind(this) }/>

                    <div className={"custom-controls " + (this.state.mode === modes.custom ? '' : 'hidden') }>
                        Width: <input type="range"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.width : 1}
                            value={this.state.tileWidth}
                            onChange={this.onTileWidthChange.bind(this) }/>

                        Height: <input type="range"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.height : 1}
                            value={this.state.tileHeight}
                            onChange={this.onTileHeightChange.bind(this) }/>
                    </div>
                </div>
            </div>);
    }
};
