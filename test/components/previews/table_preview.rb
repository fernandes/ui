class TablePreview < Lookbook::Preview
  def default
    render UI::Table.new(class: "w-[980px]") do |t|
      t.caption { "A list of your recent invoices." }
      t.thead do
        t.tr do
          t.th(class: "w-[100px]") { "Invoice" }
          t.th { "Status" }
          t.th { "Method" }
          t.th(class: "text-right") { "Amount" }
        end
      end

      t.tbody do
        items.map do |i|
          t.tr do
            t.td(class: "font-medium") { i[:invoice] }
            t.td { i[:paymentStatus] }
            t.td { i[:paymentMethod] }
            t.td(class: "text-right") { i[:totalAmount] }
          end
        end
      end

      t.tfoot do
        t.tr do
          t.td(colspan: 3) { "Total" }
          t.td(class: "text-right") { "2,500.00" }
        end
      end
    end
  end

  private

  def items
    [
      {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
      },
      {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
      },
      {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
      },
      {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
      },
      {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
      },
      {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
      },
      {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
      },
    ]
  end
end
