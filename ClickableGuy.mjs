export default class ClickableGuy {
    canvas;
    image;
    cropX;
    cropY;
    canvasX;
    canvasY;
    cropWidth;
    cropHeight;
    scale = 1;
    /**
     * @param {CanvasRenderingContext2D} canvas canvas to create him on
     * @param {HTMLImageElement} image image to give the dude
     * @param {Number} cropX pixels from the left side of the image to crop
     * @param {Number} cropY pixels from the top of the image to crop
     * @param {Number} cropWidth how many pixels wide to crop
     * @param {Number} cropHeight how many pixels tall to crop
     * @param {Number} scale how big to scale the image, 0.1 to 2 is usually good
     */
    constructor(canvas, image, cropX, cropY, cropWidth, cropHeight, scale) {
        image.decode().then(()=>{
            for (const [name, param] of Object.entries({cropX, cropY, cropWidth, cropHeight})) {
                if (param < 0) {
                    throw new RangeError(`${name} param can't be negative: ${param}`);
                }
                if ((name === 'cropWidth' || name === 'cropX') && param > image.naturalWidth) {
                    throw new RangeError(`${name} of ${param} can't be wider than the image: ${image.naturalWidth}`);
                }
                if ((name === 'cropHeight' || name === 'cropY') && param > image.naturalHeight) {
                    throw new RangeError(`${name} of ${param} can't be taller than the image: ${image.naturalHeight}`);
                }
            }
            this.canvas = canvas;
            this.image = image;
            this.cropX = cropX;
            this.cropY = cropY;
            this.cropWidth = cropWidth;
            this.cropHeight = cropHeight;
            this.scale = scale;
        });
    };
    get centerX() {
        return this.scale * (this.cropWidth / 2);
    };
    get centerY() {
        return this.scale * (this.cropHeight / 2);
    };
    get width() {
        return this.scale * this.cropWidth;
    };
    get height() {
        return this.scale * this.cropHeight;
    };
    /**
     * @returns {Array<Object>} first object has x and y properties for the top left corner, second has the bottom right corner
    */
    get hitbox() {
        return [
            {
                x: this.canvasX,
                y: this.canvasY,
            },
            {
                x: this.canvasX + this.width,
                y: this.canvasY + this.height,
            }
        ]
    }
    /**
     * @param {Number} x x pixels on the canvas, constrained to the canvas width
     * @param {Number} y y pixels on the canvas, constrained to the canvas height
     */
    respawn(x, y) {
        if (x > this.canvas.canvas.width - this.width || x <= 0) {
            throw new RangeError(`Can't paint the guy outside the boundaries bub ${x}`)
        }
        if (y > this.canvas.canvas.height - this.height || y <= 0) {
            throw new RangeError(`Can't paint the guy outside the boundaries bub ${y}`)
        }
        this.canvasX = x;
        this.canvasY = y;
        this.#createImage();
    }
    respawnRandom() {
        this.canvasX = Math.trunc(Math.abs(this.canvas.canvas.width - this.cropWidth) * Math.random());
        this.canvasY = Math.trunc(Math.abs(this.canvas.canvas.height - this.cropHeight) * Math.random());
        this.#createImage();
    }
    /**
     * @param {*} color css color to replace him with
     */
    clear(color) {
        const oldColor = this.canvas.fillStyle;
        this.canvas.fillStyle = color;
        this.canvas.clearRect(this.canvasX, this.canvasY, this.canvasX + this.width, this.canvasY + this.height);
        this.canvas.fillStyle = oldColor;
    }
    #createImage() {
        this.canvas.drawImage(
            this.image,
            this.cropX,
            this.cropY,
            this.cropWidth,
            this.cropHeight,
            this.canvasX,
            this.canvasY,
            this.cropWidth * this.scale,
            this.cropHeight * this.scale,
        )
    }
}