/**
 * http://wunderdog.fi/koodaus-hassuimmat-sanat
 *
 * Marko Raatikka // marko.raatikka@gmail.com
 *
 * Parameters:
 *     --file The filename of a text file to search (default: input.txt)
 */

console.time('start');
var fs = require('fs');
var path = require('path');

var VOWELS = [ 'a', 'e', 'i', 'u', 'o', 'y', 'ä', 'ö' ];
var txtFile = process.argv[2] === 'file' && process.argv[3] ? process.argv[3] : 'input.txt';
var text = fs.readFileSync(path.join(__dirname, txtFile), { encoding: 'utf8' });
var expression = [ '[^', VOWELS.join(''), ']' ].join('');
var regex = new RegExp(expression, 'gi');
var selectedWords = []; // Word(s) with the highest score
var processedWords = {}; // Checklist for processed words

var printResult = function (wordObjects) {
    var highestScore = wordObjects.length ? wordObjects[0].points : 0;
    console.log('Word(s) with the highest score', '(' +highestScore+ '):');
    wordObjects.forEach(function (wordObject) {
        console.log('>', wordObject.word.replace(/[^åäö\-\w]/gi, ''));
    });
    console.log(require('util').inspect(process.memoryUsage()));
    console.timeEnd('start');
};

// Split text into an array of words
text.split(/\s/)
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
    // Starting from the word with the most points return & print out the results when a word with less points is reached
    .every(function (word, index, words) {
        return (word.points === words[0].points) ? selectedWords.push(word) : printResult(selectedWords);
    });
