import React from 'react';
import ReactDOM from 'react-dom';

const giphy = require('giphy-api')('dc6zaTOxFJmzC');

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: 'cat',
            results: [],
            active: false
        };
    }

    onFocus() {
        this.setState({active: true});
    }

    onSelect() {
        this.props.onGifSelected(this.props.data);
        window.location = '#viewer'
    }

    render() {
        const still = this.props.data.images.downsized_still;
        const animated = this.props.data.images.downsized;

        return (
            <li className="search-result" onClick={this.onFocus.bind(this)}>
                <figure className="preview" style={{width: `${still.width}px`, height: `${still.height}px` }}>
                    <img className="still" src={still.url} />
                    <img style={{ display: this.state.active ? 'block' : 'none'}}  className="animated" src={this.state.active ? animated.url : 'about:blank'} />
                </figure>
                <button onClick={this.onSelect.bind(this)}>use</button>
            </li>
        );
    }
};


export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: 'cat',
            results: []
        };
    }

    onSearchTextChange(e) {
        const value = e.target.value;
        this.setState({ searchText: value });
    }

    search() {
        giphy.search(this.state.searchText)
            .then(res => {
                console.log(res);
                this.setState({results: res.data })
            })
            .catch(err => {
                console.error(err);
            });
    }

    onGifSelected(data) {
        const src = data.images.original.url;
        this.props.onGifSelected(src);
    }

    render() {
        const results = this.state.results.map(x => 
            <SearchResult key={x.id} data={x}
            onGifSelected={this.onGifSelected.bind(this)} />);

        return (
            <div className="gif-search content-wrapper">
                <input type="search"
                    value={this.state.searchText}
                    placeholder="Find gif"
                    onChange={this.onSearchTextChange.bind(this) } />
                <button onClick={this.search.bind(this)}>Search</button>
                <ul className="search-results">{results}</ul>
            </div>);
    }
};
