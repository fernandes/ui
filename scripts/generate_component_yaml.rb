#!/usr/bin/env ruby
# frozen_string_literal: true

# Script to generate YAML documentation for UI components
#
# This script parses YARD-style annotations from Ruby behavior modules
# and JSDoc annotations from Stimulus controllers to generate structured
# YAML documentation.
#
# Usage: ruby scripts/generate_component_yaml.rb [component_name]
# Example: ruby scripts/generate_component_yaml.rb select
#          ruby scripts/generate_component_yaml.rb --all
#
# See docs/components/ANNOTATIONS.md for annotation reference.

require "yaml"
require "fileutils"

class ComponentYamlGenerator
  COMPONENTS_PATH = File.expand_path("../app/components/ui", __dir__)
  BEHAVIORS_PATH = File.expand_path("../app/behaviors/ui", __dir__)
  CONTROLLERS_PATH = File.expand_path("../app/javascript/ui/controllers", __dir__)
  OUTPUT_PATH = File.expand_path("../docs/components", __dir__)

  # Components that should be skipped (helper components, not main ones)
  SKIP_COMPONENTS = %w[shared_as_child].freeze

  # Map of components to their W3C ARIA patterns
  ARIA_PATTERNS = {
    "accordion" => {pattern: "Accordion", url: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"},
    "alert" => {pattern: "Alert", url: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/"},
    "alert_dialog" => {pattern: "Alert Dialog", url: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/"},
    "breadcrumb" => {pattern: "Breadcrumb", url: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"},
    "button" => {pattern: "Button", url: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"},
    "carousel" => {pattern: "Carousel", url: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"},
    "checkbox" => {pattern: "Checkbox", url: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"},
    "collapsible" => {pattern: "Disclosure", url: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"},
    "combobox" => {pattern: "Combobox", url: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"},
    "command" => {pattern: "Listbox", url: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"},
    "context_menu" => {pattern: "Menu", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menu/"},
    "dialog" => {pattern: "Dialog (Modal)", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"},
    "drawer" => {pattern: "Dialog (Modal)", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"},
    "dropdown_menu" => {pattern: "Menu Button", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"},
    "hover_card" => {pattern: "Tooltip", url: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"},
    "menubar" => {pattern: "Menu Bar", url: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"},
    "navigation_menu" => {pattern: "Navigation", url: "https://www.w3.org/WAI/ARIA/apg/patterns/navigation/"},
    "popover" => {pattern: "Dialog (Non-modal)", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-non-modal/"},
    "progress" => {pattern: "Meter", url: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/"},
    "radio_button" => {pattern: "Radio Group", url: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"},
    "scroll_area" => {pattern: "Scrollable Region", url: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/"},
    "select" => {pattern: "Listbox", url: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"},
    "sheet" => {pattern: "Dialog (Modal)", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"},
    "slider" => {pattern: "Slider", url: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/"},
    "switch" => {pattern: "Switch", url: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/"},
    "tabs" => {pattern: "Tabs", url: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"},
    "toast" => {pattern: "Alert", url: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/"},
    "toggle" => {pattern: "Button", url: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"},
    "toggle_group" => {pattern: "Radio Group", url: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"},
    "tooltip" => {pattern: "Tooltip", url: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"}
  }.freeze

  # Component categories
  CATEGORIES = {
    # Layout
    "aspect_ratio" => "layout",
    "card" => "layout",
    "resizable" => "layout",
    "scroll_area" => "layout",
    "separator" => "layout",

    # Forms
    "button" => "forms",
    "calendar" => "forms",
    "checkbox" => "forms",
    "combobox" => "forms",
    "date_picker" => "forms",
    "field" => "forms",
    "input" => "forms",
    "input_group" => "forms",
    "input_otp" => "forms",
    "label" => "forms",
    "radio_button" => "forms",
    "select" => "forms",
    "slider" => "forms",
    "switch" => "forms",
    "textarea" => "forms",
    "toggle" => "forms",
    "toggle_group" => "forms",

    # Navigation
    "breadcrumb" => "navigation",
    "menubar" => "navigation",
    "navigation_menu" => "navigation",
    "pagination" => "navigation",
    "sidebar" => "navigation",
    "tabs" => "navigation",

    # Feedback
    "alert" => "feedback",
    "alert_dialog" => "feedback",
    "progress" => "feedback",
    "skeleton" => "feedback",
    "sonner" => "feedback",
    "spinner" => "feedback",
    "toast" => "feedback",

    # Overlay
    "context_menu" => "overlay",
    "dialog" => "overlay",
    "drawer" => "overlay",
    "dropdown_menu" => "overlay",
    "hover_card" => "overlay",
    "popover" => "overlay",
    "sheet" => "overlay",
    "tooltip" => "overlay",

    # Data Display
    "accordion" => "data-display",
    "avatar" => "data-display",
    "badge" => "data-display",
    "carousel" => "data-display",
    "collapsible" => "data-display",
    "command" => "data-display",
    "empty" => "data-display",
    "item" => "data-display",
    "kbd" => "data-display",
    "table" => "data-display",

    # Typography
    "blockquote" => "typography",
    "h1" => "typography",
    "h2" => "typography",
    "h3" => "typography",
    "h4" => "typography",
    "inline_code" => "typography",
    "large" => "typography",
    "lead" => "typography",
    "list" => "typography",
    "muted" => "typography",
    "p" => "typography",
    "small" => "typography",
    "typography" => "typography"
  }.freeze

  def initialize
    @components = {}
  end

  def run(component_name = nil)
    FileUtils.mkdir_p(OUTPUT_PATH)

    if component_name == "--all"
      generate_all
    elsif component_name
      generate_single(component_name)
    else
      puts "Usage: ruby scripts/generate_component_yaml.rb [component_name|--all]"
      puts "Example: ruby scripts/generate_component_yaml.rb select"
      puts "         ruby scripts/generate_component_yaml.rb --all"
      exit 1
    end
  end

  def generate_all
    discover_components
    @components.each_key do |name|
      generate_yaml(name)
    end
    puts "Generated YAML files for #{@components.size} components in #{OUTPUT_PATH}"
  end

  def generate_single(component_name)
    discover_components
    unless @components.key?(component_name)
      puts "Component '#{component_name}' not found. Available components:"
      puts @components.keys.sort.join(", ")
      exit 1
    end
    generate_yaml(component_name)
    puts "Generated #{OUTPUT_PATH}/#{component_name}.yml"
  end

  private

  def discover_components
    # Find all main component files (those without underscore prefix after ui/)
    Dir.glob("#{COMPONENTS_PATH}/*.rb").each do |file|
      basename = File.basename(file, ".rb")
      next if SKIP_COMPONENTS.include?(basename)

      # Determine the main component name (e.g., "select" from "select_trigger")
      main_component = extract_main_component(basename)

      @components[main_component] ||= {parts: [], files: []}
      @components[main_component][:files] << file
      @components[main_component][:parts] << basename
    end

    # Clean up: only keep components that have the main file
    @components.delete_if do |name, data|
      !data[:parts].include?(name)
    end
  end

  def extract_main_component(filename)
    # Common suffixes for sub-components
    suffixes = %w[
      _action _cancel _close _content _description _ellipsis _empty
      _fallback _footer _group _handle _header _image _indicator
      _input _item _label _link _list _next _overlay _page
      _previous _radio_group _radio_item _scroll_down_button
      _scroll_up_button _separator _shortcut _sub _sub_content
      _sub_trigger _text _title _trigger _viewport _checkbox_item
    ]

    result = filename
    suffixes.each do |suffix|
      result = result.sub(/#{Regexp.escape(suffix)}$/, "") if result.end_with?(suffix)
    end
    result
  end

  def generate_yaml(component_name)
    data = @components[component_name]

    # First, try to parse YARD annotations from behavior file
    annotations = parse_yard_annotations(component_name)

    yaml_content = {
      "name" => annotations[:name] || format_name(component_name),
      "slug" => component_name,
      "category" => annotations[:category] || CATEGORIES[component_name] || "other",
      "description" => annotations[:description] || extract_description(component_name, data),
      "anatomy" => annotations[:anatomy].any? ? annotations[:anatomy] : build_anatomy(component_name, data),
      "features" => annotations[:features].any? ? annotations[:features] : extract_features(component_name, data),
      "api" => build_api(component_name, data),
      "accessibility" => build_accessibility_from_annotations(annotations, component_name),
      "keyboard" => annotations[:keyboard].any? ? annotations[:keyboard] : build_keyboard(component_name),
      "javascript" => build_javascript_from_annotations(component_name),
      "related" => annotations[:related].any? ? annotations[:related] : build_related(component_name)
    }

    # Remove empty sections
    yaml_content.delete_if { |_, v| v.nil? || (v.respond_to?(:empty?) && v.empty?) }

    output_file = File.join(OUTPUT_PATH, "#{component_name}.yml")
    File.write(output_file, yaml_content.to_yaml)
  end

  # Parse YARD-style annotations from behavior module
  def parse_yard_annotations(component_name)
    behavior_file = File.join(BEHAVIORS_PATH, "#{component_name}_behavior.rb")
    annotations = {
      name: nil,
      description: nil,
      category: nil,
      anatomy: [],
      features: [],
      data_attributes: [],
      css_variables: [],
      aria_pattern: nil,
      aria_reference: nil,
      aria_attributes: [],
      keyboard: [],
      related: []
    }

    return annotations unless File.exist?(behavior_file)

    content = File.read(behavior_file)

    # Parse @ui_component Name
    if content =~ /@ui_component\s+(.+)$/
      annotations[:name] = $1.strip
    end

    # Parse @ui_description
    if content =~ /@ui_description\s+(.+)$/
      annotations[:description] = $1.strip
    end

    # Parse @ui_category
    if content =~ /@ui_category\s+(\w+)/
      annotations[:category] = $1.strip
    end

    # Parse @ui_anatomy Name - Description (required)
    content.scan(/@ui_anatomy\s+([^-]+)-\s*(.+?)(?:\s*\(required\))?$/) do |name, desc|
      is_required = $&.include?("(required)")
      annotations[:anatomy] << {
        "name" => name.strip,
        "description" => desc.strip.sub(/\s*\(required\)$/, ""),
        "required" => is_required
      }
    end

    # Parse @ui_feature Description
    content.scan(/@ui_feature\s+(.+)$/) do |feature|
      annotations[:features] << feature[0].strip
    end

    # Parse @ui_data_attr name ["val1", "val2"] Description
    content.scan(/@ui_data_attr\s+([\w-]+)\s+\[([^\]]*)\]\s*(.+)$/) do |name, values, desc|
      vals = values.split(",").map { |v| v.strip.gsub(/["']/, "") }.reject(&:empty?)
      annotations[:data_attributes] << {
        "name" => name.strip,
        "values" => vals,
        "description" => desc.strip
      }
    end

    # Parse @ui_css_var --name Description
    content.scan(/@ui_css_var\s+(--[\w-]+)\s+(.+)$/) do |name, desc|
      annotations[:css_variables] << {
        "name" => name.strip,
        "description" => desc.strip
      }
    end

    # Parse @ui_aria_pattern
    if content =~ /@ui_aria_pattern\s+(.+)$/
      annotations[:aria_pattern] = $1.strip
    end

    # Parse @ui_aria_reference
    if content =~ /@ui_aria_reference\s+(.+)$/
      annotations[:aria_reference] = $1.strip
    end

    # Parse @ui_aria_attr
    content.scan(/@ui_aria_attr\s+(.+)$/) do |attr|
      annotations[:aria_attributes] << attr[0].strip
    end

    # Parse @ui_keyboard Key Description
    content.scan(/@ui_keyboard\s+(\S+)\s+(.+)$/) do |key, desc|
      annotations[:keyboard] << {
        "key" => key.strip,
        "description" => desc.strip
      }
    end

    # Parse @ui_related
    content.scan(/@ui_related\s+(\w+)/) do |related|
      annotations[:related] << related[0].strip
    end

    annotations
  end

  def build_accessibility_from_annotations(annotations, component_name)
    # Use annotations if available, otherwise fall back to defaults
    aria_info = ARIA_PATTERNS[component_name]

    if annotations[:aria_pattern] || aria_info
      {
        "aria_pattern" => annotations[:aria_pattern] || aria_info&.dig(:pattern),
        "w3c_reference" => annotations[:aria_reference] || aria_info&.dig(:url),
        "description" => "Implements the WAI-ARIA #{annotations[:aria_pattern] || aria_info&.dig(:pattern)} pattern with proper roles, states, and keyboard navigation.",
        "aria_attributes" => annotations[:aria_attributes].any? ? annotations[:aria_attributes] : extract_aria_attributes(component_name)
      }
    end
  end

  def build_javascript_from_annotations(component_name)
    controller_file = find_controller(component_name)
    return nil unless controller_file && File.exist?(controller_file)

    content = File.read(controller_file)
    js_annotations = parse_jsdoc_annotations(content)

    {
      "controller" => "ui--#{component_name.tr("_", "-")}",
      "targets" => js_annotations[:targets].any? ? js_annotations[:targets] : extract_targets(content),
      "values" => js_annotations[:values].any? ? js_annotations[:values] : extract_values(content),
      "actions" => js_annotations[:actions].any? ? js_annotations[:actions] : extract_actions(content),
      "events" => js_annotations[:events].any? ? js_annotations[:events] : extract_events(component_name, content)
    }
  end

  # Parse JSDoc annotations from Stimulus controller
  def parse_jsdoc_annotations(content)
    annotations = {
      targets: [],
      values: [],
      actions: [],
      events: []
    }

    # Parse @target name - Description
    content.scan(/@target\s+(\w+)\s*-?\s*(.*)$/) do |name, desc|
      target = {"name" => name.strip}
      target["description"] = desc.strip unless desc.strip.empty?
      annotations[:targets] << target
    end

    # Parse @value name {Type} Description
    content.scan(/@value\s+(\w+)\s*\{(\w+)\}\s*(.*)$/) do |name, type, desc|
      annotations[:values] << {
        "name" => name.strip,
        "type" => type.strip,
        "description" => desc.strip
      }
    end

    # Parse @fires event-name - Description
    content.scan(/@fires\s+([\w:-]+)\s*-?\s*(.*)$/) do |name, desc|
      annotations[:events] << {
        "name" => name.strip,
        "description" => desc.strip
      }
    end

    # Parse @action methods - look for /** ... @action ... */ before method definition
    content.scan(/\/\*\*[^*]*\*[^\/]*@action[^*]*\*\/\s*(\w+)\s*\([^)]*\)/) do |method_name|
      annotations[:actions] << method_name[0]
    end

    annotations
  end

  def format_name(component_name)
    component_name.split("_").map(&:capitalize).join(" ").gsub("Otp", "OTP")
  end

  def extract_description(component_name, data)
    main_file = data[:files].find { |f| File.basename(f, ".rb") == component_name }
    return "" unless main_file

    content = File.read(main_file)
    # Extract first comment block after frozen_string_literal
    if content =~ /# frozen_string_literal:\s*true\s+#\s*(.+?)(?:\n\s*#\s*\n|\nclass)/m
      lines = $1.split("\n").map { |l| l.sub(/^\s*#\s?/, "").strip }
      # Get first paragraph (up to empty line or @example)
      description_lines = []
      lines.each do |line|
        break if line.empty? || line.start_with?("@")
        description_lines << line
      end
      description_lines.join(" ").strip
    else
      ""
    end
  end

  def build_anatomy(component_name, data)
    anatomy = []

    # Sort parts: main component first, then alphabetically
    sorted_parts = data[:parts].sort_by do |part|
      (part == component_name) ? "0" : part
    end

    sorted_parts.each do |part|
      part_file = data[:files].find { |f| File.basename(f, ".rb") == part }
      next unless part_file

      content = File.read(part_file)
      description = extract_part_description(content)

      # Determine if required (main component and trigger/content are usually required)
      is_required = part == component_name ||
        part.end_with?("_trigger") ||
        part.end_with?("_content")

      anatomy << {
        "name" => format_part_name(part, component_name),
        "description" => description,
        "required" => is_required
      }
    end

    anatomy
  end

  def format_part_name(part, component_name)
    if part == component_name
      format_name(component_name)
    else
      # Remove component prefix and format
      suffix = part.sub("#{component_name}_", "")
      format_name(suffix)
    end
  end

  def extract_part_description(content)
    # Look for description in YARD-style comments after the component name line
    if content =~ /# frozen_string_literal:\s*true\s+#[^\n]+\n\s*#\s*\n\s*#\s*([^@\n]+)/m
      desc = $1.strip.sub(/^#\s*/, "")
      # Clean up any trailing comment markers
      desc.gsub(/\s*#.*$/, "").strip
    else
      ""
    end
  end

  def extract_features(component_name, data)
    features = []

    # Read behavior file for features
    behavior_file = File.join(BEHAVIORS_PATH, "#{component_name}_behavior.rb")
    if File.exist?(behavior_file)
      content = File.read(behavior_file)

      # Extract features from common patterns
      features << "Keyboard navigation" if content.include?("keydown") || content.include?("keyboard")
      features << "Custom styling with Tailwind classes" if content.include?("TailwindMerge")
      features << "Form integration" if content.include?("hidden_input") || content.include?("form")
      features << "Disabled state support" if content.include?("disabled")
      features << "ARIA attributes for accessibility" if content.include?("aria-")
    end

    # Check controller for more features
    controller_file = find_controller(component_name)
    if controller_file && File.exist?(controller_file)
      content = File.read(controller_file)

      features << "Keyboard navigation with arrow keys" if content.include?("ArrowDown") || content.include?("ArrowUp")
      features << "Type-ahead search functionality" if content.include?("typeahead") || content.include?("search")
      features << "Click outside to close" if content.include?("clickOutside") || content.include?("handleClickOutside")
      features << "Focus management" if content.include?("focus") && content.include?("trap")
      features << "Animation support" if content.include?("animate") || content.include?("transition")
    end

    features.uniq
  end

  def build_api(component_name, data)
    api = {}

    # Get annotations from main behavior for data_attributes and css_variables
    main_annotations = parse_yard_annotations(component_name)

    data[:parts].sort.each do |part|
      part_file = data[:files].find { |f| File.basename(f, ".rb") == part }
      next unless part_file

      content = File.read(part_file)
      api_name = format_part_name(part, component_name)

      # Parse part-specific annotations from its behavior file
      part_annotations = parse_part_annotations(part)

      api[api_name] = {
        "description" => part_annotations[:description] || extract_part_description(content),
        "parameters" => extract_parameters(content),
        "data_attributes" => if part_annotations[:data_attributes].any?
                               part_annotations[:data_attributes]
                             else
                               ((part == component_name) ? main_annotations[:data_attributes] : [])
                             end,
        "css_variables" => if part_annotations[:css_variables].any?
                             part_annotations[:css_variables]
                           else
                             ((part == component_name) ? main_annotations[:css_variables] : [])
                           end
      }
    end

    api
  end

  # Parse annotations specific to a component part (from its behavior file)
  def parse_part_annotations(part_name)
    behavior_file = File.join(BEHAVIORS_PATH, "#{part_name}_behavior.rb")
    annotations = {
      description: nil,
      data_attributes: [],
      css_variables: []
    }

    return annotations unless File.exist?(behavior_file)

    content = File.read(behavior_file)

    # Parse description from top comment (skip @ui_ annotations)
    if content =~ /#\s*UI::\w+Behavior\s*\n#\s*\n#\s*([^@\n].+?)(?:\n#\s*\n|$)/m
      desc = $1.strip
      # Only use if it's not an annotation
      annotations[:description] = desc unless desc.start_with?("@")
    end

    # Parse @ui_data_attr for this specific part
    content.scan(/@ui_data_attr\s+([\w-]+)\s+\[([^\]]*)\]\s*(.+)$/) do |name, values, desc|
      vals = values.split(",").map { |v| v.strip.gsub(/["']/, "") }.reject(&:empty?)
      annotations[:data_attributes] << {
        "name" => name.strip,
        "values" => vals,
        "description" => desc.strip
      }
    end

    # Parse @ui_css_var for this specific part
    content.scan(/@ui_css_var\s+(--[\w-]+)\s+(.+)$/) do |name, desc|
      annotations[:css_variables] << {
        "name" => name.strip,
        "description" => desc.strip
      }
    end

    annotations
  end

  def extract_parameters(content)
    params = []

    # Find initialize method and extract parameters
    if content =~ /def initialize\(([^)]+)\)/m
      param_string = $1

      # Parse each parameter
      param_string.split(",").each do |param|
        param = param.strip
        next if param.empty?

        # Handle keyword arguments with defaults
        if param =~ /(\w+):\s*(.+)$/
          name = $1
          default = $2.strip

          # Skip common internal params
          next if %w[classes attributes].include?(name)

          type = infer_type(default)

          params << {
            "name" => name,
            "type" => type,
            "default" => format_default(default),
            "description" => generate_param_description(name)
          }
        elsif /^\*\*(\w+)/.match?(param)
          # Skip **kwargs
          next
        elsif param =~ /^(\w+)$/
          # Required positional argument
          name = $1
          next if %w[classes attributes].include?(name)

          params << {
            "name" => name,
            "type" => "String",
            "required" => true,
            "description" => generate_param_description(name)
          }
        end
      end
    end

    params
  end

  def infer_type(default)
    case default
    when "true", "false"
      "Boolean"
    when /^\d+$/
      "Integer"
    when /^\d+\.\d+$/
      "Float"
    when /^["'].*["']$/
      "String"
    when "nil"
      "String"
    when /^:\w+$/
      "Symbol"
    when /^\[/
      "Array"
    when /^\{/
      "Hash"
    else
      "String"
    end
  end

  def format_default(default)
    default.gsub(/^["']|["']$/, "").tr('"', "'")
  end

  def generate_param_description(name)
    descriptions = {
      "value" => "The current value",
      "disabled" => "Whether the element is disabled",
      "as_child" => "When true, yields attributes to block instead of rendering wrapper",
      "placeholder" => "Placeholder text when no value is selected",
      "variant" => "Visual style variant",
      "size" => "Size of the element",
      "id" => "HTML id attribute",
      "name" => "Form field name",
      "checked" => "Whether the element is checked",
      "open" => "Whether the element is open",
      "default_open" => "Initial open state",
      "orientation" => "Orientation (horizontal or vertical)",
      "side" => "Which side to display on",
      "align" => "Alignment within container"
    }
    descriptions[name] || "The #{name.tr("_", " ")}"
  end

  def extract_data_attributes(part)
    behavior_file = File.join(BEHAVIORS_PATH, "#{part}_behavior.rb")
    return [] unless File.exist?(behavior_file)

    content = File.read(behavior_file)
    attrs = []

    # Skip generic/internal attributes
    skip_attrs = %w[attrs attributes value action target controller slot]

    # Find data attributes in the behavior - look for explicit data attribute definitions
    # Pattern: "data-something" or data_something or :data => { something: }
    content.scan(/["']data-(\w+)["']|:\s*["']?data-(\w+)["']?/) do |match1, match2|
      attr_name = (match1 || match2).tr("_", "-")
      next if attr_name.start_with?("ui--") # Skip stimulus targets/actions
      next if skip_attrs.include?(attr_name)

      attrs << {
        "name" => "data-#{attr_name}",
        "values" => infer_data_values(attr_name),
        "description" => generate_data_attr_description(attr_name)
      }
    end

    # Look for data: { something: } hashes
    content.scan(/data:\s*\{[^}]*(\w+):\s*["']?(\w+)["']?/) do |key, _value|
      next if skip_attrs.include?(key)
      next if key.start_with?("ui__") # Skip stimulus

      attr_name = key.tr("_", "-")
      next if attrs.any? { |a| a["name"] == "data-#{attr_name}" }

      attrs << {
        "name" => "data-#{attr_name}",
        "values" => infer_data_values(attr_name),
        "description" => generate_data_attr_description(attr_name)
      }
    end

    # Find common state attributes from dataset assignments
    if /dataset\.state\s*=|data.*state.*:/.match?(content)
      unless attrs.any? { |a| a["name"] == "data-state" }
        attrs << {
          "name" => "data-state",
          "values" => %w[open closed],
          "description" => "Current state of the element"
        }
      end
    end

    attrs.uniq { |a| a["name"] }
  end

  def infer_data_values(attr_name)
    case attr_name
    when "state"
      %w[open closed]
    when "side"
      %w[top bottom left right]
    when "align"
      %w[start center end]
    when "orientation"
      %w[horizontal vertical]
    when "disabled"
      ["true"]
    when "highlighted"
      ["true"]
    when "selected"
      ["true"]
    else
      []
    end
  end

  def generate_data_attr_description(attr_name)
    descriptions = {
      "state" => "Current open/closed state",
      "side" => "Which side the element appears on",
      "align" => "Alignment of the element",
      "orientation" => "Layout orientation",
      "disabled" => "Whether element is disabled",
      "highlighted" => "Whether element is highlighted/focused",
      "selected" => "Whether element is selected",
      "slot" => "Slot identifier for component parts"
    }
    descriptions[attr_name] || "The #{attr_name.tr("-", " ")} attribute"
  end

  def extract_css_variables(part)
    behavior_file = File.join(BEHAVIORS_PATH, "#{part}_behavior.rb")
    return [] unless File.exist?(behavior_file)

    content = File.read(behavior_file)
    vars = []

    # Find CSS variable references - must have at least 2 parts (--something-else)
    content.scan(/--\w+-[\w-]+/) do |match|
      vars << {
        "name" => match,
        "description" => generate_css_var_description(match)
      }
    end

    # Also check controller file for CSS variables
    controller_file = find_controller(part.sub(/_[^_]+$/, "")) # Get main component name
    if controller_file && File.exist?(controller_file)
      controller_content = File.read(controller_file)
      controller_content.scan(/--\w+-[\w-]+/) do |match|
        next if vars.any? { |v| v["name"] == match }
        vars << {
          "name" => match,
          "description" => generate_css_var_description(match)
        }
      end
    end

    vars.uniq { |v| v["name"] }
  end

  def generate_css_var_description(var_name)
    clean_name = var_name.sub(/^--/, "").tr("-", " ")
    "The #{clean_name}"
  end

  def build_accessibility(component_name)
    aria_info = ARIA_PATTERNS[component_name]
    return nil unless aria_info

    {
      "aria_pattern" => aria_info[:pattern],
      "w3c_reference" => aria_info[:url],
      "description" => "Implements the WAI-ARIA #{aria_info[:pattern]} pattern with proper roles, states, and keyboard navigation.",
      "aria_attributes" => extract_aria_attributes(component_name)
    }
  end

  def extract_aria_attributes(component_name)
    attrs = []
    behavior_file = File.join(BEHAVIORS_PATH, "#{component_name}_behavior.rb")

    if File.exist?(behavior_file)
      content = File.read(behavior_file)

      # Find aria attributes
      content.scan(/["']aria-(\w+)["']/) do |match|
        attrs << "aria-#{match[0]}"
      end

      # Find role attributes
      content.scan(/role:\s*["'](\w+)["']/) do |match|
        attrs << "role=\"#{match[0]}\""
      end
    end

    attrs.uniq
  end

  def build_keyboard(component_name)
    controller_file = find_controller(component_name)
    return [] unless controller_file && File.exist?(controller_file)

    content = File.read(controller_file)
    keys = []

    keyboard_mappings = {
      "Enter" => "Activates the focused element",
      "Space" => "Activates the focused element",
      "Escape" => "Closes the component",
      "ArrowDown" => "Moves focus to next item",
      "ArrowUp" => "Moves focus to previous item",
      "ArrowLeft" => "Moves focus left or decreases value",
      "ArrowRight" => "Moves focus right or increases value",
      "Home" => "Moves focus to first item",
      "End" => "Moves focus to last item",
      "Tab" => "Moves focus to next focusable element",
      "PageUp" => "Moves focus up by page",
      "PageDown" => "Moves focus down by page"
    }

    keyboard_mappings.each do |key, description|
      if content.include?(key)
        keys << {"key" => key, "description" => description}
      end
    end

    keys
  end

  def build_javascript(component_name)
    controller_file = find_controller(component_name)
    return nil unless controller_file && File.exist?(controller_file)

    content = File.read(controller_file)

    {
      "controller" => "ui--#{component_name.tr("_", "-")}",
      "targets" => extract_targets(content),
      "values" => extract_values(content),
      "actions" => extract_actions(content),
      "events" => extract_events(component_name, content)
    }
  end

  def find_controller(component_name)
    # Try different naming patterns
    patterns = [
      "#{component_name}_controller.js",
      "#{component_name.tr("_", "-")}_controller.js",
      "#{component_name.tr("_", "")}_controller.js"
    ]

    patterns.each do |pattern|
      path = File.join(CONTROLLERS_PATH, pattern)
      return path if File.exist?(path)
    end

    nil
  end

  def extract_targets(content)
    if content =~ /static targets\s*=\s*\[([^\]]+)\]/m
      $1.scan(/"(\w+)"/).flatten
    else
      []
    end
  end

  def extract_values(content)
    values = []

    if content =~ /static values\s*=\s*\{([^}]+)\}/m
      value_block = $1

      # Parse each value definition - handle both { type: X } and simple Type
      value_block.scan(/(\w+):\s*\{\s*type:\s*(\w+)/) do |name, type|
        values << {
          "name" => name,
          "type" => type.capitalize,
          "description" => generate_value_description(name)
        }
      end

      # Also handle simple format: name: Type
      value_block.scan(/(\w+):\s*(\w+)(?:\s*[,}])/) do |name, type|
        next if name == "type" || name == "default" # Skip nested properties
        next if values.any? { |v| v["name"] == name } # Skip if already added
        values << {
          "name" => name,
          "type" => type.capitalize,
          "description" => generate_value_description(name)
        }
      end
    end

    values
  end

  def generate_value_description(name)
    descriptions = {
      "open" => "Controls open state",
      "value" => "Current selected value",
      "disabled" => "Whether component is disabled",
      "orientation" => "Layout orientation"
    }
    descriptions[name] || "The #{name.tr("_", " ")}"
  end

  def extract_actions(content)
    actions = []

    # JavaScript reserved words and control structures to skip
    skip_words = %w[
      if else for while switch case break continue return throw try catch finally
      function class extends super new delete typeof instanceof void
      async await yield import export default from as
      true false null undefined this
      connect disconnect constructor
      size apply call bind
    ]

    # Find public methods that look like actions
    content.scan(/^\s+(\w+)\s*\([^)]*\)\s*\{/m) do |match|
      method_name = match[0]

      # Skip reserved words and control structures
      next if skip_words.include?(method_name)

      # Skip private/internal methods
      next if method_name.start_with?("_", "handle", "get", "set", "update", "bound", "render")
      next if method_name.end_with?("Changed", "TargetConnected", "TargetDisconnected")

      # Skip methods that are likely internal
      next if method_name =~ /^(focus|scroll|stop)(?!$)/i && !%w[focus scroll stop].include?(method_name)

      actions << method_name
    end

    actions.uniq
  end

  def extract_events(component_name, content)
    events = []

    # Find dispatchEvent calls
    content.scan(/dispatchEvent\s*\(\s*new\s+CustomEvent\s*\(\s*["']([^"']+)["']/) do |match|
      events << {
        "name" => match[0],
        "description" => "Fired when #{match[0].gsub(/^ui:#{component_name}:/, "").tr(":", " ")}"
      }
    end

    events
  end

  def build_related(component_name)
    # Map of related components
    relations = {
      "select" => %w[combobox dropdown_menu radio_button],
      "combobox" => %w[select command],
      "dialog" => %w[alert_dialog drawer sheet],
      "alert_dialog" => %w[dialog],
      "drawer" => %w[dialog sheet],
      "sheet" => %w[dialog drawer],
      "dropdown_menu" => %w[context_menu menubar select],
      "context_menu" => %w[dropdown_menu menubar],
      "menubar" => %w[dropdown_menu context_menu navigation_menu],
      "navigation_menu" => %w[menubar tabs],
      "tabs" => %w[navigation_menu accordion],
      "accordion" => %w[collapsible tabs],
      "collapsible" => %w[accordion],
      "popover" => %w[tooltip hover_card dropdown_menu],
      "tooltip" => %w[popover hover_card],
      "hover_card" => %w[popover tooltip],
      "checkbox" => %w[switch toggle radio_button],
      "switch" => %w[checkbox toggle],
      "toggle" => %w[checkbox switch toggle_group],
      "toggle_group" => %w[toggle radio_button],
      "radio_button" => %w[toggle_group checkbox select],
      "button" => %w[toggle],
      "input" => %w[textarea field],
      "textarea" => %w[input field],
      "field" => %w[input label],
      "label" => %w[field input],
      "calendar" => %w[date_picker],
      "date_picker" => %w[calendar popover],
      "avatar" => %w[badge],
      "badge" => %w[avatar],
      "card" => %w[dialog],
      "carousel" => %w[scroll_area],
      "scroll_area" => %w[carousel],
      "command" => %w[combobox dialog],
      "progress" => %w[skeleton],
      "skeleton" => %w[progress],
      "alert" => %w[alert_dialog toast],
      "toast" => %w[alert sonner],
      "sonner" => %w[toast]
    }

    relations[component_name] || []
  end
end

# Run the script
if __FILE__ == $0
  generator = ComponentYamlGenerator.new
  generator.run(ARGV[0])
end
