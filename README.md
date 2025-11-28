# UI Engine

![UI Logo](./logo.png)

A Rails engine providing a component library with Tailwind CSS 4 support. Designed to work seamlessly with multiple Rails versions (6, 7, and 8) and different asset pipelines (Propshaft, Sprockets, and Node/Bun).

## Features

- ✅ **Tailwind CSS 4** - CSS-first configuration using `@import`, `@source`, and `@theme`
- ✅ **Multi-Pipeline Support** - Works with Propshaft (Rails 8), Sprockets (Rails 6/7), and Node/Bun bundlers
- ✅ **Importmap Ready** - JavaScript modules via importmaps or bundlers
- ✅ **Flexible Installation** - Automatic detection of your app's asset pipeline
- ✅ **Rails 6-8 Compatible** - Supports Rails 6.0+

## Installation

### Ruby Gem

Add to your Gemfile:

```ruby
gem "fernandes-ui"
```

Then run:

```bash
bundle install
```

### JavaScript (Importmaps)

For Rails 7+ with importmaps, pin the engine in `config/importmap.rb`:

```ruby
pin "ui", to: "ui.esm.js", preload: true
pin_all_from "ui/controllers", under: "ui/controllers"
```

The gem automatically provides these pins via the engine.

### JavaScript (jsbundling-rails)

For apps using Bun, esbuild, or Webpack:

```bash
bun add @fernandes/ui
# or
npm install @fernandes/ui
```

Then import in your JavaScript:

```javascript
import { Application } from "@hotwired/stimulus"
import * as UI from "@fernandes/ui"

const application = Application.start()
UI.registerControllers(application)
```

### CSS (cssbundling-rails)

For apps using cssbundling-rails, use the generators to get UI css copied and then imported automatically.

```bash
rails generate ui:css
rails generate ui:install
```

### CSS (Propshaft/Sprockets)

For apps using asset pipeline without bundler, import in your Tailwind config:

```css
@import "tailwindcss";
@import "ui/application.css";

/* Scan bundled gem files */
@source "../../../.bundle/ruby/*/gems/fernandes-ui-*/app/**/*.{erb,rb,js}";
```

## Usage

The UI Engine provides CSS variables, Stimulus controllers, and components. You configure Tailwind CSS in your application to scan the engine files.

### Selective Controller Import

You can import only the controllers you need for better performance and tree-shaking:

#### **Import Individual Controllers**

```javascript
// With jsbundling-rails
import { Application } from "@hotwired/stimulus"
import { HelloController, DropdownController } from "@fernandes/ui"

const application = Application.start()
application.register("ui--hello", HelloController)
application.register("ui--dropdown", DropdownController)
```

#### **Import from Controller Files (Importmaps)**

```javascript
import { Application } from "@hotwired/stimulus"
import HelloController from "ui/controllers/hello_controller"

const application = Application.start()
application.register("ui--hello", HelloController)
```

#### **Selective Registration with Helper**

```javascript
import { Application } from "@hotwired/stimulus"
import { HelloController, registerControllersInto } from "@fernandes/ui"

const application = Application.start()

// Register only specific controllers
registerControllersInto(application, {
  "ui--hello": HelloController
})
```

### Benefits of Selective Import

- **Tree-shaking** - Bundlers eliminate unused code
- **Flexibility** - Choose exactly what to import
- **Performance** - Load only what you need
- **Compatibility** - Works with both importmaps and bundlers

## Available Components

The engine currently provides the following Stimulus controllers and components:

### **Accordion** (`ui--accordion`)
Collapsible content sections with smooth CSS transitions. Supports single mode (only one item open) and multiple mode (multiple items can be open simultaneously).

**Usage:**
```erb
<%= render "ui/accordion/accordion", type: "single" do %>
  <%= render "ui/accordion/item", value: "item-1", initial_open: true do %>
    <%= render "ui/accordion/trigger" do %>
      Getting Started
    <% end %>
    <%= render "ui/accordion/content" do %>
      <p>Follow the installation instructions to get started.</p>
    <% end %>
  <% end %>
<% end %>
```

### **Dropdown** (`ui--dropdown`)
Dropdown menu component with toggle functionality.

### **Hello** (`ui--hello`)
Example component demonstrating Stimulus controller basics.

### CSS Variables

Import engine CSS variables in your Tailwind config:

```css
@import "ui/application.css";
```

This provides variables like `--ui-primary`, `--ui-spacing-*`, etc.

### Tailwind Configuration

Your `app/assets/stylesheets/application.tailwind.css` should include:

```css
@import "tailwindcss";
@import "ui/application.css";  /* Engine CSS variables */

/* Scan engine files for Tailwind classes */
@source "../../javascript/**/*.js";
@source "../../views/**/*.erb";

/* If using gems, also scan the gem paths */
@source "../../../.bundle/ruby/*/gems/ui-*/app/views/**/*.erb";
@source "../../../.bundle/ruby/*/gems/ui-*/app/javascript/**/*.js";

@theme {
  /* Your customizations */
}
```

### Building CSS

