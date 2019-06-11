import React, { Component } from "react";
import Clock from "./clock";
import Title from "./title";
import API from "../utils/API";
import "../App.css";
import { Link } from "react-router-dom";

class SignUp extends Component {

    state = {
        email: '',
        username: '',
        avatarURL: '',
        colorSeed: '',
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

        if (this.state.email && this.state.password && this.state.username) {

            const colors = ["red", "blue", "gold", "violet", "yellow", "tomato", "cyan", "pink", "lightcoral", "lawngreen", "dodgerblue", "orange", "sandybrown", "lightgreen", "lightseagreen", "darkred", "green", "purple", "hotpink"];
            let colorSeed = colors[Math.floor(Math.random() * colors.length)];

            API.signUp({
                email: this.state.email,
                username: this.state.username,
                avatarURL: 'https://avatars.dicebear.com/v2/gridy/:' + this.state.username + '.svg?option[colorful]=1',
                colorSeed: colorSeed,
                password: this.state.password
            }).then(function () {
                if (colors.includes(colorSeed)) {
                    colors.splice(colors.indexOf(colorSeed, 1));
                }
                console.log(colors);
            })
                .then(res => window.location = "/chat")
                .catch(err => console.log(err));
        };
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
                                    <h5><i className="far fa-address-card"></i> Sign Up </h5>
                                    <h5>OR</h5>
                                    <h5><i className="fas fa-user-plus"></i> Login<Link to="/login">&nbsp;Here</Link>!</h5>
                                </div>
                            </div>
                            <div className="card-footer">
                                <form id="signUpForm">
                                    <label className="label" htmlFor="email">Email</label>
                                    <input id="emailInput" type="email" placeholder="📧 Email" value={this.state.email} onChange={ev => this.setState({ email: ev.target.value })} className="form-control" required />
                                    <label className="label" htmlFor="username">Username</label>
                                    <input id="usernameInput" type="text" placeholder="👥 Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" required />
                                    <label className="label" htmlFor="password">Password</label>
                                    <input id="passwordInput" type="password" placeholder=" 🔑 Password" className="form-control" value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} required />
                                    <br />
                                    <button onClick={this.handleFormSubmit} className="btn btn-primary btn-block"> <i className="far fa-address-card"></i> Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default SignUp;