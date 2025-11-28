module ApplicationHelper
  def phlex_safe(string)
    Phlex::SGML::SafeValue.new(string)
  end
end
