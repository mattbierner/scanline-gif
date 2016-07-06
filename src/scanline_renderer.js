/**
 * Get a given frame from a gif.
 * 
 * Handles looping indices and negative indices.
 */
const getFrame = (imageData, index) => {
    const len = imageData.frames.length;
    index %= len;
    return imageData.frames[index < 0 ? len - 1 - Math.abs(index) : index];
};

/**
 * Prepare a canvas for rendering a gif.
 */
const prepCanvas = (canvas, ctx, imageData) =>  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
};

/**
 * 
 */
export const drawDiag = (canvas, ctx, imageData, gridColumns, angle, initialFrame, increment) => {
    const radAngle = angle * (Math.PI / 180);
    const {width, height} = imageData;
    const diag = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    prepCanvas(canvas, ctx, imageData);

    for (let i = 0, numDraws = Math.ceil((diag / gridColumns) / 2); i <= numDraws; ++i) {
        const frame1 = getFrame(imageData, initialFrame + i * increment);
        const frame2 = getFrame(imageData, initialFrame - ((i + 1) * increment));

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

            ctx.drawImage(frame1.canvas, 0, 0);
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

            ctx.drawImage(frame2.canvas, 0, 0);
        }
        ctx.restore();
    }
};

/**
 * 
 */
export const drawGrid = (canvas, ctx, imageData, columnWidth, columnHeight, initialFrame, increment) =>  {
    prepCanvas(canvas, ctx, imageData);

    let i = initialFrame;
    for (let x = 0; x < imageData.width; x += columnWidth) {
        for (let y = 0; y < imageData.height; y += columnHeight) {
            const frame = getFrame(imageData, i);
            ctx.save();

            // Create clipping rect.
            ctx.beginPath();
            ctx.rect(x, y, columnWidth, columnHeight)
            ctx.clip();

            // Draw gif with clipping applied
            ctx.drawImage(frame.canvas, 0, 0);

            ctx.restore();

            i += increment;
        }
    }
};

/**
 * 
 */
export const drawCircle = (canvas, ctx, imageData, radiusStep, initialFrame, increment) => {
    const {width, height} = imageData;
    prepCanvas(canvas, ctx, imageData);

    let i = initialFrame;
    for (let r = 0, len = Math.max(width, height); r < len; r += radiusStep) {
        const frame = getFrame(imageData, i);
        ctx.save();

        // Create clipping rect.
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r + radiusStep, 0, Math.PI * 2, false);
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2, true);
        ctx.clip()

        // Draw gif with clipping applied
        ctx.drawImage(frame.canvas, 0, 0);

        ctx.restore();

        i += increment;
    }
};