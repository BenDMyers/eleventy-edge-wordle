//import {EdgeFunction} from 'netlify:edge';
import getTodaysSolution from './_solution/solution.js';

///** @type {EdgeFunction} */
export default async (request, context) => {
	let url = new URL(request.url);
	const solution = getTodaysSolution();
	
	// Clean up old guesses
	const [today] = new Date().toISOString().split('T');
	console.log({today, currentDate: context.cookies.get('currentDate')})
	if (context.cookies.get('currentDate') !== today) {
		context.cookies.delete('guesses');

		context.cookies.set({
			name: 'currentDate',
			value: today,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'Lax'
		});
	}
	
	if (request.method === 'POST' && request.headers.get('content-type') === 'application/x-www-form-urlencoded') {
		const body = await request.clone().formData();
		const postData = Object.fromEntries(body);
		
		if (postData.guess) {
			console.log('platypus');
			const guesses = (context.cookies.get('guesses') || '')
				.split('|')
				.filter(x => x.length > 0);

			guesses.push(postData.guess.toLowerCase());
			const newGuessCookie = guesses.join('|');

			context.cookies.set({
				name: 'guesses',
				value: newGuessCookie,
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'Lax'
			});

			if (guesses.includes(solution)) {
				context.cookies.set({
					name: 'state',
					value: 'win',
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: 'Lax'
				});
			} else if (guesses.length >= 6) {
				context.cookies.set({
					name: 'state',
					value: 'loss',
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: 'Lax'
				});
			}
		}

		return new Response(
			null,
			{
				status: 302,
				headers: {
					location: url.pathname
				}
			}
		);
	}
};