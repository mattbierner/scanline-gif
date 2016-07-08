const GifEncoder = require('gif-encoder');
import * as scanline_renderer from './scanline_renderer';

/**
 * 
 */
export default (imageData, props) => {
    const gif = new GifEncoder(imageData.width, imageData.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const p = new Promise((resolve) => {
        const parts = [];
        gif.on('data', data => parts.push(data));
        gif.on('end', () => {
            const blob = new Blob(parts, { type: 'image/gif' });
            resolve(blob);
        });
    });

    gif.setRepeat(0); // infinite loop
    gif.writeHeader();

    setTimeout(() => {
        for (let i = 0; i < imageData.frames.length; ++i) {
            scanline_renderer.drawForOptions(canvas, ctx, imageData, Object.assign({ currentFrame: i }, props));
            gif.setDelay(imageData.frames[i].info.delay * 10);
            gif.addFrame(ctx.getImageData(0, 0, imageData.width, imageData.height).data);
        }
        gif.finish();
    }, 0);
    return p;
};