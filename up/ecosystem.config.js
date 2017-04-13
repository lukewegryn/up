module.exports = {
  apps: [{
    name: 'up',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-34-206-3-241.compute-1.amazonaws.com',
      key: '~/.ssh/up.pem',
      ref: 'origin/master',
      repo: 'https://github.com/lukewegryn/up',
      path: '/home/ubuntu/up',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}