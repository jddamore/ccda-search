const fs = require('fs');

let files = readdirSync('./templates');

let data = {
  '2.16.840.1.113762.1.4.1021.101':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.101/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.101</a></b>',
  '2.16.840.1.113762.1.4.1021.103':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.103/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.103</a></b>',
  '2.16.840.1.113762.1.4.1021.33':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1021.33/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1021.33</a></b>',
  '2.16.840.1.113762.1.4.1114.17':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1114.17/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1114.17</a></b>',
  '2.16.840.1.113762.1.4.1196.788':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1196.788/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1196.788</a></b>',
  '2.16.840.1.113762.1.4.1247.9':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113762.1.4.1247.9/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113762.1.4.1247.9</a></b>',
  '2.16.840.1.113883.1.11.11526':'<b> <a href="https://terminology.hl7.org/3.1.0/ValueSet-v3-HumanLanguage.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.1.11.11526</a></b>',
  '2.16.840.1.113883.3.26.1.1':'<b> <a href="https://terminology.hl7.org/2.0.0/CodeSystem-v3-nciThesaurus.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.3.26.1.1</a></b>',
  '2.16.840.1.113883.4.642.4.1131':'<b> <a href="https://terminology.hl7.org/3.1.0/CodeSystem-provenance-participant-type.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.4.642.4.1131</a></b>',
  '2.16.840.1.113883.5.1001':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActMood.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1001</a></b>',
  '2.16.840.1.113883.5.1002':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActRelationshipType.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1002</a></b>',
  '2.16.840.1.113883.5.1008':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-NullFlavor.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.1008</a></b>',
  '2.16.840.1.113883.5.110':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-RoleClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.110</a></b>',
  '2.16.840.1.113883.5.111':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-RoleCode.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.111</a></b>',
  '2.16.840.1.113883.5.14':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActStatus.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.14</a></b>',
  '2.16.840.1.113883.5.4':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActCode.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.4</a></b>',
  '2.16.840.1.113883.5.41':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-EntityClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.41</a></b>',
  '2.16.840.1.113883.5.6':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ActClass.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.6</a></b>',
  '2.16.840.1.113883.5.88':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationFunction.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.88</a></b>',
  '2.16.840.1.113883.5.89':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationSignature.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.89</a></b>',
  '2.16.840.1.113883.5.90':'<b> <a href="https://terminology.hl7.org/1.0.0/CodeSystem-v3-ParticipationType.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.5.90</a></b>',
  '2.16.840.1.113883.6.1':'<b> <a href="https://terminology.hl7.org/CodeSystem-v3-loinc.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.1</a></b>',
  '2.16.840.1.113883.6.101':'<b> <a href="https://terminology.hl7.org/CodeSystem-v3-nuccProviderCodes.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.101</a></b>',
  '2.16.840.1.113883.6.12':'<b> <a href="https://terminology.hl7.org/CodeSystem-CPT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.12</a></b>',
  '2.16.840.1.113883.6.13':'<b> <a href="https://terminology.hl7.org/CodeSystem-CDT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.13</a></b>',
  '2.16.840.1.113883.6.4':'<b> <a href="https://terminology.hl7.org/CodeSystem-icd10PCS.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.4</a></b>',
  '2.16.840.1.113883.6.90':'<b> <a href="https://terminology.hl7.org/CodeSystem-icd10CM.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.90</a></b>',
  '2.16.840.1.113883.6.96':'<b> <a href="https://terminology.hl7.org/CodeSystem-v3-snomed-CT.html" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.6.96</a></b>',
  '2.16.840.1.113883.1.11.12839':'<b> <a href="https://vsac.nlm.nih.gov/valueset/2.16.840.1.113883.1.11.12839/expansion/Latest" target="_blank"><i class="fas fa-external-link-alt"></i> 2.16.840.1.113883.1.11.12839</a></b>'
};

for (let i = 0; i < files.length; i++) {
  let file = fs.readFileSync(`./templates/${files[i]}`, 'utf-8');
  let originalFile = file;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let r = new RegExp(key, 'g');
      file = file.replace(r, data[key])
    }
  }
  if (file !== originalFile) fs.writeFileSync(`./templates/${files[i]}`, file);
}

