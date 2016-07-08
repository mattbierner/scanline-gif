import React from 'react';
import ReactDOM from 'react-dom';

import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import GifRenderer from './gif_renderer';

const playbackSpeeds = {
    '1x speed': 1,
    '2x speed': 2,
    '4x speed': 4,
    '8x speed': 8,
    '1/2 speed': 0.5,
    '1/4 speed': 0.25,
    '1/8 speed': 0.125,
};

/**
 * Select playback speed.
 */
class SpeedSelector extends React.Component {
    render() {
        const options = Object.keys(playbackSpeeds).map(x =>
            <option value={playbackSpeeds[x]} key={x}>{x}</option>);

        return (
            <div className="playback-speed-selector">
                <select value={this.props.value} onChange={this.props.onChange}>
                    {options}
                </select>
            </div>);
    }
}

/**
 * Property of a gif.
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
 * Set of metadata displayed about a gif.
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
 * Playback controls for scanlined gif.
 */
export default class GifPlayer extends React.Component {
    constructor(props) {
        super(props);
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
                currentFrame: 0,
                playing: true // autoplay
            });
            this.scheduleNextFrame(newProps.imageData, 0, true);
        }
    }

    onToggle() {
        this.setState({ playing: !this.state.playing });

        if (!this.state.playing) {
            this.scheduleNextFrame(this.props.imageData, 0, true);
        }
    }

    getNumFrames() {
        if (!this.props.imageData)
            return 0;
        return this.props.imageData.frames.length;
    }

    scheduleNextFrame(imageData, delay, forcePlay) {
        if (!forcePlay && !this.state.playing)
            return;

        const start = Date.now();
        setTimeout(() => {
            if (!this.props.imageData || (this.props.imageData !== imageData))
                return;

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
            this.scheduleNextFrame(imageData, next);
        }, delay);
    }

    onSliderChange(e) {
        const frame = +e.target.value % this.getNumFrames();
        this.setState({ currentFrame: frame });
    }

    onReplay() {
        this.setState({ currentFrame: 0 });
    }

    onPlaybackSpeedChange(e) {
        const value = +e.target.value;
        this.setState({ playbackSpeed: value });
    }

    render() {
        return (
            <div className="gif-figure">
                <GifRenderer {...this.props} currentFrame={this.state.currentFrame} />
                <div className="content-wrapper">
                    <GifProperties {...this.props} />
                </div>
                <div>
                    <LoadingSpinner active={this.props.loadingGif} />
                </div>
                <div className="playback-controls content-wrapper">
                    <LabeledSlider className="playback-tracker"
                        min="0"
                        max={this.getNumFrames() - 1}
                        value={this.state.currentFrame}
                        onChange={this.onSliderChange.bind(this) }/>

                    <div className="buttons">
                        <button
                            title="Restart"
                            className="material-icons"
                            onClick={this.onReplay.bind(this) }>replay</button>
                        <button
                            className="material-icons"
                            onClick={this.onToggle.bind(this) }>{this.state.playing ? 'pause' : 'play_arrow'}</button>
                        <SpeedSelector value={this.state.playbackSpeed} onChange={this.onPlaybackSpeedChange.bind(this) }/>
                    </div>
                </div>
            </div>
        );
    }
};
