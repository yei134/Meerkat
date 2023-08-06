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
目前使用-->CKAN_BASE_URI=https://sharing.v6.rocks/api/3/action/<br>
<br>
（CKAN_BASE_URI為擁有最高權限之測試平台，若無特殊情況請使用這個網址。）<br>

# 前端目前改動
附件管理頁面
小視窗需下載modal<br>
 npm install react-modal<br>
1.actionbutton(刪除按鈕)<br>
可刪除但別亂刪正在使用的檔案
2.content(內容頁)<br>
3.conleft(左側區塊)<br>標題名稱         4.conright(右側區塊)<br>表格
5.uploadbutton(上船按鈕)<br>
功能待改，css可更動


