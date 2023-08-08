const path = require('path');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const seq = require('seq');
const { execFile } = require('child_process');
require('dotenv').config();

const {RACCOON_BASE_URI} = process.env;
const {CKAN_BASE_URI} = process.env;

const {DCMTK_TOOL_LDCM2CSV} = process.env;
const {DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG} = process.env;
const {DCMTK_TOOL_LDCM2CSV_PROFCSV} = process.env;

const ckanGetResource = CKAN_BASE_URI + "resource_show";
const ckanPostResourcePatch = CKAN_BASE_URI+"resource_patch";
const ckanPostResourceUpdate = CKAN_BASE_URI+"resource_update";

const raccoonGetQIDO = RACCOON_BASE_URI + "api/dicom/qido/studies";
const raccoonPost = RACCOON_BASE_URI + "dicom-web/studies";
const raccoonImagingStudyFHIR = RACCOON_BASE_URI + "api/fhir/ImagingStudy";

const tempDirectory = 'uploads/';
const csvTempDirectory = './csv_temp/'

const axiosErrMes = 
{
  success: false,
  possible_reason:
    [
      "sent wrong id",
      "can't connect to ckan"
    ]
}
const axiosErrMesJSON = JSON.stringify(axiosErrMes, null, 2);

const raccoonErrMes = 
{
  success: false,
  possible_reason:
    [
      "can't connect to raccoon"
    ]
}
const raccoonErrMesJSON = JSON.stringify(raccoonErrMes, null, 2);

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

