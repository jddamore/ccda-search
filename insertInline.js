const fs = require ('fs');
const cheerio = require('cheerio');

let files = fs.readdirSync('./templates');
let lines = fs.readFileSync('./inlineData.psv', 'utf-8').split('\r\n');
let file_index = 0;
let line_index = 0;

const main = function () {
  if (line_index === lines.length) {
    console.log('done');
  }
  else {
    let pieces = lines[line_index].split('|');
    // console.log(`working on ${pieces[0]}`);
    checkFile(pieces);
  }
};

const checkFile = function (pieces) {
  let found = false;
  let conf = `(CONF:${pieces[0]})`;
  while (file_index < files.length) {
    // process.stdout.write('.');
    let file = fs.readFileSync(`./templates/${files[file_index]}`, 'utf-8');
    if (file.indexOf(conf) !== -1) {
      console.log(`found ${conf} in ${files[file_index]}`);
      found = true;
      let $ = cheerio.load(file, {});
      let conformances = $('#conformance')
      let list_items = conformances.eq(0).children('li');
      let found2 = false; 
      for (let i = 0; i < list_items.length; i++) {
        let list_item = list_items.eq(i).html();
        if (list_item.indexOf(conf) !== -1) {
          found2 = true;
          let regex = new RegExp(/\*R-ENDLINE\*\*N-ENDLINE\*/g)
          let note = pieces[1].replace(regex, '<br />' )
          console.log(note);
          // list_items.eq(i).html(`<p>${note}</p>${list_item});
        }
        if (found2) break;
      }
    }
    if (found) break;
    else file_index++;
  }
  if (!found) console.log(`${conf} not found`);
  line_index++;
  file_index = 0;
  main();
}

main();

