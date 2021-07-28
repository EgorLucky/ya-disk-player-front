import { Component } from 'react';

class AudioPlayer extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  render() {
    const {audio, url, setNextUrl} = this.props;
    const onEnded = () => setNextUrl(audio, false);
    return (
      <div style={{position: "fixed", width: "100%", bottom: "0%", backgroundColor: "grey"}}>
        <div>{audio?.name}</div>
        <div  style={{display:"inline-flex", width:"50%"}}>
          <button style={{display:"block"}}>ннннназад</button>
          <audio 
            autoPlay 
            controls 
            src={url} 
            style={{display:"block", width:"100%"}} 
            onEnded={onEnded}
            />
          <button style={{display:"block"}} onClick={onEnded}>вперррред</button>
          <button style={{display:"block"}}>🔀</button>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;