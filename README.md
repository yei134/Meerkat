# 執行Meerkat專案步驟
```
1. Meerkat/執行npm install進行安裝CORS套件
2. Meerkat/client執行npm install進行安裝前端套件
3. Meerkat/api執行npm install進行安裝後端套件
4. Meerkat/client執行npm start啟動前端
5. Meerkat/api執行npm start啟動後端
```

# 前端(client)環境變數開發設置
```
Meerkat/client/.env
```
REACT_APP_BACKEND_URI=http://localhost:9000/<br>
> 開發環境訪問時請設置`localhost`

# 後端(api)環境變數開發設置
```
Meerkat/api/.env
```
CKAN_BASE_URI_2=https://data.dmc.nycu.edu.tw/api/3/action/<br>
CKAN_BASE_URI=https://sharing.v6.rocks/api/3/action/<br>
> `CKAN_BASE_URI`為擁有最高權限之測試平台，若無特殊情況請使用這個網址。

DCMTK_TOOL_LDCM2CSV={path}/{to}/ldcm2csv<br>
DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG={path}/{to}/dicomweb.config<br>
DCMTK_TOOL_LDCM2CSV_PROFCSV=prof.csv<br>

MONGODB_BASE_URI=mongodb://Meerkat:MeerkatMongoDB@localhost:27017/Meerkat<br>
RACCOON_BASE_URI=https://raccoon.dicom.org.tw/<br>

# Meerkat 對於 Ckan 的相關特殊命名格式

#### 索引檔
{package_id}\_[type]\_{symptom}
#### 資料集
-type-private