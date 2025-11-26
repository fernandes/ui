# frozen_string_literal: true

require "nokogiri"

module UI
  module NavigationMenu
    # LinkComponent - ViewComponent implementation
    #
    # Navigation link component. Supports asChild pattern for composition with link_to.
    #
    # @example Basic usage
    #   <%= render UI::NavigationMenu::LinkComponent.new(href: "/docs") do %>
    #     Documentation
    #   <% end %>
    #
    # @example With asChild for Rails link_to
    #   <%= render UI::NavigationMenu::LinkComponent.new(as_child: true) do %>
    #     <%= link_to "Documentation", docs_path %>
    #   <% end %>
    #
    # @example As trigger style (for direct links without dropdown)
    #   <%= render UI::NavigationMenu::LinkComponent.new(as_child: true, trigger_style: true) do %>
    #     <%= link_to "About", about_path %>
    #   <% end %>
    class LinkComponent < ViewComponent::Base
      include UI::NavigationMenu::LinkBehavior
      include UI::Shared::AsChildBehavior

      # @param href [String] URL for the link (ignored when as_child: true)
      # @param active [Boolean] Whether this link is currently active
      # @param as_child [Boolean] When true, injects attributes into child element
      # @param trigger_style [Boolean] When true, uses trigger styling (for direct links)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(href: nil, active: false, as_child: false, trigger_style: false, classes: "", **attributes)
        @href = href
        @active = active
        @as_child = as_child
        @trigger_style = trigger_style
        @classes = classes
        @attributes = attributes
      end

      def call
        link_attrs = build_link_attributes

        if @as_child
          # asChild mode: merge attributes into child element using Nokogiri
          rendered = content.to_s
          doc = Nokogiri::HTML::DocumentFragment.parse(rendered)
          first_element = doc.children.find { |node| node.element? }

          if first_element
            # Merge data attributes
            link_attrs.fetch(:data, {}).each do |key, value|
              next if value.nil?

              html_key = key.to_s.gsub("__", "--").gsub("_", "-")
              first_element["data-#{html_key}"] = value.to_s
            end

            # Merge CSS classes with TailwindMerge
            if link_attrs[:class]
              existing_classes = first_element["class"] || ""
              merged_classes = TailwindMerge::Merger.new.merge([existing_classes, link_attrs[:class]].join(" "))
              first_element["class"] = merged_classes
            end

            # Merge other attributes (except data and class)
            link_attrs.except(:data, :class).each do |key, value|
              next if value.nil?

              first_element[key.to_s.gsub("_", "-")] = value.to_s
            end

            doc.to_html.html_safe
          else
            content
          end
        else
          # Default mode: render as anchor
          content_tag :a, **link_attrs do
            content
          end
        end
      end

      private

      def build_link_attributes
        base_attrs = navigation_menu_link_html_attributes

        # Override classes if trigger_style is true
        if @trigger_style
          base_attrs[:class] = TailwindMerge::Merger.new.merge([
            navigation_menu_link_trigger_style_classes,
            @classes
          ].compact.join(" "))
        end

        base_attrs.deep_merge(@attributes)
      end
    end
  end
end
