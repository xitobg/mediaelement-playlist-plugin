#MediaElement.js Playlist Plugin for the Video and Audio Tag

[>>> Here's a demo](http://www.roccogeorgi.com/demos/mediaelement-playlist-plugin/demo.html)

##Intro 

This MediaElement.js plugin provides playlist support for Video and Audio players.
It was forked from duozersk/mep-feature-playlist, which is a fork of JeyKeu/mep-feature-playlist.

##tl;dr

- Add an attribute "data-showplaylist" with value "true" to video/audio tag to show playlist on start
- Add several &lt;source&gt;s to your &lt;video&gt; or &lt;audio&gt; tags (only playable types will be playlisted)
- Add features "playlistfeature" (loads library) and "playlist" (shows control icon) to .mediaelementplayer()


##How To

1. Download **[MediaElement.js](http://mediaelementjs.com/)**

2. Download **[MediaElement Playlist Plugin](https://github.com/rocco/mediaelement-playlist-plugin/archive/master.zip)** (this repo)

3. Include these files in your HTML
    * **mediaelement-playlist-plugin.min.css**
    * **mediaelement-playlist-plugin.min.js**
    * **mediaelement-and-player.js**
    * **mediaelementplayer.min.css**

5. Add video / audio  and source tags like this in your HTML

    ```html
    <video 
        data-showplaylist="true" 

        width="530" 
        height="300" 
        poster="poster.png" 
        >

        <!-- Track 1 as .webm and .mp4 -->
        <source src="track1.webm" type="video/webm" title="Track 1" data-poster="track1.png">
        <source src="track1.mp4"  type="video/mp4"  title="Track 1" data-poster="track1.png">

        <!-- Track 1 as .webm and .mp4 -->
        <source src="track2.webm" type="video/webm" title="Track 2" data-poster="track2.png">
        <source src="track2.mp4"  type="video/mp4"  title="Track 2" data-poster="track2.png">

        <!-- Track 1 as .webm and .mp4 -->
        <source src="track3.webm" type="video/webm" title="Track 3" data-poster="track3.png">
        <source src="track3.mp4"  type="video/mp4"  title="Track 3" data-poster="track3.png">

        <!-- image fallback only - flash version does not support playlists -->
        <img src="no-video-playlist.png" title="No video playlist capabilities.">
    </video>

    <audio 
        class="mep-slider" 
        data-showplaylist="true" 
        width="400" 
        height="260" 
        >
        <source src="track1.mp3" title="Track 1" data-poster="track1.png" type="audio/mpeg">
        <source src="track2.mp3" title="Track 2" data-poster="track2.png" type="audio/mpeg">
        <source src="track3.mp3" title="Track 3" data-poster="track3.png" type="audio/mpeg">
        <source src="track4.mp3" title="Track 4" data-poster="track4.png" type="audio/mpeg">
    </audio>
    ```

    Add a CSS class `mep-slider` to video- or audio tags if you want slider display.
    The attribute `data-showplaylist="true"` shows the playlist initially.
    Title attribute will be used as track name, falls back to file name.

6. Add something similar to this JavaScript code to your page

    ```javascript
    <script>
        // video playlist
        $('video.mep-playlist').mediaelementplayer({
            "features": ['playlistfeature', 'prevtrack', 'playpause', 'nexttrack', 'loop', 'shuffle', 'current', 'progress', 'duration', 'volume', 'playlist', 'fullscreen'],
            "shuffle": false,
            "loop": false
        });

        // audio playlist
        $('audio.mep-playlist').mediaelementplayer({
            "features": ['playlistfeature', 'prevtrack', 'playpause', 'nexttrack', 'loop', 'shuffle', 'current', 'progress', 'duration', 'volume', 'playlist'],
            "audioVolume": "vertical", // just like video player
            "shuffle": false,
            "loop": false
        });

        // regular video
        $('video:not(.mep-playlist)').mediaelementplayer({
            "features": ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
        });
    </script>
    ```

    .mediaelementplayer() Options:
    - **loop** - loop through the playlist; defaults to 'false'
    - **shuffle** - shuffle playlist; defaults to 'false'

    .mediaelementplayer() Features:
    - **playlistfeature** - loads the plugin, needed if you want playlists
    - **prevtrack** - button to play the previous track in the playlist
    - **nexttrack** - button to play the next track in the playlist
    - **loop** - toggle to turn repeat on or off
    - **shuffle** - toggle to turn shuffle on or off
    - **playlist** - playlist button to show/hide playlist


##Main features

- Regular playlist or slider display
- Playlists are customizable via CSS/Sass
- Grunt, Sass, JSHinted source

##Build it yourself and contribute

- make sure you `$ npm install` before you run `$ grunt`, sass is required too (`$ gem install sass`)
- `$ grunt build:dev` stores a debuggable demo in _dev/
- `$ grunt build` stores a minified demo in _build/
- have a look at the demo.html files in either folder
- run `$ grunt watch` or just `$ grunt` to work on the source efficiently
- open/live-reload _dev/demo.html in browser
