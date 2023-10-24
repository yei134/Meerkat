# 執行Meerkat
## by NPM
```
git clone https://github.com/yei134/Meerkat.git
待更新
```
## by docker-compose
```
docker-compose up -d
```
# NGINX config之設定
ssl以及certbot以及certbot待更新
```
server_name={請修改成自己的網域名稱}
```
```
sudo mv ./nginx/meerkat.conf /etc/nginx/sites-enable/meerkat.conf
```
# 前端(client)環境變數開發設置
```
Meerkat/client/.env
```
REACT_APP_RACCOON_URI=https://`raccoon.dicom.org.tw`/<br>
REACT_APP_BACKEND_URI=http://`localhost:9000`/<br>
> 開發環境訪問時請設置`localhost`

# 後端(api)環境變數開發設置
```
Meerkat/api/.env
```
CKAN_BASE_URI=https://sharing.v6.rocks/api/3/action/<br>
> `CKAN_BASE_URI`為擁有最高權限之測試平台，若無特殊情況請使用這個網址。

DCMTK_TOOL_LDCM2CSV=./cmake/ldcm2csv<br>
DCMTK_TOOL_LDCM2CSV_DICOMWEB_CONFIG=./cmake/dicomweb.config<br>
DCMTK_TOOL_LDCM2CSV_PROFCSV=./cmake/prof.csv<br>

MONGODB_BASE_URI=mongodb://Meerkat:MeerkatMongoDB@localhost:27017/Meerkat<br>
RACCOON_BASE_URI=https://raccoon.dicom.org.tw/<br>

# Meerkat 對於 Ckan 的相關特殊命名格式

#### 索引檔
`{package_id}_[type]_{symptom}`
#### 公私資料集link
`-type-private`
#### 公私附件檔link
`public resource uid:`