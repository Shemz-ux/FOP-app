#!/usr/bin/env node

import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.blue.bold('\n🧪 CRUD API Test Runner\n'));
console.log(chalk.gray('Interactive test mode for your API endpoints\n'));

const testOptions = [
  { key: '1', name: 'Run All Tests', command: 'npm test' },
  { key: '2', name: 'Run User Endpoint Tests', command: 'npm test -- users.test.js' },
  { key: '3', name: 'Run Integration Tests', command: 'npm test -- integration.test.js' },
  { key: '4', name: 'Run Tests with Coverage', command: 'npm test -- --coverage' },
  { key: '5', name: 'Run Tests in Watch Mode', command: 'npm test -- --watch' },
  { key: '6', name: 'Manual API Test (Interactive)', command: 'manual' },
  { key: 'q', name: 'Quit', command: 'quit' }
];

function displayMenu() {
  console.log(chalk.yellow('Select a test option:'));
  testOptions.forEach(option => {
    const color = option.key === 'q' ? 'red' : 'green';
    console.log(chalk[color](`  ${option.key}) ${option.name}`));
  });
  console.log();
}

function runCommand(command) {
  return new Promise((resolve) => {
    console.log(chalk.blue(`\nRunning: ${command}\n`));
    
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, { 
      stdio: 'inherit',
      shell: true 
    });

    child.on('close', (code) => {
      console.log(chalk.gray(`\nProcess exited with code ${code}\n`));
      resolve(code);
    });

    child.on('error', (error) => {
      console.error(chalk.red(`Error: ${error.message}`));
      resolve(1);
    });
  });
}

async function manualTest() {
  console.log(chalk.yellow('\n📋 Manual API Testing Guide\n'));
  
  const endpoints = [
    { method: 'GET', url: 'http://localhost:3000/api/users', desc: 'Get all users' },
    { method: 'POST', url: 'http://localhost:3000/api/users', desc: 'Create new user', 
      body: '{"firstName":"Test","lastName":"User","email":"test@example.com"}' },
    { method: 'GET', url: 'http://localhost:3000/api/users/1', desc: 'Get user by ID' },
    { method: 'PATCH', url: 'http://localhost:3000/api/users/1', desc: 'Update user',
      body: '{"firstName":"Updated"}' },
    { method: 'DELETE', url: 'http://localhost:3000/api/users/1', desc: 'Delete user' }
  ];

  console.log(chalk.green('Available endpoints to test:'));
  endpoints.forEach((endpoint, index) => {
    console.log(chalk.white(`\n${index + 1}. ${endpoint.method} ${endpoint.url}`));
    console.log(chalk.gray(`   ${endpoint.desc}`));
    if (endpoint.body) {
      console.log(chalk.cyan(`   Body: ${endpoint.body}`));
    }
  });

  console.log(chalk.yellow('\nCurl examples:'));
  endpoints.forEach((endpoint, index) => {
    let curlCmd = `curl -X ${endpoint.method} ${endpoint.url}`;
    if (endpoint.body) {
      curlCmd += ` -H "Content-Type: application/json" -d '${endpoint.body}'`;
    }
    console.log(chalk.white(`\n${index + 1}. ${curlCmd}`));
  });

  console.log(chalk.blue('\nPress any key to return to main menu...'));
  await new Promise(resolve => {
    rl.once('line', resolve);
  });
}

async function main() {
  while (true) {
    displayMenu();
    
    const answer = await new Promise(resolve => {
      rl.question(chalk.cyan('Enter your choice: '), resolve);
    });

    const selectedOption = testOptions.find(option => option.key === answer.toLowerCase());

    if (!selectedOption) {
      console.log(chalk.red('Invalid option. Please try again.\n'));
      continue;
    }

    if (selectedOption.command === 'quit') {
      console.log(chalk.green('Goodbye! 👋\n'));
      break;
    }

    if (selectedOption.command === 'manual') {
      await manualTest();
      continue;
    }

    await runCommand(selectedOption.command);
    
    console.log(chalk.blue('Press Enter to continue...'));
    await new Promise(resolve => {
      rl.once('line', resolve);
    });
  }

  rl.close();
}

main().catch(console.error);
