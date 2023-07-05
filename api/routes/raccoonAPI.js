const express = require("express");
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const seq = require('seq');
require('dotenv').config();

/************************************************************************************/

const {RACCOON_BASE_URI} = process.env;
const {CKAN_BASE_URI} = process.env;
const ckanGetResource = CKAN_BASE_URI + "package_show";
const raccoonGetQIDO = RACCOON_BASE_URI + "/api/dicom/qido/studies";
const raccoonPost = RACCOON_BASE_URI + "/dicom-web/studies";

/************************************************************************************/

/*********************************/
/***************GET***************/
/*********************************/

//反映raccoon_get正常
router.get('/', async (req, res) => {
  try {
    console.log('raccoon get api working well.');
    res.send('raccoon get api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

/************************************************************************************/

//只列出csv的目錄
router.get('/studies', async (req, res) => {
  try {
    //將request的查詢參數條件拿出
    ////命名規則packageQuery_[type]_symptomQuery

    //1.從react方收到要查詢的資料集name和病徵(resource)title
    const packageQuery = req.query.datasetName;
    const symptomQuery = req.query.symptom;

    //2
    var fileUrl = '';   // 要下載的檔案 URL
    var fileName = '';  // 檔案名稱
    var filePath = '';  // 要儲存的檔案路徑

/*test area
    function step1(callback){
      console.log('step.1');
      callback();
    }
    // function step2(callback){
    //   console.log('step.2');
    //   axios.get("https://sharing.v6.rocks/api/3/action/package_list")
    //     .then(response =>{
    //       console.log('step.2 - 1')
    //       console.log(response)
    //       callback();
    //       //async queue
    //     })
    //   //main queue
    // }
    // function step3(callback){
    //   console.log('step.3');
    //   callback();
    // }
    // function step4(callback){
    //   console.log('step.4');
    //   callback();
    // }
*/
    //主線佇列
    seq()
      .seq(function(){
        var seq_this = this;
        step1(function() {seq_this();});
      })
      .seq(function(){
        var seq_this = this;
        step2(function() {seq_this();});
      })
      .seq(function(){
        var seq_this = this;
        step3(function() {seq_this();});
      })
      .seq(function(){
        var seq_this = this;
        step4(function() {seq_this();});
      })

    //2.依據step.1收到的參數，去和ckan要求指定資料集下的指定resource下載URL
    function step2(callback){
      console.log('step.2');
      //拉csv的下載URL
      axios.get(`${ckanGetResource}`,
      {
        params: {
          id: packageQuery
        }
      })
      .then(getRes => {
        // console.log(getRes.data.result.resources);
        const numFields = Object.keys(getRes.data.result.resources).length;
        // console.log(numFields);

        //console.log('step.2 column 79');
        var count = 0;
        //走遍每個resource找要的索引檔
        
        while (count < numFields) {
          //console.log('step.2 while loop');
          fileName = getRes.data.result.resources[count].name;
          const keyword = '_[type]_';                                     // 要拿來分割的字串
          const splitWords = fileName.split(keyword);                     // 進行分割存成長度為2的陣列
          //console.log(fileName)
          const symptomGet = splitWords.length > 1 ? splitWords[1] : '';  // 有割到東西的話就直接等於第二個值
          // 找到的病徵和前端要求的病徵相符就執行以下
          if(symptomQuery == symptomGet){
            console.log('step.2 get symptom index file downloading url');
            fileUrl = getRes.data.result.resources[count].url;
            filePath = `./csv_temp/${symptomGet}.csv`;

            // DEBUG
            // console.log(fileUrl);
            // console.log(fileName);
            // console.log(symptomQuery);
            // console.log(symptomGet);
            callback();
            break;
          }
          count++;
        }
      })
    }

    //3.將step.2拉到的URL下載csv到指定目錄
    //將檔案下載到指定路徑

    function step3(callback){
      const writer = fs.createWriteStream(filePath);
      axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
      })
      .then(response =>{
        response.data.pipe(writer)
      })
      .then(
        writer.on('finish', () => {
          console.log('step.3 assign the downloading path');
          console.log(`download completed: ${filePath}`);
          callback();
        })
      )
    }

    //4.打開step.3拉到的csv，將特定欄位逐一讀出
    //讀取csv檔案
    function readCSVFile(filePath, columns) {
      return new Promise((resolve, reject) => {
      var extractedColumns = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Extract the desired columns from each row
          //column代表traverse的參數
          columns.forEach((column) => extractedColumns.push(row[column]));
          //console.log('extractedColumns:'+extractedColumns);
        })
        .on('end', () => {
          resolve(extractedColumns);
          //console.log('extractedColumns:'+extractedColumns);
          console.log('CSV file processing is complete.');
        })
        .on('error', (error) => {
          reject(error);
        });
     });
    }
    function step4(callback){
      readCSVFile(filePath, ['StudyInstanceUID'])
      .then((data) => {
        console.log('step.4 read csv column');
        console.log('csv processing successed');
        res.send(data); 
        callback();
      })
      .catch((error) => {
        console.error('process occured an error：', error);
      })
    }    
  } catch (error) {
    console.error(error.response.data.error);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
});

/**********************************/
/***************POST***************/
/**********************************/

router.post('/studiesNew', (req, res) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/dicom')) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    const data = [];
    let dataLength = 0;

    req.on('data', chunk => {
      data.push(chunk);
      dataLength += chunk.length;
    });

    req.on('end', () => {
      const buffer = Buffer.concat(data, dataLength);
  
      // Specify the file path to save the uploaded file
      const filePath = 'uploads/' + Date.now() + '_' + req.headers['x-file-name'];
  
      fs.writeFile(filePath, buffer, err => {
        if (err) {
          console.error('Error while saving the file:', err);
          return res.status(500).json({ error: 'Failed to save the file' });
        }
  
        console.log('File saved:', filePath);
        res.status(200).json({ message: 'File uploaded successfully' });
      });
    });
    // Perform further processing with the uploaded file
    // ...

    res.status(200).json({ message: 'File uploaded successfully' });

    // await axios.post(`${raccoonPost}`,data,{headers})
    // .then(getRes => {
    //   console.log(getRes.data);
    //   res.send(getRes.data);
    // })

    //*********************************底下是post跟del會用到 
    // /api/fhir/ImagingStudy/StudyInstanceUID
    // 用fhir抓dicom的json欄位去做REST

    // 格式fhir.json=csv.column

    // response.id=StudyInstanceUID
    // response.series.uid=X
    // response.instance.uid=SOPInstanceUID
    //ModalitiesInStudy(影像種類)、PatientID、PatientName、StudyInstanceUID(實體影像的UID)、limit(一次最多拿多少筆)、offset(從第n筆拿資料，換頁會用到)
    //requestType=WADO&studyUID=StudyInstanceUID(csv)
    //判斷是不是丟空值
    // const ModalityQuery = req.query.Modality == "" ? req.query.Modality : "";
    // const PatientIDQuery = req.query.PatientID == "" ? req.query.PatientID : "";
    // const PatientNameQuery = req.query.PatientName == "" ? req.query.PatientName : "";
    // const instanceUIDQuery = req.query.InstanceUID == "" ? req.query.InstanceUID : "";
    // const limitQuery = req.query.limit == "" ? req.query.limit : "";
    // const offsetQuery = req.query.offset == "" ? req.query.offset : "";

    // console.log(`ModalityQuery: ${ModalityQuery} \nPatientIDQuery: ${PatientIDQuery} \nPatientNameQuery: ${PatientNameQuery} \ninstanceUIDQuery: ${instanceUIDQuery} \nlimitQuery:${limitQuery} \noffsetQuery:${offsetQuery}`);
    // console.log(instanceUIDQuery)

    //step.5 
    //依據QIDO的query去向raccoon拉影像資訊
    //最後在研究QIDO的response怎麼拉dcm的欄位（透過csv的StudyInstanceUID去做QI）

    //5.依據step.4讀出的欄位，逐一向raccoon提出get請求，拉出每個response的需要欄位
    // .on('end', () => {
    //   //向raccoon做get請求
    //   await axios.get(`${raccoonGetQIDO}`,
    //   {
    //     params: {
    //       // ModalitiesInStudy: ModalityQuery,
    //       // PatientID: PatientIDQuery,
    //       // PatientName: PatientNameQuery,
    //       StudyInstanceUID: instanceUIDQuery,
    //       // limit: limitQuery,
    //       // offset: offsetQuery,
    //     }
    //   })

    //6.將5的結果回傳到react
    //   .then(getRes => {
    //     console.log(getRes.data);
    //     res.send(getRes.data);
    //   })
    //   // console.log(req);
    //   // console.log('\n'+JSON.stringify(req.query))
    // });

    //對ckan平台做post請求
    // await axios.post(`${ckanPostPackageCreate}`,data,{headers})
    // .then(getRes => {
    //   console.log(getRes.data);
    //   res.send(getRes.data);
    // })
  } catch (error) {
    console.error(error.response.data.error);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send('Error fetching data from external API');
  }
});

  /************************************/
/***************DELETE***************/
/************************************/

/*********************************/
/***************PUT***************/
/*********************************/

module.exports = router;