# frozen_string_literal: true

require "test_helper"

# Rendering tests for Input OTP in all three renderers (ERB, Phlex, ViewComponent).
#
# The OTP is one real <input> (labelable by id, autofill-friendly, a single
# form value) with decorative, aria-hidden slots drawn from its value. The
# composed API (groups, slots, separators) keeps working.
class InputOtpComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: composed OTP renders one input that owns id and name" do
      doc = parse(renderer, composed: true, id: "otp", name: "code")
      inputs = doc.css("input")

      assert_equal 1, inputs.size
      input = inputs.first
      assert_equal "otp", input["id"]
      assert_equal "code", input["name"]
      assert_equal "one-time-code", input["autocomplete"]
      assert_equal "numeric", input["inputmode"]
      assert_equal "6", input["maxlength"]
      assert_equal "input", input["data-ui--input-otp-target"]
      assert_equal ["otp"], doc.css("[id]").map { |node| node["id"] }
    end

    test "#{renderer}: slots, groups and separators still render, hidden from AT" do
      doc = parse(renderer, composed: true)

      assert_equal 6, doc.css("[data-slot='input-otp-slot']").size
      assert_equal 2, doc.css("[data-slot='input-otp-group']").size
      separator = doc.at_css("[role='separator']")
      assert separator
      assert_equal "true", separator["aria-hidden"]
      doc.css("[data-slot='input-otp-slot']").each { |slot| assert_equal "true", slot["aria-hidden"] }
    end

    test "#{renderer}: auto-generated OTP renders length slots and one input" do
      doc = parse(renderer, length: 4)

      assert_equal 4, doc.css("[data-slot='input-otp-slot']").size
      assert_equal 1, doc.css("input").size
    end

    test "#{renderer}: no autofocus unless asked" do
      assert_nil parse(renderer).at_css("input")["autofocus"]
      assert_nil parse(renderer).at_css("[data-controller]")["data-ui--input-otp-autofocus-value"]

      opted = parse(renderer, autofocus: true)
      assert opted.at_css("input").key?("autofocus")
      assert_equal "true", opted.at_css("[data-controller]")["data-ui--input-otp-autofocus-value"]
    end

    test "#{renderer}: pre-filled slot values become the input's value" do
      doc = parse(renderer, composed: true, prefilled: "123")

      assert_equal "123", doc.at_css("input")["value"]
      assert_equal %w[1 2 3], doc.css("[data-slot='input-otp-slot']").first(3).map { |s| s.text.strip }
    end

    test "#{renderer}: value draws into the slots" do
      doc = parse(renderer, length: 4, value: "42")

      assert_equal "42", doc.at_css("input")["value"]
      assert_equal ["4", "2", "", ""], doc.css("[data-slot='input-otp-slot']").map { |s| s.text.strip }
    end

    test "#{renderer}: a disabled slot disables the input" do
      assert parse(renderer, composed: true, slot_disabled: true).at_css("input").key?("disabled")
      assert parse(renderer, disabled: true).at_css("input").key?("disabled")
    end

    test "#{renderer}: slot names are a fallback for the input's name" do
      assert_equal "otp", parse(renderer, composed: true, slot_name: "otp[0]").at_css("input")["name"]
      assert_equal "code", parse(renderer, composed: true, slot_name: "otp[0]", name: "code").at_css("input")["name"]
    end

    test "#{renderer}: a non-digit pattern uses a text keyboard" do
      assert_equal "text", parse(renderer, pattern: "[A-Za-z0-9]").at_css("input")["inputmode"]
    end

    test "#{renderer}: aria-label and invalid go to the input" do
      doc = parse(renderer, aria_label: "Code", invalid: true)
      input = doc.at_css("input")

      assert_equal "Code", input["aria-label"]
      assert_equal "true", input["aria-invalid"]
      assert_nil doc.at_css("[data-controller]")["aria-label"]
      doc.css("[data-slot='input-otp-slot']").each { |slot| assert_equal "true", slot["data-invalid"] }
    end
  end

  private

  def parse(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def root_options(options)
    options.except(:composed, :prefilled, :slot_disabled, :aria_label, :slot_name)
  end

  def render_erb(**options)
    locals = root_options(options)
    locals[:attributes] = {"aria-label": options[:aria_label]} if options[:aria_label]
    if options[:composed]
      ApplicationController.render(inline: <<~ERB, locals: {locals: locals, prefilled: options[:prefilled].to_s, slot_disabled: options[:slot_disabled], slot_name: options[:slot_name]}, layout: false)
        <%= render "ui/input_otp", **locals do %>
          <%= render "ui/input_otp/group" do %>
            <% 3.times do |i| %><%= render "ui/input_otp/slot", index: i, value: prefilled[i].to_s, disabled: !!slot_disabled, name: slot_name %><% end %>
          <% end %>
          <%= render "ui/input_otp/separator" %>
          <%= render "ui/input_otp/group" do %>
            <% (3..5).each do |i| %><%= render "ui/input_otp/slot", index: i %><% end %>
          <% end %>
        <% end %>
      ERB
    else
      ApplicationController.render(partial: "ui/input_otp", locals: locals, layout: false)
    end
  end

  def render_phlex(**options)
    opts = root_options(options)
    opts[:"aria-label"] = options[:aria_label] if options[:aria_label]
    return UI::InputOtp.new(**opts).call unless options[:composed]

    prefilled = options[:prefilled].to_s
    UI::InputOtp.new(**opts).call do |otp|
      otp.render UI::InputOtpGroup.new do
        3.times { |i| otp.render UI::InputOtpSlot.new(index: i, value: prefilled[i].to_s, disabled: !!options[:slot_disabled], name: options[:slot_name]) }
      end
      otp.render UI::InputOtpSeparator.new
      otp.render UI::InputOtpGroup.new do
        (3..5).each { |i| otp.render UI::InputOtpSlot.new(index: i) }
      end
    end
  end

  def render_vc(**options)
    opts = root_options(options)
    opts[:"aria-label"] = options[:aria_label] if options[:aria_label]
    component = options[:composed] ? VcOtp.new(opts, options[:prefilled].to_s, !!options[:slot_disabled], options[:slot_name]) : UI::InputOtpComponent.new(**opts)
    ApplicationController.render(component, layout: false)
  end

  class VcOtp < ViewComponent::Base
    def initialize(options, prefilled, slot_disabled, slot_name)
      @options = options
      @prefilled = prefilled
      @slot_disabled = slot_disabled
      @slot_name = slot_name
    end

    def call
      render(UI::InputOtpComponent.new(**@options)) do
        safe_join([
          render(UI::InputOtpGroupComponent.new) do
            safe_join(3.times.map { |i| render(UI::InputOtpSlotComponent.new(index: i, value: @prefilled[i].to_s, disabled: @slot_disabled, name: @slot_name)) })
          end,
          render(UI::InputOtpSeparatorComponent.new),
          render(UI::InputOtpGroupComponent.new) do
            safe_join((3..5).map { |i| render(UI::InputOtpSlotComponent.new(index: i)) })
          end
        ])
      end
    end
  end
end
