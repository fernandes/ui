class UI::Rails::Tags::TextField < ActionView::Helpers::Tags::TextField
  def render
    options = attributes
    tag("input", options)
  end
  alias_method :to_s, :render

  def attributes
    options = @options.stringify_keys
    options["size"] = options["maxlength"] unless options.key?("size")
    options["type"] ||= field_type
    options["value"] = options.fetch("value") { value_before_type_cast } unless field_type == "file"
    add_default_name_and_id(options)
    options
  end
end
