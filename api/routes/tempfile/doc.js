const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // 指定上傳後的目錄
const db = require("../config/mongo_conf.js");

// 獲取申請文件集合
const Accounts = db.collection('Accounts');

//反映正常
router.get('/', async (req, res) => {
  try {
    console.log('get mongo api working well.');
    res.send('get mongo api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

//拿取特定人員的申請文件
router.get('/accountDocs', async (req, res) => {
  try {
    const applicantDocs = await db.collection('applicantdocs');
    const account = req.query.account
    const condition = 
    {
      name: account
    }
    // 查詢申請文件
    const results = await applicantDocs.find(condition).toArray();
    res.send(results)
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**********************************************************************************************/

//特定人員的申請文件附件存進主機
router.post('/docUpload', upload.single('proposalFile'), (req, res) => {
  // 'proposalFile' 是表單中的檔案欄位名稱
  const tempPath = req.file.path; // 上傳後的臨時路徑
  const proposalPath = path.join(__dirname, '../../../proposals', req.file.originalname); // 目標路徑

  // console.log(req.file)
  // console.log("tempPath = " + tempPath)
  // console.log("proposalPath = " + proposalPath)
  // 將檔案從臨時路徑移動到目標路徑
  fs.rename(tempPath, proposalPath, (err) => {
    try{
      //直接傳路徑的疑慮？
      res.status(200).send(proposalPath);
    }catch{
      console.error(err);
      res.status(500).send('error occured, upoload failed.\n');
    }
  });
});

//新增特定人員的申請文件表單進資料庫
router.post('/formUpload',async (req, res) => {
  try{
    const applicantDocs = await db.collection('applicantdocs');
    // 宣告表單欄位
    const {userName, applyUserID, applyOrgnization, applyEmail, applyTelephone, applyDatasetID, applicantID, author, applyTime} = req.body
    // 創建一個動態模型的文檔
    const newDoc = 
    { 
      userName: userName, 
      applyUserID: applyUserID,
      author: author, 
      applyOrgnization: applyOrgnization,
      applyDatasetID: applyDatasetID,
      applicantID: applicantID, 
      applyEmail: applyEmail,
      applyTelephone: applyTelephone, 
      applyTime: applyTime,
      status: 0
    }
    let result = await applicantDocs.insertOne(newDoc);
    //console.log("new Date = " + new Date())
    // console.log(name+" "+orgnization+" "+email+" "+telephone+" "+applicantID+" "+maintainer+" "+applyTime)
    // console.log(req.body)
    res.status(200).send(`{status: "ok"}`)
  } catch (error) {
    console.error(error.response.data.error);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
});

module.exports = router;
