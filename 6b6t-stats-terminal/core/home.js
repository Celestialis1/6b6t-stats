const fs = require('fs');
const blessed = require('blessed');
const opn = require('opn');
const { spawn } = require('child_process');

const openStatsPage = () => {
  const statsProcess = spawn('node', ['./core/stats.js'], { stdio: 'inherit' });

  statsProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error('Error running ./core/stats.js.');
    }
  });
};

const openDiscord = () => {
  opn('https://discord.gg/9PWZjyJfNk'); // JUST FUCKING JOIN THE DISCORD
};

const createHomePage = (screen) => {
  const homePageBox = blessed.box({
    top: 3,
    left: 'center',
    width: '80%',
    height: 12,
    content: `
Welcome to the 6b6t Player Stats Viewer!

Press 1 to view player stats.
Press 2 to visit our official Discord.

Made by Celestialis
`,
    tags: true,
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'cyan' },
      hover: { fg: 'yellow' },
    },
    border: { type: 'line', fg: 'cyan' },
  });

  screen.append(homePageBox);

  const inputBox = blessed.textbox({
    bottom: 3,
    left: 'center',
    width: '30%',
    height: 3,
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'cyan' },
    },
    border: { type: 'line', fg: 'cyan' },
  });

  screen.append(inputBox);

  inputBox.setContent('Select 1 for stats or 2 for Discord:');
  inputBox.focus();
  screen.render();

  inputBox.on('submit', (value) => {
    if (value === '1') {
      homePageBox.setContent('Loading stats... Please wait...');
      screen.render();
      openStatsPage();
      screen.destroy();
    } else if (value === '2') {
      homePageBox.setContent('Opening Discord... Please wait...');
      screen.render();
      openDiscord();
      screen.destroy();
    } else {
      homePageBox.setContent('Invalid selection. Please press 1 or 2.');
      screen.render();
      inputBox.clearValue();
      inputBox.setContent('Select 1 for stats or 2 for Discord:');
    }
  });

  screen.key(['1', '2'], (ch, key) => {
    if (key.name === '1') {
      homePageBox.setContent('Loading stats... Please wait...');
      screen.render();
      openStatsPage();
      screen.destroy();
    } else if (key.name === '2') {
      homePageBox.setContent('Opening Discord... Please wait...');
      screen.render();
      openDiscord();
      screen.destroy();
    }
  });

  // vined_ | 104 — 12/09/2024 3:59 AM
 // how the fuck do i reselect the text box if i deselect it 

  screen.key(['escape'], () => {
    inputBox.focus();
    screen.render();
  });
};

const main = () => {
  const screen = blessed.screen({ smartCSR: true, title: '6b6t Player Stats Viewer' });

  createHomePage(screen);

  screen.key(['q', 'C-c'], () => {
    process.exit(0);
  });

  screen.render();
};

main();
