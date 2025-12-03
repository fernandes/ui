# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.3

### Added

- [Tooltip] Support `as_child` pattern for composition without wrapper elements
- [Popover] Support `as_child` pattern for composition without wrapper elements
- [Select] Support `as_child` pattern for seamless integration in flex layouts
- [Calendar] Option to use UI::Select dropdowns instead of native selects

### Changed

- [InputGroup] Use CSS variable `--radius` for customizable border-radius
- [InputGroupButton] Properly merge classes when receiving attributes from asChild parents
- [DropdownMenuTrigger] asChild now only passes functional attributes (data, aria), not classes
- [NavigationMenu] Rename behaviors to avoid naming conflicts (e.g., `ContentBehavior` → `NavigationMenuContentBehavior`)

### Fixed

- [Collapsible] Force reflow to get correct height after removing hidden
- [Dropdown] Focus new item on hover instead of blur to prevent menu from closing
- [Skeleton] Use TailwindMerge for proper class merging
- [Avatar] ERB partial now properly merges custom classes (e.g., `size-16 grayscale`)
- [Table] Fix rendering for Phlex/VC implementations
- [Menubar] Fix checkboxes / radio groups not being selected
- [Sonner] Fix behavior wrong name
- [Avatar] Fix classes not being passed correctly
- [Button] (ERB) process attributes received as child correctly
- [Combobox] Set default offset to 4 on all implementations

## 0.1.2

### Changed

- Fix accordion to show open on initial state and animate on closing
- Fix carousel icones to have border and use same icon

### Added

- Components YAML to help on documentation
- Components aspect ratios for aspect ration component
- [Command] Configure autofocus with parameter

## [0.1.1] - 2025-11-28

### Changed

- Consolidated `sonner.css` into `application.css`
- Added new `css_generator.rb` for CSS-only installation

## [0.1.0] - 2025-11-28

### Added

- Initial release of fernandes-ui
- Rails UI component library with ERB, Phlex, and ViewComponent support
- Built with Tailwind CSS 4 and Stimulus.js
- Components include:
  - Accordion
  - Alert
  - Alert Dialog
  - Aspect Ratio
  - Avatar
  - Badge
  - Breadcrumb
  - Button
  - Calendar
  - Card
  - Carousel
  - Checkbox
  - Collapsible
  - Combobox
  - Command
  - Context Menu
  - Date Picker
  - Dialog
  - Drawer
  - Dropdown Menu
  - Field (Form)
  - Hover Card
  - Input
  - Input OTP
  - Kbd (Keyboard)
  - Label
  - Menubar
  - Navigation Menu
  - Pagination
  - Popover
  - Progress
  - Radio Group
  - Resizable
  - Responsive Dialog
  - Scroll Area
  - Select
  - Separator
  - Sheet
  - Sidebar
  - Skeleton
  - Slider
  - Sonner (Toast)
  - Spinner
  - Switch
  - Table
  - Tabs
  - Textarea
  - Toggle
  - Toggle Group
  - Tooltip
- Automatic detection and conditional loading of Phlex (>= 2.0) and ViewComponent (>= 3.0)
- Manual configuration via `UI.configure` block
- JavaScript controllers for interactive components
- CSS variables for theming
- Support for Rails 6.0+
- Support for both Importmaps and jsbundling-rails approaches

[0.1.1]: https://github.com/fernandes/ui/releases/tag/v0.1.1
[0.1.0]: https://github.com/fernandes/ui/releases/tag/v0.1.0
