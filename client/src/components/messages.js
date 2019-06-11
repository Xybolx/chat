import React, { Component } from "react";
import moment from "moment";
import API from "../utils/API";

class Messages extends Component {
    state = {
        messages: []
    }

    render() {
        return (
            <div>
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
                                    </div>
        );
    };
};

export default Messages;