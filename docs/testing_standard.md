# UI Engine - Testing Standard

Este documento define o padrão de testes de sistema para componentes da UI Engine, utilizando o padrão **COM (Component Object Model)** para criar uma experiência de teste consistente e reutilizável.

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura COM](#arquitetura-com)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
5. [Padrões de Element Classes](#padrões-de-element-classes)
6. [Integração Capybara + Playwright](#integração-capybara--playwright)
7. [Diretrizes de Acessibilidade (ARIA)](#diretrizes-de-acessibilidade-aria)
8. [Plano de Testes por Componente](#plano-de-testes-por-componente)
9. [Boas Práticas](#boas-práticas)

---

## Visão Geral

### Filosofia

O objetivo é criar testes de sistema que sejam:

- **Legíveis**: Qualquer desenvolvedor deve entender o teste sem conhecer a implementação
- **Reutilizáveis**: Elements encapsulam interações complexas para uso em múltiplos testes
- **Manuteníveis**: Mudanças na UI requerem alterações apenas nos Elements, não nos testes
- **Acessíveis**: Testes validam comportamento ARIA e navegação por teclado

### Analogia COM vs POM

| Page Object Model (POM) | Component Object Model (COM) |
|-------------------------|------------------------------|
| Abstrai páginas inteiras | Abstrai componentes individuais |
| `LoginPage#submit` | `ButtonElement#click` |
| Específico para fluxos | Reutilizável entre fluxos |
| Acoplado a URLs | Acoplado a seletores de componentes |

### Stack de Tecnologia

- **Capybara**: API principal para interações (métodos nativos sempre que possível)
- **Playwright**: Backend para navegador real (velocidade + recursos avançados)
- **capybara-playwright-driver**: Integração entre Capybara e Playwright
- **Minitest**: Framework de testes do Rails

---

## Arquitetura COM

### Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    System Tests                         │
│  test/system/components/accordion_test.rb               │
│  - Cenários de alto nível                               │
│  - Usa Elements para interações                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Element Classes                        │
│  test/support/elements/accordion_element.rb             │
│  - Encapsula interações específicas do componente       │
│  - Métodos semânticos (expand, collapse, toggle)        │
│  - Validações de estado (expanded?, collapsed?)         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Base Element                         │
│  test/support/elements/base_element.rb                  │
│  - Métodos comuns (visible?, has_text?, wait_for)       │
│  - Acesso ao Capybara node                              │
│  - Integração com Playwright para casos especiais       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Capybara + Playwright                     │
│  - Capybara para API de alto nível                      │
│  - Playwright para navegador real                       │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Interação

```ruby
# Test file
test "expande e colapsa item do accordion" do
  # 1. Localiza o componente via Capybara
  accordion = AccordionElement.new(find('[data-controller="ui--accordion"]'))

  # 2. Usa métodos semânticos do Element
  accordion.expand("item-1")

  # 3. Verifica estado através do Element
  assert accordion.item("item-1").expanded?
  assert_equal "Conteúdo do item 1", accordion.item("item-1").content_text
end
```

---

## Estrutura de Diretórios

```
test/
├── system/
│   └── components/
│       ├── accordion_test.rb
│       ├── alert_dialog_test.rb
│       ├── button_test.rb
│       ├── checkbox_test.rb
│       ├── combobox_test.rb
│       ├── dialog_test.rb
│       ├── dropdown_menu_test.rb
│       ├── select_test.rb
│       ├── tabs_test.rb
│       └── ...
│
├── support/
│   ├── elements/
│   │   ├── base_element.rb           # Classe base para todos os elements
│   │   ├── accordion_element.rb
│   │   ├── alert_dialog_element.rb
│   │   ├── button_element.rb
│   │   ├── checkbox_element.rb
│   │   ├── combobox_element.rb
│   │   ├── dialog_element.rb
│   │   ├── dropdown_menu_element.rb
│   │   ├── form_element.rb
│   │   ├── select_element.rb
│   │   ├── tabs_element.rb
│   │   └── ...
│   │
│   ├── helpers/
│   │   ├── keyboard_helper.rb        # Helpers para navegação por teclado
│   │   └── accessibility_helper.rb   # Helpers para validação ARIA
│   │
│   └── system_test_case.rb           # Base class para system tests
│
└── test_helper.rb
```

---

## Convenções de Nomenclatura

### Element Classes

| Convenção | Exemplo |
|-----------|---------|
| Sufixo `Element` | `AccordionElement`, `SelectElement` |
| Nome do componente em CamelCase | `AlertDialogElement`, `DropdownMenuElement` |
| Sub-elements com prefixo do parent | `AccordionItemElement`, `SelectOptionElement` |

### Métodos dos Elements

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Ações | Verbos no imperativo | `click`, `select`, `expand`, `submit` |
| Queries | Predicados com `?` | `expanded?`, `visible?`, `disabled?` |
| Getters | Substantivos | `value`, `text`, `selected_option` |
| Waiters | Prefixo `wait_for_` | `wait_for_visible`, `wait_for_expanded` |

### Arquivos de Teste

| Convenção | Exemplo |
|-----------|---------|
| Sufixo `_test.rb` | `accordion_test.rb` |
| Snake_case do componente | `alert_dialog_test.rb`, `dropdown_menu_test.rb` |

---

## Padrões de Element Classes

### BaseElement

```ruby
# test/support/elements/base_element.rb

module UI
  module Testing
    class BaseElement
      include Capybara::DSL

      attr_reader :node

      def initialize(node)
        @node = node
      end

      # === Delegações ao Capybara Node ===

      delegate :text, :visible?, :click, :[], to: :node

      # === Queries Comuns ===

      def has_text?(content)
        node.has_text?(content)
      end

      def has_class?(class_name)
        node[:class]&.include?(class_name)
      end

      def data_state
        node["data-state"]
      end

      def aria_expanded?
        node["aria-expanded"] == "true"
      end

      def aria_disabled?
        node["aria-disabled"] == "true"
      end

      def disabled?
        node.disabled? || aria_disabled?
      end

      # === Waiters ===

      def wait_for_visible(timeout: Capybara.default_max_wait_time)
        Capybara.using_wait_time(timeout) do
          raise "Element not visible" unless node.visible?
        end
      end

      def wait_for_hidden(timeout: Capybara.default_max_wait_time)
        Capybara.using_wait_time(timeout) do
          raise "Element still visible" if node.visible?
        end
      end

      def wait_for_state(state, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return if data_state == state
          raise "Timeout waiting for state '#{state}'" if Time.now - start_time > timeout
          sleep 0.1
        end
      end

      # === Keyboard Navigation ===

      def focus
        node.send_keys([])  # Foca o elemento
      end

      def send_keys(*keys)
        node.send_keys(*keys)
      end

      def press_enter
        send_keys(:enter)
      end

      def press_escape
        send_keys(:escape)
      end

      def press_space
        send_keys(:space)
      end

      def press_tab
        send_keys(:tab)
      end

      def press_arrow_down
        send_keys(:down)
      end

      def press_arrow_up
        send_keys(:up)
      end

      # === Playwright Access (para casos especiais) ===

      def playwright_page
        Capybara.current_session.driver.browser
      end

      protected

      def within_node(&block)
        within(node, &block)
      end

      def find_within(selector, **options)
        node.find(selector, **options)
      end

      def all_within(selector, **options)
        node.all(selector, **options)
      end
    end
  end
end
```

### Exemplo: SelectElement

```ruby
# test/support/elements/select_element.rb

module UI
  module Testing
    class SelectElement < BaseElement
      # === Ações ===

      def open
        trigger.click unless open?
      end

      def close
        press_escape if open?
      end

      def select(option_text)
        open
        option = find_option(option_text)
        option.click
        wait_for_closed
      end

      def select_by_value(value)
        open
        option = find_option_by_value(value)
        option.click
        wait_for_closed
      end

      # === Queries ===

      def open?
        trigger["aria-expanded"] == "true"
      end

      def closed?
        !open?
      end

      def selected
        trigger.text.strip
      end

      def selected_value
        trigger["data-value"]
      end

      def options
        ensure_open
        content.all('[role="option"]').map(&:text)
      end

      def option_values
        ensure_open
        content.all('[role="option"]').map { |opt| opt["data-value"] }
      end

      def has_option?(text)
        options.include?(text)
      end

      def option_count
        options.size
      end

      def placeholder
        trigger["data-placeholder"]
      end

      def has_placeholder?
        selected == placeholder
      end

      # === Keyboard Navigation ===

      def select_with_keyboard(option_text)
        focus_trigger
        press_enter  # Abre o select

        # Navega até a opção
        options.each_with_index do |opt, index|
          break if opt == option_text
          press_arrow_down
        end

        press_enter  # Seleciona
      end

      # === Sub-elements ===

      def trigger
        find_within('[data-ui-select-target="trigger"]')
      end

      def content
        # Content é renderizado no portal, fora do node
        page.find('[data-ui-select-target="content"]', visible: true)
      end

      private

      def ensure_open
        open unless open?
      end

      def find_option(text)
        content.find('[role="option"]', text: text)
      end

      def find_option_by_value(value)
        content.find("[role='option'][data-value='#{value}']")
      end

      def focus_trigger
        trigger.send_keys([])
      end

      def wait_for_closed(timeout: 2)
        start_time = Time.now
        loop do
          return if closed?
          raise "Select did not close" if Time.now - start_time > timeout
          sleep 0.1
        end
      end
    end
  end
end
```

### Exemplo: AccordionElement

```ruby
# test/support/elements/accordion_element.rb

module UI
  module Testing
    class AccordionElement < BaseElement
      # === Ações ===

      def expand(item_value)
        item = item(item_value)
        item.expand unless item.expanded?
      end

      def collapse(item_value)
        item = item(item_value)
        item.collapse if item.expanded?
      end

      def toggle(item_value)
        item(item_value).toggle
      end

      def expand_all
        items.each { |item| item.expand unless item.expanded? }
      end

      def collapse_all
        items.each { |item| item.collapse if item.expanded? }
      end

      # === Queries ===

      def type
        node["data-accordion-type-value"] || "single"
      end

      def single?
        type == "single"
      end

      def multiple?
        type == "multiple"
      end

      def collapsible?
        node["data-accordion-collapsible-value"] == "true"
      end

      def expanded_items
        items.select(&:expanded?)
      end

      def expanded_item_values
        expanded_items.map(&:value)
      end

      # === Sub-elements ===

      def item(value)
        AccordionItemElement.new(
          find_within("[data-accordion-value='#{value}']")
        )
      end

      def items
        all_within('[data-accordion-value]').map do |node|
          AccordionItemElement.new(node)
        end
      end
    end

    class AccordionItemElement < UI::Testing::BaseElement
      # === Ações ===

      def expand
        trigger.click unless expanded?
        wait_for_state("open")
      end

      def collapse
        trigger.click if expanded?
        wait_for_state("closed")
      end

      def toggle
        trigger.click
      end

      # === Queries ===

      def value
        node["data-accordion-value"]
      end

      def expanded?
        data_state == "open"
      end

      def collapsed?
        data_state == "closed"
      end

      def title
        trigger.text
      end

      def content_text
        content.text
      end

      def content_visible?
        content.visible?
      end

      # === Sub-elements ===

      def trigger
        find_within('[data-ui-accordion-target="trigger"]')
      end

      def content
        find_within('[data-ui-accordion-target="content"]')
      end
    end
  end
end
```

### Exemplo: DialogElement

```ruby
# test/support/elements/dialog_element.rb

module UI
  module Testing
    class DialogElement < BaseElement
      # === Ações ===

      def open
        trigger.click unless open?
        wait_for_state("open")
      end

      def close
        close_button.click if open?
        wait_for_state("closed")
      end

      def close_with_escape
        press_escape if open?
        wait_for_state("closed")
      end

      def close_by_overlay_click
        overlay.click if open?
        wait_for_state("closed")
      end

      # === Queries ===

      def open?
        data_state == "open"
      end

      def closed?
        data_state == "closed"
      end

      def title
        content.find('[data-ui-dialog-target="title"]').text
      end

      def description
        content.find('[data-ui-dialog-target="description"]').text
      end

      def has_close_button?
        content.has_css?('[data-ui-dialog-target="close"]')
      end

      # === Sub-elements ===

      def trigger
        find_within('[data-ui-dialog-target="trigger"]')
      end

      def overlay
        page.find('[data-ui-dialog-target="overlay"]')
      end

      def content
        page.find('[data-ui-dialog-target="content"]')
      end

      def close_button
        content.find('[data-ui-dialog-target="close"]')
      end

      # === Focus Management ===

      def focused_element
        page.evaluate_script("document.activeElement")
      end

      def focus_trapped?
        # Verifica se o foco está dentro do dialog
        content.native.evaluate("this.contains(document.activeElement)")
      end
    end
  end
end
```

### Exemplo: FormElement

```ruby
# test/support/elements/form_element.rb

module UI
  module Testing
    class FormElement < BaseElement
      # === Ações ===

      def submit
        node.find('[type="submit"]').click
      rescue Capybara::ElementNotFound
        node.find('button:last-of-type').click
      end

      def reset
        node.find('[type="reset"]').click
      end

      def fill_field(label_or_name, value)
        within_node do
          fill_in(label_or_name, with: value)
        end
      end

      def check_field(label)
        within_node do
          check(label)
        end
      end

      def uncheck_field(label)
        within_node do
          uncheck(label)
        end
      end

      def select_option(label, option)
        within_node do
          select(option, from: label)
        end
      end

      # === Queries ===

      def field_value(label_or_name)
        within_node do
          find_field(label_or_name).value
        end
      end

      def has_field?(label_or_name)
        within_node do
          page.has_field?(label_or_name)
        end
      end

      def has_error?(message)
        node.has_css?('.error, [data-error]', text: message)
      end

      def errors
        node.all('.error, [data-error]').map(&:text)
      end

      def valid?
        errors.empty?
      end

      def action
        node["action"]
      end

      def method
        node["method"]
      end
    end
  end
end
```

---

## Integração Capybara + Playwright

### Configuração

```ruby
# test/support/system_test_case.rb

require "test_helper"
require "capybara-playwright-driver"

module UI
  class SystemTestCase < ActionDispatch::SystemTestCase
    # Registra o driver Playwright
    Capybara.register_driver(:playwright) do |app|
      Capybara::Playwright::Driver.new(app,
        browser_type: :chromium,
        headless: ENV["HEADLESS"] != "false",
        timeout: 30,
        args: ["--disable-dev-shm-usage"]
      )
    end

    driven_by :playwright

    # Configurações globais
    Capybara.default_max_wait_time = 5
    Capybara.save_path = Rails.root.join("tmp/capybara")

    # Setup comum para todos os testes
    setup do
      # Visita a página de showcase por padrão
      visit "/components"
    end

    # Helper para acessar página específica de componente
    def visit_component(name)
      visit "/components/#{name}"
    end

    # Helper para encontrar e criar Element
    def find_element(klass, selector = nil)
      selector ||= klass::DEFAULT_SELECTOR if klass.const_defined?(:DEFAULT_SELECTOR)
      klass.new(find(selector))
    end

    # Helper para múltiplos elements
    def all_elements(klass, selector = nil)
      selector ||= klass::DEFAULT_SELECTOR if klass.const_defined?(:DEFAULT_SELECTOR)
      all(selector).map { |node| klass.new(node) }
    end
  end
end

# Require all elements
Dir[Rails.root.join("test/support/elements/**/*.rb")].each { |f| require f }
```

### Quando usar Playwright diretamente

Use métodos nativos do Capybara sempre que possível. Playwright direto apenas para:

1. **Interceptação de rede**
2. **Manipulação de cookies/storage complexa**
3. **Screenshots/videos**
4. **Geolocation/permissions**
5. **Avaliação de JavaScript complexo**

```ruby
# ✅ BOM - Usa Capybara
node.click
node.fill_in("email", with: "user@example.com")
node.has_text?("Success")

# ✅ BOM - Playwright para casos especiais
def capture_screenshot(name)
  playwright_page.screenshot(path: "tmp/screenshots/#{name}.png")
end

def intercept_api_request
  playwright_page.route("**/api/**") do |route|
    route.fulfill(status: 200, body: '{"mocked": true}')
  end
end

# ❌ RUIM - Playwright para operações simples
playwright_page.click("button")  # Use Capybara
```

---

## Diretrizes de Acessibilidade (ARIA)

### Checklist por Tipo de Componente

#### Componentes Interativos (Button, Checkbox, Switch)

- [ ] `role` apropriado quando não é elemento nativo
- [ ] `aria-pressed` para toggles
- [ ] `aria-checked` para checkboxes
- [ ] `aria-disabled` sincronizado com `disabled`
- [ ] Focável via teclado
- [ ] Responde a Enter/Space

#### Componentes de Disclosure (Accordion, Collapsible)

- [ ] `aria-expanded` no trigger
- [ ] `aria-controls` aponta para content
- [ ] `id` no content matches `aria-controls`
- [ ] Estado visual sincronizado com ARIA

#### Componentes de Seleção (Select, Combobox)

- [ ] `role="listbox"` no container de opções
- [ ] `role="option"` em cada opção
- [ ] `aria-selected` na opção selecionada
- [ ] `aria-activedescendant` para highlight
- [ ] Navegação por setas funcional

#### Componentes Modais (Dialog, AlertDialog, Sheet)

- [ ] `role="dialog"` ou `role="alertdialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` aponta para título
- [ ] `aria-describedby` aponta para descrição
- [ ] Focus trap implementado
- [ ] Fecha com Escape
- [ ] Focus retorna ao trigger ao fechar

#### Componentes de Navegação (Tabs, Menu)

- [ ] `role="tablist"` no container
- [ ] `role="tab"` em cada tab
- [ ] `role="tabpanel"` em cada painel
- [ ] `aria-selected` na tab ativa
- [ ] `aria-controls` liga tab ao painel
- [ ] Navegação por setas entre tabs

### Helper para Validação ARIA

```ruby
# test/support/helpers/accessibility_helper.rb

module UI
  module AccessibilityHelper
    # Valida atributos ARIA obrigatórios
    def assert_aria_attributes(element, **expected)
      expected.each do |attr, value|
        actual = element["aria-#{attr}"]
        assert_equal value.to_s, actual,
          "Expected aria-#{attr}='#{value}', got '#{actual}'"
      end
    end

    # Valida que elemento é focável
    def assert_focusable(element)
      tab_index = element["tabindex"]
      focusable_tags = %w[a button input select textarea]

      assert(
        focusable_tags.include?(element.tag_name) ||
        (tab_index && tab_index.to_i >= 0),
        "Element should be focusable"
      )
    end

    # Valida role
    def assert_role(element, expected_role)
      actual_role = element["role"]
      assert_equal expected_role, actual_role,
        "Expected role='#{expected_role}', got '#{actual_role}'"
    end

    # Valida que IDs de aria-controls existem
    def assert_aria_controls_exists(element)
      controls_id = element["aria-controls"]
      return unless controls_id

      assert page.has_css?("##{controls_id}"),
        "aria-controls='#{controls_id}' references non-existent element"
    end

    # Valida focus trap em modal
    def assert_focus_trapped(modal_element)
      # Tenta tab múltiplas vezes
      10.times do
        page.send_keys(:tab)
        focused = page.evaluate_script("document.activeElement")

        # Verifica se elemento focado está dentro do modal
        within_modal = modal_element.native.evaluate(
          "this.contains(document.activeElement)"
        )

        assert within_modal, "Focus escaped modal"
      end
    end

    # Valida navegação por teclado
    def assert_keyboard_navigable(element, key:, expected_focus:)
      element.send_keys(key)

      # Aguarda mudança de foco
      sleep 0.1

      focused_text = page.evaluate_script("document.activeElement.textContent")
      assert_includes focused_text, expected_focus,
        "Expected focus on '#{expected_focus}', got '#{focused_text}'"
    end
  end
end
```

---

## Plano de Testes por Componente

### Prioridade Alta (Componentes Complexos)

| Componente | Element Class | Testes Necessários | Status |
|------------|---------------|-------------------|--------|
| Select | `SelectElement` | open/close, select, keyboard nav, ARIA | ⬜ |
| Combobox | `ComboboxElement` | search, filter, select, ARIA | ⬜ |
| Dialog | `DialogElement` | open/close, focus trap, ARIA | ⬜ |
| AlertDialog | `AlertDialogElement` | open/close, confirm/cancel, ARIA | ⬜ |
| Accordion | `AccordionElement` | expand/collapse, single/multiple, ARIA | ⬜ |
| Tabs | `TabsElement` | switch tabs, keyboard nav, ARIA | ⬜ |
| DropdownMenu | `DropdownMenuElement` | open/close, submenus, keyboard nav | ⬜ |
| ContextMenu | `ContextMenuElement` | right-click, keyboard nav | ⬜ |
| Command | `CommandElement` | search, keyboard nav, groups | ⬜ |

### Prioridade Média (Componentes de Formulário)

| Componente | Element Class | Testes Necessários | Status |
|------------|---------------|-------------------|--------|
| Checkbox | `CheckboxElement` | check/uncheck, disabled, ARIA | ⬜ |
| Switch | `SwitchElement` | toggle, disabled, ARIA | ⬜ |
| Slider | `SliderElement` | drag, keyboard, min/max, ARIA | ⬜ |
| Input | `InputElement` | type, validation, disabled | ⬜ |
| Textarea | `TextareaElement` | type, resize, validation | ⬜ |
| RadioButton | `RadioButtonElement` | select, group, ARIA | ⬜ |
| Toggle | `ToggleElement` | toggle, pressed state, ARIA | ⬜ |
| ToggleGroup | `ToggleGroupElement` | single/multiple, ARIA | ⬜ |
| InputOTP | `InputOtpElement` | digits, paste, complete | ⬜ |

### Prioridade Baixa (Componentes de Display)

| Componente | Element Class | Testes Necessários | Status |
|------------|---------------|-------------------|--------|
| Button | `ButtonElement` | click, variants, disabled | ⬜ |
| Avatar | `AvatarElement` | image load, fallback | ⬜ |
| Badge | `BadgeElement` | variants, content | ⬜ |
| Alert | `AlertElement` | variants, icon, content | ⬜ |
| Card | `CardElement` | structure, content | ⬜ |
| Tooltip | `TooltipElement` | hover, content, position | ⬜ |
| Popover | `PopoverElement` | open/close, content | ⬜ |
| HoverCard | `HoverCardElement` | hover trigger, content | ⬜ |
| Progress | `ProgressElement` | value, animation | ⬜ |
| Skeleton | `SkeletonElement` | animation | ⬜ |
| Separator | `SeparatorElement` | orientation | ⬜ |

### Componentes Compostos (Dependem de outros)

| Componente | Element Class | Dependências | Status |
|------------|---------------|--------------|--------|
| Sheet | `SheetElement` | Dialog | ⬜ |
| Drawer | `DrawerElement` | Dialog | ⬜ |
| Menubar | `MenubarElement` | DropdownMenu | ⬜ |
| NavigationMenu | `NavigationMenuElement` | - | ⬜ |
| Carousel | `CarouselElement` | - | ⬜ |
| Collapsible | `CollapsibleElement` | - | ⬜ |
| ScrollArea | `ScrollAreaElement` | - | ⬜ |
| Resizable | `ResizableElement` | - | ⬜ |

---

## Boas Práticas

### DO ✅

```ruby
# Usa métodos semânticos do Element
select.select("Apple")
dialog.close_with_escape
accordion.expand("item-1")

# Assertions claras
assert select.selected == "Apple"
assert dialog.closed?
assert accordion.item("item-1").expanded?

# Testa acessibilidade
assert_aria_attributes(trigger, expanded: true)
assert_focusable(button)

# Agrupa testes relacionados
test "select: keyboard navigation" do
  select.focus_trigger
  select.press_enter
  select.press_arrow_down
  select.press_enter

  assert_equal "Banana", select.selected
end

# Usa data attributes para seletores (estáveis)
find('[data-controller="ui--select"]')
find('[data-ui-select-target="trigger"]')
```

### DON'T ❌

```ruby
# ❌ Não usa CSS classes para seletores (instáveis)
find('.flex.items-center.justify-between')

# ❌ Não usa sleeps arbitrários
sleep 2
button.click

# ❌ Não testa implementação interna
assert node["data-internal-state"] == "loading"

# ❌ Não duplica lógica do Element no teste
trigger = find('[data-ui-select-target="trigger"]')
trigger.click
options = all('[role="option"]')
options.first.click

# ❌ Não ignora acessibilidade
test "select works" do
  select.select("Apple")
  assert select.selected == "Apple"
  # Falta testar keyboard nav e ARIA
end
```

### Estrutura de Teste Recomendada

```ruby
# test/system/components/select_test.rb

require "test_helper"

class SelectTest < UI::SystemTestCase
  setup do
    visit_component("select")
  end

  # === Testes de Interação Básica ===

  test "selects an option by clicking" do
    select = find_element(SelectElement, "#fruits-select")

    select.select("Apple")

    assert_equal "Apple", select.selected
  end

  test "opens and closes dropdown" do
    select = find_element(SelectElement, "#fruits-select")

    select.open
    assert select.open?

    select.close
    assert select.closed?
  end

  # === Testes de Keyboard Navigation ===

  test "navigates options with arrow keys" do
    select = find_element(SelectElement, "#fruits-select")

    select.select_with_keyboard("Banana")

    assert_equal "Banana", select.selected
  end

  test "closes with escape key" do
    select = find_element(SelectElement, "#fruits-select")

    select.open
    select.press_escape

    assert select.closed?
  end

  # === Testes de Acessibilidade ===

  test "trigger has correct ARIA attributes" do
    select = find_element(SelectElement, "#fruits-select")

    assert_aria_attributes(select.trigger,
      haspopup: "listbox",
      expanded: false
    )

    select.open

    assert_aria_attributes(select.trigger,
      expanded: true
    )
  end

  test "options have correct ARIA roles" do
    select = find_element(SelectElement, "#fruits-select")
    select.open

    content = select.content
    assert_role(content, "listbox")

    options = content.all('[role="option"]')
    assert options.any?, "Should have options with role='option'"
  end

  # === Testes de Edge Cases ===

  test "handles disabled state" do
    select = find_element(SelectElement, "#disabled-select")

    assert select.disabled?

    select.open  # Should not open
    assert select.closed?
  end

  test "shows placeholder when no selection" do
    select = find_element(SelectElement, "#placeholder-select")

    assert select.has_placeholder?
    assert_equal "Select a fruit...", select.placeholder
  end
end
```

---

## Executando os Testes

```bash
# Todos os testes de sistema
bin/rails test:system

# Teste específico de componente
bin/rails test test/system/components/select_test.rb

# Com browser visível (não headless)
HEADLESS=false bin/rails test:system

# Teste específico
bin/rails test test/system/components/select_test.rb:15
```

---

## Próximos Passos

1. [ ] Configurar Capybara + Playwright no projeto
2. [ ] Implementar `BaseElement` e helpers
3. [ ] Criar Elements para componentes de alta prioridade
4. [ ] Escrever testes para Select (componente modelo)
5. [ ] Documentar padrões adicionais conforme necessário
