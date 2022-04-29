// import {EdgeFunction} from 'netlify:edge';

///** @type {EdgeFunction} */
export default async (request, context) => {
	let url = new URL(request.url);
	console.log('giraffe')

	if (url.pathname === '/' && request.method === 'POST') {
		console.log('zebra');
		if (request.headers.get('content-type') === 'application/x-www-form-urlencoded') {
			console.log('quagga');
			const body = await request.clone().formData();
			const postData = Object.fromEntries(body);

			
			if (postData.guess) {
				console.log('platypus');
				const guesses = (context.cookies.get('guesses') || '')
					.split('|')
					.filter(x => x.length > 0);
					
				guesses.push(postData.guess);
				const newGuessCookie = guesses.join('|');
				console.log(newGuessCookie)

				context.cookies.set({
					name: 'guesses',
					value: newGuessCookie,
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: 'Lax'
				});
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
	}
};