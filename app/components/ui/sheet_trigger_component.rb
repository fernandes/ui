# frozen_string_literal: true

    # Sheet trigger component (ViewComponent)
    # Opens the sheet on click
    #
    # @example As button (default)
    #   <%= render UI::TriggerComponent.new { "Open Sheet" } %>
    #
    # @example As child (composition pattern)
    #   <%= render UI::TriggerComponent.new(as_child: true) do %>
    #     <%= render UI::ButtonComponent.new { "Open" } %>
    #   <% end %>
    class UI::SheetTriggerComponent < ViewComponent::Base
      # @param as_child [Boolean] merge attributes into child element
      # @param attributes [Hash] additional HTML attributes
      def initialize(as_child: false, **attributes)
        @as_child = as_child
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
          # Default: render as button
          content_tag :button, content, **trigger_attrs
        end
      end
    end
