class BadgePreview < Lookbook::Preview
  def default
    render UI::Badge.new { "Badge" }
  end

  def default_lg
    render UI::Badge.new(size: :lg) { "Badge" }
  end

  def secondary
    render UI::Badge.new(variant: :secondary) { "Badge" }
  end

  def outline
    render UI::Badge.new(variant: :outline) { "Badge" }
  end

  def destructive
    render UI::Badge.new(variant: :destructive) { "Badge" }
  end
end
