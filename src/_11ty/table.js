const EMPTY_ROW = '<tr><td></td><td></td><td></td><td></td><td></td></tr>';

const CORRECT = 'correct';
const OUT_OF_PLACE = 'out-of-place';
const WRONG = 'wrong';

/**
 * Determines which letters in a given guess are correct, which ones are out of place, and which ones are invalid
 * @param {string} solution the target word the player is trying to guess
 * @param {string} guess five-letter guess (presumes the guess has already been through other formatting validations like length and valid characters)
 * @returns {{letter: string, state: CORRECT | OUT_OF_PLACE | WRONG}[]}
 */
function validateWordleGuess(solution, guess) {
	/**
	 * @type {{letter: string, state: CORRECT | OUT_OF_PLACE | WRONG}[]}
	 */
	const guessedLetters = guess
		.split('')
		.map(letter => ({letter, state: WRONG}));

	/**
	 * @type {{letter: string, includedInGuess: boolean}[]}
	 */
	const solutionLetters = solution
		.split('')
		.map(letter => ({letter, includedInGuess: false}));

	// First pass: correct letters in the correct place
	for (let i = 0; i < guessedLetters.length; i++) {
		if (guessedLetters[i].letter === solutionLetters[i].letter) {
			guessedLetters[i].state = CORRECT;
			solutionLetters[i].includedInGuess = true;
		}
	}

	// Second pass: correct letters in the wrong places
	for (let i = 0; i < guessedLetters.length; i++) {
		if (guessedLetters[i].state === CORRECT) {
			continue;
		}

		const letterFoundElsewhere = solutionLetters
			.find((solutionLetter) => {
				const matchesLetter = solutionLetter.letter === guessedLetters[i].letter;
				return matchesLetter && !solutionLetter.includedInGuess;
			});

		if (letterFoundElsewhere) {
			guessedLetters[i].state = OUT_OF_PLACE;
			letterFoundElsewhere.includedInGuess = true;
		}
	}

	return guessedLetters;
}

/**
 * 
 * @param {string} guessCookie pipe-delimited list of guesses
 * @returns {string} table HTML
 */
export default function formatGuessesAsTable(guessCookie = '', solution = '') {
	const guesses = guessCookie.split('|');
	const rows = guesses.map((guess, index) => {
		const validation = validateWordleGuess(solution, guess);
		const cells = validation.map(({letter, state}) => `<td data-status="${state}" aria-describedby="${state}-desc">${letter}</td>`);
		const isLast = index === guesses.length - 1;
		const row = `<tr data-row-status="guessed ${isLast ? 'last' : ''}" aria-label="Guess ${index + 1}: ${guess}">${cells.join('')}</tr>`;
		return row;
	});

	while (rows.length < 6) {
		rows.push(EMPTY_ROW);
	}

	return `
		<table>
			<caption class="visually-hidden">Guesses</caption>
			<tbody>
				${rows.join('')}
			</tbody>
		</table>
	`;
}

const KEY_ORDER = [
	['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
	['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
	['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export function formatUsedKeys(guessCookie = '', solution = '') {
	const validatedLetters = guessCookie
		.split('|')
		.map(guess => validateWordleGuess(solution, guess))
		.flat();

	const keyboardRows = KEY_ORDER.map(keyboardRow => {
		const keys = keyboardRow.map(key => {
			let letterStatus = 'unguessed';
			if (validatedLetters.find(valid => (valid.letter === key && valid.state === 'correct'))) {
				letterStatus = 'correct';
			} else if (validatedLetters.find(valid => (valid.letter === key && valid.state === 'out-of-place'))) {
				letterStatus = 'out-of-place';
			} else if (validatedLetters.find(valid => (valid.letter === key && valid.state === 'wrong'))) {
				letterStatus = 'wrong';
			}

			return `<td data-status="${letterStatus}" aria-describedby="${letterStatus}-desc">${key}</td>`;
		});
		return `<tr>${keys.join('')}</tr>`;
	});

	return `
		<table class="keyboard">
			<caption class="visually-hidden">Used Keys</caption>
			<tbody>
				${keyboardRows.join('')}
			</tbody>
		</table>
	`;
}