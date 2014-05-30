// Audio control for music and sound effects in the game
(function(){
"use strict";
	
window.AudioContext = window.AudioContext || window.webkitAudioContext; // Correct AudioContext element

	rigger.audio = {

		// My very own audio object!
		Audio : function(buffer, context){
			var source = null;
			var gainNode = null;

			var volume = 1;
			this.setVolume = function(vol){
				try{
					volume = vol;
					gainNode.gain.value = volume;
				}catch(e){}
			};

			this.loop = false;
			this.play = function(){
				source = context.createBufferSource();
				source.buffer = buffer;
				source.connect(context.destination);
				source.loop = this.loop;

				// Volume related stuff
				gainNode = context.createGain();
				source.connect(gainNode);
				gainNode.connect(context.destination);
				gainNode.gain.value = volume;

				source.start();
			};

			this.stop = function(){
				try{
					source.stop();
				}catch(e){}
			};
		},

		create : function(data, callback){
			var cont = new AudioContext();
			cont.decodeAudioData(data, function(buff){
				callback.call(rigger, new rigger.audio.Audio(buff, cont));
			});
		},
		
		play : function(track){
			var p =  rigger.assets.audio[track];
			if(p && p.play){
				p.play();
			}
		},

		playLoop : function(track){
			rigger.assets.audio[track].loop = true;
			rigger.audio.play(track);
		},

		stop : function(track){
			var p =  rigger.assets.audio[track];
			if(p && p.play){
				p.loop = false;
				p.stop();
			}
		},

		setVol : function(vol){
			rigger.settings.volume = vol;
			for(var a in rigger.assets.audio){
				rigger.assets.audio[a].setVolume(vol);
			}
		},

		volUp : function(){
			rigger.audio.setVol(0.1);
		},

		volDown : function(){
			rigger.audio.setVol(-0.1);
		}
		
		
	};
})();
