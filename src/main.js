import React from 'react';
import ReactDOM from 'react-dom';

const omggif = require('omggif');


class Main extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        const canvas = element.getElementsByClassName('canvas')[0];

        var oReq = new XMLHttpRequest();
        oReq.open("GET", "./examples/cat.gif", true);
        oReq.responseType = "arraybuffer";

        oReq.onload = (oEvent) => {
            var arrayBuffer = oReq.response;
            var byteArray = new Uint8Array(arrayBuffer);
            var gr = new omggif.GifReader(byteArray);

            canvas.width = gr.width * 10;
            canvas.height = gr.height * 10;
            
            const ctx = canvas.getContext('2d');

            const len = gr.numFrames();
            const dx = gr.width / len;
            const imageData = ctx.createImageData(gr.width, gr.height);

            for (let i = 0; i < len; ++i) {
                const fi0 = gr.frameInfo(i);
                console.log(fi0)

                gr.decodeAndBlitFrameRGBA(i, imageData.data);

                ctx.putImageData(imageData,
                    0, 0,
                    dx * i, 0,
                    dx, gr.height)
                    //0, dx * i,
                    //gr.width, dx);
            }
        };
        oReq.send(null);
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