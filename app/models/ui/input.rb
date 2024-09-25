class UI::Input < Phlex::HTML
  CLASS = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  def initialize(type: :email, **options)
    @type = type
    @options = options.symbolize_keys!
	end

  def view_template
    input(
      class: CLASS,
      type: @type,
      **@options
    )
  end
end
