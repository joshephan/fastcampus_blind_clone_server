const express = require("express");
const router = express.Router();
const { Article } = require("../mongoose/model");

// 게시글 검색 결과를 리턴하는 라우트
router.get("/search/:q", async (req, res) => {
  const { q } = req.params;
  const { lastIndex } = req.query; // 무한 스크롤 구현시 사용할 부분

  const findOption = {
    title: { $regex: q },
  };

  if (lastIndex !== "0") {
    findOption._id = { $lt: lastIndex };
  }

  const article = await Article.find(findOption)
    .sort({ _id: -1 })
    .limit(6)
    .populate({
      path: "author",
      populate: {
        path: "company",
      },
    });

  res.send({
    article: article,
    error: false,
    msg: "성공",
  });
});

module.exports = router;
