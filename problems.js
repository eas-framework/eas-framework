import madge from 'madge';

madge('dist/index.js').then((res) => {
	console.log(res.circular());
});