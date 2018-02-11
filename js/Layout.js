let Layout = function(src, style, positions, texts, perspective, speed) {
    this.src = src;
    this.style = style;
    this.positions = positions;
    this.texts = texts;
    this.perspective = perspective;
    this.speed = speed;
    this.first = true;

    this.init = function() {
        this.img = document.createElement("img");
        this.img.src = this.src;
        this.img.style.width = this.style.width + "px";
        this.img.style.height = this.style.height + "px";
        this.img.style.position = "absolute";
        this.img.style.top = this.style.top + "px";
        this.img.style.left = this.style.left + "px";
        this.img.style.zIndex = this.style.zIndex;
        this.img.style.transition = "transform " + this.speed.move + "ms ease-in-out, opacity " + this.speed.opacity + "ms linear";
        document.body.appendChild(this.img);
        if (this.texts) {
          this.dialog = document.createElement("div");
          this.dialog.id = "dialog";
          this.dialog.style.width = this.style.width + "px";
          this.dialog.style.height = this.style.height + "px";
          this.dialog.style.position = "absolute";
          this.dialog.style.top = this.style.top + "px";
          this.dialog.style.left = this.style.left + "px";
          this.dialog.style.zIndex = this.style.zIndex + 1;
          this.dialog.style.transition = "transform " + this.speed.move + "ms ease-in-out, opacity " + this.speed.opacity + "ms linear";
          this.dialog.style.fontSize = "30px";
          this.dialog.style.fontFamily = "Helvetica";
          this.dialog.style.opacity = 0;
          this.dialog.style.display = "flex";
          this.dialog.style.flexDirection = "column";
          this.dialog.style.justifyContent = "center";
          this.dialog.style.alignItems = "center";
          document.body.appendChild(this.dialog);
        };
        this.update(0);
    }

    this.calculate = function(start, end, ratio) {
        return ((end - start) * ratio) + start;
    };

    this.getCurrentPosition = function(scrollRatio) {
        let current = scrollRatio * (this.positions.length - 1);
        let ratio = current - Math.trunc(current);
        let previousPosition = { x: this.positions[Math.trunc(current)].x, y: this.positions[Math.trunc(current)].y, z: this.positions[Math.trunc(current)].z }
        let nextPosition = scrollRatio === 1 ? previousPosition : { x: this.positions[Math.trunc(current) + 1].x, y: this.positions[Math.trunc(current) + 1].y, z: this.positions[Math.trunc(current) + 1].z }
        let currentPosition = {
            x: this.calculate(previousPosition.x, nextPosition.x, ratio),
            y: this.calculate(previousPosition.y, nextPosition.y, ratio),
            z: this.calculate(previousPosition.z, nextPosition.z, ratio),
        }
        if (this.texts) {
            this.dialog.innerHTML = this.texts[this.positions[Math.trunc(current)].text];
        }
        return currentPosition;
    };

    this.getCurrentOpacity = function(scrollRatio) {
        let current = scrollRatio * (this.positions.length - 1);
        let ratio = current - Math.trunc(current);
        let previousOpacity = this.positions[Math.trunc(current)].opacity;
        let nextOpacity = scrollRatio === 1 ? previousOpacity : this.positions[Math.trunc(current) + 1].opacity;
        return this.calculate(previousOpacity, nextOpacity, ratio);
    };

    this.move = function(scrollRatio) {
        let position = this.getCurrentPosition(scrollRatio);
        this.img.style.transform = "perspective(" + this.perspective + "px) translate3d(" + position.x + "px, " + position.y + "px, " + position.z + "px)";
        if (this.dialog) {
          this.dialog.style.transform = "perspective(" + this.perspective + "px) translate3d(" + position.x + "px, " + position.y + "px, " + position.z + "px)";
        }
    };

    this.setOpacity = function(scrollRatio) {
        let opacity = this.getCurrentOpacity(scrollRatio);
        if (this.img.src.includes("balloon")) {
          opacity = opacity > 0.5 ? 1 : 0;
        }
        this.img.style.opacity = opacity;
        if (this.dialog && this.dialog.innerHTML !== "undefined") {
          this.dialog.style.opacity = opacity;
        }
    };

    this.update = function(scrollRatio) {
        this.move(scrollRatio);
        this.setOpacity(scrollRatio);
    };

    this.init();
}
