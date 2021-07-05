const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Article, Comment } = require("../mongoose/model");

// 댓글 생성하기
router.post("/comment/create", async (req, res) => {
  const { article, content } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.send({
      error: true,
      msg: "토큰이 존재하지 않음",
    });
  }

  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, async (err, data) => {
    if (err) {
      res.send(err);
    }

    const newComment = await Comment({
      author: data.id,
      article,
      content,
    }).save();

    await Article.findOneAndUpdate(
      { _id: article },
      {
        $inc: { commentCount: 1 },
      }
    );
    res.send(newComment._id ? true : false);
  });
});

// 댓글 수정하기
router.patch("/comment/update", async (req, res) => {
  const { id, author, content } = req.body;
  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      content,
    },
    {
      new: true,
    }
  );
  res.send(updatedComment);
});

// 댓글 완전 삭제(HARD DELETE)
router.delete("/comment/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const deletedComment = await Comment.deleteOne({
    _id: id,
    author,
  });
  res.send(deletedComment);
});

// 댓글 소프트 삭제(SOFT DELETE)
router.delete("/comment/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const deletedComment = await Comment.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30일 후의 시간이 저장
    }
  );
  res.send(deletedComment);
});

module.exports = router;
