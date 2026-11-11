# frozen_string_literal: true

module UI
  module Testing
    # Element class for the Command Dialog (command palette in a modal Dialog).
    #
    # @example
    #   palette = find_element(UI::Testing::CommandDialogElement, "#phlex-command-dialog")
    #   palette.press_shortcut(:meta, "j")
    #   palette.wait_for_focus_inside
    class CommandDialogElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--command-dialog"]'

      def press_shortcut(*keys)
        page.send_keys(keys)
      end

      def keyboard(*keys)
        page.send_keys(*keys)
      end

      def state
        page.evaluate_script("document.querySelector(#{content_selector.to_json}).dataset.state")
      end

      def open?
        state == "open"
      end

      def accessible_name
        aria_text("aria-labelledby")
      end

      def accessible_description
        aria_text("aria-describedby")
      end

      def input_focused?
        page.evaluate_script("document.activeElement === document.querySelector(#{(root_selector + " [data-ui--command-target='input']").to_json})")
      end

      def focus_inside?
        page.evaluate_script("document.querySelector(#{content_selector.to_json}).contains(document.activeElement)")
      end

      # Focus an element on the page (outside the palette) by selector
      def focus(selector)
        page.execute_script("document.querySelector(#{selector.to_json}).focus()")
      end

      def focused?(selector)
        page.evaluate_script("document.activeElement === document.querySelector(#{selector.to_json})")
      end

      def wait_for(timeout: Capybara.default_max_wait_time, message: "condition")
        start_time = Time.now
        loop do
          return true if yield
          raise Capybara::ExpectationNotMet, "#{message} not met after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def aria_text(attribute)
        page.evaluate_script(<<~JS)
          (() => {
            const content = document.querySelector(#{content_selector.to_json})
            return document.getElementById(content.getAttribute(#{attribute.to_json}))?.textContent.trim()
          })()
        JS
      end

      def root_selector
        id = node[:id]
        raise ArgumentError, "helpers need the command dialog root to have an id" if id.blank?

        "##{id}"
      end

      def content_selector
        "#{root_selector} [data-ui--dialog-target='content']"
      end
    end
  end
end
