class Layout {
  constructor(src, style, positions, text, perspective) {
    this.src = src;
    this.style = style;
    this.positions = positions;
    this.text = text;
    this.perspective = perspective;
    this.ready = 1;
    this.init();
  }

  init() {
    this.img = document.createElement("img");
    this.img.src = this.src;
    this.img.style.width = this.style.width;
    this.img.style.height = this.style.height;
    this.img.style.position = "absolute";
    this.img.style.top = this.style.top + "px";
    this.img.style.left = this.style.left + "px";
    this.img.style.zIndex = this.style.zIndex;
    this.img.style.transform = "perspective(" + this.perspective + "px) translate3d(" + this.positions[0].x + "px, " + this.positions[0].y + "px, + " + this.positions[0].z + ")";;
    this.img.style.opacity = this.positions[0].opacity;
    document.body.appendChild(this.img);
  }

  calculate(start, end, ratio) {
    return ((start - end) * ratio) + start;
  }

  getCurrentPosition(scrollRatio) {
    let current = scrollRatio * this.positions.length;
    let ratio = current - Math.trunc(current);
    let previousPosition = { x: this.positions[Math.trunc(ratio)].x, z: this.positions[Math.trunc(ratio)].y, z: this.positions[Math.trunc(ratio)].z }
    let nextPosition = scrollRatio === 1 ? previousPosition : { x: this.positions[Math.trunc(ratio) + 1].x, z: this.positions[Math.trunc(ratio) + 1].y, z: this.positions[Math.trunc(ratio) + 1].z }
    let currentPosition = {
      x: this.calculate(previousPosition.x, nextPosition.x, ratio),
      y: this.calculate(previousPosition.y, nextPosition.y, ratio),
      z: this.calculate(previousPosition.z, nextPosition.z, ratio),
    }
    return currentPosition;
  }

  getCurrentOpacity() {
    let current = scrollRatio * this.positions.length;
    let ratio = current - Math.trunc(current);
    let previousOpacity = this.positions[Math.trunc(ratio)].opacity;
    let nextOpacity = scrollRatio === 1 ? previousOpacity : this.positions[Math.trunc(ratio) + 1].opacity;
    return this.calculate(previousOpacity, nextOpacity, ratio);
  }

  move(scrollRatio, speed) {
    let position = this.getCurrentPosition(scrollRatio);
    this.img.style.transition = "transform " + speed + "ms ease-in-out";
    this.img.style.transform = "perspective(" + this.perspective + "px) translate3d(" + position.x + "px, " + position.y + "px, + " + position.z + ")";
  }

  setOpacity(scrollRatio, speed) {
    this.img.style.transition = "transform " + speed + "ms linear";
    this.img.style.opacity = this.getCurrentOpacity(scrollRatio);
  }

  update(scrollRatio, moveSpeed, opacitySpeed) {
    if (this.ready) {
      this.ready = false;
      this.move(scrollRatio, moveSpeed);
      this.setOpacity(scrollRatio, opacitySpeed);
      setTimeout(() => { this.ready = true; }, Math.max(moveSpeed, opacitySpeed));
    }
  }
}
