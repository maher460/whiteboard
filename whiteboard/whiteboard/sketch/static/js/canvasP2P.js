$(document).ready(function(){

	channel = new DataChannel(project_id || 'auto-session-establishment', {
                    firebase: 'webrtc'
                });

    channel.transmitRoomOnce = false;
	
	/* channel = new DataChannel();
	channel.firebase = 'webrtc-experiment';
	channel.open('maher460x' || 'channel'); */
	/* channel.connect('maher460x' || 'channel'); */
	
	channel.onopen = function() {
						console.log('CONNECTED!');
					};

    //channel.autoCloseEntireSession = true;
    /*channel.onclose = function(){

        alert("CHANNEL CLOSED!");

    };*/

/*    channel.onclose = function(event) {

        setTimeout(function(){

            channel = new DataChannel();
	        channel.firebase = 'webrtc-experiment';
	        channel.open(project_id || 'channel');


        }, 0);

    }*/

});