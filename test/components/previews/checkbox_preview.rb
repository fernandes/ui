class CheckboxPreview < Lookbook::Preview
  def default
    render Phlex::HTML.new do |h|
      h.div(class: "flex items-center space-x-2") do
        h.render UI::Checkbox.new
        h.render UI::Label.new(for: "terms") { "Accept terms and conditions" }
      end
    end
  end

  def checked
    render Phlex::HTML.new do |h|
      h.div(class: "flex items-center space-x-2") do
        h.render UI::Checkbox.new(checked: true)
        h.render UI::Label.new(for: "terms") { "Accept terms and conditions" }
      end
    end
  end
end
