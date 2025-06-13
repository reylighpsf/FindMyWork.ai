module.exports = {
  apps: [{
    name: "findmywork-frontend",
    cwd: "/var/www/findwork/Frontend",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
