# api@1.0.0 變動

### 完成進度
#### DEBUG DONE

#### UPDATE DONE
1. /api/package.json
> 上了版本號方便辨認，本次push是1.0.0
2. resource_delete -> 碰到特殊格式就噴錯誤<br>
3. resource_create -> 公私有同步更新 -> 移除前端的description欄位用做公開附件連結<br>
4. resource_create -> 禁止特殊格式<br>
5. resource_delete -> 公私有同步更新<br>
6. resource_create -> 有考慮私有資料集only的case<br>
7. resource_delete -> 有考慮私有資料集only的case<br>

### Discussion List
1. 會有刪除共享資料集的時候嗎？<br>
1-1. 有的話索引檔也要全部刪除？<br>
2. ckan的package_delete非完全刪除。也就是說，刪除狀態的資料集還可以持續被更動，會需要徹底清除（dataset_purge）嗎？<br>
3. resource_delete -> 公私有的附件關聯性怎麼處理？<br>
> 暫時藉由private resource的description欄位存放public resource id

### UPDATE清單
1. DockerFile<br>
2. DockerCompose<br>
3. nginx.conf

#### /ckanAPI/
1. 以組織管理身分的token，create維護人員的token<br>
2. package_patch -> up<br>
3. package_patch -> 公私有同步更新<br>
4. package_publish -> 開放共享資料集（package_patch -> 公有資料集）<br>
5. package_archive -> 封閉共享資料集（刪除共有資料集）<br>

#### /raccoonAPI/
1. 以PatientID欄位刪除其複數個Study<br>
2. studies -> limit(傳幾筆)begin(從第n開始)參數<br>

### High Priority DEBUG清單

### Low Priority DEBUG清單
1. 重複功能寫獨立function(寫讀檔、resource_patch)<br>
2. 非axios功能的catch要抓好<br>
2-1. 必填參數設throw<br>
3. studiesDelete改QIDO<br>
4. 必填欄位未填寫throw error和res.status(500).send({something})<br>
5. res.send() -> 簡潔化(多項目只回200、單項目僅回id)<br>
5-1. 審視每個api的response<br>
6. 

### 2023/05/07後端開啟的API

# 測試express
```
get localhost:9000
```
正常響應頁面：Express Welcom to Express<br>

# 對CKAN的GET請求
## 確認GET API
```
get localhost:9000/ckanAPI/
```
正常頁面響應：ckan get api working well.<br>
正常命令響應：ckan get api working well.<br>
## 獲得所有資料集列表
```
get localhost:9000/ckanAPI/package_list
```
正常頁面響應：資料集之name的json格式<br>
正常命令響應：200 or 304<br>
## 獲得指定資料集資訊
```
get localhost:9000/ckanAPI/package_show
```
正常頁面響應：指定資料集之詳細資訊的json格式<br>
正常命令響應：200 or 304<br>

### 指定參數之定義
#### headers
Authorization(ckan token)
#### params
1. datasetName(資料集的name欄位)<br>

```
ex.
localhost:9000/ckanAPI/package_show?datasetName=x-ray
```
## 獲得資料集列表（附帶查詢、限制筆數等參數）
```
get localhost:9000/ckanAPI/package_search
```
正常頁面響應：在限制數量的範圍下返回資料集之詳細資訊<br>
正常命令響應：200 or 304<br>
> 若查詢參數皆空，就等同`package_list`功能
> 此項API預設都包含顯示`token範圍的private資料集`

### 指定參數之定義
#### headers
Authorization(ckan token)
#### params
1. searchQuery<br>
  > (string/查詢關鍵字用的，目前看下來是package_show內提到的資訊都可以查詢)
2. begin<br>
  > (int/限制從第n筆回傳資料)
3. limit<br>
  > (int/限制回傳的資料有n筆)

```
ex.
get localhost:9000/ckanAPI/package_search?limit=8
```

# 對CKAN的POST請求
## 確認POST API
```
post localhost:9000/ckanAPI/
```
正常頁面響應：ckan post api working well.<br>
正常命令響應：ckan post api working well.<br>

## 創建資料集
```
postlocalhost:9000/ckanAPI/package_create
```
正常頁面響應：{`package_id`: 資料集id}<br>
### (必要)Header參數
```
Authorization
```

