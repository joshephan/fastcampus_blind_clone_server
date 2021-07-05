const express = require("express");
const router = express.Router();
const { Company } = require("../mongoose/model");

// 회사 추가
router.post("/company/create", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const newCompany = await Company({
    name,
  }).save();

  res.send(newCompany._id ? true : false);
});

// 회사 인기있는 목록 불러오기
router.get("/company/list/famous", async (req, res) => {
  const company = await Company.find().limit(10).sort({ realtimeScore: -1 });
  res.send(company);
});

module.exports = router;
