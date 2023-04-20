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
### 希望
datasetInfo api
### 夢想
datasetList css