#!/usr/bin/env ruby
# frozen_string_literal: true

# Script to annotate behavior modules with YARD-style documentation from YAML files
#
# Usage: ruby scripts/annotate_behaviors_from_yaml.rb [component_name]
# Example: ruby scripts/annotate_behaviors_from_yaml.rb select
#          ruby scripts/annotate_behaviors_from_yaml.rb --all

require "yaml"
require "fileutils"

class BehaviorAnnotator
  BEHAVIORS_PATH = File.expand_path("../app/behaviors/ui", __dir__)
  YAML_PATH = File.expand_path("../docs/components", __dir__)

  def run(component_name = nil)
    if component_name == "--all"
      annotate_all
    elsif component_name
      annotate_single(component_name)
    else
      puts "Usage: ruby scripts/annotate_behaviors_from_yaml.rb [component_name|--all]"
      puts "Example: ruby scripts/annotate_behaviors_from_yaml.rb dialog"
      puts "         ruby scripts/annotate_behaviors_from_yaml.rb --all"
      exit 1
    end
  end

  def annotate_all
    yaml_files = Dir.glob("#{YAML_PATH}/*.yml").reject { |f| File.basename(f) == "ANNOTATIONS.md" }
    count = 0

    yaml_files.each do |yaml_file|
      component_name = File.basename(yaml_file, ".yml")
      if annotate_component(component_name)
        count += 1
        puts "✓ Annotated #{component_name}"
      end
    end

    puts "\nAnnotated #{count} behavior modules"
  end

  def annotate_single(component_name)
    if annotate_component(component_name)
      puts "✓ Annotated #{component_name}_behavior.rb"
    else
      puts "✗ Could not annotate #{component_name}"
    end
  end

  private

  def annotate_component(component_name)
    yaml_file = File.join(YAML_PATH, "#{component_name}.yml")
    behavior_file = File.join(BEHAVIORS_PATH, "#{component_name}_behavior.rb")

    return false unless File.exist?(yaml_file)
    return false unless File.exist?(behavior_file)

    yaml_data = YAML.load_file(yaml_file)
    behavior_content = File.read(behavior_file)

    # Check if already has annotations
    if behavior_content.include?("@ui_component")
      puts "  Skipping #{component_name} (already annotated)"
      return false
    end

    # Generate annotations block
    annotations = generate_annotations(yaml_data)

    # Insert annotations into behavior file
    new_content = insert_annotations(behavior_content, annotations)

    File.write(behavior_file, new_content)
    true
  end

  def generate_annotations(yaml_data)
    lines = []

    # @ui_component
    lines << "@ui_component #{yaml_data["name"]}" if yaml_data["name"]

    # @ui_description
    if yaml_data["description"] && !yaml_data["description"].empty?
      lines << "@ui_description #{yaml_data["description"]}"
    end

    # @ui_category
    lines << "@ui_category #{yaml_data["category"]}" if yaml_data["category"]

    lines << ""

    # @ui_anatomy
    if yaml_data["anatomy"]&.any?
      yaml_data["anatomy"].each do |part|
        required_text = part["required"] ? " (required)" : ""
        desc = part["description"] || "Component part"
        lines << "@ui_anatomy #{part["name"]} - #{desc}#{required_text}"
      end
      lines << ""
    end

    # @ui_feature
    if yaml_data["features"]&.any?
      yaml_data["features"].each do |feature|
        lines << "@ui_feature #{feature}"
      end
      lines << ""
    end

    # @ui_data_attr from API section (main component)
    main_api = yaml_data.dig("api", yaml_data["name"])
    if main_api
      if main_api["data_attributes"]&.any?
        main_api["data_attributes"].each do |attr|
          values = attr["values"]&.any? ? "[\"#{attr["values"].join('", "')}\"]" : "[]"
          lines << "@ui_data_attr #{attr["name"]} #{values} #{attr["description"]}"
        end
        lines << ""
      end

      # @ui_css_var
      if main_api["css_variables"]&.any?
        main_api["css_variables"].each do |var|
          lines << "@ui_css_var #{var["name"]} #{var["description"]}"
        end
        lines << ""
      end
    end

    # @ui_aria_*
    if yaml_data["accessibility"]
      acc = yaml_data["accessibility"]
      lines << "@ui_aria_pattern #{acc["aria_pattern"]}" if acc["aria_pattern"]
      lines << "@ui_aria_reference #{acc["w3c_reference"]}" if acc["w3c_reference"]

      if acc["aria_attributes"]&.any?
        acc["aria_attributes"].each do |attr|
          lines << "@ui_aria_attr #{attr}"
        end
      end
      lines << ""
    end

    # @ui_keyboard
    if yaml_data["keyboard"]&.any?
      yaml_data["keyboard"].each do |key|
        lines << "@ui_keyboard #{key["key"]} #{key["description"]}"
      end
      lines << ""
    end

    # @ui_related
    if yaml_data["related"]&.any?
      yaml_data["related"].each do |related|
        lines << "@ui_related #{related}"
      end
    end

    # Remove trailing empty lines and format
    lines.pop while lines.last == ""
    lines
  end

  def insert_annotations(content, annotations)
    lines = content.lines

    # Try to find module definition - two patterns:
    # 1. module UI::SomethingBehavior (single line)
    # 2. module UI / module SomethingBehavior (nested)

    module_match = content.match(/^(\s*)module\s+(UI::\w+Behavior)/)

    if module_match
      # Pattern 1: module UI::SomethingBehavior
      indent = module_match[1]
      module_name = module_match[2]
      module_line_index = lines.find_index { |l| l =~ /^\s*module\s+#{Regexp.escape(module_name)}/ }
    else
      # Pattern 2: module UI + module SomethingBehavior (nested)
      nested_match = content.match(/^module UI\s*\n(\s*)module\s+(\w+Behavior)/)
      return content unless nested_match

      indent = nested_match[1]
      module_name = "UI::#{nested_match[2]}"
      # Find the inner module line
      module_line_index = lines.find_index { |l| l =~ /^\s*module\s+#{Regexp.escape(nested_match[2])}/ }
    end

    return content unless module_line_index

    # Check if this is a nested module structure
    is_nested = !module_match

    # Find require statements and module UI line for nested case
    requires = []
    module_ui_line = nil
    module_ui_index = nil

    lines.each_with_index do |line, i|
      break if i >= module_line_index
      next if /frozen_string_literal/.match?(line)
      next if line.strip.empty?
      next if line.strip.start_with?("#")

      if line.strip.start_with?("require")
        requires << line
      elsif line.strip == "module UI"
        module_ui_line = line
        module_ui_index = i
      end
    end

    # Build new content
    new_lines = []

    # Add frozen_string_literal
    new_lines << "# frozen_string_literal: true\n"
    new_lines << "\n"

    # Add require statements
    requires.each { |r| new_lines << r }
    new_lines << "\n" if requires.any?

    if is_nested && module_ui_line
      # For nested structure: module UI + module SomethingBehavior
      new_lines << module_ui_line
      new_lines << "#{indent}# #{module_name}\n"
      new_lines << "#{indent}#\n"

      # Add annotations (with same indent as inner module)
      annotations.each do |ann|
        new_lines << if ann.empty?
          "#{indent}#\n"
        else
          "#{indent}# #{ann}\n"
        end
      end
      new_lines << "#{indent}#\n"

      # Add inner module and rest of file
      new_lines << lines[module_line_index..].join
    else
      # For single-line module definition
      new_lines << "#{indent}# #{module_name}\n"
      new_lines << "#{indent}#\n"

      # Add annotations (with same indent)
      annotations.each do |ann|
        new_lines << if ann.empty?
          "#{indent}#\n"
        else
          "#{indent}# #{ann}\n"
        end
      end
      new_lines << "#{indent}#\n"

      # Add module and rest of file
      new_lines << lines[module_line_index..].join
    end

    new_lines.join
  end
end

# Run the script
if __FILE__ == $0
  annotator = BehaviorAnnotator.new
  annotator.run(ARGV[0])
end
