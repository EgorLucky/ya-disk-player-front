import { Component } from 'react';

class AudioPlayer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){

  }

  render() {
    return (
      <div style={{position: "fixed", width: "100%", bottom: "0%", backgroundColor: "grey"}}>
        <div  style={{display:"inline-flex"}}>
          <button style={{display:"block"}}>ннннназад</button>
          <audio autoPlay controls src={this.props?.url} style={{display:"block"}} onEnded={() => alert("конец!")}/>
          <button style={{display:"block"}}>вперррред</button>
          <button style={{display:"block"}}>🔀</button>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;