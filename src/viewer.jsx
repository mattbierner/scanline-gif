import React from 'react';
import ReactDOM from 'react-dom';

const omggif = require('omggif');


export default class Viewwer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
        };
    }

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('canvas')[0];
        const ctx = canvas.getContext('2d');

        this.loadGif(this.props.file, ctx).then(data => {
            this.drawGif(data, canvas, ctx, 10, 10);
        })
    }

    /**
     * 
     */
    loadBinaryData(url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        const p = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status !== 200)
                    return reject(`Could not load: ${url}`);
                const arrayBuffer = xhr.response;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
        });
        xhr.send(null);
        return p;
    }

    loadGif(fileName) {
        return this.loadBinaryData(fileName).then(byteArray => {
            const gr = new omggif.GifReader(byteArray);
            const {width, height} = gr;
            const len = gr.numFrames();

            const frames = [];
            let previousData = null;
            for (let i = 0; i < len; ++i) {
                const info = gr.frameInfo(i);
                
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                const imageData = ctx.createImageData(width, height);
                if (previousData) {
                    for (let i = 0, len = previousData.data.length; i < len; ++i)
                        imageData.data[i] = previousData.data[i];
                }

                gr.decodeAndBlitFrameRGBA(i, imageData.data);
                ctx.putImageData(imageData, 0, 0);
                frames.push({
                    info: info,
                    data: imageData,
                    canvas: canvas
                });
                previousData = imageData;
            }

            return { width, height, frames };
        });
    }

    drawGif(imageData, canvas, ctx, tileWidth, tileHeight) {
        if (!imageData)
            return;

        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const len =  imageData.frames.length;
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
            <div className="viewer">
                <canvas className="canvas" width="0" height="0" />
            </div>);
    }
};
