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
 * Load and decode a gif.
 */
export default (url) =>
    loadBinaryData(url).then(decodeGif);
