# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Resizable component.
    #
    # @example Basic usage
    #   resizable = ResizableElement.new(find('[data-controller="ui--resizable"]'))
    #   panels = resizable.panels
    #   handles = resizable.handles
    #
    # @example Getting panel sizes
    #   resizable.panel_size(0) # => 50.0
    #
    # @example Dragging handle to resize
    #   resizable.drag_handle(0, 100) # Drag first handle 100px to the right
    #
    # @example Keyboard resize
    #   resizable.focus_handle(0)
    #   resizable.press_arrow_right # Increase left panel size
    #
    class ResizableElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--resizable"]'

      # === State Queries ===

      # Get the direction (horizontal or vertical)
      #
      # @return [String] "horizontal" or "vertical"
      #
      def direction
        node["data-ui--resizable-direction-value"] || "horizontal"
      end

      # Check if layout is horizontal
      #
      # @return [Boolean]
      #
      def horizontal?
        direction == "horizontal"
      end

      # Check if layout is vertical
      #
      # @return [Boolean]
      #
      def vertical?
        direction == "vertical"
      end

      # Get the number of panels
      #
      # @return [Integer]
      #
      def panel_count
        panels.count
      end

      # Get the number of handles
      #
      # @return [Integer]
      #
      def handle_count
        handles.count
      end

      # Get a panel's current size (percentage)
      #
      # @param index [Integer] Panel index (0-based)
      # @return [Float] Size as percentage (e.g., 50.0 for 50%)
      #
      def panel_size(index)
        panel = panels[index]
        return 0.0 unless panel

        size = panel["data-panel-size"]
        size ? size.to_f : 0.0
      end

      # Get all panel sizes
      #
      # @return [Array<Float>] Array of panel sizes as percentages
      #
      def panel_sizes
        panels.map.with_index { |_, i| panel_size(i) }
      end

      # Get a panel's min size constraint
      #
      # @param index [Integer] Panel index (0-based)
      # @return [Float, nil] Min size as percentage or nil if not set
      #
      def panel_min_size(index)
        panel = panels[index]
        return nil unless panel

        min = panel["data-min-size"]
        min&.to_f
      end

      # Get a panel's max size constraint
      #
      # @param index [Integer] Panel index (0-based)
      # @return [Float, nil] Max size as percentage or nil if not set
      #
      def panel_max_size(index)
        panel = panels[index]
        return nil unless panel

        max = panel["data-max-size"]
        max&.to_f
      end

      # Get a panel's default size
      #
      # @param index [Integer] Panel index (0-based)
      # @return [Float, nil] Default size as percentage or nil if not set
      #
      def panel_default_size(index)
        panel = panels[index]
        return nil unless panel

        default = panel["data-default-size"]
        default&.to_f
      end

      # === Sub-elements ===

      # Get all panel elements (direct children only)
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def panels
        # Only get direct child panels to avoid counting nested panel group's panels
        node.all(":scope > [data-ui--resizable-target='panel']", wait: 0)
      end

      # Get a specific panel element
      #
      # @param index [Integer] Panel index (0-based)
      # @return [Capybara::Node::Element, nil]
      #
      def panel(index)
        panels[index]
      end

      # Get all resize handle elements (direct children only)
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def handles
        # Only get direct child handles to avoid counting nested panel group's handles
        node.all(":scope > [data-ui--resizable-target='handle']", wait: 0)
      end

      # Get a specific resize handle element
      #
      # @param index [Integer] Handle index (0-based)
      # @return [Capybara::Node::Element, nil]
      #
      def handle(index)
        handles[index]
      end

      # === Actions ===

      # Drag a handle by a pixel amount
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @param pixels [Integer] Pixels to drag (positive = right/down, negative = left/up)
      #
      def drag_handle(handle_index, pixels)
        handle = handles[handle_index]
        raise "Handle #{handle_index} not found" unless handle

        # Use JavaScript to trigger pointer events for dragging
        # This is more reliable than trying to use Playwright's mouse API directly
        script = <<~JS
          const handle = arguments[0];
          const pixels = arguments[1];
          const direction = arguments[2];

          // Get initial position
          const rect = handle.getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;

          // Calculate end position
          const endX = direction === 'horizontal' ? startX + pixels : startX;
          const endY = direction === 'vertical' ? startY + pixels : startY;

          // Trigger pointerdown
          const downEvent = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            clientX: startX,
            clientY: startY,
            pointerId: 1
          });
          handle.dispatchEvent(downEvent);

          // Trigger pointermove
          const moveEvent = new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            clientX: endX,
            clientY: endY,
            pointerId: 1
          });
          document.dispatchEvent(moveEvent);

          // Trigger pointerup
          const upEvent = new PointerEvent('pointerup', {
            bubbles: true,
            cancelable: true,
            clientX: endX,
            clientY: endY,
            pointerId: 1
          });
          document.dispatchEvent(upEvent);
        JS

        page.execute_script(script, handle.native, pixels, direction)
        sleep 0.2 # Wait for resize to complete
      end

      # Focus a resize handle
      #
      # @param handle_index [Integer] Handle index (0-based)
      #
      def focus_handle(handle_index)
        handle = handles[handle_index]
        raise "Handle #{handle_index} not found" unless handle

        handle.native.focus
        sleep 0.05 # Wait for focus
      end

      # Resize using keyboard arrow keys
      #
      # @param handle_index [Integer] Handle index to focus
      # @param direction [Symbol] Direction to resize (:left, :right, :up, :down)
      # @param times [Integer] Number of times to press the key
      #
      def keyboard_resize(handle_index, direction, times: 1)
        focus_handle(handle_index)

        times.times do
          press_arrow(direction)
          sleep 0.05
        end

        sleep 0.1 # Wait for resize to complete
      end

      # Resize to minimum size (Home key)
      #
      # @param handle_index [Integer] Handle index to focus
      #
      def minimize_left_panel(handle_index)
        focus_handle(handle_index)
        press_home
        sleep 0.1
      end

      # Resize to maximum size (End key)
      #
      # @param handle_index [Integer] Handle index to focus
      #
      def maximize_left_panel(handle_index)
        focus_handle(handle_index)
        press_end
        sleep 0.1
      end

      # === ARIA Queries ===

      # Get ARIA attributes for a handle
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @return [Hash] Hash of ARIA attribute values
      #
      def handle_aria_attributes(handle_index)
        handle = handles[handle_index]
        return {} unless handle

        {
          role: handle["role"],
          valuenow: handle["aria-valuenow"],
          valuemin: handle["aria-valuemin"],
          valuemax: handle["aria-valuemax"]
        }
      end

      # Check if handle has correct role
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @return [Boolean]
      #
      def handle_has_separator_role?(handle_index)
        handle = handles[handle_index]
        return false unless handle

        handle["role"] == "separator"
      end

      # Get handle state
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @return [String, nil] "inactive", "hover", "drag", or nil
      #
      def handle_state(handle_index)
        handle = handles[handle_index]
        return nil unless handle

        handle["data-resize-handle-state"]
      end

      # Get handle active state
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @return [String, nil] "pointer", "keyboard", or nil
      #
      def handle_active_state(handle_index)
        handle = handles[handle_index]
        return nil unless handle

        handle["data-resize-handle-active"]
      end

      # Check if handle is focusable
      #
      # @param handle_index [Integer] Handle index (0-based)
      # @return [Boolean]
      #
      def handle_focusable?(handle_index)
        handle = handles[handle_index]
        return false unless handle

        handle["tabindex"] == "0"
      end

      # === Assertions Helpers ===

      # Check if panel size is within constraints
      #
      # @param panel_index [Integer] Panel index (0-based)
      # @return [Boolean]
      #
      def panel_within_constraints?(panel_index)
        size = panel_size(panel_index)
        min = panel_min_size(panel_index)
        max = panel_max_size(panel_index)

        within_min = min.nil? || size >= min
        within_max = max.nil? || size <= max

        within_min && within_max
      end

      # Check if all panels are within constraints
      #
      # @return [Boolean]
      #
      def all_panels_within_constraints?
        panels.each_with_index.all? { |_, i| panel_within_constraints?(i) }
      end

      # Check if panel sizes sum to approximately 100%
      #
      # @param tolerance [Float] Allowed tolerance in percentage
      # @return [Boolean]
      #
      def sizes_sum_to_100?(tolerance: 1.0)
        total = panel_sizes.sum
        (total - 100.0).abs <= tolerance
      end

      # === Waiters ===

      # Wait for a panel to reach a specific size
      #
      # @param panel_index [Integer] Panel index (0-based)
      # @param expected_size [Float] Expected size as percentage
      # @param tolerance [Float] Allowed tolerance in percentage
      # @param timeout [Float] Maximum time to wait
      #
      def wait_for_panel_size(panel_index, expected_size, tolerance: 1.0, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          current_size = panel_size(panel_index)
          return true if (current_size - expected_size).abs <= tolerance

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Panel #{panel_index} did not reach size #{expected_size}% after #{timeout}s (current: #{current_size}%)"
          end

          sleep 0.05
        end
      end
    end
  end
end
