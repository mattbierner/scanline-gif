import React from 'react';
import ReactDOM from 'react-dom';

const giphy = require('giphy-api')('dc6zaTOxFJmzC');
giphy.search('pokemon').then(function(res) {
    console.log(res);
}).catch(err => console.error(err));

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
    }

    onSearchTextChange(e) {
        this.setState({ searchText: e.target.value });
    }

    render() {
        return (
            <div className="gif-search">
                <input type="text"
                    value={this.state.searchText}
                    placeholder="Find Gif"
                    onChange={this.onSearchTextChange.bind(this)} />
            </div>);
    }
};
