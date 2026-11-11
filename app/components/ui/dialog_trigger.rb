# frozen_string_literal: true

class UI::DialogTrigger < Phlex::HTML
  include UI::SharedAsChildBehavior
  include UI::DialogTriggerBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering button
  # @param variant [Symbol] Button variant (when not using as_child)
  # @param size [Symbol] Button size (when not using as_child)
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, variant: :outline, size: :default, classes: nil, **attributes)
    @as_child = as_child
    @variant = variant
    @size = size
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    # aria-haspopup, aria-expanded, the open action and the trigger target
    trigger_attrs = dialog_trigger_attributes

    if @as_child
      # Yield attributes to block - child must accept and use them
      yield(trigger_attrs) if block_given?
    else
      # Default: render as Button component
      render UI::Button.new(
        variant: @variant,
        size: @size,
        classes: @classes,
        **trigger_attrs
      ), &block
    end
  end
end
