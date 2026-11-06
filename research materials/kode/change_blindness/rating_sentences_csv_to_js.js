const fs = require("fs");
const path = require("path");

// --- CONFIG ---
const csvFilePath = path.join(__dirname, "rating_sentences.csv");
const outputFilePath = path.join(__dirname, "rating_sentences_array.js");

// --- Read and Convert ---
fs.readFile(csvFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading CSV file:", err);
    process.exit(1);
  }

  const text = data.toString("utf8");

  // Split into rows
  const rows = text.trim().split("\n").filter(r => r.length > 0);

  // Get headers
  const headers = rows[0].split(";").map(h => h.trim());

  // Convert rows into objects
  const objects = rows.slice(1).map(row => {
    const cols = row.split(";");
    const obj = {};
    headers.forEach((h, i) => {
      let value = cols[i] ? cols[i].trim() : "";
      // Escape single quotes and backslashes
      value = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      obj[h] = value;
    });
    return obj;
  });

  // Build JS array string
  let output = "var rating_sentences = [\n";
  objects.forEach((obj, idx) => {
    const entries = Object.entries(obj).map(([key, val]) => {
      return `${key}: '${val}'`;
    });
    output += `  {${entries.join(", ")}}${idx < objects.length - 1 ? "," : ""}\n`;
  });
  output += "];\n";

  // Write output
  fs.writeFile(outputFilePath, output, "utf8", err => {
    if (err) {
      console.error("Error writing JS file:", err);
      process.exit(1);
    }
    console.log(`✅ JS file successfully created: ${outputFilePath}`);
  });
});
