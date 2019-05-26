import React from "react";
import io from "socket.io-client";
import API from "../utils/API";
import moment from "moment";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            username: {},
            userAvatar: {},
            userColor: {},
            userTyping: '',
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

        this.socket.on('RECEIVE_TYPING_USER', data => {
            addTypingUser(data);
            if (data) {
                console.log(data.username + ' is typing');
                this.setState({ userTyping: data.username });
            } else {
                this.setState({ userTyping: '' });
            }
        });

        this.socket.on('connect', () => {
            let id = this.socket.io.engine.id;
            console.log(id);
        });

        this.socket.on('disconnect', () => {
            this.logOut();
        });

        const addMessage = data => {
        };

        const addPrivateMessage = data => {
        };

        const addUser = data => {
        };

        const addTypingUser = data => {
        };

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
            };

            this.setState({ message: '' });
        };

        this.sendPrivateMessage = ev => {
            ev.preventDefault();
            this.resetTimeout();
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
                });
            };

            this.setState({ privateMessage: '' });
        };

        this.handleInputChange = ev => {
            const { name, value } = ev.target;
            this.setState({
                [name]: value
            });
            this.socket.emit('SEND_TYPING_USER', {
                username: this.state.username
            });
            clearTimeout(this.typeTimeout);
            this.typeTimeout = setTimeout(this.typingTimeout, 3000);
        };

        this.logOut = () => {
            API.logOut(
            ).then(res => window.location = "/login")
        }
    };

    handlePrivateMsgFocus = (ev) => {
        this.setState({privateMessage: ev.target.value});
        document.getElementById('privateMsg').focus();
    } 

    loadUsers = () => {
        API.getUsers()
            .then(res =>
                this.setState({ users: res.data }))
                .catch(err => console.log(err))
    };

    loadUser = () => {
        API.getUser()
            .then(res =>
                this.setState({ user: res.data, username: res.data.username, userAvatar: res.data.avatarURL, userColor: res.data.colorSeed }))
                .catch(err => console.log(err))
    };

    sendUser = () => {
        this.socket.emit('SEND_USER', {
            user: this.state.user
        })
    }

    loadMessages = () => {
        API.getMessages()
            .then(res =>
                this.setState({ messages: res.data }))
                .catch(err => console.log(err))
    };

    loadPrivateMessages = () => {
        API.getPrivateMessages()
            .then(res =>
                this.setState({ privateMessages: res.data }))
                .catch(err => console.log(err))
    };

    resetTimeout = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.logOut, 1800000);
    };

    typingTimeout = () => {
        this.socket.emit('SEND_TYPING_USER', false);
    };

    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.logOut();
        });
    };

    removeBeforeUnloadListener = () => {
        window.removeEventListener("beforeunload", (ev) => {
            ev.preventDefault();
        });
    };

    componentDidMount() {
        this.loadUser();
        this.setupBeforeUnloadListener();
        this.timeout = setTimeout(this.logOut, 1800000);
        this.loadUserTimeout = setTimeout(this.loadUser, 6000);
        this.sendUserTimeout = setTimeout(this.sendUser, 8000);
        this.handleUserInterval = setInterval(this.loadUsers, 5000);
        this.handleMessageInterval = setInterval(this.loadMessages, 5000);
        this.handlePrivateMessageInterval = setInterval(this.loadPrivateMessages, 5000);
    };

    componentWillUnmount() {
        this.removeBeforeUnloadListener();
        clearInterval(this.handleUserInterval);
        clearInterval(this.handleMessageInterval);
        clearInterval(this.handlePrivateMessageInterval);
        clearTimeout(this.loadUserTimeout);
        clearTimeout(this.sendUserTimeout);
        clearTimeout(this.timeout);
    };

    render() {

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 lg-4 md-4 sm-2 xs-2">
                        <div className="card">
                            <div className="card-body">
                                <h1 id="title">M.E.R.N<div></div>Messenger</h1>
                                <h4><span className="fa-layers fa-fw"><i className="fas fa-users"></i><span className="fa-layers-counter" style={{ fontSize: 40 }}>{this.state.users.length}</span></span> Online Now</h4>
                                {this.state.users.length ? (
                                    <div className="users flex-fill text-left">
                                        {this.state.users.map(user => (
                                            <div className="card" key={user._id}>
                                                <div style={{ borderColor: `${user.colorSeed}` }} className="card-header">
                                                    <div onClick={this.handlePrivateMsgFocus} value={user.username} style={{ color: `${user.colorSeed}` }}>
                                                        <img className="img-fluid" alt="" src={user.avatarURL}></img>&nbsp;{user.username} <span className="joinDate" style={{ fontSize: 8 }}>member since {moment(user.date).format("M/YYYY")}</span>
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
                                                <div style={{ borderColor: `${message.userColor}` }} className="card-header">
                                                    <div style={{ color: `${message.userColor}` }}>
                                                        <img className="img-fluid" alt="" src={message.userAvatar}></img>
                                                        &nbsp;{message.author} <span className="msgTime" style={{ fontSize: 8 }}>{moment(message.date).fromNow()}:</span> <br /> <span className="msgBody">{message.message}</span>
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
                                                <div style={{ borderColor: `${privateMessage.userColor}` }} className="card-header">
                                                    <div style={{ color: `${privateMessage.userColor}` }}>
                                                        <img className="img-fluid" alt="" src={privateMessage.userAvatar}></img>
                                                        &nbsp;{privateMessage.author} <span className="privateMsgTime" style={{ fontSize: 8 }}>{moment(privateMessage.date).fromNow()}:</span> <br /> <span className="msgBody">{privateMessage.privateMessage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                        <h5><i className="fab fa-react fa-spin"></i></h5>
                                    )}
                                <span className={`${this.state.username} typing`} style={{ color: `${this.state.userColor}` }}>{this.state.userTyping ? `${this.state.userTyping}...is typing` : ``}</span>
                                <div className="card-footer text-right">
                                     <input id="publicMsg" type="text" name="message" placeholder="📝Public Msg" className="form-control" value={this.state.message} onChange={this.handleInputChange} autoFocus />
                                     <br/>
                                     <button onClick={this.sendMessage} className="btn btn-primary" type="button"><i className="far fa-paper-plane"></i> Send</button>
                                     <label htmlFor="private message"></label>
                                     <input id="privateMsg" type="text" name="privateMessage" placeholder="🔒Private Msg" className="form-control" value={this.state.privateMessage} onChange={this.handleInputChange} />
                                     <br />
                                     <button onClick={this.sendPrivateMessage} className="btn btn-primary" type="button"><i className="far fa-paper-plane"></i> Send </button>
                                     <hr/>
                                     <button onClick={this.logOut} className="btn btn-danger"> <i className="fas fa-user-slash"></i> Logout </button>
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
