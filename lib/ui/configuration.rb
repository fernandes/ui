# frozen_string_literal: true

module UI
  # ==========================================================================
  # Configuration
  # ==========================================================================
  # Allows users to override automatic gem detection for Phlex and ViewComponent.
  #
  # @example Force enable (useful for testing unsupported versions)
  #   UI.configure do |c|
  #     c.enable_phlex = true
  #     c.enable_view_component = true
  #   end
  #
  # @example Force disable (useful when gems exist but shouldn't be used)
  #   UI.configure do |c|
  #     c.enable_phlex = false
  #     c.enable_view_component = false
  #   end
  #
  # @example Let automatic detection decide (default)
  #   # Don't call configure, or set to nil
  #   UI.configure do |c|
  #     c.enable_phlex = nil  # auto-detect
  #     c.enable_view_component = nil  # auto-detect
  #   end

  class Configuration
    # @return [Boolean, nil] nil = auto-detect, true = force enable, false = force disable
    attr_accessor :enable_phlex

    # @return [Boolean, nil] nil = auto-detect, true = force enable, false = force disable
    attr_accessor :enable_view_component

    def initialize
      @enable_phlex = nil
      @enable_view_component = nil
    end
  end

  class << self
    def configuration
      @configuration ||= Configuration.new
    end

    def configure
      yield(configuration)
    end

    def reset_configuration!
      @configuration = Configuration.new
    end
  end
end
