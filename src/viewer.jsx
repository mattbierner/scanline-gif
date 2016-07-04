import React from 'react';
import ReactDOM from 'react-dom';

import loadGif from './loadGif';
import LabeledSlider from './labeled_slider';
import GifPlayer from './gif_player';

/**
 * Display modes
 */
const modes = {
    'columns': {
        title: 'Columns',
        description: 'Equal width columns, one for each frame'
    },
    'rows': {
        title: 'Rows',
        description: 'Equal height rows, one for each frame'
    },
    'grid': {
        title: 'Grid',
        description: 'Configurable grid'
    }
};


class ModeSelector extends React.Component {
    render() {
        const modeOptions = Object.keys(modes).map(x =>
            <option value={x} key={x}>{modes[x].title}</option>);
        return (
            <div className="mode-selector">
                <select value={this.props.value} onChange={this.props.onChange }>
                    {modeOptions}
                </select>
                <p>{modes[this.props.value].description}</p>
            </div>);
    }
}

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
            frameIncrement: 1,
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
                    frameIncrement: 1,
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

    onFrameIncrementChange(e) {
        const value = +e.target.value;
        this.setState({ frameIncrement: value });
    }

    onTileHeightChange(e) {
        const value = +e.target.value;
        this.setState({ tileHeight: value });
    }

    render() {
        return (
            <div className="gif-viewer" id="viewer">
                <GifPlayer {...this.state} />

                <div className="view-controls content-wrapper">
                    <ModeSelector value={this.state.mode} onChange={this.onModeChange.bind(this) } />

                    <div className="frame-controls">
                        <LabeledSlider title='Initial Frame'
                            min="0"
                            max={this.state.imageData ? this.state.imageData.frames.length - 1 : 0}
                            value={this.state.initialFrame}
                            onChange={this.onInitialFrameChange.bind(this) }/>

                        <LabeledSlider title='Frame Increment'
                            min="1"
                            max={this.state.imageData ? this.state.imageData.frames.length - 1 : 0}
                            value={this.state.frameIncrement}
                            onChange={this.onFrameIncrementChange.bind(this) }/>
                    </div>

                    <div className={"grid-controls " + (this.state.mode === 'grid' ? '' : 'hidden') }>
                        <LabeledSlider title="Title Width"
                            units="px"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.width : 1}
                            value={this.state.tileWidth}
                            onChange={this.onTileWidthChange.bind(this) }/>

                        <LabeledSlider title="Title Height"
                            units="px"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.height : 1}
                            value={this.state.tileHeight}
                            onChange={this.onTileHeightChange.bind(this) }/>
                    </div>
                </div>
            </div>);
    }
};
