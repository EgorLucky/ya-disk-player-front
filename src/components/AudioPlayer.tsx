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
        <audio autoPlay controls src={this.props?.url}/>
      </div>
    );
  }
}

export default AudioPlayer;