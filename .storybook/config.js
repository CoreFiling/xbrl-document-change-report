import { configure } from '@storybook/react';

const req = require.context('../src', true, /\.stories\.(js|jsx|ts|tsx)$/);

function loadStories() {
  require('../src/stories');
  req.keys().forEach(req);
}

configure(loadStories, module);
