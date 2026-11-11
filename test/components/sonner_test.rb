# frozen_string_literal: true

require "test_helper"

# Rendering tests for the Sonner toaster in all three renderers.
#
# The live region has to be in the page before the first toast is inserted,
# or screen readers don't announce it, so it is rendered by Ruby.
class SonnerComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: toasts live in a labelled, polite live region" do
      doc = toaster_doc(renderer)
      region = doc.at_css("section[role='region']")

      assert region, "region missing"
      assert_equal "Notifications (F8)", region["aria-label"]
      assert_equal "polite", region["aria-live"]
      assert_equal "false", region["aria-atomic"]
      assert_equal "-1", region["tabindex"]
      assert region.at_css("ol[data-controller='ui--sonner']"), "toast list must be inside the region"
      assert region.at_css("[data-sonner-alerts].sr-only"), "assertive container missing"
    end

    test "#{renderer}: the region label can be changed and classes stay on the list" do
      doc = toaster_doc(renderer, label: "Avisos", classes: "custom-toaster")

      assert_equal "Avisos (F8)", doc.at_css("section[role='region']")["aria-label"]
      assert_includes doc.at_css("ol[data-controller='ui--sonner']")["class"], "custom-toaster"
    end
  end

  private

  def toaster_doc(renderer, **options)
    html = case renderer
    when :erb then ApplicationController.render(partial: "ui/sonner/toaster", locals: options)
    when :phlex then UI::SonnerToaster.new(**options).call
    when :vc then ApplicationController.render(UI::SonnerToasterComponent.new(**options), layout: false)
    end
    Nokogiri::HTML::DocumentFragment.parse(html)
  end
end
