class UI::Command::Search < UI::Base
  def view_template
    placeholder = attrs.delete(:placeholder) || "Type a command or search..."
    label(
      cmdk_label: "",
      for: ":r4ae:",
      id: ":r4ad:",
      style:
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"
    )
    div(class: "flex items-center border-b px-3", cmdk_input_wrapper: "") do
      render UI::Icon.new(:search, class: "mr-2 h-4 w-4 shrink-0 opacity-50")
      input(
        class:
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        placeholder: placeholder,
        cmdk_input: "",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false",
        aria_autocomplete: "list",
        role: "combobox",
        aria_expanded: "true",
        aria_controls: ":r4ac:",
        aria_labelledby: ":r4ad:",
        id: ":r4ae:",
        value: ""
      )
    end
  end
end
