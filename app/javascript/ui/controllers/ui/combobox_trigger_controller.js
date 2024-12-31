import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  handleItemChecked(e) {
    console.log("handleItemChecked@combobox-trigger")
  }
}
