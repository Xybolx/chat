import axios from "axios";

export default {
  // gets all users who are online
  getUsers: function() {
    return axios.get("/api/users");
  },
  // gets a specific user
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
  // Saves a public message to the database
  saveMessage: function(messageData) {
    return axios.post("/api/messages", messageData);
  },
  // gets all public messages
  getMessages: function() {
    return axios.get("/api/messages");
  },
  deleteMessages: function() {
    return axios.delete("/api/messages");
  },
  // Saves a private message to the database
  savePrivateMessage: function(privateMessageData) {
    return axios.post("/api/privateMessages", privateMessageData);
  },
  // gets all private messages for a given user
  getPrivateMessages: function() {
    return axios.get("/api/privateMessages");
  },
  // deletes private messages for a given user
  deletePrivateMessages: function() {
    return axios.delete("/api/privateMessages");
  }
}