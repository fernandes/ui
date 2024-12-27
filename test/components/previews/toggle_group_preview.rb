class ToggleGroupPreview < Lookbook::Preview
  def default
    render UI::ToggleGroup.new(type: :single) do |grp|
      grp.item(:bold, aria_label: "Toggle Bold")
      grp.item(:italic, aria_label: "Toggle Italic")
      grp.item(:underline, aria_label: "Toggle Underline")
    end
  end
end
