//套件
import React, {Component, useEffect, useState} from "react";
import axios from 'axios';
import { Outlet } from "react-router-dom";
//檔案
import "./index.css";
import Header from "./components/hearder";
import Content from "./components/content";
import Condition from "./components/condition";
// import Navbar from "../../components/Navbar"
//icon庫
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from "@mui/material/TextField";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

//定義對話框標題之樣式(Title + closeButton)
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function DatasetList() {
  const[list, setList] = useState([])
  const [isNavVisible, setIsNavVisible] = useState(false); //初始狀態把導覽列關起來
  const [isDialogVisible, setIsDialogVisible] = React.useState(false); //使用者資訊的對話框狀態, 預設關
  const [inputText, setInputText] = useState("");

  //=== package_search讀資料, 依searchQuery去找符合關鍵詞的資料 ===//
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URI}api/ckan/package_search`,
    {
      params:{
        limit:20,
        searchQuery:inputText
      },
      headers:{
        'Authorization': process.env.REACT_APP_CKAN_TOKEN,
      }
    })
      .then(response => {
        setList(response.data.result.results);
        if(response.data.result.results!=null){
          console.log(list);
        }
      })
      .catch(error=>console.log(error));
  },[inputText]
  )
  //=== 監聽SearchBar ===//
  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };
  //=== 監聽NavBar ===//
  const navStateChange = () => {
    setIsNavVisible(!isNavVisible); //改變導覽列狀態(開/關)
  };
  //=== 監聽DialogBar ===//
  const dialogStateChange = () => {
    setIsDialogVisible(!isDialogVisible); //改變對話框狀態(開/關)
  };

  return(
    <>
      {/* 導覽列 */}
      <IconButton className="menuIcon">
        <MenuIcon onClick={navStateChange} />
      </IconButton>
      {isNavVisible && (
        <div>
        <nav className={`sliding-div ${isNavVisible ? 'visible' : 'hidden'}`}>
          <IconButton className="menuUser" sx={{width: 150, height: 150}}>
            <Avatar {...stringAvatar('Shan Yun')}
              variant="outlined"
              onClick={dialogStateChange} 
              sx={{width: 120, height: 120, fontSize:36}}
              />
          </IconButton>
          <div>
            <BootstrapDialog
              onClose={dialogStateChange}
              aria-labelledby="customized-dialog-title"
              open={isDialogVisible}
            >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={dialogStateChange}>
            使用者資料
            </BootstrapDialogTitle>
              <DialogContent dividers sx={{ maxWidth: '565px' }}>
                <Typography gutterBottom>
                  姓名：ShanYun
                </Typography>
                <Typography gutterBottom>
                  隸屬組織：國北護
                </Typography>
                <Typography gutterBottom>
                  電子郵件：aaa123@gmail.com
                </Typography>
              </DialogContent>
            </BootstrapDialog>
          </div>
          <h3 className="menuFont">ShanYun</h3> 
          <ul className="menuList">
             <li><a href="/" className="menuFont">Home</a></li>
             <hr/>
             <li><a className="menuFont">資料集申請記錄</a></li>
             <hr/>
             <li><a className="menuFont">AI模型</a></li>
             <hr/>
             <li><a className="menuFont">Raccoon</a></li>
             <hr/>
             <li><a className="menuFont">Ckan</a></li>
             <hr/>
             <li><a className="menuFont">編輯UserInfo</a></li>
           </ul>
           <IconButton>
             <ArrowBackIosNewIcon onClick={navStateChange} />
           </IconButton>
        </nav>
      </div>
      )}
      {/* 頁首 */}
      <div className="head">
        <Header/>
      </div>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="輸入關鍵詞"
        />
        </div>
      {/* Body */}
      <div className="package-condition-div-style">
        <Condition inputText={inputText} setInputText={setInputText}/>
      </div>
      <Outlet />
    </>
  )
}