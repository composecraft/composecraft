#!/usr/bin/env node

/**
 * Simple script to read input from terminal
 * Usage: node read-input.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Terminal Input Reader');
console.log('Type your input and press Enter (type "exit" to quit)\n');

const askQuestion = () => {
  rl.question('> ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }
    
    // Echo the input back
    console.log(`You entered: ${input}`);
    
    // Continue asking for input
    askQuestion();
  });
};

// Start the input loop
askQuestion();
