# About *scanline.gif*

*[scanline.gif](site)* is an experiment flattening gifs so that multiple frames of the animation are rendered in a single image. The effect is kind of like a [scan line](https://en.wikipedia.org/wiki/Scan_line).

This page overviews the concept, and details how you can customize the rendering.

# Concept
The original idea behind: *scanline.gif* was to explore rendering an animated gif as a single (non-animated) image. Basically: I thought it would be interesting to try re-encoding the time aspect of the animation back into a single image.

*scanline.gif* accomplishes this by rendering multiple frames of the original animation at the same time onto a single image. But only a slice of each frame is rendered, so one part of the image may be showing the second frame while another could be showing frame 7. It's easier to show than explain.

Image a 13 frame gif where each frame is a solid color, starting with red at frame 1 and fading to blue at frame 13.

![]

Now slice the gif into 13 columns of equal width. Draw each column of the image individually, but also advance the animation one frame after drawing a column. You end up with a single image that captures every frame of the original animation.

![]

These single images can be pretty cool but, for even more fun, you can then replay the animation. Here's what that looks like:

![]

Besides basic columns, *scanline.gif* provides a few different modes for placing the scanlines. There's also a few other options to play around with. Try mixing settings to produce some interesting effects.


## Basic Settings


### Gif
Gifs come from Giphy. Just enter a search term and select one of the returned gifs.

![]

### Frame Increment
Number of frames to skip ahead for each scan-line. In the column example, this is the number of frames between two columns.

![]

### Reverse Frames
Reverses the frame increment so that frames are sampled in backwards order.

![]

### Mirror Frames
When iterating through the frames, when the last frame is reached, instead of overflowing to 0, reverse increment order.



## Modes


### Columns
Renders equal width columns, one for each frame of the animation.

![]

### Rows
Renders equal height rows, one for each frame of the animation.

![]

### Grid
Customizable version of *columns*/*rows*. Renders frames in a grid pattern.

![]

* Columns - Number of columns to divide the image into.
* Rows - Number of rows to divide the image into.


### Diagonal
Renders frames as rotated bars.

![]

* Angle - Angle of rotation.
* Step Size - Size of each bar in pixels.


### Rings
Renders frames as rings emanating from the center of the image.

![]

* Angle - Angle of rotation.
* Step Size - Size of each ring in pixels.
