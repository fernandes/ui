class TogglePreview < Lookbook::Preview
  def default
    render UI::Toggle.new(:bold, aria_label: "Toggle bold")
  end

  def toggled
    render UI::Toggle.new(:bold, toogle: true, aria_label: "Toggle bold")
  end

  def outline
    render UI::Toggle.new(:italic, variant: :outline, aria_label: "Toggle italic")
  end

  def with_text
    render UI::Toggle.new(:italic, aria_label: "Toggle italic") do |toggle|
      toggle.plain "Italic"
    end
  end

  def small
    render UI::Toggle.new(:italic, size: :sm, aria_label: "Toggle italic")
  end

  def large
    render UI::Toggle.new(:italic, size: :lg, aria_label: "Toggle italic")
  end

  def disabled
    render UI::Toggle.new(:underline, aria_label: "Toggle underline", disabled: true)
  end
end
