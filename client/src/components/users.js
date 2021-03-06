import React, { Component } from "react";
import Sound from "react-sound";
import moment from "moment";
import API from "../utils/API";

class Users extends Component {

    state = {
        users: []
    };

    loadUsers = () => {
        API.getUsers()
            .then(res =>
                this.setState({ users: res.data }))
            .catch(err => console.log(err))
    };

    componentDidMount() {
        this.loadUsers();
        this.handleUsersInterval = setInterval(this.loadUsers, 5000);
    };

    componentDidUpdate() {
        console.log("componentDidUpdate");
    };

    componentWillUnmount() {
        clearInterval(this.handleUsersInterval);
    };

    render() {
        return (
            <div>
                {this.state.users.length ? (
                    <div className="users flex-fill text-center">
                        <div className="inside">
                        <h6><span className="fa-layers fa-fw"><i className="fas fa-users"></i><span className="fa-layers-counter" style={{ fontSize: 25 }}>{this.state.users.length}</span></span> Online Now</h6>
                        {this.state.users.map(user => (
                            <div key={user._id}>
                                <div className="card-header">
                                    <div className="userValue" style={{ color: `${user.colorSeed}` }}>
                                        <img className="img-fluid" alt="" src={user.avatarURL}></img>&nbsp;{user.username} <span className="joinDate" style={{ fontSize: 8 }}>member since {moment(user.date).format("M/YYYY")}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                ) : (
                        <Sound
                            url="welcome.wav"
                            playStatus={Sound.status.PLAYING}
                            playbackRate={.75}
                        />
                    )}
            </div>
        );
    };
};

export default Users;