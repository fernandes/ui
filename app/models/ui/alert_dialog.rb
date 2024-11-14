class UI::AlertDialog < UI::Base
  include Phlex::DeferredRender

  ui_attribute :content

  def view_template
    render UI::Backdrop.new
    
    render(@content) if @content
  end

  class Content < UI::Base
    include Phlex::DeferredRender
    ui_attribute :header
    ui_attribute :footer

    def view_template(&)
      render UI::Modal.new do
        render(@header)
        render(@footer)
      end
    end

    class Header < UI::Base
      include Phlex::DeferredRender
      ui_attribute :title
      ui_attribute :body

      def view_template(&)
        div(class: "flex flex-col space-y-2 text-center sm:text-left") do
          render(@title)
          render(@body)
        end
      end

      class Title < UI::Base
        def view_template(&)
          h2(id: "radix-:rj5:", class: "text-lg font-semibold") do
            yield
          end
        end
      end

      class Body < UI::Base
        def view_template(&)
          p(id: "radix-:rj6:", class: "text-sm text-muted-foreground") do
            yield
          end
        end
      end
    end

    class Footer < UI::Base
      include Phlex::DeferredRender
      ui_attribute :cancel
      ui_attribute :action
      def view_template(&)
        div(class: "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2") do
          render(@cancel)
          render(@action)
        end
      end

      class Cancel < UI::Base
        def view_template(&)
          yield
        end
      end

      class Action < UI::Base
        def view_template(&)
          yield
        end
      end
    end
  end
end
