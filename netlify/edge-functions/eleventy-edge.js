import {EleventyEdge} from 'eleventy:edge';
import precompiledAppData from './_generated/eleventy-edge-app-data.js';
import formatGuessesAsTable from '../../src/_11ty/table.js';
import getTodaysSolution from './_solution/solution.js';

export default async (request, context) => {
	try {
		let edge = new EleventyEdge('edge', {
			request,
			context,
			precompiled: precompiledAppData,

			// default is [], add more keys to opt-in e.g. ['appearance', 'username']
			cookies: ['guesses', 'solution', 'currentDate', 'state'],
		});

		const solution = getTodaysSolution();
		context.cookies.set({
			name: 'solution',
			value: solution,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'Lax'
		});

		edge.config((eleventyConfig) => {
			eleventyConfig.addFilter('table', formatGuessesAsTable);
		});

		return await edge.handleResponse();
	} catch (e) {
		console.log('ERROR', {e});
		return context.next(e);
	}
};
