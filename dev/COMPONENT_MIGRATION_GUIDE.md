# Component Migration Guide

**From**: `~/src/ui-rails` (Standalone Rails App with UI Components)
**To**: `~/src/ui` (Rails Engine for UI Components)

This guide documents the process of migrating UI components from the ui-rails application to the UI Rails Engine, ensuring all three component formats (Phlex, ViewComponent, ERB) are properly integrated with visual testing capabilities.

---

## Table of Contents

1. [Understanding the Source Structure](#1-understanding-the-source-structure)
2. [Target Engine Architecture](#2-target-engine-architecture)
3. [Migration Checklist](#3-migration-checklist)
4. [Button Migration Example](#4-button-migration-example)
5. [Testing Strategy](#5-testing-strategy)
6. [Common Pitfalls](#6-common-pitfalls)

---

## 1. Understanding the Source Structure

### 1.1 Source Library Overview (`~/src/ui-rails`)

The ui-rails application is a **standalone Rails application** that provides UI components in **three different formats** to support different developer preferences and existing codebases.

### 1.2 Component Formats

Each component is implemented in three ways, all sharing common behavior:

#### **A. Phlex Components**
- **Location**: `app/views/components/ui/{component_name}/{component_name}.rb`
- **Example**: `app/views/components/ui/button/button.rb`
- **Class Pattern**: `UI::{ComponentName}::{ComponentName}`
- **Base Class**: `Phlex::HTML`
- **Shared Logic**: Includes behavior concern (e.g., `ButtonBehavior`)

```ruby
# app/views/components/ui/button/button.rb
module UI
  module Button
    class Button < Phlex::HTML
      include ::ButtonBehavior

      def initialize(variant: "default", size: "default", **attributes)
        @variant = variant
        @size = size
        @attributes = attributes
      end

      def view_template(&block)
        button(**button_html_attributes.deep_merge(@attributes), &block)
      end
    end
  end
end
```

**Usage in views**:
```ruby
render UI::Button::Button.new(variant: "primary") { "Click me" }
```

#### **B. ViewComponents**
- **Location**: `app/components/ui/{component_name}/{component_name}_component.rb`
- **Example**: `app/components/ui/button/button_component.rb`
- **Class Pattern**: `UI::{ComponentName}::{ComponentName}Component`
- **Base Class**: `ViewComponent::Base`
- **Shared Logic**: Includes behavior concern (e.g., `ButtonBehavior`)

```ruby
# app/components/ui/button/button_component.rb
module UI
  module Button
    class ButtonComponent < ViewComponent::Base
      include ButtonBehavior

      def initialize(variant: "default", size: "default", **attributes)
        @variant = variant
        @size = size
        @attributes = attributes
      end

      def call
        content_tag :button, **button_html_attributes.merge(@attributes) do
          content
        end
      end
    end
  end
end
```

**Usage in views**:
```erb
<%# do...end blocks work without parentheses %>
<%= render UI::Button::ButtonComponent.new(variant: "primary") do %>
  Click me
<% end %>

<%# Inline blocks { } require parentheses: %>
<%= render(UI::Button::ButtonComponent.new(variant: "primary")) { "Click me" } %>
```

#### **C. ERB Partials**
- **Location**: `app/views/ui/_{component_name}.html.erb`
- **Example**: `app/views/ui/_button.html.erb`
- **Shared Logic**: Extends behavior concern using `extend` (not `include`)
- **Sub-partials**: `app/views/ui/{component_name}/_{sub_component}.html.erb`

```erb
<%# app/views/ui/_button.html.erb %>
<%
  content ||= local_assigns.fetch(:content, nil)
  @classes = local_assigns.fetch(:classes, "")
  @attributes = local_assigns.fetch(:attributes, {})
  @variant = local_assigns.fetch(:variant, "default")
  @size = local_assigns.fetch(:size, "default")
  @disabled = local_assigns.fetch(:disabled, nil)
  @type = local_assigns.fetch(:type, "button")

  extend ::ButtonBehavior

  all_attributes = button_html_attributes.deep_merge(@attributes)
-%>
<%= content_tag :button, all_attributes do %>
  <%= content || yield %>
<% end %>
```

**Usage in views**:
```erb
<%= render "ui/button", variant: "primary", content: "Click me" %>
<!-- OR -->
<%= render "ui/button", variant: "primary" do %>
  Click me
<% end %>
```

### 1.3 Shared Behavior Pattern

All three formats share logic through **Ruby concerns** located in `app/models/ui/`:

```ruby
# app/models/ui/button_behavior.rb
module ButtonBehavior
  def button_html_attributes
    {
      class: button_classes,
      type: @type || "button",
      disabled: @disabled ? true : nil
    }.compact
  end

  def button_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      button_base_classes,
      button_variant_classes,
      button_size_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  def button_base_classes
    "inline-flex items-center justify-center ..."
  end

  def button_variant_classes
    case @variant.to_s
    when "default" then "bg-primary text-primary-foreground ..."
    when "destructive" then "bg-destructive text-destructive-foreground ..."
    # ...
    end
  end

  def button_size_classes
    case @size.to_s
    when "default" then "h-9 px-4 py-2"
    when "sm" then "h-8 px-3 text-xs"
    # ...
    end
  end
end
```

**Key Points:**
- ✅ Behavior concerns contain **all styling logic** (Tailwind classes)
- ✅ Phlex/ViewComponent **include** the concern
- ✅ ERB partials **extend** the concern
- ✅ Uses `TailwindMerge::Merger` to handle class conflicts
- ✅ Implements variant system (default, destructive, outline, etc.)
- ✅ Implements size system (sm, default, lg, icon, etc.)

### 1.4 Visual Testing with Lookbook

The source library uses **Lookbook** for component visual testing and documentation.

#### **Lookbook Configuration**
```ruby
# config/initializers/lookbook.rb
if defined?(Lookbook) && Rails.env.development?
  Lookbook.configure do |config|
    config.project_name = "UI Rails Components"
    config.preview_paths = [Rails.root.join("test/components/previews")]
    config.ui_theme = "indigo"
    config.auto_refresh = true
  end
end
```

#### **Preview Structure**

Each component format has its own preview class:

**1. Phlex Preview**
```ruby
# test/components/previews/button_phlex_preview.rb
# @label Button
# @logical_path phlex/button
class ButtonPhlexPreview < Lookbook::Preview
  # @label Default
  # @display bg_color "#f5f5f5"
  # @display padding "2rem"
  def default
    render DefaultExample.new
  end

  # @label Interactive Playground
  # @param variant select { choices: [default, destructive, outline, secondary, ghost, link] }
  # @param size select { choices: [default, sm, lg, icon] }
  # @param disabled toggle
  # @param text text "Button"
  def playground(variant: "default", size: "default", disabled: false, text: "Button")
    render PlaygroundExample.new(variant: variant, size: size, disabled: disabled, text: text)
  end

  class DefaultExample < Phlex::HTML
    def view_template
      render ::UI::Button::Button.new { "Click me" }
    end
  end

  class PlaygroundExample < Phlex::HTML
    def initialize(variant:, size:, disabled:, text:)
      @variant, @size, @disabled, @text = variant, size, disabled, text
    end

    def view_template
      render ::UI::Button::Button.new(variant: @variant, size: @size, disabled: @disabled) { @text }
    end
  end
end
```

**2. ViewComponent Preview**
```ruby
# test/components/previews/button_component_preview.rb
# @label Button
# @logical_path view_component/button
class ButtonComponentPreview < Lookbook::Preview
  # @label Default
  def default
    render_with_template
  end

  # @label Interactive Playground
  # @param variant select { choices: [default, destructive, outline] }
  def playground(variant: "default", size: "default", disabled: false, text: "Button")
    render_with_template(locals: { variant: variant, size: size, disabled: disabled, text: text })
  end
end
```

With corresponding template:
```erb
<!-- test/components/previews/button_component_preview/default.html.erb -->
<%= render ::UI::Button::ButtonComponent.new do %>
  Click me
<% end %>
```

**3. ERB Partial Preview**
```ruby
# test/components/previews/button_partial_preview.rb
# @label Button
# @logical_path erb/button
class ButtonPartialPreview < Lookbook::Preview
  def default
    render_with_template
  end
end
```

With corresponding template:
```erb
<!-- test/components/previews/button_partial_preview/default.html.erb -->
<%= render "ui/button", content: "Click me" %>
```

### 1.5 Documentation Pages

Components have dedicated documentation pages at `app/views/docs/components/{component}.html.erb`:

```erb
<!-- app/views/docs/components/button.html.erb -->
<h1>Button</h1>
<p>Trigger actions and events with button variants</p>

<%= render "documentation/component_example", title: "Default" do %>
  <%= render "documentation/component_preview" do %>
    <%= render "ui/button", content: "Button" %>
  <% end %>

  <%= render "documentation/component_code" do %>
    <%%= render "ui/button", content: "Button" %>
  <% end %>
<% end %>

<!-- More examples: variants, sizes, disabled, loading, etc. -->
```

### 1.6 System Tests (Component Object Model)

For **interactive components** (dropdowns, modals, etc.), the source library uses a **Component Object Model** pattern:

```ruby
# test/system/components/dropdown.rb
module Components
  class Dropdown
    def initialize(page, selector)
      @page = page
      @selector = selector
    end

    def trigger
      @page.find("#{@selector} [data-trigger]")
    end

    def menu
      @page.find("#{@selector} [data-menu]")
    end

    def open
      trigger.click
      wait_for_menu
    end

    def select_item(text)
      menu.find("li", text: text).click
    end

    private

    def wait_for_menu
      @page.has_css?("#{@selector} [data-menu].open", wait: 2)
    end
  end
end
```

**Note**: Simple components like Button typically don't have system tests.

---

## 2. Target Engine Architecture

### 2.1 Engine Overview (`~/src/ui`)

The target is a **Rails Engine** that can be:
- Installed as a Ruby gem
- Used with different asset pipelines (Propshaft, Sprockets)
- Integrated via importmaps or JavaScript bundlers
- Compatible with Rails 6, 7, and 8

### 2.2 Current Engine Structure

```
/Users/fernandes/src/ui/
├── app/
│   ├── assets/
│   │   ├── javascripts/
│   │   │   ├── ui.js              # Generated UMD bundle
│   │   │   └── ui.esm.js          # Generated ESM bundle
│   │   └── stylesheets/ui/
│   │       └── application.css    # CSS variables only
│   │
│   ├── javascript/ui/
│   │   ├── controllers/           # Stimulus controllers
│   │   │   ├── hello_controller.js
│   │   │   └── dropdown_controller.js
│   │   └── index.js
│   │
│   ├── models/ui/                 # ⚠️ Current location (to be changed)
│   │   ├── base.rb
│   │   └── button.rb
│   │
│   ├── components/ui/             # ✅ Target location for components
│   │   └── (to be created)
│   │
│   ├── helpers/                   # ✅ Target location for behaviors
│   │   └── ui/
│   │       └── (to be created)
│   │
│   └── views/ui/                  # ✅ Target location for ERB partials
│       └── (to be created)
│
├── lib/
│   ├── generators/ui/install/
│   ├── ui/
│   │   ├── engine.rb
│   │   └── version.rb
│   └── ui.rb
│
├── test/
│   └── dummy/                     # Test Rails app
│       ├── app/
│       │   ├── views/
│       │   │   ├── importmap/
│       │   │   └── bundled/
│       │   └── assets/
│       │       └── stylesheets/
│       │           └── application.tailwind.css
│       │
│       ├── config/
│       │   ├── routes.rb
│       │   └── initializers/
│       │
│       └── test/
│           └── system/            # System tests location
│
├── ui.gemspec                     # Gem dependencies
├── package.json                   # NPM package config
└── rollup.config.js               # JavaScript bundler
```

### 2.3 Component File Locations in Engine

**IMPORTANT**: Use proper Rails Engine conventions:

| Format | Location | Example |
|--------|----------|---------|
| **Phlex** | `app/components/ui/{component}/` | `app/components/ui/button/button.rb` |
| **ViewComponent** | `app/components/ui/{component}/` | `app/components/ui/button/button_component.rb` |
| **ERB Partials** | `app/views/ui/` | `app/views/ui/_button.html.erb` |
| **Behaviors** | `app/models/ui/` | `app/models/ui/button_behavior.rb` |
| **Stimulus** | `app/javascript/ui/controllers/` | `app/javascript/ui/controllers/button_controller.js` |

### 2.4 Namespacing in Engine

Components should use the `UI::` namespace consistently:

```ruby
# Phlex
module UI
  module Button
    class Button < Phlex::HTML
      # ...
    end
  end
end

# ViewComponent
module UI
  module Button
    class ButtonComponent < ViewComponent::Base
      # ...
    end
  end
end

# Behavior
module UI
  module ButtonBehavior
    # ...
  end
end
```

### 2.5 Dependencies

The engine already has the necessary dependencies:

```ruby
# ui.gemspec
spec.add_dependency "rails", ">= 6.0"
spec.add_development_dependency "phlex-rails", "~> 2.0"
spec.add_development_dependency "view_component", "~> 3.0"
```

**Missing Dependencies to Add:**
- `tailwind_merge` gem for CSS class merging
- `lookbook` gem for visual testing (development only)

---

## 3. Migration Checklist

### 3.1 Pre-Migration Setup

- [ ] **Install missing dependencies**
  ```bash
  # Add to ui.gemspec
  spec.add_development_dependency "tailwind_merge", "~> 0.13"
  spec.add_development_dependency "lookbook", "~> 2.3"

  # Run bundle install
  bundle install
  ```

- [ ] **Create necessary directories**
  ```bash
  mkdir -p app/components/ui
  mkdir -p app/helpers/ui
  mkdir -p app/views/ui
  mkdir -p test/dummy/test/components/previews
  ```

- [ ] **Configure Lookbook in dummy app**
  ```ruby
  # test/dummy/config/initializers/lookbook.rb
  if defined?(Lookbook) && Rails.env.development?
    Lookbook.configure do |config|
      config.project_name = "UI Engine Components"
      config.preview_paths = [
        Rails.root.join("test/components/previews"),
        Rails.root.join("../../test/components/previews")  # Engine previews
      ]
      config.ui_theme = "indigo"
      config.auto_refresh = true
    end
  end
  ```

- [ ] **Mount Lookbook in dummy app routes**
  ```ruby
  # test/dummy/config/routes.rb
  mount Lookbook::Engine, at: "/lookbook" if defined?(Lookbook)
  ```

### 3.2 Component Migration Steps

For each component (e.g., Button):

#### **Step 1: Migrate Behavior Concern**

- [ ] Copy behavior file from source
  ```bash
  cp ~/src/ui-rails/app/helpers/button_behavior.rb \
     app/models/ui/button_behavior.rb
  ```

- [ ] Wrap in `UI::` module namespace
- [ ] Update any internal references
- [ ] Test that methods work independently

#### **Step 2: Migrate Phlex Component**

- [ ] Copy Phlex component from source
  ```bash
  mkdir -p app/components/ui/button
  cp ~/src/ui-rails/app/views/components/ui/button/button.rb \
     app/components/ui/button/button.rb
  ```

- [ ] Update behavior include: `include ::UI::ButtonBehavior`
- [ ] Verify namespace: `UI::Button::Button`
- [ ] Test rendering in console

#### **Step 3: Migrate ViewComponent**

- [ ] Copy ViewComponent from source
  ```bash
  cp ~/src/ui-rails/app/components/ui/button/button_component.rb \
     app/components/ui/button/button_component.rb
  ```

- [ ] Update behavior include: `include UI::ButtonBehavior`
- [ ] Verify namespace: `UI::Button::ButtonComponent`
- [ ] Test rendering in console

#### **Step 4: Migrate ERB Partial**

- [ ] Copy ERB partial from source
  ```bash
  cp ~/src/ui-rails/app/views/ui/_button.html.erb \
     app/views/ui/_button.html.erb
  ```

- [ ] Update behavior extend: `extend ::UI::ButtonBehavior`
- [ ] Test rendering in dummy app view

#### **Step 5: Migrate Sub-Partials (if any)**

- [ ] Create subdirectory: `mkdir -p app/views/ui/button`
- [ ] Copy sub-partials
- [ ] Update references

#### **Step 6: Migrate Lookbook Previews**

- [ ] Create preview directory structure
  ```bash
  mkdir -p test/components/previews
  mkdir -p test/components/previews/button_component_preview
  mkdir -p test/components/previews/button_partial_preview
  ```

- [ ] Copy preview files from source
- [ ] Update component references to use engine namespaces
- [ ] Copy preview templates

#### **Step 7: Create Dummy App Showcase**

- [ ] Create showcase route in dummy app
  ```ruby
  # test/dummy/config/routes.rb
  get "/components/button", to: "components#button"
  ```

- [ ] Create controller action
  ```ruby
  # test/dummy/app/controllers/components_controller.rb
  class ComponentsController < ApplicationController
    def button
      # Renders app/views/components/button.html.erb
    end
  end
  ```

- [ ] Create view demonstrating all three formats
  ```erb
  <!-- test/dummy/app/views/components/button.html.erb -->
  <h1>Button Component</h1>

  <section>
    <h2>Phlex</h2>
    <%= render UI::Button::Button.new(variant: "default") { "Phlex Button" } %>
  </section>

  <section>
    <h2>ViewComponent</h2>
    <%= render UI::Button::ButtonComponent.new(variant: "default") do %>
      ViewComponent Button
    <% end %>
  </section>

  <section>
    <h2>ERB Partial</h2>
    <%= render "ui/button", variant: "default", content: "ERB Button" %>
  </section>
  ```

#### **Step 8: Migrate Stimulus Controller (if exists)**

- [ ] Copy Stimulus controller
  ```bash
  cp ~/src/ui-rails/app/javascript/controllers/button_controller.js \
     app/javascript/ui/controllers/button_controller.js
  ```

- [ ] Update imports if needed
- [ ] Re-run Rollup build: `bun run build`

#### **Step 9: Verify Migration**

- [ ] Start dummy app: `cd test/dummy && bin/dev`
- [ ] Visit Lookbook: `http://localhost:4000/lookbook`
- [ ] Verify all previews render correctly
- [ ] Visit showcase route: `http://localhost:4000/components/button`
- [ ] Test all variants and sizes
- [ ] Compare with source library visually

### 3.3 Post-Migration Cleanup

- [ ] Remove any temporary files
- [ ] Update engine's README with component documentation
- [ ] Add component to CLAUDE.md if special instructions needed
- [ ] Commit changes with descriptive message

---

## 4. Button Migration Example

Let's walk through the complete button migration as a concrete example.

### 4.1 Install Dependencies

```bash
# Edit ui.gemspec, add:
spec.add_development_dependency "tailwind_merge", "~> 0.13"
spec.add_development_dependency "lookbook", "~> 2.3"

# Install
bundle install
```

### 4.2 Create Directory Structure

```bash
cd /Users/fernandes/src/ui

# Component directories
mkdir -p app/components/ui/button
mkdir -p app/models/ui
mkdir -p app/views/ui

# Lookbook preview directories
mkdir -p test/components/previews
mkdir -p test/components/previews/button_phlex_preview
mkdir -p test/components/previews/button_component_preview
mkdir -p test/components/previews/button_partial_preview
```

### 4.3 Migrate ButtonBehavior

Create `app/models/ui/button_behavior.rb`:

```ruby
# frozen_string_literal: true

module UI
  # ButtonBehavior
  #
  # Shared behavior for Button component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent variant and size styling, along with HTML attribute generation.
  module ButtonBehavior
    # Returns HTML attributes for the button element
    def button_html_attributes
      {
        class: button_classes,
        type: @type || "button",
        disabled: @disabled ? true : nil
      }.compact
    end

    # Returns combined CSS classes for the button
    def button_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        button_base_classes,
        button_variant_classes,
        button_size_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes applied to all buttons
    def button_base_classes
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-3"
    end

    # Variant-specific classes based on @variant
    def button_variant_classes
      case @variant.to_s
      when "default"
        "bg-primary text-primary-foreground hover:bg-primary/90"
      when "destructive"
        "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      when "outline"
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      when "secondary"
        "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      when "ghost"
        "hover:bg-accent hover:text-accent-foreground"
      when "link"
        "text-primary underline-offset-4 hover:underline"
      else
        "bg-primary text-primary-foreground hover:bg-primary/90"
      end
    end

    # Size-specific classes based on @size
    def button_size_classes
      case @size.to_s
      when "default"
        "h-9 px-4 py-2"
      when "sm"
        "h-8 px-3 text-xs"
      when "lg"
        "h-10 px-8"
      when "icon"
        "h-9 w-9"
      when "icon-sm"
        "h-8 w-8"
      when "icon-lg"
        "h-10 w-10"
      else
        "h-9 px-4 py-2"
      end
    end
  end
end
```

### 4.4 Migrate Phlex Component

Create `app/components/ui/button/button.rb`:

```ruby
# frozen_string_literal: true

module UI
  module Button
    # Button - Phlex implementation
    #
    # A versatile button component with multiple variants and sizes.
    # Uses ButtonBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Button::Button.new { "Click me" }
    #
    # @example With variant and size
    #   render UI::Button::Button.new(variant: "destructive", size: "lg") { "Delete" }
    #
    # @example Disabled state
    #   render UI::Button::Button.new(disabled: true) { "Disabled" }
    class Button < Phlex::HTML
      include UI::ButtonBehavior

      # @param variant [String] Visual style variant (default, destructive, outline, secondary, ghost, link)
      # @param size [String] Size variant (default, sm, lg, icon, icon-sm, icon-lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param disabled [Boolean] Whether the button is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**button_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
```

### 4.5 Migrate ViewComponent

Create `app/components/ui/button/button_component.rb`:

```ruby
# frozen_string_literal: true

module UI
  module Button
    # ButtonComponent - ViewComponent implementation
    #
    # A versatile button component with multiple variants and sizes.
    # Uses ButtonBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Button::ButtonComponent.new do %>
    #     Click me
    #   <% end %>
    #
    # @example With variant and size
    #   <%= render UI::Button::ButtonComponent.new(variant: "destructive", size: "lg") do %>
    #     Delete
    #   <% end %>
    #
    # @example Disabled state
    #   <%= render UI::Button::ButtonComponent.new(disabled: true) do %>
    #     Disabled
    #   <% end %>
    class ButtonComponent < ViewComponent::Base
      include UI::ButtonBehavior

      # @param variant [String] Visual style variant (default, destructive, outline, secondary, ghost, link)
      # @param size [String] Size variant (default, sm, lg, icon, icon-sm, icon-lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param disabled [Boolean] Whether the button is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :button, **button_html_attributes.merge(@attributes) do
          content
        end
      end
    end
  end
end
```

### 4.6 Migrate ERB Partial

Create `app/views/ui/_button.html.erb`:

```erb
<%# Button Component - shadcn/ui inspired button for Rails %>
<%
  content ||= local_assigns.fetch(:content, nil)
  @classes = local_assigns.fetch(:classes, "")
  @attributes = local_assigns.fetch(:attributes, {})
  @variant = local_assigns.fetch(:variant, "default")
  @disabled = local_assigns.fetch(:disabled, nil)
  @size = local_assigns.fetch(:size, "default")
  @type = local_assigns.fetch(:type, "button")

  # Extend behavior for shared logic
  extend ::UI::ButtonBehavior

  # Get HTML attributes from behavior
  all_attributes = button_html_attributes.deep_merge(@attributes)
-%>
<%= content_tag :button, all_attributes do %>
  <%= content || yield %>
<% end %>
```

### 4.7 Configure Lookbook

Create `test/dummy/config/initializers/lookbook.rb`:

```ruby
# frozen_string_literal: true

if defined?(Lookbook) && Rails.env.development?
  Lookbook.configure do |config|
    # Project configuration
    config.project_name = "UI Engine Components"

    # Preview paths - include both dummy app and engine previews
    config.preview_paths = [
      Rails.root.join("test/components/previews"),
      Rails.root.join("../../test/components/previews")
    ]

    # UI theme
    config.ui_theme = "indigo"

    # Enable features
    config.auto_refresh = true
  end
end
```

Update `test/dummy/config/routes.rb`:

```ruby
Rails.application.routes.draw do
  # Mount Lookbook for component previews
  mount Lookbook::Engine, at: "/lookbook" if defined?(Lookbook)

  # Existing routes
  get "/importmap", to: "importmap#index"
  get "/bundled", to: "bundled#index"

  # Component showcase routes
  get "/components/button", to: "components#button"

  root "importmap#index"
end
```

### 4.8 Create Lookbook Previews

Create `test/components/previews/button_phlex_preview.rb`:

```ruby
# frozen_string_literal: true

# @label Button (Phlex)
# @logical_path phlex/button
class ButtonPhlexPreview < Lookbook::Preview
  # @label Default
  # @display bg_color "#f5f5f5"
  # @display padding "2rem"
  def default
    render DefaultExample.new
  end

  # @label All Variants
  # @display bg_color "#f5f5f5"
  # @display padding "2rem"
  def variants
    render VariantsExample.new
  end

  # @label All Sizes
  # @display bg_color "#f5f5f5"
  # @display padding "2rem"
  def sizes
    render SizesExample.new
  end

  # @label Interactive Playground
  # @param variant select { choices: [default, destructive, outline, secondary, ghost, link] }
  # @param size select { choices: [default, sm, lg, icon, icon-sm, icon-lg] }
  # @param disabled toggle
  # @param text text "Button"
  def playground(variant: "default", size: "default", disabled: false, text: "Button")
    render PlaygroundExample.new(variant: variant, size: size, disabled: disabled, text: text)
  end

  class DefaultExample < Phlex::HTML
    def view_template
      render ::UI::Button::Button.new { "Click me" }
    end
  end

  class VariantsExample < Phlex::HTML
    def view_template
      div(class: "flex flex-wrap gap-4") do
        render ::UI::Button::Button.new(variant: "default") { "Default" }
        render ::UI::Button::Button.new(variant: "secondary") { "Secondary" }
        render ::UI::Button::Button.new(variant: "destructive") { "Destructive" }
        render ::UI::Button::Button.new(variant: "outline") { "Outline" }
        render ::UI::Button::Button.new(variant: "ghost") { "Ghost" }
        render ::UI::Button::Button.new(variant: "link") { "Link" }
      end
    end
  end

  class SizesExample < Phlex::HTML
    def view_template
      div(class: "flex flex-wrap items-center gap-4") do
        render ::UI::Button::Button.new(size: "sm") { "Small" }
        render ::UI::Button::Button.new(size: "default") { "Default" }
        render ::UI::Button::Button.new(size: "lg") { "Large" }
      end
    end
  end

  class PlaygroundExample < Phlex::HTML
    def initialize(variant:, size:, disabled:, text:)
      @variant, @size, @disabled, @text = variant, size, disabled, text
    end

    def view_template
      render ::UI::Button::Button.new(variant: @variant, size: @size, disabled: @disabled) { @text }
    end
  end
end
```

Create `test/components/previews/button_component_preview.rb`:

```ruby
# frozen_string_literal: true

# @label Button (ViewComponent)
# @logical_path view_component/button
class ButtonComponentPreview < Lookbook::Preview
  # @label Default
  def default
    render_with_template
  end

  # @label All Variants
  def variants
    render_with_template
  end

  # @label Interactive Playground
  # @param variant select { choices: [default, destructive, outline, secondary, ghost, link] }
  # @param size select { choices: [default, sm, lg, icon] }
  # @param disabled toggle
  # @param text text "Button"
  def playground(variant: "default", size: "default", disabled: false, text: "Button")
    render_with_template(locals: { variant: variant, size: size, disabled: disabled, text: text })
  end
end
```

Create preview templates:

```erb
<!-- test/components/previews/button_component_preview/default.html.erb -->
<%= render ::UI::Button::ButtonComponent.new do %>
  Click me
<% end %>
```

```erb
<!-- test/components/previews/button_component_preview/variants.html.erb -->
<div class="flex flex-wrap gap-4">
  <%= render ::UI::Button::ButtonComponent.new(variant: "default") { "Default" } %>
  <%= render ::UI::Button::ButtonComponent.new(variant: "secondary") { "Secondary" } %>
  <%= render ::UI::Button::ButtonComponent.new(variant: "destructive") { "Destructive" } %>
  <%= render ::UI::Button::ButtonComponent.new(variant: "outline") { "Outline" } %>
  <%= render ::UI::Button::ButtonComponent.new(variant: "ghost") { "Ghost" } %>
  <%= render ::UI::Button::ButtonComponent.new(variant: "link") { "Link" } %>
</div>
```

```erb
<!-- test/components/previews/button_component_preview/playground.html.erb -->
<%= render ::UI::Button::ButtonComponent.new(
  variant: local_assigns[:variant],
  size: local_assigns[:size],
  disabled: local_assigns[:disabled]
) do %>
  <%= local_assigns[:text] %>
<% end %>
```

Create ERB partial preview similarly:

```ruby
# test/components/previews/button_partial_preview.rb
# frozen_string_literal: true

# @label Button (ERB)
# @logical_path erb/button
class ButtonPartialPreview < Lookbook::Preview
  # @label Default
  def default
    render_with_template
  end

  # @label All Variants
  def variants
    render_with_template
  end
end
```

```erb
<!-- test/components/previews/button_partial_preview/default.html.erb -->
<%= render "ui/button", content: "Click me" %>
```

```erb
<!-- test/components/previews/button_partial_preview/variants.html.erb -->
<div class="flex flex-wrap gap-4">
  <%= render "ui/button", variant: "default", content: "Default" %>
  <%= render "ui/button", variant: "secondary", content: "Secondary" %>
  <%= render "ui/button", variant: "destructive", content: "Destructive" %>
  <%= render "ui/button", variant: "outline", content: "Outline" %>
  <%= render "ui/button", variant: "ghost", content: "Ghost" %>
  <%= render "ui/button", variant: "link", content: "Link" %>
</div>
```

### 4.9 Create Showcase Route

Create `test/dummy/app/controllers/components_controller.rb`:

```ruby
# frozen_string_literal: true

class ComponentsController < ApplicationController
  def button
    # Renders app/views/components/button.html.erb
  end
end
```

Create `test/dummy/app/views/components/button.html.erb`:

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Button Component Showcase</title>
  <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
  <%= javascript_importmap_tags %>
</head>
<body class="p-8 bg-background text-foreground">
  <div class="max-w-4xl mx-auto space-y-12">
    <header>
      <h1 class="text-4xl font-bold mb-2">Button Component</h1>
      <p class="text-muted-foreground">Demonstrating all three component formats</p>
    </header>

    <!-- Phlex Implementation -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Phlex Implementation</h2>
      <div class="flex flex-wrap gap-4">
        <%= render UI::Button::Button.new(variant: "default") { "Default" } %>
        <%= render UI::Button::Button.new(variant: "secondary") { "Secondary" } %>
        <%= render UI::Button::Button.new(variant: "destructive") { "Destructive" } %>
        <%= render UI::Button::Button.new(variant: "outline") { "Outline" } %>
        <%= render UI::Button::Button.new(variant: "ghost") { "Ghost" } %>
        <%= render UI::Button::Button.new(variant: "link") { "Link" } %>
      </div>
    </section>

    <!-- ViewComponent Implementation -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">ViewComponent Implementation</h2>
      <div class="flex flex-wrap gap-4">
        <%= render UI::Button::ButtonComponent.new(variant: "default") { "Default" } %>
        <%= render UI::Button::ButtonComponent.new(variant: "secondary") { "Secondary" } %>
        <%= render UI::Button::ButtonComponent.new(variant: "destructive") { "Destructive" } %>
        <%= render UI::Button::ButtonComponent.new(variant: "outline") { "Outline" } %>
        <%= render UI::Button::ButtonComponent.new(variant: "ghost") { "Ghost" } %>
        <%= render UI::Button::ButtonComponent.new(variant: "link") { "Link" } %>
      </div>
    </section>

    <!-- ERB Partial Implementation -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">ERB Partial Implementation</h2>
      <div class="flex flex-wrap gap-4">
        <%= render "ui/button", variant: "default", content: "Default" %>
        <%= render "ui/button", variant: "secondary", content: "Secondary" %>
        <%= render "ui/button", variant: "destructive", content: "Destructive" %>
        <%= render "ui/button", variant: "outline", content: "Outline" %>
        <%= render "ui/button", variant: "ghost", content: "Ghost" %>
        <%= render "ui/button", variant: "link", content: "Link" %>
      </div>
    </section>

    <!-- Size Variants -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Sizes (Phlex)</h2>
      <div class="flex flex-wrap items-center gap-4">
        <%= render UI::Button::Button.new(size: "sm") { "Small" } %>
        <%= render UI::Button::Button.new(size: "default") { "Default" } %>
        <%= render UI::Button::Button.new(size: "lg") { "Large" } %>
        <%= render UI::Button::Button.new(size: "icon", variant: "outline") do %>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        <% end %>
      </div>
    </section>

    <!-- Navigation -->
    <footer class="pt-8 border-t">
      <%= link_to "← Back to Importmap Demo", importmap_path, class: "text-sm text-muted-foreground hover:text-foreground" %>
      <span class="mx-4">|</span>
      <%= link_to "View in Lookbook →", lookbook_path, class: "text-sm text-muted-foreground hover:text-foreground" %>
    </footer>
  </div>
</body>
</html>
```

### 4.10 Test the Migration

```bash
# Start the dummy app
cd test/dummy
bin/dev

# Visit the Lookbook interface
open http://localhost:4000/lookbook

# Visit the component showcase
open http://localhost:4000/components/button

# Compare with source library
cd ~/src/ui-rails
bin/dev
open http://localhost:3000/lookbook
open http://localhost:3000/docs/components/button
```

### 4.11 Verification Checklist

- [ ] All three formats render correctly
- [ ] All variants display (default, secondary, destructive, outline, ghost, link)
- [ ] All sizes work (sm, default, lg, icon, icon-sm, icon-lg)
- [ ] Disabled state functions properly
- [ ] Custom classes merge correctly (via TailwindMerge)
- [ ] Lookbook previews are interactive
- [ ] Visual appearance matches source library
- [ ] No console errors in browser
- [ ] Components work with both importmaps and bundled JS approaches

---

## 5. Testing Strategy

### 5.1 Visual Testing with Lookbook

Lookbook serves as the primary visual testing tool:

1. **Interactive Previews**: Use the playground feature to test all variants/sizes
2. **Three Formats**: Maintain separate previews for Phlex, ViewComponent, and ERB
3. **Auto-Refresh**: Lookbook watches for file changes and updates automatically
4. **Side-by-Side**: Can view source library and engine side-by-side for comparison

### 5.2 Showcase Routes

Create dedicated showcase routes in the dummy app for each component:

- Demonstrates real-world usage
- Tests integration with Turbo/Stimulus
- Verifies CSS compilation
- Allows manual testing of interactions

### 5.3 System Tests (for interactive components)

For components with JavaScript interactions (dropdowns, modals, etc.):

```ruby
# test/dummy/test/system/button_test.rb
require "application_system_test_case"

class ButtonTest < ApplicationSystemTestCase
  test "button renders with correct variant" do
    visit components_button_path

    assert_selector "button.bg-primary", text: "Default"
    assert_selector "button.bg-destructive", text: "Destructive"
  end

  test "button can be clicked" do
    visit components_button_path

    click_button "Default"
    # Add assertions for click behavior if applicable
  end
end
```

### 5.4 Component Object Model (for complex components)

For interactive components, create helper classes:

```ruby
# test/dummy/test/system/components/button.rb
module Components
  class Button
    def initialize(page, text:)
      @page = page
      @text = text
    end

    def element
      @page.find("button", text: @text)
    end

    def click
      element.click
    end

    def disabled?
      element[:disabled] == "true"
    end

    def variant
      classes = element[:class]
      case classes
      when /bg-primary/ then "default"
      when /bg-destructive/ then "destructive"
      # ...
      end
    end
  end
end
```

---

## 6. Common Pitfalls

### 6.1 Namespace Issues

❌ **Wrong**: Forgetting to wrap in `UI::` module
```ruby
module Button
  class Button < Phlex::HTML
    # Will conflict with other Button classes
  end
end
```

✅ **Correct**: Always use `UI::` namespace
```ruby
module UI
  module Button
    class Button < Phlex::HTML
      # Properly namespaced
    end
  end
end
```

### 6.2 Behavior Include vs Extend

❌ **Wrong**: Using `include` in ERB partials
```erb
<%
  include ::UI::ButtonBehavior  # Won't work in ERB context
%>
```

✅ **Correct**: Use `extend` in ERB partials
```erb
<%
  extend ::UI::ButtonBehavior  # Correct for ERB
%>
```

### 6.2b ViewComponent Block Syntax

**IMPORTANT**: ViewComponents need parentheses only when using **inline blocks `{ }`**, not with `do...end` blocks.

✅ **Correct with `do...end`** (no parentheses needed):
```erb
<%# do...end blocks work without parentheses %>
<%= render UI::Button::ButtonComponent.new(variant: "default") do %>
  Click me
<% end %>
```

❌ **Wrong with inline blocks** (block goes to `.new()`, not `render`):
```erb
<%# Without parentheses, inline block is passed to .new() %>
<%= render UI::Button::ButtonComponent.new(variant: "default") { "Click me" } %>
```

✅ **Correct with inline blocks** (parentheses required):
```erb
<%# Parentheses ensure inline block is passed to render method %>
<%= render(UI::Button::ButtonComponent.new(variant: "default")) { "Click me" } %>
```

**Why?** Ruby's parser has different precedence rules for `do...end` vs `{ }` blocks:
- `do...end` has **lower precedence** and naturally binds to `render`
- `{ }` has **higher precedence** and binds to the closest method (`.new()`)
- Adding parentheses around `.new()` forces the `{ }` block to bind to `render` instead

**Recommendation**: Use `do...end` for ViewComponents to avoid confusion. Phlex components work with either syntax without parentheses.

### 6.3 Missing TailwindMerge

Components rely on `TailwindMerge::Merger` to handle conflicting CSS classes. If missing:

```ruby
# Add to ui.gemspec
spec.add_development_dependency "tailwind_merge", "~> 0.13"
```

### 6.4 Lookbook Preview Paths

Ensure both dummy app and engine preview paths are configured:

```ruby
config.preview_paths = [
  Rails.root.join("test/components/previews"),           # Dummy app
  Rails.root.join("../../test/components/previews")     # Engine root
]
```

### 6.5 Asset Pipeline Configuration

The engine provides CSS variables only. Host apps must:

1. Import engine variables: `@import "ui/application.css"`
2. Configure `@source` to scan engine files for Tailwind classes
3. Compile their own Tailwind CSS

### 6.6 Stimulus Controller Registration

If migrating Stimulus controllers:

1. Add to `app/javascript/ui/controllers/`
2. Update `app/javascript/ui/index.js` to export
3. Run Rollup build: `bun run build`
4. Test with both importmap and bundled approaches

### 6.7 Engine Autoloading

Components in `app/components/ui/` should autoload correctly, but if issues arise:

```ruby
# lib/ui/engine.rb
module UI
  class Engine < ::Rails::Engine
    config.autoload_paths << root.join("app/components")
    config.eager_load_paths << root.join("app/components")
  end
end
```

---

## Conclusion

This guide provides a comprehensive process for migrating components from the ui-rails standalone application to the UI Rails Engine. By following these steps:

1. **Components** are properly organized in `app/components/ui/`
2. **Behaviors** are namespaced under `UI::` in `app/models/ui/`
3. **ERB partials** are available in `app/views/ui/`
4. **Lookbook** provides visual testing and documentation
5. **Showcase routes** allow real-world integration testing
6. **All three formats** (Phlex, ViewComponent, ERB) work seamlessly

Each component migration should follow this pattern to ensure consistency and maintainability across the entire UI component library.

---

## Next Steps

1. Complete button migration following this guide
2. Use button as reference for migrating other components
3. Document any component-specific quirks in CLAUDE.md
4. Build out comprehensive Lookbook gallery
5. Add system tests for interactive components

Happy migrating! 🚀
