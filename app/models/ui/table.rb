class UI::Table < UI::Base
  def view_template(&block)
    table(**attrs, &block)
  end

  def caption(**attrs, &block)
    render Caption.new(**attrs, &block)
  end

  def thead(**attrs, &block)
    render Thead.new(**attrs, &block)
  end

  def tr(**attrs, &block)
    render Tr.new(**attrs, &block)
  end

  def th(**attrs, &block)
    render Th.new(**attrs, &block)
  end

  def tbody(**attrs, &block)
    render Tbody.new(**attrs, &block)
  end

  def td(**attrs, &block)
    render Td.new(**attrs, &block)
  end

  def tfoot(**attrs, &block)
    render Tfoot.new(**attrs, &block)
  end

  def default_attrs
    {
      class: "w-full caption-bottom text-sm"
    }
  end

  class Caption < UI::Base
    def view_template(&block)
      caption(**attrs, &block)
    end

    def default_attrs
      {
        class: "mt-4 text-sm text-muted-foreground"
      }
    end
  end

  class Thead < UI::Base
    def view_template(&block)
      thead(**attrs, &block)
    end

    def default_attrs
      {
        class: "[&_tr]:border-b"
      }
    end
  end

  class Tr < UI::Base
    def view_template(&block)
      tr(**attrs, &block)
    end

    def default_attrs
      {
        class: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      }
    end
  end

  class Th < UI::Base
    def view_template(&block)
      th(**attrs, &block)
    end

    def default_attrs
      {
        class: "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      }
    end
  end

  class Tbody < UI::Base
    def view_template(&block)
      tbody(**attrs, &block)
    end

    def default_attrs
      {
        class: "[&_tr:last-child]:border-0"
      }
    end
  end

  class Td < UI::Base
    def view_template(&block)
      td(**attrs, &block)
    end

    def default_attrs
      {
        class: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      }
    end
  end

  class Tfoot < UI::Base
    def view_template(&block)
      tfoot(**attrs, &block)
    end

    def default_attrs
      {
        class: "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0"
      }
    end
  end
end
