import { Component } from 'react';

class FileExplorer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("https://localhost:5001/file/get?parentFolderPath=&search=&page=1",{
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
    this.setState({files: json});
  }

  render() {
    return (
      <div>
      {
        this.state != null 
        && this.state.files != null
        && this.state.files.map((f: any) => {
          return (
            <div>
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