# api@1.3.0 變動 2023/08/28

### 完成進度
#### DEBUG DONE
1. package_create
  > package_name禁止含有`-type-private`字樣
2. package_create欄位修改
  > 修改描述文欄位 note -> notes
3. package_create & package_patch
  > axios.post function化

#### UPDATE DONE
1. package_patch -> up<br>
2. package_patch -> 公私有同步更新<br>
2-1. package_patch -> 檢視是否傳送私有格式<br>

### Discussion List
1. 會有刪除共享資料集的時候嗎？
  > 會
1-1. 有的話索引檔也要全部刪除？
  > 對，僅索引檔
2. ckan的package_delete非完全刪除。也就是說，刪除狀態的資料集還可以持續被更動，會需要徹底清除（dataset_purge）嗎？
  > 會，目前僅需要purge
3. resource_delete -> 公私有的附件關聯性怎麼處理？
  > 暫時藉由private resource的description欄位存放public resource id
  > 用private去depend public，要delete public only的時候要考慮一下檔案先cretae回private再刪掉
4. keycloak版本正式機跟測試機的差異？
  > 正式ver.16.1.1

### UPDATE清單
1. SSL<br>

#### /api/ckan/
1. 以組織管理身分的token，create維護人員的token<br>
2. package_publish -> 開放共享資料集（package_patch -> 公有資料集）<br>
3. package_archive -> 封閉共享資料集（刪除共有資料集）<br>

#### /api/raccoon/
1. 以PatientID欄位刪除其複數個Study<br>
2. studies -> limit(傳幾筆)begin(從第n開始)參數<br>

### High Priority DEBUG清單

### Low Priority DEBUG清單
1. 重複功能寫獨立function(寫讀檔、resource_patch、axios)<br>
2. 非axios功能的catch要抓好<br>
2-1. 必填參數設throw<br>
3. studiesDelete改QIDO<br>
4. 必填欄位未填寫throw error和res.status(500).send({something})<br>
5. res.send() -> 簡潔化(多項目只回200、單項目僅回id)<br>
5-1. 審視每個api的response<br>

### 2023/05/07後端開啟的API

# 測試express
```
get localhost:9000
```
正常響應頁面：Express Welcom to Express<br>

# 對CKAN的GET請求
## 確認GET API
```
get localhost:9000/api/ckan/
```
正常頁面響應：ckan get api working well.<br>
正常命令響應：ckan get api working well.<br>
## 獲得所有資料集列表
```
get localhost:9000/api/ckan/package_list
```
正常頁面響應：資料集之name的json格式<br>
正常命令響應：200 or 304<br>
## 獲得指定資料集資訊
```
get localhost:9000/api/ckan/package_show
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
localhost:9000/api/ckan/package_show?datasetName=x-ray
```
## 獲得資料集列表（附帶查詢、限制筆數等參數）
```
get localhost:9000/api/ckan/package_search
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
get localhost:9000/api/ckan/package_search?limit=8
```

## 獲得群組列表
```
get localhost:9000/api/ckan/group_list
```
正常頁面響應：群組清單<br>
正常命令響應：200 or 304<br>
```
ex.
get localhost:9000/api/ckan/group_list
```

## 獲得標籤列表
```
get localhost:9000/api/ckan/tag_list
```
正常頁面響應：標籤清單<br>
正常命令響應：200 or 304<br>
```
ex.
get localhost:9000/api/ckan/ta_list
```

## 獲得組織列表
```
get localhost:9000/api/ckan/organization_package_list
```
正常頁面響應：群組清單<br>
正常命令響應：200 or 304<br>
```
ex.
get localhost:9000/api/ckan/organization_list
```

## 獲得指定群組資料集列表
```
get localhost:9000/api/ckan/group_package_list
```
正常頁面響應：指定群組的資料集清單<br>
正常命令響應：200 or 304<br>
#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的group_id 或 group_name

```
ex.
get localhost:9000/api/ckan/group_package_list?id=medical-image
```

## 獲得指定標籤資料集列表
```
get localhost:9000/api/ckan/tag_package_list
```
正常頁面響應：指定標籤的資料集清單<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的tag_id 或 tag_name

```
ex.
get localhost:9000/api/ckan/tag_package_list?id=mri
```

## 獲得指定組織資料集列表
```
get localhost:9000/api/ckan/organization_package_list
```
正常頁面響應：指定群組的資料集清單<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的org_id 或 org_name

