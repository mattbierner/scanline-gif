import React from 'react';
import ReactDOM from 'react-dom';

import LoadingSpinner from './loading_spinner';

const giphy = require('giphy-api')({
    https: true,
    apiKey: 'dc6zaTOxFJmzC'
});

/**
 * Gif search result
 */
class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            self: null
        };
    }

    componentDidMount() {
        this.setState({ self: ReactDOM.findDOMNode(this) });
    }

    onMouseOver() {
        this.setState({ active: true });
    }

    onMouseOut() {
        this.setState({ active: false });
    }

    onSelect() {
        this.props.onGifSelected(this.props.data);
    }

    onTouchDown() {
        if (this.state.active) {
            this.setState({ selected: true });
        }
    }

    onScrollLeave() {
        this.setState({ active: false });
    }

    render() {
        const still = this.props.data.images.downsized_still;
        const animated = this.props.data.images.downsized;

        return (
            <li className={"search-result " + (this.state.active ? 'active' : '') }
                onClick={this.onSelect.bind(this) }
                onMouseOver={this.onMouseOver.bind(this) }
                onMouseOut={this.onMouseOut.bind(this) }>
                <figure className="preview" >
                    <img className="still" src={still.url} />
                    <img style={{ display: this.state.active ? 'block' : 'none' }}  className="animated" src={this.state.active ? animated.url : 'about:blank'} />
                </figure>
            </li>
        );
    }
};

/**
 * Search bar for entering text
 */
class GifSearchBar extends React.Component {
    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.onSearch();
        }
    }

    onSearch() {
        this.props.onSearch(this.props.searchText);
    }

    render() {
        return (
            <div className="gif-search-bar content-wrapper">
                <button onClick={this.onSearch.bind(this) }><span className="material-icons">search</span></button>
                <input type="text"
                    value={this.props.searchText}
                    placeholder="find a gif"
                    onKeyPress={this.onKeyPress.bind(this) }
                    onChange={this.props.onChange} />
            </div>
        );
    }
}


/**
 * Displays list of gif search results
 */
class GifSearchResults extends React.Component {
    render() {
        let results;
        if (this.props.results && this.props.results.length === 0) {
            if (!this.props.loading) {
                results = <div>No gifs found</div>;
            }
        } else if (this.props.results) {
            results = this.props.results.map(x =>
                <SearchResult key={x.id} data={x}
                    onGifSelected={this.props.onGifSelected} />);
        }

        return (
            <div>
                <div className="search-label">{this.props.query}</div>
                <LoadingSpinner active={this.props.loading} />
                <ul className="search-results">{results}</ul>
            </div>);
    }
}

/**
 * Gif search control.
 */
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            query: '', // search term for current results
            loading: false,
            results: null
        };
    }

    onSearchTextChange(e) {
        const value = e.target.value;
        this.setState({ searchText: value });
    }

    search() {
        this.setState({
            loading: true,
            query: this.state.searchText,
            results: []
        });

        giphy.search(this.state.searchText)
            .then(res => {
                this.setState({
                    results: res.data,
                    loading: false,
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false,
                })
            });
    }

    onGifSelected(data) {
        const src = data.images.downsized_medium.url;
        this.props.onGifSelected(src);
    }

    render() {
        return (
            <div className="gif-search">
                <GifSearchBar
                    onChange={this.onSearchTextChange.bind(this) }
                    onSearch={this.search.bind(this) }/>
                <GifSearchResults {...this.state}
                    onGifSelected={this.onGifSelected.bind(this) }/>
            </div>);
    }
};
