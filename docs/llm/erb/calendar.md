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

## Accessibility

Follows React Aria's calendar (`useCalendarGrid` / `useCalendarCell`):

- Each month is a `role="grid"` named by its visible month label (or by the month when dropdowns replace the label).
- Days are `<td role="gridcell">` with `aria-selected`; the button inside is named by the full localized date ("Friday, November 15, 2024"). Today has `aria-current="date"`.
- Disabled dates (`min_date`, `max_date`, `disabled_dates`) render `aria-disabled="true"` but stay focusable, so arrow keys move across them; they can't be selected.
- The grid is a single tab stop (roving `tabindex`): the focused day, defaulting to the first visible selected date, then today, then the 1st (or the nearest enabled date). `[data-date][tabindex="0"]` finds it.
- Keys: arrows (day/week), Home/End (week), PageUp/PageDown (month), Shift+PageUp/PageDown (year), Enter/Space (select). Keys pressed in the month/year selects are left to the selects.
- Month/year selects are labelled in the calendar's `locale` ("Month"/"mês"); native select month names are localized too.
- With `number_of_months > 1`, only the first month has a "previous" button and only the last a "next" one.
- The month-change animation is skipped under `prefers-reduced-motion: reduce`.

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
