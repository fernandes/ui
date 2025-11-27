# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Slider component.
    #
    # @example Basic usage
    #   slider = SliderElement.new(find('[data-controller="ui--slider"]'))
    #   assert_equal 50, slider.value
    #   slider.set_value(75)
    #   assert_equal 75, slider.value
    #
    # @example Keyboard interaction
    #   slider.focus_thumb(0)
    #   slider.press_arrow_right
    #   assert slider.value > initial_value
    #
    # @example Range slider (two thumbs)
    #   slider = SliderElement.new(find('#price-slider'))
    #   assert_equal [25, 75], slider.values
    #   slider.set_value(30, thumb_index: 0)
    #   assert_equal 30, slider.values[0]
    #
    class SliderElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--slider"]'

      # === State Queries ===

      # Get the current value (for single thumb slider)
      #
      # @return [Integer, Float] The current value
      #
      def value
        values.first
      end

      # Get all values (for multi-thumb slider)
      #
      # @return [Array<Integer, Float>] Array of values for each thumb
      #
      def values
        thumbs.map { |thumb| thumb["aria-valuenow"].to_f.to_i }
      end

      # Get the minimum value
      #
      # @return [Integer, Float]
      #
      def min
        first_thumb = thumbs.first
        return 0 unless first_thumb

        first_thumb["aria-valuemin"].to_f.to_i
      end

      # Get the maximum value
      #
      # @return [Integer, Float]
      #
      def max
        first_thumb = thumbs.first
        return 100 unless first_thumb

        first_thumb["aria-valuemax"].to_f.to_i
      end

      # Get the step value
      #
      # @return [Integer, Float]
      #
      def step
        node["data-ui--slider-step-value"].to_f.to_i
      end

      # Get the orientation
      #
      # @return [String] "horizontal" or "vertical"
      #
      def orientation
        node["data-orientation"] || "horizontal"
      end

      # Check if slider is horizontal
      #
      # @return [Boolean]
      #
      def horizontal?
        orientation == "horizontal"
      end

      # Check if slider is vertical
      #
      # @return [Boolean]
      #
      def vertical?
        orientation == "vertical"
      end

      # Check if slider has multiple thumbs (range slider)
      #
      # @return [Boolean]
      #
      def range?
        thumbs.count > 1
      end

      # === Sub-elements ===

      # Get all thumb elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def thumbs
        all_within('[data-ui--slider-target="thumb"]')
      end

      # Get a specific thumb by index
      #
      # @param index [Integer] Thumb index (0-based)
      # @return [Capybara::Node::Element, nil]
      #
      def thumb(index = 0)
        thumbs[index]
      end

      # Get the track element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def track
        first_within('[data-ui--slider-target="track"]')
      end

      # Get the range/fill element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def range
        first_within('[data-ui--slider-target="range"]')
      end

      # === Actions ===

      # Set slider to a specific value
      #
      # @param new_value [Integer, Float] The target value
      # @param thumb_index [Integer] Which thumb to move (for range sliders)
      #
      def set_value(new_value, thumb_index: 0)
        return if disabled?

        thumb_element = thumb(thumb_index)
        return unless thumb_element

        # Calculate the percentage of the slider
        percentage = ((new_value - min).to_f / (max - min).to_f) * 100

        # Use JavaScript to set the value directly
        script = <<~JS
          (function() {
            const slider = document.getElementById('#{node[:id]}');
            if (!slider) return;

            const controller = slider.getAttribute('data-controller');
            const stimulusController = Stimulus.getControllerForElementAndIdentifier(slider, 'ui--slider');

            if (stimulusController) {
              const newValues = [...stimulusController.valueValue];
              newValues[#{thumb_index}] = #{new_value};
              newValues.sort((a, b) => a - b);
              stimulusController.valueValue = newValues;
            }
          })();
        JS

        page.execute_script(script)
        sleep 0.1 # Allow UI to update
      end

      # Drag thumb to a specific position (simulates mouse drag)
      #
      # @param new_value [Integer, Float] The target value
      # @param thumb_index [Integer] Which thumb to drag
      #
      def drag_to(new_value, thumb_index: 0)
        return if disabled?

        thumb_element = thumb(thumb_index)
        return unless thumb_element

        # Get track dimensions
        track_rect = track.evaluate_script("this.getBoundingClientRect()")
        thumb_rect = thumb_element.evaluate_script("this.getBoundingClientRect()")

        # Calculate target position
        percentage = (new_value - min).to_f / (max - min).to_f

        if horizontal?
          target_x = track_rect["x"] + (track_rect["width"] * percentage)
          target_y = thumb_rect["y"] + (thumb_rect["height"] / 2)
        else
          target_x = thumb_rect["x"] + (thumb_rect["width"] / 2)
          target_y = track_rect["y"] + track_rect["height"] - (track_rect["height"] * percentage)
        end

        # Simulate drag
        page.driver.browser.mouse.move(thumb_rect["x"] + thumb_rect["width"] / 2, thumb_rect["y"] + thumb_rect["height"] / 2)
        page.driver.browser.mouse.down
        page.driver.browser.mouse.move(target_x, target_y)
        page.driver.browser.mouse.up

        sleep 0.1 # Allow UI to update
      end

      # Click on track at a specific value position
      #
      # @param click_value [Integer, Float] Value position to click
      #
      def click_track_at(click_value)
        return if disabled?
        return unless track

        slider_id = node[:id]
        return unless slider_id

        # Calculate click position and trigger click via JavaScript
        script = <<~JS
          (function() {
            const slider = document.getElementById('#{slider_id}');
            if (!slider) return false;

            const track = slider.querySelector('[data-ui--slider-target="track"]');
            if (!track) return false;

            const rect = track.getBoundingClientRect();
            const percentage = (#{click_value} - #{min}) / (#{max} - #{min});

            let clientX, clientY;
            if ('#{orientation}' === 'horizontal') {
              clientX = rect.x + (rect.width * percentage);
              clientY = rect.y + (rect.height / 2);
            } else {
              clientX = rect.x + (rect.width / 2);
              clientY = rect.y + rect.height - (rect.height * percentage);
            }

            // Create and dispatch click event
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              clientX: clientX,
              clientY: clientY,
              view: window
            });

            track.dispatchEvent(clickEvent);
            return true;
          })();
        JS

        page.execute_script(script)
        sleep 0.15
      end

      # === Keyboard Navigation ===

      # Focus a specific thumb
      #
      # @param thumb_index [Integer] Which thumb to focus (0-based)
      #
      def focus_thumb(thumb_index = 0)
        thumb_element = thumb(thumb_index)
        return unless thumb_element

        slider_id = node[:id]
        return unless slider_id

        script = <<~JS
          (function() {
            const slider = document.getElementById('#{slider_id}');
            if (!slider) return;
            const thumbs = slider.querySelectorAll('[data-ui--slider-target="thumb"]');
            if (thumbs[#{thumb_index}]) {
              thumbs[#{thumb_index}].focus();
            }
          })();
        JS

        page.execute_script(script)
        sleep 0.05
      end

      # Increase value by step (arrow right/up)
      def increment
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:arrow_right)
        sleep 0.05
      end

      # Decrease value by step (arrow left/down)
      def decrement
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:arrow_left)
        sleep 0.05
      end

      # Jump to maximum value (End key)
      def jump_to_max
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:end)
        sleep 0.05
      end

      # Jump to minimum value (Home key)
      def jump_to_min
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:home)
        sleep 0.05
      end

      # Large step increase (PageUp)
      def page_up
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:page_up)
        sleep 0.05
      end

      # Large step decrease (PageDown)
      def page_down
        thumb_element = thumb(0)
        return unless thumb_element

        focus_thumb(0)
        thumb_element.send_keys(:page_down)
        sleep 0.05
      end

      # Get the index of currently focused thumb
      #
      # @return [Integer, nil] Thumb index or nil if none focused
      #
      def focused_thumb_index
        slider_id = node[:id]
        return nil unless slider_id

        script = <<~JS
          (function() {
            const slider = document.getElementById('#{slider_id}');
            if (!slider) return null;
            const thumbs = slider.querySelectorAll('[data-ui--slider-target="thumb"]');
            for (let i = 0; i < thumbs.length; i++) {
              if (document.activeElement === thumbs[i]) {
                return i;
              }
            }
            return null;
          })();
        JS

        page.evaluate_script(script)
      end

      # === ARIA Queries ===

      # Get ARIA attributes for a specific thumb
      #
      # @param thumb_index [Integer] Which thumb to check (0-based)
      # @return [Hash] Hash of ARIA attribute values
      #
      def aria_attributes(thumb_index: 0)
        thumb_element = thumb(thumb_index)
        return {} unless thumb_element

        {
          role: thumb_element["role"],
          valuenow: thumb_element["aria-valuenow"],
          valuemin: thumb_element["aria-valuemin"],
          valuemax: thumb_element["aria-valuemax"],
          orientation: thumb_element["aria-orientation"],
          disabled: thumb_element["aria-disabled"]
        }
      end

      # Check if thumb has correct role
      #
      # @param thumb_index [Integer] Which thumb to check
      # @return [Boolean]
      #
      def thumb_has_slider_role?(thumb_index: 0)
        thumb_element = thumb(thumb_index)
        return false unless thumb_element

        thumb_element["role"] == "slider"
      end

      # === Event Tracking ===

      # Wait for slider:change event
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      # @yield Block to execute that should trigger the event
      #
      def wait_for_change_event(timeout: 2, &block)
        wait_for_event("slider:change", timeout: timeout, &block)
      end

      # Wait for slider:commit event
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      # @yield Block to execute that should trigger the event
      #
      def wait_for_commit_event(timeout: 2, &block)
        wait_for_event("slider:commit", timeout: timeout, &block)
      end

      private

      def wait_for_event(event_name, timeout:)
        # Set up event listener
        script = <<~JS
          window.__sliderEventFired = false;
          document.getElementById('#{node[:id]}').addEventListener('#{event_name}', function() {
            window.__sliderEventFired = true;
          }, { once: true });
        JS
        page.execute_script(script)

        # Execute the block that should trigger the event
        yield if block_given?

        # Wait for event
        start_time = Time.now
        loop do
          return true if page.evaluate_script("window.__sliderEventFired")

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Event #{event_name} not fired after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
