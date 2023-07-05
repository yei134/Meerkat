# 執行Meerkat專案步驟 #

1.Meerkat/client執行npm install進行安裝前端套件<br>
2.Meerkat/api執行npm install進行安裝後端套件<br>
3.Meerkat/client執行npm start啟動前端<br>
4.Meerkat/api執行npm start啟動後端<br>

# 前端(client)環境變數設置

Meerkat/client/.env<br>
REACT_APP_BACKEND_URI=http://localhost:9000/<br>
<br>
（開發環境訪問時請設置localhost。）<br>

# 後端(api)環境變數設置

Meerkat/client/.env<br>
CKAN_BASE_URI_2=https://data.dmc.nycu.edu.tw/api/3/action/<br>
CKAN_BASE_URI=https://sharing.v6.rocks/api/3/action/<br>
MONGODB_BASE_URI=mongodb://Meerkat:MeerkatMongoDB@localhost:27017/Meerkat<br>
RACCOON_BASE_URI=https://raccoon.dicom.org.tw/api/fhir/ImagingStudy/<br>
<br>
（CKAN_BASE_URI為擁有最高權限之測試平台，若無特殊情況請使用這個網址。）<br>

# 後端API #

# 2023/05/07後端開啟的API

# 測試express #
localhost:9000<br>
正常響應頁面：Express Welcom to Express<br>
<br>

# 對CKAN的GET請求 #
localhost:9000/ckanAPI/<br>
正常頁面響應：ckan get api working well.<br>
正常命令響應：ckan get api working well.<br>
<br>
localhost:9000/ckanAPI/package_list<br>
正常頁面響應：資料集之name的json格式<br>
正常命令響應：200 or 304<br>
<br>
localhost:9000/ckanAPI/package_show<br>
正常頁面響應：指定資料集之詳細資訊的json格式<br>
正常命令響應：200 or 304<br>
指定參數之定義：<br>
datasetName(資料集的name欄位)<br>
<br>
ex.<br>
localhost:9000/ckanAPI/package_show?datasetName=x-ray<br>

# 對CKAN的POST請求 #

localhost:9000/ckanAPI/package_create<br>
正常頁面響應：新增資料集<br>
正常命令響應：200<br>
<br>
※詳細參數說明請見redmine的資料上傳介面文件※<br>
<br>
(必要)Header參數：<br>
Authorization(Token)<br>
<br>
(非全數，\*為必填)body指定參數之定義：<br>
name(資料集的name欄位)\*<br>
title(資料集的標題欄位)\*<br>
author(資料集的作者欄位)<br>
maintainer(資料集的維護者欄位)<br>
note(資料集的描述說明欄位)<br>
owner_org(資料集的擁有組織)\*<br>
groups(資料集的擁有組織)<br>

# 對病徵索引做GET請求 #

localhost:9000/raccoonAPI/studies<br>

正常頁面響應：大量的instanceID列<br>
指定參數之定義：<br>
datasetName(資料集的name欄位)<br>
symptom(病徵索引標題名稱)(datasetName_[type]_symptomName)<br>

ex.<br>
localhost:9000/raccoonAPI/studies?datasetName=ihd-ct&symptom=any<br>

# Mongo資料庫設定 #

參照：https://www.guru99.com/mongodb-create-user.html<br>
繪語的MongoDB Windows10設定手冊：https://hackmd.io/@honoxarashi0301/Bk8LLK-Pn<br>
使用者名稱：Meerkat<br>
使用者密碼：MeerkatMongoDB<br>
使用者角色：userAdmin<br>
角色應對資料庫：Meerkat<br>
port:27017<br>

# POST Mongo資料庫 #

# 2023/07/04開啟的API

localhost:9000/document/docUpload<br>

正常頁面響應：檔案路徑<br>
(請將此項路徑代入/formUpload的applicantID)<br>
指定參數之定義：<br>
proposalFile(表單中，檔案ㄉ欄位名稱)
<br>

localhost:9000/document/formUpload<br>

正常頁面響應：200<br>
<br>
指定參數之定義：<br>
name(申請人ckan帳號ID)<br>
orgnization(所屬組織)<br>
applicantID(存放在本機端ㄉ位址，預設是跟Meerkat同一層的檔案夾proposals)<br>
telephone(手機號碼)<br>
datasetID(資料集ID)<br>
maintainer(審核人ckan帳號ID)<br>
applyTime(請使用JS的Date函數)<br>

# GET Mongo資料庫 #

localhost:9000/document/accountDocs<br>

正常頁面響應：200<br>
該帳戶所申請的文件列表<br>
<br>
指定參數之定義：<br>
account(指定帳戶ID)<br>

# 2023/07/04變動

/Meerkat/api/routes<br>
新增Doc.js(MongoDB)、新增mongo_conf.js(MongoDB之連結設定)<br>
移除users.js、移除testAPI.js、移除ckan_get.js、移除ckan_post.js、移除raccoon_get.js、移除raccoon_get.js<br>
<br>
/Meerkat/api<br>
npm install mongodb<br>
npm install multer(用作讀取上傳檔案之套件)<br>
新增/uploads目錄(用作暫存放上傳檔案之目錄)<br>
新增/csv_temp目錄(暫時存放索引檔之目錄，讀取索引檔用)<br>
<br>
/proposals<br>
用作存放申請文件附件的目錄<br>
