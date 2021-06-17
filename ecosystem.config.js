module.exports = {
  apps : [{
    name:'signal',
    cwd: '~/signal',
    script: 'server.js',
    env_production: {
      NODE_ENV: "production",
    },
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
      path : '/home/node/signal/source',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload source/ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}