# frozen_string_literal: true

require "tailwind_merge"

    # InputBehavior
    #
    # Shared behavior for CommandInput component.
    module UI::CommandInputBehavior
      def command_input_wrapper_classes
        "flex items-center border-b px-3"
      end

      def command_input_html_attributes
        {
          class: command_input_classes,
          data: command_input_data_attributes,
          type: "text",
          placeholder: @placeholder || "Type a command or search...",
          autocomplete: "off",
          autocorrect: "off",
          spellcheck: "false",
          role: "combobox",
          "aria-expanded": "true",
          "aria-autocomplete": "list"
        }
      end

      def command_input_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_input_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def command_input_data_attributes
        {
          slot: "command-input",
          ui__command_target: "input",
          action: "input->ui--command#filter keydown->ui--command#handleKeydown"
        }
      end

      private

      def command_input_base_classes
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      end
    end
