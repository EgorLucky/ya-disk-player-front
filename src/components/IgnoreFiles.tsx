import { Component } from 'react';

export class IgnoreFiles extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
      
  }

  onScroll = async(e: any) => {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if(scrollTop + offsetHeight >= scrollHeight - 10) {
      return;
    }
  }

  render() {
    return (
      <div>
          IgnoreFiles component
      </div>
    );
  }
}
