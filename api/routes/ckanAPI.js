var express = require("express");
var router = express.Router();
const defaultAPI = "https://data.dmc.nycu.edu.tw/api/3/action/"

//get api test
// router.get('/',(req, res)=>{
//   fetch(defaultAPI+'package_show',{
//     headers:{
//       'Content-Type':'application/json'
//     }
//   })
//   .then(response => response.json())
//   .then(data => res.send(data))
//   .catch(error => console.error(error));
// })
router.get('/package_list',(req, res)=>{//這邊會等於fetch後面添加的部分
  fetch(defaultAPI+'package_list',{
    headers:{
      'Content-Type':'application/json'
    }
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => console.error(error));
})

module.exports = router;