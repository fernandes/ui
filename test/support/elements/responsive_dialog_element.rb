# frozen_string_literal: true

module UI
  module Testing
    # Element class for the Responsive Dialog (Dialog on desktop, Drawer on mobile).
    #
    # @example
    #   rd = find_element(UI::Testing::ResponsiveDialogElement, "#responsive-dialog-phlex")
    #   rd.visible_trigger.click
    #   rd.wait_for_state(:dialog, "open")
    class ResponsiveDialogElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--responsive-dialog"]'

      # The trigger of the variant visible at the current window size
      def visible_trigger
        node.find("[data-ui--drawer-target='trigger'], [data-ui--dialog-target='trigger']", visible: true)
      end

      # data-state of a variant's content (:drawer or :dialog)
      def state(type)
        page.evaluate_script("document.querySelector(#{content_selector(type).to_json}).dataset.state")
      end

      # Which variant's content holds the body
      def body_in?(type)
        page.evaluate_script(<<~JS)
          document.querySelector(#{content_selector(type).to_json})
            .contains(document.querySelector("#{root_selector} [data-ui--responsive-dialog-target='body']"))
        JS
      end

      def focus_inside?(type)
        page.evaluate_script("document.querySelector(#{content_selector(type).to_json}).contains(document.activeElement)")
      end

      def trigger_focused?(type)
        page.evaluate_script("document.activeElement === document.querySelector(#{trigger_selector(type).to_json})")
      end

      def accessible_name_source(type)
        page.evaluate_script(<<~JS)
          (() => {
            const content = document.querySelector(#{content_selector(type).to_json})
            return document.getElementById(content.getAttribute("aria-labelledby"))?.textContent.trim()
          })()
        JS
      end

      def inert?(selector)
        page.evaluate_script("!!document.querySelector(#{selector.to_json})?.closest('[inert]')")
      end

      def keyboard(*keys)
        page.send_keys(*keys)
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

      def root_selector
        id = node[:id]
        raise ArgumentError, "helpers need the responsive dialog root to have an id" if id.blank?

        "##{id}"
      end

      def content_selector(type)
        "#{root_selector} [data-ui--responsive-dialog-target='#{type}'] [role='dialog']"
      end

      def trigger_selector(type)
        "#{root_selector} [data-ui--responsive-dialog-target='#{type}'] [data-ui--#{type}-target='trigger']"
      end
    end
  end
end
