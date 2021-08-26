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
        <div  style={{display:"inline-flex", width:"90%"}}>
          <button style={{display:"block"}}>⏮️</button>
          <audio 
            autoPlay
            controls 
            src={url} 
            style={{display:"block", width:"100%", height: "40px"}} 
            onEnded={onEnded}
            crossOrigin="anonymous"
            />
          <button style={{display:"block"}} onClick={onEnded}>⏭️</button>
          <button style={{display:"block"}}>🔀</button>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;