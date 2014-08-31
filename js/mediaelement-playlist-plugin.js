/* globals mejs, MediaElementPlayer */
'use strict';

/**
 * @file MediaElement Playlist Feature (plugin).
 * @author Rocco Georgi <rocco@pavingways.com>
 * Twitter handle: geeroc
 * @author Original author: Andrew Berezovsky <andrew.berezovsky@gmail.com>
 * Twitter handle: duozersk
 * @author Original author: Junaid Qadir Baloch <shekhanzai.baloch@gmail.com>
 * Twitter handle: jeykeu
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function ($) {
	$.extend(mejs.MepDefaults, {
		loopText: 'Repeat On/Off',
		shuffleText: 'Shuffle On/Off',
		nextText: 'Next Track',
		prevText: 'Previous Track',
		playlistText: 'Show/Hide Playlist'
	});

	$.extend(MediaElementPlayer.prototype, {
		// LOOP TOGGLE
		buildloop: function (player, controls, layers, media) {
			var t = this;

			var loop = $('<div class="mejs-button mejs-loop-button ' + ((player.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off') + '">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + player.options.loopText + '"></button>' +
				'</div>')
				// append it to the toolbar
				.appendTo(controls)
				// add a click toggle event
				.click(function () {
					player.options.loop = !player.options.loop;
					$(media).trigger('mep-looptoggle', [player.options.loop]);
					if (player.options.loop) {
						loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
						//media.setAttribute('loop', 'loop');
					} else {
						loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
						//media.removeAttribute('loop');
					}
				});

			t.loopToggle = t.controls.find('.mejs-loop-button');
		},
		loopToggleClick: function () {
			var t = this;
			t.loopToggle.trigger('click');
		},
		// SHUFFLE TOGGLE
		buildshuffle: function (player, controls, layers, media) {
			var t = this;

			var shuffle = $('<div class="mejs-button mejs-shuffle-button ' + ((player.options.shuffle) ? 'mejs-shuffle-on' : 'mejs-shuffle-off') + '">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + player.options.shuffleText + '"></button>' +
				'</div>')
				// append it to the toolbar
				.appendTo(controls)
				// add a click toggle event
				.click(function () {
					player.options.shuffle = !player.options.shuffle;
					$(media).trigger('mep-shuffletoggle', [player.options.shuffle]);
					if (player.options.shuffle) {
						shuffle.removeClass('mejs-shuffle-off').addClass('mejs-shuffle-on');
					} else {
						shuffle.removeClass('mejs-shuffle-on').addClass('mejs-shuffle-off');
					}
				});

			t.shuffleToggle = t.controls.find('.mejs-shuffle-button');
		},
		shuffleToggleClick: function () {
			var t = this;
			t.shuffleToggle.trigger('click');
		},
		// PREVIOUS TRACK BUTTON
		buildprevtrack: function (player, controls, layers, media) {
			var t = this;

			var prevTrack = $('<div class="mejs-button mejs-prevtrack-button mejs-prevtrack">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + player.options.prevText + '"></button>' +
				'</div>');

			prevTrack.appendTo(controls)
				.click(function () {
					$(media).trigger('mep-playprevtrack');
					player.playPrevTrack();
				});

			t.prevTrack = t.controls.find('.mejs-prevtrack-button');
		},
		prevTrackClick: function () {
			var t = this;
			t.prevTrack.trigger('click');
		},

		// NEXT TRACK BUTTON
		buildnexttrack: function (player, controls, layers, media) {
			var t = this;

			var nextTrack = $('<div class="mejs-button mejs-nexttrack-button mejs-nexttrack">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + player.options.nextText + '"></button>' +
				'</div>');

			nextTrack.appendTo(controls)
				.click(function () {
					$(media).trigger('mep-playnexttrack');
					player.playNextTrack();
				});

			t.nextTrack = t.controls.find('.mejs-nexttrack-button');
		},
		nextTrackClick: function () {
			var t = this;
			t.nextTrack.trigger('click');
		},

		// PLAYLIST TOGGLE
		buildplaylist: function (player, controls, layers, media) {
			var t = this;

			// build playlist button
			var playlistToggle = $('<div class="mejs-button mejs-playlist-button ' + ((player.options.playlist) ? 'mejs-hide-playlist' : 'mejs-show-playlist') + '">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + player.options.playlistText + '"></button>' +
				'</div>');

			playlistToggle.appendTo(controls)
				.click(function () {
					// toggle playlist display
					t.togglePlaylistDisplay(player, layers, media);
				});

			t.playlistToggle = t.controls.find('.mejs-playlist-button');
		},
		playlistToggleClick: function () {
			var t = this;
			t.playlistToggle.trigger('click');
		},
		// PLAYLIST WINDOW
		buildplaylistfeature: function (player, controls, layers, media) {

			// add playlist view to layers
			var t = this,
				playlist = $('<div class="mejs-playlist mejs-layer">' +
				'<ul class="mejs"></ul>' +
				'</div>')
				.appendTo(layers);

			// activate playlist display when data-showplaylist is set
			if (!!$(media).data('showplaylist')) {
				player.options.playlist = true;
				// hide play overlay button
				$('#' + player.id).find('.mejs-overlay-play').hide();
			}

			if(!player.options.playlist) {
				playlist.hide();
			}

			var getTrackName = function (trackUrl) {
				var trackUrlParts = trackUrl.split('/');
				if (trackUrlParts.length > 0) {
					return decodeURIComponent(trackUrlParts[trackUrlParts.length - 1]);
				} else {
					return '';
				}
			};

			// calculate tracks and build playlist
			var tracks = [],
				sourceIsPlayable,
				foundMatchingType = '';
			//$(media).children('source').each(function (index, element) { // doesn't work in Opera 12.12

			$('#' + player.id).find('.mejs-mediaelement source').each(function () {
				sourceIsPlayable = $(this).parent()[0].canPlayType(this.type);
				if (!foundMatchingType && (sourceIsPlayable === 'maybe' || sourceIsPlayable === 'probably')) {
					foundMatchingType = this.type;
				}
				if (!!foundMatchingType && this.type === foundMatchingType) {
					if ($.trim(this.src) !== '') {
						var track = {};
						track.source = $.trim(this.src);
						if ($.trim(this.title) !== '') {
							track.name = $.trim(this.title);
						} else {
							track.name = getTrackName(track.source);
						}
						// add poster image URL from data-poster attribute
						track.poster = $(this).data('poster');
						tracks.push(track);
					}
				}
			});

			for (var track in tracks) {
				var $thisLi = $('<li data-url="' + tracks[track].source + '" data-poster="' + tracks[track].poster + '" title="' + tracks[track].name + '"><span>' + tracks[track].name + '</span></li>');
				layers.find('.mejs-playlist > ul').append($thisLi);

				/* slider */
				if ($(player.media).hasClass('mep-slider')) {
					$thisLi.css({
						'background-image': 'url("' + $thisLi.data('poster') + '")'
					});
				}
			}
			/* slider */
			player.videoSliderTracks = tracks.length;

			// set the first track as current
			layers.find('li:first').addClass('current played');
			// set initial poster image - only for audio playlists
			if ($(player.media).is('audio')) {
				player.changePoster(layers.find('li:first').data('poster'));
			}
			/* slider */
			var $prevVid = $('<a class="mep-prev">'),
				$nextVid = $('<a class="mep-next">');

			player.videoSliderIndex = 0;

			layers.find('.mejs-playlist').append($prevVid);
			layers.find('.mejs-playlist').append($nextVid);

			// transform individual track display
			$('#' + player.id + '.mejs-container.mep-slider').find('.mejs-playlist ul li').css({'transform': 'translate3d(0, -20px, 0) scale3d(0.75, 0.75, 1)'});

			$prevVid.click(function () {
				var moveMe = true;

				player.videoSliderIndex -= 1;
				if (player.videoSliderIndex < 0) {
					player.videoSliderIndex = 0;
					moveMe = false;
				}

				if (player.videoSliderIndex === player.videoSliderTracks - 1) {
					$nextVid.fadeOut();
				} else {
					$nextVid.fadeIn();
				}
				if (player.videoSliderIndex === 0) {
					$prevVid.fadeOut();
				} else {
					$prevVid.fadeIn();
				}

				if (moveMe === true) {
					player.sliderWidth = $('#' + player.id).width();
					//console.log('mep-prev clicked, moving to pos: ', Math.ceil(player.sliderWidth * player.videoSliderIndex));
					$('#' + player.id + '.mejs-container.mep-slider').find('.mejs-playlist ul li').css({'transform': 'translate3d(-' + Math.ceil(player.sliderWidth * player.videoSliderIndex) + 'px, -20px, 0) scale3d(0.75, 0.75, 1)'});
				}
			}).hide(); // initially hide prevVid button

			$nextVid.click(function () {
				var moveMe = true;

				player.videoSliderIndex += 1;
				if (player.videoSliderIndex > player.videoSliderTracks - 1) {
					player.videoSliderIndex = player.videoSliderTracks - 1;
					moveMe = false;
				}

				if (player.videoSliderIndex === player.videoSliderTracks - 1) {
					$nextVid.fadeOut();
				} else {
					$nextVid.fadeIn();
				}
				if (player.videoSliderIndex === 0) {
					$prevVid.fadeOut();
				} else {
					$prevVid.fadeIn();
				}

				if (moveMe === true) {
					player.sliderWidth = $('#' + player.id).width();
					//console.log('mep-next clicked, moving to pos: ', Math.ceil(player.sliderWidth * player.videoSliderIndex));
					$('#' + player.id + '.mejs-container.mep-slider').find('.mejs-playlist ul li').css({'transform': 'translate3d(-' + Math.ceil(player.sliderWidth * player.videoSliderIndex) + 'px, -20px, 0) scale3d(0.75, 0.75, 1)'});
				}
			});

			// play track from playlist when clicking it
			layers.find('.mejs-playlist > ul li').click(function () {
				// pause current track or play other one
				if (!$(this).hasClass('current')) {
					// clicked other track - play it
					$(this).addClass('played');
					player.playTrack($(this));
				} else {
					// clicked current track - play if paused and vice versa
					if (!player.media.paused) {
						// pause if playing
						player.pause();
					} else {
						// play if paused
						player.play();
					}
				}
			});

			// when current track ends - play the next one
			media.addEventListener('ended', function () {
				player.playNextTrack();
			}, false);

			// set play and paused class to container
			media.addEventListener('playing',function () {
				player.container.removeClass('mep-paused').addClass('mep-playing');

				// hide playlist for videos
				if ($(media).is('video')) {
					t.togglePlaylistDisplay(player, layers, media, 'hide');
				}

			}, false);

			/* mediaelement.js hides poster on "play" for all player types - not so great for audio */
			media.addEventListener('play', function () {
				if ($(player.media).is('audio')) {
					layers.find('.mejs-poster').show();
				}
			}, false);

			media.addEventListener('pause',function () {
				player.container.removeClass('mep-playing').addClass('mep-paused');
			}, false);

		},
		playNextTrack: function () {
			var t = this, 
			    nxt;
			var tracks = t.layers.find('.mejs-playlist > ul > li');
			var current = tracks.filter('.current');
			var notplayed = tracks.not('.played');
			if (notplayed.length < 1) {
				current.removeClass('played').siblings().removeClass('played');
				notplayed = tracks.not('.current');
			}
			if (t.options.shuffle) {
				var random = Math.floor(Math.random() * notplayed.length);
				nxt = notplayed.eq(random);
			} else {
				nxt = current.next();
				if (nxt.length < 1 && t.options.loop) {
					nxt = current.siblings().first();
				}
			}
			if (nxt.length == 1) {
				nxt.addClass('played');
				t.playTrack(nxt);
			}
		},
		playPrevTrack: function () {
			var t = this,
			    prev;
			var tracks = t.layers.find('.mejs-playlist > ul > li');
			var current = tracks.filter('.current');
			var played = tracks.filter('.played').not('.current');
			if (played.length < 1) {
				current.removeClass('played');
				played = tracks.not('.current');
			}
			if (t.options.shuffle) {
				var random = Math.floor(Math.random()*played.length);
				prev = played.eq(random);
			} else {
				prev = current.prev();
				if (prev.length < 1 && t.options.loop) {
					prev = current.siblings().last();
				}
			}
			if (prev.length == 1) {
				current.removeClass('played');
				t.playTrack(prev);
			}
		},
		changePoster: function (posterUrl) {
			var t = this;
			t.layers.find('.mejs-playlist').css('background-image', 'url("' + posterUrl + '")');
			// also set actual poster
			t.setPoster(posterUrl);
			// make sure poster is visible (not the case if no poster attribute was set)
			t.layers.find('.mejs-poster').show();
		},
		playTrack: function (track) {
			var t = this;
			t.pause();
			t.setSrc(track.data('url'));
			t.load();
			t.changePoster(track.data('poster'));
			t.play();
			track.addClass('current').siblings().removeClass('current');
		},
		playTrackURL: function (url) {
			var t = this;
			var tracks = t.layers.find('.mejs-playlist > ul > li');
			var track = tracks.filter('[data-url="' + url + '"]');
			t.playTrack(track);
		},
		togglePlaylistDisplay: function (player, layers, media, showHide) {
			var t = this;

			if (!!showHide) {
				player.options.playlist = showHide === 'show' ? true : false;
			} else {
				player.options.playlist = !player.options.playlist;
			}
			
			$(media).trigger('mep-playlisttoggle', [player.options.playlist]);

			// toggle playlist display
			if (player.options.playlist) {
				layers.children('.mejs-playlist').fadeIn();
				t.playlistToggle.removeClass('mejs-show-playlist').addClass('mejs-hide-playlist');
			} else {
				layers.children('.mejs-playlist').fadeOut();
				t.playlistToggle.removeClass('mejs-hide-playlist').addClass('mejs-show-playlist');
			}
		}
	});

})(mejs.$);
