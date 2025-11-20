# Select Component - Phlex

Custom select component with keyboard navigation, scrollable viewport, and form integration.

## Basic Usage

```ruby
render UI::Select::Select.new(value: "apple") do
  render UI::Select::Trigger.new(placeholder: "Select a fruit...")
  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "apple") { "Apple" }
    render UI::Select::Item.new(value: "banana") { "Banana" }
  end
end
```

## Components

### Select (Root Container)

- **Class**: `UI::Select::Select`
- **File**: `app/components/ui/select/select.rb`
- **Behavior Module**: `UI::SelectBehavior`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | `nil` | Currently selected value |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger (Button)

- **Class**: `UI::Select::Trigger`
- **File**: `app/components/ui/select/trigger.rb`
- **Behavior Module**: `UI::SelectTriggerBehavior`
- **Supports**: `as_child` composition

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yields attributes to block instead of rendering button |
| `placeholder` | String | `"Select..."` | Placeholder text when no value selected |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Content (Dropdown Container)

- **Class**: `UI::Select::Content`
- **File**: `app/components/ui/select/content.rb`
- **Behavior Module**: `UI::SelectContentBehavior`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Item (Option)

- **Class**: `UI::Select::Item`
- **File**: `app/components/ui/select/item.rb`
- **Behavior Module**: `UI::SelectItemBehavior`
- **Supports**: `as_child` composition

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yields attributes to block instead of rendering div |
| `value` | String | `nil` | Value of this option |
| `disabled` | Boolean | `false` | Whether item is disabled |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Group (Options Group)

- **Class**: `UI::Select::Group`
- **File**: `app/components/ui/select/group.rb`
- **Behavior Module**: `UI::SelectGroupBehavior`
- **Supports**: `as_child` composition

### Label (Group Label)

- **Class**: `UI::Select::Label`
- **File**: `app/components/ui/select/label.rb`
- **Behavior Module**: `UI::SelectLabelBehavior`
- **Supports**: `as_child` composition

### ScrollUpButton

- **Class**: `UI::Select::ScrollUpButton`
- **File**: `app/components/ui/select/scroll_up_button.rb`
- **Note**: Automatically included in Content, rarely needs manual rendering

### ScrollDownButton

- **Class**: `UI::Select::ScrollDownButton`
- **File**: `app/components/ui/select/scroll_down_button.rb`
- **Note**: Automatically included in Content, rarely needs manual rendering

## Examples

### Basic Select

```ruby
render UI::Select::Select.new(value: "apple") do
  render UI::Select::Trigger.new(placeholder: "Select a fruit...")
  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "apple") { "Apple" }
    render UI::Select::Item.new(value: "banana") { "Banana" }
    render UI::Select::Item.new(value: "orange") { "Orange" }
  end
end
```

### With Grouped Options

```ruby
render UI::Select::Select.new(value: "america/new_york") do
  render UI::Select::Trigger.new(placeholder: "Select timezone...")
  render UI::Select::Content.new do
    render UI::Select::Group.new do
      render UI::Select::Label.new { "North America" }
      render UI::Select::Item.new(value: "america/new_york") { "Eastern Time (ET)" }
      render UI::Select::Item.new(value: "america/chicago") { "Central Time (CT)" }
      render UI::Select::Item.new(value: "america/los_angeles") { "Pacific Time (PT)" }
    end

    render UI::Select::Group.new do
      render UI::Select::Label.new { "Europe" }
      render UI::Select::Item.new(value: "europe/london") { "London (GMT)" }
      render UI::Select::Item.new(value: "europe/paris") { "Paris (CET)" }
    end
  end
end
```

### With Disabled Items

```ruby
render UI::Select::Select.new(value: "react") do
  render UI::Select::Trigger.new(placeholder: "Select framework...")
  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "react") { "React" }
    render UI::Select::Item.new(value: "vue") { "Vue" }
    render UI::Select::Item.new(value: "angular", disabled: true) { "Angular (Coming Soon)" }
    render UI::Select::Item.new(value: "svelte") { "Svelte" }
  end
end
```

### With asChild - Custom Trigger

```ruby
render UI::Select::Select.new(value: "pro") do
  render UI::Select::Trigger.new(as_child: true, placeholder: "Select plan...") do |attrs|
    button(**attrs, class: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground") do
      svg(class: "size-4", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", stroke_width: "2") do |s|
        s.path(d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2")
        s.circle(cx: "9", cy: "7", r: "4")
      end
      span(data_ui__select_target: "valueDisplay") { "Select plan..." }
    end
  end

  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "free") { "Free - $0/mo" }
    render UI::Select::Item.new(value: "pro") { "Pro - $10/mo" }
    render UI::Select::Item.new(value: "enterprise") { "Enterprise - $50/mo" }
  end
end
```

### With asChild - Items as Links

```ruby
render UI::Select::Select.new(value: "dashboard") do
  render UI::Select::Trigger.new(placeholder: "Navigate...")
  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "dashboard", as_child: true) do |attrs|
      a(href: "#dashboard", **attrs, class: "flex items-center gap-2") do
        svg(class: "size-4") { |s| s.path(d: "...") }
        span(class: "flex-1") { "Dashboard" }
      end
    end

    render UI::Select::Item.new(value: "settings", as_child: true) do |attrs|
      a(href: "#settings", **attrs, class: "flex items-center gap-2") do
        svg(class: "size-4") { |s| s.path(d: "...") }
        span(class: "flex-1") { "Settings" }
      end
    end
  end
end
```

## Keyboard Navigation

- **↓ / ↑** - Navigate through items
- **Home / End** - Jump to first/last item
- **Enter / Space** - Select focused item
- **Esc** - Close dropdown

## Integration Patterns

### In Forms

```ruby
form do
  render UI::Select::Select.new(value: @user.country) do
    render UI::Select::Trigger.new(placeholder: "Select country...")
    render UI::Select::Content.new do
      render UI::Select::Item.new(value: "us") { "United States" }
      render UI::Select::Item.new(value: "uk") { "United Kingdom" }
      render UI::Select::Item.new(value: "ca") { "Canada" }
    end
  end
end
```

## Error Prevention

### ❌ Wrong: Missing nested class

```ruby
render UI::Select.new { ... }
# ERROR: undefined method 'new' for module UI::Select
```

### ✅ Correct: Use full path

```ruby
render UI::Select::Select.new { ... }  # Correct!
```

### ❌ Wrong: Content directly in Select

```ruby
render UI::Select::Select.new do
  render UI::Select::Item.new(value: "apple") { "Apple" }  # Missing Trigger and Content!
end
```

### ✅ Correct: Must have Trigger and Content

```ruby
render UI::Select::Select.new do
  render UI::Select::Trigger.new(placeholder: "Select...")
  render UI::Select::Content.new do
    render UI::Select::Item.new(value: "apple") { "Apple" }
  end
end
```

### ❌ Wrong: Using asChild without block parameter

```ruby
render UI::Select::Trigger.new(as_child: true) do
  button(class: "custom") { "Text" }  # Missing attrs!
end
```

### ✅ Correct: Receive and spread attrs

```ruby
render UI::Select::Trigger.new(as_child: true) do |attrs|
  button(**attrs, class: "custom") { "Text" }  # Correct!
end
```

## Notes

- Select automatically handles scrolling when there are many items
- Scroll buttons (up/down) appear automatically when content overflows
- The viewport maintains a fixed height based on the trigger height
- Native scrollbar is hidden, custom scroll buttons are shown
- All animations are CSS-based for smooth performance
