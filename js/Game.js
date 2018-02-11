let Game = function(maxScroll, speed, layouts) {
    this.maxScroll = maxScroll;
    this.speed = speed;
    this.layouts = layouts;
    this.scroll = 0;
    this.scrollSrc = [
        "images/scroll1.png",
        "images/scroll2.png",
        "images/scroll3.png"
      ];
      
    this.getScrollRatio = function() {
        return this.scroll / this.maxScroll;
    };
    
    this.incrementScroll = function() {
        this.scroll = this.scroll < this.maxScroll ? this.scroll + 1 : this.scroll;
    } ;
    
    this.decrementScroll = function() {
        this.scroll = this.scroll > 0 ? this.scroll - 1 : this.scroll;
    };
    
    this.init = function() {
        let self = this;
        let tuto = document.getElementById("tuto");
        this.interval = setInterval(function() {
            tuto.classList.add("bigger");
            setTimeout(function() {
                tuto.classList.remove("bigger");                
            }, 200);
        }, 1200);
        let scrollImage = document.getElementById("img-scroll");
        this.index = 0;
        this.interval2 = setInterval(function() {
            scrollImage.src = this.scrollSrc[this.index];
            this.index = (this.index + 1) % 3;
        }.bind(this), 500);
        window.addEventListener("wheel", function(e) {
            if (e.deltaY < 0) {
                self.decrementScroll();
            }
            if (e.deltaY > 0) {
                    tuto.style.opacity = 0;
                    clearInterval(this.interval);
                    clearInterval(this.interval2);
                    self.incrementScroll();
            }
            if (this.scroll === this.maxScroll) {
                document.getElementById("end").style.opacity = 1;
            } else {
              document.getElementById("end").style.opacity = 0;          
            }            this.ready = false;
            let ratio = this.getScrollRatio();
            self.layouts.forEach(function(layout) {
                layout.update(ratio, self.speed.move, self.speed.opacity);
            }.bind(this));
        }.bind(this));
    };
    this.init();    
};

