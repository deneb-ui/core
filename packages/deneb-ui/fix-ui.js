const fs = require('fs'); 
function replaceIdx(filePath) {
  let c = fs.readFileSync(filePath, 'utf8'); 
  c = c.replace(/idx\)/g, 'index)').replace(/\[\$\{idx\}\]/g, '[${index}]'); 
  fs.writeFileSync(filePath, c);
}
replaceIdx('src/EditableGoogleFeedback.tsx');
replaceIdx('src/EditableTestimonialSection.tsx');
