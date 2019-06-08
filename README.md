# M.E.R.N. Messenger
This is a full stack chat app made with Express, React, and Socket.io. Users must create a profile on the sign up page and Passport is used to authenticate users when they login via the login page. Users can view who is online, public messages sent to everyone, and the private messages other users sent to them. Users, public messages, and private messages are stored in a Mongo DB and fetched using Axios calls to a Node/Express REST API/server. Users can send private messages by typing "@" + username of recipient + "/" + message. The app detects when a user is typing and broadcasts the info to all other users. Users receive an audio confirmation that their public message was sent and recipients of private messages receive a text alert. To try the app with a default user, go to login page and enter dude@gmail.com for email and 111111 for password.