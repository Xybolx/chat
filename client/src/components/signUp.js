import React from "react";
import API from "../utils/API";
import "../App.css";
import { Link } from "react-router-dom";

class SignUp extends React.Component {
    constructor(props) {
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
            if (this.state.email && this.state.password && this.state.username) {
                API.signUp({
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
    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-4 sm-2">
                        <div className="card">
                            <div className="card-body">
                                <div id="subTitle" className="card-title">
                                <h1 id="title">CYBORG CHAT</h1>
                                <h5><i className="far fa-address-card"></i> Sign Up! </h5>
                                <h5> or<br/> Login <Link to="/login">Here</Link>!</h5>
                                </div>
                            </div>
                            <div className="card-footer">
                                <form id="signUpForm">
                                    <input id="emailInput" type="email" placeholder="📧 Email" value={this.state.email} onChange={ev => this.setState({ email: ev.target.value })} className="form-control" required />
                                    <br />
                                    <input id="usernameInput" type="text" placeholder="👥 Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" required />
                                    <br />
                                    <input id="passwordInput" type="password" placeholder=" 🔑 Password" className="form-control" value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} required />
                                    <br />
                                    <button onClick={this.handleFormSubmit} className="btn btn-primary form-control"> <i className="far fa-address-card"></i> Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;