```
ex.
get localhost:9000/api/ckan/organization_package_list?id=national-taipei-university-of-nursing-and-health-scienses
```

## 獲得指定群組資訊
```
get localhost:9000/api/ckan/group_info
```
正常頁面響應：指定群組資訊列表<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的`group_id`或`group_name`

```
ex.
get localhost:9000/api/ckan/group_info?id=drone
```

## 獲得指定標籤資訊
```
get localhost:9000/api/ckan/tag_info
```
正常頁面響應：指定標籤資訊列表<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的`tag_id`或`tag_name`

```
ex.
get localhost:9000/api/ckan/tag_info?id=mri
```

## 獲得指定群組資訊
```
get localhost:9000/api/ckan/organization_info
```
正常頁面響應：指定組織資訊列表<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### 指定參數之定義
#### params
1. id<br>
  > 要查詢的`org_id`或`org_name`

```
ex.
get localhost:9000/api/ckan/organization_info?id=national-taipei-university-of-nursing-and-health-scienses
```

# 對CKAN的POST請求
## 確認POST API
```
post localhost:9000/api/ckan/
```
正常頁面響應：ckan post api working well.<br>
正常命令響應：ckan post api working well.<br>

## 創建資料集
```
post localhost:9000/api/ckan/package_create
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
7. notes(資料集的描述說明欄位)<br>
8. **\*owner_org(資料集的擁有組織)**<br>
9. groups(資料集的擁有組織)<br>
10. **\*private(請固定為false，私有的true由後端送出)**<br>

## 編輯資料集
```
post localhost:9000/api/ckan/package_patch
```
正常頁面響應：{`status`: {`private`: `200`},{`public`: `200`}}<br>
### (必要)Header參數
```
Authorization
```

### body指定參數之定義(非全數，\*為必填)
1. **\*id(資料集的name/id欄位)**<br>
2. title(資料集的標題欄位)<br>
3. author(資料集的作者欄位)<br>
4. author_email(資料集的作者電郵欄位)<br>
5. maintainer(資料集的維護者欄位)<br>
6. maintainer_email(資料集的維護者電郵欄位)<br>
7. notes(資料集的描述說明欄位)<br>
8. owner_org(資料集的擁有組織)<br>
9. groups(資料集的擁有組織)<br>

## 對指定資料集添加附件
```
post localhost:9000/api/ckan/resource_create
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
post localhost:9000/api/ckan/index_create
```
### (必要)Header參數
```
Authorization
```
正常頁面響應：
> {`id`:索引檔id,`indexName`:索引檔標題}

<br>

### application/json指定參數之定義
1. **\*package_id(指定資料集之name欄位，需為私有資料集格式)**<br>
2. symptoms(病徵名稱陣列)<br>
> 非包含_[type]_的特殊命名方式

## 對指定附件更新資訊
```
post localhost:9000/api/ckan/resource_patch
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
delete localhost:9000/api/ckan/resource_delete
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

## 獲得篩選條件資料集列表
```
post localhost:9000/api/ckan/package_filter
```
正常頁面響應：{success:200,conditions:[條件列表],data:[資料集列表]}<br>
正常命令響應：200 or 304<br>

#### headers
Authorization(ckan token)
### application/json指定參數之定義
1. package_search:{searchQuery,begin,limit}<br>
2. group_package_list:{`id`}<br>
3. tag_package_list:{`id`}<br>
4. organization_package_list:{`id`}<br>
> 若不存在上述任何一個條件，則會被回傳`403`

# 對病徵索引做GET請求
```
get localhost:9000/api/raccoon/studies
```
正常頁面響應：dicom檔的指定8個tag列<br>
### params指定參數之定義
1. **\*id(指定索引檔之id欄位)**
```
ex.
localhost:9000/api/raccoon/studies?id=0fff9e61-1a98-40e8-a3d4-3b5756e3a9d4
```

# 【廢棄】對RACCOON做POST請求 & 新增索引檔
## 對空的病徵做新索引檔
```
post localhost:9000/api/raccoon/studiesNew
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
localhost:9000/api/raccoon/studiesNew
```

## 對既有的病徵追加影像
```
post localhost:9000/api/raccoon/studiesAppend
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
localhost:9000/api/raccoon/studiesAppend
```



# 對RACCOON做DELETE請求 & 刪除索引檔影像

## 對既有的病徵刪除影像
```
delete localhost:9000/api/raccoon/studiesDelete
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
localhost:9000/api/raccoon/studiesDelete
```