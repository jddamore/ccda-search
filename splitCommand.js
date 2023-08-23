const fs = require('fs');
const PDFDocument = require('pdf-lib').PDFDocument;

let templates = [
  { 'index': '2.16.840.1.113883.10.20.22.1.1', 'start': 10, 'end': 61 },
  { 'index': '2.16.840.1.113883.10.20.22.2.500', 'start': 61, 'end': 63 },
  { 'index': '2.16.840.1.113883.10.20.22.2.65', 'start': 63, 'end': 68 },
  { 'index': '2.16.840.1.113883.10.20.22.4.69', 'start': 68, 'end': 73 },
  { 'index': '2.16.840.1.113883.10.20.22.4.86', 'start': 73, 'end': 74 },
  { 'index': '2.16.840.1.113883.10.20.22.4.200', 'start': 74, 'end': 77 },
  { 'index': '2.16.840.1.113883.10.20.22.4.500.1', 'start': 77, 'end': 85 },
  { 'index': '2.16.840.1.113883.10.20.22.4.500.3', 'start': 85, 'end': 87 },
  { 'index': '2.16.840.1.113883.10.20.22.4.500', 'start': 87, 'end': 94 },
  { 'index': '2.16.840.1.113883.10.20.22.4.500.2', 'start': 94, 'end': 97 },
  { 'index': '2.16.840.1.113883.10.20.22.4.60', 'start': 97, 'end': 100 },
  { 'index': '2.16.840.1.113883.10.20.22.4.502', 'start': 100, 'end': 102 },
  { 'index': '2.16.840.1.113883.10.20.22.4.505', 'start': 102, 'end': 107 },
  { 'index': '2.16.840.1.113883.10.20.22.4.121', 'start': 107, 'end': 115 },
  { 'index': '2.16.840.1.113883.10.20.22.4.132', 'start': 115, 'end': 133 },
  { 'index': '2.16.840.1.113883.10.20.22.4.19', 'start': 133, 'end': 138 },
  { 'index': '2.16.840.1.113883.10.20.22.4.18', 'start': 138, 'end': 144 },
  { 'index': '2.16.840.1.113883.10.20.22.4.202', 'start': 144, 'end': 153 },
  { 'index': '2.16.840.1.113883.10.20.22.4.41', 'start': 153, 'end': 161 },
  { 'index': '2.16.840.1.113883.10.20.22.4.61', 'start': 161, 'end': 175 },
  { 'index': '2.16.840.1.113883.10.20.22.4.281', 'start': 175, 'end': 178 },
  { 'index': '2.16.840.1.113883.10.20.22.4.4', 'start': 178, 'end': 188 },
  { 'index': '2.16.840.1.113883.10.20.24.3.88', 'start': 188, 'end': 198 },
  { 'index': '2.16.840.1.113883.10.20.22.4.2', 'start': 198, 'end': 200 },
  { 'index': '2.16.840.1.113883.10.20.22.4.1', 'start': 200, 'end': 207 },
  { 'index': '2.16.840.1.113883.10.20.22.4.136', 'start': 207, 'end': 211 },
  { 'index': '2.16.840.1.113883.10.20.22.4.201', 'start': 211, 'end': 213 },
  { 'index': '2.16.840.1.113883.10.20.22.4.507', 'start': 213, 'end': 216 },
  { 'index': '2.16.840.1.113883.10.20.22.4.38', 'start': 216, 'end': 222 },
  { 'index': '2.16.840.1.113883.10.20.22.4.504', 'start': 222, 'end': 224 },
  { 'index': '2.16.840.1.113883.10.20.22.4.503', 'start': 224, 'end': 228 },
  { 'index': '2.16.840.1.113883.10.20.34.3.45', 'start': 228, 'end': 232 },
  { 'index': '2.16.840.1.113883.10.20.22.4.501', 'start': 232, 'end': 235 },
  { 'index': '2.16.840.1.113883.10.20.22.4.506', 'start': 235, 'end': 239 },
  { 'index': '2.16.840.1.113883.10.20.22.5.7', 'start': 239, 'end': 241 },
  { 'index': '2.16.840.1.113883.10.20.22.5.6', 'start': 241, 'end': 246 },
  { 'index': '2.16.840.1.113883.10.20.22.5.8', 'start': 246, 'end': 249 }
]

async function splitPdf(pathToPdf) {

  const docmentAsBytes = await fs.promises.readFile(pathToPdf);

  // Load your PDFDocument
  const pdfDoc = await PDFDocument.load(docmentAsBytes)

  // const numberOfPages = pdfDoc.getPages().length;

  for (let i = 0; i < templates.length; i++) {

    // Create a new "sub" document
    const subDocument = await PDFDocument.create();

    let temp = [];
    let thisTemplate = JSON.parse(JSON.stringify(templates[i]));
    while (thisTemplate.start <= thisTemplate.end) {
      let [copiedPage] = await subDocument.copyPages(pdfDoc, [thisTemplate.start-1]);
      subDocument.addPage(copiedPage);
      thisTemplate.start++;
    }

    const pdfBytes = await subDocument.save()
    await writePdfBytesToFile(`./output/${thisTemplate.index}.pdf`, pdfBytes);
  }
}

function writePdfBytesToFile(fileName, pdfBytes) {
  return fs.promises.writeFile(fileName, pdfBytes);
}

(async () => {
  await splitPdf("./data.pdf");
})();


/*

Original code which mostly works
const fs = require('fs');
const PDFDocument = require('pdf-lib').PDFDocument;

async function splitPdf(pathToPdf) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {

        // Create a new "sub" document
        const subDocument = await PDFDocument.create();
        // copy the page at current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save()
        await writePdfBytesToFile(`file-${i + 1}.pdf`, pdfBytes);

    }
}

function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}

(async () => {
    await splitPdf("./path-to-your-file.pdf");
})();

*/