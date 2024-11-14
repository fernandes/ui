class TextareaPreview < Lookbook::Preview
  def default
    render UI::Textarea.new(placeholder: "Type your message here")
  end

  def disabled
    render UI::Textarea.new(placeholder: "Type your message here", disabled: true)
  end

  def with_label
    render Phlex::HTML.new do |h|
      h.div(class: "grid w-full gap-1.5") do
        h.render UI::Label.new(htmlFor: :message) { "Your Message" }
        h.render UI::Textarea.new(placeholder: "Type your message here", id: :message)
      end
    end
  end
end
