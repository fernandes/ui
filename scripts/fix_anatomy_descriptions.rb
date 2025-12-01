#!/usr/bin/env ruby
# frozen_string_literal: true

# Script to fix empty anatomy descriptions in behavior files

BEHAVIORS_PATH = File.expand_path("../app/behaviors/ui", __dir__)

# Standard descriptions for common anatomy parts
ANATOMY_DESCRIPTIONS = {
  # Root components (match by full name)
  "Dialog" => "Root container with state management",
  "Drawer" => "Root container with state management",
  "Sheet" => "Root container with state management",
  "Accordion" => "Root container with state management",
  "Alert" => "Root container for alert messages",
  "Alert Dialog" => "Root container with state management",
  "Avatar" => "Root container for avatar",
  "Badge" => "Root container for badge",
  "Breadcrumb" => "Root container for breadcrumb navigation",
  "Button" => "Root button element",
  "Calendar" => "Root container for calendar",
  "Card" => "Root container for card",
  "Carousel" => "Root container with state management",
  "Checkbox" => "Root checkbox element",
  "Collapsible" => "Root container with state management",
  "Command" => "Root container for command palette",
  "Context Menu" => "Root container with state management",
  "Date Picker" => "Root container with state management",
  "Dropdown Menu" => "Root container with state management",
  "Field" => "Root container for form field",
  "Hover Card" => "Root container with state management",
  "Input" => "Root input element",
  "Item" => "Root container for item",
  "Menubar" => "Root container for menu bar",
  "Navigation Menu" => "Root container for navigation",
  "Pagination" => "Root container for pagination",
  "Popover" => "Root container with state management",
  "Progress" => "Root container for progress indicator",
  "Radio Button" => "Root container for radio button",
  "Scroll Area" => "Root container for scroll area",
  "Select" => "Root container with state management",
  "Separator" => "Visual divider element",
  "Sidebar" => "Root container for sidebar",
  "Slider" => "Root container for slider",
  "Switch" => "Root switch element",
  "Table" => "Root container for table",
  "Tabs" => "Root container with state management",
  "Textarea" => "Root textarea element",
  "Toast" => "Root container for toast",
  "Toggle" => "Root toggle element",
  "Toggle Group" => "Root container for toggle group",
  "Tooltip" => "Root container with state management",

  # Triggers and Actions
  "Trigger" => "Button or element that activates the component",
  "Close" => "Button to close/dismiss the component",
  "Cancel" => "Button to cancel and close without action",
  "Action" => "Primary action button",

  # Content containers
  "Content" => "Main content container",
  "Body" => "Main body content area",
  "Viewport" => "Scrollable viewport area",
  "List" => "Container for list items",

  # Structure
  "Header" => "Header section with title and controls",
  "Footer" => "Footer section with actions",
  "Title" => "Title text element",
  "Description" => "Descriptive text element",

  # Overlay components
  "Overlay" => "Background overlay that dims the page",
  "Portal" => "Container rendered outside normal DOM hierarchy",

  # Items
  "Item" => "Individual item element",
  "Group" => "Container for grouping related items",
  "Label" => "Label text for items or groups",
  "Separator" => "Visual divider between sections",

  # Navigation
  "Previous" => "Navigate to previous item",
  "Next" => "Navigate to next item",
  "Indicator" => "Visual indicator of current state",
  "Ellipsis" => "Indicator for truncated items",
  "Link" => "Clickable navigation link",
  "Page" => "Current page indicator",

  # Form elements
  "Input" => "Text input field",
  "Value" => "Display element showing current value",
  "Thumb" => "Draggable thumb element",
  "Track" => "Track element for sliders",

  # Media
  "Image" => "Image element",
  "Fallback" => "Fallback content when primary fails",
  "Media" => "Media content container",

  # Special
  "Handle" => "Draggable handle element",
  "Corner" => "Corner resize handle",
  "Scrollbar" => "Custom scrollbar element",
  "Empty" => "Content shown when no items",
  "Shortcut" => "Keyboard shortcut indicator",
  "Actions" => "Container for action buttons",
  "Caption" => "Caption text element",
  "Cell" => "Table cell element",
  "Head" => "Table header element",
  "Row" => "Table row element"
}.freeze

Dir.glob("#{BEHAVIORS_PATH}/*_behavior.rb").each do |file|
  content = File.read(file)
  next unless content.include?("@ui_anatomy")

  modified = false

  # Match anatomy lines with empty or existing descriptions
  # Pattern: @ui_anatomy Name - [optional description] [(required)]
  # Process line by line to avoid multiline issues
  new_lines = content.lines.map do |line|
    unless line =~ /^(#\s*)@ui_anatomy\s+(\w+(?:\s+\w+)*)\s*-\s*(.*)$/
      next line
    end

    prefix = $1  # The "# " part
    name = $2.strip
    rest = $3.strip

    # Parse rest to extract description and required flag
    required = rest.include?("(required)")
    existing_desc = rest.sub(/\s*\(required\)\s*$/, "").strip

    # Skip if already has a meaningful description (not just the component name repeated)
    if !existing_desc.empty? && existing_desc != "#{name} component part"
      next line  # Return original line unchanged
    end

    # Find description based on the full name first
    desc = ANATOMY_DESCRIPTIONS[name]

    # If no match, try the last word (e.g., "Scroll Up Button" -> "Button")
    unless desc
      name.split.reverse.each do |word|
        if ANATOMY_DESCRIPTIONS[word]
          desc = ANATOMY_DESCRIPTIONS[word]
          break
        end
      end
    end

    # Default description if still not found
    desc ||= "#{name} component part"

    modified = true
    required_text = required ? " (required)" : ""
    "#{prefix}@ui_anatomy #{name} - #{desc}#{required_text}\n"
  end

  new_content = new_lines.join

  if modified && new_content != content
    File.write(file, new_content)
    puts "✓ Fixed #{File.basename(file)}"
  end
end

puts "\nDone!"
