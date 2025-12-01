#!/usr/bin/env ruby
# frozen_string_literal: true

# Script to convert nested module structures to single-level
# Converts: module UI / module SomethingBehavior
# To: module UI::SomethingBehavior

BEHAVIORS_PATH = File.expand_path("../app/behaviors/ui", __dir__)

Dir.glob("#{BEHAVIORS_PATH}/*.rb").each do |file|
  content = File.read(file)
  lines = content.lines

  # Check if this is a nested module structure
  has_module_ui = lines.any? { |l| l.strip == "module UI" }
  next unless has_module_ui

  # Find the inner module name (use multiline flag)
  inner_module_match = content.match(/module UI\n.*?module\s+(\w+Behavior)/m)
  next unless inner_module_match

  behavior_name = inner_module_match[1]
  full_name = "UI::#{behavior_name}"

  puts "Converting #{File.basename(file)} -> module #{full_name}"

  # Simple approach: just do text replacements
  new_content = content.dup

  # 1. Replace "module UI\n" with nothing (remove outer module)
  new_content.sub!(/^module UI\n/, "")

  # 2. Replace "  module SomethingBehavior" with "module UI::SomethingBehavior"
  new_content.sub!(/^(\s*)module #{Regexp.escape(behavior_name)}/) do
    "module #{full_name}"
  end

  # 3. Dedent everything by 2 spaces (the whole content after module UI was removed)
  result_lines = []

  new_content.lines.each do |line|
    # Dedent by 2 spaces (skip frozen_string_literal and require lines)
    if line =~ /^#\s*frozen_string_literal/ || line =~ /^require\s+/ || line.strip.empty?
      result_lines << line
    else
      result_lines << line.sub(/^  /, "")
    end
  end

  # 4. Remove the extra "end" at the very end (was closing module UI)
  # Find and remove the last standalone "end" line
  last_end_index = result_lines.rindex { |l| l.strip == "end" }
  if last_end_index
    result_lines.delete_at(last_end_index)
  end

  # Clean up any trailing whitespace
  while result_lines.last&.strip == ""
    result_lines.pop
  end
  result_lines << "\n" unless result_lines.last&.end_with?("\n")

  File.write(file, result_lines.join)
  puts "  ✓ Done"
end

puts "\nConversion complete!"
