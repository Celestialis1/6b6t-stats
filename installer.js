const fs = require('fs');
const { exec } = require('child_process');
const readline = require('readline');

const clearScreen = () => {
  process.stdout.write("\x1b[2J\x1b[0H");
};

const printMessage = (message, color = '\x1b[32m') => {
  const terminalWidth = process.stdout.columns;
  const messageLength = message.length;
  const leftPadding = Math.max(Math.floor((terminalWidth - messageLength) / 2), 0);
  
  const paddedMessage = ' '.repeat(leftPadding) + message;
  console.log(`${color}${paddedMessage}\x1b[0m`);
};

const startSpinner = () => {
  const spinner = ['-', '\\', '|', '/'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\rInstalling ${spinner[i++]}`);
    i = i % spinner.length;
  }, 100);

  return interval;
};

const stopSpinner = (interval) => {
  clearInterval(interval);
  process.stdout.write('\rInstallation Complete! \n');
};

const installDependencies = (callback) => {
  const spinner = startSpinner();
  exec('npm install blessed blessed-contrib', (error, stdout, stderr) => {
    stopSpinner(spinner);
    
    if (error) {
      printMessage(`Error: ${stderr}`, '\x1b[31m');
      callback(false);
      return;
    }
    
    printMessage('Dependencies installed successfully!', '\x1b[32m');
    callback(true);
  });
};

const checkNodeModules = () => {
  return fs.existsSync('node_modules');
};

const runInstaller = () => {
  clearScreen();
  
  printMessage('====================================', '\x1b[36m');
  printMessage('Installing requirements, please wait!', '\x1b[36m');
  printMessage('====================================', '\x1b[36m');
  
  if (checkNodeModules()) {
    printMessage('Node modules already installed. Skipping installation...', '\x1b[33m');
    setTimeout(() => {
      printMessage('Proceeding to main app...', '\x1b[32m');
      require('./main.js');
    }, 2000);
  } else {
    printMessage('No dependencies found. Installing now...', '\x1b[33m');
    installDependencies((success) => {
      if (success) {
        setTimeout(() => {
          printMessage('Proceeding to main app...', '\x1b[32m');
          require('./main.js');
        }, 2000);
      } else {
        printMessage('Installation failed. Please try again.', '\x1b[31m');
      }
    });
  }
};

runInstaller();
