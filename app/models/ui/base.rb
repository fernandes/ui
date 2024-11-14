module UI
  class Base < Phlex::HTML
    TAILWIND_MERGER = ::TailwindMerge::Merger.new.freeze

    attr_reader :id, :attrs

    def initialize(**user_attrs)
      @id = user_attrs.fetch(:id, generate_id)
      @attrs = mix(default_attrs, user_attrs)
      @attrs[:class] = TAILWIND_MERGER.merge(@attrs[:class]) if @attrs[:class]
    end

    private

    def merge_class(default_class, attrs)
      user_class = attrs.delete(:class) || ""
      el_class = TailwindMerge::Merger.new.merge([default_class, user_class])
      attrs[:class] = el_class
      attrs
    end

    def process_class(default_class, options)
      user_class = [options.delete(:class)].flatten.compact
      default_class = default_class.split(" ") if default_class.is_a?(String)
      element_class = user_class.empty? ? default_class : user_class
      element_class.push(options[:append_class] || nil)
      element_class.prepend(options[:prepend_class] || nil)
      element_class.compact!

      # yes, we mutate the options hash to remove our custom attributes
      options.delete(:append_class)
      options.delete(:prepend_class)
      element_class
    end

    def default_attrs
      {}
    end

    def generate_id
      generated = UI::IdGenerator.generate(self.class.to_s)
      "ui-#{generated}"
    end

    def self.ui_attribute(name, klass = nil)
      define_method name do |**args, &b|
        klass = klass.present? ? klass : self.class.const_get(name.to_s.camelize)
        instance_variable_set(:"@#{name.to_s}", klass.new(**args, &b))
      end
    end
  end
end
