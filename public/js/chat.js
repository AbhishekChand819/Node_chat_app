
var socket = io();

function scrollToBottom() {
  $(".msger-chat").animate({ scrollTop: $(".msger-chat").height() }, 500);
}

socket.on('connect',() =>{
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            console.log('No Error');
        }
    });
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('updateUserList',function(users) {
    var ol = jQuery('<ul class="plus"></ul>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').html('<i class="fa fa-user" aria-hidden="true"></i> &nbsp;&nbsp;'+user));
    });
    jQuery('#users').html(ol);
});

let position;
let urlParams = new URLSearchParams(window.location.search);
let name = urlParams.get('name');

socket.on('newMessage', (message) => {
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newAdminMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#admin-message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newAdminLMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#adminl-message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newLocationMessage',(message) => {
    $(".msger-chat").LoadingOverlay("hide");
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
})

socket.on('newImgMessage', (message) => {
    $(".msger-chat").LoadingOverlay("hide");
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#img-message-template').html();
    var html = Mustache.render(template, {
        image: message.image,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newVidMessage', (message) => {
    $(".msger-chat").LoadingOverlay("hide");
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#vid-message-template').html();
    var html = Mustache.render(template, {
        vid: message.vid,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newAttMessage', (message) => {
    $(".msger-chat").LoadingOverlay("hide");
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#att-message-template').html();
    var html = Mustache.render(template, {
        att: message.att,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

$("#message-form").on('submit', function(e){
  e.preventDefault();
  var messageTextbox = $('.emojionearea-editor');
  socket.emit('createMessage',{
      text:messageTextbox.html()
  },()=>{
      messageTextbox.html('')
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
        $(".msger-chat").LoadingOverlay("show");
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch Location. ');
    });
});

  $('#imagefile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        $(".msger-chat").LoadingOverlay("show");
        socket.emit('createImgMessage', {img: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

  $('#videofile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        $(".msger-chat").LoadingOverlay("show");
        socket.emit('createVidMessage', {vid: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

$('#attfile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        $(".msger-chat").LoadingOverlay("show");
        socket.emit('createAttMessage', {att: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

    $(function(){
      setTimeout(function(){
        $(".emojionearea").css("margin", "10px 15px");
        $('.emojionearea-editor').keypress(function(e){   
          if(e.which == 13 && e.shiftKey) {
            
          } else if (e.which == 13) {
            var messageTextbox = $('.emojionearea-editor');
            socket.emit('createMessage',{
                text:messageTextbox.html()
            },()=>{
                messageTextbox.html('')
            });
          }
        });
      }, 1000);
    });