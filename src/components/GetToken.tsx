import { Component } from 'react';

class GetToken extends Component<any, any> {
  constructor(props: any){
    super(props);
  }

  async componentDidMount(){

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if(code == null)
        return;
    const token = await this.props.onGetToken(code);

    if(token.success == true) {
        localStorage.setItem("accessToken", token.accessToken);
        localStorage.setItem("refreshToken", token.refreshToken);

        window.location.href = window.location.origin;
    }
    else
    {
        this.setState({
            error: true
        });
    }
  }

  render() {
    return (
      <div>
        {
            this.state?.error == true && "errorrrr!"
        }
        {
            this.state?.error != true && "getting token..."
        }
        
      </div>
    );
  }
}

export default GetToken;