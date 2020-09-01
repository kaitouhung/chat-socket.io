const socket = io();

const {name, room}=$.deparam(window.location.search)
console.log(name,room);


socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("INFO_FROM_CLIENT_TO_SERVER",{
        name,
        room
    })

});
socket.on("disconnect", () => {
    console.log("Disconnected to server");
})

socket.on('FROM_SERVER_TO_CLIENT', (msg) => {
    // console.log('New Message: ', message);
    // const text=message.text;
    // const liTag = `<li>${text}</li>`
    // $("#messages").append(liTag);

    const template = $("#message-template").html();
    const html = Mustache.render(template, {
        from: msg.from,
        createAt: moment(msg.createAt).format('h:mm a'),
        text: msg.text
    })

    $("#messages").append(html)
})
socket.on('LOCATION_FROM_SERVER_TO_CLIENT', (msg) => {

    // const url = `https://www.google.com/maps?q=${msg.lat},${msg.lng}`;
    // const aTag = `<a target="_blank" href="${url}" >My location </a>`;
    // const liTag = `<li>${aTag}</li>`;
    // $("#messages").append(liTag);
    const template = $("#location-message-template").html();
    const html = Mustache.render(template,{
        from: msg.from,
        createAt: moment(msg.createAt).format('h:mm a'),
        url: `https://www.google.com/maps?q=${msg.lat},${msg.lng}`
    })
    $("#messages").append(html)

})
// socket.emit("FROM_CLIENT_TO_SERVER", {
//     text: "Hello everyone",
//     from: "User",
//     createAt: new Date()
// })



$("#message-form").on("submit", e => {
    e.preventDefault();
    const text = $("[name=message]").val()

    // const liTag = `<li>${text}</li>`
    // $("#messages").append(liTag);


    socket.emit("FROM_CLIENT_TO_SERVER", {
        from: name,
        text,
        createAt: new Date()
    })
    $("[name=message]").val("");
    $("#messages").scrollTop($("#messages").height());

})

$("#send-location").on("click", e => {
    if (!navigator.geolocation) return alert("Your Brower is old")
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        socket.emit("LOCATION_FROM_CLIENT_TO_SERVER", {
            from: name,
            lat, lng,
            creatAt: new Date()
        })
    })
})


socket.on("USER_LIST",msg =>{
    const users=msg.users;
    const ol = $("<ol></ol>");
    users.forEach(user =>{
        console.log(user);
        const li =$(`<li>${user.name}</li>`)   
        ol.append(li)
    });
    $("#users").html(ol)

})