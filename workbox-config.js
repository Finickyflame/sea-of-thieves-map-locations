module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{png,ico,webp,css,html,js,webmanifest}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/sw.js'
};