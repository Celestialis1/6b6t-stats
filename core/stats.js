const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const { exec } = require('child_process');

const createHeader = (screen) => {
  const header = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: '{bold}{cyan-fg}6b6t Player Stats{/cyan-fg}{/bold}',
    tags: true,
    style: {
      fg: 'cyan',
      bg: 'black',
      bold: true,
    },
    border: { type: 'line', fg: 'cyan' },
  });
  screen.append(header);
};

const createStatusBar = (screen) => {
  const statusBar = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 1,
    content: '',
    style: {
      fg: 'white',
      bg: 'blue',
    },
  });
  screen.append(statusBar);
  return statusBar;
};

const createErrorBox = (screen) => {
  const errorBox = blessed.box({
    top: 0,
    right: 0,
    width: '30%',
    height: 5,
    content: '',
    border: { type: 'line' },
    style: {
      fg: 'red',
      bg: 'black',
    },
    hidden: true,
  });
  screen.append(errorBox);
  return errorBox;
};

const showError = (errorBox, message) => {
  errorBox.setContent(`ERROR: ${message}`);
  errorBox.show();
  setTimeout(() => errorBox.hide(), 5000);
};

const fetchStats = async (username, statusBar, table, errorBox) => {
  const url = `https://www.6b6t.org/en/stats/${username}`;
  let stats = {};

  statusBar.setContent('Fetching stats... Please wait.');
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('tr').each((_, element) => {
      const statName = $(element).find('p.my-auto').text().trim();
      const statValues = $(element).find('td').map((i, td) => $(td).text().trim()).get();
      if (statName && statValues.length >= 3) {
        const cleanedStatValues = statValues.slice(1);
        stats[statName] = {
          sevenDays: cleanedStatValues[0] || 'N/A',
          thirtyDays: cleanedStatValues[1] || 'N/A',
          total: cleanedStatValues[2] || 'N/A',
        };
      }
    });

    const tableData = Object.entries(stats).map(([key, value]) => [
      key,
      value.sevenDays || 'N/A',
      value.thirtyDays || 'N/A',
      value.total || 'N/A',
    ]);

    table.setData({
      headers: ['Stat', '7 Days', '30 Days', 'Total'],
      data: tableData,
    });

    statusBar.setContent('Stats successfully loaded!');
  } catch (error) {
    statusBar.setContent('Failed to fetch stats. Check error log.');
    showError(errorBox, error.message || 'Unknown error');
  }
};

const main = async () => {
  const screen = blessed.screen({ smartCSR: true, title: '6b6t Stats Viewer' });

  createHeader(screen);
  const statusBar = createStatusBar(screen);
  const errorBox = createErrorBox(screen);

  const inputBox = blessed.textbox({
    bottom: 3,
    left: 'center',
    width: '60%',
    height: 3,
    border: { type: 'line' },
    label: ' Enter Username ',
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'cyan' },
      focus: { fg: 'white', bg: 'cyan' },
    },
    inputOnFocus: true,
  });

  const table = contrib.table({
    top: 3,
    left: 'center',
    width: '100%',
    height: '70%',
    border: { type: 'line' },
    columnSpacing: 2,
    columnWidth: [20, 10, 10, 10],
    style: {
      border: { fg: 'cyan' },
      header: { fg: 'cyan', bold: true },
      cell: { fg: 'white' },
    },
  });

  screen.append(inputBox);
  screen.append(table);
  inputBox.focus();
  screen.render();

  inputBox.on('submit', async (username) => {
    if (!username.trim()) {
      showError(errorBox, 'Username cannot be empty.');
      return;
    }
    inputBox.clearValue();
    screen.render();
    await fetchStats(username, statusBar, table, errorBox);
    inputBox.focus();
  });

  screen.on('keypress', (ch, key) => {
    if (key.name === 'escape' || key.name === 'tab') {
      inputBox.focus();
    }
  });

  screen.key(['q', 'C-c'], () => process.exit(0));
};

main();
