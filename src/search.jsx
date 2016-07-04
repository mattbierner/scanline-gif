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
        this.setState({active: true});
    }

    onMouseOut() {
        this.setState({active: false});
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
 * Gif search control.
 */
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
                this.setState({ results: res.data })
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
                onGifSelected={this.onGifSelected.bind(this) } />);

        return (
            <div className="gif-search">
                <input type="search"
                    value={this.state.searchText}
                    placeholder="Find gif"
                    onChange={this.onSearchTextChange.bind(this) } />
                <button onClick={this.search.bind(this) }>Search</button>
                <ul className="search-results">{results}</ul>
            </div>);
    }
};
