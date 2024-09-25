function camelize(value) {
  return value.replace(/(?:[_-])([a-z0-9])/g, ((_, char) => char.toUpperCase()));
}

function namespaceCamelize(value) {
  return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dasherize(value) {
  return value.replace(/([A-Z])/g, ((_, char) => `-${char.toLowerCase()}`));
}

function isSomething(object) {
  return object !== null && object !== undefined;
}

function hasProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function readInheritableStaticArrayValues(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return Array.from(ancestors.reduce(((values, constructor) => {
    getOwnStaticArrayValues(constructor, propertyName).forEach((name => values.add(name)));
    return values;
  }), new Set));
}

function readInheritableStaticObjectPairs(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return ancestors.reduce(((pairs, constructor) => {
    pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
    return pairs;
  }), []);
}

function getAncestorsForConstructor(constructor) {
  const ancestors = [];
  while (constructor) {
    ancestors.push(constructor);
    constructor = Object.getPrototypeOf(constructor);
  }
  return ancestors.reverse();
}

function getOwnStaticArrayValues(constructor, propertyName) {
  const definition = constructor[propertyName];
  return Array.isArray(definition) ? definition : [];
}

function getOwnStaticObjectPairs(constructor, propertyName) {
  const definition = constructor[propertyName];
  return definition ? Object.keys(definition).map((key => [ key, definition[key] ])) : [];
}

(() => {
  function extendWithReflect(constructor) {
    function extended() {
      return Reflect.construct(constructor, arguments, new.target);
    }
    extended.prototype = Object.create(constructor.prototype, {
      constructor: {
        value: extended
      }
    });
    Reflect.setPrototypeOf(extended, constructor);
    return extended;
  }
  function testReflectExtension() {
    const a = function() {
      this.a.call(this);
    };
    const b = extendWithReflect(a);
    b.prototype.a = function() {};
    return new b;
  }
  try {
    testReflectExtension();
    return extendWithReflect;
  } catch (error) {
    return constructor => class extended extends constructor {};
  }
})();

({
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: identifier => `data-${identifier}-target`,
  outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
  keyMappings: Object.assign(Object.assign({
    enter: "Enter",
    tab: "Tab",
    esc: "Escape",
    space: " ",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    home: "Home",
    end: "End",
    page_up: "PageUp",
    page_down: "PageDown"
  }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c => [ c, c ])))), objectFromEntries("0123456789".split("").map((n => [ n, n ]))))
});

function objectFromEntries(array) {
  return array.reduce(((memo, [k, v]) => Object.assign(Object.assign({}, memo), {
    [k]: v
  })), {});
}

function ClassPropertiesBlessing(constructor) {
  const classes = readInheritableStaticArrayValues(constructor, "classes");
  return classes.reduce(((properties, classDefinition) => Object.assign(properties, propertiesForClassDefinition(classDefinition))), {});
}

function propertiesForClassDefinition(key) {
  return {
    [`${key}Class`]: {
      get() {
        const {classes: classes} = this;
        if (classes.has(key)) {
          return classes.get(key);
        } else {
          const attribute = classes.getAttributeName(key);
          throw new Error(`Missing attribute "${attribute}"`);
        }
      }
    },
    [`${key}Classes`]: {
      get() {
        return this.classes.getAll(key);
      }
    },
    [`has${capitalize(key)}Class`]: {
      get() {
        return this.classes.has(key);
      }
    }
  };
}

function OutletPropertiesBlessing(constructor) {
  const outlets = readInheritableStaticArrayValues(constructor, "outlets");
  return outlets.reduce(((properties, outletDefinition) => Object.assign(properties, propertiesForOutletDefinition(outletDefinition))), {});
}

function getOutletController(controller, element, identifier) {
  return controller.application.getControllerForElementAndIdentifier(element, identifier);
}

