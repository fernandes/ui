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

Add this line to your application's Gemfile:

```ruby
gem "ui"
```

And then execute:

```bash
bundle install
rails generate ui:install
```

The installer will automatically detect your asset pipeline and configure the engine appropriately.

## Usage

The UI Engine provides CSS variables, Stimulus controllers, and components. You configure Tailwind CSS in your application, and the installer does this automatically.

### JavaScript Integration

The engine supports two approaches for JavaScript integration:

#### **Option 1: Importmaps (Rails 8 Default, Zero-Build)**

The engine automatically configures importmap pins. Just import and use:

```javascript
// app/javascript/application.js
import { Application } from "@hotwired/stimulus"
import * as UI from "ui"

const application = Application.start()

// Register all UI controllers
UI.registerControllers(application)

console.log("UI Engine version:", UI.version)
```

#### **Option 2: JavaScript Bundlers (Bun, esbuild, Webpack)**

Install the engine as an npm package:

```bash
bun add @ui/engine
# or
npm install @ui/engine
```

Then import in your bundled JavaScript:

```javascript
// app/javascript/application.js
import { Application } from "@hotwired/stimulus"
import * as UI from "@ui/engine"

const application = Application.start()

// Register all UI controllers
UI.registerControllers(application)
```

### Selective Controller Import

You can import only the controllers you need for better performance and tree-shaking:

#### **Import Individual Controllers from Main Module**

```javascript
import { Application } from "@hotwired/stimulus"
import { HelloController, DropdownController } from "ui"

const application = Application.start()
application.register("ui--hello", HelloController)
application.register("ui--dropdown", DropdownController)
```

#### **Import Directly from Controller Files (Importmap)**

```javascript
import { Application } from "@hotwired/stimulus"
import HelloController from "ui/controllers/hello_controller"

const application = Application.start()
application.register("ui--hello", HelloController)
```

#### **Selective Registration with Helper**

```javascript
import { Application } from "@hotwired/stimulus"
import { HelloController, registerControllersInto } from "ui"

const application = Application.start()

// Register only specific controllers
registerControllersInto(application, {
  "ui--hello": HelloController
  // Don't register DropdownController
})
```

### Benefits of Selective Import

✅ **Tree-shaking** - Bundlers eliminate unused code
✅ **Flexibility** - Choose exactly what to import
✅ **Performance** - Load only what you need
✅ **Compatibility** - Works with both importmaps and bundlers

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
│   └── stylesheets/ui/
│       └── application.css     # CSS variables (shipped with gem)
├── javascript/ui/
│   └── index.js                # JavaScript entry point
├── views/ui/                   # Engine views (scanned by host Tailwind)
├── controllers/ui/             # Engine controllers
└── components/ui/              # Ruby components (optional)

config/
└── importmap.rb                # Importmap pins for JS modules

lib/
├── generators/ui/install/
│   ├── install_generator.rb   # Installation generator
│   └── templates/             # Templates for host app setup
└── ui/
    └── engine.rb              # Engine configuration

test/dummy/                     # Test application
├── app/assets/stylesheets/
│   └── application.tailwind.css  # Tailwind config (NOT in engine!)
└── package.json               # Tailwind CLI (NOT in engine!)
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

Your application (not the engine) configures Tailwind. The generator creates `app/assets/stylesheets/application.tailwind.css`:

```css
@import "tailwindcss";
@import "ui/application.css";  /* Import engine CSS variables */

/* Scan YOUR app files */
@source "../../javascript/**/*.js";
@source "../../views/**/*.erb";

/* Scan ENGINE files for Tailwind classes */
@source "../../../../../app/javascript/**/*.js";  /* If local gem */
@source "../../../../../app/views/**/*.erb";      /* If local gem */

/* Or scan bundled gem (adjust path as needed) */
@source "../../../.bundle/ruby/*/gems/ui-*/app/**/*.{erb,rb,js}";

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
