class UI::Icon < UI::Base
  attr_reader :name

  def initialize(name, **user_attrs)
    @name = name
    super(**user_attrs)
  end

  def view_template
    attrs[:class] = process_class(default_attrs[:class], attrs)
    attrs[:class].prepend("lucide lucide-#{name.to_s.dasherize}")
    raw helpers.lucide_icon(name.to_s.dasherize, **attrs)
  end

  def default_attrs
    {
      class: "h-3.5 w-3.5"
    }
  end
end
