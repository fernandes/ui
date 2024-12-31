import { Controller } from '@hotwired/stimulus';
import { FetchRequest } from '@rails/request.js'

export default class extends Controller {
  static targets = ["label"]

  connect() {
  }

  async handleCalendarSelected(e) {
    const formattedDate = await this.formatDate(e.detail.value)
    if(this.hasLabelTarget) {
      this.labelTarget.innerText = formattedDate
    }
  }


  async formatDate(value) {
    const request = new FetchRequest('post', `/ui/calendar/format`, {
      body: JSON.stringify({
        value: value,
      })
    })
    const response = await request.perform()
    if (response.ok) {
      const body = await response.text
      return JSON.parse(body).value
    }
  }
}
