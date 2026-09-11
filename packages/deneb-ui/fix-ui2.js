const fs = require('fs'); 
function replaceIdx(filePath) {
  let c = fs.readFileSync(filePath, 'utf8'); 
  // revert the previous half-baked replacement
  c = c.replace(/index\)/g, 'idx)').replace(/\[\$\{index\}\]/g, '[${idx}]'); 
  // now replace all exact word 'idx' with 'index'
  c = c.replace(/\bidx\b/g, 'index');
  fs.writeFileSync(filePath, c);
}
replaceIdx('src/EditableGoogleFeedback.tsx');
replaceIdx('src/EditableTestimonialSection.tsx');
