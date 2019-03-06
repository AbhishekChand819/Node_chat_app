$(".se-pre-con").show().delay(2000).fadeOut();
var socket = io();
socket.on('connect',() =>{
    console.log('Connected to Server');
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
}); 

socket.on('newLocationMessage',(message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
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