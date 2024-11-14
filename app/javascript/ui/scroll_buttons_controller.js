import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['body', 'up', 'down'];

  checkArrows(e) {
    if(this.bodyTarget.scrollTop > 25) {
      this.upTarget.classList.remove("hidden")
    } else {
      this.upTarget.classList.add("hidden")
    }

    if(this.bodyTarget.scrollHeight > this.bodyTarget.clientHeight) {
      if ((this.bodyTarget.scrollHeight - this.bodyTarget.clientHeight - 25) < this.bodyTarget.scrollTop) {
        this.downTarget.classList.add("hidden")
      } else {
        this.downTarget.classList.remove("hidden")
      }
    }

  }

  update(e) {
    if (this.lastScrollTop > e.target.scrollTop) {
      this.scrollDirection = "up"
    } else {
      this.scrollDirection = "down"
    }
    this.lastScrollTop = e.target.scrollTop
    const scrollTop = e.target.scrollTop
    const scrollHeight = e.target.scrollHeight
    const optionsHeight = this.bodyTarget.clientHeight

    if (scrollTop > 32) {
      this.upTarget.style.display = "flex"
    } else {
      this.upTarget.style.display = "none"
      clearInterval(this.repeaterUp)
    }

    if(this.scrollDirection == "down") {
      if ((scrollTop + optionsHeight + 28) < scrollHeight) {
        this.downTarget.style.display = "flex"
      } else {
        this.downTarget.style.display = "none"
        clearInterval(this.repeaterDown)
      }
    } else if (this.scrollDirection == "up") {
      if ((scrollTop + optionsHeight + 15) < scrollHeight) {
        this.downTarget.style.display = "flex"
      }
    }
  }

  showArrows(e) {
    this.update(e)
    this.downTarget.style.display = "flex"
    this.bodyTarget.style.overflowX = "auto"
  }

  hideArrows() {
    this.downTarget.style.display = "none"
    this.upTarget.style.display = "none"
    this.bodyTarget.style.overflowX = "hidden"
  }

  preventScroll(e) {
    if(e.target !== this.bodyTarget) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handlePopoverOpen(e) {
    console.log("popover open")
    this.bodyTarget.scroll({top: 0, behavior: 'instant'})
    this.checkArrows(e)
  }

  handlePopoverClose(e) {
    console.log("popover closed")
    this.bodyTarget.scroll({top: 0, behavior: 'instant'})
  }

  scrollUp() {
    this.bodyTarget.scroll({top: this.bodyTarget.scrollTop - 50, behavior: 'smooth'})
  }

  mouseoverUp() {
    this.repeaterUp = setInterval(() => {this.scrollUp()}, 50);
  }

  mouseoutUp() {
    clearInterval(this.repeaterUp)
  }

  mouseoverDown() {
    this.repeaterDown = setInterval(() => {this.scrollDown()}, 50);
  }

  mouseoutDown() {
    clearInterval(this.repeaterDown)
  }

  scrollDown() {
    this.bodyTarget.scroll({top: this.bodyTarget.scrollTop + 50, behavior: 'smooth'})
  }
}
