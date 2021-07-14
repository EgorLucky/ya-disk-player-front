import { Component } from 'react';

class FileExplorer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    await this.getFolderContent("");
  }

  fileClicked = async (e :any) => {
    if(e.type == 'folder'){
      const folderStack = this.state?.folderStack == null? 
                    []
                    : this.state?.folderStack;
      folderStack.push(e.path);
      if(this.state?.folderStack == null)
          folderStack.last = () =>  folderStack[folderStack.length - 1];
      this.setState({folderStack: folderStack});
      await this.getFolderContent(e.path);
    }
    else
      await this.getFileURL(e.path);
  }

  getFolderContent = async (path: string) => {

    if(path == null)
      path = "";

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

    path = encodeURI(path);
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
    folderStack.pop();
    this.setState({folderStack: folderStack});

    await this.getFolderContent(folderStack.last())
  }

  render() {
    return (
      <div style={{float:"left", textAlign:"left", width:"90%"}}>
        <button 
          disabled=
          { 
            this.state?.folderStack == null ||
              this.state?.folderStack.length == 0
          } 
          onClick={this.backClicked}>
            Backkkk
          </button>
        
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