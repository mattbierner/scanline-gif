import React from 'react';
import ReactDOM from 'react-dom';

const omggif = require('omggif');


class Main extends React.Component {
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

        this.loadGif('./examples/cat.gif', ctx).then(data => {
            this.drawGif(data, canvas, ctx);
        })
    }

    /**
     * 
     */
    loadBinaryData(url) {
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";

        const p = new Promise((resolve, reject) => {
            req.onload = (oEvent) => {
                const arrayBuffer = req.response;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
        });
        req.send(null);
        return p;
    }

    loadGif(fileName, ctx) {
        return this.loadBinaryData(fileName).then(byteArray => {
            const gr = new omggif.GifReader(byteArray);
            const {width, height} = gr;
            const len = gr.numFrames();

            const frames = [];
            let previousData = null;
            for (let i = 0; i < len; ++i) {
                const info = gr.frameInfo(i);
                const imageData = ctx.createImageData(width, height);
                if (previousData) {
                    for (let i = 0, len = previousData.length; i < len; ++i)
                        imageData[i] = previousData[i];
                }

                gr.decodeAndBlitFrameRGBA(i, imageData.data);
                frames.push({
                    info: info,
                    data: imageData
                });
                previousData = imageData;
            }

            return {
                width: width,
                height: height,
                frames: frames
            };
        });
    }

    drawGif(imageData, canvas, ctx) {
        if (!imageData)
            return;

        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const len =  imageData.frames.length;
        const dx = imageData.width / len;
        for (let i = 0; i  < len; ++i) {
            ctx.putImageData(imageData.frames[i].data,
                0, 0,
                dx * i, 0,
                dx, imageData.height)
            //0, dx * i,
            //imageData.width, dx);
        }
    }

    render() {
        return (
            <div className="main container">
                <canvas className="canvas" width="500" height="500" />
            </div>);
    }
};


ReactDOM.render(
    <Main />,
    document.getElementById('content'));