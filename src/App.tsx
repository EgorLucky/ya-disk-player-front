import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header';
import GetToken from './components/GetToken';
import Logout from './components/Logout';
import FileExplorer from './components/FileExplorer'; 
import AudioPlayer from './components/AudioPlayer';

async function getUserInfo() {
  const accessToken = localStorage.getItem("accessToken");

  if(accessToken == null)
    return {
      isAuthorized: false
    };
  
  const response = await fetch("https://localhost:5001/User/getUserInfo", {
    headers:{
      "Authorization": "Bearer " + accessToken
    }
  })

  if(response.status == 401)
    return {
      isAuthorized: false
    };

  const json = await response.json();
  json.isAuthorized = true;
  return json;
}


class App extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    const userInfo = await getUserInfo();
    this.setState({userInfo: userInfo});
  }

  setAudioUrl = (url: string) => {
    this.setState({currentAudioUrl:url})
  }

  render() {
    const userInfo = this.state?.userInfo;
    return (
      <div className="App">
        <Router>
        <Header/>
          <Route path="/getToken">
            <GetToken/>  
          </Route>
          <Route path="/logout">
            <Logout/>  
          </Route>
          <Route path="/user">
            {
              this.state?.userInfo != null 
              && this.state?.userInfo.isAuthorized != true 
              && <a href="https://oauth.yandex.ru/authorize?client_id=3b45d777976d49aea146b1d79bcd13d1&response_type=code&redirect_uri=http://localhost:3000/getToken">ввввойти через яндекс так сказать....</a>
            }
            <div style={{float: "right"}}>
            {
              this.state?.userInfo.isAuthorized 
              && this.state?.userInfo.email
            }
            </div>
          </Route>
          <Route path="/user/files">
              {userInfo != null && <FileExplorer userInfo={userInfo} setAudioUrl={this.setAudioUrl}/>}
          </Route>
          <Route path="/user">
            <AudioPlayer url={this.state?.currentAudioUrl}/>
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;