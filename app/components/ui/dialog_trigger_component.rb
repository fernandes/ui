# frozen_string_literal: true

    # Dialog trigger component (ViewComponent)
    # Opens the dialog on click
    #
    # @example As button (default)
    #   <%= render UI::TriggerComponent.new { "Open Dialog" } %>
    #
    # @example As child (composition pattern)
    #   <%= render UI::TriggerComponent.new(as_child: true) do %>
    #     <%= render UI::ButtonComponent.new(variant: :outline) { "Open" } %>
    #   <% end %>
    class UI::DialogTriggerComponent < ViewComponent::Base
      # @param as_child [Boolean] merge attributes into child element
      # @param variant [Symbol] button variant (when not using as_child)
      # @param size [Symbol] button size (when not using as_child)
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(as_child: false, variant: :outline, size: :default, classes: "", **attributes)
        @as_child = as_child
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def call
        trigger_attrs = {
          data: { action: "click->ui--dialog#open" }
        }.deep_merge(@attributes)

        if @as_child
          # asChild mode: merge attributes into child element
          rendered = content.to_s
          doc = Nokogiri::HTML::DocumentFragment.parse(rendered)
          first_element = doc.children.find { |node| node.element? }

          if first_element
            # Merge data attributes (convert Rails naming to HTML)
            trigger_attrs.fetch(:data, {}).each do |key, value|
              html_key = key.to_s.gsub("__", "--").gsub("_", "-")
              first_element["data-#{html_key}"] = value
            end

            # Merge CSS classes with TailwindMerge
            if trigger_attrs[:class]
              existing_classes = first_element["class"] || ""
              merged_classes = TailwindMerge::Merger.new.merge([existing_classes, trigger_attrs[:class]].join(" "))
              first_element["class"] = merged_classes
            end

            # Merge other attributes (except data and class)
            trigger_attrs.except(:data, :class).each do |key, value|
              first_element[key.to_s] = value
            end

            doc.to_html.html_safe
          else
            content
          end
        else
          # Default: render as Button component
          render(UI::ButtonComponent.new(
            variant: @variant,
            size: @size,
            classes: @classes,
            **trigger_attrs
          ).with_content(content))
        end
      end
    end
