"use strict";

(function(window, document, $, _, undefined) {
    var defaults = {
        textDuration: 1000,
        imageDuration: 1000
    };

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    $.Twilight = function($root, params) {
        this.$cover = undefined;
        this.$text = undefined;
        this.$letters = undefined;


        this.init = function() {
            this.$cover = $('.twilight__image_cover_yes', $root);
            this.$text = $('.twilight__text', $root);
            this.$handler = $('.twilight__handler', $root);

            this._setupText();
            this._bind();

        };

        this._bind = function() {
            var handler = this.$handler.length ? this.$handler : $root;

            handler
                .on('mouseenter', $.proxy(this.sunrise, this))
                .on('mouseleave', $.proxy(this.sunset, this));
        };

        this._setupText = function() {
            this.$text.html(function(idx, oldhtml) {
                oldhtml = oldhtml.trim();

                return _.map(oldhtml, function(elem) {
                    return('<span class="twilight__letter">' + elem + '</span>');
                })
            });
            this.$letters = $('.twilight__letter', this.$text);
            this.$text.hide();
        };

        this.sunrise = function() {
            this.$text.show();

            this._animateCover(1);
            this._animateLetters(1);
        };

        this.sunset = function() {
            this._animateCover(0);
            this._animateLetters(0).done($.proxy(this.$text.hide, this.$text));
        };

        this._animateCover = function(opacity) {
            this.$cover.stop().animate({
                'opacity': opacity
            }, {
                duration: params.imageDuration
            });
        };

        this._animateLetters = function(opacity) {
            var dfd = $.Deferred();

            $.when.apply($, this.$letters.map(function() {
                var dfd = $.Deferred();

                $(this).stop().animate({
                    opacity: opacity
                }, {
                    complete: function() {
                        dfd.resolve();
                    },
                    duration: Math.random() * params.textDuration,
                    queue: false
                });

                return dfd.promise();
            })).then(dfd.resolve);

            return dfd.promise();
        }
    };

    $.fn.twilight = function(options) {
        return this.each(function() {
            var $item = $(this);
            var itemData = $item.data();
            var instanceOpts = $.extend(
                {},
                defaults,
                options,
                itemData
            );

            return new $.Twilight($item, instanceOpts).init();
        });
    };

})(window, document, jQuery, _, undefined);