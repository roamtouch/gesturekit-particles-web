/**
 * @author Guille Paz <guille87paz@gmail.com>
 */
(function (window, gesturekit) {
    'use strict';

    var doc = window.document,
        prefix = (function prefix() {
            var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
                styleDeclaration = doc.getElementsByTagName('script')[0].style,
                prop;

            for (prop in styleDeclaration) {
                if (regex.test(prop)) {
                    return '-' + prop.match(regex)[0].toLowerCase() + '-';
                }
            }

            // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
            // However (prop in style) returns the correct value, so we'll have to test for
            // the precence of a specific property
            if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
            if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }

            return '';
        }());

    /**
     * Particles Constructor
     * @constructor
     * @returns {}
     */
    function Particles() {
        this.particles = [];
        this.theme = [
            'https://cldup.com/WdAra43zR9-3000x3000.png',
            'https://cldup.com/_4RkMnPjNm-3000x3000.png',
            'https://cldup.com/DG3U-_BNCL-3000x3000.png',
            'https://cldup.com/eEgiOGQ-68-3000x3000.png'
        ];
        this._defineEvents();
        return this;
    }

    /**
     * Define gesturekit events to draw/remove particles
     * @memberof! Particles.prototype
     * @function
     * @private
     * @returns {particles}
     */
    Particles.prototype._defineEvents = function () {
        var that = this;

        gesturekit.on('gesturemotion', function (eve) {
            var x = eve.touches[0].pageX - 5,
                y = eve.touches[0].pageY - 5,
                dx = Math.random() * 20,
                dy = Math.random() * 20;

            x = (x + dx).toFixed(2);
            y = (y + dy).toFixed(2);

            that.draw(x, y);
        });

        gesturekit.on('gestureend', function () {
            that.destroy();
        });

        return this;
    };

    /**
     * Draw a particle system
     * @memberof! Particles.prototype
     * @function
     * @returns {particles}
     */
    Particles.prototype.draw = function(x, y) {

        var index = Math.floor((Math.random() * this.theme.length)),
            particle = document.createElement('i'),
            styles = [
                'display: block;',
                'width: 7px;',
                'height: 7px;',
                'background-size: 7px;',
                'position: absolute;',
                'top: 0;',
                'left: 0;',
                'z-index: 999;',
                'background-image: url(' + this.theme[index] + ');'
            ];

        styles.push(prefix + 'transition: all 1s ease-in-out;');
        styles.push(prefix + 'transform: translate3d(' + x + 'px,' + y + 'px, 0);');

        particle.style.cssText = styles.join('');
        particle.setAttribute('data-x', x);
        particle.setAttribute('data-y', y);

        doc.body.appendChild(particle);

        this.particles.push(particle);

        return this;
    };

    /**
     * Destroy particle system.
     * @memberof! Particles.prototype
     * @function
     * @returns {particles}
     */
    Particles.prototype.destroy = function() {
        var particles = this.particles,
            len = particles.length,
            i = 0,
            j = 0;

        for (i; i < len; i += 1) {
            particles[i].style[prefix + 'transform'] = 'translate3d(' + (parseInt(particles[i].getAttribute('data-x'), 10) + Math.floor(Math.random() * 201) - 100) + 'px,' + (parseInt(particles[i].getAttribute('data-x'), 10) + Math.floor(Math.random() * 201) - 100) + 'px, 0)';
            particles[i].style.opacity = 0;
        }

        setTimeout(function() {
            for (j; j < len ; j += 1) {
                particles[j].remove();
            }
            particles.length = 0;
        }, 800);

    };

    function touchParticles() {
        return new Particles();
    };

    /**
     * Expose touchParticles
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('touchParticles', [], function () {
            return touchParticles;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = touchParticles;

    // Default
    } else {
        window.gesturekit.touchParticles = touchParticles;
    }

}(this, this.gesturekit));
