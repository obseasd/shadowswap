const fs = require("fs");
const path = require("path");

const sdkSrc = path.join(
  __dirname,
  "..",
  "node_modules",
  "@fatsolutions",
  "tongo-sdk",
  "src"
);
const utilsProxy = path.join(sdkSrc, "utils.js");

if (fs.existsSync(sdkSrc) && !fs.existsSync(utilsProxy)) {
  fs.writeFileSync(
    utilsProxy,
    '// Proxy to compiled dist - workaround for SDK packaging bug\nmodule.exports = require("../dist/utils");\n'
  );
  console.log("Patched Tongo SDK: created src/utils.js proxy");
} else if (fs.existsSync(utilsProxy)) {
  console.log("Tongo SDK already patched");
} else {
  console.log("Tongo SDK not found, skipping patch");
}
