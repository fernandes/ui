# frozen_string_literal: true

    class UI::TableBodyComponent < ViewComponent::Base
      include UI::TableBodyBehavior

      renders_many :rows, RowComponent

      # Alias amigável
      alias_method :row, :with_row

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :tbody, **body_html_attributes.deep_merge(@attributes) do
          safe_join(rows)
        end
      end
    end
