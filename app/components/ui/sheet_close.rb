# frozen_string_literal: true

    class UI::SheetClose < Phlex::HTML
      include UI::SharedAsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering button
      # @param variant [Symbol] Button variant (passed to Button component when not using asChild)
      # @param size [Symbol] Button size (passed to Button component when not using asChild)
      # @param classes [String] Additional CSS classes
      def initialize(as_child: false, variant: :outline, size: :default, classes: nil, **attributes)
        @as_child = as_child
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        close_attrs = {
          data: { action: "click->ui--dialog#close" },
          **@attributes
        }

        if @as_child
          # Yield attributes to block - child must accept and use them
          yield(close_attrs) if block_given?
        else
          # Default: render as Button component
          render UI::Button.new(
            variant: @variant,
            size: @size,
            classes: @classes,
            **close_attrs
          ) do
            yield if block_given?
          end
        end
      end
    end
