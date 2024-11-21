class UI::Command < UI::Base
  include Phlex::DeferredRender

  def initialize(**attrs)
    @groups = []
    super
  end

  ui_attribute :search

  def group(name, **attrs, &block)
    group = Group.new(name, **attrs)
    @groups << group
    block.yield(group)
    group
  end

  def view_template
    div(
      tabindex: "-1",
      class: [
        "flex h-max w-full flex-col overflow-hidden bg-popover text-popover-foreground rounded-lg border shadow-md md:min-w-[450px] max-w-[450px] max-h-content"
      ],
      cmdk_root: ""
    ) do
      render(@search) if @search
      @groups.each { |g| render(g) }
    end
  end
end
