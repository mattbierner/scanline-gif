const chroma = require('chroma-js');

const START_COLOR = 'red';
const END_COLOR = 'blue';


/**
 * Get a given frame from a gif.
 * 
 * Handles looping indices and negative indices.
 * 
 * @param imageData Data with frames.
 * @param index Input frame.
 * @param bounce Instead of overflowing, reverse so that the counter bounces between [0, len).
 */
const getFrame = (imageData, index, bounce) => {
    const len = imageData.frames.length;
    if (bounce) {
        index %= len * 2;
        if (index < 0)
            index = len * 2 - 1 - Math.abs(index);
        if (index >= len)
            index = len - 1 - (index - len);
    } else {
        index %= len;
        if (index < 0)
            index = len - 1 - Math.abs(index);
    }
    return index;
};

/**
 * Prepare a canvas for rendering a gif.
 */
const prepCanvas = (canvas, ctx, imageData) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
};

const drawFrame = (ctx, imageData, frame, debug = false) => {
    if (debug) {
        ctx.fillStyle = chroma.mix(START_COLOR, END_COLOR, frame / imageData.frames.length, 'rgb').css();
        ctx.beginPath();
        ctx.rect(0, 0, imageData.width, imageData.height);
        ctx.fill();
    } else {
        ctx.drawImage(imageData.frames[frame].canvas, 0, 0);
    }
};

/**
 * Render gif using diagonal scanlines
 */
export const drawDiag = (canvas, ctx, imageData, initialFrame, increment, bounce, gridColumns, angle, debug = false) => {
    const radAngle = angle * (Math.PI / 180);
    const {width, height} = imageData;
    const diag = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    prepCanvas(canvas, ctx, imageData);

    for (let i = 0, numDraws = Math.ceil((diag / gridColumns) / 2); i <= numDraws; ++i) {
        const frame1 = getFrame(imageData, initialFrame + i * increment, bounce);
        const frame2 = getFrame(imageData, initialFrame - ((i + 1) * increment), bounce);

        // draw first
        ctx.save();
        {
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(radAngle);
            ctx.translate(-width / 2, -height / 2);
            ctx.beginPath();
            ctx.rect(-diag, height / 2 + (i * gridColumns), diag * 2, gridColumns);
            ctx.restore();

            ctx.clip();
            drawFrame(ctx, imageData, frame1, debug);
        }
        ctx.restore();

        // draw second
        ctx.save();
        {
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(radAngle);
            ctx.translate(-width / 2, -height / 2);
            ctx.beginPath();
            ctx.rect(-diag, height / 2 - (i * gridColumns), diag * 2, gridColumns);
            ctx.restore();
            ctx.clip();

            drawFrame(ctx, imageData, frame2, debug);
        }
        ctx.restore();
    }
};

/**
 * Render gif using a grid.
 */
export const drawGrid = (canvas, ctx, imageData, initialFrame, increment, bounce, columnWidth, columnHeight, debug = false) => {
    const {width, height} = imageData;
    prepCanvas(canvas, ctx, imageData);

    let i = initialFrame;
    for (let x = 0; x < width; x += columnWidth) {
        for (let y = 0; y < height; y += columnHeight) {
            const frame = getFrame(imageData, i, bounce);
            ctx.save();

            // Create clipping rect.
            ctx.beginPath();
            ctx.rect(x, y, columnWidth, columnHeight)
            ctx.clip();

            drawFrame(ctx, imageData, frame, debug);

            ctx.restore();

            i += increment;
        }
    }
};

/**
 * Render gif using circles.
 */
export const drawCircle = (canvas, ctx, imageData, initialFrame, increment, bounce, radiusStep, debug = false) => {
    const {width, height} = imageData;
    prepCanvas(canvas, ctx, imageData);

    let i = initialFrame;
    for (let r = 0, len = Math.max(width, height); r < len; r += radiusStep) {
        const frame = getFrame(imageData, i, bounce);
        ctx.save();

        // Create clipping circle.
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r + radiusStep, 0, Math.PI * 2, false);
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2, true);
        ctx.clip()

        drawFrame(ctx, imageData, frame, debug);

        ctx.restore();

        i += increment;
    }
};

/**
 * Draw a scanlined gif for a set of options
 */
export const drawForOptions = (canvas, ctx, imageData, state) => {
    const increment = state.reverseFrameOrder ? -state.frameIncrement : state.frameIncrement;
    const frame = state.initialFrame + state.currentFrame;

    switch (state.mode) {
        case 'columns':
            return drawGrid(
                canvas,
                ctx,
                imageData,
                frame,
                increment,
                state.bounceFrameOrder,
                imageData.width / imageData.frames.length,
                imageData.height);

        case 'rows':
        default:
            return drawGrid(
                canvas,
                ctx,
                imageData,
                frame,
                increment,
                state.bounceFrameOrder,
                imageData.width,
                imageData.height / imageData.frames.length);

        case 'grid':
            return drawGrid(
                canvas,
                ctx,
                imageData,
                frame,
                increment,
                state.bounceFrameOrder,
                imageData.width / state.gridColumns,
                imageData.height / state.gridRows);

        case 'diagonal':
            return drawDiag(
                canvas,
                ctx,
                imageData,
                frame,
                increment,
                state.bounceFrameOrder,
                state.diagonalWidth,
                state.diagonalAngle);

        case 'circle':
            return drawCircle(
                canvas,
                ctx,
                imageData,
                frame,
                increment,
                state.bounceFrameOrder,
                state.radiusWidth);
    }
};