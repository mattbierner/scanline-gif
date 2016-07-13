<div align="center">
    <div><img src="https://raw.githubusercontent.com/mattbierner/scanline-gif/gh-pages/documentation/images/cat.gif" /></div>
    <h1 align="center">scanline.gif</h1>
    <p><i align="center">Slit-scan style gif flattening</i></p>
</div>

scanline.gif is an experiment flattening gifs so that multiple frames of the animation are rendered in a single image. The effect is kind of like [slit-scan photography](https://en.wikipedia.org/wiki/Slit-scan_photography).

A few different preset mode are provided. [Check out the website to load your own gif and try playing around with the rendering settings](site).

* [Site][site]
* [Documentation][documentation]



## Building and Running
The website uses [Jekyll](http://jekyllrb.com/) and [Webpack](http://webpack.github.io/) for building:

```bash
$ git checkout gh-pages
$ npm install
```

Start Jekyll with:

```bash
$ jekyll serve -w
```

Start webpack with:

```bash
$ webpack --watch
```

Main Javascript is stored in `src` and output to `js`.


[site]: https://mattbierner.github.io/scanline-gif/
[documentation]: https://github.com/mattbierner/scanline-gif/blob/gh-pages/documentation/about.md