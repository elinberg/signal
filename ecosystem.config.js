module.exports = {
  apps : [{
    name:'signal',
    script: 'server.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'signal',
      key: '~/.ssh/node.pem',
      ref  : 'origin/main',
      repo : 'git@github.com:elinberg/signal.git',
      path : '/home/node/signal',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
