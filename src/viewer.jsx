import React from 'react';
import ReactDOM from 'react-dom';

import loadGif from './loadGif';
import LabeledSlider from './labeled_slider';
import GifPlayer from './gif_player';
import exportGif from './gif_export';

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
        description: 'Configurable diagonal bars'
    },
    'circle': {
        title: 'Rings',
        description: 'Configurable rings'
    }
};

/**
 * Control for selecting rendering mode.
 */
class ModeSelector extends React.Component {
    render() {
        const modeOptions = Object.keys(modes).map(x =>
            <option value={x} key={x}>{modes[x].title}</option>);
        return (
            <div className="mode-selector control-group">
                <span className="control-title">Mode </span>
                <select value={this.props.value} onChange={this.props.onChange }>
                    {modeOptions}
                </select>
                <div className="control-description">{modes[this.props.value].description}</div>
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

            //grid
            gridColumns: 10,
            gridRows: 10,

            // playback
            reverseFrameOrder: false,
            bounceFrameOrder: false,
            frameIncrement: 1,
            playbackSpeed: 1,

            // Diagonal
            diagonalWidth: 20,
            diagonalAngle: 45,

            // Circles
            radiusWidth: 10
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
                    reverseFrameOrder: false,
                    
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

    onReverseFrameOrderChange(e) {
        const value = e.target.checked;
        this.setState({ reverseFrameOrder: value });
    }

    onBounceFrameOrderChange(e) {
        const value = e.target.checked;
        this.setState({ bounceFrameOrder: value });
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

    onRadiusWidthChange(e) {
        const value = +e.target.value;
        this.setState({ radiusWidth: value });
    }

    onExport() {
        exportGif(this.state.imageData, this.state).then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url);
        });
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
                        <div className="full-width">
                            <LabeledSlider title='Frame Increment'
                                min="1"
                                max={this.state.imageData ? this.state.imageData.frames.length - 1 : 0}
                                value={this.state.frameIncrement}
                                onChange={this.onFrameIncrementChange.bind(this) }/>
                        </div>
                        <div>
                            <div className="control-group">
                                <div className='control-title'>Reverse Frames</div>
                                <input type="checkbox" value="reverseFrameOrder" onChange={this.onReverseFrameOrderChange.bind(this)}/>
                            </div>
                        </div>
                        <div>
                            <div className="control-group">
                                <div className='control-title'>Mirror Frames</div>
                                <input type="checkbox" value="reverseFrameOrder" onChange={this.onBounceFrameOrderChange.bind(this)}/>
                            </div>
                        </div>
                    </div>

                    <div className={"mode-control-set grid-controls " + (this.state.mode === 'grid' ? '' : 'hidden') }>
                        <h4 className="control-set-label">Grid options</h4>
                        <div>
                            <LabeledSlider title="Columns"
                                units=" columns"
                                min="1"
                                max={this.state.imageData ? this.state.imageData.width : 1}
                                value={this.state.gridColumns}
                                onChange={this.onGridColumnsChange.bind(this) }/>
                        </div>
                        <div>
                            <LabeledSlider title="Rows"
                                units=" rows"
                                min="1"
                                max={this.state.imageData ? this.state.imageData.height : 1}
                                value={this.state.gridRows}
                                onChange={this.onGridRowsChange.bind(this) }/>
                        </div>
                    </div>

                    <div className={"mode-control-set diagonal-controls " + (this.state.mode === 'diagonal' ? '' : 'hidden') }>
                        <h4 className="control-set-label">Diagonal Options</h4>
                        <div>
                            <LabeledSlider title="Angle"
                                units=" deg"
                                min="0"
                                max="360"
                                value={this.state.diagonalAngle}
                                onChange={this.onDiagonalAngleChange.bind(this) }/>
                        </div>
                        <div>
                            <LabeledSlider title="Step Size"
                                units="px"
                                min="1"
                                max={this.state.imageData ? Math.max(this.state.imageData.height, this.state.imageData.width) : 1}
                                value={this.state.diagonalWidth}
                                onChange={this.onDiagonalWidthChange.bind(this) }/>
                        </div>
                    </div>

                    <div className={"mode-control-set circle-controls " + (this.state.mode === 'circle' ? '' : 'hidden') }>
                        <h4 className="control-set-label">Circle Options</h4>
                        <div className="full-width">
                            <LabeledSlider title="Step Size"
                                units="px"
                                min="1"
                                max={this.state.imageData ? Math.max(this.state.imageData.height, this.state.imageData.width) / 2 : 1}
                                value={this.state.radiusWidth}
                                onChange={this.onRadiusWidthChange.bind(this) }/>
                        </div>
                    </div>

                    <div className="export-controls">
                        <button onClick={this.onExport.bind(this) }>Export to gif</button>
                    </div>
                </div>
            </div>);
    }
};