function getControllerAndEnsureConnectedScope(controller, element, outletName) {
  let outletController = getOutletController(controller, element, outletName);
  if (outletController) return outletController;
  controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
  outletController = getOutletController(controller, element, outletName);
  if (outletController) return outletController;
}

function propertiesForOutletDefinition(name) {
  const camelizedName = namespaceCamelize(name);
  return {
    [`${camelizedName}Outlet`]: {
      get() {
        const outletElement = this.outlets.find(name);
        const selector = this.outlets.getSelectorForOutletName(name);
        if (outletElement) {
          const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
          if (outletController) return outletController;
          throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
        }
        throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
      }
    },
    [`${camelizedName}Outlets`]: {
      get() {
        const outlets = this.outlets.findAll(name);
        if (outlets.length > 0) {
          return outlets.map((outletElement => {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController) return outletController;
            console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
          })).filter((controller => controller));
        }
        return [];
      }
    },
    [`${camelizedName}OutletElement`]: {
      get() {
        const outletElement = this.outlets.find(name);
        const selector = this.outlets.getSelectorForOutletName(name);
        if (outletElement) {
          return outletElement;
        } else {
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      }
    },
    [`${camelizedName}OutletElements`]: {
      get() {
        return this.outlets.findAll(name);
      }
    },
    [`has${capitalize(camelizedName)}Outlet`]: {
      get() {
        return this.outlets.has(name);
      }
    }
  };
}

function TargetPropertiesBlessing(constructor) {
  const targets = readInheritableStaticArrayValues(constructor, "targets");
  return targets.reduce(((properties, targetDefinition) => Object.assign(properties, propertiesForTargetDefinition(targetDefinition))), {});
}

function propertiesForTargetDefinition(name) {
  return {
    [`${name}Target`]: {
      get() {
        const target = this.targets.find(name);
        if (target) {
          return target;
        } else {
          throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
        }
      }
    },
    [`${name}Targets`]: {
      get() {
        return this.targets.findAll(name);
      }
    },
    [`has${capitalize(name)}Target`]: {
      get() {
        return this.targets.has(name);
      }
    }
  };
}

function ValuePropertiesBlessing(constructor) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
  const propertyDescriptorMap = {
    valueDescriptorMap: {
      get() {
        return valueDefinitionPairs.reduce(((result, valueDefinitionPair) => {
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
          return Object.assign(result, {
            [attributeName]: valueDescriptor
          });
        }), {});
      }
    }
  };
  return valueDefinitionPairs.reduce(((properties, valueDefinitionPair) => Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair))), propertyDescriptorMap);
}

function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
  const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
  const {key: key, name: name, reader: read, writer: write} = definition;
  return {
    [name]: {
      get() {
        const value = this.data.get(key);
        if (value !== null) {
          return read(value);
        } else {
          return definition.defaultValue;
        }
      },
      set(value) {
        if (value === undefined) {
          this.data.delete(key);
        } else {
          this.data.set(key, write(value));
        }
      }
    },
    [`has${capitalize(name)}`]: {
      get() {
        return this.data.has(key) || definition.hasCustomDefaultValue;
      }
    }
  };
}

function parseValueDefinitionPair([token, typeDefinition], controller) {
  return valueDescriptorForTokenAndTypeDefinition({
    controller: controller,
    token: token,
    typeDefinition: typeDefinition
  });
}

function parseValueTypeConstant(constant) {
  switch (constant) {
   case Array:
    return "array";

   case Boolean:
    return "boolean";

   case Number:
    return "number";

   case Object:
    return "object";

   case String:
    return "string";
  }
}

function parseValueTypeDefault(defaultValue) {
  switch (typeof defaultValue) {
   case "boolean":
    return "boolean";

   case "number":
    return "number";

   case "string":
    return "string";
  }
  if (Array.isArray(defaultValue)) return "array";
  if (Object.prototype.toString.call(defaultValue) === "[object Object]") return "object";
}

