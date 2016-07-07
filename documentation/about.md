# About *scanline.gif*

*[scanline.gif](site)* is an experiment flattening gifs so that multiple frames of animation are rendered in a single image. The effect is kind of like [slit-scan photography](https://en.wikipedia.org/wiki/Slit-scan_photography).

This page overviews the concept, and details how you can customize the rendering.

# Concept
The original idea behind *scanline.gif* was to explore rendering an animated gif as a single (non-animated) image. Basically: wouldn't it be interesting to re-encoding the time aspect of the animation back into a single image?

*scanline.gif* accomplishes this by rendering multiple frames of the original animation at the same time onto a single image. But only a slice of each frame is rendered, so one part of the image may be showing the second frame while another could be showing frame 7. It's easier to show than explain.

Take a 13 frame gif where each frame is a solid color, starting with red at frame 1 and fading to blue at frame 13.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-start.gif)

Now slice the gif into 13 equal width columns. Draw each column of the image individually, but also advance the animation one frame between columns. You end up with a single image that captures every frame of the original animation.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example.png)

These single images can be pretty cool but, for even more fun, you can then replay the animation. Here's what that looks like:

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns.gif)

Besides basic columns, *scanline.gif* provides a few different modes for placing the scanlines. There's also a few other options to play around with. Try mixing settings to produce some interesting effects.


## Basic Settings


### Gif
Gifs come from Giphy. Just enter a search term and select one of the returned gifs.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/search.gif)

### Frame Increment
Number of frames to skip ahead for each scan-line. In the column example, this is the number of frames between two columns.

Frame increment of 2

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns-inc2.gif)

Frame increment of 6.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns-inc6.gif)


### Reverse Frames
Reverses the frame increment so that frames are sampled in backwards order.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns-reverse.gif)


### Mirror Frames
When iterating through the frames, when the last frame is reached, instead of overflowing to 0, reverse increment order and go back to zero.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns-mirror.gif)


## Modes

### Columns
Renders equal width columns, one for each frame of the animation.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-columns.gif)

### Rows
Renders equal height rows, one for each frame of the animation.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-rows.gif)

### Grid
Customizable version of *columns*/*rows*. Renders frames in a grid pattern.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-grid-10x10.gif)

* Columns - Number of columns to divide the image into.
* Rows - Number of rows to divide the image into.


### Diagonal
Renders frames as rotated bars.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-diag.gif)

* Angle - Angle of rotation.
* Step Size - Size of each bar in pixels.


### Rings
Renders frames as rings emanating from the center of the image.

![](https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/rb-example-rings.gif)

* Angle - Angle of rotation.
* Step Size - Size of each ring in pixels.
