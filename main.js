const fs = require('fs');
const blessed = require('blessed');
const { spawn } = require('child_process');

const checkStartup = () => {
  return fs.existsSync('startup.disabled');
};

const createIntroScreen = (screen) => {
  const introBox = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '80%',
    content: `
Welcome to the 6b6t Player Stats Viewer!

This application allows you to:
- View detailed stats of players on the 6b6t server.
- Track activities like combat, building, and movement.
- Access semi-real-time player data and insights.

Key Features:
- Track player activities for the last 7 days, 30 days, or overall.
- Lightweight and fast performance.
- Easy-to-navigate user interface.

Credits:
- Created by Celestialis
- Official Discord: https://discord.gg/9PWZjyJfNk

Todo:
- add auto stats reload
- add live ingame chat
- add custom bot to settings
- add auto updates (we are far away from this ever happening)

Press any key to proceed to the main menu.
`,
    tags: true,
    border: {
      type: 'line',
      fg: 'cyan',
    },
    style: {
      fg: 'white',
      bg: 'black',
    },
  });

  screen.append(introBox);
  screen.render();

  screen.onceKey(['escape', 'enter', 'space'], () => {

    const homeProcess = spawn('node', ['./core/home.js'], { stdio: 'inherit' });

    homeProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error('Error running ./core/home.js.');
      }
    });

    screen.destroy();
  });

  screen.key(['q', 'C-c'], () => {
    process.exit(0);
  });
};

const main = () => {
  if (checkStartup()) {
    const homeProcess = spawn('node', ['./core/home.js'], { stdio: 'inherit' });

    homeProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error('Error running home.js.');
      }
    });
    return;
  }

  const screen = blessed.screen({
    smartCSR: true,
    title: '6b6t Player Stats Viewer',
  });

  createIntroScreen(screen);
};

main();
