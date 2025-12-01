# frozen_string_literal: true

class UI::TableComponent < ViewComponent::Base
  include UI::TableBehavior

  renders_one :table_header, UI::TableHeaderComponent
  renders_one :table_body, UI::TableBodyComponent
  renders_one :table_footer, UI::TableFooterComponent
  renders_one :table_caption, UI::TableCaptionComponent

  # Aliases amigáveis
  alias_method :header, :with_table_header
  alias_method :body, :with_table_body
  alias_method :footer, :with_table_footer
  alias_method :caption, :with_table_caption

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :table, **table_html_attributes.deep_merge(@attributes) do
      safe_join([table_caption, table_header, table_body, table_footer].compact)
    end
  end
end
