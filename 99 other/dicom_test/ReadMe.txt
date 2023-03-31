* 測試DICOM檔(聽神經瘤)在TestData資料夾中
* DICOM檔要先上傳到Raccoon後，WADO才能抓的

* 指令
`
ldcm2csv +pf prof.csv +web dicomweb.config .\TestData out.csv
`