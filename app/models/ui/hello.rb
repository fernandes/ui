class UI::Hello < Phlex::HTML
  def initialize
	end

  def view_template
    p(data: {controller: "hello"}) { "Hello from Phlex" }
  end
end
