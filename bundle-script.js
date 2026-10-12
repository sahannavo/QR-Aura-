const fs = require('fs');
const path = require('path');

const files = {};
function readAll(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      readAll(p);
    } else if (item.name.endsWith('.js') || item.name.endsWith('.json')) {
      const key = p.replace(/\\/g, '/');
      files[key] = {
        isJson: item.name.endsWith('.json'),
        content: fs.readFileSync(p, 'utf8')
      };
    }
  }
}
readAll('node_modules/qrcode/lib');
readAll('node_modules/dijkstrajs');

let bundle = 'var QRCode = (function() {\n';
bundle += '  var modules = {};\n';
bundle += '  var cache = {};\n';
bundle += '  function normalize(base, rel) {\n';
bundle += '    if (rel === "dijkstrajs") return "node_modules/dijkstrajs/dijkstra.js";\n';
bundle += '    if (rel[0] !== ".") return rel;\n';
bundle += '    var parts = base.split("/");\n';
bundle += '    parts.pop();\n';
bundle += '    var segs = rel.split("/");\n';
bundle += '    for (var i = 0; i < segs.length; i++) {\n';
bundle += '      if (segs[i] === ".") continue;\n';
bundle += '      else if (segs[i] === "..") parts.pop();\n';
bundle += '      else parts.push(segs[i]);\n';
bundle += '    }\n';
bundle += '    var res = parts.join("/");\n';
bundle += '    if (!res.endsWith(".js") && !res.endsWith(".json")) res += ".js";\n';
bundle += '    return res;\n';
bundle += '  }\n';
bundle += '  function requireMod(currPath, modName) {\n';
bundle += '    var target = normalize(currPath, modName);\n';
bundle += '    if (cache[target]) return cache[target].exports;\n';
bundle += '    if (!modules[target]) throw new Error("Module not found: " + target + " from " + currPath);\n';
bundle += '    var module = { exports: {} };\n';
bundle += '    cache[target] = module;\n';
bundle += '    modules[target](function(name) { return requireMod(target, name); }, module, module.exports);\n';
bundle += '    return module.exports;\n';
bundle += '  }\n';

for (const [k, obj] of Object.entries(files)) {
  if (obj.isJson) {
    bundle += '  modules[' + JSON.stringify(k) + '] = function(require, module, exports) {\n';
    bundle += '    module.exports = ' + obj.content + ';\n';
    bundle += '  };\n';
  } else {
    bundle += '  modules[' + JSON.stringify(k) + '] = function(require, module, exports) {\n' + obj.content + '\n};\n';
  }
}

bundle += '  return requireMod("node_modules/qrcode/lib/dummy", "./browser.js");\n';
bundle += '})();\n';

fs.writeFileSync('qrcode.bundle.js', bundle, 'utf8');
console.log('Saved qrcode.bundle.js, size:', bundle.length);
