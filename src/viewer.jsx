import React from 'react';
import ReactDOM from 'react-dom';

const omggif = require('omggif');


/**
 * Get a file as binary data.
 */
const loadBinaryData = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    const p = new Promise((resolve, reject) => {
        xhr.onload = () => {
            if (xhr.status !== 200)
                return reject(`Could not load: ${url}`);
            const arrayBuffer = xhr.response;
            resolve(new Uint8Array(arrayBuffer));
        };
    });
    xhr.send(null);
    return p;
};

/**
 * Load and decode a gif.
 */
const loadGif = (url) =>
    loadBinaryData(url).then(decodeGif);

const decodeGif = byteArray => {
    const gr = new omggif.GifReader(byteArray);
    return {
        width: gr.width,
        height: gr.height,
        frames: extractGifFrameData(gr)
    };
};

const extractGifFrameData = reader => {
    const frames = []
    const {width, height} = reader;

    let previousData = null;
    for (let i = 0, len = reader.numFrames(); i < len; ++i) {
        const info = reader.frameInfo(i);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);

        // Copy previous image data into buffer
        if (previousData) {
            for (let i = 0, len = previousData.data.length; i < len; ++i)
                imageData.data[i] = previousData.data[i];
        }

        reader.decodeAndBlitFrameRGBA(i, imageData.data);
        ctx.putImageData(imageData, 0, 0);
        frames.push({ info, canvas })
        previousData = imageData;
    }
    return frames;
};



/**
 * 
*/
export default class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
        };
    }

    componentDidMount() {
        this.loadGif(this.props.file)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.file && newProps.file.length && newProps.file !== this.props.file) {
            this.loadGif(newProps.file);
        }
    }

    loadGif(file) {
        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('gif-canvas')[0];
        const ctx = canvas.getContext('2d');

        loadGif(file).then(data => {
            this.drawGif(data, canvas, ctx, 10, 10);
        }).catch(e => console.error(e));
    }


    drawGif(imageData, canvas, ctx, tileWidth, tileHeight) {
        if (!imageData)
            return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const len = imageData.frames.length;
        const dy = imageData.height

        let i = 0;
        for (let x = 0; x < imageData.width; x += tileWidth) {
            for (let y = 0; y < imageData.height; y += tileHeight) {
                const frameNumber = i++ % len;
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + tileWidth, y);
                ctx.lineTo(x + tileWidth, y + tileHeight);
                ctx.lineTo(x, y + tileHeight);

                ctx.clip();

                ctx.drawImage(imageData.frames[frameNumber].canvas, 0, 0);

                ctx.restore();
            }
        }
    }

    render() {
        return (
            <div className="gif-viewer">
                <canvas className="gif-canvas" width="0" height="0" />
                <div className="view-controls">

                </div>
            </div>);
    }
};
