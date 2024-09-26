class AccordionPreview < Lookbook::Preview
  def default
    render UI::Accordion.new do |accordion|
      accordion.item do |item|
        item.title "Is it accessible?"
        item.content do
          "Yes. It adheres to the WAI-ARIA design pattern."
        end
      end

      accordion.item do |item|
        item.title "Is it styled?"
        item.content do
          "Yes. It comes with default styles that matches the other components' aesthetic."
        end
      end

      accordion.item do |item|
        item.title "Is it animated?"
        item.content do
          "Yes. It's animated by default, but you can disable it if you prefer."
        end
      end
    end
  end

  def open_items
    render UI::Accordion.new do |accordion|
      accordion.item do |item|
        item.title "Is it accessible?"
        item.content do
          "Yes. It adheres to the WAI-ARIA design pattern."
        end
      end

      accordion.item(open: true) do |item|
        item.title "Is it styled?"
        item.content do
          "Yes. It comes with default styles that matches the other components' aesthetic."
        end
      end

      accordion.item(open: true) do |item|
        item.title "Is it animated?"
        item.content do
          "Yes. It's animated by default, but you can disable it if you prefer."
        end
      end
    end
  end
end
