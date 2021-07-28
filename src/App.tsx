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

  setPlayingAudio = async (audio: any) => {
    if(audio.path == null)
    audio.path = "";
      
    const accessToken = localStorage.getItem("accessToken");

    const encodedPath = encodeURIComponent(audio.path);
    const response = await fetch("https://localhost:5001/file/getUrl?path=" + encodedPath, {
      headers:{
        "Authorization": "Bearer " + accessToken
      }
    });
    if(response.status == 401){
      alert("Unauthorized");
      return;
    }

    if(response.status != 200)
    {
      alert("Error code " + response.status);
      return;
    }

    const json = await response.json();

    this.setState({
      currentAudioUrl: json.href,
      currentAudio: audio, 
      playingFolder: this.state.currentPath
    })
  }

  setNextUrl = async (audio: any, random: boolean) =>
  {
    if(random) {

    }
    else {
      const playingFolder = this.state
                                .folders
                                .filter((f: any) => f.name == this.state.playingFolder)[0];

      const files = playingFolder
                      .files
                      .filter((f: any) => f.type == "file")
                      .map((f: any) => f.path);
      const currentIndex = files.indexOf(audio.path);
      if(currentIndex < 0)
        return;

      const nextIndex = (currentIndex + 1) % files.length;
      const nextPath = files[nextIndex];
      const nextAudio = playingFolder
                          .files
                          .filter((f: any) => f.path == nextPath)[0];

      await this.setPlayingAudio(nextAudio);

    }
  }

  getFolderContent = async (path: string, page: number, fileClicked: Function) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`https://localhost:5001/file/get?parentFolderPath=${encodeURIComponent(path)}&search=&page=${page}`,{
      headers:{
        "Authorization": "Bearer " + accessToken
      }
    });

    if(response.status == 401){
      alert("Unauthorized");
      return;
    }

    if(response.status != 200)
    {
      alert("Error code " + response.status);
      return;
    }

    const json = (await response.json())
                  .map((j: any) => 
                  {
                    j.onClick = () => fileClicked(j);
                    return j;
                  });
    if(page != 1) {
      const folder = this.state
                        ?.folders
                        .filter((f: any) => f.name == path)
                        [0];
      const files = folder.files;
      json.map((j: any) => files.push(j));
      this.setState({
        folders: this.state?.folders,
        currentPath: path
      });

      // const files = this.state.files;
      // json.map((j: any) => files.push(j));
      // this.setState({files: files});
    }
    else {
      this.setState({
        folders: [{name: path, files: json}],
        currentPath: path});
    }
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
              {
                userInfo != null && 
                <FileExplorer 
                  userInfo={userInfo} 
                  setPlayingAudio={this.setPlayingAudio} 
                  onGetFolderContent={this.getFolderContent} 
                  folders={this.state?.folders}
                  currentPath={this.state?.currentPath}
                  
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