class UI::Avatar < UI::Base
  include Phlex::DeferredRender

  SIZES = {
    xs: "h-4 w-4 text-[0.5rem]",
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-xl",
    xl: "h-20 w-20 text-3xl"
  }

  ui_attribute :image
  ui_attribute :fallback

  def initialize(size: :md, **attrs)
    @size = size
    @size_classes = SIZES[@size]
    super(**attrs)
  end

  def view_template(&block)
    span(**attrs) do
      render(@image)
      render(@fallback)
    end
  end

  class Image < UI::Base
    def initialize(src:, alt: "", **attrs)
      @src = src
      @alt = alt
      super(**attrs)
    end

    def view_template
      img(**attrs)
    end

    private

    def default_attrs
      {
        loading: "lazy",
        class: "aspect-square h-full w-full hidden",
        alt: @alt,
        data_src: @src,
        data: {
          ui__avatar_target: :image,
          action: "error->ui--avatar#handleError load->ui--avatar#handleLoad"
        }
      }
    end
  end

  class Fallback < UI::Base
    def view_template(&block)
      span(**attrs, &block)
    end

    private

    def default_attrs
      {
        class: "flex h-full w-full items-center justify-center rounded-full bg-muted",
        data: {
          ui__avatar_target: :fallback
        }
      }
    end
  end

  private

  def default_attrs
    {
      data: {controller: :ui__avatar},
      class: [
        "relative flex shrink-0 overflow-hidden rounded-full",
        @size_classes
      ]
    }
  end
end
