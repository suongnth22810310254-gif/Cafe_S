const db = require("./config/sequelize.js");
async function checkImages() {
  const result = await db.query("SELECT \"FoodId\", \"ImageURL\" FROM \"Food\" WHERE \"ImageURL\" LIKE '%no-image.png%' OR \"ImageURL\" LIKE '%vhkvfmbmmsol%' LIMIT 10;", { type: db.QueryTypes.SELECT });
  console.log("FOOD WITH no-image/supabase URL:", result);
  process.exit(0);
}
checkImages();