# frozen_string_literal: true

require "test_helper"

# Command Dialog lives on the Command showcase page.
class CommandDialogTest < UI::SystemTestCase
  # A focusable element outside the palettes, focused before opening
  OUTSIDE = "[data-ui--command-target='input']"

  setup do
    visit_component("command")
  end

  def palette(renderer = "phlex")
    find_element(UI::Testing::CommandDialogElement, "##{renderer}-command-dialog")
  end

  def open_palette(palette, shortcut)
    palette.focus(OUTSIDE)
    palette.press_shortcut(*shortcut)
    palette.wait_for(message: "palette open with focus inside") { palette.open? && palette.focus_inside? }
  end

  {"phlex" => [:meta, "j"], "vc" => [:control, "k"]}.each do |renderer, shortcut|
    test "#{renderer}: the shortcut opens a named palette with focus in the search input" do
      dialog = palette(renderer)

      open_palette(dialog, shortcut)

      assert dialog.input_focused?
      assert_equal "Command Palette", dialog.accessible_name
      assert_equal "Search for a command to run...", dialog.accessible_description
    end
  end

  test "Tab keeps focus inside instead of closing the palette" do
    dialog = palette
    open_palette(dialog, [:meta, "j"])

    3.times { dialog.keyboard(:tab) }

    assert dialog.open?, "Tab closed the palette"
    assert dialog.focus_inside?, "focus escaped the palette"
  end

  test "Escape closes it and returns focus to where it was" do
    dialog = palette
    open_palette(dialog, [:meta, "j"])

    dialog.keyboard(:escape)
    dialog.wait_for(message: "palette closed") { !dialog.open? }

    assert dialog.focused?(OUTSIDE), "focus was not restored"
  end
end
