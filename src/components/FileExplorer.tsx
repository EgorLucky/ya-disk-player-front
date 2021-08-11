import { Component } from 'react';

class FileExplorer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    await this.getFolderContent({path:"disk:", forward: true, page: 1});
  }

  getFolderContent = async ({path, forward, page}: any) => {
    await this.props?.onGetFolderContent(path, forward, page);
  }


  backClicked = async () => {
    await this.getFolderContent({forward: false, page: 1})
  }

  onScroll = async(e: any) => {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if(scrollTop + offsetHeight != scrollHeight) {
      return;
    }

    const page = this.props?.page ?? 1;
    this.getFolderContent({
          path: this.props.folderStack.last(), 
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
            this.props?.folderStack == null ||
              this.props?.folderStack.length == 0
          } 
          onClick={this.backClicked}>
            Backkkk
        </button>

        <span style={{marginLeft:"10px"}}>
          {
            this.props?.folderStack != null &&
            this.props?.folderStack.last()
          }
        </span>
        
        {
          this.props?.folders != null
          && this.props?.folders.filter((f: any) => f.name == this?.props?.currentPath)[0]?.files?.map((f: any) => {
            const isPlayingAudio = this.props?.currentAudio?.resourceId == f.resourceId && f.type == "file";
            const color = isPlayingAudio? "#A19C9C" : "#FFFFFF";
            return (
              <div 
                onClick={f.onClick} 
                style={{height:"40px", paddingTop: "15px", width:"100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px", backgroundColor: color}}>
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