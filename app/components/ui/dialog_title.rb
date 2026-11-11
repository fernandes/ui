# frozen_string_literal: true

class UI::DialogTitle < Phlex::HTML
  include UI::DialogTitleBehavior

  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes (an `id` is kept)
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    h2(**dialog_title_html_attributes) do
      yield if block_given?
    end
  end
end
