import React from "react";
import API from "../utils/API";

class LogIn extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            email: '',
            username: '',
            avatarURL: '',
            password: ''
        };
        
        this.handleFormSubmit = ev => {
            ev.preventDefault();
            if (this.state.email && this.state.password) {
              API.logIn({  
                email: this.state.email,
                username: this.state.username,
                avatarURL: 'https://avatars.dicebear.com/v2/gridy/:' + this.state.username + '.svg?option[colorful]=1',
                password: this.state.password
              })
                .then(res => window.location = '/chat')
            }
          };

    }
    render(){

        console.log(window.location.href)
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-4 sm-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title"><h5> <i className="fas fa-user-plus"></i> Login </h5></div>
                                <hr/>
                            </div>
                            <div className="card-footer">
                            <form>
                                <input type="email" placeholder="✉ Email" value={this.state.email} onChange={ev => this.setState({email: ev.target.value})} className="form-control" required/>
                                <br/>
                                <input type="password" placeholder="🛡 Password" className="form-control" value={this.state.password} onChange={ev => this.setState({password: ev.target.value})} required/>
                                <br/>
                                <button onClick={this.handleFormSubmit} className="btn btn-primary form-control"> <i className="fas fa-user-plus"></i> Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogIn;