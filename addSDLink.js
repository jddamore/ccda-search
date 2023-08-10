const cheerio = require('cheerio');
const fs = require('fs');
// const request = require('request');

let files = fs.readdirSync('./templates/');

let skipList = [
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.301.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.34.3.45.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.319.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.302.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.202.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.65.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.311.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.500.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.1.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.316.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.305.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.7.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.3.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.201.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.501.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.200.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.502.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.304.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.303.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.308.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.309.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.2.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.6.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.318.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.314.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.315.html',
  'https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.317.html'
];

for (let i = 0; i < files.length; i++) {
  let template = files[i].replace('.html', '');
  let file = fs.readFileSync(`./templates/${files[i]}`, 'utf-8');
  /* console.log(template);
  let a = `https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-${template}.html`;
  request(a, function (error, response, body) {
    console.log(`${a} statusCode:`, response && response.statusCode);
  });
  */
  let newLink = `https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-${template}.html`;
  if (skipList.indexOf(newLink) === -1) {
    let newStuff = `<a href="${newLink}" target="_blank" style="color:green"> <i class="fas fa-external-link-alt" ></i> view prototype</a>`
    let output = file.replace('</small>', `${newStuff}</small>`);  
    fs.writeFileSync(`./templates/${files[i]}`, output, 'utf-8');
    console.log(`wrote ${files[i]}`)
  }
  else {
    console.log('skipped')
  }
}

// note that this fails on some files (not debugged)
// also link need to be removed for CG templates
