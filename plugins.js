// ADD this to your plugins.js file in gekko root.
// DO NOT OVER WRITE YOUR plugins.js with this file - that would break gekko :)

var plugins = [{
      {
        name: 'Google Forms',
        description: 'Logs Trades to Google Forms',
        slug: 'gforms',
        async: false,
        modes: ['realtime'],
        dependencies: [{
          module: 'request',
          version: '2.85.0'
        }]
      },