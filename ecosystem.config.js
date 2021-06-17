module.exports = {
  apps : [{
    name:'signal',
    script: 'server.js',
    env_production: {
      NODE_ENV: "production",
    },
    watch: '.'
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
      'post-deploy' : 'npm install && pm2 reload ~/signal/source/ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}