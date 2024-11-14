module UI::KeyToHuman
  module ClassMethods
    def convert(key)
      parts = key.split(".")
      parts.map! { |k| humanize(k) }
      parts.join("")
    end

    def humanize(key)
      return "⌘" if key == "meta"
      key.upcase
    end
  end
  extend ClassMethods
end