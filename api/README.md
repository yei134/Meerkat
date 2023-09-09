# api@1.4.3 變動 2023/09/10

### 完成進度
#### DEBUG DONE
1. package_member_edit & package_member_delete
  > 限制，僅處理`id`包含`-type-private`字樣之資料集

  > 同步處理公私有資料集
2. index_delete
  > 限制，僅處理`title`包含`_[type]_`字樣之resource
3. resource_create
  > 修改無上傳檔案格式欄位的BUG

#### UPDATE DONE
1. organization_member_edit -> 陣列
  > {"id":<organization_id>,"role":"admin","users":["aaa","bbb","ccc"]}
2. group_member_edit -> 陣列
  > {"id":<group_id>,"role":"admin","users":["aaa","bbb","ccc"]}
3. package_member_edit -> 陣列
  > {"id":<package_id>,"role":"admin","users":["aaa","bbb","ccc"]}
4. organization_member_delete -> 陣列
  > {"id":<organization_id>,"users":["aaa","bbb","ccc"]}
5. group_member_delete -> 陣列
  > {"id":<group_id>,"users":["aaa","bbb","ccc"]}
6. package_member_delete -> 陣列
  > {"id":<package_id>,"users":["aaa","bbb","ccc"]}

### Discussion List
1. 以組織管理身分的token，create維護人員的token

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
5. package_group_list -> up<br>
6. organization_group_delete -> up<br>

##### 管理系列
1. post api_token_create -> 給該使用者創建token
  > 用使用者apikey創建meerkat的token?
2. get api_token_list -> 列出該使用者名下的token
  > {headers:<token>}

#### /api/raccoon/
1. 以PatientID欄位刪除其複數個Study<br>

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