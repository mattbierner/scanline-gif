import React from 'react';
import ReactDOM from 'react-dom';

import LabeledSlider from './labeled_slider';
import GifRenderer from './gif_renderer';

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
                        <div className="playback-speed-selector">
                            Speed: <select value={this.state.playbackSpeed} onChange={this.onPlaybackSpeedChange.bind(this) }>
                                {playbackSpeedOptions}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
