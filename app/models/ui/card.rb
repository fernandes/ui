class UI::Card < UI::Base
  include Phlex::DeferredRender

  ui_attribute :header
  ui_attribute :content
  ui_attribute :footer

  def view_template
    div(**attrs) do
      render(@header)
      render(@content)
      render(@footer)
    end
  end

  def default_attrs
    {
      class: "rounded-lg border bg-card text-card-foreground shadow-sm w-[350px]"
    }
  end

  class Header < UI::Base
    include Phlex::DeferredRender

    ui_attribute :title
    ui_attribute :description

    def view_template(&block)
      div(class: "flex flex-col space-y-1.5 p-6") do
        render(@title)
        render(@description)
      end
    end

    class Title < UI::Base
      def view_template(&block)
        h3(class: "text-2xl font-semibold leading-none tracking-tight") do
          yield
        end
      end
    end

    class Description < UI::Base
      def view_template(&block)
        p(class: "text-sm text-muted-foreground") do
          yield
        end
      end
    end
  end

  class Content < UI::Base
    def view_template(&block)
      div(**attrs) do
        yield if block
      end
    end

    def default_attrs
      {
        class: "p-6 pt-0"
      }
    end
  end

  class Footer < UI::Base
    def view_template(&block)
      div(class: "items-center p-6 pt-0 flex justify-between") do
        yield if block
      end
    end
  end
end
