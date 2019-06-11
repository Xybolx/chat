import React, { Component } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";
import Clock from "./clock";
import Title from "./title";

class LogIn extends Component {
        
        state = {
            email: '',
            password: ''
        };
        
        handleInputChange = ev => {
            const { name, value } = ev.target;
            this.setState({
              [name]: value
            });
          };

        handleFormSubmit = ev => {
            ev.preventDefault();
            if (this.state.email && this.state.password) {
              API.logIn({  
                email: this.state.email,
                password: this.state.password
              })
                .then(res => window.location = "/chat")
                .catch(err => console.log(err));
            }
          };

    render() {

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-4 md-4 sm-2 xs-2">
                        <div className="card">
                            <div className="card-body">
                                <div id="subTitle" className="card-title">
                                    <Title />
                                    <Clock />
                                <h5><i className="fas fa-user-plus"></i> Login</h5>
                                <h5>OR</h5>
                                <h5><i className="far fa-address-card"></i> Sign Up<Link to="/">&nbsp;Here</Link>!</h5>
                                </div>
                            </div>
                            <div className="card-footer">
                            <form id="loginForm">
                                <label className="label" htmlFor="email">Email</label>
                                <input id="emailInput" type="email" name="email" placeholder="📧 Email" value={this.state.email} onChange={this.handleInputChange} className="form-control" required/>
                                <label className="label" htmlFor="password">Password</label>
                                <input id="passwordInput" type="password" name="password" placeholder=" 🔑 Password" className="form-control" value={this.state.password} onChange={this.handleInputChange} required/>
                                <br/>
                                <button onClick={this.handleFormSubmit} className="btn btn-primary btn-block"> <i className="fas fa-user-plus"></i> Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default LogIn;