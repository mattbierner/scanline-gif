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
    },
    'diagonal': {
        title: 'Diagonal',
        description: 'Configurable diagonal lines'
    }
};


class ModeSelector extends React.Component {
    render() {
        const modeOptions = Object.keys(modes).map(x =>
            <option value={x} key={x}>{modes[x].title}</option>);
        return (
            <div className="mode-selector control-group">
                <div className="control-title">Mode</div>
                <select value={this.props.value} onChange={this.props.onChange }>
                    {modeOptions}
                </select>
                <p className="control-description">{modes[this.props.value].description}</p>
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
            gridColumns: 10,
            gridRows: 10,
            initialFrame: 0,
            frameIncrement: 1,
            playbackSpeed: 1,

            diagonalWidth: 20,
            diagonalAngle: 45
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
                if (file !== this.props.file)
                    return;
                
                this.setState({
                    imageData: data,
                    error: null,

                    playbackSpeed: 1,
                    initialFrame: 0,
                    frameIncrement: 1,
                    gridColumns: 10,
                    gridRows: 10,

                    diagonalWidth: 20,
                    diagonalAngle: 45
                });
            })
            .catch(e => {
                console.error(e);
                this.setState({
                    imageData: [],
                    error: 'Could not load gif'
                })
            });
    }

    onModeChange(e) {
        const value = e.target.value;
        this.setState({ mode: value });
    }

    onGridColumnsChange(e) {
        const value = +e.target.value;
        this.setState({ gridColumns: value });
    }

    onInitialFrameChange(e) {
        const value = +e.target.value;
        this.setState({ initialFrame: value });
    }

    onFrameIncrementChange(e) {
        const value = +e.target.value;
        this.setState({ frameIncrement: value });
    }

    onGridRowsChange(e) {
        const value = +e.target.value;
        this.setState({ gridRows: value });
    }

    onDiagonalAngleChange(e) {
        const value = +e.target.value;
        this.setState({ diagonalAngle: value });
    }

    onDiagonalWidthChange(e) {
        const value = +e.target.value;
        this.setState({ diagonalWidth: value });
    }

    render() {
        return (
            <div className="gif-viewer" id="viewer">
                <div className="player-wrapper">
                    <GifPlayer {...this.state} />
                </div>
                <div className="view-controls">
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
                        <LabeledSlider title="Columns"
                            units=" columns"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.width : 1}
                            value={this.state.gridColumns}
                            onChange={this.onGridColumnsChange.bind(this) }/>

                        <LabeledSlider title="Rows"
                            units=" rows"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.height : 1}
                            value={this.state.gridRows}
                            onChange={this.onGridRowsChange.bind(this) }/>
                    </div>

                    <div className={"diagonal-controls " + (this.state.mode === 'diagonal' ? '' : 'hidden') }>
                        <LabeledSlider title="Angle"
                            units="deg"
                            min="0"
                            max="360"
                            value={this.state.diagonalAngle}
                            onChange={this.onDiagonalAngleChange.bind(this) }/>

                        <LabeledSlider title="Width"
                            units="px"
                            min="1"
                            max={this.state.imageData ? this.state.imageData.height : 1}
                            value={this.state.diagonalWidth}
                            onChange={this.onDiagonalWidthChange.bind(this) }/>
                    </div>
                </div>
            </div>);
    }
};
