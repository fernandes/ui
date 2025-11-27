# frozen_string_literal: true

module UI
  module Switch
    class SwitchComponent < ViewComponent::Base
      include UI::SwitchBehavior

      def initialize(checked: false, disabled: false, name: nil, id: nil, value: "1", **attributes)
        @checked = checked
        @disabled = disabled
        @name = name
        @id = id
        @value = value
        @attributes = attributes
      end

      def call
        attrs = switch_html_attributes.deep_merge(@attributes.except(:class))
        attrs[:id] = @id if @id.present?

        # Merge Tailwind classes intelligently
        attrs[:class] = TailwindMerge::Merger.new.merge([
          switch_html_attributes[:class],
          @attributes[:class]
        ].compact.join(" "))

        content_tag :button, **attrs do
          safe_join([
            render_thumb,
            render_hidden_input
          ].compact)
        end
      end

      private

      def render_thumb
        content_tag :span,
          "",
          data: {
            ui__switch_target: "thumb",
            slot: "switch-thumb",
            state: switch_state
          },
          class: switch_thumb_classes
      end

      def render_hidden_input
        return unless @name.present?

        tag :input,
          type: "hidden",
          name: @name,
          value: @checked ? @value : "0",
          id: @id
      end
    end
  end
end
