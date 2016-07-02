
<div align="center">
    <img src="https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/the king.jpg" />
    <p><i>Na Naa, Na Na Na Na Naa Naa Naa Na</i> visualizes controller for games of <i>Katamari Damacy</i>.</p>
</div>


### What the Hell am I Looking At?
The visualization uses Playstation 2 Joystick input to sketch out a 3D path, trying to approximate the movement style of the titular Katamaris from *Katamari Damacy*. Think etch-a-sketch, but on a sphere instead of a plane.

Press both joysticks forward, and the drawing cursor moves forward on the sphere. Press both backwards, and the cursor moves backwards.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/forward.gif)

Press a single joystick forward to rotate the cursor (pressing one joystick forward and one backwards rotates faster.)

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/rotate.gif)

Pressing both joysticks in a single direction unequality (such as the left joy stick fully forward and the right one only partially pressed forward) steers the cursor as it moves.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/translate.gif)

Besides basic movement, the sphere the cursor is drawing on slows expands outwards over time. The path may start on a 1m sphere, which expands to an 10m sphere by the end of the game. This expansion helps visualize time and adds interesting inner details to the spheres. You can disabled this expansion using the options.

This visualization only considers input, not game context. The Katamaris in game have momentum and are effected by the game world, which is ignored here.


### Playback
![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/playback.gif)

Use the controls at the bottom of the screen to control drawing playback. Scrub through the timeline to go to see the visualization at different stages of completion. Skip to the end of the game to view the complete path.

The playback speed control lets you speed up or slow down drawing speed. 1x is realtime, while 8x is 8 times faster than realtime.


### Options
Click the settings button in the top right corner to configure the visualization.

##### Movement Damping
Scale translation movements. Less damning means the cursor moves further with each step of drawing, while more damping makes the cursor move less at each step.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/damping.gif)

##### Edge Thickness
How thick (as a percentage of the sphere radius) are the lines of the path?

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/thickness.gif)

##### Opacity
Total opacity of the paths. Useful for complex spheres with lots of overlap or internal detail. Try playing around with *opacity*, *edge thickness*, and *inner radius* to get some interesting results

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/opacity.gif)

##### Inner Radius
Controls the starting size of the sphere for drawing relative to the end size. Set to 100% to draw all paths on the same sphere.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/inner-radius.gif)


### Data Samples
The sample games were collected playing *We Love Katamari* from physical Playstation 2 console. I tried to sample a few differnt types of levels, both in terms of objective (such as quickness or size) and play variation.


----

If you have a question or run into a bug, please open an issue. 