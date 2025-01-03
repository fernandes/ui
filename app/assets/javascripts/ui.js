(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm")) : typeof define === "function" && define.amd ? define([ "exports", "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.UI = {}, global.motion));
})(this, (function(exports, _esm) {
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
  class AccordionController extends Controller {
    connect() {
      this.element.textContent = "Hello from Accordion";
    }
  }
  class AccordionItemController extends Controller {
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
      _esm.animate(this.contentTarget, {
        height: `${contentHeight}px`
      }, {
        duration: this.animationDurationValue,
        easing: this.animationEasingValue
      });
    }
    hideContent() {
      _esm.animate(this.contentTarget, {
        height: 0
      }, {
        duration: this.animationDurationValue,
        easing: this.animationEasingValue
      });
    }
    rotateIcon() {
      _esm.animate(this.iconTarget, {
        rotate: `${this.openValue ? this.rotateIconValue : 0}deg`
      });
    }
  }
  class AvatarController extends Controller {
    static targets=[ "image", "fallback" ];
    connect() {
      const data_src = this.imageTarget.getAttribute("data-src");
      this.imageTarget.setAttribute("src", data_src);
    }
    handleError(e) {
      this.imageTarget.classList.add("hidden");
      this.fallbackTarget.classList.remove("hidden");
    }
    handleLoad(e) {
      this.imageTarget.classList.remove("hidden");
      this.fallbackTarget.classList.add("hidden");
    }
  }
  class FetchResponse {
    constructor(response) {
      this.response = response;
    }
    get statusCode() {
      return this.response.status;
    }
    get redirected() {
      return this.response.redirected;
    }
    get ok() {
      return this.response.ok;
    }
    get unauthenticated() {
      return this.statusCode === 401;
    }
    get unprocessableEntity() {
      return this.statusCode === 422;
    }
    get authenticationURL() {
      return this.response.headers.get("WWW-Authenticate");
    }
    get contentType() {
      const contentType = this.response.headers.get("Content-Type") || "";
      return contentType.replace(/;.*$/, "");
    }
    get headers() {
      return this.response.headers;
    }
    get html() {
      if (this.contentType.match(/^(application|text)\/(html|xhtml\+xml)$/)) {
        return this.text;
      }
      return Promise.reject(new Error(`Expected an HTML response but got "${this.contentType}" instead`));
    }
    get json() {
      if (this.contentType.match(/^application\/.*json$/)) {
        return this.responseJson || (this.responseJson = this.response.json());
      }
      return Promise.reject(new Error(`Expected a JSON response but got "${this.contentType}" instead`));
    }
    get text() {
      return this.responseText || (this.responseText = this.response.text());
    }
    get isTurboStream() {
      return this.contentType.match(/^text\/vnd\.turbo-stream\.html/);
    }
    get isScript() {
      return this.contentType.match(/\b(?:java|ecma)script\b/);
    }
    async renderTurboStream() {
      if (this.isTurboStream) {
        if (window.Turbo) {
          await window.Turbo.renderStreamMessage(await this.text);
        } else {
          console.warn("You must set `window.Turbo = Turbo` to automatically process Turbo Stream events with request.js");
        }
      } else {
        return Promise.reject(new Error(`Expected a Turbo Stream response but got "${this.contentType}" instead`));
      }
    }
    async activeScript() {
      if (this.isScript) {
        const script = document.createElement("script");
        const metaTag = document.querySelector("meta[name=csp-nonce]");
        const nonce = metaTag && metaTag.content;
        if (nonce) {
          script.setAttribute("nonce", nonce);
        }
        script.innerHTML = await this.text;
        document.body.appendChild(script);
      } else {
        return Promise.reject(new Error(`Expected a Script response but got "${this.contentType}" instead`));
      }
    }
  }
  class RequestInterceptor {
    static register(interceptor) {
      this.interceptor = interceptor;
    }
    static get() {
      return this.interceptor;
    }
    static reset() {
      this.interceptor = undefined;
    }
  }
  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = cookies.find((cookie => cookie.startsWith(prefix)));
    if (cookie) {
      const value = cookie.split("=").slice(1).join("=");
      if (value) {
        return decodeURIComponent(value);
      }
    }
  }
  function compact(object) {
    const result = {};
    for (const key in object) {
      const value = object[key];
      if (value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }
  function metaContent(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element && element.content;
  }
  function stringEntriesFromFormData(formData) {
    return [ ...formData ].reduce(((entries, [name, value]) => entries.concat(typeof value === "string" ? [ [ name, value ] ] : [])), []);
  }
  function mergeEntries(searchParams, entries) {
    for (const [name, value] of entries) {
      if (value instanceof window.File) continue;
      if (searchParams.has(name) && !name.includes("[]")) {
        searchParams.delete(name);
        searchParams.set(name, value);
      } else {
        searchParams.append(name, value);
      }
    }
  }
  class FetchRequest {
    constructor(method, url, options = {}) {
      this.method = method;
      this.options = options;
      this.originalUrl = url.toString();
    }
    async perform() {
      try {
        const requestInterceptor = RequestInterceptor.get();
        if (requestInterceptor) {
          await requestInterceptor(this);
        }
      } catch (error) {
        console.error(error);
      }
      const fetch = this.responseKind === "turbo-stream" && window.Turbo ? window.Turbo.fetch : window.fetch;
      const response = new FetchResponse(await fetch(this.url, this.fetchOptions));
      if (response.unauthenticated && response.authenticationURL) {
        return Promise.reject(window.location.href = response.authenticationURL);
      }
      if (response.isScript) {
        await response.activeScript();
      }
      const responseStatusIsTurboStreamable = response.ok || response.unprocessableEntity;
      if (responseStatusIsTurboStreamable && response.isTurboStream) {
        await response.renderTurboStream();
      }
      return response;
    }
    addHeader(key, value) {
      const headers = this.additionalHeaders;
      headers[key] = value;
      this.options.headers = headers;
    }
    sameHostname() {
      if (!this.originalUrl.startsWith("http:")) {
        return true;
      }
      try {
        return new URL(this.originalUrl).hostname === window.location.hostname;
      } catch (_) {
        return true;
      }
    }
    get fetchOptions() {
      return {
        method: this.method.toUpperCase(),
        headers: this.headers,
        body: this.formattedBody,
        signal: this.signal,
        credentials: this.credentials,
        redirect: this.redirect
      };
    }
    get headers() {
      const baseHeaders = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": this.contentType,
        Accept: this.accept
      };
      if (this.sameHostname()) {
        baseHeaders["X-CSRF-Token"] = this.csrfToken;
      }
      return compact(Object.assign(baseHeaders, this.additionalHeaders));
    }
    get csrfToken() {
      return getCookie(metaContent("csrf-param")) || metaContent("csrf-token");
    }
    get contentType() {
      if (this.options.contentType) {
        return this.options.contentType;
      } else if (this.body == null || this.body instanceof window.FormData) {
        return undefined;
      } else if (this.body instanceof window.File) {
        return this.body.type;
      }
      return "application/json";
    }
    get accept() {
      switch (this.responseKind) {
       case "html":
        return "text/html, application/xhtml+xml";

       case "turbo-stream":
        return "text/vnd.turbo-stream.html, text/html, application/xhtml+xml";

       case "json":
        return "application/json, application/vnd.api+json";

       case "script":
        return "text/javascript, application/javascript";

       default:
        return "*/*";
      }
    }
    get body() {
      return this.options.body;
    }
    get query() {
      const originalQuery = (this.originalUrl.split("?")[1] || "").split("#")[0];
      const params = new URLSearchParams(originalQuery);
      let requestQuery = this.options.query;
      if (requestQuery instanceof window.FormData) {
        requestQuery = stringEntriesFromFormData(requestQuery);
      } else if (requestQuery instanceof window.URLSearchParams) {
        requestQuery = requestQuery.entries();
      } else {
        requestQuery = Object.entries(requestQuery || {});
      }
      mergeEntries(params, requestQuery);
      const query = params.toString();
      return query.length > 0 ? `?${query}` : "";
    }
    get url() {
      return this.originalUrl.split("?")[0].split("#")[0] + this.query;
    }
    get responseKind() {
      return this.options.responseKind || "html";
    }
    get signal() {
      return this.options.signal;
    }
    get redirect() {
      return this.options.redirect || "follow";
    }
    get credentials() {
      return this.options.credentials || "same-origin";
    }
    get additionalHeaders() {
      return this.options.headers || {};
    }
    get formattedBody() {
      const bodyIsAString = Object.prototype.toString.call(this.body) === "[object String]";
      const contentTypeIsJson = this.headers["Content-Type"] === "application/json";
      if (contentTypeIsJson && !bodyIsAString) {
        return JSON.stringify(this.body);
      }
      return this.body;
    }
  }
  class CalendarController extends Controller {
    static values={
      month: Number,
      year: Number,
      nextPeriodMonth: Number,
      nextPeriodYear: Number,
      previousPeriodMonth: Number,
      previousPeriodYear: Number,
      weeks: {
        type: Number,
        default: 6
      },
      activeDay: {
        type: Number,
        default: 1
      },
      open: {
        type: Boolean,
        default: true
      },
      selected: {
        type: String,
        default: null
      }
    };
    static targets=[ "nextButton", "previousButton", "buttonDay" ];
    connect() {
      this.selectedClasses = [ "bg-primary", "text-primary-foreground", "hover:bg-primary", "hover:text-primary-foreground", "focus:bg-primary", "focus:text-primary-foreground" ];
      const activeElement = this.findActiveElement();
      if (this.openValue && this.activeDayValue != 0) {
        if (activeElement) {
          this.focusElement(activeElement);
        } else {
          const jumpToElementDay = this.activeDayValue == 0 ? 1 : this.activeDayValue;
          const jumpToElement = this.findPeriodElement(jumpToElementDay);
          this.focusElement(jumpToElement);
        }
      }
      if (!activeElement && this.activeDayValue == 0) {
        const jumpToElement = this.findPeriodElement(1);
        jumpToElement.setAttribute("tabindex", "0");
      }
    }
    handleClickNextPeriod() {
      this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue);
    }
    handleClickPreviousPeriod() {
      this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue);
    }
    handleKeyUp(e) {
      this.moveFocus(-7);
    }
    handleKeyLeft(e) {
      this.moveFocus(-1);
    }
    handleKeyDown(e) {
      this.moveFocus(7);
    }
    handleKeyRight(e) {
      this.moveFocus(1);
    }
    handleKeyPageUp(e) {
      this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue, this.findActiveDay(), 0);
    }
    handleKeyPageDown(e) {
      this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue, this.findActiveDay(), 0);
    }
    findActiveElement() {
      return this.buttonDayTargets.find((x => x.attributes["tabindex"].value == "0"));
    }
    findPeriodElement(day) {
      return this.buttonDayTargets.find((x => x.dataset.day == day && (x.dataset.status == "today" || x.dataset.status == "active" || x.dataset.status == "selected")));
    }
    focusElement(el) {
      el.setAttribute("tabindex", "0");
      el.focus({
        focusVisible: true
      });
    }
    findActiveDay() {
      const activeElement = this.findActiveElement();
      return parseInt(activeElement.dataset["day"]);
    }
    moveFocus(amount) {
      const activeDay = this.findActiveDay();
      const jumpTo = activeDay + amount;
      const jumpToElement = this.findPeriodElement(jumpTo);
      if (jumpToElement) {
        const activeElement = this.findActiveElement();
        activeElement.setAttribute("tabindex", "-1");
        this.focusElement(jumpToElement);
      } else {
        if (amount > 0) {
          this.request(this.nextPeriodYearValue, this.nextPeriodMonthValue, activeDay, amount);
        } else {
          this.request(this.previousPeriodYearValue, this.previousPeriodMonthValue, activeDay, amount);
        }
      }
    }
    handleButtonDayClick(e) {
      const day = e.target.dataset.day;
      const month = e.target.dataset.month;
      const year = e.target.dataset.year;
      this.selectedValue = `${year}-${month}-${day}`;
      if (month != this.monthValue) {
        this.request(year, month, day, 0);
      } else {
        this.buttonDayTargets.forEach((x => {
          if (x == e.target) {
            this.selectElement(x);
          } else {
            this.unselectElement(x);
          }
        }));
      }
      this.dispatch("selected", {
        detail: {
          value: this.selectedValue
        }
      });
    }
    selectElement(el) {
      el.classList.add(...this.selectedClasses);
      el.setAttribute("tabindex", "0");
    }
    unselectElement(el) {
      el.classList.remove(...this.selectedClasses);
      el.setAttribute("tabindex", "-1");
    }
    async request(year, month, focused = 0, jumpAmount = 0) {
      const request = new FetchRequest("post", `/ui/calendar/${year}/${month}`, {
        body: JSON.stringify({
          weeks: this.weeksValue,
          focused: focused,
          jump_amount: jumpAmount,
          selected_value: this.selectedValue
        })
      });
      const response = await request.perform();
      if (response.ok) {
        const body = await response.text;
        this.element.outerHTML = body;
      }
    }
  }
  class CheckboxController extends Controller {
    static targets=[ "span" ];
    handleToggle() {
      if (this.element.dataset.state == "checked") {
        this.element.setAttribute("aria-checked", "false");
        this.element.dataset.state = "unchecked";
        this.spanTarget.dataset.state = "unchecked";
        this.spanTarget.classList.add("hidden");
      } else {
        this.element.setAttribute("aria-checked", "true");
        this.element.dataset.state = "checked";
        this.spanTarget.dataset.state = "checked";
        this.spanTarget.classList.remove("hidden");
      }
    }
  }
  class CollapsibleController extends Controller {
    static targets=[ "trigger", "content" ];
    handleClick(e) {
      console.log("handleClick collapsible");
      this.toggle();
    }
    toggle() {
      const el = this.element;
      const trigger = this.triggerTarget;
      const content = this.contentTarget;
      if (this.isOpen()) {
        el.dataset.state = "closed";
        content.dataset.state = "closed";
        trigger.dataset.state = "closed";
        trigger.ariaExpanded = "false";
      } else {
        el.dataset.state = "open";
        content.dataset.state = "open";
        trigger.dataset.state = "open";
        trigger.ariaExpanded = "true";
      }
    }
    isOpen() {
      return this.element.dataset.state == "open";
    }
  }
  class ComboboxController extends Controller {
    static targets=[ "trigger", "searchInput", "triggerText" ];
    connect() {
      this.popoverOpen = false;
    }
    handlePopoverOpen() {
      console.log("handlePopoverOpen@combobox");
      this.popoverOpen = true;
      this.highlightSearchOrFirstItem();
    }
    highlightSearchOrFirstItem() {
      if (this.hasSearchInputTarget) {
        this.searchInputTarget.focus();
      } else {
        this.element.setAttribute("tabindex", 0);
        this.element.focus();
      }
    }
    handlePopoverClose() {
      this.popoverOpen = false;
      if (this.hasTriggerTarget) {
        this.triggerTarget.focus({
          focusVisible: true
        });
      }
    }
    handleEsc(e) {
      console.log("escinngngngngg", this.popoverOpen);
    }
    handleFocus() {
      console.log("handleFocus@comboboxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      this.highlightSearchOrFirstItem();
      this.element.setAttribute("tabindex", -1);
    }
    handleEnter() {
      if (!this.popoverOpen && document.activeElement == this.element) {
        console.log("open the gatesssssssssssss");
        this.openPopover();
      }
    }
    handleSpace() {}
    handleItemChecked(e) {
      console.log("handleItemChecked@combobox", e.target, this.triggerTextTarget);
      const option = e.detail.el;
      if (!this.hasTriggerTextTarget) return;
      if (option.dataset.customIcon == "true") {
        const innerHTML = e.detail.el.innerHTML;
        this.triggerTextTarget.innerHTML = innerHTML;
        const icon = this.triggerTextTarget.querySelector("svg");
        const uncheckedClass = icon.dataset.uncheckedClass;
        icon.classList.add("opacity-100");
        icon.classList.remove(uncheckedClass);
      } else {
        const value = e.detail.value;
        this.triggerTextTarget.innerText = value;
      }
    }
    handleInputKeyLeft(e) {
      console.log("handleInputKeyLeft@combobox");
      e.stopPropagation();
    }
    handleInputKeyRight(e) {
      console.log("handleInputKeyRight@combobox");
      e.stopPropagation();
    }
    handleInputKeyDown() {}
    handleInputKeyUp() {}
  }
  class ComboboxContentController extends Controller {
    static targets=[ "item" ];
    static values={
      search: {
        type: Boolean,
        default: false
      }
    };
    connect() {
      const checkedItem = this.checkedItem();
      if (checkedItem) {
        this.checkItem(checkedItem);
      }
    }
    handleFilterApplied() {
      this.unselectAllItems();
      this.selectItem(this.visibleItems()[0]);
    }
    visibleItems() {
      return this.itemTargets.filter((x => !x.classList.contains("hidden")));
    }
    handlePopoverOpen() {
      this.unselectAllItems();
      this.selectItem(this.itemTargets[0]);
      if (!this.searchValue) {
        this.element.focus();
      }
    }
    handlePopoverClose() {
      this.unselectAllItems();
    }
    handleMouseEnter(e) {
      e.target;
      this.unselectAllItems();
      this.selectItem(e.target);
    }
    handleClick(e) {
      e.target;
      this.uncheckAllItems();
      this.checkItem(e.target);
    }
    handleUp(e) {
      this.goToElement("up");
    }
    handleDown(e) {
      this.goToElement("down");
    }
    handleEnter(e) {
      const selectedItem = this.selectedItem();
      if (selectedItem) {
        this.uncheckAllItems();
        this.checkItem(selectedItem);
      }
    }
    goToElement(direction) {
      const availableItems = this.visibleItems();
      const selectedItem = this.selectedItem();
      if (selectedItem == undefined) {
        this.selectItem(availableItems[0]);
      } else {
        const currentPosition = availableItems.indexOf(selectedItem);
        let nextElement = undefined;
        if (direction == "up") {
          nextElement = availableItems[currentPosition - 1];
        } else {
          nextElement = availableItems[currentPosition + 1];
        }
        if (nextElement) {
          this.unselectAllItems();
          this.selectItem(nextElement);
        }
      }
    }
    uncheckAllItems() {
      this.itemTargets.forEach((x => {
        this.uncheckItem(x);
      }));
    }
    unselectAllItems() {
      this.itemTargets.forEach((x => {
        this.unselectItem(x);
      }));
    }
    checkedItem() {
      return this.itemTargets.find((x => x.dataset.checked == "true"));
    }
    selectedItem() {
      return this.itemTargets.find((x => x.dataset.selected == "true"));
    }
    checkItem(item) {
      this.dispatch("checked", {
        detail: {
          value: item.innerText,
          el: item
        }
      });
      item.dataset.checked = "true";
      item.setAttribute("aria-checked", "true");
      this.checkIcon(item);
    }
    checkIcon(item) {
      const icon = item.querySelector("svg");
      const uncheckedClass = icon.dataset.uncheckedClass;
      icon.classList.add("opacity-100");
      icon.classList.remove(uncheckedClass);
    }
    uncheckItem(item) {
      this.dispatch("unchecked", {
        detail: {
          value: item.innerText
        }
      });
      item.dataset.checked = "false";
      item.setAttribute("aria-checked", "false");
      this.uncheckIcon(item);
    }
    uncheckIcon(item) {
      const icon = item.querySelector("svg");
      const uncheckedClass = icon.dataset.uncheckedClass;
      icon.classList.remove("opacity-100");
      icon.classList.add(uncheckedClass);
    }
    selectItem(item) {
      if (item == undefined) {
        return false;
      }
      this.dispatch("selected", {
        default: {
          value: item.innerText
        }
      });
      item.dataset.selected = "true";
      item.setAttribute("aria-selected", "true");
      item.scrollIntoView({
        block: "center",
        inline: "center"
      });
    }
    unselectItem(item) {
      this.dispatch("unselected", item);
      item.dataset.selected = "false";
      item.setAttribute("aria-selected", "false");
    }
    dispatchEvent(event, target) {
      this.dispatch(event, {
        target: target
      });
    }
  }
  class ComboboxTriggerController extends Controller {
    handleItemChecked(e) {
      console.log("handleItemChecked@combobox-trigger");
    }
  }
  const composeEventName = (name, controller, eventPrefix) => {
    let composedName = name;
    if (eventPrefix === true) {
      composedName = `${controller.identifier}:${name}`;
    } else if (typeof eventPrefix === "string") {
      composedName = `${eventPrefix}:${name}`;
    }
    return composedName;
  };
  const extendedEvent = (type, event, detail) => {
    const {bubbles: bubbles, cancelable: cancelable, composed: composed} = event || {
      bubbles: true,
      cancelable: true,
      composed: true
    };
    if (event) {
      Object.assign(detail, {
        originalEvent: event
      });
    }
    const customEvent = new CustomEvent(type, {
      bubbles: bubbles,
      cancelable: cancelable,
      composed: composed,
      detail: detail
    });
    return customEvent;
  };
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height > 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width > 0;
    return vertInView && horInView;
  }
  const defaultOptions$5 = {
    events: [ "click", "touchend" ],
    onlyVisible: true,
    dispatchEvent: true,
    eventPrefix: true
  };
  const useClickOutside = (composableController, options = {}) => {
    const controller = composableController;
    const {onlyVisible: onlyVisible, dispatchEvent: dispatchEvent, events: events, eventPrefix: eventPrefix} = Object.assign({}, defaultOptions$5, options);
    const onEvent = event => {
      const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
      if (targetElement.contains(event.target) || !isElementInViewport(targetElement) && onlyVisible) {
        return;
      }
      if (controller.clickOutside) {
        controller.clickOutside(event);
      }
      if (dispatchEvent) {
        const eventName = composeEventName("click:outside", controller, eventPrefix);
        const clickOutsideEvent = extendedEvent(eventName, event, {
          controller: controller
        });
        targetElement.dispatchEvent(clickOutsideEvent);
      }
    };
    const observe = () => {
      events === null || events === void 0 ? void 0 : events.forEach((event => {
        window.addEventListener(event, onEvent, true);
      }));
    };
    const unobserve = () => {
      events === null || events === void 0 ? void 0 : events.forEach((event => {
        window.removeEventListener(event, onEvent, true);
      }));
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    Object.assign(controller, {
      disconnect() {
        unobserve();
        controllerDisconnect();
      }
    });
    observe();
    return [ observe, unobserve ];
  };
  class DebounceController extends Controller {}
  DebounceController.debounces = [];
  class ThrottleController extends Controller {}
  ThrottleController.throttles = [];
  class ContextMenuController extends Controller {
    static targets=[ "dropdown", "trigger" ];
    connect() {
      this.state = "closed";
    }
    handlePopoverOpen() {
      this.state = "open";
      const dropdownController = this.application.getControllerForElementAndIdentifier(this.dropdownTarget, "ui--dropdown-menu");
      dropdownController.handlePopoverOpen();
    }
    handlePopoverClose() {
      this.state = "closed";
      console.log("handlePopoverClose@context-menu");
      this.triggerTarget.focus({
        focusVisible: true
      });
    }
    handleEsc() {
      console.log("handleEsc@context-menu");
      this.element.dispatchEvent(new CustomEvent("requestclose", {
        view: window,
        bubbles: true,
        cancelable: true,
        detail: {
          forceClose: true
        }
      }));
    }
    handleKeyDown(e) {
      if (e.shiftKey && e.code == "F10") {
        const position = this.calculatePositions();
        this.element.dispatchEvent(new CustomEvent("requestopen", {
          view: window,
          bubbles: true,
          cancelable: true,
          detail: {
            forceClose: true,
            positionX: position.x,
            positionY: position.y
          }
        }));
      }
    }
    calculatePositions() {
      const box = this.triggerTarget.getBoundingClientRect();
      return {
        x: (box.left + box.right) / 2,
        y: (box.top + box.bottom) / 2
      };
    }
  }
  class DatePickerController extends Controller {
    static targets=[ "label" ];
    connect() {}
    async handleCalendarSelected(e) {
      const formattedDate = await this.formatDate(e.detail.value);
      if (this.hasLabelTarget) {
        this.labelTarget.innerText = formattedDate;
      }
    }
    async formatDate(value) {
      const request = new FetchRequest("post", `/ui/calendar/format`, {
        body: JSON.stringify({
          value: value
        })
      });
      const response = await request.perform();
      if (response.ok) {
        const body = await response.text;
        return JSON.parse(body).value;
      }
    }
  }
  class DropdownCheckboxController extends Controller {
    static targets=[ "icon" ];
    handleClick() {
      console.log("handleClick@dropdown-checkbox");
      if (this.isChecked()) {
        this.uncheck();
      } else {
        this.check();
      }
    }
    check() {
      const el = this.element;
      el.setAttribute("aria-checked", "true");
      el.dataset.state = "checked";
      this.iconTarget.dataset.state = "checked";
    }
    uncheck() {
      const el = this.element;
      el.setAttribute("aria-checked", "false");
      el.dataset.state = "unchecked";
      this.iconTarget.dataset.state = "unchecked";
    }
    isChecked() {
      return this.element.dataset.state == "checked";
    }
  }
  class DropdownContentController extends Controller {
    static targets=[ "item" ];
    connect() {
      console.log("contenttttttttttttttt", this.element.innerText);
    }
    handleKeyUp() {
      console.log("handleKeyUp@content", this.element.innerText);
      const highlighted = this.findHighlighted();
      let nextElement = undefined;
      if (highlighted == undefined) {
        nextElement = this.availableItems().at(-1);
      } else {
        const indexOf = this.availableItems().indexOf(highlighted);
        nextElement = this.availableItems()[indexOf - 1];
      }
      if (nextElement) {
        this.deemphaziAllElements();
        this.highlightElement(nextElement);
      }
    }
    availableItems() {
      return this.itemTargets.filter((x => x.dataset.disabled == undefined));
    }
    handleKeyDown() {
      console.log("handleKeyDown@content", this.element.innerText);
      const highlighted = this.findHighlighted();
      const indexOf = this.availableItems().indexOf(highlighted);
      const nextElement = this.availableItems()[indexOf + 1];
      if (nextElement) {
        this.deemphaziAllElements();
        this.highlightElement(nextElement);
      }
    }
    handleKeyLeft() {
      console.log("handleKeyLeft@content", this.element.innerText);
      this.closeRequest();
    }
    handleKeyEsc() {
      console.log("handleKeyLeft@content", this.element.innerText);
      this.closeRequest();
    }
    closeRequest() {
      this.deemphaziAllElements();
      this.dispatch("closerequest");
    }
    handleFocus(e) {
      console.log("handleFocus@content", this.element.innerText, this.itemTargets.length);
      if (this.skipFirstHighlight) {
        this.skipFirstHighlight = false;
        return true;
      }
      if (this.itemTargets.length == 0) {
        console.log("focus on ", this.element.children[0]);
        const child = this.element.children[0];
        child.setAttribute("tabindex", 0);
        return child.focus();
      }
      const highlighted = this.findHighlighted();
      if (highlighted) {
        this.highlightElement(highlighted);
      } else {
        this.highlightElement(this.itemTargets[0]);
      }
    }
    handleContentClosed() {
      console.log("handleContentClosed@content", this.element.innerText);
      this.element.focus({
        focusVisible: true
      });
      this.handleFocus();
    }
    handleMouseEnterItem(e) {
      console.log("handleMouseEnterItem@content", e.target.innerText);
      this.deemphaziAllElements();
      this.highlightElement(e.target);
      this.dispatch("mouseenter");
    }
    handleMouseLeaveItem(e) {
      console.log("handleMouseLeaveItem@content", e.target.innerText);
      this.deemphaziElement(e.target);
      this.skipFirstHighlight = true;
      this.element.focus();
      this.dispatch("mouseleave");
    }
    shutdown() {
      this.deemphaziAllElements();
    }
    findHighlighted() {
      return this.itemTargets.find((x => x.dataset.highlighted == ""));
    }
    highlightElement(el) {
      console.log("highlighting", el.innerText);
      el.dataset.highlighted = "";
      el.setAttribute("tabindex", 0);
      el.focus({
        focusVisible: true
      });
    }
    deemphaziAllElements() {
      this.itemTargets.forEach((el => {
        this.deemphaziElement(el);
      }));
    }
    deemphaziElement(el) {
      el.dataset.highlighted = false;
      el.setAttribute("tabindex", -1);
      const submenuController = this.application.getControllerForElementAndIdentifier(el, "ui--dropdown-submenu");
      if (submenuController) {
        submenuController.handleElementDeemphazied();
      }
    }
  }
  class DropdownMenuController extends Controller {
    static targets=[ "item", "content" ];
    handleKeyUp() {
      console.log("handleKeyUp@dropdown menu");
    }
    handleKeyDown() {
      console.log("handleKeyUp@dropdown menu");
    }
    handleEsc() {
      console.log("handleEsc@dropdown menuuuuuu");
      this.shutdown();
      this.element.dispatchEvent(new CustomEvent("requestclose", {
        view: window,
        bubbles: true,
        cancelable: true,
        detail: {
          forceClose: true
        }
      }));
    }
    shutdown() {
      const contents = this.element.querySelectorAll('[data-controller="ui--dropdown-content"]');
      contents.forEach((x => {
        const contentController = this.application.getControllerForElementAndIdentifier(x, "ui--dropdown-content");
        contentController.shutdown();
      }));
      const submenus = this.element.querySelectorAll('[data-controller="ui--dropdown-submenu"]');
      submenus.forEach((x => {
        const submenuController = this.application.getControllerForElementAndIdentifier(x, "ui--dropdown-submenu");
        submenuController.shutdown();
      }));
    }
    handlePopoverOpen() {
      console.log("handlePopoverOpened@dropdown menu");
      this.contentTarget.setAttribute("tabindex", 0);
      this.contentTarget.focus();
    }
    handlePopoverClose() {
      console.log("handlePopoverClosed@dropdown menu");
    }
  }
  class DropdownRadioGroupController extends Controller {
    static targets=[ "radio" ];
    handleClick(e) {
      const target = e.target;
      console.log("handleClick@dropdown-radio-group", target);
      this.radioTargets.forEach((x => {
        this.uncheck(x);
      }));
      this.check(target);
    }
    check(el) {
      el.setAttribute("aria-checked", "true");
      el.setAttribute("tabindex", "0");
      el.dataset.state = "checked";
      this.queryIcon(el).dataset.state = "checked";
    }
    uncheck(el) {
      el.setAttribute("aria-checked", "false");
      el.setAttribute("tabindex", "-1");
      el.dataset.state = "unchecked";
      this.queryIcon(el).dataset.state = "unchecked";
    }
    queryIcon(el) {
      return el.querySelector(":scope > span > span");
    }
  }
  const sides = [ "top", "right", "bottom", "left" ];
  const alignments = [ "start", "end" ];
  const placements = sides.reduce(((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1])), []);
  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const createCoords = v => ({
    x: v,
    y: v
  });
  const oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  const oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    return [ "top", "bottom" ].includes(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [ mainAlignmentSide, getOppositePlacement(mainAlignmentSide) ];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [ getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement) ];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment => oppositeAlignmentMap[alignment]));
  }
  function getSideList(side, isStart, rtl) {
    const lr = [ "left", "right" ];
    const rl = [ "right", "left" ];
    const tb = [ "top", "bottom" ];
    const bt = [ "bottom", "top" ];
    switch (side) {
     case "top":
     case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;

     case "left":
     case "right":
      return isStart ? tb : bt;

     default:
      return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side => side + "-" + alignment));
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side => oppositeSideMap[side]));
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {x: x, y: y, width: width, height: height} = rect;
    return {
      width: width,
      height: height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x: x,
      y: y
    };
  }
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {reference: reference, floating: floating} = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
     case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;

     case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

     case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

     case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;

     default:
      coords = {
        x: reference.x,
        y: reference.y
      };
    }
    switch (getAlignment(placement)) {
     case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;

     case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    }
    return coords;
  }
  const computePosition$1 = async (reference, floating, config) => {
    const {placement: placement = "bottom", strategy: strategy = "absolute", middleware: middleware = [], platform: platform} = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
    let rects = await platform.getElementRects({
      reference: reference,
      floating: floating,
      strategy: strategy
    });
    let {x: x, y: y} = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {name: name, fn: fn} = validMiddleware[i];
      const {x: nextX, y: nextY, data: data, reset: reset} = await fn({
        x: x,
        y: y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy: strategy,
        middlewareData: middlewareData,
        rects: rects,
        platform: platform,
        elements: {
          reference: reference,
          floating: floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform.getElementRects({
              reference: reference,
              floating: floating,
              strategy: strategy
            }) : reset.rects;
          }
          ({x: x, y: y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x: x,
      y: y,
      placement: statefulPlacement,
      strategy: strategy,
      middlewareData: middlewareData
    };
  };
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {x: x, y: y, platform: platform, rects: rects, elements: elements, strategy: strategy} = state;
    const {boundary: boundary = "clippingAncestors", rootBoundary: rootBoundary = "viewport", elementContext: elementContext = "floating", altBoundary: altBoundary = false, padding: padding = 0} = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform.getClippingRect({
      element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
      boundary: boundary,
      rootBoundary: rootBoundary,
      strategy: strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x,
      y: y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
    const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements: elements,
      rect: rect,
      offsetParent: offsetParent,
      strategy: strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  const arrow = options => ({
    name: "arrow",
    options: options,
    async fn(state) {
      const {x: x, y: y, placement: placement, rects: rects, platform: platform, elements: elements, middlewareData: middlewareData} = state;
      const {element: element, padding: padding = 0} = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x: x,
        y: y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset = clamp(min$1, center, max);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset,
          centerOffset: center - offset - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset: alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  function getPlacementList(alignment, autoAlignment, allowedPlacements) {
    const allowedPlacementsSortedByAlignment = alignment ? [ ...allowedPlacements.filter((placement => getAlignment(placement) === alignment)), ...allowedPlacements.filter((placement => getAlignment(placement) !== alignment)) ] : allowedPlacements.filter((placement => getSide(placement) === placement));
    return allowedPlacementsSortedByAlignment.filter((placement => {
      if (alignment) {
        return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
      }
      return true;
    }));
  }
  const autoPlacement = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "autoPlacement",
      options: options,
      async fn(state) {
        var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
        const {rects: rects, middlewareData: middlewareData, placement: placement, platform: platform, elements: elements} = state;
        const {crossAxis: crossAxis = false, alignment: alignment, allowedPlacements: allowedPlacements = placements, autoAlignment: autoAlignment = true, ...detectOverflowOptions} = evaluate(options, state);
        const placements$1 = alignment !== undefined || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
        const currentPlacement = placements$1[currentIndex];
        if (currentPlacement == null) {
          return {};
        }
        const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
        if (placement !== currentPlacement) {
          return {
            reset: {
              placement: placements$1[0]
            }
          };
        }
        const currentOverflows = [ overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]] ];
        const allOverflows = [ ...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [], {
          placement: currentPlacement,
          overflows: currentOverflows
        } ];
        const nextPlacement = placements$1[currentIndex + 1];
        if (nextPlacement) {
          return {
            data: {
              index: currentIndex + 1,
              overflows: allOverflows
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        const placementsSortedByMostSpace = allOverflows.map((d => {
          const alignment = getAlignment(d.placement);
          return [ d.placement, alignment && crossAxis ? d.overflows.slice(0, 2).reduce(((acc, v) => acc + v), 0) : d.overflows[0], d.overflows ];
        })).sort(((a, b) => a[1] - b[1]));
        const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter((d => d[2].slice(0, getAlignment(d[0]) ? 2 : 3).every((v => v <= 0))));
        const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
        if (resetPlacement !== placement) {
          return {
            data: {
              index: currentIndex + 1,
              overflows: allOverflows
            },
            reset: {
              placement: resetPlacement
            }
          };
        }
        return {};
      }
    };
  };
  const flip$1 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options: options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {placement: placement, middlewareData: middlewareData, rects: rects, initialPlacement: initialPlacement, platform: platform, elements: elements} = state;
        const {mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy: fallbackStrategy = "bestFit", fallbackAxisSideDirection: fallbackAxisSideDirection = "none", flipAlignment: flipAlignment = true, ...detectOverflowOptions} = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [ getOppositePlacement(initialPlacement) ] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [ initialPlacement, ...fallbackPlacements ];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides[0]], overflow[sides[1]]);
        }
        overflowsData = [ ...overflowsData, {
          placement: placement,
          overflows: overflows
        } ];
        if (!overflows.every((side => side <= 0))) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d => d.overflows[0] <= 0)).sort(((a, b) => a.overflows[1] - b.overflows[1]))[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
             case "bestFit":
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter((d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || currentSideAxis === "y";
                  }
                  return true;
                })).map((d => [ d.placement, d.overflows.filter((overflow => overflow > 0)).reduce(((acc, overflow) => acc + overflow), 0) ])).sort(((a, b) => a[1] - b[1]))[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }

             case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side => overflow[side] >= 0));
  }
  const hide = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "hide",
      options: options,
      async fn(state) {
        const {rects: rects} = state;
        const {strategy: strategy = "referenceHidden", ...detectOverflowOptions} = evaluate(options, state);
        switch (strategy) {
         case "referenceHidden":
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }

         case "escaped":
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }

         default:
          {
            return {};
          }
        }
      }
    };
  };
  function getBoundingRect(rects) {
    const minX = min(...rects.map((rect => rect.left)));
    const minY = min(...rects.map((rect => rect.top)));
    const maxX = max(...rects.map((rect => rect.right)));
    const maxY = max(...rects.map((rect => rect.bottom)));
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  function getRectsByLine(rects) {
    const sortedRects = rects.slice().sort(((a, b) => a.y - b.y));
    const groups = [];
    let prevRect = null;
    for (let i = 0; i < sortedRects.length; i++) {
      const rect = sortedRects[i];
      if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
        groups.push([ rect ]);
      } else {
        groups[groups.length - 1].push(rect);
      }
      prevRect = rect;
    }
    return groups.map((rect => rectToClientRect(getBoundingRect(rect))));
  }
  const inline = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "inline",
      options: options,
      async fn(state) {
        const {placement: placement, elements: elements, rects: rects, platform: platform, strategy: strategy} = state;
        const {padding: padding = 2, x: x, y: y} = evaluate(options, state);
        const nativeClientRects = Array.from(await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference)) || []);
        const clientRects = getRectsByLine(nativeClientRects);
        const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
        const paddingObject = getPaddingObject(padding);
        function getBoundingClientRect() {
          if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
            return clientRects.find((rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom)) || fallback;
          }
          if (clientRects.length >= 2) {
            if (getSideAxis(placement) === "y") {
              const firstRect = clientRects[0];
              const lastRect = clientRects[clientRects.length - 1];
              const isTop = getSide(placement) === "top";
              const top = firstRect.top;
              const bottom = lastRect.bottom;
              const left = isTop ? firstRect.left : lastRect.left;
              const right = isTop ? firstRect.right : lastRect.right;
              const width = right - left;
              const height = bottom - top;
              return {
                top: top,
                bottom: bottom,
                left: left,
                right: right,
                width: width,
                height: height,
                x: left,
                y: top
              };
            }
            const isLeftSide = getSide(placement) === "left";
            const maxRight = max(...clientRects.map((rect => rect.right)));
            const minLeft = min(...clientRects.map((rect => rect.left)));
            const measureRects = clientRects.filter((rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight));
            const top = measureRects[0].top;
            const bottom = measureRects[measureRects.length - 1].bottom;
            const left = minLeft;
            const right = maxRight;
            const width = right - left;
            const height = bottom - top;
            return {
              top: top,
              bottom: bottom,
              left: left,
              right: right,
              width: width,
              height: height,
              x: left,
              y: top
            };
          }
          return fallback;
        }
        const resetRects = await platform.getElementRects({
          reference: {
            getBoundingClientRect: getBoundingClientRect
          },
          floating: elements.floating,
          strategy: strategy
        });
        if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
          return {
            reset: {
              rects: resetRects
            }
          };
        }
        return {};
      }
    };
  };
  async function convertValueToCoords(state, options) {
    const {placement: placement, platform: platform, elements: elements} = state;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = [ "left", "top" ].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {mainAxis: mainAxis, crossAxis: crossAxis, alignmentAxis: alignmentAxis} = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  const offset$1 = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options: options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {x: x, y: y, placement: placement, middlewareData: middlewareData} = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement: placement
          }
        };
      }
    };
  };
  const shift$1 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options: options,
      async fn(state) {
        const {x: x, y: y, placement: placement} = state;
        const {mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter: limiter = {
          fn: _ref => {
            let {x: x, y: y} = _ref;
            return {
              x: x,
              y: y
            };
          }
        }, ...detectOverflowOptions} = evaluate(options, state);
        const coords = {
          x: x,
          y: y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min = mainAxisCoord + overflow[minSide];
          const max = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min, mainAxisCoord, max);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min = crossAxisCoord + overflow[minSide];
          const max = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min, crossAxisCoord, max);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  const limitShift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options: options,
      fn(state) {
        const {x: x, y: y, placement: placement, rects: rects, middlewareData: middlewareData} = state;
        const {offset: offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true} = evaluate(options, state);
        const coords = {
          x: x,
          y: y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = [ "top", "left" ].includes(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  const size$1 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options: options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {placement: placement, rects: rects, platform: platform, elements: elements} = state;
        const {apply: apply = () => {}, ...detectOverflowOptions} = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {width: width, height: height} = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth: availableWidth,
          availableHeight: availableHeight
        });
        const nextDimensions = await platform.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {overflow: overflow, overflowX: overflowX, overflowY: overflowY, display: display} = getComputedStyle(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && ![ "inline", "contents" ].includes(display);
  }
  function isTableElement(element) {
    return [ "table", "td", "th" ].includes(getNodeName(element));
  }
  function isTopLayer(element) {
    return [ ":popover-open", ":modal" ].some((selector => {
      try {
        return element.matches(selector);
      } catch (e) {
        return false;
      }
    }));
  }
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;
    return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || [ "transform", "perspective", "filter" ].some((value => (css.willChange || "").includes(value))) || [ "paint", "layout", "strict", "content" ].some((value => (css.contain || "").includes(value)));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  function isLastTraversableNode(node) {
    return [ "html", "body", "#document" ].includes(getNodeName(node));
  }
  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  function getCssDimensions(element) {
    const css = getComputedStyle(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width: width,
      height: height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {width: width, height: height, $: $} = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x: x,
      y: y
    };
  }
  const noOffsets = createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width: width,
      height: height,
      x: x,
      y: y
    });
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {elements: elements, rect: rect, offsetParent: offsetParent, strategy: strategy} = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle(body).direction === "rtl") {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        ...clippingAncestor,
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el => isElement(el) && getNodeName(el) !== "body"));
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && [ "absolute", "fixed" ].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor => ancestor !== currentNode));
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {element: element, boundary: boundary, rootBoundary: rootBoundary, strategy: strategy} = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [ ...elementClippingAncestors, rootBoundary ];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce(((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }), getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {width: width, height: height} = getCssDimensions(element);
    return {
      width: width,
      height: height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    let htmlX = 0;
    let htmlY = 0;
    if (documentElement && !isOffsetParentAnElement && !isFixed) {
      const htmlRect = documentElement.getBoundingClientRect();
      htmlY = htmlRect.top + scroll.scrollTop;
      htmlX = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    }
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlX;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlY;
    return {
      x: x,
      y: y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  const getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle(element).direction === "rtl";
  }
  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect: convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement: getDocumentElement,
    getClippingRect: getClippingRect,
    getOffsetParent: getOffsetParent,
    getElementRects: getElementRects,
    getClientRects: getClientRects,
    getDimensions: getDimensions,
    getScale: getScale,
    isElement: isElement,
    isRTL: isRTL
  };
  const offset = offset$1;
  autoPlacement;
  const shift = shift$1;
  const flip = flip$1;
  const size = size$1;
  hide;
  arrow;
  inline;
  limitShift;
  const computePosition = (reference, floating, options) => {
    const cache = new Map;
    const mergedOptions = {
      platform: platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };
  class DropdownSubmenuController extends Controller {
    static targets=[ "content" ];
    static values={
      placement: {
        type: String,
        default: "right-start"
      },
      openDelay: {
        type: Number,
        default: 150
      },
      closeDelay: {
        type: Number,
        default: 200
      }
    };
    connect() {
      this.updatePosition.bind(this);
      useClickOutside(this);
      this.element.dataset.state = "closed";
    }
    handleMouseEnter() {
      console.log("handleMouseLeave@dropdown submenu");
      this.openPopover({
        contentFocus: false
      });
    }
    handleMouseEnterContentItem() {
      this.openPopover({
        contentFocus: false
      });
    }
    handleEsc(e) {
      if (this.isOpen()) {
        e.preventDefault();
        this.closePopover();
      }
    }
    handleSubmenuKeyRight() {
      this.setPopoverOpen({
        contentFocus: true
      });
    }
    handleSubmenuKeyUp() {
      console.log("handleSubmenuKeyUp@submenu", this.element.innerText);
    }
    handleSubmenuKeyDown() {
      console.log("handleSubmenuKeyDown@submenu", this.element.innerText);
    }
    handleContentCloseRequest(e) {
      console.log("handleContentCloseRequest@submenu");
      this.closePopover();
      this.dispatch("content-closed");
    }
    clickOutside(event) {
      if (this.isOpen()) {
        event.preventDefault();
        this.setPopoverClose();
      }
    }
    toggle() {
      if (this.isOpen()) {
        this.closePopover();
      } else {
        this.openPopover({
          contentFocus: false
        });
      }
    }
    openPopover(options) {
      clearTimeout(this.closeTimer);
      this.openTimer = window.setTimeout((() => this.setPopoverOpen(options)), this.openDelayValue);
    }
    setPopoverOpen(options = {}) {
      console.log("setting popover open");
      this.element.dataset["state"] = "open";
      this.contentTarget.dataset["state"] = "open";
      this.contentTarget.setAttribute("tabindex", 0);
      if (options.contentFocus) {
        this.contentTarget.focus({
          focusVisible: true
        });
        this.contentTarget.focus;
      }
      this.updatePosition(true);
      console.log("openedPopover : ", document.activeElement.innerText);
    }
    closePopover() {
      clearTimeout(this.openTimer);
      if (!this.mouseOnContent) {
        this.closeTimer = window.setTimeout((() => this.setPopoverClose()), this.closeDelayValue);
      }
    }
    setPopoverClose(force = false) {
      console.log("setPopoverClose");
      this.element.dataset["state"] = "closed";
      this.contentTarget.dataset["state"] = "closed";
      this.contentTarget.setAttribute("tabindex", -1);
    }
    shutdown() {
      this.setPopoverClose();
    }
    isOpen() {
      return this.element.dataset.state == "open";
    }
    handleElementDeemphazied() {
      if (this.element.dataset.state == "open") {
        this.closePopover();
      }
    }
    updatePosition(force = false) {
      const rect = this.element.getBoundingClientRect();
      rect.top + rect.height + 4;
      computePosition(this.element, this.contentTarget, {
        placement: this.placementValue,
        middleware: [ offset(2) ]
      }).then((({x: x, y: y, placement: placement, strategy: strategy, middlewareData: middlewareData}) => {
        Object.assign(this.contentTarget.style, {
          left: `${x}px`,
          top: `${y}px`
        });
      }));
    }
  }
  class FilterController extends Controller {
    static targets=[ "item", "input" ];
    connect() {
      this.clearFilter();
    }
    handlePopoverClose() {
      this.clearFilter();
    }
    handleInput(e) {
      const filterString = this.inputTarget.value;
      if (typeof filterString === "string" && filterString.length === 0) {
        this.clearFilter();
      } else if (filterString === null) {
        this.clearFilter();
      } else {
        this.filterItems(filterString);
      }
    }
    filterItems(filterString) {
      const regex = new RegExp(`${filterString}`, "i");
      this.itemTargets.forEach((x => {
        const searchTerm = x.dataset["ui-FilterSearchValue"];
        const found = searchTerm.match(regex);
        if (found) {
          x.classList.remove("hidden");
        } else {
          x.classList.add("hidden");
        }
      }));
      this.dispatch("filtered", {
        detail: {
          string: filterString
        }
      });
    }
    clearFilter() {
      this.inputTarget.value = "";
      this.itemTargets.forEach((x => {
        x.classList.remove("hidden");
      }));
      this.dispatch("filtered", {
        detail: {
          string: ""
        }
      });
    }
  }
  class InputOtpController extends Controller {
    static targets=[ "input", "slot" ];
    static classes=[ "focus" ];
    static values={
      currentIndex: {
        type: Number,
        default: 0
      },
      maxSize: {
        type: Number,
        default: 6
      }
    };
    connect() {
      this.typedValue = [];
      this.maxSizeValue = this.slotTargets.length;
      this.inputTarget.setAttribute("maxlength", this.maxSizeValue);
    }
    handleClick() {
      console.log("handleClick@input-otp");
      this.focusCurrent();
    }
    handleFocus() {
      console.log("handleFocus@input-otp");
      this.focusCurrent();
    }
    handleInput(e) {
      console.log("handleInput@input-otp", e);
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        const value = e.key;
        this.insertText(value);
      } else if (e.key == "Backspace") {
        this.deleteContentBackward();
      }
      console.log("this.currentIndexValue", this.currentIndexValue, "this.maxSizeValue", this.maxSizeValue);
    }
    insertText(value) {
      console.log("insertText@input-otp", value);
      this.writeSlotValue(value);
      if (this.isOnLastSlot()) {
        this.typedValue.pop();
        this.typedValue.push(value);
      } else {
        this.typedValue.push(value);
        this.moveToNextSlot();
      }
      this.inputTarget.setAttribute("value", this.typedValue.join(""));
    }
    deleteContentBackward() {
      console.log("deleteContentBackward@input-otp");
      this.writeSlotValue("");
      if (this.isOnFirstSlot()) {
        return;
      } else if (this.isOnLastSlot()) {
        this.typedValue.pop();
        this.focusElement(this.currentSlot());
      } else {
        this.typedValue.pop();
        this.moveToPreviousSlot();
      }
      this.inputTarget.setAttribute("value", this.typedValue.join(""));
    }
    focusCurrent() {
      console.log("focusCurrent@otp");
      const currentSlot = this.currentSlot();
      console.log("current", currentSlot);
      if (currentSlot) {
        this.focusElement(currentSlot);
      }
    }
    writeSlotValue(value) {
      const currentSlot = this.currentSlot();
      const span = currentSlot.querySelector("span");
      span.classList.remove("hidden");
      span.innerText = value;
      currentSlot.querySelector("div").classList.add("hidden");
    }
    isOnLastSlot() {
      return this.typedValue.length == this.maxSizeValue;
    }
    isOnFirstSlot() {
      return this.typedValue.length == 0;
    }
    currentSlot() {
      return this.slotTargets.at(this.currentIndexValue);
    }
    moveToNextSlot() {
      if (this.currentIndexValue == this.maxSizeValue - 1) return;
      const currentSlot = this.currentSlot();
      this.blurElement(currentSlot);
      this.currentIndexValue = this.currentIndexValue + 1;
      const nextSlot = this.slotTargets.at(this.currentIndexValue);
      if (!nextSlot) return;
      this.focusElement(nextSlot);
    }
    moveToPreviousSlot() {
      if (this.currentIndexValue == 0) return;
      const currentSlot = this.currentSlot();
      this.blurElement(currentSlot);
      if (this.currentIndexValue > 0) {
        this.currentIndexValue = this.currentIndexValue - 1;
      }
      const previousSlot = this.slotTargets.at(this.currentIndexValue);
      if (!previousSlot) return;
      this.focusElement(previousSlot);
    }
    focusElement(el) {
      el.classList.add(...this.focusClasses);
      el.querySelector("div").classList.remove("hidden");
      el.querySelector("span").classList.add("hidden");
    }
    blurElement(el) {
      if (this.currentIndexValue == this.maxSizeValue) return;
      el.classList.remove(...this.focusClasses);
      el.querySelector("div").classList.add("hidden");
      el.querySelector("span").classList.remove("hidden");
    }
  }
  class PopoverController extends Controller {
    static targets=[ "trigger", "content", "receiver" ];
    static values={
      placement: {
        type: String,
        default: "bottom"
      },
      openDelay: {
        type: Number,
        default: 10
      },
      closeDelay: {
        type: Number,
        default: 10
      },
      mouseout: {
        typer: String,
        default: "keep"
      },
      level: {
        type: Number,
        default: 0
      }
    };
    connect() {
      this.updatePosition.bind(this);
      useClickOutside(this);
      this.mouseOnContent = false;
      this.element.dataset.state = "closed";
    }
    handleMouseenterContent() {
      this.mouseOnContent = true;
    }
    handleMouseleaveContent() {
      this.mouseOnContent = false;
      if (this.mouseoutValue == "close") {
        this.closePopover();
      }
    }
    handleWindowResize() {
      if (!this.isOpen()) return;
      if (this.placementValue == "cursor") {
        this.closePopover();
      } else {
        this.updatePosition(true);
      }
    }
    handleEsc(e) {
      if (this.isOpen()) {
        e.preventDefault();
        this.closePopover();
      }
    }
    clickOutside(event) {
      if (this.isOpen()) {
        event.preventDefault();
        this.closePopover();
      }
    }
    toggle() {
      if (this.isOpen()) {
        this.closePopover();
      } else {
        this.openPopover();
      }
    }
    openPopover(e) {
      if (this.placementValue == "cursor") {
        if (e.detail.positionX && e.detail.positionY) {
          this.mouseX = e.detail.positionX;
          this.mouseY = e.detail.positionY;
        } else {
          this.mouseX = e.pageX + 1;
          this.mouseY = e.pageY + 1;
        }
      }
      clearTimeout(this.closeTimer);
      this.openTimer = window.setTimeout((() => this.setPopoverOpen()), this.openDelayValue);
    }
    setPopoverOpen() {
      const eventDetails = {
        detail: {
          content: this.contentTarget,
          trigger: this.triggerTarget,
          level: this.levelValue
        }
      };
      this.dispatch("ui:before-open", eventDetails);
      this.receiverTargets.forEach((x => {
        x.dispatchEvent(new CustomEvent("ui--popover:before-open", eventDetails));
      }));
      if (this.placementValue == "cursor") {
        Object.assign(this.contentTarget.style, {
          left: `${this.mouseX}px`,
          top: `${this.mouseY}px`
        });
      } else {
        this.updatePosition(true);
      }
      this.triggerTarget.dataset["state"] = "open";
      this.element.dataset["state"] = "open";
      this.contentTarget.dataset["state"] = "open";
      this.contentTarget.style["display"] = "block";
      this.contentTarget.focus({
        focusVisible: true
      });
      this.bodyOverflow = document.body.style["overflow-y"];
      document.body.style["overflow-y"] = "hidden";
      this.dispatch("open", eventDetails);
      this.checkArrows();
      this.receiverTargets.forEach((x => {
        console.log("receivers", x);
        x.dispatchEvent(new CustomEvent("ui--popover:open", eventDetails));
      }));
    }
    checkArrows() {
      const scrollsController = this.application.getControllerForElementAndIdentifier(this.contentTarget, "ui--scroll-buttons");
      if (scrollsController) {
        scrollsController.checkArrows();
      }
    }
    closePopover() {
      clearTimeout(this.openTimer);
      if (!this.mouseOnContent) {
        this.closeTimer = window.setTimeout((() => this.setPopoverClose()), this.closeDelayValue);
      }
    }
    setPopoverClose(force = false) {
      if (this.mouseOnContent && !force) {
        return true;
      }
      this.mouseOnContent = false;
      if (this.hasTriggerTarget) {
        this.triggerTarget.dataset["state"] = "closed";
      }
      this.element.dataset["state"] = "closed";
      document.body.style["overflow-y"] = this.bodyOverflow;
      if (this.hasContentTarget) {
        this.closePopoverContent(this.contentTarget);
        this.closeNestedPopovers();
      }
    }
    closeNestedPopovers() {
      if (this.hasContentTarget) {
        this.contentTarget.querySelectorAll('[data-ui--popover-target="content"]').forEach((x => {
          this.closePopoverContent(x);
        }));
      }
    }
    handleRequestClose(e) {
      console.log("[popover] requested to close..", e);
      const forceClose = e.detail.forceClose == true;
      console.log("should I force?", forceClose);
      this.setPopoverClose(forceClose);
    }
    closePopoverContent(el, via = "mouse") {
      el.style["display"] = "none";
      el.dataset.state = "closed";
      const eventDetails = {
        detail: {
          content: this.contentTarget,
          trigger: this.triggerTarget,
          level: this.levelValue
        }
      };
      this.dispatch("close", eventDetails);
      this.receiverTargets.forEach((x => {
        x.dispatchEvent(new CustomEvent("ui--popover:close", eventDetails));
      }));
    }
    isOpen() {
      return this.element.dataset.state == "open";
    }
    updatePosition(force = false) {
      if (this.triggerTarget.dataset["state"] == "open" && !force) {
        return true;
      }
      computePosition(this.triggerTarget, this.contentTarget, {
        placement: this.placementValue,
        middleware: [ offset(4), flip(), shift({
          padding: 5
        }), size({
          apply({availableWidth: availableWidth, availableHeight: availableHeight, elements: elements, ...state}) {
            if (availableHeight < 200) {
              return;
            }
            if (availableHeight > window.innerHeight) {
              availableHeight = window.innerHeight;
            }
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`
            });
          }
        }) ]
      }).then((({x: x, y: y, placement: placement, strategy: strategy, middlewareData: middlewareData}) => {
        Object.assign(this.contentTarget.style, {
          left: `${x}px`,
          top: `${y}px`
        });
      }));
    }
  }
  class RadioGroupController extends Controller {
    static targets=[ "radio", "anput" ];
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
      return this.radioTargets.find((x => x.dataset.state == "checked"));
    }
    radioClickHandler(e) {
      const buttonTargeted = this.radioTargets.find((x => x.contains(e.target)));
      if (buttonTargeted.dataset.state === "checked") {
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
      let span = radio.querySelector("span");
      radio.setAttribute("aria-checked", true);
      radio.dataset.state = "checked";
      radio.tabIndex = 0;
      radio.focus();
      span.dataset.state = "checked";
      span.classList.remove("hidden");
    }
    radioMarkAsUnchecked(radio) {
      let span = radio.querySelector("span");
      radio.setAttribute("aria-checked", false);
      radio.dataset.state = "unchecked";
      radio.tabIndex = -1;
      span.dataset.state = "unchecked";
      span.classList.add("hidden");
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
  class ScrollButtonsController extends Controller {
    static targets=[ "body", "up", "down" ];
    checkArrows(e) {
      console.log("checkig arrows for bodyyyyyyyyyyyy", this.bodyTarget);
      if (this.bodyTarget.scrollTop > 25) {
        this.upTarget.classList.remove("hidden");
      } else {
        this.upTarget.classList.add("hidden");
      }
      if (this.bodyTarget.scrollHeight > this.bodyTarget.clientHeight) {
        if (this.bodyTarget.scrollHeight - this.bodyTarget.clientHeight - 25 < this.bodyTarget.scrollTop) {
          this.downTarget.classList.add("hidden");
        } else {
          this.downTarget.classList.remove("hidden");
        }
      }
    }
    update(e) {
      if (this.lastScrollTop > e.target.scrollTop) {
        this.scrollDirection = "up";
      } else {
        this.scrollDirection = "down";
      }
      this.lastScrollTop = e.target.scrollTop;
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const optionsHeight = this.bodyTarget.clientHeight;
      if (scrollTop > 32) {
        this.upTarget.style.display = "flex";
      } else {
        this.upTarget.style.display = "none";
        clearInterval(this.repeaterUp);
      }
      if (this.scrollDirection == "down") {
        if (scrollTop + optionsHeight + 28 < scrollHeight) {
          this.downTarget.style.display = "flex";
        } else {
          this.downTarget.style.display = "none";
          clearInterval(this.repeaterDown);
        }
      } else if (this.scrollDirection == "up") {
        if (scrollTop + optionsHeight + 15 < scrollHeight) {
          this.downTarget.style.display = "flex";
        }
      }
    }
    showArrows(e) {
      this.update(e);
      this.downTarget.style.display = "flex";
      this.bodyTarget.style.overflowX = "auto";
    }
    hideArrows() {
      this.downTarget.style.display = "none";
      this.upTarget.style.display = "none";
      this.bodyTarget.style.overflowX = "hidden";
    }
    preventScroll(e) {
      if (e.target !== this.bodyTarget) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    handlePopoverOpen(e) {
      console.log("popover open");
      this.bodyTarget.scroll({
        top: 0,
        behavior: "instant"
      });
      this.checkArrows(e);
    }
    handlePopoverClose(e) {
      console.log("popover closed");
      this.bodyTarget.scroll({
        top: 0,
        behavior: "instant"
      });
    }
    scrollUp() {
      this.bodyTarget.scroll({
        top: this.bodyTarget.scrollTop - 50,
        behavior: "smooth"
      });
    }
    mouseoverUp() {
      this.repeaterUp = setInterval((() => {
        this.scrollUp();
      }), 50);
    }
    mouseoutUp() {
      clearInterval(this.repeaterUp);
    }
    mouseoverDown() {
      this.repeaterDown = setInterval((() => {
        this.scrollDown();
      }), 50);
    }
    mouseoutDown() {
      clearInterval(this.repeaterDown);
    }
    scrollDown() {
      this.bodyTarget.scroll({
        top: this.bodyTarget.scrollTop + 50,
        behavior: "smooth"
      });
    }
  }
  class SelectController extends Controller {
    static targets=[ "trigger", "content", "item" ];
    connect() {
      console.log(this.checkedItem());
      console.log(this.checkedValue());
      console.log(this.checkedLabel());
      this.state = "closed";
      if (this.checkedItem()) {
        this.triggerTarget.querySelector("span.span-label").innerText = this.checkedLabel();
      }
    }
    checkedItem() {
      return this.itemTargets.find((x => x.dataset.state == "checked"));
    }
    checkedValue() {
      const checked = this.checkedItem();
      if (checked !== undefined) {
        return checked.getAttribute("value");
      }
    }
    checkedLabel() {
      const checked = this.checkedItem();
      if (checked !== undefined) {
        return checked.querySelector("span.span-label").innerText;
      }
    }
    handlePopoverOpen() {
      this.state = "opened";
      const checked = this.checkedItem();
      this.cleanHovered();
      let el;
      if (checked) {
        el = checked;
      } else {
        el = this.itemTargets[0];
      }
      el.scrollIntoView({
        block: "center",
        inline: "center"
      });
      el.setAttribute("aria-selected", "true");
      el.dataset.selected = "true";
    }
    handlePopoverClose() {
      this.state = "closed";
      this.triggerTarget.focus();
    }
    cleanHovered() {
      this.itemTargets.forEach((x => {
        x.setAttribute("aria-selected", "false");
        x.dataset.selected = "false";
      }));
    }
    handleChecked(e) {
      this.cleanChecked();
      this.checkItem(e.target);
    }
    cleanChecked() {
      this.itemTargets.forEach((x => {
        x.querySelector("span").classList.add("hidden");
        x.dataset.state = "unchecked";
      }));
    }
    checkItem(item) {
      console.log("select", item);
      item.querySelector("span").classList.remove("hidden");
      item.dataset.state = "checked";
      this.triggerTarget.querySelector("span.span-label").innerText = this.checkedLabel();
    }
    hoveredItem() {
      return this.itemTargets.find((x => x.dataset.selected == "true"));
    }
    hoverItem(item) {
      item.setAttribute("aria-selected", "true");
      item.dataset.selected = "true";
    }
    handleKeyUp(e) {
      if (this.state == "closed") {
        return true;
      }
      const hovered = this.hoveredItem();
      if (hovered) {
        const hoveredIndex = this.itemTargets.findIndex((x => x == hovered));
        if (hoveredIndex > 0) {
          const target = this.itemTargets[hoveredIndex - 1];
          console.log("selecting!!", target);
          this.cleanHovered();
          this.hoverItem(target);
          target.scrollIntoView({
            block: "center",
            inline: "center"
          });
        }
      }
    }
    handleKeyDown(e) {
      if (this.state == "closed") {
        return true;
      }
      const hovered = this.hoveredItem();
      let hoveredIndex;
      if (hovered) {
        hoveredIndex = this.itemTargets.findIndex((x => x == hovered));
      } else {
        hoveredIndex = -1;
      }
      if (hoveredIndex < this.itemTargets.length - 1) {
        const target = this.itemTargets[hoveredIndex + 1];
        console.log("selecting!!", target);
        this.cleanHovered();
        this.hoverItem(target);
        target.scrollIntoView({
          block: "center",
          inline: "center"
        });
      }
    }
    handleEnter(e) {
      console.log("this.state", this.state);
      if (this.state == "closed") {
        return true;
      }
      const hovered = this.hoveredItem();
      this.cleanChecked();
      this.checkItem(hovered);
    }
    handleEsc(e) {
      this.element.dispatchEvent(new CustomEvent("requestclose", {
        view: window,
        bubbles: true,
        cancelable: true,
        detail: {
          forceClose: true
        }
      }));
    }
  }
  class SelectItemController extends Controller {
    connect() {}
    handleMouseover() {
      this.dispatch("mouseover");
      this.hoverItem();
    }
    handleMouseout() {
      this.leaveItem();
    }
    handleClick(e) {
      this.dispatch("checked", {
        target: e.currentTarget,
        value: e.currentTarget.innerText
      });
    }
    hoverItem() {
      this.element.setAttribute("aria-selected", "true");
      this.element.dataset.selected = "true";
    }
    leaveItem() {
      this.element.setAttribute("aria-selected", "false");
      this.element.dataset.selected = "false";
    }
  }
  class SwitchController extends Controller {
    static targets=[ "span" ];
    connect() {
      console.log("hello from switch!");
    }
    handleToggle() {
      if (this.element.dataset.state == "checked") {
        this.element.setAttribute("aria-checked", "false");
        this.element.dataset.state = "unchecked";
        this.spanTarget.dataset.state = "unchecked";
      } else {
        this.element.setAttribute("aria-checked", "true");
        this.element.dataset.state = "checked";
        this.spanTarget.dataset.state = "checked";
      }
    }
  }
  class TabsController extends Controller {
    static targets=[ "trigger", "content" ];
    connect() {}
    handleTriggerClick(e) {
      console.log("handleTriggerClick@tabs");
      const target = e.target;
      const ariaControls = target.attributes["aria-controls"].value;
      const content = this.findContentFor(ariaControls);
      console.log("handleTriggerClick@tabs", "aria-controls", ariaControls);
      console.log("handleTriggerClick@tabs", "content", content);
      this.unselectAllTrigers();
      this.selectTrigger(target);
      this.hideAllContents();
      this.showContent(content);
    }
    findContentFor(id) {
      console.log("findContentFor@tabs", id);
      return this.contentTargets.find((x => {
        console.log("findContentFor@tabs find", x.attributes["aria-labelledby"]);
        return x.id == id;
      }));
    }
    unselectAllTrigers() {
      this.triggerTargets.forEach((x => {
        this.unselectTrigger(x);
      }));
    }
    hideAllContents() {
      this.contentTargets.forEach((x => {
        this.hideContent(x);
      }));
    }
    hideContent(el) {
      el.dataset.state = "inactive";
      el.setAttribute("tabindex", -1);
    }
    unselectTrigger(el) {
      el.setAttribute("aria-selected", "false");
      el.dataset.state = "inactive";
    }
    showContent(el) {
      console.log("showContent@tabs", el);
      el.dataset.state = "active";
      el.setAttribute("tabindex", 0);
    }
    selectTrigger(el) {
      el.setAttribute("aria-selected", "true");
      el.dataset.state = "active";
    }
  }
  class ToggleController extends Controller {
    connect() {}
    handleClick(e) {
      this.toggle();
    }
    toggle() {
      const el = this.element;
      const state = el.dataset.state;
      if (state == "on") {
        this.unpress(el);
      } else {
        this.press(el);
      }
    }
    press(el) {
      el.dataset.state = "on";
      el.setAttribute("aria-pressed", "true");
      this.dispatch("press");
    }
    unpress(el) {
      el.dataset.state = "off";
      el.setAttribute("aria-pressed", "false");
      this.dispatch("unpress");
    }
  }
  class ToggleGroupController extends Controller {
    static targets=[ "toggle" ];
    static values={
      type: {
        type: String,
        default: "multiple"
      }
    };
    handleTogglePressed(e) {
      console.log("handleTogglePressed@toggle-group");
      if (this.typeValue == "multiple") return;
      const target = e.target;
      this.toggleTargets.forEach((el => {
        console.log("checking el", el, target, el == target);
        if (el != target) {
          const toggleController = this.application.getControllerForElementAndIdentifier(el, "ui--toggle");
          toggleController.unpress(el);
        }
      }));
    }
  }
  const registerControllers = application => {
    application.register("ui--accordion", AccordionController);
    application.register("ui--accordion-item", AccordionItemController);
    application.register("ui--avatar", AvatarController);
    application.register("ui--calendar", CalendarController);
    application.register("ui--checkbox", CheckboxController);
    application.register("ui--collapsible", CollapsibleController);
    application.register("ui--combobox", ComboboxController);
    application.register("ui--combobox-content", ComboboxContentController);
    application.register("ui--combobox-trigger", ComboboxTriggerController);
    application.register("ui--context-menu", ContextMenuController);
    application.register("ui--date-picker", DatePickerController);
    application.register("ui--dropdown-content", DropdownContentController);
    application.register("ui--dropdown-checkbox", DropdownCheckboxController);
    application.register("ui--dropdown-menu", DropdownMenuController);
    application.register("ui--dropdown-radio-group", DropdownRadioGroupController);
    application.register("ui--dropdown-submenu", DropdownSubmenuController);
    application.register("ui--filter", FilterController);
    application.register("ui--input-otp", InputOtpController);
    application.register("ui--popover", PopoverController);
    application.register("ui--radio-group", RadioGroupController);
    application.register("ui--select", SelectController);
    application.register("ui--select-item", SelectItemController);
    application.register("ui--scroll-buttons", ScrollButtonsController);
    application.register("ui--switch", SwitchController);
    application.register("ui--tabs", TabsController);
    application.register("ui--toggle", ToggleController);
    application.register("ui--toggle-group", ToggleGroupController);
  };
  exports.AccordionController = AccordionController;
  exports.AccordionItemController = AccordionItemController;
  exports.AvatarController = AvatarController;
  exports.CheckboxController = CheckboxController;
  exports.CollapsibleController = CollapsibleController;
  exports.ComboboxContentController = ComboboxContentController;
  exports.ComboboxController = ComboboxController;
  exports.ComboboxTriggerController = ComboboxTriggerController;
  exports.ContextMenuController = ContextMenuController;
  exports.DatePickerController = DatePickerController;
  exports.DropdownCheckboxController = DropdownCheckboxController;
  exports.DropdownContentController = DropdownContentController;
  exports.DropdownMenuController = DropdownMenuController;
  exports.DropdownRadioGroupController = DropdownRadioGroupController;
  exports.DropdownSubmenuController = DropdownSubmenuController;
  exports.FilterController = FilterController;
  exports.InputOtpController = InputOtpController;
  exports.PopoverController = PopoverController;
  exports.RadioGroupController = RadioGroupController;
  exports.ScrollButtonsController = ScrollButtonsController;
  exports.SelectController = SelectController;
  exports.SelectItemController = SelectItemController;
  exports.SwitchController = SwitchController;
  exports.TabsController = TabsController;
  exports.ToggleController = ToggleController;
  exports.ToggleGroupController = ToggleGroupController;
  exports.registerControllers = registerControllers;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
