# frozen_string_literal: true

    class UI::TableRowComponent < ViewComponent::Base
      include UI::TableRowBehavior

      renders_many :heads, HeadComponent
      renders_many :cells, CellComponent

      # Aliases amigáveis
      alias_method :head, :with_head
      alias_method :cell, :with_cell

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :tr, **row_html_attributes.deep_merge(@attributes) do
          safe_join([heads, cells].flatten.compact)
        end
      end
    end
