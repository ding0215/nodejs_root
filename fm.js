const forever = require('forever-monitor');

const child = new forever.Monitor('index.js', {
  // max: 3,
  silent: false,
  uid: 'index',
});

child.on('exit', function () {
  console.log('app.js has exited after 3 restarts');
});

child.start(); 
