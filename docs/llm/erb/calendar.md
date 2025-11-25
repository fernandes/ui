# Calendar Component - ERB

A date picker calendar with support for single, range, and multiple selection modes.

## Basic Usage

```erb
<%= render "ui/calendar/calendar" %>
```

## Component Structure

**Path**: `ui/calendar/calendar`

The calendar is a single partial that renders:
- Navigation buttons (previous/next month)
- Month/year label or dropdowns
- Weekday headers
- Date grid (rendered dynamically by Stimulus controller)

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode:` | Symbol/String | `:single` | Selection mode: `:single`, `:range`, or `:multiple` |
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

```erb
<%= render "ui/calendar/calendar" %>
```

### With Pre-selected Date

```erb
<%= render "ui/calendar/calendar", selected: Date.today %>
```

### Date Range Selection

```erb
<%= render "ui/calendar/calendar",
  mode: :range,
  selected: Date.today..Date.today + 7
%>
```

### Multiple Date Selection

```erb
<%= render "ui/calendar/calendar",
  mode: :multiple,
  selected: [Date.today, Date.today + 2, Date.today + 5]
%>
```

### Multiple Months Display

```erb
<%= render "ui/calendar/calendar", number_of_months: 2 %>
```

### With Month/Year Dropdowns

```erb
<%= render "ui/calendar/calendar", show_dropdowns: true %>
```

### Date of Birth Picker (Dropdowns with Constraints)

```erb
<%= render "ui/calendar/calendar",
  show_dropdowns: true,
  max_date: Date.today,
  year_range: 100
%>
```

### Min/Max Date Constraints

```erb
<%= render "ui/calendar/calendar",
  min_date: Date.today,
  max_date: Date.today + 30
%>
```

### Week Starts on Monday

```erb
<%= render "ui/calendar/calendar", week_starts_on: 1 %>
```

### With Disabled Dates

```erb
<%= render "ui/calendar/calendar",
  disabled_dates: [Date.today + 3, Date.today + 5]
%>
```

### Form Integration

```erb
<%= form_with model: @event do |f| %>
  <%= render "ui/calendar/calendar",
    name: "event[date]",
    selected: @event.date
  %>
  <%= f.submit "Save" %>
<% end %>
```

### Fixed 6-Week Display

```erb
<%= render "ui/calendar/calendar", fixed_weeks: true %>
```

### Hide Outside Days

```erb
<%= render "ui/calendar/calendar", show_outside_days: false %>
```

### Start from Specific Month

```erb
<%= render "ui/calendar/calendar", month: Date.new(2024, 12, 1) %>
```

### Combined Options

```erb
<%= render "ui/calendar/calendar",
  mode: :range,
  show_dropdowns: true,
  week_starts_on: 1,
  min_date: Date.today,
  number_of_months: 2
%>
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

### Mode accepts both Symbol and String

```erb
<%# Both work %>
<%= render "ui/calendar/calendar", mode: :range %>
<%= render "ui/calendar/calendar", mode: "range" %>
```

## Error Prevention

### Wrong: Using Phlex class syntax

```erb
<%= render UI::Calendar::Calendar.new %>
<%# This is Phlex syntax %>
```

### Correct: Use string path

```erb
<%= render "ui/calendar/calendar" %>
```

### Wrong: Using ViewComponent class syntax

```erb
<%= render UI::Calendar::CalendarComponent.new %>
<%# This is ViewComponent syntax %>
```

### Correct: Use string path for ERB

```erb
<%= render "ui/calendar/calendar" %>
```
