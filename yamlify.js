const through = require('through');
const yaml = require('js-yaml');

module.exports = (filename)=>{
	if (!/\.ya?ml$/.test(filename)) return through();
	let data = '';
	return through((buf)=>data+=buf, function(){
		try{
			const json = JSON.stringify(yaml.safeLoad(data, {filename}));
			this.queue(`module.exports=${json};`);
			this.queue(null);
		}catch(err){
			this.emit('error', err)
		}
	});
};