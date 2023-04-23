# 分支sz

## 開啟前

### 確認安裝套件:
* express
* json-server
* react-router-dom

### 套件安裝語法:
* 當前資料夾內:
`npm install express`
*全域安裝
`npm install express -g`
* 初學補充:
express可替換成自己需要的套件名稱
`-g` 是全域的意思global
`install` 可以只寫`i`，效果是一樣的，範例如下:
`npm i express`

## 開啟

### 啟動步驟:

* 在資料夾內啟用命令提示字元，輸入:
`npm run server`

* 另外開一個命令提示字元，或者在vsCode的terminal，輸入:
`npm start`

### 當前啟動後可運行網址:

#### 20230416上傳的分支版本
* [../manage/fileUpload](http://localhost:3001/manage/fileUpload)
* [../edit/newDataset](http://localhost:3001/edit/newDataset)資料集創建表單(form)

## 程式碼筆記

### 目前已知待補齊功能
* 將檔案上傳區域的資料寫入JSON檔案內，檔案上傳且離開頁面後，清空JSON檔案內資料

### 撰寫架構

#### json
* posts(測試用)
* data
  * 1(newSet)
* model

#### 資料夾
* Meerkat
  * client
    * 前端:放置react
  * api
    * 後端:放置node
  * node_modules

### 語法範例


# 以下為預設檔的md

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
