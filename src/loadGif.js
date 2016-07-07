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
 * Extract metadata and frames from binary gif data.
 */
const decodeGif = byteArray => {
    const gr = new omggif.GifReader(byteArray);
    return {
        width: gr.width,
        height: gr.height,
        frames: extractGifFrameData(gr)
    };
};

/**
 * Handle IE not supporting new ImageData()
 */
const createImageData = (() => {
    try {
        new ImageData(1, 1);
        return (width, height) => new ImageData(width, height);
    }  catch (e) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        return (width, height) => ctx.createImageData(width, height);
    }
})();

/**
 * Extract each frame of metadata / frame data (as a canvas) from a gif.
 */
const extractGifFrameData = reader => {
    const frames = []
    const {width, height} = reader;

    const imageData = createImageData(width, height);
    for (let i = 0, len = reader.numFrames(); i < len; ++i) {
        const info = reader.frameInfo(i);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        reader.decodeAndBlitFrameRGBA(i, imageData.data);
        ctx.putImageData(imageData, 0, 0);
        frames.push({ info, canvas })
    }
    return frames;
};

/**
 * Load and decode a gif.
 */
export default (url) =>
    loadBinaryData(url).then(decodeGif);
