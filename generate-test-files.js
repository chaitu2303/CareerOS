const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;

  const text = `
John Doe
johndoe@example.com
(555) 123-4567

Experience
Software Engineer at TechCorp
Jan 2020 - Present
Developed web applications using React, Next.js, and TypeScript.
Built scalable APIs with Node.js and PostgreSQL.

Education
Bachelor's Degree in Computer Science
University of Technology
2015 - 2019

Skills
JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS
  `;

  page.drawText(text, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('./tests/test-resume.pdf', pdfBytes);
  console.log('test-resume.pdf created successfully!');
}

createPdf().catch(err => console.error(err));
