require "ui/version"
require "ui/engine"
require "phlex"
require "phlex/rails"
require "tailwind_merge"
require "lucide-rails"

module UI
  TYPOGRAPHY_TAGS = %i[h1 h2 h3 h4 p blockquote ul li code lead large small muted]
  # Your code goes here...
  # TYPOGRAPHY_TAGS = %i[h1 h2 h3 h4 p blockquote ul li code lead large small muted]
  module TypographyMethods
    UI::TYPOGRAPHY_TAGS.each do |m|
      define_method(m) do |**args, &block|
        "UI::#{m.capitalize}".constantize.new(**args, &block)
      end
    end
  end

  extend TypographyMethods
end
