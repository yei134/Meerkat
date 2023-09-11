# api@1.4.5 變動 2023/09/12

### 完成進度
#### DEBUG DONE
1. raccoonAPI_controller.js & ckanAPI_controller.js
  > 宣告變數、function統一放置`variables.js`

#### UPDATE DONE

### Discussion List
1. 以組織管理身分的token，create維護人員的token<br>
2. ckan的GROUP功能不符合目前的組織-部門階層架構，要用資料庫去實現？
  > 資料庫實現 -> table規劃
  > 廢除部門架構 -> 廢除相關api及其前端操作

### UPDATE清單
1. SSL<br>
2. 跟目錄的README部屬手續<br>
3. Certbot的dockerfile和docker-compose<br>
4. 上傳整個資料夾做新增資料集

#### /api/ckan/
1. package_publish -> 開放共享資料集（package_patch -> 公有資料集）<br>
2. package_archive -> 封閉共享資料集（刪除共有資料集）<br>
3. package_group_append -> up<br>
4. package_group_delete -> up<br>

##### 管理系列
1. post api_token_create -> 給該使用者創建token
  > 用使用者apikey創建meerkat的token?
2. get api_token_list -> 列出該使用者名下的token
  > {headers:<token>}

#### /api/raccoon/
1. 以PatientID欄位刪除其複數個Study<br>
2. 以raccoon既有影像添加index(QIDO索引)<br>
3. index_delete

### High Priority DEBUG清單
1. resource_patch｜對應公私有資料集
2. package_create -> 若遇到remain的私有資料集要怎麼判斷？

### Low Priority DEBUG清單
1. resource_delete dependency issue<br>
2. studiesDelete改QIDO<br>
3. postgresql<br>

### Memo 清單
1. 重複功能寫獨立function(寫讀檔、resource_patch、axios)<br>
2. 非axios功能的catch要抓好<br>
2-1. 必填參數設throw<br>
3. 必填欄位未填寫throw error和res.status(500).send({something})<br>
4. res.send() -> 簡潔化(多項目只回200、單項目僅回id)<br>
4-1. 審視每個api的response<br>