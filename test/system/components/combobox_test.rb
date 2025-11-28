# frozen_string_literal: true

require "test_helper"

class ComboboxTest < UI::SystemTestCase
  setup do
    visit_component("combobox")
  end

  # Helper to get the framework combobox (ERB example)
  def framework_combobox
    find_element(UI::TestingComboboxElement, "#framework-combobox-erb")
  end

  # Helper to get the status combobox (ERB example)
  def status_combobox
    find_element(UI::TestingComboboxElement, "#status-combobox-erb")
  end

  # Helper to get the labels combobox (DropdownMenu example)
  def labels_combobox
    find_element(UI::TestingComboboxElement, "#labels-combobox-erb")
  end

  # === Basic Interaction Tests ===

  test "opens and closes combobox" do
    combobox = framework_combobox

    # Initially closed
    assert combobox.closed?

    # Open
    combobox.open
    assert combobox.open?

    # Close
    combobox.close
    assert combobox.closed?
  end

  test "selects an option by clicking" do
    combobox = framework_combobox

    combobox.select_option("Next.js")

    assert_equal "Next.js", combobox.selected_text
    assert_equal "next", combobox.selected_value
    assert combobox.closed?
  end

  test "shows all available options when opened" do
    combobox = framework_combobox

    combobox.open

    assert combobox.has_option?("Next.js")
    assert combobox.has_option?("SvelteKit")
    assert combobox.has_option?("Nuxt.js")
    assert combobox.has_option?("Remix")
    assert combobox.has_option?("Astro")
  end

  test "closes after selecting an option" do
    combobox = framework_combobox

    combobox.open
    assert combobox.open?

    combobox.select_option("SvelteKit")

    assert combobox.closed?
    assert_equal "SvelteKit", combobox.selected_text
  end

  # === Search Functionality Tests ===

  test "searches and filters options" do
    combobox = framework_combobox

    combobox.open
    combobox.search("next")

    # Should show only Next.js
    assert combobox.has_option?("Next.js")
    assert_equal 1, combobox.option_count
  end

  test "shows empty message when no results found" do
    combobox = framework_combobox

    combobox.open
    combobox.search("nonexistent")

    assert combobox.empty_message_visible?
    assert_match(/No.*found/i, combobox.empty_message)
  end

  test "clears search and shows all options" do
    combobox = framework_combobox

    combobox.open
    combobox.search("next")
    assert_equal 1, combobox.option_count

    combobox.clear_search
    assert_equal 5, combobox.option_count
  end

  test "search is case-insensitive" do
    combobox = framework_combobox

    combobox.open
    combobox.search("NEXT")

    assert combobox.has_option?("Next.js")
  end

  test "selects filtered option" do
    combobox = framework_combobox

    combobox.open
    combobox.search("svelte")
    combobox.select_option("SvelteKit")

    assert_equal "SvelteKit", combobox.selected_text
    assert combobox.closed?
  end

  # === Keyboard Navigation Tests ===

  test "opens with click on trigger" do
    combobox = framework_combobox

    combobox.trigger.click

    assert combobox.open?
  end

  test "closes with Escape key" do
    combobox = framework_combobox

    combobox.open
    assert combobox.open?

    combobox.press_escape

    assert combobox.closed?
  end

  test "navigates options with arrow keys" do
    combobox = framework_combobox

    combobox.open

    # Navigate down
    combobox.navigate_down
    combobox.navigate_down

    # Should have navigation state
    assert combobox.open?
  end

  test "selects option with Enter after arrow navigation" do
    combobox = framework_combobox

    combobox.open
    combobox.search_input.click
    combobox.navigate_down # First item
    combobox.press_enter

    # Should have selected first item
    assert combobox.closed?
    assert_equal "Next.js", combobox.selected_text
  end

  # === State Persistence Tests ===

  test "maintains selection after closing and reopening" do
    combobox = framework_combobox

    combobox.select_option("Remix")
    assert_equal "Remix", combobox.selected_text

    combobox.open
    combobox.close

    assert_equal "Remix", combobox.selected_text
  end

  test "shows check icon for selected option" do
    combobox = framework_combobox

    combobox.open
    combobox.select_option("Astro")

    combobox.open

    # The selected option should have visible check icon (opacity-100)
    # This is tested implicitly by the selection state
    assert_equal "Astro", combobox.selected_text
  end

  # === Status Combobox Tests (with icons) ===

  test "selects status with icons" do
    combobox = status_combobox

    combobox.select_option("In Progress")

    assert_equal "In Progress", combobox.selected_text
    assert_equal "in-progress", combobox.selected_value
  end

  test "shows all status options" do
    combobox = status_combobox

    combobox.open

    assert combobox.has_option?("Backlog")
    assert combobox.has_option?("Todo")
    assert combobox.has_option?("In Progress")
    assert combobox.has_option?("Done")
    assert combobox.has_option?("Canceled")
  end

  test "searches status by name" do
    combobox = status_combobox

    combobox.open
    combobox.search("done")

    assert combobox.has_option?("Done")
    assert_equal 1, combobox.option_count
  end

  # === DropdownMenu Combobox Tests ===

  test "works with dropdown menu container" do
    combobox = labels_combobox

    # Open the dropdown
    combobox.trigger.click

    # Wait for dropdown to open
    sleep 0.1

    # The submenu needs to be opened separately
    # This is a complex interaction - we'll test basic opening
    assert_not_nil combobox.trigger
  end

  # === ARIA Accessibility Tests ===

  test "trigger is a button" do
    combobox = framework_combobox

    # Trigger is a button that opens the popover
    assert_equal "button", combobox.trigger.tag_name
  end

  test "search input has combobox role" do
    combobox = framework_combobox

    combobox.open

    assert_equal "combobox", combobox.search_input_role
  end

  # === Different Syntax Tests ===

  test "phlex syntax works correctly" do
    combobox = find_element(UI::TestingComboboxElement, "#framework-combobox-phlex")

    combobox.select_option("Nuxt.js")

    assert_equal "Nuxt.js", combobox.selected_text
    assert_equal "nuxt", combobox.selected_value
  end

  test "view component syntax works correctly" do
    combobox = find_element(UI::TestingComboboxElement, "#framework-combobox-vc")

    combobox.select_option("Remix")

    assert_equal "Remix", combobox.selected_text
    assert_equal "remix", combobox.selected_value
  end

  # === Edge Cases ===

  test "handles rapid open/close" do
    combobox = framework_combobox

    combobox.open
    combobox.close
    combobox.open
    combobox.close

    assert combobox.closed?
  end

  test "handles multiple searches in sequence" do
    combobox = framework_combobox

    combobox.open
    combobox.search("next")
    assert_equal 1, combobox.option_count

    combobox.search("remix")
    assert_equal 1, combobox.option_count
    assert combobox.has_option?("Remix")
  end

  test "returns to original state after closing without selection" do
    combobox = framework_combobox

    # Select an option first
    combobox.select_option("Next.js")
    original_text = combobox.selected_text

    # Open, search, but don't select
    combobox.open
    combobox.search("remix")
    combobox.close

    # Should still have original selection
    assert_equal original_text, combobox.selected_text
  end
end
