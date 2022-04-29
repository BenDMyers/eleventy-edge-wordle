//import {EdgeFunction} from 'netlify:edge';
import {EleventyEdge} from 'eleventy:edge';
import precompiledAppData from './_generated/eleventy-edge-app-data.js';
import formatGuessesAsTable from '../../src/_11ty/table.js';

// /** @type {EdgeFunction} */
export default async (request, context) => {
	// Clean up old guesses
	const [today] = new Date().toISOString().split('T');
	if (context.cookies.get('currentDate') !== today) {
		context.cookies.delete('guesses');
		context.cookies.set('currentDate', today);
	}

	try {
		let edge = new EleventyEdge('edge', {
			request,
			context,
			precompiled: precompiledAppData,

			// default is [], add more keys to opt-in e.g. ['appearance', 'username']
			cookies: ['guesses'],
		});

		edge.config((eleventyConfig) => {
			// Add some custom Edge-specific configuration
			// e.g. Fancier json output
			// eleventyConfig.addFilter('json', obj => JSON.stringify(obj, null, 2));
			eleventyConfig.addFilter('table', formatGuessesAsTable)
		});

		return await edge.handleResponse();
	} catch (e) {
		console.log('ERROR', {e});
		return context.next(e);
	}
};
