
### Mongo資料庫設定

> 參照：https://www.guru99.com/mongodb-create-user.html
繪語的MongoDB Windows10設定手冊：https://hackmd.io/@honoxarashi0301/Bk8LLK-Pn<br>
使用者名稱：Meerkat<br>
使用者密碼：MeerkatMongoDB<br>
使用者角色：userAdmin<br>
角色應對資料庫：Meerkat<br>
port:27017<br>

# POST Mongo資料庫

### 2023/07/04開啟的API
## 上傳表單內的proposal附件
```
localhost:9000/mongoAPI/docUpload
```
正常頁面響應：檔案路徑<br>
> 請將此項路徑代入`/formUpload`的`applicantID`

### 指定參數之定義
1. proposalFile(表單中，檔案ㄉ欄位名稱)

## 上傳整個表單
```
localhost:9000/mongoAPI/formUpload
```
正常頁面響應：200<br>
### 指定參數之定義
1. name(申請人ckan帳號ID)<br>
2. orgnization(所屬組織)<br>
3. applicantID(存放在本機端ㄉ位址，預設是跟Meerkat同一層的檔案夾proposals)<br>
4. maintainer(審核人ckan帳號ID)<br>
5. applyTime(請使用JS的Date函數)<br>

# GET Mongo資料庫 #
## 取得指定申請人帳號名下的表單
```
localhost:9000/mongoAPI/accountDocs
```
正常頁面響應：200<br>
該帳戶所申請的文件列表<br>

### 指定參數之定義：
```
1. account(指定帳戶ID)
```
