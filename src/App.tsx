import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header';
import GetToken from './components/GetToken';
import Logout from './components/Logout';
//import FileExplorer from './components/FileExplorer'; 
//import AudioPlayer from './components/AudioPlayer';
import { Synchronization } from './components/Synchronization';
import { IgnoreFiles } from './components/IgnoreFiles';
import { yandexDiskPlayerService } from './YaDPlayerService';
//import AppAudioHandler from './AppAudioHandler';

yandexDiskPlayerService.setConfiguration(null, "production");

async function getUserInfo() {
  const accessToken = localStorage.getItem("accessToken");

  if(accessToken == null)
    return {
      isAuthorized: false
    };

  return await yandexDiskPlayerService.getUserInfo(accessToken);
}


class App extends Component<any, any> {
  //audioHandler: AppAudioHandler;

  constructor(props: any){
    super(props);

    //this.audioHandler = new AppAudioHandler(this, yandexDiskPlayerService);
  }

  async componentDidMount(){
    const userInfo = await getUserInfo();
    this.setState({userInfo: userInfo});
  }

  onGetToken = (code: string) => yandexDiskPlayerService.getToken(code);

  render() {
    const userInfo = this.state?.userInfo;
    return (
      <div className="App">
        <Router>
        <Header/>
          <Route path="/getToken">
            <GetToken onGetToken={this.onGetToken}/>  
          </Route>
          <Route path="/logout">
            <Logout/>  
          </Route>
          <Route path="/user">
            {
              this.state?.userInfo != null 
              && this.state?.userInfo.isAuthorized != true 
              && <a href={`https://oauth.yandex.ru/authorize?client_id=3b45d777976d49aea146b1d79bcd13d1&response_type=code&redirect_uri=${window.location.origin}/getToken`}>ввввойти через яндекс так сказать....</a>
            }
            <div style={{float: "right"}}>
            {
              this.state?.userInfo.isAuthorized 
              && this.state?.userInfo.email
            }
            </div>
          </Route>

          <Route path="/user/synchronization">
            <Synchronization userInfo={userInfo}/>
          </Route>
          <Route path="/user/ignoreFiles">
            <IgnoreFiles userInfo={userInfo}/>
          </Route>
          {
            /* <Route path="/user/files">
                {
                  userInfo != null && 
                  <FileExplorer 
                    userInfo={userInfo} 
                    setPlayingAudio={this.audioHandler.setPlayingAudio} 
                    onGetFolderContent={this.audioHandler.getFolderContent} 
                    folders={this.state?.folders}
                    currentPath={this.state?.currentPath}
                    folderStack={this.state?.folderStack}
                    page={this.state.explorerPage}
                    currentAudio={this.state.currentAudio}
                  />
                }
            </Route> */
          }
          {
            /* <Route path="/user">
              <AudioPlayer 
                url={this.state?.currentAudioUrl}
                audio={this.state?.currentAudio}
                setNextUrl={this.audioHandler.setNextUrl}/>
            </Route> */
          }
        </Router>
      </div>
    );
  }
}

export default App;