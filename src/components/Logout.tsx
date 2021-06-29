import { Component } from 'react';

class Logout extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = window.location.origin;

  }

  render() {
    return (
      <div>
         вииииходим
      </div>
    );
  }
}

export default Logout;