const fs = require('fs');

let files = fs.readdirSync('./templates');

let data = {
  '2.16.840.1.113762.1.4.1021.101':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.101/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.101</a>',
  '2.16.840.1.113762.1.4.1021.103':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.103/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.103</a>',
  '2.16.840.1.113762.1.4.1021.33':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.33/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.33</a>',
  '2.16.840.1.113762.1.4.1114.17':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1114.17/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1114.17</a>',
  '2.16.840.1.113762.1.4.1196.788':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1196.788/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1196.788</a>',
  '2.16.840.1.113762.1.4.1247.9':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1247.9/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1247.9</a>',
  '2.16.840.1.113883.1.11.11526':'<a href="https://terminology.hl7.org/3.1.0/ValueSet-v3-HumanLanguage.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.1.11.11526</a>',
  '2.16.840.1.113883.3.26.1.1':'<a href="https://terminology.hl7.org/2.0.0/CodeSystem-v3-nciThesaurus.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.3.26.1.1</a>',
  '2.16.840.1.113883.4.642.4.1131':'<a href="https://terminology.hl7.org/3.1.0/CodeSystem-provenance-participant-type.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.4.642.4.1131</a>',
  '2.16.840.1.113883.5.1001':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActMood.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1001</a>',
  '2.16.840.1.113883.5.1002':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActRelationshipType.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1002</a>',
  '2.16.840.1.113883.5.1008':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-NullFlavor.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1008</a>',
  '2.16.840.1.113883.5.110':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-RoleClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.110</a>',
  '2.16.840.1.113883.5.111':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-RoleCode.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.111</a>',
  '2.16.840.1.113883.5.14':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActStatus.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.14</a>',
  '2.16.840.1.113883.5.41':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-EntityClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.41</a>',
  '2.16.840.1.113883.5.88':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationFunction.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.88</a>',
  '2.16.840.1.113883.5.89':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationSignature.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.89</a>',
  '2.16.840.1.113883.5.90':'<a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationType.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.90</a>)',
  'ActCode 2.16.840.1.113883.5.4':'ActCode <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActCode.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.4</a>&nbsp;',
  'ActClass 2.16.840.1.113883.5.6':'ActClass <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.6</a>&nbsp;',
  '2.16.840.1.113883.6.1)':'<a href="https://terminology.hl7.org/CodeSystem-v3-loinc.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.1</a>)',
  '2.16.840.1.113883.6.101)':'<a href="https://terminology.hl7.org/CodeSystem-v3-nuccProviderCodes.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.101</a>)',
  '2.16.840.1.113883.6.12)':'<a href="https://terminology.hl7.org/CodeSystem-CPT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.12</a>)',
  '2.16.840.1.113883.6.13)':'<a href="https://terminology.hl7.org/CodeSystem-CDT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.13</a>)',
  '2.16.840.1.113883.6.4)':'<a href="https://terminology.hl7.org/CodeSystem-icd10PCS.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.4</a>)',
  '2.16.840.1.113883.6.90)':'<a href="https://terminology.hl7.org/CodeSystem-icd10CM.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.90</a>)',
  '2.16.840.1.113883.6.96)':'<a href="https://terminology.hl7.org/CodeSystem-v3-snomed-CT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.96</a>)'
  // can't do UCUM universally, need to search manually since partially done
  //  '2.16.840.1.113883.1.11.12839':'<a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.1.11.12839/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.1.11.12839</a>'
};

for (let i = 0; i < files.length; i++) {
  let file = fs.readFileSync(`./templates/${files[i]}`, 'utf-8');
  let originalFile = file;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let key2 = key.replace(')', '\\)'); 
      let r = new RegExp(key2, 'g');
      file = file.replace(r, data[key])
    }
  }
  if (file !== originalFile) fs.writeFileSync(`./templates/${files[i]}`, file);
}