// get
exports.checkGet = async (req, res) => {
  try {
    console.log('raccoon get api working well.');
    res.send('raccoon get api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
}
exports.getStudiesList = async (req, res) => {
  try {
    var fileUrl = '';   // 要下載的檔案 URL
    var fileName = '';  // 檔案名稱
    var filePath = '';  // 要儲存的檔案路徑

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

    //1.依據index參數，去和ckan要求指定resource下載URL
    function step1(callback){
      // 索引檔resource_id
      const index = req.query.id;
      const header = req.body.authorization;
      //拉csv的下載URL
      axios.get(`${ckanGetResource}`,
      {
        params: {
          id: index
        },
        headers: {
          Authorization: header
        }
      })
      .then(getRes => {
        fileName = getRes.data.result.name;
        const keyword = '_[type]_';                                     // 要拿來分割的字串
        const splitWords = fileName.split(keyword);                     // 進行分割存成長度為2的陣列
        //console.log(fileName)
        const symptomGet = splitWords.length > 1 ? splitWords[1] : '';  // 有割到東西的話就直接等於第二個值
        console.log('step.1 get symptom index file downloading url');
        fileUrl = getRes.data.result.url;
        filePath = `${csvTempDirectory}${symptomGet[1]}`;
        
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    //2. 將拉到的URL下載csv到指定目錄
    function step2(callback){
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
          console.log('step.2 assign the downloading path');
          console.log(`download completed: ${filePath}`);
          callback();
        })
      )
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    // 4.打開step.3拉到的csv，將特定欄位逐一讀出
    function step3(callback){
      // 讀取csv檔案
      readCSVFile(filePath, ['StudyInstanceUID'])
      .then((data) => {
        console.log('step.5 read csv column');
        console.log('csv processing successed');
        res.send(data); 
      })
      .then(() => {
        // 砍暫存檔案
        fs.unlink(filePath, (error) => {
          if (error) {
            throw "fail to remove temporary index file."
          }
        });
        callback();
      })
      .catch((error) => {
        throw error;
      })
    }    
  } catch (error) {
    console.error(error);
    // console.error(error);
    // console.log('-------------------------------------------------------------------------\n');
    // console.error(req);
    res.status(500).send(error)
  }
}

//post
exports.checkPost = async (req, res) => {
  try {
    console.log('raccoon post api working well.');
    res.send('raccoon post api working well.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
    return;
  }
}
exports.postStudiesNew = async (req, res) => {
  try {
    /*
    V 0. 把接到的symptom建成暫存資料夾
    V 1. 把接到的dicom們丟在暫存資料夾底下
    V 2. 對暫存資料夾執行ldcm2csv
    V 3. 將產生的csv檔post到ckan
    V 4. 刪除csv檔
    V 5. 以form-data傳送dicom array
    V 6. 刪除暫存資料夾底下的dicom
    */
    // 索引資料夾變數
    var symptomFolder = "";
    // 病徵名稱
    var symptom = "";
    // 產生的索引檔名稱
    var symptomCSVname = "";
    //主線佇列
    seq()
      .seq(function(){
        var seq_this = this;
        step0(function() {seq_this();});
      })
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
      .seq(function(){
        var seq_this = this;
        step5(function() {seq_this();});
      })
      .seq(function(){
        var seq_this = this;
        step6(function() {seq_this();});
      })

      // mkdir dicom暫存資料夾
      function step0(callback){
        try{
          console.log("step.0 mkdir temporary dicom folder")
          const indexName = req.body.indexName;
          const temp = indexName.split("_[type]_");
          // test_[type]_symptom -> symptom
          symptom = temp[1]; 

          // for folderName
          // test_[type]_symptom -> test_type_symptom
          symptomFolder = indexName.replace('[', '');
          symptomFolder = symptomFolder.replace(']', '');
          symptomFolder = tempDirectory + symptomFolder + "/"

          fs.mkdirSync(symptomFolder)
          callback();
        }catch(err){
          console.log("fail to mkdir.")
        }
      }

    // 1. 把接到的dicom們丟在暫存資料夾底下
    function step1(callback){
      try{
        const files = req.files;
        // 沒有收到dicom檔就噴error
        if(!req.files){
          throw "no dicom files uploaded.";
        }

        // Traverse dicom array 到指定暫存資料夾
        files.forEach((file, index) => {
          const filePath = file.path;
          // console.log("symptomFolder=" + symptomFolder);
          const fileOriginalname = symptomFolder + file.originalname;
          fs.rename(filePath, fileOriginalname, (err) => {
            if (err) {
              throw 'rename path failed.';
            }
          });
        });
        console.log(`step.1 dicom saved.`);
        callback();
      }catch(error){
        console.log(error)
      }
    }
    // 2. 對暫存資料夾執行ldcm2csv
    function step2(callback){
      symptomCSVname = csvTempDirectory + symptom + ".csv";
      // console.log("symptomCSVname="+symptomCSVname);
      // console.log("splitSymptomFolder="+splitSymptomFolder[1]);
      const args = ["+pf", DCMTK_TOOL_LDCM2CSV_PROFCSV, "+web", DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG, symptomFolder, symptomCSVname];
      try{
        execFile(DCMTK_TOOL_LDCM2CSV, args, (error, stdout, stderr) => {
          if (error) {
            throw "fail to excute ldcm2csv.";
          }
          console.log("step.2 to index file done.")
          callback();
        })
      }catch(e){
        console.log(e)
        res.status(500).send(e)
      }
    }
    // 3. 將產生的csv檔patch回ckan
    function step3(callback){
      //做post請求的data參數
      const resourceID = req.body.id;
      var description = "";
      if(req.body.description){
        description = req.body.description;
      }
      //前端post過來的ckan Token
      const header = req.headers.authorization;
      //包成key-value
      const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
      const formData = new FormData();
      formData.append('id', resourceID);
      if(req.body.description){
        formData.append('description', description);
      }
      formData.append('format', 'csv');
      const fileStream = fs.readFileSync(symptomCSVname);
      const blob = new Blob([fileStream]);
      formData.append('upload', blob, symptomCSVname);
      //對ckan平台做post請求
      axios.post(`${ckanPostResourcePatch}`,formData,{headers})
      .then(getRes => {
        // console.log(getRes.data);
        console.log("step.3 patch index file done.")
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }
    // 4. 刪除本地暫存的csv檔
    function step4(callback){
      fs.unlink(symptomCSVname, (error) => {
        if (error) {
          console.error(error);
          return;
        }else{
          console.log('step.4 remove index csv file done.');
          callback();
        }
      });
    }
    // 5. 以form-data傳送dicom array
    function step5(callback){
      const formData = new FormData();
      const dcmFiles = fs.readdirSync(symptomFolder);
      try{
        // 把暫存目錄下的dicom檔丟進formdata
        for(let i = 0 ; i < dcmFiles.length ; i++){
          // console.log(dcmFiles[i]);
          const fileStream = fs.readFileSync(symptomFolder+dcmFiles[i]);
          const blob = new Blob([fileStream]);
          formData.append('file', blob, dcmFiles[i]);
          //console.log(symptomFolder+dcmFiles[i]+" appended.")
        }
      }catch(error){
        console.error(error);
        res.status(500).send(error);
      } 

      const headers = {'Content-Type': 'application/dicom', 'Accept': 'application/dicom'}; 
      axios.post(`${raccoonPost}`, formData, {
        headers: headers
      })
      .then(getRes => {
        const resData ={
          uploaded_StudyInstanceUID: getRes.data.successFHIR
        }
        const resJSONdata = JSON.stringify(resData, null, 2);
        res.send(resJSONdata)
        //console.log("successFHIR="+JSON.stringify(getRes.data.successFHIR));
        console.log("step.5 post dicom to pacs done.")
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }
    // 6. 刪除暫存資料夾底下的dicom
    function step6(callback){
      const dcmFiles = fs.readdirSync(symptomFolder);
      // 把暫存目錄下的dicom檔砍光
      for(let i = 0 ; i < dcmFiles.length ; i++){
        // console.log(dcmFiles[i]);
        fs.unlinkSync(symptomFolder + dcmFiles[i]);
        // console.log(symptomFolder + dcmFiles[i]+" deleted.")
      }
      // 砍掉暫存資料夾
      fs.rmdirSync(symptomFolder);
      console.log('step.6 remove temporary dicom file done.');
      callback();
    }
  } catch (error) {
    console.error(error.response);
    res.status(500).send('Error fetching data from external API');
  }
}
exports.postStudiesAppend = async (req, res) => {
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
    .seq(function(){
      var seq_this = this;
      step5(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step6(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step7(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step8(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step9(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step10(function() {seq_this();});
    })

    /*
    V 1. 根據收到的symptomName創建暫存資料夾
    V 2. 把接到的dicom們丟在暫存資料夾底下
    V 3. 對暫存資料夾執行ldcm2csv[append_csv]
    V 4. 針對接到的resource_id，抓下csv檔URL
    V 5. 將上項的CSV URL存到csv_temp[index_csv]
    V 6. 讀取append_csv資料列，SOPinstanceUID不重複的話，append進index_csv[new_csv]
    V 7. 將new_csv patch到ckan
    V 8. 將暫存資料夾及其底下的dicompost到raccoon
    V 9. 刪除暫存資料夾及其底下的dicom
    V 10. 刪除csv_temp底下所有檔案
    */

    // 全域變數宣告

    // 索引資料夾路徑
    var symptomFolder = "";
    // 產生的索引名稱
    var symptomCSVname = "";


    // 1. 根據收到的symptomName創建暫存資料夾
    function step1(callback){
      try{
        symptomFolder = tempDirectory + "temp/";
        if (!fs.existsSync(symptomFolder)) {
          fs.mkdirSync(symptomFolder);
        }
        console.log(`step.1 dicom saved.`);
        callback();
      }catch(e){
        console.error(e);
        res.status(500).send(e);
      }
    }

    // 2. 把接到的dicom們丟在暫存資料夾底下
    function step2(callback){
      try{
        // 2. 把接到的dicom們丟在暫存資料夾底下
        //把dicom traverse 到暫存資料夾底下
        const files = req.files;
        // 沒有收到dicom檔就噴error
        if(!req.files){
          throw "no dicom files uploaded.";
        }
        // Traverse dicom array 到指定暫存資料夾
        files.forEach((file, index) => {
          const filePath = file.path;
          const fileOriginalname = symptomFolder + file.originalname;
          fs.rename(filePath, fileOriginalname, (err) => {
            if (err) {
              throw "move dicom to temporary folder failed." ;
            }
          });
        });
        console.log(`step.2 move dicom to temporary folder.`);
        callback();
      }catch(e){
        console.error(e);
        res.status(500).send(e);
      }
    }

    var appendFileName = "append.csv"

    // 3. 對暫存資料夾執行ldcm2csv[append_csv]
    function step3(callback){
      try{
        symptomCSVname = csvTempDirectory + appendFileName;
        const args = ["+pf", DCMTK_TOOL_LDCM2CSV_PROFCSV, "+web", DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG, symptomFolder, symptomCSVname];
        execFile(DCMTK_TOOL_LDCM2CSV, args, (error, stdout, stderr) => {
          if (error) {
            throw "execute ldcm2csv failed." ;
          }
          console.log("step.3 to index file done.")
          callback();
        })
      }catch(e){
        console.error(e);
        res.status(500).send(e);
      }
    }

    var indexFileUrl = '';   // 要下載的檔案 URL
    var indexFilePath = '';  // 要儲存的檔案路徑
    var indexFileName = "index.csv" // 檔案名稱
    var indexFileUploadName = ''; // 要patch回去的name欄位

    // 4. 針對接到的resource_id，抓下csv檔URL
    function step4(callback){
      // 索引檔resource_id
      const index = req.body.id;
      const header = req.headers.authorization;
      //拉csv的下載URL
      axios.get(`${ckanGetResource}`,
      {
        params: {
          id: index
        },
        headers: {
          Authorization: header
        }
      })
      .then(getRes => {
        console.log('step.4 get symptom index file downloading url');
        indexFileUrl = getRes.data.result.url;
        indexFilePath = `${csvTempDirectory}${indexFileName}`;
        indexFileUploadName = getRes.data.result.name;
        
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    // 5. 將上項的CSV URL存到csv_temp[index_csv]
    function step5(callback){
      const writer = fs.createWriteStream(indexFilePath);
      const header = req.headers.authorization;
      axios({
        method: 'GET',
        url: indexFileUrl,
        responseType: 'stream',
        headers:{
          Authorization: header
        }
      })
      .then(response =>{
        response.data.pipe(writer)
      })
      .then(
        writer.on('finish', () => {
          console.log(`step.5 download completed: ${indexFilePath}`);
          callback();
        })
      )
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }
    
    // 6. 讀取append_csv資料列，append進index_csv[new_csv]
    // 要判斷SOPinstanceUID不重複
    function step6(callback){
      // 讀取append.csv
      var appendCSVdata = [];
      var appendCSVdataString = [];

      fs.createReadStream(symptomCSVname)
      .on('data', (row) => {
        appendCSVdata.push(row);
      })
      .on('end' , () => {
        // console.log('step.6 append.csv read complete.');
        appendCSVdataString = appendCSVdata.toString().split('\n')
        try{
          // i=1:排除header column
          for(var i = 1 ; i < appendCSVdataString.length; i++){
            var newline = "";
            if(i != appendCSVdataString.length - 1){
              newline = "\n";
            }else{
              newline = "";
            }
            fs.appendFileSync(indexFilePath, appendCSVdataString[i] + newline);
          }
          console.log("step.6 index.csv is appended.")
          callback()
        }catch(e){
          console.log("fail to append index.csv")
        }
      })
      .on('error', (error) => console.log(error));
    }

    // 7. 將new_csv patch到ckan
    function step7(callback){
      try{
        if(!req.body.id){
          throw "id of index is required.";
        }
      }catch(e){
        console.error(e);
        res.sendStatus(500);
      }
      const indexID = req.body.id;

      //前端post過來的OauthToken
      const header = req.headers.authorization;
      //包成key-value
      const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};

      //宣告formdata物件
      const formData = new FormData();
      formData.append('id', indexID);
      if(req.body.description){
        const description = req.body.description;
        formData.append('description', description);
      }
      formData.append('name', indexFileUploadName);
      const indexFile = fs.readFileSync(indexFilePath);
      const blob = new Blob([indexFile])
      formData.append('upload', blob, indexFileUploadName+".csv")

      axios.post(`${ckanPostResourcePatch}`,formData,{headers})
      .then(getRes => {
        // console.log("ckan patch index file status:"+getRes.data.success);
        console.log("step.7 index patched.")
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    // 8. 將暫存資料夾及其底下的dicompost到raccoon
    function step8(callback){
      const formData = new FormData();
      const dcmFiles = fs.readdirSync(symptomFolder);
      try{
        // 把暫存目錄下的dicom檔丟進formdata
        for(let i = 0 ; i < dcmFiles.length ; i++){
          // console.log(dcmFiles[i]);
          const fileStream = fs.readFileSync(symptomFolder+dcmFiles[i]);
          const blob = new Blob([fileStream]);
          formData.append('file', blob, dcmFiles[i]);
          //console.log(symptomFolder+dcmFiles[i]+" appended.")
        }
      }catch(e){
        const ErrMes = 
        {
          success: false,
          possible_reason:
            [
              "read file failed."
            ]
        }
        const ErrMesJSON = JSON.stringify(ErrMes, null, 2);
        console.error(ErrMesJSON);
        res.status(500).send(ErrMesJSON);
      }
      
      const headers = {'Content-Type': 'application/dicom', 'Accept': 'application/dicom'};

      // post到raccoon出問題
      axios.post(`${raccoonPost}`, formData, {
        headers: headers
      })
      .then(getRes => {
        const resData ={
          uploaded_StudyInstanceUID: getRes.data.successFHIR
        }
        const resJSONdata = JSON.stringify(resData, null, 2);
        res.send(resJSONdata)
        //console.log("successFHIR="+JSON.stringify(getRes.data.successFHIR));
        console.log("step.8 post dicom to pacs done.")
        callback();
      })
      .catch(err => {
        console.log(raccoonErrMesJSON)
        res.status(500).send(raccoonErrMesJSON);
      })
    }

    // 9. 刪除暫存資料夾及其底下的dicom
    function step9(callback){
      try{
        const dcmFiles = fs.readdirSync(symptomFolder);
        // 把暫存目錄下的dicom檔砍光
        for(let i = 0 ; i < dcmFiles.length ; i++){
          // console.log(dcmFiles[i]);
          fs.unlinkSync(symptomFolder + dcmFiles[i]);
          // console.log(symptomFolder + dcmFiles[i]+" deleted.")
        }
        // 砍掉暫存資料夾
        fs.rmdirSync(symptomFolder);
        console.log('step.9 remove temporary dicom file done.');
        callback();
      }catch(e){
        console.error("delete dicom folder / files failed.");
        res.sendStatus(500);
      }
    }

    // 10. 刪除csv_temp底下所有檔案
    function step10(callback){
      try{
        const csvFiles = fs.readdirSync(csvTempDirectory);
        // 把暫存目錄下的dicom檔砍光
        for(let i = 0 ; i < csvFiles.length ; i++){
          // console.log(csvFiles[i]);
          fs.unlinkSync(csvTempDirectory + csvFiles[i]);
          // console.log(csvTempDirectory + csvFiles[i]+" deleted.")
        }
        console.log('step.10 remove temporary index file done.');
        console.log("***\nall studies append procedure are done.\n***")
        callback();
      }catch(e){
        console.error("delete index files failed.");
        res.sendStatus(500);
      }
    }
}
//put

//delete
exports.postStudiesDelete = async (req, res) => {
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
    .seq(function(){
      var seq_this = this;
      step5(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step6(function() {seq_this();});
    })
    .seq(function(){
      var seq_this = this;
      step7(function() {seq_this();});
    })

    //req.body應有參數

    /*
      indexID: 要更動的索引檔resource_id
      StudiesInstanceUID: 要刪除索引檔的影像UID陣列
    */

    /*
      V 1. 依indexID --resource_show?id={...}--> 存resource的url -> fileURL
      V 2. 訪問URL下載索引檔到指定暫存目錄
      V 3. 刪除索引檔內指定StudiesInstanceUID列
      V 4. 將索引檔patch回ckan
      V 5. 刪除暫存索引檔
      V 6. 刪除raccoon的指定影像
      V 7. response {success:[?]}
    */

    var indexFileUrl = '';   // 要下載的檔案 URL
    var indexFileName = 'index.csv';  // 檔案名稱
    var indexFilePath = '';  // 要儲存的檔案路徑

    // 索引檔resource_id
    const index = req.body.indexID;
    const header = req.headers.authorization;

    function step1(callback){
      //拉csv的下載URL
      axios.get(`${ckanGetResource}`,
      {
        params: {
          id: index
        },
        headers: {
          Authorization: header
        }
      })
      .then(getRes => {
        indexFileUrl = getRes.data.result.url;
        indexFilePath = `${csvTempDirectory}${indexFileName}`;
        console.log('step.1 get symptom index file downloading url');

        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    function step2(callback){
      const writer = fs.createWriteStream(indexFilePath);
      axios({
        method: 'GET',
        url: indexFileUrl,
        responseType: 'stream',
      })
      .then(response =>{
        response.data.pipe(writer)
      })
      .then(
        writer.on('finish', () => {
          console.log(`step.2 download completed: ${indexFilePath}`);
          callback();
        })
      )
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }
    
    const deleteItemArray = req.body.StudyInstanceUID;

    function step3(callback){
      try{
        // 讀取csv檔案
        fs.readFile(indexFilePath, (err, data) => {
          if(err){
            throw "fail to read file.";
          }
          const dataString = data.toString();
          const studiesInstaceArray = dataString.split('\n');

          // 用 filter 過濾在刪除名單內的影像
          const studiesInstaceFiltered = studiesInstaceArray.filter(item => {
            // 用 some 檢查索引檔內的影像列，有沒有包含任何要求刪除的UID
            // 只 return 「不包含在刪除名單的影像列」
            return !deleteItemArray.some(deleteItem => item.includes(deleteItem));
          });

          // 用換行合併陣列成字串
          const studiesInstaceFilteredString = studiesInstaceFiltered.join('\n');
          // 覆蓋原本的索引檔
          fs.writeFile(indexFilePath, studiesInstaceFilteredString, (err) => {
            if (err) {
              console.error('Error writing file:');
            }
            console.log('step.3 index.csv written successfully.');
            callback();
          });
        })
      }catch(err){
        console.log(err)
        res.sendStatus(500)
      }
    }

    function step4(callback){
      var description = "";
      if(req.body.description){
        description = req.body.description;
      }
      //包成key-value
      const headers = {"Authorization": header, "Content-Type": "multipart/form-data"};
      const formData = new FormData();
      formData.append('id', index);
      if(req.body.description){
        formData.append('description', description);
      }
      formData.append('format', 'csv');
      const fileStream = fs.readFileSync(indexFilePath);
      const blob = new Blob([fileStream]);
      formData.append('upload', blob, indexFilePath);
      //對ckan平台做post請求
      axios.post(`${ckanPostResourcePatch}`,formData,{headers})
      .then(getRes => {
        // console.log(getRes.data);
        console.log("step.4 patch index file done.")
        callback();
      })
      .catch(err => {
        console.log(err.response.data.error)
        res.status(500).send(axiosErrMesJSON);
      })
    }

    function step5(callback){
      try{
        // 砍暫存檔案
        fs.unlink(indexFilePath, (error) => {
          if (error) {
            throw "fail to remove temporary index file."
          }
          callback();
        });
      }catch(err){
        console.log(err)
        res.status(500).send(err);
      }
    }

    async function step6(callback){
      console.log("step.6 delete processing ...")
      for (const item of deleteItemArray) {
        await axios.delete(`${raccoonImagingStudyFHIR}/${item}`)
        .then(getRes => {
          console.log(`${item} done.`)
        })
        .catch(err => {
          console.log(raccoonErrMesJSON)
          res.status(500).send(raccoonErrMesJSON);
        })
      }
      callback();
    }

    function step7(callback){
      const resData = {
        success: true,
        deletedDICOM: deleteItemArray
      }
      const resJSONdata = JSON.stringify(resData, null, 2);
      res.send(resJSONdata);
      callback();
    }
}