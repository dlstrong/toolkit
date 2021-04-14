const util = require('../tests.util');

module.exports = (viewports) => {
  return [
    {
      'label': 'colors',
      'url': util.testUrl(__filename),
      'viewports': [viewports.desktop]
    }
  ];
}