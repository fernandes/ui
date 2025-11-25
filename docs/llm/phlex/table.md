# Table Component - Phlex

Data table component with semantic HTML structure and DSL-style API.

## Basic Usage

```ruby
<%= render UI::Table::Table.new do |t|
  t.header do
    t.row do
      t.head { "Name" }
      t.head { "Email" }
    end
  end
  t.body do
    t.row do
      t.cell { "John Doe" }
      t.cell { "john@example.com" }
    end
  end
end %>
```

## Component Path

- **Class**: `UI::Table::Table`
- **File**: `app/components/ui/table/table.rb`
- **Behavior Module**: `UI::Table::TableBehavior`

## Sub-Components

| Component | Class | HTML Element |
|-----------|-------|--------------|
| Table | `UI::Table::Table` | `<table>` |
| Header | `UI::Table::Header` | `<thead>` |
| Body | `UI::Table::Body` | `<tbody>` |
| Footer | `UI::Table::Footer` | `<tfoot>` |
| Row | `UI::Table::Row` | `<tr>` |
| Head | `UI::Table::Head` | `<th>` |
| Cell | `UI::Table::Cell` | `<td>` |
| Caption | `UI::Table::Caption` | `<caption>` |

## Parameters (All Components)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## DSL Methods

The Table component uses a DSL pattern with `yield self`. Available methods:

### On `Table`
- `header` - Renders a `<thead>`
- `body` - Renders a `<tbody>`
- `footer` - Renders a `<tfoot>`
- `caption` - Renders a `<caption>`
- `row` - Renders a `<tr>`
- `head` - Renders a `<th>`
- `cell` - Renders a `<td>`

### On `Header`, `Body`, `Footer`
- `row` - Renders a `<tr>`
- `head` - Renders a `<th>`
- `cell` - Renders a `<td>`

### On `Row`
- `head` - Renders a `<th>`
- `cell` - Renders a `<td>`

## Examples

### Basic Table

```ruby
<%= render UI::Table::Table.new do |t|
  t.header do
    t.row do
      t.head { "Invoice" }
      t.head { "Status" }
      t.head { "Amount" }
    end
  end
  t.body do
    t.row do
      t.cell { "INV001" }
      t.cell { "Paid" }
      t.cell { "$250.00" }
    end
  end
end %>
```

### With Caption

```ruby
<%= render UI::Table::Table.new do |t|
  t.caption { "A list of your recent invoices." }
  t.header do
    t.row do
      t.head { "Invoice" }
      t.head { "Status" }
    end
  end
  t.body do
    t.row do
      t.cell { "INV001" }
      t.cell { "Paid" }
    end
  end
end %>
```

### With Footer

```ruby
<%= render UI::Table::Table.new do |t|
  t.header do
    t.row do
      t.head { "Item" }
      t.head { "Price" }
    end
  end
  t.body do
    t.row do
      t.cell { "Product A" }
      t.cell { "$100.00" }
    end
    t.row do
      t.cell { "Product B" }
      t.cell { "$150.00" }
    end
  end
  t.footer do
    t.row do
      t.cell { "Total" }
      t.cell { "$250.00" }
    end
  end
end %>
```

### Dynamic Data

```ruby
<%= render UI::Table::Table.new do |t|
  t.header do
    t.row do
      t.head { "Name" }
      t.head { "Email" }
      t.head { "Role" }
    end
  end
  t.body do
    @users.each do |user|
      t.row do
        t.cell { user.name }
        t.cell { user.email }
        t.cell { user.role }
      end
    end
  end
end %>
```

### With Custom Classes

```ruby
<%= render UI::Table::Table.new(classes: "min-w-full") do |t|
  t.header do
    t.row do
      t.head(classes: "w-[100px]") { "ID" }
      t.head(classes: "text-right") { "Amount" }
    end
  end
  t.body do
    t.row do
      t.cell(classes: "font-medium") { "INV001" }
      t.cell(classes: "text-right") { "$250.00" }
    end
  end
end %>
```

### With Attributes

```ruby
<%= render UI::Table::Table.new(id: "invoices-table", data: { controller: "sortable" }) do |t|
  t.header do
    t.row do
      t.head(data: { action: "click->sortable#sort" }) { "Name" }
      t.head { "Email" }
    end
  end
  t.body do
    t.row(data: { id: 1 }) do
      t.cell { "John" }
      t.cell { "john@example.com" }
    end
  end
end %>
```

## Common Patterns

### Invoice Table

```ruby
<%= render UI::Table::Table.new do |t|
  t.caption { "A list of your recent invoices." }
  t.header do
    t.row do
      t.head(classes: "w-[100px]") { "Invoice" }
      t.head { "Status" }
      t.head { "Method" }
      t.head(classes: "text-right") { "Amount" }
    end
  end
  t.body do
    @invoices.each do |invoice|
      t.row do
        t.cell(classes: "font-medium") { invoice.number }
        t.cell { invoice.status }
        t.cell { invoice.payment_method }
        t.cell(classes: "text-right") { number_to_currency(invoice.amount) }
      end
    end
  end
  t.footer do
    t.row do
      t.cell(colspan: 3) { "Total" }
      t.cell(classes: "text-right") { number_to_currency(@invoices.sum(&:amount)) }
    end
  end
end %>
```

## Error Prevention

### ❌ Wrong: Missing nested Table class

```ruby
<%= render UI::Table.new { } %>
# ERROR: undefined method 'new' for module UI::Table
```

### ✅ Correct: Use full path

```ruby
<%= render UI::Table::Table.new { |t| ... } %>  # Correct!
```

### ❌ Wrong: Forgetting to yield self

```ruby
<%= render UI::Table::Table.new do
  # This won't work - no 't' variable
  header { }
end %>
```

### ✅ Correct: Use block parameter

```ruby
<%= render UI::Table::Table.new do |t|
  t.header { }
end %>
```
