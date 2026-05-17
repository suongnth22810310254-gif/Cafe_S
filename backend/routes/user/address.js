// routes/address.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPEN_API = "https://provinces.open-api.vn/api";

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Route working!" });
});

// --- Lấy tỉnh ---
router.get("/provinces", async (req, res) => {
  try {
    const response = await axios.get(`${OPEN_API}/`);
    const formattedData = response.data.map(p => ({
      ProvinceID: p.code,
      ProvinceName: p.name
    }));
    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error("Open API Error for Provinces.");
    res.json({
      success: true,
      data: [{ ProvinceID: 79, ProvinceName: "Hồ Chí Minh (Mặc định)" }],
    });
  }
});

// --- Lấy quận/huyện theo province_id ---
router.get("/districts/:provinceId", async (req, res) => {
  try {
    const provinceId = req.params.provinceId;
    const response = await axios.get(`${OPEN_API}/p/${provinceId}?depth=2`);
    const formattedData = response.data.districts.map(d => ({
      DistrictID: d.code,
      DistrictName: d.name
    }));
    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error("Open API Error for Districts.");
    res.json({
      success: true,
      data: [{ DistrictID: 760, DistrictName: "Quận 1 (Mặc định)" }],
    });
  }
});

// --- Lấy xã/phường theo district_id ---
router.get("/wards/:districtId", async (req, res) => {
  try {
    const districtId = req.params.districtId;
    const response = await axios.get(`${OPEN_API}/d/${districtId}?depth=2`);
    const formattedData = response.data.wards.map(w => ({
      WardCode: String(w.code),
      WardName: w.name
    }));
    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error("Open API Error for Wards.");
    res.json({
      success: true,
      data: [{ WardCode: "26734", WardName: "Phường Bến Nghé (Mặc định)" }],
    });
  }
});

module.exports = router;
