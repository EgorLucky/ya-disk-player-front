import { Component } from 'react';

class FileExplorer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    await this.getFolderContent({path:"disk:", forward: true});
  }

  fileClicked = async (e: any) => {
    if(e.type == 'folder'){
      await this.getFolderContent({path: e.path, forward: true});
    }
    else
      await this.getFileURL(e.path);
  }

  getFolderContent = async ({path, forward}: any) => {

    if(path == null)
      path = "";

    const folderStack = this.state?.folderStack == null? 
                  []
                  : this.state?.folderStack;

    if(forward == true) {
      folderStack.push(path);
      if(this.state?.folderStack == null)
          folderStack.last = () =>  folderStack[folderStack.length - 1];
    }
    else {
      folderStack.pop();
      path = folderStack.last();
    }

    this.setState({folderStack: folderStack});

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("https://localhost:5001/file/get?parentFolderPath=" + path + "&search=&page=1",{
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
                    j.onClick = () => this.fileClicked(j);
                    return j;
                  });
    this.setState({files: json});
  }

  getFileURL = async (path: string) => {
    if(path == null)
      path = "";
      
    const accessToken = localStorage.getItem("accessToken");

    path = encodeURIComponent(path);
    const response = await fetch("https://localhost:5001/file/getUrl?path=" + path, {
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

    this.props.setAudioUrl(json.href);
  }

  backClicked = async () => {
    const folderStack = this.state?.folderStack;
    await this.getFolderContent({forward: false})
  }

  render() {
    return (
      <div style={{float:"left", textAlign:"left", width:"90%", marginLeft:"10px", marginBottom:"60px"}}>
        <button 
          disabled=
          { 
            this.state?.folderStack == null ||
              this.state?.folderStack.length == 0
          } 
          onClick={this.backClicked}>
            Backkkk
        </button>

        <span style={{marginLeft:"10px"}}>
          {
            this.state?.folderStack != null &&
            this.state?.folderStack.last()
          }
        </span>
        
        {
          this.state != null 
          && this.state?.files != null
          && this.state?.files.map((f: any) => {
            return (
              <div onClick={f.onClick} style={{height:"40px", paddingTop: "15px", width:"100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px"}}>
                {f.name}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default FileExplorer;