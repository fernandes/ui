class InputPreview < Lookbook::Preview
  def default
    render UI::Input.new(placeholder: "Insert Title Here")
  end

  def file
    render Phlex::HTML.new do |h|
      h.div(class: "grid w-full max-w-sm items-center gap-1.5") do
        h.render UI::Label.new(htmlFor: "picture") { "Picture" }
        h.render UI::Input.new(id: "picture", type: :file)
      end
    end
  end

  def disabled
    render UI::Input.new(placeholder: "Email", disabled: true)
  end

  def with_label
    render Phlex::HTML.new do |h|
      h.div(class: "grid w-full max-w-sm items-center gap-1.5") do
        h.render UI::Label.new(htmlFor: "email") { "Email" }
        h.render UI::Input.new(id: "email", type: :email, placeholder: "Email")
      end
    end
  end

  def with_button
    render Phlex::HTML.new do |h|
      h.div(class: "flex w-full max-w-sm items-center space-x-2") do
        h.render UI::Input.new(id: "email", type: :email, placeholder: "Email")
        h.render UI::Button.new(type: :submit) { "Subscribe" }
      end
    end
  end

  def form
    render Phlex::HTML.new do |h|
      h.form(class: "w-2/3 space-y-6") do
        h.div(class: "space-y-2") do |d|
          d.render UI::Label.new(for: "input") { "Username" }
          d.render UI::Input.new(id: "input", placeholder: "fernandes", aria_describedby: "description", aria_invalid: false, value: "", name: "username")
          d.p(
            id: "description",
            class: "text-sm text-muted-foreground"
          ) { "This is your public display name." }
        end
        h.render UI::Button.new(type: :submit) { "Submit" }
      end
    end
  end
end
