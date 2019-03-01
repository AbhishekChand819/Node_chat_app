var socket = io();
socket.on('connect',() =>{
    console.log('Connected to Server');
socket.emit('createMessage',{
    from: 'Abhishek',
    text: 'Hey! There.'
});
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('newMessage', (message) => {
    console.log('newMessage',message);
})