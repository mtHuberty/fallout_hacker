const fs = require('fs');
const prompt = require('prompt');
const colors = require('colors/safe');
const wordfile = fs.readFileSync("enable1.txt", "utf8");
const wordArray = wordfile.split("\n");

async function main() {
    prompt.start();

    // Get user difficulty and set variables for word length and number of words based on that input
    const userDifficulty = await getDifficulty();
    const difficulty = parseInt(userDifficulty.difficulty.toString().split('')[0]);
    if (difficulty > 5) {
        difficulty = 5;
    }
    const wordLength = difficulty + 5;
    const wordCount = difficulty * 3 + 5;

    // Filter through enable1.txt to get only the words that match our desired word length based on difficulty
    const possibleWordArray = wordArray.filter(word => {
        return word.length == wordLength;
    })

    // Loop through the array from above and put random words into a set, don't stop until set matches desired number of words
    // Using a set ensures we don't get duplicate words (though highly unlikely anyway)
    const chosenWordSet = new Set();
    let loopProtection = 0;
    while (chosenWordSet.size < wordCount && loopProtection < 100) {
        chosenWordSet.add(possibleWordArray[Math.floor(Math.random() * possibleWordArray.length)]);
        loopProtection++;
    }
    if (loopProtection >= 100) {
        console.log("I couldn't find enough words in my word list to meet your difficulty.");
        process.exit(1);
    }

    // Choose a winning word from our set and set the guess count to 0
    // PS: Sets aren't good data structures to get random items from since they are ordered and their length is known.
    //     Best to create an array from the set first.
    const winningWord = Array.from(chosenWordSet)[Math.floor(Math.random() * chosenWordSet.size)];
    let guessesLeft = 4;
    let guess = "";
    loopProtection = 0;

    // Here we wait for input, count correct letters, check to see that it's a valid guess from the set, and subtract a guess if so
    // If the input value doesn't match a word in the set, we don't subtract a guess
    while (guess != winningWord && loopProtection < 100) {
        //console.log(`(The winning word is ${winningWord})`); // <--- Uncomment this line to cheat
        guess = await getGuess(guessesLeft, chosenWordSet, winningWord);
        let correctCharacters = correctCharacterCounter(guess, winningWord);
        if(chosenWordSet.has(guess)) {
            console.log(`(${correctCharacters} out of ${winningWord.length})`);
            guessesLeft--;
        } else {
            console.log("That word isn't an option.")
        }
    }
    if (loopProtection >= 100) {
        console.log("Infiniloop. /shrug");
        process.exit(1);
    }
    if (guess == winningWord) {
        console.log(colors.rainbow("YOU WIN!!!"));
        process.exit(0);
    }
}

// Gets user input on difficulty, attempts a bit of validation. Returns a promise.
function getDifficulty() {
    const properties = [
        {
            name: 'difficulty',
            description: colors.cyan('Enter a difficulty (1-5)'),
            type: 'integer',
            pattern: /[1-5]/,
            message: 'You must enter a number between 1 and 5',
            hidden: false,
            required: true 
          }
    ];
    return new Promise((resolve, reject) => {
        prompt.get(properties, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}

// Gets user input for guesses. Also handles game lose state. Returns a promise.
function getGuess(guessesLeft, chosenWordSet, winningWord) {
    if (guessesLeft == 0) {
        console.log(`Game Over. The correct word was ${colors.underline(winningWord)}`);
        process.exit(1);
    }
    chosenWordSet.forEach((word) => {
        console.log(colors.green(word));
    })
    const properties = [
        {
            name: 'guess',
            description: colors.yellow(`Guess (${guessesLeft} remaining)`),
            type: 'string',
            pattern: /[a-zA-Z]+/,
            message: "That doesn't look like a word, try again",
            hidden: false,
            required: true
          }
    ];
    return new Promise((resolve, reject) => {
        prompt.get(properties, (err, res) => {
            if (err) reject(err);
            resolve(res.guess);
        })
    })
}

function correctCharacterCounter(guess, winningWord) {
    const guessArray = guess.toString().split('');
    const winningWordArray = winningWord.toString().split('');
    let correctCharCounter = 0;

    winningWordArray.forEach((letter, ind) => {
        if (letter == guessArray[ind]) {
            correctCharCounter++;
        }
    })
    return correctCharCounter;
}

main();