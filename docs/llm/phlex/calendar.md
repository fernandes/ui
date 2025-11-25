# Calendar Component - Phlex

A date picker calendar with support for single, range, and multiple selection modes.

## Basic Usage

```ruby
<%= render UI::Calendar::Calendar.new %>
```

## Component Structure

The calendar is a single component that renders:
- Navigation buttons (previous/next month)
- Month/year label or dropdowns
- Weekday headers
- Date grid (rendered dynamically by Stimulus controller)

**Class**: `UI::Calendar::Calendar`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode:` | Symbol | `:single` | Selection mode: `:single`, `:range`, or `:multiple` |
| `selected:` | Date/Range/Array | `nil` | Initially selected date(s) |
| `month:` | Date | `Date.today` | Initially displayed month |
| `number_of_months:` | Integer | `1` | Number of months to display side by side |
| `week_starts_on:` | Integer | `0` | 0 for Sunday, 1 for Monday, etc. |
| `min_date:` | Date | `nil` | Minimum selectable date |
| `max_date:` | Date | `nil` | Maximum selectable date |
| `disabled_dates:` | Array | `[]` | Dates that cannot be selected |
| `show_outside_days:` | Boolean | `true` | Show days from adjacent months |
| `fixed_weeks:` | Boolean | `false` | Always show 6 weeks |
| `show_dropdowns:` | Boolean | `false` | Show month/year dropdowns |
| `year_range:` | Integer | `100` | Number of years to show in dropdown |
| `name:` | String | `nil` | Form field name for hidden input |
| `classes:` | String | `""` | Additional CSS classes |
| `attributes:` | Hash | `{}` | Additional HTML attributes |

## Examples

### Single Date Selection (Default)

```ruby
<%= render UI::Calendar::Calendar.new %>
```

### With Pre-selected Date

```ruby
<%= render UI::Calendar::Calendar.new(selected: Date.today) %>
```

### Date Range Selection

```ruby
<%= render UI::Calendar::Calendar.new(
  mode: :range,
  selected: Date.today..Date.today + 7
) %>
```

### Multiple Date Selection

```ruby
<%= render UI::Calendar::Calendar.new(
  mode: :multiple,
  selected: [Date.today, Date.today + 2, Date.today + 5]
) %>
```

### Multiple Months Display

```ruby
<%= render UI::Calendar::Calendar.new(number_of_months: 2) %>
```

### With Month/Year Dropdowns

```ruby
<%= render UI::Calendar::Calendar.new(show_dropdowns: true) %>
```

### Date of Birth Picker (Dropdowns with Constraints)

```ruby
<%= render UI::Calendar::Calendar.new(
  show_dropdowns: true,
  max_date: Date.today,
  year_range: 100
) %>
```

### Min/Max Date Constraints

```ruby
<%= render UI::Calendar::Calendar.new(
  min_date: Date.today,
  max_date: Date.today + 30
) %>
```

### Week Starts on Monday

```ruby
<%= render UI::Calendar::Calendar.new(week_starts_on: 1) %>
```

### With Disabled Dates

```ruby
<%= render UI::Calendar::Calendar.new(
  disabled_dates: [Date.today + 3, Date.today + 5]
) %>
```

### Form Integration

```ruby
<%= form_with model: @event do |f| %>
  <%= render UI::Calendar::Calendar.new(
    name: "event[date]",
    selected: @event.date
  ) %>
  <%= f.submit "Save" %>
<% end %>
```

### Fixed 6-Week Display

```ruby
<%= render UI::Calendar::Calendar.new(fixed_weeks: true) %>
```

### Hide Outside Days

```ruby
<%= render UI::Calendar::Calendar.new(show_outside_days: false) %>
```

### Start from Specific Month

```ruby
<%= render UI::Calendar::Calendar.new(month: Date.new(2024, 12, 1)) %>
```

## Selection Mode Behavior

- **`:single`** (default) - Select one date at a time
- **`:range`** - Select a start and end date (two clicks)
- **`:multiple`** - Select multiple individual dates

## JavaScript Integration

The calendar uses the `ui--calendar` Stimulus controller which:
- Renders the date grid dynamically
- Handles date selection
- Manages navigation (previous/next month)
- Updates month/year dropdowns
- Persists selection to hidden input (if `name` provided)

## Important Notes

### Date Format

Selected dates are stored in ISO format (`YYYY-MM-DD`):
- Single: `"2024-11-25"`
- Range: `"2024-11-25,2024-12-02"` (start,end)
- Multiple: `"2024-11-25,2024-11-27,2024-11-30"` (comma-separated)

### Using with date-fns

The Stimulus controller uses `date-fns` for date manipulation. The library is included in the engine's JavaScript bundle.

## Error Prevention

### Wrong: Using mode as string

```ruby
<%= render UI::Calendar::Calendar.new(mode: "range") %>
# Works, but use Symbol for consistency
```

### Correct: Use Symbol for mode

```ruby
<%= render UI::Calendar::Calendar.new(mode: :range) %>
```

### Wrong: Using ViewComponent class

```ruby
<%= render UI::Calendar::CalendarComponent.new %>
# This is ViewComponent syntax
```

### Correct: Use Phlex class

```ruby
<%= render UI::Calendar::Calendar.new %>
```
