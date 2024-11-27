module UI
  TYPOGRAPHY_TAGS = %i[h1 h2 h3 h4 p blockquote ul li code lead large small muted]
  module TypographyMethods
    UI::TYPOGRAPHY_TAGS.each do |m|
      define_class_method(m) do |**args, &block|
        render "UI::#{m.capitalize}".constantize.new(**args, &block)
      end
    end
  end

  extend TypographyMethods
end
