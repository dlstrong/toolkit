const util = require('../../tests.util');

module.exports = (viewports) => {
  return [
    {
      'label': 'fonts-montserrat-alt',
      'url': util.testUrl(__filename),
      'viewports': [viewports.desktop]
    }
  ];
}