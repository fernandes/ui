class RadioGroupPreview < Lookbook::Preview
  def default
    render UI::RadioGroup.new do |rg|
      rg.group do |g|
        UI::RadioGroup::Group::Item.new(value: :default, id: :r1)
        g.item(value: :default, id: :r1)
        g.label(for: :r1) { "Default" }
      end

      rg.group do |g|
        g.item(value: :comfortable, id: :r2)
        g.label(for: :r2) { "Comfortable" }
      end

      rg.group do |g|
        g.item(value: :compact, id: :r3)
        g.label(for: :r3) { "Compact" }
      end
    end
  end

  def checked
    render UI::RadioGroup.new(value: :comfortable) do |rg|
      rg.group do |g|
        UI::RadioGroup::Group::Item.new(value: :default, id: :r1)
        g.item(value: :default, id: :r1)
        g.label(for: :r1) { "Default" }
      end

      rg.group do |g|
        g.item(value: :comfortable, id: :r2)
        g.label(for: :r2) { "Comfortable" }
      end

      rg.group do |g|
        g.item(value: :compact, id: :r3)
        g.label(for: :r3) { "Compact" }
      end
    end
  end
end