function parseValueTypeObject(payload) {
  const {controller: controller, token: token, typeObject: typeObject} = payload;
  const hasType = isSomething(typeObject.type);
  const hasDefault = isSomething(typeObject.default);
  const fullObject = hasType && hasDefault;
  const onlyType = hasType && !hasDefault;
  const onlyDefault = !hasType && hasDefault;
  const typeFromObject = parseValueTypeConstant(typeObject.type);
  const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
  if (onlyType) return typeFromObject;
  if (onlyDefault) return typeFromDefaultValue;
  if (typeFromObject !== typeFromDefaultValue) {
    const propertyPath = controller ? `${controller}.${token}` : token;
    throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
  }
  if (fullObject) return typeFromObject;
}

function parseValueTypeDefinition(payload) {
  const {controller: controller, token: token, typeDefinition: typeDefinition} = payload;
  const typeObject = {
    controller: controller,
    token: token,
    typeObject: typeDefinition
  };
  const typeFromObject = parseValueTypeObject(typeObject);
  const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
  const typeFromConstant = parseValueTypeConstant(typeDefinition);
  const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
  if (type) return type;
  const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
  throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
}

function defaultValueForDefinition(typeDefinition) {
  const constant = parseValueTypeConstant(typeDefinition);
  if (constant) return defaultValuesByType[constant];
  const hasDefault = hasProperty(typeDefinition, "default");
  const hasType = hasProperty(typeDefinition, "type");
  const typeObject = typeDefinition;
  if (hasDefault) return typeObject.default;
  if (hasType) {
    const {type: type} = typeObject;
    const constantFromType = parseValueTypeConstant(type);
    if (constantFromType) return defaultValuesByType[constantFromType];
  }
  return typeDefinition;
}

function valueDescriptorForTokenAndTypeDefinition(payload) {
  const {token: token, typeDefinition: typeDefinition} = payload;
  const key = `${dasherize(token)}-value`;
  const type = parseValueTypeDefinition(payload);
  return {
    type: type,
    key: key,
    name: camelize(key),
    get defaultValue() {
      return defaultValueForDefinition(typeDefinition);
    },
    get hasCustomDefaultValue() {
      return parseValueTypeDefault(typeDefinition) !== undefined;
    },
    reader: readers[type],
    writer: writers[type] || writers.default
  };
}

const defaultValuesByType = {
  get array() {
    return [];
  },
  boolean: false,
  number: 0,
  get object() {
    return {};
  },
  string: ""
};

const readers = {
  array(value) {
    const array = JSON.parse(value);
    if (!Array.isArray(array)) {
      throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
    }
    return array;
  },
  boolean(value) {
    return !(value == "0" || String(value).toLowerCase() == "false");
  },
  number(value) {
    return Number(value.replace(/_/g, ""));
  },
  object(value) {
    const object = JSON.parse(value);
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
    }
    return object;
  },
  string(value) {
    return value;
  }
};

const writers = {
  default: writeString,
  array: writeJSON,
  object: writeJSON
};

function writeJSON(value) {
  return JSON.stringify(value);
}

function writeString(value) {
  return `${value}`;
}

class Controller {
  constructor(context) {
    this.context = context;
  }
  static get shouldLoad() {
    return true;
  }
  static afterLoad(_identifier, _application) {
    return;
  }
  get application() {
    return this.context.application;
  }
  get scope() {
    return this.context.scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get targets() {
    return this.scope.targets;
  }
  get outlets() {
    return this.scope.outlets;
  }
  get classes() {
    return this.scope.classes;
  }
  get data() {
    return this.scope.data;
  }
  initialize() {}
  connect() {}
  disconnect() {}
  dispatch(eventName, {target: target = this.element, detail: detail = {}, prefix: prefix = this.identifier, bubbles: bubbles = true, cancelable: cancelable = true} = {}) {
    const type = prefix ? `${prefix}:${eventName}` : eventName;
    const event = new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      cancelable: cancelable
    });
    target.dispatchEvent(event);
    return event;
  }
}

