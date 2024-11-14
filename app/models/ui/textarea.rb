class UI::Textarea < UI::Base
  def view_template
    textarea(**attrs)
  end

  def default_attrs
    {
      class: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      id: ":r26:-form-item",
      aria_describedby: ":r26:-form-item-description",
      aria_invalid: "false"
    }
  end
end
