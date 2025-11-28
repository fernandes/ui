# frozen_string_literal: true

    # TriggerComponent - ViewComponent implementation
    class UI::DropdownMenuTriggerComponent < ViewComponent::Base
      include UI::DropdownMenuTriggerBehavior

      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def call
        trigger_attrs = dropdown_menu_trigger_html_attributes.deep_merge(@attributes)

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
          # Default mode: render as div
          content_tag :div, **trigger_attrs do
            content
          end
        end
      end
    end
