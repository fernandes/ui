# frozen_string_literal: true

module UI
  module Table
    class FooterComponent < ViewComponent::Base
      include FooterBehavior

      renders_many :rows, RowComponent

      # Alias amigável
      alias_method :row, :with_row

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :tfoot, **footer_html_attributes.deep_merge(@attributes) do
          safe_join(rows)
        end
      end
    end
  end
end
