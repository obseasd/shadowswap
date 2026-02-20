/**
 * Patch Tongo SDK and SHE library to fix BigInt type coercion issues
 * in poseidonHashMany calls. This is needed because the browser bundler
 * can cause cross-version type mismatches between starknet.js versions.
 *
 * Run automatically via "postinstall" in package.json.
 */
const fs = require("fs");
const path = require("path");

const patches = [
  {
    file: path.join(__dirname, "..", "node_modules", "@fatsolutions", "tongo-sdk", "dist", "types.js"),
    search: `function compute_prefix(seq) {\n    return (0, starknet_1.poseidonHashMany)(seq);\n}`,
    replace: `function compute_prefix(seq) {\n    // Ensure all values are native bigint (fixes cross-version starknet.js type mismatches)\n    return (0, starknet_1.poseidonHashMany)(seq.map(function(v) { return typeof v === 'bigint' ? v : BigInt(v); }));\n}`,
  },
  {
    file: path.join(__dirname, "..", "node_modules", "@fatsolutions", "she", "lib", "utils.js"),
    search: `return reduce_modulo_order((0, starknet_1.poseidonHashMany)(arr));`,
    replace: `// Ensure all values are native bigint (fixes cross-version type mismatches)\n    return reduce_modulo_order((0, starknet_1.poseidonHashMany)(arr.map(function(v) { return typeof v === 'bigint' ? v : BigInt(v); })));`,
  },
];

let applied = 0;
for (const patch of patches) {
  try {
    const content = fs.readFileSync(patch.file, "utf8");
    if (content.includes(patch.search)) {
      fs.writeFileSync(patch.file, content.replace(patch.search, patch.replace), "utf8");
      console.log(`✓ Patched ${path.relative(process.cwd(), patch.file)}`);
      applied++;
    } else if (content.includes("Ensure all values are native bigint")) {
      console.log(`○ Already patched ${path.relative(process.cwd(), patch.file)}`);
    } else {
      console.warn(`✗ Could not find patch target in ${path.relative(process.cwd(), patch.file)}`);
    }
  } catch (err) {
    console.warn(`✗ Failed to patch ${patch.file}:`, err.message);
  }
}
console.log(`Patch complete: ${applied} file(s) patched.`);
