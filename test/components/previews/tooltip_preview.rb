class TooltipPreview < Lookbook::Preview
  def default
    render UI::Tooltip.new do |tooltip|
      tooltip.trigger do |trigger|
        trigger.render UI::Button.new(variant: :outline) { "Hover" }
      end

      tooltip.content do |content|
        content.p { "Add to library" }
      end
    end
  end
end
