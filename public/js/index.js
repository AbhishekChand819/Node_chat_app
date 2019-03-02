$(".se-pre-con").show().delay(2000).fadeOut();
var socket = io();
socket.on('connect',() =>{
    console.log('Connected to Server');
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('newMessage', (message) => {
    console.log('newMessage',message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} :  ${message.text}`);

    jQuery('#messages').append(li);
}); 

socket.on('newLocationMessage',(message) => {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current Location</a>');
    
    li.text(`${message.from}:  `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit',(e) => {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from:'User',
        text:messageTextbox.val()
    },()=>{
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled','disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch Location. ');
    });
});