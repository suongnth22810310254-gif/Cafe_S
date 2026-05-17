const sequelize = require("./config/sequelize.js");
async function fixAllImages() {
  try {
    const r1 = await sequelize.query(`UPDATE "Food" SET "ImageURL" = REPLACE("ImageURL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("Food updated:", r1[1].rowCount);
    
    // Also strip generic supabase url without /images/ if they exist
    const r1b = await sequelize.query(`UPDATE "Food" SET "ImageURL" = REPLACE("ImageURL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/', '') WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("Food generic updated:", r1b[1].rowCount);

    const r2 = await sequelize.query(`UPDATE "CuaHang" SET "Image_URL" = REPLACE("Image_URL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "Image_URL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("CuaHang updated:", r2[1].rowCount);

    const r2b = await sequelize.query(`UPDATE "CuaHang" SET "Image_URL" = REPLACE("Image_URL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/', '') WHERE "Image_URL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("CuaHang generic updated:", r2b[1].rowCount);

    const r3 = await sequelize.query(`UPDATE "Category" SET "ImageURL" = REPLACE("ImageURL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("Category updated:", r3[1].rowCount);

    const r4 = await sequelize.query(`UPDATE "Ingredient" SET "ImageURL" = REPLACE("ImageURL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("Ingredient updated:", r4[1].rowCount);

    const r5 = await sequelize.query(`UPDATE "Users" SET "Avatar" = REPLACE("Avatar", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "Avatar" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    console.log("Users updated:", r5[1].rowCount);

    // Check what is STILL left in Food
    const leftovers = await sequelize.query(`SELECT "FoodId", "ImageURL" FROM "Food" WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp%' OR "ImageURL" LIKE '%http%' LIMIT 5;`);
    console.log("Still having http links in Food:", leftovers[0]);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
fixAllImages();