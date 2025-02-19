const util = require('../../tests.util');

const url = util.testUrl(__filename);

module.exports = (viewports) => {
  return [
    {
      url, label: 'vertical-tab-index',
      caption: 'Vertical Tab basics',
      viewports: [viewports.desktop, viewports.iphone, viewports.hdtv]
    }
  ];
}