### body指定參數之定義(非全數，\*為必填)
1. **\*name(資料集的name欄位)**<br>
2. **\*title(資料集的標題欄位)**<br>
3. author(資料集的作者欄位)<br>
4. author_email(資料集的作者電郵欄位)<br>
5. **\*maintainer(資料集的維護者欄位)**<br>
6. **\*maintainer_email(資料集的維護者電郵欄位)**<br>
7. note(資料集的描述說明欄位)<br>
8. **\*owner_org(資料集的擁有組織)**<br>
9. groups(資料集的擁有組織)<br>
10. **\*private(請固定為false，私有的true由後端送出)**<br>

## 對指定資料集添加附件
```
post localhost:9000/ckanAPI/resource_create
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：
> 200

<br>

> 要以`multipart/form-data`方式傳送，而不是`application/json`
### form-data指定參數之定義
1. **\*package_id(指定資料集之name欄位，需為私有資料集格式)**<br>
2. **\*resourceFile(檔案的欄位名稱，單次呼叫僅接受單個檔案)**
  > 附件命名規則：任意<br>
3. **\*resourceName(檔案名稱)**
  > 請以file.name欄位代入填寫，中文檔名編譯問題，破問題。

## 對指定資料集添加索引
```
post localhost:9000/ckanAPI/index_create
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：
> {`id`:索引檔id,`indexName`:索引檔標題}

<br>

### application/json指定參數之定義
1. **\*package_id(指定資料集之name欄位)**<br>
2. symptoms(病徵名稱陣列)<br>
> 非包含_[type]_的特殊命名方式

## 對指定附件更新資訊
```
post localhost:9000/ckanAPI/resource_patch
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：
> 請求成功`200`
> 請求失敗`500`

<br>

> 要以`multipart/form-data`方式傳送，而不是`application/json`
### form-data指定參數之定義(非全數，\*為必填)
1. **\*id(指定附件之id欄位)**<br>
2. resourceFile(檔案的欄位名稱)<br>
3. description(附件的說明欄位)<br>
4. name(附件的顯示名稱)<br>
>  附件命名規則：任意<br>



## 對指定附件進行刪除
```
delete localhost:9000/ckanAPI/resource_delete
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：
> {`success`: 成功的檔名陣列,`fail`: 失敗的檔名陣列}

<br>

### application/json指定參數之定義(非全數，\*為必填)
1. **\*resource_id(指定附件之id欄位，陣列型態)**<br>
> ex. {"resource_id": ["id1","id2"]}
> 僅需傳private的附件id即可



# 對病徵索引做GET請求
```
get localhost:9000/raccoonAPI/studies
```
正常頁面響應：dicom檔的指定8個tag列<br>
### params指定參數之定義
1. **\*id(指定索引檔之id欄位)**
```
ex.
localhost:9000/raccoonAPI/studies?id=0fff9e61-1a98-40e8-a3d4-3b5756e3a9d4
```



# 【廢棄】對RACCOON做POST請求 & 新增索引檔
## 對空的病徵做新索引檔
```
post localhost:9000/raccoonAPI/studiesNew
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：新增的dicom名稱列<br>
### form-data指定參數之定義
> 要以`multipart/form-data`方式傳送，而不是`application/json`
1. **\*dicomFiles(要上傳的dicom檔陣列)**<br>
2. **\*id(索引檔的resource_id)**<br>
3. description(索引檔的敘述)<br>
4. **\*indexName(索引檔的title)**<br>
  > 請直接回傳resources中的name欄位
```
ex.
localhost:9000/raccoonAPI/studiesNew
```

## 對既有的病徵追加影像
```
post localhost:9000/raccoonAPI/studiesAppend
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：追加的dicom名稱列<br>
### form-data指定參數之定義
> 要以`multipart/form-data`方式傳送，而不是`application/json`
1. **\*dicomFile(要上傳的dicom檔陣列)**<br>
2. **\*id(索引檔的resource_id)**<br>
3. description(索引檔的敘述)<br>
```
ex.
localhost:9000/raccoonAPI/studiesAppend
```



# 對RACCOON做DELETE請求 & 刪除索引檔影像

## 對既有的病徵刪除影像
```
delete localhost:9000/raccoonAPI/studiesDelete
```
### (必要)Header參數
正常頁面響應：
```
{
  success: true,
  deletedDICOM: 陣列
}
```
### json指定參數之定義
> 要以`application/json`方式傳送
1. **\*indexID(索引檔的resource_id)**<br>
2. **\*StudyInstanceUID(要刪除的影像StudyInstanceUID)**<br>
3. description(索引檔的敘述)<br>
```
ex.
localhost:9000/raccoonAPI/studiesDelete
```