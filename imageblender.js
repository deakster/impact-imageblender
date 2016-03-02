// Image Blender, v0.1 - https://github.com/deakster/impact-imageblender

ig.module(
	'game.imageblender'
).requires(
    'impact.image'
).defines(function () {
    ig.Image.inject({
        /* Starts Ejecta support */
        load: function(loadCallback) {
            if (this.loaded) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }
                
                return;
            } else if (!this.loaded && ig.ready) {
                this.loadCallback = loadCallback || null;

                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = ig.prefix + this.path.split("#")[0] + ig.nocache;
            } else {
                ig.addResource(this);
            }

            ig.Image.cache[this.path] = this;
        },
        /* Ends Ejecta support */
        
        onload: function(event) {
            this.parent(event);
            
            if (this.path.indexOf("#") !== -1) {
                this.convertToCanvas();
                
                /* Adds support to shorthand hex */
                function hexToColor(hex) {
                    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                        return r + r + g + g + b + b;
                    });

                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16) / 255,
                        g: parseInt(result[2], 16) / 255,
                        b: parseInt(result[3], 16) / 255
                    } : null;
                }

                // Multiply algorithm based on https://github.com/Phrogz/context-blender

                var ctx = this.data.getContext("2d");
                var imgData = ctx.getImageData(0, 0, this.data.width, this.data.height);
                var src = imgData.data;
                var sA, dA = 1, len = src.length;
                var sRA, sGA, sBA, dA2, demultiply;
                var color = hexToColor(this.path.split("#").pop());
                var dRA = color.r;
                var dGA = color.g;
                var dBA = color.b;

                for (var px = 0; px < len; px += 4) {
                    sA  = src[px+3] / 255;
                    dA2 = (sA + dA - sA * dA);
                    sRA = src[px  ] / 255 * sA;
                    sGA = src[px+1] / 255 * sA;
                    sBA = src[px+2] / 255 * sA;

                    demultiply = 255 / dA2;

                    src[px  ] = (sRA*dRA + dRA*(1-sA)) * demultiply;
                    src[px+1] = (sGA*dGA + dGA*(1-sA)) * demultiply;
                    src[px+2] = (sBA*dBA + dBA*(1-sA)) * demultiply;
                }

                ctx.putImageData(imgData, 0, 0);
            }
        },

        convertToCanvas: function () {
            if (this.data.getContext) return; // Check if it's already a canvas

            var orig = ig.$new('canvas');
            orig.width = this.width;
            orig.height = this.height;
            orig.getContext('2d').drawImage(this.data, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
            this.data = orig;
        }
    });
});
