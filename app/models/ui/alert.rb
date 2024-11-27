class UI::Alert < UI::Base
  def initialize(variant: nil, **attrs)
    @variant = variant
    super(**attrs) # must be called after variant is set
  end

  def icon(name, **attrs)
    merge_class("h-4 w-4", attrs)
    render UI::Icon.new(name, **attrs)
  end

  def title(**attrs, &block)
    merge_class("mb-1 font-medium leading-none tracking-tight", attrs)
    h5(**attrs, &block)
  end

  def body(**attrs, &block)
    merge_class("text-sm [&_p]:leading-relaxed", attrs)
    div(**attrs, &block)
  end

  def view_template(&block)
    div(**attrs, &block)
  end

  private

  def colors
    case @variant
    when nil
      "ring-border bg-muted/20 text-foreground [&>svg]:opacity-80"
    when :accent
      "ring-accent/20 bg-accent/5 text-accent [&>svg]:text-accent/80"
    when :warning
      "ring-warning/20 bg-warning/5 text-warning [&>svg]:text-warning/80"
    when :success
      "ring-success/20 bg-success/5 text-success [&>svg]:text-success/80"
    when :destructive
      "ring-destructive/20 text-destructive [&>svg]:text-destructive/80"
    end
  end

  def default_attrs
    base_classes = "backdrop-blur relative w-full ring-1 ring-inset rounded-lg px-4 py-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-8"
    {
      class: [
        base_classes,
        colors
      ]
    }
  end
end
