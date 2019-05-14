import React from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";

class LogIn extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            email: '',
            username: '',
            avatarURL: '',
            password: ''
        };
        
        this.handleInputChange = ev => {
            const { name, value } = ev.target;
            this.setState({
              [name]: value
            });
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
                .then(res => window.location = "/chat")
                .catch(err => console.log(err));
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
                                <Link to="/chat">Chat Page</Link>
                                <div id="subTitle" className="card-title">
                                <h1 id="title">CYBORG CHAT</h1>
                                <h5> <i className="fas fa-user-plus"></i> Login </h5>
                                <h5> or<br/> Sign Up<Link to="/"><br />Here</Link>!</h5>
                                </div>
                            </div>
                            <div className="card-footer">
                            <form id="loginForm">
                                <input id="emailInput" type="email" name="email" placeholder="📧 Email" value={this.state.email} onChange={this.handleInputChange} className="form-control" required/>
                                <br/>
                                <input id="passwordInput" type="password" name="password" placeholder=" 🔑 Password" className="form-control" value={this.state.password} onChange={this.handleInputChange} required/>
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