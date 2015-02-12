Search for the funniest words in a text file. Prints the funniest words and their points to stdout.

The funniness of a word is given by `∑( n × 2^n )`, where `n` is the length of a sequence of vowels in a word. For example, the word `foobar` would be worth 10 funny points: `2 * 2^2 + 1 * 2^1 = 10`.

The input file filepath can be customised with the `--file` parameter (defaults to `input.txt`).

Usage:

```bash
./funnyWords.js --file my_file.txt
```
