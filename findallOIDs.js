const fs = require('fs');

let files = fs.readdirSync('./templates');

let r = new RegExp(/2\.16\.840/);

let index = {}

for (let i = 0; i < files.length; i++) {
  let file = fs.readFileSync(`./templates/${files[i]}`, 'utf-8');
  let pieces = file.split(/\s/);
  for (let j = 0; j < pieces.length; j++) {
    if(r.test(pieces[j])){
      let stripped = pieces[j].replace(/<b>/g, '')
      stripped = stripped.replace(/<\/b>/g, '')
      stripped = stripped.replace(/<i>/g, '')
      stripped = stripped.replace(/<i/g, '')
      stripped = stripped.replace(/<\/i>/g, '')
      index[stripped] = true;
    }
  }  
}

let count = 0;
for (let key in index) {
  if (index.hasOwnProperty(key)) {
    console.log(key);
    count++;
  }
}

console.log(count);
