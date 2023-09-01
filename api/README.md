# api@1.3.4 變動 2023/09/01

### 完成進度
#### DEBUG DONE

#### UPDATE DONE
1. 專案根目錄之啟動手續文件（部分）<br>
2. API文件移至github wiki頁面

### Discussion List
1. 以組織管理身分的token，create維護人員的token

### UPDATE清單
1. SSL<br>
2. 跟目錄的README部屬手續<br>
3. nginx的dockerfile和docker-compose<br>

#### /api/ckan/
1. package_publish -> 開放共享資料集（package_patch -> 公有資料集）<br>
2. package_archive -> 封閉共享資料集（刪除共有資料集）<br>
##### 管理系列
4. post api_token_create -> 給該使用者創建token
  > 我要怎麼在meerkat不知道token的情況下創token?
5. post package_collaborator_create -> 給資料集添加協作者/編輯該成員權限
  > {*id:<package_id>, user_id:<user_id>, capacity:<member/editor/admin>}
6. post organization_member_create -> 給組織添加成員/編輯該成員權限
  > {*id:<organization_id>, username:<user_id>, role:<member/editor/admin>}
7. delete organization_member_delete -> 把該組織的指定成員剔除
  > {*id:<organization_id>, username:<user_id>}
8. delete package_collaborator_delete -> 把該資料集的指定成員剔除
  > {*id:<package_id>, user_id:<user_id>}

#### /api/raccoon/
1. 以PatientID欄位刪除其複數個Study<br>

### High Priority DEBUG清單

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