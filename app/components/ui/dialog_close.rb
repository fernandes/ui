# frozen_string_literal: true

class UI::DialogClose < Phlex::HTML
  def initialize(variant: :outline, size: :default, classes: nil, **attributes)
    @variant = variant
    @size = size
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    render UI::Button.new(
      variant: @variant,
      size: @size,
      classes: @classes,
      **close_button_data_attributes.merge(@attributes)
    ) do
      yield if block_given?
    end
  end

  private

  def close_button_data_attributes
    {data: {action: "click->ui--dialog#close"}}
  end
end
