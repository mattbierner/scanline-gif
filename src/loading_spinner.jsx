import React from 'react';
import ReactDOM from 'react-dom';

export default class LoadingSpinner extends React.Component {
    render() {
        return (
            <span className={"material-icons loading-spinner " + (this.props.active ? '' : 'hidden') }>autorenew</span>
        );
    }
}