var player;	
window.onYouTubeIframeAPIReady = function () {
	console.log("geting to here\n");
		player = new YT.Player("player", {
	    height: "600", 
		  width: "400", 
			videoId: "0CFuCYNx-1g", 
      playerVars: {
				'autoplay': 1,
				'controls': 0,
				'disablekb': 1,
				'enablejsapi': 1,
				'rel': 0
			},
			events: {
	     	onReady: function (event){
					event.target.playVideo();
				},
				onStateChange: onPlayerStateChange
      }
    });
	};

function onPlayerStateChange (event) {
		if (event.data == YT.PlayerState.ENDED){
			player.loadVideoById(queue.shift(), 0, "default");
			//Video Ended

		}
	}



var queue = [];
Template.Admin.onCreated(function(){
	console.log("Created");
	queue.push('KS7UW_-toBk');
	queue.push('fzllVlzzeuo');
	queue.push('Jn2PNlhvy8E');
	queue.push('W1PNvopXjbg');

	YT.load();


	Template.myButtons.events({
		'click #playPauseButton': function() {
			console.log("click play/pause");
			if (event.target.value == "Pause"){
				event.target.value = "Play";
				player.pauseVideo();
			}
			else{
				event.target.value = "Pause";
				player.playVideo();
			}
		},
		'click #skipButton': function() {
			console.log("click skip");
			player.loadVideoById(queue.shift(), 0, "default");
			player.playVideo();
		}	
	});
});

