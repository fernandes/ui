(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.UI = {}));
})(this, (function(exports) {
  "use strict";
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
  class accordion_controller extends Controller {
    connect() {
      this.element.textContent = "Hello from Accordion";
    }
  }
  function addUniqueItem(array, item) {
    array.indexOf(item) === -1 && array.push(item);
  }
  const clamp = (min, max, v) => Math.min(Math.max(v, min), max);
  const defaults = {
    duration: .3,
    delay: 0,
    endDelay: 0,
    repeat: 0,
    easing: "ease"
  };
  const isNumber = value => typeof value === "number";
  const isEasingList = easing => Array.isArray(easing) && !isNumber(easing[0]);
  const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
  };
  function getEasingForSegment(easing, i) {
    return isEasingList(easing) ? easing[wrap(0, easing.length, i)] : easing;
  }
  const mix = (min, max, progress) => -progress * min + progress * max + min;
  const noop = () => {};
  const noopReturn = v => v;
  const progress = (min, max, value) => max - min === 0 ? 1 : (value - min) / (max - min);
  function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
      const offsetProgress = progress(0, remaining, i);
      offset.push(mix(min, 1, offsetProgress));
    }
  }
  function defaultOffset(length) {
    const offset = [ 0 ];
    fillOffset(offset, length - 1);
    return offset;
  }
  function interpolate(output, input = defaultOffset(output.length), easing = noopReturn) {
    const length = output.length;
    const remainder = length - input.length;
    remainder > 0 && fillOffset(input, remainder);
    return t => {
      let i = 0;
      for (;i < length - 2; i++) {
        if (t < input[i + 1]) break;
      }
      let progressInRange = clamp(0, 1, progress(input[i], input[i + 1], t));
      const segmentEasing = getEasingForSegment(easing, i);
      progressInRange = segmentEasing(progressInRange);
      return mix(output[i], output[i + 1], progressInRange);
    };
  }
  const isCubicBezier = easing => Array.isArray(easing) && isNumber(easing[0]);
  const isEasingGenerator = easing => typeof easing === "object" && Boolean(easing.createAnimation);
  const isFunction = value => typeof value === "function";
  const isString = value => typeof value === "string";
  const time = {
    ms: seconds => seconds * 1e3,
    s: milliseconds => milliseconds / 1e3
  };
  const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
  const subdivisionPrecision = 1e-7;
  const subdivisionMaxIterations = 12;
  function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
      currentT = lowerBound + (upperBound - lowerBound) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0) {
        upperBound = currentT;
      } else {
        lowerBound = currentT;
      }
    } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
    return currentT;
  }
  function cubicBezier(mX1, mY1, mX2, mY2) {
    if (mX1 === mY1 && mX2 === mY2) return noopReturn;
    const getTForX = aX => binarySubdivide(aX, 0, 1, mX1, mX2);
    return t => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
  }
  const steps = (steps, direction = "end") => progress => {
    progress = direction === "end" ? Math.min(progress, .999) : Math.max(progress, .001);
    const expanded = progress * steps;
    const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
    return clamp(0, 1, rounded / steps);
  };
  const namedEasings = {
    ease: cubicBezier(.25, .1, .25, 1),
    "ease-in": cubicBezier(.42, 0, 1, 1),
    "ease-in-out": cubicBezier(.42, 0, .58, 1),
    "ease-out": cubicBezier(0, 0, .58, 1)
  };
  const functionArgsRegex = /\((.*?)\)/;
  function getEasingFunction(definition) {
    if (isFunction(definition)) return definition;
    if (isCubicBezier(definition)) return cubicBezier(...definition);
    const namedEasing = namedEasings[definition];
    if (namedEasing) return namedEasing;
    if (definition.startsWith("steps")) {
      const args = functionArgsRegex.exec(definition);
      if (args) {
        const argsArray = args[1].split(",");
        return steps(parseFloat(argsArray[0]), argsArray[1].trim());
      }
    }
    return noopReturn;
  }
  class Animation {
    constructor(output, keyframes = [ 0, 1 ], {easing: easing, duration: initialDuration = defaults.duration, delay: delay = defaults.delay, endDelay: endDelay = defaults.endDelay, repeat: repeat = defaults.repeat, offset: offset, direction: direction = "normal", autoplay: autoplay = true} = {}) {
      this.startTime = null;
      this.rate = 1;
      this.t = 0;
      this.cancelTimestamp = null;
      this.easing = noopReturn;
      this.duration = 0;
      this.totalDuration = 0;
      this.repeat = 0;
      this.playState = "idle";
      this.finished = new Promise(((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      }));
      easing = easing || defaults.easing;
      if (isEasingGenerator(easing)) {
        const custom = easing.createAnimation(keyframes);
        easing = custom.easing;
        keyframes = custom.keyframes || keyframes;
        initialDuration = custom.duration || initialDuration;
      }
      this.repeat = repeat;
      this.easing = isEasingList(easing) ? noopReturn : getEasingFunction(easing);
      this.updateDuration(initialDuration);
      const interpolate$1 = interpolate(keyframes, offset, isEasingList(easing) ? easing.map(getEasingFunction) : noopReturn);
      this.tick = timestamp => {
        var _a;
        delay = delay;
        let t = 0;
        if (this.pauseTime !== undefined) {
          t = this.pauseTime;
        } else {
          t = (timestamp - this.startTime) * this.rate;
        }
        this.t = t;
        t /= 1e3;
        t = Math.max(t - delay, 0);
        if (this.playState === "finished" && this.pauseTime === undefined) {
          t = this.totalDuration;
        }
        const progress = t / this.duration;
        let currentIteration = Math.floor(progress);
        let iterationProgress = progress % 1;
        if (!iterationProgress && progress >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        const iterationIsOdd = currentIteration % 2;
        if (direction === "reverse" || direction === "alternate" && iterationIsOdd || direction === "alternate-reverse" && !iterationIsOdd) {
          iterationProgress = 1 - iterationProgress;
        }
        const p = t >= this.totalDuration ? 1 : Math.min(iterationProgress, 1);
        const latest = interpolate$1(this.easing(p));
        output(latest);
        const isAnimationFinished = this.pauseTime === undefined && (this.playState === "finished" || t >= this.totalDuration + endDelay);
        if (isAnimationFinished) {
          this.playState = "finished";
          (_a = this.resolve) === null || _a === void 0 ? void 0 : _a.call(this, latest);
        } else if (this.playState !== "idle") {
          this.frameRequestId = requestAnimationFrame(this.tick);
        }
      };
      if (autoplay) this.play();
    }
    play() {
      const now = performance.now();
      this.playState = "running";
      if (this.pauseTime !== undefined) {
        this.startTime = now - this.pauseTime;
      } else if (!this.startTime) {
        this.startTime = now;
      }
      this.cancelTimestamp = this.startTime;
      this.pauseTime = undefined;
      this.frameRequestId = requestAnimationFrame(this.tick);
    }
    pause() {
      this.playState = "paused";
      this.pauseTime = this.t;
    }
    finish() {
      this.playState = "finished";
      this.tick(0);
    }
    stop() {
      var _a;
      this.playState = "idle";
      if (this.frameRequestId !== undefined) {
        cancelAnimationFrame(this.frameRequestId);
      }
      (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, false);
    }
    cancel() {
      this.stop();
      this.tick(this.cancelTimestamp);
    }
    reverse() {
      this.rate *= -1;
    }
    commitStyles() {}
    updateDuration(duration) {
      this.duration = duration;
      this.totalDuration = duration * (this.repeat + 1);
    }
    get currentTime() {
      return this.t;
    }
    set currentTime(t) {
      if (this.pauseTime !== undefined || this.rate === 0) {
        this.pauseTime = t;
      } else {
        this.startTime = performance.now() - t / this.rate;
      }
    }
    get playbackRate() {
      return this.rate;
    }
    set playbackRate(rate) {
      this.rate = rate;
    }
  }
  var invariant = function() {};
  if (process.env.NODE_ENV !== "production") {
    invariant = function(check, message) {
      if (!check) {
        throw new Error(message);
      }
    };
  }
  class MotionValue {
    setAnimation(animation) {
      this.animation = animation;
      animation === null || animation === void 0 ? void 0 : animation.finished.then((() => this.clearAnimation())).catch((() => {}));
    }
    clearAnimation() {
      this.animation = this.generator = undefined;
    }
  }
  const data = new WeakMap;
  function getAnimationData(element) {
    if (!data.has(element)) {
      data.set(element, {
        transforms: [],
        values: new Map
      });
    }
    return data.get(element);
  }
  function getMotionValue(motionValues, name) {
    if (!motionValues.has(name)) {
      motionValues.set(name, new MotionValue);
    }
    return motionValues.get(name);
  }
  const axes = [ "", "X", "Y", "Z" ];
  const order = [ "translate", "scale", "rotate", "skew" ];
  const transformAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ"
  };
  const rotation = {
    syntax: "<angle>",
    initialValue: "0deg",
    toDefaultUnit: v => v + "deg"
  };
  const baseTransformProperties = {
    translate: {
      syntax: "<length-percentage>",
      initialValue: "0px",
      toDefaultUnit: v => v + "px"
    },
    rotate: rotation,
    scale: {
      syntax: "<number>",
      initialValue: 1,
      toDefaultUnit: noopReturn
    },
    skew: rotation
  };
  const transformDefinitions = new Map;
  const asTransformCssVar = name => `--motion-${name}`;
  const transforms = [ "x", "y", "z" ];
  order.forEach((name => {
    axes.forEach((axis => {
      transforms.push(name + axis);
      transformDefinitions.set(asTransformCssVar(name + axis), baseTransformProperties[name]);
    }));
  }));
  const compareTransformOrder = (a, b) => transforms.indexOf(a) - transforms.indexOf(b);
  const transformLookup = new Set(transforms);
  const isTransform = name => transformLookup.has(name);
  const addTransformToElement = (element, name) => {
    if (transformAlias[name]) name = transformAlias[name];
    const {transforms: transforms} = getAnimationData(element);
    addUniqueItem(transforms, name);
    element.style.transform = buildTransformTemplate(transforms);
  };
  const buildTransformTemplate = transforms => transforms.sort(compareTransformOrder).reduce(transformListToString, "").trim();
  const transformListToString = (template, name) => `${template} ${name}(var(${asTransformCssVar(name)}))`;
  const isCssVar = name => name.startsWith("--");
  const registeredProperties = new Set;
  function registerCssVariable(name) {
    if (registeredProperties.has(name)) return;
    registeredProperties.add(name);
    try {
      const {syntax: syntax, initialValue: initialValue} = transformDefinitions.has(name) ? transformDefinitions.get(name) : {};
      CSS.registerProperty({
        name: name,
        inherits: false,
        syntax: syntax,
        initialValue: initialValue
      });
    } catch (e) {}
  }
  const testAnimation = (keyframes, options) => document.createElement("div").animate(keyframes, options);
  const featureTests = {
    cssRegisterProperty: () => typeof CSS !== "undefined" && Object.hasOwnProperty.call(CSS, "registerProperty"),
    waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
    partialKeyframes: () => {
      try {
        testAnimation({
          opacity: [ 1 ]
        });
      } catch (e) {
        return false;
      }
      return true;
    },
    finished: () => Boolean(testAnimation({
      opacity: [ 0, 1 ]
    }, {
      duration: .001
    }).finished),
    linearEasing: () => {
      try {
        testAnimation({
          opacity: 0
        }, {
          easing: "linear(0, 1)"
        });
      } catch (e) {
        return false;
      }
      return true;
    }
  };
  const results = {};
  const supports = {};
  for (const key in featureTests) {
    supports[key] = () => {
      if (results[key] === undefined) results[key] = featureTests[key]();
      return results[key];
    };
  }
  const resolution = .015;
  const generateLinearEasingPoints = (easing, duration) => {
    let points = "";
    const numPoints = Math.round(duration / resolution);
    for (let i = 0; i < numPoints; i++) {
      points += easing(progress(0, numPoints - 1, i)) + ", ";
    }
    return points.substring(0, points.length - 2);
  };
  const convertEasing = (easing, duration) => {
    if (isFunction(easing)) {
      return supports.linearEasing() ? `linear(${generateLinearEasingPoints(easing, duration)})` : defaults.easing;
    } else {
      return isCubicBezier(easing) ? cubicBezierAsString(easing) : easing;
    }
  };
  const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  function hydrateKeyframes(keyframes, readInitialValue) {
    for (let i = 0; i < keyframes.length; i++) {
      if (keyframes[i] === null) {
        keyframes[i] = i ? keyframes[i - 1] : readInitialValue();
      }
    }
    return keyframes;
  }
  const keyframesList = keyframes => Array.isArray(keyframes) ? keyframes : [ keyframes ];
  function getStyleName(key) {
    if (transformAlias[key]) key = transformAlias[key];
    return isTransform(key) ? asTransformCssVar(key) : key;
  }
  const style = {
    get: (element, name) => {
      name = getStyleName(name);
      let value = isCssVar(name) ? element.style.getPropertyValue(name) : getComputedStyle(element)[name];
      if (!value && value !== 0) {
        const definition = transformDefinitions.get(name);
        if (definition) value = definition.initialValue;
      }
      return value;
    },
    set: (element, name, value) => {
      name = getStyleName(name);
      if (isCssVar(name)) {
        element.style.setProperty(name, value);
      } else {
        element.style[name] = value;
      }
    }
  };
  function stopAnimation(animation, needsCommit = true) {
    if (!animation || animation.playState === "finished") return;
    try {
      if (animation.stop) {
        animation.stop();
      } else {
        needsCommit && animation.commitStyles();
        animation.cancel();
      }
    } catch (e) {}
  }
  function getUnitConverter(keyframes, definition) {
    var _a;
    let toUnit = (definition === null || definition === void 0 ? void 0 : definition.toDefaultUnit) || noopReturn;
    const finalKeyframe = keyframes[keyframes.length - 1];
    if (isString(finalKeyframe)) {
      const unit = ((_a = finalKeyframe.match(/(-?[\d.]+)([a-z%]*)/)) === null || _a === void 0 ? void 0 : _a[2]) || "";
      if (unit) toUnit = value => value + unit;
    }
    return toUnit;
  }
  function getDevToolsRecord() {
    return window.__MOTION_DEV_TOOLS_RECORD;
  }
  function animateStyle(element, key, keyframesDefinition, options = {}, AnimationPolyfill) {
    const record = getDevToolsRecord();
    const isRecording = options.record !== false && record;
    let animation;
    let {duration: duration = defaults.duration, delay: delay = defaults.delay, endDelay: endDelay = defaults.endDelay, repeat: repeat = defaults.repeat, easing: easing = defaults.easing, persist: persist = false, direction: direction, offset: offset, allowWebkitAcceleration: allowWebkitAcceleration = false, autoplay: autoplay = true} = options;
    const data = getAnimationData(element);
    const valueIsTransform = isTransform(key);
    let canAnimateNatively = supports.waapi();
    valueIsTransform && addTransformToElement(element, key);
    const name = getStyleName(key);
    const motionValue = getMotionValue(data.values, name);
    const definition = transformDefinitions.get(name);
    stopAnimation(motionValue.animation, !(isEasingGenerator(easing) && motionValue.generator) && options.record !== false);
    return () => {
      const readInitialValue = () => {
        var _a, _b;
        return (_b = (_a = style.get(element, name)) !== null && _a !== void 0 ? _a : definition === null || definition === void 0 ? void 0 : definition.initialValue) !== null && _b !== void 0 ? _b : 0;
      };
      let keyframes = hydrateKeyframes(keyframesList(keyframesDefinition), readInitialValue);
      const toUnit = getUnitConverter(keyframes, definition);
      if (isEasingGenerator(easing)) {
        const custom = easing.createAnimation(keyframes, key !== "opacity", readInitialValue, name, motionValue);
        easing = custom.easing;
        keyframes = custom.keyframes || keyframes;
        duration = custom.duration || duration;
      }
      if (isCssVar(name)) {
        if (supports.cssRegisterProperty()) {
          registerCssVariable(name);
        } else {
          canAnimateNatively = false;
        }
      }
      if (valueIsTransform && !supports.linearEasing() && (isFunction(easing) || isEasingList(easing) && easing.some(isFunction))) {
        canAnimateNatively = false;
      }
      if (canAnimateNatively) {
        if (definition) {
          keyframes = keyframes.map((value => isNumber(value) ? definition.toDefaultUnit(value) : value));
        }
        if (keyframes.length === 1 && (!supports.partialKeyframes() || isRecording)) {
          keyframes.unshift(readInitialValue());
        }
        const animationOptions = {
          delay: time.ms(delay),
          duration: time.ms(duration),
          endDelay: time.ms(endDelay),
          easing: !isEasingList(easing) ? convertEasing(easing, duration) : undefined,
          direction: direction,
          iterations: repeat + 1,
          fill: "both"
        };
        animation = element.animate({
          [name]: keyframes,
          offset: offset,
          easing: isEasingList(easing) ? easing.map((thisEasing => convertEasing(thisEasing, duration))) : undefined
        }, animationOptions);
        if (!animation.finished) {
          animation.finished = new Promise(((resolve, reject) => {
            animation.onfinish = resolve;
            animation.oncancel = reject;
          }));
        }
        const target = keyframes[keyframes.length - 1];
        animation.finished.then((() => {
          if (persist) return;
          style.set(element, name, target);
          animation.cancel();
        })).catch(noop);
        if (!allowWebkitAcceleration) animation.playbackRate = 1.000001;
      } else if (AnimationPolyfill && valueIsTransform) {
        keyframes = keyframes.map((value => typeof value === "string" ? parseFloat(value) : value));
        if (keyframes.length === 1) {
          keyframes.unshift(parseFloat(readInitialValue()));
        }
        animation = new AnimationPolyfill((latest => {
          style.set(element, name, toUnit ? toUnit(latest) : latest);
        }), keyframes, Object.assign(Object.assign({}, options), {
          duration: duration,
          easing: easing
        }));
      } else {
        const target = keyframes[keyframes.length - 1];
        style.set(element, name, definition && isNumber(target) ? definition.toDefaultUnit(target) : target);
      }
      if (isRecording) {
        record(element, key, keyframes, {
          duration: duration,
          delay: delay,
          easing: easing,
          repeat: repeat,
          offset: offset
        }, "motion-one");
      }
      motionValue.setAnimation(animation);
      if (animation && !autoplay) animation.pause();
      return animation;
    };
  }
  const getOptions = (options, key) => options[key] ? Object.assign(Object.assign({}, options), options[key]) : Object.assign({}, options);
  function resolveElements(elements, selectorCache) {
    var _a;
    if (typeof elements === "string") {
      if (selectorCache) {
        (_a = selectorCache[elements]) !== null && _a !== void 0 ? _a : selectorCache[elements] = document.querySelectorAll(elements);
        elements = selectorCache[elements];
      } else {
        elements = document.querySelectorAll(elements);
      }
    } else if (elements instanceof Element) {
      elements = [ elements ];
    }
    return Array.from(elements || []);
  }
  const createAnimation = factory => factory();
  const withControls = (animationFactory, options, duration = defaults.duration) => new Proxy({
    animations: animationFactory.map(createAnimation).filter(Boolean),
    duration: duration,
    options: options
  }, controls);
  const getActiveAnimation = state => state.animations[0];
  const controls = {
    get: (target, key) => {
      const activeAnimation = getActiveAnimation(target);
      switch (key) {
       case "duration":
        return target.duration;

       case "currentTime":
        return time.s((activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) || 0);

       case "playbackRate":
       case "playState":
        return activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key];

       case "finished":
        if (!target.finished) {
          target.finished = Promise.all(target.animations.map(selectFinished)).catch(noop);
        }
        return target.finished;

       case "stop":
        return () => {
          target.animations.forEach((animation => stopAnimation(animation)));
        };

       case "forEachNative":
        return callback => {
          target.animations.forEach((animation => callback(animation, target)));
        };

       default:
        return typeof (activeAnimation === null || activeAnimation === void 0 ? void 0 : activeAnimation[key]) === "undefined" ? undefined : () => target.animations.forEach((animation => animation[key]()));
      }
    },
    set: (target, key, value) => {
      switch (key) {
       case "currentTime":
        value = time.ms(value);

       case "playbackRate":
        for (let i = 0; i < target.animations.length; i++) {
          target.animations[i][key] = value;
        }
        return true;
      }
      return false;
    }
  };
  const selectFinished = animation => animation.finished;
  function resolveOption(option, i, total) {
    return isFunction(option) ? option(i, total) : option;
  }
  function createAnimate(AnimatePolyfill) {
    return function animate(elements, keyframes, options = {}) {
      elements = resolveElements(elements);
      const numElements = elements.length;
      invariant(Boolean(numElements), "No valid element provided.");
      invariant(Boolean(keyframes), "No keyframes defined.");
      const animationFactories = [];
      for (let i = 0; i < numElements; i++) {
        const element = elements[i];
        for (const key in keyframes) {
          const valueOptions = getOptions(options, key);
          valueOptions.delay = resolveOption(valueOptions.delay, i, numElements);
          const animation = animateStyle(element, key, keyframes[key], valueOptions, AnimatePolyfill);
          animationFactories.push(animation);
        }
      }
      return withControls(animationFactories, options, options.duration);
    };
  }
  const animate$1 = createAnimate(Animation);
  function animateProgress(target, options = {}) {
    return withControls([ () => {
      const animation = new Animation(target, [ 0, 1 ], options);
      animation.finished.catch((() => {}));
      return animation;
    } ], options, options.duration);
  }
  function animate(target, keyframesOrOptions, options) {
    const factory = isFunction(target) ? animateProgress : animate$1;
    return factory(target, keyframesOrOptions, options);
  }
  class accordion_item_controller extends Controller {
    static targets=[ "icon", "content", "button" ];
    static values={
      open: {
        type: Boolean,
        default: false
      },
      animationDuration: {
        type: Number,
        default: .15
      },
      animationEasing: {
        type: String,
        default: "ease-in-out"
      },
      rotateIcon: {
        type: Number,
        default: 180
      }
    };
    connect() {
      let originalAnimationDuration = this.animationDurationValue;
      this.animationDurationValue = 0;
      this.openValue ? this.open() : this.close();
      this.animationDurationValue = originalAnimationDuration;
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    openValueChanged(isOpen, wasOpen) {
      if (isOpen) {
        this.open();
      } else {
        this.close();
      }
    }
    open() {
      if (this.hasContentTarget) {
        this.buttonTarget.ariaExpanded = "true";
        this.revealContent();
        this.hasIconTarget && this.rotateIcon();
        this.openValue = true;
      }
    }
    close() {
      if (this.hasContentTarget) {
        this.buttonTarget.ariaExpanded = "false";
        this.hideContent();
        this.hasIconTarget && this.rotateIcon();
        this.openValue = false;
      }
    }
    revealContent() {
      const contentHeight = this.contentTarget.scrollHeight;
      animate(this.contentTarget, {
        height: `${contentHeight}px`
      }, {
        duration: this.animationDurationValue,
        easing: this.animationEasingValue
      });
    }
    hideContent() {
      animate(this.contentTarget, {
        height: 0
      }, {
        duration: this.animationDurationValue,
        easing: this.animationEasingValue
      });
    }
    rotateIcon() {
      animate(this.iconTarget, {
        rotate: `${this.openValue ? this.rotateIconValue : 0}deg`
      });
    }
  }
  exports.AccordionController = accordion_controller;
  exports.AccordionItemController = accordion_item_controller;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
