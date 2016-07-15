/**
 * Add extra layer for using for slides.
 */
(function ($) {
    $.extend(MediaElementPlayer.prototype, {
        buildslidelayer: function (player, controls, layers, media) {
            var slideLayer = $('<div class="slide-layer-outer"><div class="slide-layer-inner"><div class="slide-layer"></div></div></div>');
            slideLayer.insertAfter(layers.children('.mejs-poster'));
            $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function() {
                slideLayer.css("height", "");
                slideLayer.css("width", "");
            });
            player.on('resize', function() {
                slideLayer.css("height", "");
                slideLayer.css("width", "");
            });
        },
        showSlide: function(index) {
            if (typeof this.tracks == 'undefined' || typeof this.slidesContainer == 'undefined') {
                return;
            }

            //
            if(this.slides.entries.text.length > 0 && this.slides.entries.imgs.length > 0) {
                this.slidesContainer.show();
            }
            else {
                this.slidesContainer.hide();
            }

            var t = this,
                url = t.slides.entries.text[index],
                img = t.slides.entries.imgs[index];

            if (typeof img == 'undefined' || typeof img.fadeIn == 'undefined') {

                var wrapper = $('<div class="img-wrap"><img src="' + url + '"></div>');
                img = wrapper.find('img').first();
                img.on('load', function() {
                    wrapper.appendTo(t.slidesContainer)
                        .hide()
                        .fadeIn(100)
                        .siblings(':visible')
                        .fadeOut(100);

                });
                t.slides.entries.imgs[index] = wrapper

            } else {

                if (!img.is(':visible') && !img.is(':animated')) {

                    //

                    img.fadeIn(100)
                        .siblings(':visible')
                        .fadeOut(100);
                }
            }

        }
    });
})(mejs.$);
