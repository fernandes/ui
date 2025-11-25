# Table Component - ViewComponent

Data table component with semantic HTML structure and slots-based DSL.

## Basic Usage

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Name" }
      r.head { "Email" }
    end
  end
  t.body do |b|
    b.row do |r|
      r.cell { "John Doe" }
      r.cell { "john@example.com" }
    end
  end
end %>
```

## Component Path

- **Class**: `UI::Table::TableComponent`
- **File**: `app/components/ui/table/table_component.rb`
- **Behavior Module**: `UI::Table::TableBehavior`

## Sub-Components

| Component | Class | HTML Element |
|-----------|-------|--------------|
| Table | `UI::Table::TableComponent` | `<table>` |
| Header | `UI::Table::HeaderComponent` | `<thead>` |
| Body | `UI::Table::BodyComponent` | `<tbody>` |
| Footer | `UI::Table::FooterComponent` | `<tfoot>` |
| Row | `UI::Table::RowComponent` | `<tr>` |
| Head | `UI::Table::HeadComponent` | `<th>` |
| Cell | `UI::Table::CellComponent` | `<td>` |
| Caption | `UI::Table::CaptionComponent` | `<caption>` |

## Parameters (All Components)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Slots API

The Table component uses ViewComponent slots. Methods are aliased for a friendlier API:

### On `TableComponent`
- `header` (alias for `with_table_header`) - Slot for `<thead>`
- `body` (alias for `with_table_body`) - Slot for `<tbody>`
- `footer` (alias for `with_table_footer`) - Slot for `<tfoot>`
- `caption` (alias for `with_table_caption`) - Slot for `<caption>`

### On `HeaderComponent`, `BodyComponent`, `FooterComponent`
- `row` (alias for `with_row`) - Slot for `<tr>`

### On `RowComponent`
- `head` (alias for `with_head`) - Slot for `<th>`
- `cell` (alias for `with_cell`) - Slot for `<td>`

## Examples

### Basic Table

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Invoice" }
      r.head { "Status" }
      r.head { "Amount" }
    end
  end
  t.body do |b|
    b.row do |r|
      r.cell { "INV001" }
      r.cell { "Paid" }
      r.cell { "$250.00" }
    end
  end
end %>
```

### With Caption

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.caption { "A list of your recent invoices." }
  t.header do |h|
    h.row do |r|
      r.head { "Invoice" }
      r.head { "Status" }
    end
  end
  t.body do |b|
    b.row do |r|
      r.cell { "INV001" }
      r.cell { "Paid" }
    end
  end
end %>
```

### With Footer

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Item" }
      r.head { "Price" }
    end
  end
  t.body do |b|
    b.row do |r|
      r.cell { "Product A" }
      r.cell { "$100.00" }
    end
    b.row do |r|
      r.cell { "Product B" }
      r.cell { "$150.00" }
    end
  end
  t.footer do |f|
    f.row do |r|
      r.cell { "Total" }
      r.cell { "$250.00" }
    end
  end
end %>
```

### Dynamic Data

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Name" }
      r.head { "Email" }
      r.head { "Role" }
    end
  end
  t.body do |b|
    @users.each do |user|
      b.row do |r|
        r.cell { user.name }
        r.cell { user.email }
        r.cell { user.role }
      end
    end
  end
end %>
```

### With Custom Classes

```erb
<%= render UI::Table::TableComponent.new(classes: "min-w-full") do |t|
  t.header do |h|
    h.row do |r|
      r.head(classes: "w-[100px]") { "ID" }
      r.head(classes: "text-right") { "Amount" }
    end
  end
  t.body do |b|
    b.row do |r|
      r.cell(classes: "font-medium") { "INV001" }
      r.cell(classes: "text-right") { "$250.00" }
    end
  end
end %>
```

### With Attributes

```erb
<%= render UI::Table::TableComponent.new(id: "invoices-table", data: { controller: "sortable" }) do |t|
  t.header do |h|
    h.row do |r|
      r.head(data: { action: "click->sortable#sort" }) { "Name" }
      r.head { "Email" }
    end
  end
  t.body do |b|
    b.row(data: { id: 1 }) do |r|
      r.cell { "John" }
      r.cell { "john@example.com" }
    end
  end
end %>
```

## Common Patterns

### Invoice Table

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.caption { "A list of your recent invoices." }
  t.header do |h|
    h.row do |r|
      r.head(classes: "w-[100px]") { "Invoice" }
      r.head { "Status" }
      r.head { "Method" }
      r.head(classes: "text-right") { "Amount" }
    end
  end
  t.body do |b|
    @invoices.each do |invoice|
      b.row do |r|
        r.cell(classes: "font-medium") { invoice.number }
        r.cell { invoice.status }
        r.cell { invoice.payment_method }
        r.cell(classes: "text-right") { number_to_currency(invoice.amount) }
      end
    end
  end
  t.footer do |f|
    f.row do |r|
      r.cell(colspan: 3) { "Total" }
      r.cell(classes: "text-right") { number_to_currency(@invoices.sum(&:amount)) }
    end
  end
end %>
```

## Error Prevention

### ❌ Wrong: Missing Component suffix

```erb
<%= render UI::Table::Table.new { } %>
# This is the Phlex component, not ViewComponent
```

### ✅ Correct: Use Component suffix

```erb
<%= render UI::Table::TableComponent.new { |t| ... } %>  # Correct!
```

### ❌ Wrong: Forgetting block parameter for nested slots

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do
    # No |h| parameter - can't call h.row
  end
end %>
```

### ✅ Correct: Use block parameters at each level

```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Name" }
    end
  end
end %>
```

## Note: Phlex vs ViewComponent Syntax

The ViewComponent version requires block parameters at each level (`|h|`, `|r|`, etc.) while Phlex shares the same context throughout:

**Phlex:**
```ruby
render UI::Table::Table.new do |t|
  t.header do
    t.row do
      t.head { "Name" }
    end
  end
end
```

**ViewComponent:**
```erb
<%= render UI::Table::TableComponent.new do |t|
  t.header do |h|
    h.row do |r|
      r.head { "Name" }
    end
  end
end %>
```
