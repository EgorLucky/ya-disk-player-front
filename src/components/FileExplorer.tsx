import { Component } from 'react';

class FileExplorer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    await this.getFolderContent({path:"disk:", forward: true, page: 1});
  }

  fileClicked = async (e: any) => {
    if(e.type == 'folder'){
      await this.getFolderContent({path: e.path, forward: true, page: 1});
    }
    else
      await this.props.setPlayingAudio(e);
  }

  getFolderContent = async ({path, forward, page}: any) => {

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

    this.setState({page: page});
    
    this.setState({folderStack: folderStack});

    await this.props?.onGetFolderContent(path, page, this.fileClicked);
  }


  backClicked = async () => {
    await this.getFolderContent({forward: false, page: 1})
  }

  onScroll = async(e: any) => {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if(scrollTop + offsetHeight != scrollHeight) {
      return;
    }

    const page = this.state?.page ?? 1;
    this.getFolderContent({
          path: this.state.folderStack.last(), 
          page: page + 1,
          forward: true
    });
  }

  render() {
    return (
      <div 
        style={{float:"left", textAlign:"left", width:"95%", marginLeft:"10px", marginBottom:"60px", maxHeight: "790px", overflowY: "auto", overflowX: "hidden"}} 
        onScroll={this.onScroll}>
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
          this.props?.folders != null
          && this.props?.folders.filter((f: any) => f.name == this?.props?.currentPath)[0]?.files?.map((f: any) => {
            return (
              <div 
                onClick={f.onClick} 
                style={{height:"40px", paddingTop: "15px", width:"100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px"}}>
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