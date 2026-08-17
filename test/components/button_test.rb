# frozen_string_literal: true

require "test_helper"

# Rendering tests for UI::Button. These exercise the produced HTML directly
# rather than through a browser, because variants, class merging and the
# asChild composition are markup concerns, not interaction ones.
class ButtonTest < ActiveSupport::TestCase
  # --- default rendering ---------------------------------------------------

  test "renders a button element with the base classes" do
    html = render(UI::Button.new { "Salvar" })

    assert_match(/<button/, html)
    assert_match(/Salvar/, html)
    assert_match(/inline-flex/, html)
    assert_match(/type="button"/, html)
  end

  test "applies the variant classes" do
    assert_match(/bg-destructive/, render(UI::Button.new(variant: "destructive") { "x" }))
    assert_match(/border/, render(UI::Button.new(variant: "outline") { "x" }))
  end

  test "applies the size classes" do
    assert_match(/h-8/, render(UI::Button.new(size: "sm") { "x" }))
  end

  test "a disabled button carries the disabled attribute" do
    html = render(UI::Button.new(disabled: true) { "x" })

    assert_match(/disabled/, html)
  end

  test "caller classes are merged, with conflicts resolved in their favour" do
    html = render(UI::Button.new(class: "w-full") { "x" })

    assert_match(/w-full/, html)
    assert_match(/inline-flex/, html)
  end

  test "custom attributes reach the element" do
    html = render(UI::Button.new(data: { action: "click->thing#go" }, id: "go") { "x" })

    assert_match(/data-action="click->thing#go"/, html)
    assert_match(/id="go"/, html)
  end

  # --- asChild -------------------------------------------------------------

  test "as_child yields the attributes instead of rendering a button" do
    captured = nil
    html = render(UI::Button.new(as_child: true) { |attrs| captured = attrs; "" })

    assert_not_includes html, "<button"
    assert captured.present?
    assert_match(/inline-flex/, captured[:class])
  end

  test "as_child hands over the variant and size styling" do
    captured = nil
    render(UI::Button.new(variant: "outline", size: "sm", as_child: true) { |attrs| captured = attrs; "" })

    assert_match(/border/, captured[:class])
    assert_match(/h-8/, captured[:class])
  end

  # `type` belongs to <button>; an <a> receiving it would be invalid HTML.
  test "as_child does not hand over the type attribute" do
    captured = nil
    render(UI::Button.new(as_child: true) { |attrs| captured = attrs; "" })

    assert_not_includes captured.keys, :type
  end

  # An anchor cannot be `disabled`, so the intent is carried as aria-disabled.
  test "as_child converts disabled into aria-disabled" do
    captured = nil
    render(UI::Button.new(disabled: true, as_child: true) { |attrs| captured = attrs; "" })

    assert_not_includes captured.keys, :disabled
    assert_equal "true", captured.dig(:aria, :disabled)
  end

  test "as_child keeps custom attributes" do
    captured = nil
    render(UI::Button.new(as_child: true, data: { turbo_method: :delete }) { |attrs| captured = attrs; "" })

    assert_equal :delete, captured.dig(:data, :turbo_method)
  end

  test "as_child merges caller classes with the button styling" do
    captured = nil
    render(UI::Button.new(as_child: true, class: "w-full") { |attrs| captured = attrs; "" })

    assert_match(/w-full/, captured[:class])
    assert_match(/inline-flex/, captured[:class])
  end

  test "as_child without a block renders nothing" do
    assert_equal "", render(UI::Button.new(as_child: true)).strip
  end

  # The composition case this exists for: a link that looks like a button.
  test "as_child produces a styled anchor when the block renders one" do
    html = render(UI::Button.new(variant: "outline", as_child: true) do |attrs|
      %(<a href="/x" class="#{attrs[:class]}">Ir</a>).html_safe
    end)

    assert_match(%r{<a href="/x"}, html)
    assert_match(/inline-flex/, html)
    assert_not_includes html, "<button"
  end

  private

  def render(component)
    component.call
  end
end
