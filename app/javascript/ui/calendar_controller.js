import { Controller } from '@hotwired/stimulus';
import { FetchRequest } from '@rails/request.js'

export default class extends Controller {
  static values = {
    nextPeriodMonth: Number,
    nextPeriodYear: Number,
    previousPeriodMonth: Number,
    previousPeriodYear: Number,
    weeks: { type: Number, default: 6 }
  }

  static targets = ["nextButton", "previousButton"]

  handleClickNextPeriod() {
    this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue)
  }

  handleClickPreviousPeriod() {
    this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue)
  }

  async request(year, month) {
    const request = new FetchRequest('post', `/ui/calendar/${year}/${month}`, {
      body: JSON.stringify({
        weeks: this.weeksValue
      })
    })
    const response = await request.perform()
    if (response.ok) {
      const body = await response.text
      console.log("bodyjackkkkkkkk", this)
      this.element.outerHTML = body
    }
  }
}
