import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 
 */
export default class LabeledRange extends React.Component {
    render() {
        const title = this.props.title ? (<div className='label'>{this.props.title}</div>) : '';
        return (
            <div className={'labeled-slider ' + (this.props.className || '')}>
                {title}
                <input className="slider"
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    onChange={this.props.onChange} />
                <span className="min">0</span>
                <span className="max">{this.props.max}</span>
                <span className="value">{this.props.value}</span>
            </div>
        );
    }
};


