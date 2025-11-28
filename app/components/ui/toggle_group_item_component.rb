# frozen_string_literal: true

    # ItemComponent - ViewComponent implementation
    #
    # An individual toggle button within a Toggle Group.
    # Inherits variant, size, and type from parent ToggleGroup.
    #
    # @example Basic usage
    #   <%= render UI::ItemComponent.new(value: "left") { "Left" } %>
    #
    # @example With icon
    #   <%= render UI::ItemComponent.new(value: "bold") do %>
    #     <%= icon("bold") %>
    #   <% end %>
    class UI::ToggleGroupItemComponent < ViewComponent::Base
      include UI::ToggleGroupItemBehavior

      # @param value [String] Unique identifier for this item (required)
      # @param variant [String] Visual style variant (inherits from parent if not specified)
      # @param size [String] Size variant (inherits from parent if not specified)
      # @param pressed [Boolean] Whether the item is pressed/active
      # @param disabled [Boolean] Whether the item is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value:, variant: nil, size: nil, pressed: false, disabled: false, classes: "", **attributes)
        @value = value
        @variant = variant
        @size = size
        @pressed = pressed
        @disabled = disabled
        @classes = classes
        @attributes = attributes

        # These will be set from parent context if available
        @group_type = nil
        @spacing = nil
      end

      def before_render
        # Try to inherit from parent ToggleGroup context
        if helpers.instance_variable_defined?(:@toggle_group_context)
          parent_context = helpers.instance_variable_get(:@toggle_group_context)
          @variant ||= parent_context[:variant]
          @size ||= parent_context[:size]
          @group_type = parent_context[:type]
          @spacing = parent_context[:spacing]

          # Check if this item should be pressed based on parent value
          parent_value = parent_context[:value]
          if parent_value
            @pressed = if @group_type == "multiple"
              Array(parent_value).include?(@value)
            else
              parent_value.to_s == @value.to_s
            end
          end
        end

        # Fallback defaults
        @variant ||= "default"
        @size ||= "default"
        @group_type ||= "single"
        @spacing ||= 0
      end

      def call
        attrs = toggle_group_item_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :button, content, **attrs.merge(@attributes.except(:data))
      end
    end
