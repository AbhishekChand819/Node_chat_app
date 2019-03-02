var socket = io();
socket.on('connect',() =>{
    console.log('Connected to Server');
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('newMessage', (message) => {
    console.log('newMessage',message);
}); 

socket.emit('createMessage',{
    from:'Rancho',
    text:'Hadd hogyi..'
} , (data) => {
  console.log('Got It',data);  
});