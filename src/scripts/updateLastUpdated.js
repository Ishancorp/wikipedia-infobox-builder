import { execSync } from "child_process";
import { writeFileSync } from "fs";

try {
  const lastUpdated = execSync('git log -1 --format="%ci" src/').toString().trim();
  const data = { lastUpdated };
  
  writeFileSync("src/jsons/lastUpdated.json", JSON.stringify(data, null, 2));
  console.log("Updated src/jsons/lastUpdated.json with last edit date:", lastUpdated);
} catch (err) {
  console.error("Error getting last updated date:", err);
}
