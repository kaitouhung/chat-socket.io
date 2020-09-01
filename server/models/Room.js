class Room {
    constructor(){
        this.list = [];        
    }

    createUser(id, name , room){
        const user = {id,name,room};
        this.list.push(user)

    }

    getUserById(id){
        const user = this.list.filter(user =>user.id === id)[0]
        return user

    }

    removeUser(id){
        const user =this.getUserById(id);
        const theList = this.list.filter(user =>user.id !==id);
        this.list = theList;
        return user;

    }

    getUserByRoom(room){
        return this.list.filter(user =>user.room ===room);


    }


}

module.exports = Room