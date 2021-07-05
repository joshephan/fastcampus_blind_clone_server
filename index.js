const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const formidable = require("express-formidable");
const {
  article,
  board,
  comment,
  company,
  reply,
  search,
  user,
} = require("./router");
const app = express();
const PORT = 8080; // elastic beanstalk default
const SECRET = "@#G4DSJF123#%!@#$SDF";

AWS.config.update({
  accessKeyId: "엑세스키",
  secretAccessKey: "시크릿키",
  region: "리전",
});

const s3 = new AWS.S3();

app.use(cors());
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true }));

// JWT 시크릿 설정
app.set("jwt-secret", SECRET);

// 기능별 라우터 추가
app.use(article);
app.use(board);
app.use(comment);
app.use(company);
app.use(reply);
app.use(search);
app.use(user);

app.use(formidable());

// 상태 확인용
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 파일 업로드
app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.send({ error: true, data: null, msg: "파일이 첨부되지 않음." });
  }

  const raw = req.files.file;
  const buffer = fs.readFileSync(raw.path);
  const fileName = new Date().getTime() + raw.name;
  const params = {
    Body: buffer,
    Bucket: "blind-clone-coding",
    Key: fileName,
    ACL: "public-read",
  };
  s3.putObject(params, (err, data) => {
    if (err) return res.send({ error: true, data: null, msg: "S3 에러" });
    res.send({ error: false, key: fileName, msg: "성공" });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
