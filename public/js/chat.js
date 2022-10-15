const messagesDiv = document.querySelector(".messages");
let inputMessage = document.querySelector(".input-message");
const usersDiv = document.querySelector(".users");
const submitBtn = document.querySelector(".submit-btn");
const locationBtn = document.querySelector(".location-btn");

const scrollToBottom = () => {
  const lastMessage = messagesDiv.lastElementChild;
  lastMessage.scrollIntoView();
};

const socket = io();

socket.on("connect", () => {
  const paramString = window.location.href.split("?")[1];
  const queryString = new URLSearchParams(paramString);
  const params = {};
  for (let pair of queryString.entries()) {
    params[pair[0]] = pair[1].trim();
  }
  if (!params.name | !params.room) {
    window.location.href = "/";
  } else {
    socket.emit("join", params, (err) => {
      if (err) {
        alert("try again");

        window.location.href = "/";
      } else {
        console.log("user joined");
      }
    });
  }
});

socket.on("updateUsersList", (users) => {
  usersDiv.innerHTML = "";
  const span = document.createElement("span");
  span.setAttribute("class", "user-text");
  span.innerText = "Users";
  usersDiv.appendChild(span);

  users.map((user) => {
    const div = document.createElement("div");
    div.innerText = user;
    div.setAttribute("class", "user-cover");
    usersDiv.appendChild(div);
  });
});

socket.on("disconnect", () => {
  console.log("a user was disconnected");
});

socket.on("newMessage", (message) => {
  if (message.text) {
    const liveTime = new Date().getTime();
    const formattedTime = moment(liveTime).format("LT");
    const div = document.createElement("div");
    div.setAttribute("class", "message-cover");
    const titleSpan = document.createElement("span");
    const messageSpan = document.createElement("span");
    const dateSpan = document.createElement("span");
    titleSpan.innerText = message.from;
    messageSpan.innerText = message.text;
    dateSpan.innerText = formattedTime;
    titleSpan.setAttribute("class", "message-title");
    messageSpan.setAttribute("class", "message");
    dateSpan.setAttribute("class", "message-date");
    div.appendChild(titleSpan);
    div.appendChild(messageSpan);
    div.appendChild(dateSpan);
    messagesDiv.appendChild(div);
    scrollToBottom();
  }
});

socket.on("newLocationMessage", (message) => {
  const liveTime = new Date().getTime();
  const formattedTime = moment(liveTime).format("LT");
  const div = document.createElement("div");
  div.setAttribute("class", "message-cover");
  const titleSpan = document.createElement("span");
  const urlMessage = document.createElement("a");
  const dateSpan = document.createElement("span");
  titleSpan.innerText = message.date;
  urlMessage.innerText = "My current location";
  dateSpan.innerText = formattedTime;
  titleSpan.setAttribute("class", "message-title");
  urlMessage.setAttribute("class", "message");
  urlMessage.setAttribute("hrf", message.url);
  urlMessage.setAttribute("target", "_blank");
  dateSpan.setAttribute("class", "message-date");
  div.appendChild(titleSpan);
  div.appendChild(urlMessage);
  div.appendChild(dateSpan);
  messagesDiv.appendChild(div);
  scrollToBottom();
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("createMessage", {
    from: "user",
    text: inputMessage.value,
  });
  inputMessage.value = "";
});

locationBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("geolocation is not supported on your browser");
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      socket.emit("createLocationMessage", {
        from: "user",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => alert("unable to fetch location")
  );
});
