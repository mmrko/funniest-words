#!/usr/bin/env node

/**
  * http://wunderdog.fi/koodaus-hassuimmat-sanat
  * Marko Raatikka // marko.raatikka@gmail.com
  *
  * Parameters:
  *     --file The filename of a text file to search (default: input.txt)
  */

console.time('Processed in');
var fs = require('fs');
var path = require('path');

var VOWELS = [ 'a', 'e', 'i', 'u', 'o', 'y', 'ä', 'ö' ];
var txtFile = process.argv[2] === '--file' && process.argv[3] ? process.argv[3] : 'input.txt';
var expression = [ '[^', VOWELS.join(''), ']' ].join('');
var regex = new RegExp(expression, 'gi');
var selectedWords = []; // Word(s) with the highest score
var processedWords = {}; // Checklist for processed words
var text;

try {
    text = fs.readFileSync(path.join(__dirname, txtFile), { encoding: 'utf8' });
}
catch (e) {
    if (e.code === 'ENOENT') return console.error('No such file:', process.argv[3]);
    console.error(e);
}

var printResult = function (wordObjects) {

    if (!wordObjects) return console.log('Nothing to print.');

    console.log('Word(s) with the highest score', '(' +wordObjects[0].points+ '):');
    wordObjects.forEach(function (wordObject) {
        console.log('>', wordObject.word);
    });
    console.log('Heap used:', require('util').inspect(process.memoryUsage().heapUsed), 'bytes');
    console.timeEnd('Processed in');
};

// Strip all special characters except spaces, dashes & Finnish umlauts
text.replace(/[^\w\s\-åäö]/gi, '')
    // Split the text into an array of words
    .split(/\s+/)
    // Filter out duplicates
    .filter(function (word) {
        return processedWords[word] ? false : processedWords[word] = true;
    })
    // Score each word
    .map(function (word) {

        var numberOfVowels;

        // Strip out dashes & split the vowel sequences into an array
        var vowelGroups = word.replace('-', '').split(regex);

        // Evaluate each sequence of vowels
        var points = vowelGroups.map(function (vowels) {
            if (!vowels) { return 0; }
            numberOfVowels = vowels.length;
            return numberOfVowels * Math.pow(2, numberOfVowels);
        }).reduce(function (a, b) {
            return a + b;
        });

        // Return the original word and its points
        return { word: word, points: points };

    })
    // Sort the words by points (descending)
    .sort(function (a, b) {
        return b.points - a.points;
    })
    // Keeping pushing the word(s) with the most points to selectedWords until a word with less points is reached.
    // Before breaking out of the loop print selectedWords to stdout
    .every(function (word, index, words) {
        return (word.points === words[0].points) ? selectedWords.push(word) : printResult(selectedWords);
    });