Controller.blessings = [ ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing, OutletPropertiesBlessing ];

Controller.targets = [];

Controller.outlets = [];

Controller.values = {};

class radio_group_controller extends Controller {
  static targets=[ "radio", "input" ];
  connect() {
    this.radioClickHandlerBind = this.radioClickHandler.bind(this);
    this.radioTargets.forEach((x => x.addEventListener("click", this.radioClickHandlerBind, {
      capture: true
    })));
    if (this.checkedRadio() === undefined) {
      this.radioTargets.forEach((x => x.tabIndex = 0));
    }
  }
  disconnect() {
    this.radioTargets.forEach((x => x.removeEventListener("click", this.radioClickHandlerBind, {
      capture: true
    })));
  }
  checkedRadio() {
    this.radioTargets.find((x => x.checked));
  }
  radioClickHandler(e) {
    const buttonTargeted = this.radioTargets.find((x => x.contains(e.target)));
    if (buttonTargeted.ariaChecked === "true") {
      return true;
    }
    this.setButtonAsActive(buttonTargeted);
  }
  setButtonAsActive(button) {
    this.radioTargets.forEach((x => {
      const checked = x == button;
      if (checked) {
        this.radioMarkAsChecked(x);
      } else {
        this.radioMarkAsUnchecked(x);
      }
    }));
  }
  radioMarkAsChecked(radio) {
    radio.querySelector("span");
    radio.ariaChecked = true;
    radio.setAttribute("aria-checked", true);
    radio.tabIndex = 0;
    radio.focus();
    this.inputTarget.value = radio.value;
  }
  radioMarkAsUnchecked(radio) {
    radio.querySelector("span");
    radio.ariaChecked = false;
    radio.setAttribute("aria-checked", false);
    radio.tabIndex = -1;
  }
  handleKeyUp(e) {
    if (this.buttonInsideHasFocus()) {
      e.preventDefault();
      const currentFocused = this.focusedRadioButton();
      const buttonBeforeFocused = this.radioButtonBefore(currentFocused);
      this.setButtonAsActive(buttonBeforeFocused);
    }
  }
  handleKeyDown(e) {
    if (this.buttonInsideHasFocus()) {
      e.preventDefault();
      const currentFocused = this.focusedRadioButton();
      const buttonAfterFocused = this.radioButtonAfter(currentFocused);
      this.setButtonAsActive(buttonAfterFocused);
    }
  }
  handleKeyEsc(e) {
    if (this.buttonInsideHasFocus()) {
      const currentFocused = this.focusedRadioButton();
      currentFocused.blur();
    }
  }
  buttonInsideHasFocus(e) {
    let focusInside = false;
    this.radioTargets.forEach((x => {
      if (x == document.activeElement) {
        focusInside = true;
      }
    }));
    return focusInside;
  }
  focusedRadioButton() {
    return this.radioTargets.find((x => x == document.activeElement));
  }
  isFocusedFirstItem() {
    return this.focusedRadioButton() == this.radioTargets[0];
  }
  isFocusedLastItem() {
    return this.focusedRadioButton() == this.radioTargets[-1];
  }
  radioButtonAfter(button) {
    if (button == this.radioTargets.at(-1)) {
      return this.radioTargets.at(0);
    }
    const buttonIndex = this.radioTargets.findIndex((el => el == button));
    return this.radioTargets.at(buttonIndex + 1);
  }
  radioButtonBefore(button) {
    if (button == this.radioTargets.at(0)) {
      return this.radioTargets.at(-1);
    }
    const buttonIndex = this.radioTargets.findIndex((el => el == button));
    return this.radioTargets.at(buttonIndex - 1);
  }
}

class hello_controller extends Controller {
  connect() {
    this.element.textContent = "Hello From UIz8";
  }
}

export { hello_controller as HelloController, radio_group_controller as RadioGroupController };
