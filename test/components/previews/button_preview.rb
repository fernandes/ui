class ButtonPreview < Lookbook::Preview
  def default
    render UI::Button.new { "Click Here!" }
  end

  # @param variant select { choices: [primary, link, secondary, destructive, outline, ghost] }
  # @param size select { choices: [sm, md, lg, xl] }
  def variant_and_size(variant: :primary, size: :sm)
    render UI::Button.new(variant: variant, size: size) { "Click Here!" }
  end

  def icon
    render UI::Button.new(icon: true) { |b| b.render UI::Icon.new(:chevron_right, class: "h-4 w-4") }
  end

  def with_icon
    render UI::Button.new do |b|
      b.render UI::Icon.new(:mail, class: "mr-2 h-4 w-4")
      b.plain "Login with Email"
    end
  end

  def disabled
    render UI::Button.new(disabled: true) do |b|
      b.render UI::Icon.new(:loader_circle, class: "mr-2 h-4 w-4 animate-spin")
      b.plain "Please wait"
    end
  end
end
