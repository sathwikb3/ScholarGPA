import fs from 'fs';
import path from 'path';

const replacements = {
  'purple-950': 'blue-950',
  'purple-900': 'blue-900',  
  'purple-800': 'blue-800',
  'purple-700': 'blue-950', 
  'purple-600': 'blue-900',
  'purple-500': 'blue-800',
  'purple-400': 'blue-700',
  'purple-300': 'blue-600',
  'purple-200': 'blue-300',
  'purple-100': 'blue-100',
  'purple-50': 'blue-50',
  'orange-900': 'red-900',
  'orange-800': 'emerald-800', // wait, prompt says crimson/burgundy OR forest green. We'll use red/crimson.
  'orange-700': 'red-900',
  'orange-600': 'red-800',  
  'orange-500': 'red-700',
  'orange-400': 'red-600',
  'orange-300': 'red-500',
  'orange-200': 'red-300',
  'orange-100': 'red-100',
  'orange-50': 'red-50'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./components').concat(walk('.').filter(f => f.endsWith('App.tsx') || f.endsWith('types.ts')));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const regex = new RegExp(oldClass, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
