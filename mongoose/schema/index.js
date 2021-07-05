const Article = require("./article"); // 사용자가 작성한 게시글
const Board = require("./board"); // 각각의 게시판
const Comment = require("./comment"); // 게시글 안에 있는 댓글
const Company = require("./company"); // 회사 정보 
const Reply = require("./reply"); // 게시글 안에 있는 댓글의 대댓글
const User = require("./user"); // 사용자 정보

module.exports = {
  Article,
  Board,
  Comment, 
  Company,
  Reply,
  User
}