# UI

UI components organized on a way that makes sense to me, I'm mostly focused on backend, so probably what's here doesn't make sense at all.

This would not be possible without [ShadCN](https://ui.shadcn.com/), if you want to use on rails, please use [RBUI](https://github.com/rbui-labs/rbui) the people there are great and they know what they are doing!

## Usage

TBD

## Installation

Create a new Rails app

```bash
rails new ui-wrap-bun --javascript=bun --css=tailwind
```

Then add the gem on your Gemfile

```ruby
gem "ui", github: "fernandes/ui"
```

and also the NPM package.

```bash
yarn add @fernandes/ui
```

Please check our lookbook to see how to use the components.

## Contributing

Contribution directions go here.

## TODO

- [ ] Accordion : support opening just one or multiple items
- [ ] Breadcrumbs : Enable dropdown as breadcrumbs items
- [ ] Dropdown : with hover
- [ ] Dropdown : enable as links, not as select items

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
