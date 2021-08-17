import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header';
import GetToken from './components/GetToken';
import Logout from './components/Logout';
import FileExplorer from './components/FileExplorer'; 
import AudioPlayer from './components/AudioPlayer';
import { yandexDiskPlayerService } from './YaDPlayerService';

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
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    const userInfo = await getUserInfo();
    this.setState({userInfo: userInfo});
  }

  setPlayingAudio = async (audio: any) => {
    if(audio.path == null)
    audio.path = "";
      
    const accessToken = localStorage.getItem("accessToken") as string;

    const json = await yandexDiskPlayerService.getUrl(accessToken, audio.path);

    this.setState({
      currentAudioUrl: json.href,
      currentAudio: audio, 
      playingFolder: audio.parentFolderPath
    })
  }

  fileClicked = async (e: any) => {
    if(e.type == 'folder'){
      await this.getFolderContent(e.path, true, 1);
    }
    else
      await this.setPlayingAudio(e);
  }

  setNextUrl = async (audio: any, random: boolean, fileClicked: Function) =>
  {
    if(random) {

    }
    else {
      let playingFolder = this.state
                                .folders
                                .filter((f: any) => f.name == this.state.playingFolder)[0];

      let files = playingFolder
                      .files
                      .filter((f: any) => f.type == "file")
                      .map((f: any) => f.path);
      const currentIndex = files.indexOf(audio.path);
      if(currentIndex < 0)
        return;

      let nextIndex = currentIndex + 1;

      if(nextIndex >= files.length){
        await this.getFolderContent(this.state.playingFolder as string, true, playingFolder.page + 1);
        playingFolder = this.state
                                .folders
                                .filter((f: any) => f.name == this.state.playingFolder)[0];

        files = playingFolder
                        .files
                        .filter((f: any) => f.type == "file")
                        .map((f: any) => f.path);

        if(files.length >= nextIndex)
          nextIndex = 0;
      }

      const nextPath = files[nextIndex];
      const nextAudio = playingFolder
                          .files
                          .filter((f: any) => f.path == nextPath)[0];

      await this.setPlayingAudio(nextAudio);

    }
  }

  getFolderContent = async (path: string, forward: boolean, page: number) => {
    if(path == null)
      path = "";

    const folderStack = this.state?.folderStack == null? 
                  []
                  : this.state?.folderStack;

    if(page == 1 || forward == false) {
      if(forward == true) {
        folderStack.push(path);
        if(this.state?.folderStack == null)
            folderStack.last = () =>  folderStack[folderStack.length - 1];
      }
      else {
        folderStack.pop();
        path = folderStack.last();
      }
    }

    this.setState({
      explorerPage: page,
      folderStack: folderStack
    });

    if(path == this.state?.playingFolder && page == 1){
      this.setState({
        currentPath: path,
        explorerPage: this.state
                        .folders
                        .filter((f: any) => f.name == this.state.playingFolder)[0]
                        .page,
      });
    }
    else {
      const accessToken = localStorage.getItem("accessToken");

      if(accessToken == null)
      {
        alert("Unauthorized");
        return;
      }
      const json = (await yandexDiskPlayerService.getFiles(accessToken, path, page))
                    .map((j: any) => 
                    {
                      j.onClick = () => this.fileClicked(j);
                      return j;
                    });
      if(page != 1) {
        const folder = this.state
                          ?.folders
                          .filter((f: any) => f.name == path)
                          [0];
        folder.page = page;
        
        const files = folder.files;
        json.map((j: any) => files.push(j));
        this.setState({
          folders: this.state?.folders,
          currentPath: path
        });
      }
      else {
        const folders = this.state?.folders ?? [];

        if(folders.filter((f: any) => f.name == path).length == 0)
          folders.push({name: path, files: json, page: page});

        this.setState({
          folders: folders,
          currentPath: path
        });
      }
    }
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
              {
                userInfo != null && 
                <FileExplorer 
                  userInfo={userInfo} 
                  setPlayingAudio={this.setPlayingAudio} 
                  onGetFolderContent={this.getFolderContent} 
                  folders={this.state?.folders}
                  currentPath={this.state?.currentPath}
                  folderStack={this.state?.folderStack}
                  page={this.state.explorerPage}
                  currentAudio={this.state.currentAudio}
                />
              }
          </Route>
          <Route path="/user">
            <AudioPlayer 
              url={this.state?.currentAudioUrl}
              audio={this.state?.currentAudio}
              setNextUrl={this.setNextUrl}/>
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;