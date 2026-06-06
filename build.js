const { execFileSync } = require('child_process');
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
try {
  execFileSync('node', ['node_modules/@dcloudio/vue-cli-plugin-uni/bin/uniapp-cli.js', 'build'], {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch(e) {
  console.error('Build failed:', e.message);
  process.exit(1);
}
