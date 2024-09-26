import { Application } from "@hotwired/stimulus";
import AccordionItemController from '../../../app/javascript/ui/accordion_item_controller.js'
import { expect, test, vi } from "vitest"
import {
  getByLabelText,
  getByText,
  getByTestId,
  getByRole,
  queryByTestId,
  findByText,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
  fireEvent,
  getRoles
} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}
describe("AccordionItemController", () => {
  beforeEach(async (context) => {
    document.body.innerHTML = `
      <div data-orientation="vertical" class="border-b" data-controller="accordion-item" data-accordion-item-open-value="false">
        <h3 data-orientation="vertical" class="flex">
          <button type="button" aria-expanded="false" aria-controls="ui-LNdBaY-content" id="ui-LNdBaY-button" data-orientation="vertical" data-action="click->accordion-item#toggle" data-accordion-item-target="button" class="flex flex-1 items-center justify-between py-4 font-medium">
            Is it accessible?
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-accordion-item-target="icon" class="lucide lucide-chevron-down h-4 w-4 shrink-0">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </h3>
        <div role="region" id="ui-LNdBaY-content" aria-labelledby="ui-LNdBaY-button" data-orientation="vertical" data-accordion-item-target="content" class="overflow-hidden text-sm h-0">
          <div class="pb-4 pt-0">Yes. It adheres to the WAI-ARIA design pattern.</div>
        </div>
      </div>
    `;

    const application = Application.start();
    context.application = application
    application.register("accordion-item", AccordionItemController);
    context.button = await getByRole(document.body, 'button', {name: /Is it accessible?/i})
    context.content = await getByRole(document.body, 'region')
    context.user = userEvent.setup()
  });

  afterEach(async (context) => {
    context.application.stop();
  })

  describe("aria expanded", () => {
    it("by default it's false", async ({user, button, content}) => {
      expect(button.getAttribute("aria-expanded")).toEqual("false");
    });

    it("after opening it's true", async ({user, button, content}) => {
      await button.click()
      expect(button.getAttribute("aria-expanded")).toEqual("true");
    });
  });

  describe("content", () => {
    it("by default it's hidden", async ({user, button, content}) => {
      expect(content.style.height).toEqual("0px")
    });
  });
});
