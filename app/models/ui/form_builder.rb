class UI::FormBuilder < ActionView::Helpers::FormBuilder
  def text_field(method, options = {})
    options[:object] = object

    tag = UI::Rails::Tags::TextField.new(object_name, method, @template, options)
    @template.render UI::Input.new(**tag.attributes)
  end

  # def form_group(options = {}, &block)
  #   default_class = %w[grid gap-3]
  #   @template.content_tag(:div, class: process_class(default_class, options), &block)
  # end

  def process_class(default_class, options)
    options = options.dup
    user_class = [options.delete(:class)].flatten.compact
    default_class = default_class.split(" ") if default_class.is_a?(String)
    element_class = user_class.empty? ? default_class : user_class
    element_class.push(options[:append_class] || nil)
    element_class.prepend(options[:prepend_class] || nil)
    element_class.compact!
    options.delete(:append_class)
    options.delete(:prepend_class)
    element_class
  end

  def submit(method, options = {})
    default_class = %w[inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3]
    options[:class] = process_class(default_class, options)
    super
  end
end
