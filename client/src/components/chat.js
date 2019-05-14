import React from "react";
import io from "socket.io-client";
import API from "../utils/API";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: {},
            userAvatar: {},
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
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };

        const addPrivateMessage = data => {
            console.log(data);
            this.setState({ privateMessages: [...this.state.privateMessages, data] });
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
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    message: this.state.message
                })
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
                this.socket.emit('SEND_PRIVATE_MESSAGE', {
                    receiver: receiver,
                    author: this.state.username,
                    userAvatar: this.state.userAvatar,
                    privateMessage: messageIndex,
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
                this.setState({ username: res.data.username, userAvatar: res.data.avatarURL }),
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
        this.handleInterval = setInterval(this.loadUsers, 5000);
    }

    componentWillUnmount() {
        this.logOut();
        clearInterval(this.handleInterval);
        clearTimeout(this.timeout);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-4 sm-2">
                        <div className="card">
                            <div className="card-body">
                            <h1 id="title">CYBORG CHAT</h1>
                            <div className="container">
                                <h4> {this.state.users.length} <i className="fas fa-users"></i> Online Now </h4>
                                {this.state.users.length ? (
                                    <div className="users flex-fill text-justify-center">
                                        {this.state.users.map(user => (
                                            <div key={user._id}>
                                                <strong>
                                                    <img className="img-fluid" alt="" src={user.avatarURL}></img>&nbsp;{user.username}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <h4><i className="fab fa-react fa-spin"></i> Loading Users <i className="fab fa-react fa-spin"></i></h4>
                                    )}
                                <h4> <i className="far fa-comment-alt"></i> Messages </h4>
                                {this.state.messages.length ? (    
                                    <div className="messages">
                                        {this.state.messages.slice(0).reverse().map(message => (
                                            <div className="card" key={message.message}>
                                                <div className="card-header">
                                                    <strong>
                                                        <img className="img-fluid" alt="" src={message.userAvatar}></img>
                                                        &nbsp;{message.author}
                                                    </strong>
                                                </div>
                                                {message.message}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <h4><i className="fab fa-react fa-spin"></i> No Messages <i className="fab fa-react fa-spin"></i></h4>
                                    )}
                                    <h4> <i className="far fa-comment-alt"></i> Private Messages </h4>
                                {this.state.privateMessages.length ? (    
                                    <div className="privateMessages">
                                        {this.state.privateMessages.slice(0).reverse().map(privateMessage => (
                                            <div className="card" key={privateMessage.privateMessage}>
                                                <div className="card-header">
                                                <strong>
                                                    <img className="img-fluid" alt="" src={privateMessage.userAvatar}></img>
                                                    &nbsp;{privateMessage.author}
                                                </strong>
                                                </div>
                                                {privateMessage.privateMessage}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <h4><i className="fab fa-react fa-spin"></i> No Private Msg <i className="fab fa-react fa-spin"></i></h4>
                                    )}
                            </div>
                            <div className="card-footer">
                                <input type="text" name="message" placeholder="📝 Message" className="form-control" value={this.state.message} onChange={this.handleInputChange} autoFocus />
                                <br />
                                <button onClick={this.sendMessage} className="btn btn-primary form-control"> <i className="far fa-paper-plane"></i> Send </button>
                                <hr />
                                <input type="text" name="privateMessage" placeholder="📝 Private Message" className="form-control" value={this.state.privateMessage} onChange={this.handleInputChange} />
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
