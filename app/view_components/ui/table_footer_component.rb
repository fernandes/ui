# frozen_string_literal: true

class UI::TableFooterComponent < ViewComponent::Base
  include UI::TableFooterBehavior

  renders_many :rows, UI::TableRowComponent

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
