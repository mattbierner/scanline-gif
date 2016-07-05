import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 
 */
export default class LabeledRange extends React.Component {
    render() {
        const title = this.props.title ? (<div className='control-title'>{this.props.title}</div>) : '';
        return (
            <div className={'control-group labeled-slider ' + (this.props.className || '')}>
                {title}
                <input className="slider"
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    onChange={this.props.onChange} />
                <span className="min label">{this.props.min}</span>
                <span className="max label">{this.props.max}</span>
                <span className="value label">{this.props.value + (this.props.units || '')}</span>
            </div>
        );
    }
};


