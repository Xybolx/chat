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
            leavingUsers: [],
            userJoining: '',
            userLeaving: ''
        };

        // initialize socket
        this.socket = io("https://mernmessenger.herokuapp.com");

        // client receive socket events
        this.socket.on('RECEIVE_MESSAGE', data => {
            addMessage(data);
        });

        this.socket.on('RECEIVE_STATUS', data => {
            addStatus(data);
            if (data) {
                this.setState({ msgSent: "message sent" })
            }
            clearTimeout(this.sendMsgTimeout);
            this.sendMsgTimeout = setTimeout(this.sendingMsgTimeout, 3000);
        });

        this.socket.on('RECEIVE_USER_JOINED', data => {
            addUser(data);
            const joiningUser = `${data.user.username}`;
            if (data && this.state.userJoining !== joiningUser) {
                this.setState({ joiningUsers: [...this.state.joiningUsers, data], userJoining: joiningUser })
            } 
            clearTimeout(this.userJoinedTimeout);
            this.userJoinedTimeout = setTimeout(this.userJoiningTimeout, 4000);
        });

        this.socket.on('RECEIVE_USER_LEFT', data => {
            removeUser(data);
            const leavingUser = `${data.user.username}`;
            if (data && this.state.userLeaving !== leavingUser) {
                this.setState({ leavingUsers: [...this.state.leavingUsers, data], userLeaving: leavingUser })
            } 
            clearTimeout(this.userLeftTimeout);
            this.userLeftTimeout = setTimeout(this.userLeavingTimeout, 4000);
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

        this.socket.on('RECEIVE_TYPING_USER', data => {
            addTypingUser(data);
            if (data && this.state.userTyping !== data.username && !this.state.typingUsers.includes(data.username)) {
                console.log(this.state.typingUsers);
                this.setState({ typingUsers: [...this.state.typingUsers, data], userTyping: data.username });
                clearTimeout(this.typeTimeout);
                this.typeTimeout = setTimeout(this.typingTimeout, 3500);
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

        const removeUser = data => {
        };

        const addTypingUser = data => {
        };

        const addStatus = data => {
        };    
    };

    // handle msg form submit
    handleFormSubmit = ev => {
        ev.preventDefault();

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

            this.resetLogOutTimeout();
            this.setState({ message: '' });

        } else {
            this.saveMsg();
            this.sendMsg();
            this.sendStatus();
            this.resetLogOutTimeout();
            this.setState({ message: '' });
        };
    };
    
    // handle input change/send typing user
    handleInputChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });

        this.sendTypingUser();
    };

    // socket send events
    sendUser = () => {
        this.socket.emit('SEND_USER_JOINED', {
            user: this.state.user
        });
    };

    sendTypingUser = () => {
        this.socket.emit('SEND_TYPING_USER', {
            username: this.state.username,
            userColor: this.state.userColor,
            userAvatar: this.state.userAvatar
        });
    };

    sendMsg = () => {
        this.socket.emit('SEND_MESSAGE', {
            author: this.state.username,
            userAvatar: this.state.userAvatar,
            userColor: this.state.userColor,
            message: this.state.message
        });
    };

    sendStatus = () => {
        this.socket.emit('SEND_STATUS', {
            author: this.state.username
        });
    };

    sendUserLeft = () => {
        this.socket.emit('SEND_USER_LEFT', {
            user: this.state.user
        });
    };
    
    // API calls
    logOut = () => {
        this.sendUserLeft();
        API.logOut()
        .then(res => window.location = "/login")
        .catch(err => console.log(err))
    };

    loadUser = () => {
        API.getUser()
            .then(res =>
                this.setState({ user: res.data, username: res.data.username, userAvatar: res.data.avatarURL, userColor: res.data.colorSeed }))
                .catch(err => console.log(err))
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

    saveMsg = () => {
        API.saveMessage({
            author: this.state.username,
            userAvatar: this.state.userAvatar,
            userColor: this.state.userColor,
            message: this.state.message
        });
    };

    // event timeouts
    resetLogOutTimeout = () => {
        clearTimeout(this.logOutTimeout);
        this.logOutTimeout = setTimeout(this.logOut, 1800000);
    };

    userJoiningTimeout = () => {
        this.setState({ joiningUsers: [], userJoining: '' });
    };

    userLeavingTimeout = () => {
        this.setState({ leavingUsers: [], userLeaving: '' });
    };

    typingTimeout = () => {
        this.socket.emit('SEND_TYPING_USER', false);
        this.setState({ typingUsers: [], userTyping: '' });
    };

    sendingMsgTimeout = () => {
        this.setState({ msgSent: '' });
    };

    sendingPrivateMsgTimeout = () => {
        this.setState({ prvtSent: '', prvtSentColor: '', prvtSentAvatar: '' });
    };

    // sets up logging user out on page unload
    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.logOut();
        });
    };

    // removes setup logging user out on page unload
    removeBeforeUnloadListener = () => {
        window.removeEventListener("beforeunload", (ev) => {
            ev.preventDefault();
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
        clearTimeout(this.userLeftTimeout);
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
                                <h4> <i className="fas fa-info"></i> Info</h4>
                                <div className="info">
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
                                <div className="leaving">
                                {this.state.leavingUsers.map(leavingUser => {
                                    return (
                                        <div className="user-alert leaving" style={{ color: `${leavingUser.user.colorSeed}` }}><img className="img-fluid" src={`${leavingUser.user.avatarURL}`} alt=""></img>&nbsp;{leavingUser.user.username}&nbsp;Left!</div>
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
                                     <label className="label" htmlFor="message">Msg/Private Msg-@username/</label>
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
