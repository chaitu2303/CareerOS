const docx = require('docx');
const fs = require('fs');

async function createDocx() {
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({ text: "John Doe", heading: docx.HeadingLevel.HEADING_1 }),
          new docx.Paragraph({ text: "johndoe@example.com" }),
          new docx.Paragraph({ text: "(555) 123-4567" }),
          new docx.Paragraph({ text: "Experience", heading: docx.HeadingLevel.HEADING_2 }),
          new docx.Paragraph({ text: "Software Engineer at TechCorp" }),
          new docx.Paragraph({ text: "Jan 2020 - Present" }),
          new docx.Paragraph({ text: "Developed web applications using React, Next.js, and TypeScript." }),
          new docx.Paragraph({ text: "Built scalable APIs with Node.js and PostgreSQL." }),
          new docx.Paragraph({ text: "Education", heading: docx.HeadingLevel.HEADING_2 }),
          new docx.Paragraph({ text: "Bachelor's Degree in Computer Science" }),
          new docx.Paragraph({ text: "University of Technology" }),
          new docx.Paragraph({ text: "2015 - 2019" }),
          new docx.Paragraph({ text: "Skills", heading: docx.HeadingLevel.HEADING_2 }),
          new docx.Paragraph({ text: "JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS" })
        ],
      },
    ],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  fs.writeFileSync('./tests/test-resume.docx', buffer);
  console.log('test-resume.docx created successfully!');
}

createDocx().catch(console.error);
