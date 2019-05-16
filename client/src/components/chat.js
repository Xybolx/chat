import React from "react";
import io from "socket.io-client";
import API from "../utils/API";
import moment from "moment";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: {},
            userAvatar: {},
            userColor: {},
            message: '',
            privateMessage: '',
            privateMessages: [],
            messages: [],
            users: []
        };

        this.socket = io("http://localhost:3001/");

        this.socket.on('RECEIVE_MESSAGE', data => {
            addMessage(data);
        });

        this.socket.on('RECEIVE_USER', data => {
            addUser(data);
        });

        this.socket.on('RECEIVE_PRIVATE_MESSAGE', data => {
            addPrivateMessage(data);
        });

        this.socket.on('connection', socket => {
            let id = this.socket.io.engine.id;
            console.log(id);
        });

        this.socket.on('disconnect', socket => {
            let id = this.socket.io.engine.id;
            console.log(id);
        });

        const addMessage = data => {
            console.log(data);
            console.log(this.state.messages);
        };

        const addPrivateMessage = data => {
            console.log(data);
            console.log(this.state.privateMessages);
        };

        const addUser = data => {
            console.log(data);
            console.log(this.state.username);
        }

        this.sendMessage = ev => {
            ev.preventDefault();
            this.resetTimeout();
            if (this.state.message) {
                API.saveMessage({
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    userColor: this.state.userColor,
                    message: this.state.message
                });
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    userColor: this.state.userColor,
                    message: this.state.message
                });
            }
            
            this.setState({ message: '' });
        }

        this.sendPrivateMessage = ev => {
            ev.preventDefault();
                let message = this.state.privateMessage.substr(1);
                let ind = message.indexOf('/');
                let receiver = message.substr(0, ind);
                let messageIndex = message.substr(ind + 1);
            if (this.state.privateMessage.substr(0, 1) === '@' && ind !== -1) {
                API.savePrivateMessage({
                    receiver: receiver,
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    userColor: this.state.userColor,
                    privateMessage: messageIndex
                });
                this.socket.emit('SEND_PRIVATE_MESSAGE', {
                    receiver: receiver,
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    userColor: this.state.userColor,
                    privateMessage: messageIndex
                })
            }
            
            this.setState({ privateMessage: '' });
        }

        this.handleInputChange = ev => {
            const { name, value } = ev.target;
            this.setState({
              [name]: value
            });
          };
        
        this.logOut = () => {
            API.logOut({
            })
            .then(res => window.location = "/login")
        }
    }

    loadUsers = () => {
        API.getUsers()
            .then(res =>
                this.setState({ users: res.data })
            ).then(this.socket.emit('SEND_USER', {
                username: this.state.username
            }))
    }

    loadUser = () => {
        API.getUser()
            .then(res =>
                this.setState({ username: res.data.username, userAvatar: res.data.avatarURL, userColor: res.data.colorSeed }),
            )
    }

    loadMessages = () => {
        API.getMessages()
            .then(res =>
                this.setState({ messages: res.data })
            )
    }

    loadPrivateMessages = () => {
        API.getPrivateMessages()
            .then(res =>
                this.setState({ privateMessages: res.data })
            )
    }

    resetTimeout = () => {
        console.log("firing");
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.logOut, 1800000);
    }
    
    componentDidMount() {
        this.loadUser();
        this.timeout = setTimeout(this.logOut, 1800000);
        this.handleUserInterval = setInterval(this.loadUsers, 5000);
        this.handleMessageInterval = setInterval(this.loadMessages, 5000);
        this.handlePrivateMessageInterval = setInterval(this.loadPrivateMessages, 5000);
    }

    componentWillUnmount() {
        this.logOut();
        clearInterval(this.handleUserInterval);
        clearInterval(this.handleMessageInterval);
        clearInterval(this.handlePrivateMessageInterval);
        clearTimeout(this.timeout);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-xl-6 lg-4 md-4 sm-2 xs-2">
                        <div className="card">
                            <div className="card-body">
                            <h1 id="title">CYBORG CHAT</h1>
                            <div className="container">
                                <h4><span className="fa-layers fa-fw"><i className="fas fa-users"></i><span className="fa-layers-counter" style={{ fontSize: 40 }}>{this.state.users.length}</span></span> Online Now</h4>
                                {this.state.users.length ? (
                                    <div className="users flex-fill text-left">
                                        {this.state.users.map(user => (
                                            <div className="card" key={user._id}>
                                                <div style={{ background: `${user.colorSeed}` }} className="card-header">
                                                    <div>
                                                        <img className="img-fluid" alt="" src={user.avatarURL}></img>&nbsp;{user.username} <span className="joinDate" style={{ fontSize: 10 }}>member since {moment(user.date).format("M/YY")}</span>
                                                    </div>
                                                </div>
                                            </div>    
                                        ))}
                                    </div>
                                ) : (
                                    <h4><i className="fab fa-react fa-spin"></i></h4>
                                    )}
                                <h4><span className="fa-layers fa-fw"><i className="fas fa-comment-alt"></i><span className="fa-layers-counter" style={{ fontSize: 40 }}>{this.state.messages.length}</span></span> Public Msgs</h4>
                                {this.state.messages.length ? (    
                                    <div className="messages">
                                        {this.state.messages.map(message => (
                                            <div className="card" key={message._id}>
                                                <div style={{ background: `${message.userColor}` }} className="card-header">
                                                    <div>
                                                        <img className="img-fluid" alt="" src={message.userAvatar}></img>
                                                        &nbsp;{message.author} <span className="msgTime" style={{ fontSize: 10 }}>{moment(message.date).fromNow()}:</span> <br />{message.message}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <h5><i className="fab fa-react fa-spin"></i></h5>
                                    )}
                                    <h4><span className="fa-layers fa-fw"><i className="fas fa-comment-alt"></i><span className="fa-layers-counter" style={{ fontSize: 40 }}>{this.state.privateMessages.length}</span></span> Private Msgs</h4>
                                {this.state.privateMessages.length ? (    
                                    <div className="privateMessages">
                                        {this.state.privateMessages.map(privateMessage => (
                                            <div className="card" key={privateMessage._id}>
                                                <div style={{ background: `${privateMessage.userColor}`}} className="card-header">
                                                <div>
                                                    <img className="img-fluid" alt="" src={privateMessage.userAvatar}></img>
                                                    &nbsp;{privateMessage.author} <span className="privateMsgTime" style={{ fontSize: 10 }}>{moment(privateMessage.date).fromNow()}:</span> <br />{privateMessage.privateMessage}
                                                </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <h5><i className="fab fa-react fa-spin"></i></h5>
                                    )}
                            </div>
                            <div className="card-footer">
                                <textarea type="text" name="message" placeholder="📝Message" className="form-control" value={this.state.message} onChange={this.handleInputChange} autoFocus />
                                <br />
                                <button onClick={this.sendMessage} className="btn btn-primary form-control"> <i className="far fa-paper-plane"></i> Send </button>
                                <hr />
                                <textarea type="text" name="privateMessage" placeholder="🔒Private Message" className="form-control" value={this.state.privateMessage} onChange={this.handleInputChange} />
                                <br />
                                <button onClick={this.sendPrivateMessage} className="btn btn-primary form-control"> <i className="far fa-paper-plane"></i> Send Private </button>
                                <hr />
                                <button onClick={this.logOut} className="btn btn-danger form-control"> <i className="fas fa-user-slash"></i> Logout </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Chat;
