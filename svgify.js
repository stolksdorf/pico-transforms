const through = require('through');
const path = require('path');
const _ = require('lodash');
const babel = require('babel-core').transform;
const babelReact = require('babel-preset-react');

const svgo = new (require('svgo'))({
	plugins: [
		{convertStyleToAttrs: true},
		{removeAttrs: {attrs: 'style'}},
		{removeViewBox: false},
		{removeUselessStrokeAndFill: false},
		{removeStyleElement: true}
	]
});
const makeSVG = (data)=>{
	return new Promise((resolve)=>svgo.optimize(data, (svg)=>resolve(svg.data)));
};
const correctAttrs = (svg)=>{
	const ATTR_REGEX = /(class|clip-path|fill-opacity|font-family|font-size|marker-end|marker-mid|marker-start|stop-color|stop-opacity|stroke-width|stroke-linecap|stroke-dasharray|stroke-opacity|text-anchor)=/g;
	return svg.replace(ATTR_REGEX, (line, attr)=>{
		if(attr == 'class') return 'className=';
		return `${_.camelCase(attr)}=`;
	}).replace('<svg ', `<svg className={props.className} style={props.style} `);
};
const jsxTransform = (svg)=>{
	return babel(svg, {presets: [babelReact]}).code;
};
const template = (component)=>{
	return `const React = require('react');
module.exports = (props)=>${component};`
};
module.exports = (filename)=>{
	if (!/\.svg$/.test(filename)) return through();
	let data = '';
	return through((buf)=>data+=buf, function(){
		try{
			makeSVG(data)
				.then((svg)=>correctAttrs(svg))
				.then((svg)=>jsxTransform(svg))
				.then((jsx)=>template(jsx))
				.then((res)=>{
					this.queue(res);
					this.queue(null);
				})
				.catch((err)=>this.emit('error', err));
		}catch(err){
			this.emit('error', err)
		}
	});
};