# frozen_string_literal: true

module UI
  module Table
    class HeaderComponent < ViewComponent::Base
      include HeaderBehavior

      renders_many :rows, RowComponent

      # Alias amigável
      alias_method :row, :with_row

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :thead, **header_html_attributes.deep_merge(@attributes) do
          safe_join(rows)
        end
      end
    end
  end
end
