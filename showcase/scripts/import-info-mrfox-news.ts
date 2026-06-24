import "dotenv/config";
import { syncInfoMrfoxNewsToDatabase } from "../src/lib/sync-info-mrfox-news";

syncInfoMrfoxNewsToDatabase()
  .then((result) => {
    console.log(`Imported ${result.total} reviews from info.mrfox.com`);
    console.log(`  created: ${result.created}`);
    console.log(`  updated: ${result.updated}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  });
