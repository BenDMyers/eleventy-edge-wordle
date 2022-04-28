/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig)) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {
	return {
		dir: {
			input: 'src'
		}
	};
};