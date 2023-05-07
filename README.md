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
<br>
（CKAN_BASE_URI為擁有最高權限之測試平台，若無特殊情況請使用這個網址。）<br>

# 後端API #

# 2023/05/07後端開啟的API

# 測試express #
localhost:9000<br>
正常響應頁面：Express Welcom to Express<br>
<br>
localhost:9000/testAPI<br>
正常頁面響應：API is working properly<br>
正常命令響應：API is working properly<br>

# 對CKAN的GET請求 #
localhost:9000/ckan_get/<br>
正常頁面響應：ckan get api working well.<br>
正常命令響應：ckan get api working well.<br>
<br>
localhost:9000/ckan_get/package_list<br>
正常頁面響應：資料集之name的json格式<br>
正常命令響應：200 or 304<br>
<br>
localhost:9000/ckan_get/package_show<br>
正常頁面響應：指定資料集之詳細資訊的json格式<br>
正常命令響應：200 or 304<br>
指定參數之定義：<br>
datasetName(資料集的name欄位)<br>
<br>
ex.<br>
localhost:9000/ckan_get/package_show?datasetName=x-ray<br>

# 對CKAN的POST請求 #

localhost:9000/ckan_post/package_create<br>
正常頁面響應：新增資料集<br>
正常命令響應：200<br>
<br>
※詳細參數說明請見redmine的資料上傳介面文件※<br>
<br>
(必要)Header參數：<br>
Authorization(Token)<br>
<br>
(非全數，*為必填)body指定參數之定義：<br>
name(資料集的name欄位)*<br>
title(資料集的標題欄位)*<br>
author(資料集的作者欄位)<br>
maintainer(資料集的維護者欄位)<br>
note(資料集的描述說明欄位)<br>
owner_org(資料集的擁有組織)*<br>
groups(資料集的擁有組織)<br>