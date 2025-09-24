#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple script to find potential unused imports
function findUnusedImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !['node_modules', '.next', 'out', 'build'].includes(file.name)) {
      findUnusedImports(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const unusedImports = [];
  
  lines.forEach((line, index) => {
    // Look for import statements
    const importMatch = line.match(/import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"]/);
    if (importMatch) {
      const imports = importMatch[1].split(',').map(imp => {
        const trimmed = imp.trim();
        // Handle "type" imports like "type ClassValue"
        const isTypeImport = trimmed.startsWith('type ');
        const cleanImport = isTypeImport ? trimmed.replace('type ', '') : trimmed;
        const [original, alias] = cleanImport.split(' as ');
        return {
          original: original.trim(),
          alias: alias ? alias.trim() : original.trim(),
          full: trimmed,
          isType: isTypeImport
        };
      });
      const modulePath = importMatch[2];
      
      // Check if each import is used in the file
      imports.forEach(({ original, alias, full }) => {
        if (original && !isUsedInFile(content, alias)) {
          unusedImports.push({
            file: filePath,
            line: index + 1,
            import: full,
            module: modulePath
          });
        }
      });
    }
  });
  
  if (unusedImports.length > 0) {
    console.log(`\n${filePath}:`);
    unusedImports.forEach(({ line, import: importName, module }) => {
      console.log(`  Line ${line}: ${importName} from '${module}'`);
    });
  }
}

function isUsedInFile(content, importName) {
  // Create a more comprehensive check
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip import statements
    if (line.includes('import')) continue;
    
    // Check if the import name is used in this line
    const regex = new RegExp(`\\b${importName}\\b`, 'g');
    if (regex.test(line)) {
      return true;
    }
  }
  
  return false;
}

console.log('Searching for unused imports...');
findUnusedImports('./');
console.log('\nDone! Review the results above and manually remove unused imports.');