```bash
# One-time build
bun run build:css

# Watch for changes (development)
bun run build:css:watch

# Production build (minified)
bun run build:css:prod
```

### Development Workflow

```bash
# Start Rails server + Tailwind watch
bin/dev
```

This runs both the Rails server and Tailwind CSS watcher simultaneously.

## Development

### Running the Dummy App

The engine includes a dummy Rails application for testing:

```bash
cd test/dummy
bin/dev
```

This will start both the Rails server and Tailwind CSS watch process.

### Building CSS

```bash
# One-time build
bun run build:css

# Watch for changes
bun run build:css:watch

# Production build (minified)
bun run build:css:prod
```

### Project Structure

```
app/
├── assets/
│   ├── stylesheets/ui/
│   │   └── application.css     # CSS variables (shipped with gem)
│   └── javascripts/
│       ├── ui.js               # UMD bundle
│       └── ui.esm.js           # ESM bundle
├── behaviors/ui/               # Shared behavior modules (always loaded)
│   ├── button_behavior.rb
│   └── ...
├── components/ui/              # Phlex components (loaded if phlex-rails >= 2.0)
│   ├── button.rb
│   └── ...
├── view_components/ui/         # ViewComponents (loaded if view_component >= 3.0)
│   ├── button_component.rb
│   └── ...
├── javascript/ui/
│   ├── index.js                # JavaScript entry point
│   ├── controllers/            # Stimulus controllers
│   └── utils/                  # Utility modules
├── views/ui/                   # ERB partials (always available)
│   ├── _button.html.erb
│   └── ...
└── controllers/ui/             # Engine controllers

config/
└── importmap.rb                # Importmap pins for JS modules

lib/
└── ui/
    ├── configuration.rb        # UI.configure settings
    └── engine.rb               # Engine configuration
```

## Component Formats

The engine supports three component formats:

| Format | Directory | Required Gem | Description |
|--------|-----------|--------------|-------------|
| **ERB Partials** | `app/views/ui/` | None | Always available, uses Behaviors |
| **Phlex** | `app/components/ui/` | `phlex-rails` >= 2.0 | Ruby-first components |
| **ViewComponent** | `app/view_components/ui/` | `view_component` >= 3.0 | GitHub's ViewComponent |

### Automatic Loading

By default, the engine automatically detects which gems are available and loads the appropriate components:

- **Behaviors** (`app/behaviors/ui/`) - Always loaded (required for ERB)
- **Phlex** - Loaded if `phlex-rails` gem is present and version >= 2.0.0
- **ViewComponent** - Loaded if `view_component` gem is present and version >= 3.0.0

### Manual Configuration

You can override automatic detection by configuring before Rails loads. Add to `config/application.rb` **before** `Bundler.require`:

```ruby
# config/application.rb
require_relative "boot"

# Configure UI before Bundler.require loads the engine
require "ui/configuration"
UI.configure do |c|
  c.enable_phlex = true           # Force enable (skip version check)
  c.enable_view_component = false # Force disable (don't load even if gem exists)
end

require "rails/all"
Bundler.require(*Rails.groups)
# ...
```

#### Configuration Options

| Value | Behavior |
|-------|----------|
| `nil` (default) | Auto-detect: loads if gem available AND version meets minimum |
| `true` | Force enable: loads if gem available (ignores version check) |
| `false` | Force disable: never loads, even if gem is available |

#### Use Cases

**Force Enable** - Testing with unsupported gem versions:
```ruby
UI.configure do |c|
  c.enable_phlex = true  # Use Phlex even if version < 2.0
end
```

**Force Disable** - Legacy gems in app that shouldn't be used:
```ruby
UI.configure do |c|
  c.enable_view_component = false  # Don't load even though gem exists
end
```

**ERB Only** - Minimal setup without optional dependencies:
```ruby
UI.configure do |c|
  c.enable_phlex = false
  c.enable_view_component = false
end
```

## Architecture: Why Tailwind Config Lives in Host App

**Key Principle:** The engine provides **styled components**, not Tailwind configuration.

- **Engine provides:** CSS variables, JavaScript, views with Tailwind classes
- **Host app provides:** Tailwind compilation, `@source` configuration, theme customization

This approach:
- ✅ Allows each app to customize Tailwind output
- ✅ Enables apps to scan their own files + engine files
- ✅ Avoids conflicts with existing Tailwind setups
- ✅ Keeps engine gem size small (no compiled CSS)
- ✅ Supports different Rails versions and asset pipelines

## Tailwind CSS 4 Configuration

Your application (not the engine) configures Tailwind. Create `app/assets/stylesheets/application.tailwind.css`:

```css
@import "tailwindcss";
@import "ui/application.css";  /* Import engine CSS variables */

/* Scan YOUR app files */
@source "../../javascript/**/*.js";
@source "../../views/**/*.erb";

/* Scan bundled gem files */
@source "../../../.bundle/ruby/*/gems/fernandes-ui-*/app/**/*.{erb,rb,js}";

@theme {
  /* Customize using engine variables */
  --color-primary: var(--ui-primary);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
