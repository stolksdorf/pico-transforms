# pico-transforms
A collection of small, but useful Browserify transforms


`npm install pico-transforms`

```js
const browserify = require('browserify');
const yamlify = require('pico-transforms/yamlify');
const svgify = require('pico-transforms/svgify');

const b = browserify('input.jsx')
	.transform(yamlify)
	.transform(svgify);

b.bundle((err, buf)=>{
	fs.writeFileSync('output.js', buff);
});
```


### yamlify

_[inspired by yamlify](https://www.npmjs.com/package/yamlify)_

Allows you to require YAML files when using browserify to have then translated to JSON on the fly.


### svgify

_[inspired by svg-reactify](https://www.npmjs.com/package/svg-reactify)_

Allows you to require SVG files when using browserify to have them translated into React components on the fly.

- Uses functional React components
- Transpiles it using babel
- Optimizes the SVG using [svgo](https://www.npmjs.com/package/svgo)
- Strips out any style tags that would cause react parsing issues (may lose coloring, fixed by exporting SVG with 'inline-styles' selected)
- Can pass `className` and `style` as props
