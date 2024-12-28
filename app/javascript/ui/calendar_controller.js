import { Controller } from '@hotwired/stimulus';
import { FetchRequest } from '@rails/request.js'

export default class extends Controller {
  static values = {
    month: Number,
    year: Number,
    nextPeriodMonth: Number,
    nextPeriodYear: Number,
    previousPeriodMonth: Number,
    previousPeriodYear: Number,
    weeks: { type: Number, default: 6 },
    activeDay: { type: Number, default: 1 },
    open: { type: Boolean, default: true },
    selected: { type: String, default: null }
  }

  static targets = ["nextButton", "previousButton", "buttonDay"]

  connect() {
    this.selectedClasses = ["bg-primary", "text-primary-foreground", "hover:bg-primary", "hover:text-primary-foreground", "focus:bg-primary", "focus:text-primary-foreground"]
    const activeElement = this.findActiveElement()

    if(this.openValue && this.activeDayValue != 0) {
      if(activeElement) {
        this.focusElement(activeElement)
      } else {
        const jumpToElementDay = this.activeDayValue == 0 ? 1 : this.activeDayValue
        const jumpToElement = this.findPeriodElement(jumpToElementDay)
        this.focusElement(jumpToElement)
      }
    }

    if(!activeElement && this.activeDayValue == 0) {
      const jumpToElement = this.findPeriodElement(1)
      jumpToElement.setAttribute("tabindex", "0")
    }
  }

  handleClickNextPeriod() {
    this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue)
  }

  handleClickPreviousPeriod() {
    this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue)
  }

  handleKeyUp(e) {
    this.moveFocus(-7)
  }

  handleKeyLeft(e) {
    this.moveFocus(-1)
  }

  handleKeyDown(e) {
    this.moveFocus(7)
  }

  handleKeyRight(e) {
    this.moveFocus(1)
  }

  handleKeyPageUp(e) {
    this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue, this.findActiveDay(), 0)
  }

  handleKeyPageDown(e) {
    this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue, this.findActiveDay(), 0)
  }

  findActiveElement() {
    return this.buttonDayTargets.find((x) => x.attributes["tabindex"].value == "0")
  }

  findPeriodElement(day) {
    return this.buttonDayTargets.find((x) => 
      x.dataset.day == day && (
        x.dataset.status == "today" || x.dataset.status == "active" || x.dataset.status == "selected"
      )
    )
  }

  focusElement(el) {
    el.setAttribute("tabindex", "0")
    el.focus({focusVisible: true})
  }

  findActiveDay() {
    const activeElement = this.findActiveElement()
    return parseInt(activeElement.dataset["day"])
  }

  moveFocus(amount) {
    const activeDay = this.findActiveDay()
    
    const jumpTo = activeDay + amount

    const jumpToElement = this.findPeriodElement(jumpTo)

    if(jumpToElement) {
      const activeElement = this.findActiveElement()
      activeElement.setAttribute("tabindex", "-1")
      this.focusElement(jumpToElement)
    } else {
      if(amount > 0) {
        this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue, activeDay, amount)
      } else {
        this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue, activeDay, amount)
      }
    }
  }

  handleButtonDayClick(e) {
    const day = e.target.dataset.day
    const month = e.target.dataset.month
    const year = e.target.dataset.year
    this.selectedValue = `${year}-${month}-${day}`
    if(month != this.monthValue) {
      this.request(year, month, day, 0)
    } else {
      this.buttonDayTargets.forEach((x) => {
        if(x == e.target) {
          this.selectElement(x)
        } else {
          this.unselectElement(x)
        }
      })
    }
    this.dispatch("selected", { detail: { value: this.selectedValue } })
  }

  selectElement(el) {
    el.classList.add(...this.selectedClasses)
    el.setAttribute("tabindex", "0")
  }

  unselectElement(el) {
    el.classList.remove(...this.selectedClasses)
    el.setAttribute("tabindex", "-1")
  }

  async request(year, month, focused = 0, jumpAmount = 0) {
    const request = new FetchRequest('post', `/ui/calendar/${year}/${month}`, {
      body: JSON.stringify({
        weeks: this.weeksValue,
        focused: focused,
        jump_amount: jumpAmount,
        selected_value: this.selectedValue
      })
    })
    const response = await request.perform()
    if (response.ok) {
      const body = await response.text
      this.element.outerHTML = body
    }
  }
}
