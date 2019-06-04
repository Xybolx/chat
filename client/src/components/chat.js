import React from "react";
import Sound from "react-sound";
import Clock from "./clock";
import Users from "./users";
import Title from "./title";
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
            typingUsers: [],
            userTyping: '',
            userTypingColor: '',
            userTypingAvatar: '',
            message: '',
            privateMessage: '',
            privateMessages: [],
            messages: [],
            msgSent: '',
            prvtSent: '',
            prvtSentColor: '',
            prvtSentAvatar: '',
            joiningUsers: [],
            userJoining: '',
            userJoiningAvatar: '',
            otherUser: '',
            roomInvite: '',
            roomName: '',
            dmMessage: ''
        };

        this.socket = io("https://mernmessenger.herokuapp.com");

        this.socket.on('RECEIVE_MESSAGE', data => {
            addMessage(data);
        });

        this.socket.on('RECEIVE_ROOM_JOIN', data => {
            console.log(`${data.username} joined ${data.username + data.otherUser}`);
            this.setState({ roomInvite: `${data.username} invited you to a private chat ${data.username + data.otherUser}`, roomName: `${data.username}${data.otherUser}` })
        });

        this.socket.on('RECEIVE_ACCEPT_ROOM_JOIN', data => {
            console.log(`${data.username} joined ${data.roomName}`);
        });

        this.socket.on('RECEIVE_STATUS', data => {
            addStatus(data);
            if (data) {
                this.setState({ msgSent: "message sent" })
            }
            clearTimeout(this.sendMsgTimeout);
            this.sendMsgTimeout = setTimeout(this.sendingMsgTimeout, 3000);
        });

        this.socket.on('RECEIVE_USER', data => {
            addUser(data);
            const joiningUser = `${data.user.username}`;
            if (data && this.state.userJoining !== data.user.username) {
                this.setState({ joiningUsers: [...this.state.joiningUsers, data], userJoining: joiningUser })
            } 
            clearTimeout(this.userJoinedTimeout);
            this.userJoinedTimeout = setTimeout(this.userJoiningTimeout, 4000);
        });

        this.socket.on('RECEIVE_PRIVATE_MESSAGE', data => {
            addPrivateMessage(data);
            const privateSender = `${data.author}`;
            const privateColor = `${data.userColor}`;
            const privateAvatar = `${data.userAvatar}`;
            if (data) {
                this.setState({ prvtSent: privateSender, prvtSentColor: privateColor, prvtSentAvatar: privateAvatar })
            }
            clearTimeout(this.sendPrivateMsgTimeout);
            this.sendPrivateMsgTimeout = setTimeout(this.sendingPrivateMsgTimeout, 4000);
        });

        this.socket.on('RECEIVE_DM_MESSAGE', data => {
            alert(`DM: ${data.dmMessage} from ${data.author}`);
        });

        this.socket.on('RECEIVE_TYPING_USER', data => {
            addTypingUser(data);
            if (data && !this.state.userTyping){
                console.log(data.username + ' is typing');
                this.setState({ typingUsers: [...this.state.typingUsers, data], userTyping: data.username });
            }
            clearTimeout(this.typeTimeout);
            this.typeTimeout = setTimeout(this.typingTimeout, 2500);
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

        const addStatus = data => {
        };

        this.handleFormSubmit = ev => {
            ev.preventDefault();
            this.resetLogOutTimeout();
            let msg = this.state.message.substr(1);
            let ind = msg.indexOf('/');
            let receiver = msg.substr(0, ind);
            let messageIndex = msg.substr(ind + 1);
            if (this.state.message.substr(0, 1) === '@' && ind !== -1) {
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

                this.setState({ message: '' });

            } else {
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

                this.socket.emit('SEND_STATUS', {
                    author: this.state.username
                });

                this.setState({ message: '' });
            }
        };

        this.sendDM = (ev) => {
            ev.preventDefault();
            this.socket.emit('SEND_DM_MESSAGE', {
                roomName: this.state.roomName,
                author: this.state.username,
                dmMessage: this.state.dmMessage
            });
        };
        
        this.handleInputChange = ev => {
            const { name, value } = ev.target;
            this.setState({
                [name]: value
            });
            this.socket.emit('SEND_TYPING_USER', {
                username: this.state.username,
                userColor: this.state.userColor,
                userAvatar: this.state.userAvatar
            });
        };
        
        this.logOut = () => {
            API.logOut()
            .then(res => window.location = "/login")
            .catch(err => console.log(err))
        };
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
        });
    };

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

    // Event timeouts
    resetLogOutTimeout = () => {
        clearTimeout(this.logOutTimeout);
        this.logOutTimeout = setTimeout(this.logOut, 1800000);
    };

    userJoiningTimeout = () => {
        this.setState({ joiningUsers: [], userJoining: '' });
    };

    typingTimeout = () => {
        this.setState({ typingUsers: [], userTyping: '' });
    };

    sendingMsgTimeout = () => {
        this.setState({ msgSent: '' });
    };

    sendingPrivateMsgTimeout = () => {
        this.setState({ prvtSent: '', prvtSentColor: '', prvtSentAvatar: '' });
    };

    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.logOut();
        });
    };

    // logs user out on page unload
    removeBeforeUnloadListener = () => {
        window.removeEventListener("beforeunload", (ev) => {
            ev.preventDefault();
        });
    };

    handleRoomJoin = () => {
        this.socket.emit('SEND_ROOM_JOIN', {
            username: this.state.username,
            otherUser: this.state.otherUser
                
        });
    };

    acceptRoomJoin = () => {
        this.socket.emit('SEND_ACCEPT_ROOM_JOIN', {
            roomName: this.state.roomName,
            username: this.state.username
        });
    };

    handleTimers = () => {
        this.logOutTimeout = setTimeout(this.logOut, 1800000);
        this.loadUserTimeout = setTimeout(this.loadUser, 5000);
        this.sendUserTimeout = setTimeout(this.sendUser, 7000);
        this.handleMessageInterval = setInterval(this.loadMessages, 5000);
        this.handlePrivateMessageInterval = setInterval(this.loadPrivateMessages, 5000);
    }

    clearTimers = () => {
        clearInterval(this.handleMessageInterval);
        clearInterval(this.handlePrivateMessageInterval);
        clearTimeout(this.loadUserTimeout);
        clearTimeout(this.sendUserTimeout);
        clearTimeout(this.logOutTimeout);
        clearTimeout(this.typeTimeout);
        clearTimeout(this.sendPrivateMsgTimeout);
        clearTimeout(this.userJoinedTimeout);
        clearTimeout(this.sendMsgTimeout);
    }

    componentDidMount() {
        this.setupBeforeUnloadListener();
        this.handleTimers();
        this.loadUser();
        this.loadMessages();
        this.loadPrivateMessages();
    };

    componentWillUnmount() {
        this.removeBeforeUnloadListener();
        this.clearTimers();
    };

    render() {

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 lg-4 md-4 sm-2 xs-2">
                        <div className="card">
                            <div className="card-body">
                                <Title />
                                    <Clock />
                                        <Users />
                                <h4><span className="fa-layers fa-fw"><i className="fas fa-comment-alt"></i><span className="fa-layers-counter" style={{ fontSize: 40 }}>{this.state.messages.length}</span></span> Public Msgs</h4>
                                {this.state.messages.length ? (
                                    <div className="messages">
                                        {this.state.messages.map(message => (
                                            <div className="card" key={message._id}>
                                                <div style={{ borderColor: `${message.userColor}` }} className="card-header">
                                                    <div onClick={this.handleRoomJoin} style={{ color: `${message.userColor}` }}>
                                                        <input className={`${message.author} join`} type="checkbox" value={message.author} onChange={ev => this.setState({ otherUser: ev.target.value })}></input>
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
                                <h4> <i className="fas fa-info"></i> Info</h4>
                                <div className="info">
                                    <button onClick={this.acceptRoomJoin} className="btn btn-success btn-md" type="button" {...this.state.roomInvite ? {display: "block"} : {display: "none"}}>{this.state.roomInvite}</button>
                                <div className="typing">
                                {this.state.typingUsers.map(typingUser => {
                                    return (
                                        <div style={{ color: `${typingUser.userColor}` }}><img className="img-fluid" src={`${typingUser.userAvatar}`} alt=""></img>&nbsp;{typingUser.username}...is typing</div>
                                    )
                                })}
                                </div>
                                <div className="joining">
                                {this.state.joiningUsers.map(joiningUser => {
                                    return (
                                        <div className="user-alert joining" style={{ color: `${joiningUser.user.colorSeed}` }}><img className="img-fluid" src={`${joiningUser.user.avatarURL}`} alt=""></img>&nbsp;{joiningUser.user.username}&nbsp;joined!</div>
                                    )
                                })}
                                </div>
                                <div className={`${this.state.username} sendingPrvt`} style={{ color: `${this.state.prvtSentColor}` }} {...this.state.prvtSent ? {display: "block"} : {display: "none"}}>
                                    {this.state.prvtSent ? <img className="img-fluid" src={this.state.prvtSentAvatar} alt=""></img> : ""}
                                    &nbsp;{this.state.prvtSent ? `${this.state.prvtSent}...sent you a private message!` : ``}
                                </div>
                                <div className={`${this.state.username} sending`} style={{ color: `${this.state.userColor}` }} {...this.state.msgSent ? {display: "block"} : {display: "none"}}>{this.state.msgSent ? <Sound url="sentmsg.wav" playStatus={Sound.status.PLAYING} /> : ``}</div>
                                </div>
                                <div className="card-footer text-left">
                                     <form id="msgsForm">
                                     <input id="dmMsg" type="text" name="dmMessage" placeholder="📝DM Msg" className="form-control" value={this.state.dmMessage} onChange={this.handleInputChange} />
                                     <br/>
                                     <button onClick={this.sendDM} className="btn btn-primary btn-block" type="button"><i className="far fa-paper-plane"></i>&nbsp; Send DM</button>
                                     <label id="msgLabel" htmlFor="message" />Message
                                     <input id="publicMsg" type="text" name="message" placeholder="📝Type Msg" className="form-control" value={this.state.message} onChange={this.handleInputChange} autoFocus />
                                     <br/>
                                     <button onClick={this.handleFormSubmit} className="btn btn-primary btn-block" type="button"><i className="far fa-paper-plane"></i>&nbsp;{this.state.msgSent ? `Sending...` : `Send` }</button>
                                     </form>
                                     <button onClick={this.logOut} className="btn btn-danger btn-block"> <i className="fas fa-user-slash"></i> Logout </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default Chat;
