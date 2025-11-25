# frozen_string_literal: true

module UI
  module Dialog
    # Dialog close component (ViewComponent)
    # Closes the dialog on click
    #
    # @example As button (default)
    #   <%= render UI::Dialog::CloseComponent.new { "Close" } %>
    #
    # @example As child (composition pattern)
    #   <%= render UI::Dialog::CloseComponent.new(as_child: true) do %>
    #     <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Cancel" } %>
    #   <% end %>
    class CloseComponent < ViewComponent::Base
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
        close_attrs = {
          data: { action: "click->ui--dialog#close" }
        }.deep_merge(@attributes)

        if @as_child
          # asChild mode: merge attributes into child element
          rendered = content.to_s
          doc = Nokogiri::HTML::DocumentFragment.parse(rendered)
          first_element = doc.children.find { |node| node.element? }

          if first_element
            # Merge data attributes (convert Rails naming to HTML)
            close_attrs.fetch(:data, {}).each do |key, value|
              html_key = key.to_s.gsub("__", "--").gsub("_", "-")
              first_element["data-#{html_key}"] = value
            end

            # Merge CSS classes with TailwindMerge
            if close_attrs[:class]
              existing_classes = first_element["class"] || ""
              merged_classes = TailwindMerge::Merger.new.merge([existing_classes, close_attrs[:class]].join(" "))
              first_element["class"] = merged_classes
            end

            # Merge other attributes (except data and class)
            close_attrs.except(:data, :class).each do |key, value|
              first_element[key.to_s] = value
            end

            doc.to_html.html_safe
          else
            content
          end
        else
          # Default: render as Button component
          render(UI::Button::ButtonComponent.new(
            variant: @variant,
            size: @size,
            classes: @classes,
            **close_attrs
          ).with_content(content))
        end
      end
    end
  end
end
