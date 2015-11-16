/**
 * Add extra layer for using for slides.
 */
(function ($) {
    $.extend(MediaElementPlayer.prototype, {
        buildslidelayer: function (player, controls, layers, media) {
            var slideLayer = $('<div class="slide-layer-outer"><div class="slide-layer"></div></div>');
            slideLayer.insertAfter(layers.children('.mejs-poster'));
        }
    });
})(mejs.$);
