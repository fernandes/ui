module Phlex
  module DeferredRender
    def before_template(&block)
      vanish(&block)
      super
    end
  end
end
