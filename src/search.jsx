import React from 'react';
import ReactDOM from 'react-dom';
const Waypoint = require('react-waypoint');

const giphy = require('giphy-api')('dc6zaTOxFJmzC');

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
        window.location = '#viewer';
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
                <button onClick={this.onSearch.bind(this)}><span className="material-icons">search</span></button>
                <input type="search"
                    value={this.props.searchText}
                    placeholder="find a gif"
                    onKeyPress={this.onKeyPress.bind(this) }
                    onChange={this.props.onChange} />
            </div>
        );
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
                this.setState({ results: res.data })
            })
            .catch(err => {
                console.error(err);
            });
    }

    onGifSelected(data) {
        const src = data.images.downsized_medium.url;
        this.props.onGifSelected(src);
    }

    render() {
        const results = this.state.results.map(x =>
            <SearchResult key={x.id} data={x}
                onGifSelected={this.onGifSelected.bind(this) } />);

        return (
            <div className="gif-search">
                <GifSearchBar
                    onChange={this.onSearchTextChange.bind(this)}
                    onSearch={this.search.bind(this)}/>

                <ul className="search-results">{results}</ul>
            </div>);
    }
};
