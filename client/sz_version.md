# 20230416

## 目標:

### 預定

將表單上的東西先暫存到json

* constants.js
  * api_get_data_newSet:
  取得db.json中data項目下newSet中暫時存取的物件
  * api_default:
  ckan預設網址
  * ckan_api_get_organization_autocomplete:
  取得ckan中organization的id，之後用來創建dataset時使用的
* db.json
  * 新增data階層
  > posts
  > data
  >> newSet
  >>> name
  >>> title
  >>> note
  >>> private
  >>> groups
  >>> ownerOrg
* src/newDataset/index.js
  * `import { api_get_data_newSet } from "../../global/constants";`
  載入constants.js中設定好的api
  * 修改原有的async function的變數名稱
* src/newDataset/componenets/edit.js
  * 新增按鈕處理方法
    * btn_reset():清空已經填寫好的內容
    * btn_submit():將填寫好的內容放入json中
    * btn_cancel():*待寫*，等主頁面好了改寫


### 希望

從ckan的api取資料當選項

### 夢想

刻劃資料集索引介面

## 待處理的新問題

* scr/pages/newdataset/index.js:putDataset要補ckan的api

# 20230417

## 目標:

### 預定

資料集資料顯示頁面大致框架

* index
  * header
  * content
    * conleft
    * conright

### 希望

按鈕連結

### 夢想

撈API

# 20230418

## 目標

### 預定
datasetList html
* index
  * header
  * content
    * list
### 希望
datasetInfo api
筆記:
* sy提供的參考:[網址](https://www.muji.dev/2021/04/03/react-compound-component/)
### 夢想
datasetList css

# 20230419

## 目標

### 預定
成功讀取api

### 希望
完成datalist的內容渲染

### 夢想
寫newdataset的自動渲染

## 意外
由於前端api無法直接取得需要後端來協助

### 19&20目標規劃
學習[網址](https://www.youtube.com/playlist?list=PLliocbKHJNwvbitOJ73M04PUoJae79kEg)
* 19
  * 影片1~15集
  * 更新練習檔案nodeReact
  * 實際:1~5
* 20
  * 影片16~25集
  * 更新練習檔案nodeReact

## 開會
* 討論:資料部分 資料集需要超過一個索引檔 分類依據疾病類別
  * 資料集分類依據疾病，例如:大腿骨X光
  * 資料索引檔依據疾病類型，例如:開放性骨折，閉鎖性骨折，粉碎性骨折
* 資料管理:
	* 上傳dicom:
		* 選擇資料集-選擇徵狀-選擇要上傳的檔案-點選上傳-(後端:產生索引檔-更新ckan)，如果要上傳其他徵狀可直接切換
	* 管理dicom:
		* 選擇資料集-選擇徵狀
	* 審核申請:
		* 查看申請-確認是否通過
* 資料使用:
	* 瀏覽資料:
    * 去CKAN拿所有資料集列表-選擇要的資料集-顯示相關資料(包含附件、DICOM索引直接顯示，要申請下載的話，點選上方資料申請按鈕)-若沒登入先登入-填寫申請表-送出
* 與老師討論結果
  * 使用者還沒取得權限前可以看到哪些資料 附件可以下載 DICOM的索引檔只可見檔名 
  * 使用者需要下載的意義是甚麼 沒有
  * ZIP裡面要包含甚麼 資料集 徵狀 沒有確定 可能是其他形式
  * DICOM要怎麼下載 去CKAN再回傳 直接去RACCOON 老師不知道
  * RACCOON SERVER是甚麼
    * 資料使用者是申請CSV可視權
    * 學長會有一個程式碼 去核對RACCOON的白名單

# 20230420
## 目標
### 預定
趕上昨天計畫
* 沒趕上
* 今日進度:
  * 影片6&7
  * 寫config switch 建立test
    * config建立共同調用參數
    * switch建立router功能
    * test 成功用express建立post method's rest api
### 希望
早點回家
### 夢想
睡覺

# 20230421
## 目標
### 預定
把教程結束
* 影片8-13
* 後面是mongoDB的 所以暫時沒有學
### 希望
早點回家
### 夢想
睡覺

# 20230422
## 目標
### 預定
把node&react串接的範例跑起來
#### 參考網址:
* [freeCodeCamp(主要)](https://www.freecodecamp.org/chinese/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together/)
* [稀土掘金](https://juejin.cn/post/7034445513571172366#heading-0)
### 希望
整合到專案
#### 目前已經確定可以在專案中執行，接下來需要確認各個介面的需求依序放入對應的api，另外由於加入後端的緣故所以github上資料夾的架構有所變化，以下是資料夾的架構變化
* Meerkat
  * client
    * 前端:放置react
  * api
    * 後端:放置node
  * node_modules
### 夢想
合併css檔案

# 20230423
## 目標
### 預定
把datasetList介面用api的方式放入
### 希望
將css整合
### 夢想
把datasetinfo的api放入

# 模板:
## 目標
### 預定
### 希望
### 夢想