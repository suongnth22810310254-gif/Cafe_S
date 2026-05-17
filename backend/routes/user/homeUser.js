const express = require("express");
const router = express.Router();
const homeUserController = require("../../controllers/user/homeUserController");const sequelize = require("../../config/sequelize");

// Test db route
router.get("/testdb", async (req, res) => {
  try {
    const data = await sequelize.query(`SELECT "FoodId", "ImageURL" FROM "Food" LIMIT 10`);
    res.json(data[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/fixdb", async (req, res) => {
  try {
    await sequelize.query(`UPDATE "Food" SET "ImageURL" = REPLACE("ImageURL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "ImageURL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    await sequelize.query(`UPDATE "CuaHang" SET "Image_URL" = REPLACE("Image_URL", 'https://vhkvfmbmmsolqiwrjlxp.supabase.co/storage/v1/object/public/images/', '') WHERE "Image_URL" LIKE '%vhkvfmbmmsolqiwrjlxp.supabase.co%'`);
    res.json({ message: "Fixed!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Lấy dữ liệu trang chủ (8 món ăn mới nhất)
router.get("/", homeUserController.getHomeData);

module.exports = router;
