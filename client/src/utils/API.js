import axios from "axios";

export default {
  getUsers: function() {
    return axios.get("/api/users");
  },
  getUser: function(id) {
    return axios.get("/api/users/" + id);
  },
    // Saves a user to the database
  signUp: function(userData) {
    return axios.post("/api/signup/", userData);
  },
  // Logs a user in
  logIn: function(loginData) {
    return axios.post("/api/login/", loginData);
  },
  // Logs a user out
  logOut: function(id) {
    return axios.get("/api/logout/", id);
  },
  // Saves a message to the database
  saveMessage: function(messageData) {
    return axios.post("/api/messages", messageData);
  },
  getMessages: function() {
    return axios.get("/api/messages");
  },
  // Saves a private message to the database
  savePrivateMessage: function(privateMessageData) {
    return axios.post("/api/privateMessages", privateMessageData);
  },
  getPrivateMessages: function() {
    return axios.get("/api/privateMessages");
  }
}