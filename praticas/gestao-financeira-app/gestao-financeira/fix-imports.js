const fs = require('fs');
const path = require('path');

const dirsToSearch = ['app', 'components', 'contexts', 'styles'];
const regex = /from "@\/([a-z]+)"\//g;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content.replace(regex, 'from "@/$1/');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
}

for (const dir of dirsToSearch) {
  processDir(dir);
}
