const express = require('express')

const path = require("path") //build-in node
const socketIO = require("socket.io")
const http = require("http")
const Room = require("./models/Room")

const _room = new Room();

const app = express()
const server = http.createServer(app)

// console.log(__dirname);

const publicPath = path.join(__dirname + "/../public");
console.log(publicPath);
app.use(express.static(publicPath))


//broadcast n -> (n-1)

//socket 1-1

// io 1-n

io = socketIO(server);
io.on("connection", (socket) => {
    

    socket.on("INFO_FROM_CLIENT_TO_SERVER",(msg)=>{
        const {name,room} =msg;
        const id = socket.id;
        _room.createUser(
            socket.id,
            name,room
        )

        socket.emit("FROM_SERVER_TO_CLIENT",{
            from:"Admin",
            text:"Welcome to Cyber Chat",
            createAt: new Date()
        })

        socket.join(room)

        io.to(room).emit("USER_LIST",{
            users: _room.getUserByRoom(room)
        })


        
    
        socket.to(room).broadcast.emit("FROM_SERVER_TO_CLIENT",{
            from:"Admin",
            text:`${name} join Cyber Chat`,
            createAt: new Date()
        })
        
    
        socket.on("FROM_CLIENT_TO_SERVER",(message)=>{
            io.to(room).emit("FROM_SERVER_TO_CLIENT",message)
        })
    
        socket.on("LOCATION_FROM_CLIENT_TO_SERVER",(msg) =>{       
            io.to(room).emit("LOCATION_FROM_SERVER_TO_CLIENT",msg)
            
        })
    
        socket.on("disconnect", () => {
            const removeUser = _room.removeUser(socket.id)
            if(removeUser){

                io.to(room).emit("FROM_SERVER_TO_CLIENT",{
                    from: "Admin",
                    text: `${removeUser.name} left room`,
                    createAt: new Date().getTime() 
                })

            }   
            
        })

    })

    

    // io.emit("FROM_SERVER_TO_CLIENT",{
    //     text:"Hello user",
    //     from:"admin",
    //     createAt: new Date()
    // })
})


const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`App is running ${port}`);
})
