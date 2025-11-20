import { Controller } from "@hotwired/stimulus";

class HelloController extends Controller {
  static targets=[ "name", "output" ];
  static values={
    greeting: {
      type: String,
      default: "Hello"
    }
  };
  connect() {
    console.log("Hello controller connected!", this.element);
  }
  greet() {
    const name = this.hasNameTarget ? this.nameTarget.value : "World";
    const message = `${this.greetingValue}, ${name}!`;
    if (this.hasOutputTarget) {
      this.outputTarget.textContent = message;
    }
    console.log(message);
  }
  updateGreeting() {
    if (this.hasNameTarget && this.hasOutputTarget) {
      this.greet();
    }
  }
}

const min = Math.min;

const max = Math.max;

const round = Math.round;

const floor = Math.floor;

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

const yAxisSides = new Set([ "top", "bottom" ]);

function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? "y" : "x";
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
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}

const lrPlacement = [ "left", "right" ];

const rlPlacement = [ "right", "left" ];

const tbPlacement = [ "top", "bottom" ];

const btPlacement = [ "bottom", "top" ];

function getSideList(side, isStart, rtl) {
  switch (side) {
   case "top":
   case "bottom":
    if (rtl) return isStart ? rlPlacement : lrPlacement;
    return isStart ? lrPlacement : rlPlacement;

   case "left":
   case "right":
    return isStart ? tbPlacement : btPlacement;

   default:
    return [];
  }
}

function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}

function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
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
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || overflowsData.every(d => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
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
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
           case "bestFit":
            {
              var _overflowsData$filter2;
              const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || currentSideAxis === "y";
                }
                return true;
              }).map(d => [ d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0) ]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
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

const originSides = new Set([ "left", "top" ]);

async function convertValueToCoords(state, options) {
  const {placement: placement, platform: platform, elements: elements} = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
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

const invalidOverflowDisplayValues = new Set([ "inline", "contents" ]);

function isOverflowElement(element) {
  const {overflow: overflow, overflowX: overflowX, overflowY: overflowY, display: display} = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}

const tableElements = new Set([ "table", "td", "th" ]);

function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}

const topLayerSelectors = [ ":popover-open", ":modal" ];

function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}

const transformProperties = [ "transform", "translate", "scale", "rotate", "perspective" ];

const willChangeValues = [ "transform", "translate", "scale", "rotate", "perspective", "filter" ];

const containValues = [ "paint", "layout", "strict", "content" ];

function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return transformProperties.some(value => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some(value => (css.willChange || "").includes(value)) || containValues.some(value => (css.contain || "").includes(value));
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

const lastTraversableNodeNames = new Set([ "html", "body", "#document" ]);

function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}

function getComputedStyle$1(element) {
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
  const css = getComputedStyle$1(element);
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
      const css = getComputedStyle$1(currentIFrame);
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

function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x: x,
    y: y
  };
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
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

const SCROLLBAR_MAX = 25;

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
  const windowScrollbarX = getWindowScrollBarX(html);
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    width += windowScrollbarX;
  }
  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

const absoluteOrFixed = new Set([ "absolute", "fixed" ]);

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
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}

function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}

function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter(ancestor => ancestor !== currentNode);
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
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
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
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x: x,
    y: y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
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
  return getComputedStyle$1(element).direction === "rtl";
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

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {left: left, top: top, width: width, height: height} = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin: rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {ancestorScroll: ancestorScroll = true, ancestorResize: ancestorResize = true, elementResize: elementResize = typeof ResizeObserver === "function", layoutShift: layoutShift = typeof IntersectionObserver === "function", animationFrame: animationFrame = false} = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [ ...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating) ] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

const offset = offset$1;

const shift = shift$1;

const flip = flip$1;

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

class DropdownController extends Controller {
  static targets=[ "trigger", "menu", "content", "item" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    offset: {
      type: Number,
      default: 4
    },
    flip: {
      type: Boolean,
      default: true
    }
  };
  constructor() {
    super(...arguments);
    this.cleanup = null;
    this.closeSubmenuTimeouts = new Map;
    this.lastHoveredItem = null;
    this.shouldReturnFocusToTrigger = false;
  }
  connect() {
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    document.addEventListener("click", this.boundHandleClickOutside);
  }
  disconnect() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    this.closeSubmenuTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.closeSubmenuTimeouts.clear();
    document.removeEventListener("click", this.boundHandleClickOutside);
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }
  openSubmenu(event) {
    const trigger = event.currentTarget;
    const submenu = trigger.nextElementSibling;
    if (document.activeElement && document.activeElement.hasAttribute("role") && document.activeElement.getAttribute("role") === "menuitem") {
      document.activeElement.blur();
    }
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"]');
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute("tabindex", "-1");
    });
    trigger.setAttribute("tabindex", "0");
    this.lastHoveredItem = trigger;
    if (this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger));
      this.closeSubmenuTimeouts.delete(trigger);
    }
    if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
      this.closeSiblingSubmenus(trigger);
      submenu.classList.remove("hidden");
      submenu.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      this.positionSubmenu(trigger, submenu);
      this.focusFirstCommandItem(submenu);
    }
  }
  positionSubmenu(trigger, submenu) {
    const side = submenu.getAttribute("data-side") || "right";
    const align = submenu.getAttribute("data-align") || "start";
    const placement = `${side}-${align}`;
    computePosition(trigger, submenu, {
      placement: placement,
      middleware: [ offset(8), flip(), shift({
        padding: 8
      }) ],
      strategy: "absolute"
    }).then(({x: x, y: y, placement: finalPlacement}) => {
      Object.assign(submenu.style, {
        left: `${x}px`,
        top: `${y}px`
      });
      const [finalSide, finalAlign] = finalPlacement.split("-");
      submenu.setAttribute("data-side", finalSide);
      submenu.setAttribute("data-align", finalAlign || "center");
    });
  }
  focusFirstCommandItem(submenu) {
    const commandElement = submenu.querySelector('[data-controller~="command"]');
    if (!commandElement) return;
    setTimeout(() => {
      const firstOption = commandElement.querySelector('[role="option"]:not([data-hidden])');
      if (firstOption) {
        const allOptions = commandElement.querySelectorAll('[role="option"]');
        allOptions.forEach(option => {
          option.removeAttribute("data-focused");
          option.classList.remove("bg-accent", "text-accent-foreground");
        });
        firstOption.setAttribute("data-focused", "true");
        firstOption.classList.add("bg-accent", "text-accent-foreground");
      }
    }, 50);
  }
  trackHoveredItem(event) {
    const item = event.currentTarget;
    if (document.activeElement && document.activeElement.hasAttribute("role") && document.activeElement.getAttribute("role") === "menuitem") {
      document.activeElement.blur();
    }
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"]');
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute("tabindex", "-1");
    });
    item.setAttribute("tabindex", "0");
    this.lastHoveredItem = item;
  }
  toggleCheckbox(event) {
    const item = event.currentTarget;
    if (item.getAttribute("role") !== "menuitemcheckbox") return;
    event.stopPropagation();
    const currentState = item.getAttribute("data-state");
    const newState = currentState === "checked" ? "unchecked" : "checked";
    const isChecked = newState === "checked";
    item.setAttribute("data-state", newState);
    item.setAttribute("aria-checked", isChecked);
    const checkIcon = item.querySelector('[data-state="checked"]');
    if (checkIcon) {
      checkIcon.parentElement.innerHTML = isChecked ? `\n        <span data-state="checked">\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4">\n            <path d="M20 6 9 17l-5-5"></path>\n          </svg>\n        </span>\n      ` : "";
    } else if (isChecked) {
      const iconContainer = item.querySelector(".absolute.left-2");
      if (iconContainer) {
        iconContainer.innerHTML = `\n          <span data-state="checked">\n            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4">\n              <path d="M20 6 9 17l-5-5"></path>\n            </svg>\n          </span>\n        `;
      }
    }
  }
  selectRadio(event) {
    const item = event.currentTarget;
    if (item.getAttribute("role") !== "menuitemradio") return;
    event.stopPropagation();
    const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]');
    if (!radioGroup) return;
    const allRadios = radioGroup.querySelectorAll('[role="menuitemradio"]');
    allRadios.forEach(radio => {
      radio.setAttribute("data-state", "unchecked");
      radio.setAttribute("aria-checked", "false");
      const iconContainer = radio.querySelector(".absolute.left-2");
      if (iconContainer) {
        iconContainer.innerHTML = "";
      }
    });
    item.setAttribute("data-state", "checked");
    item.setAttribute("aria-checked", "true");
    const iconContainer = item.querySelector(".absolute.left-2");
    if (iconContainer) {
      iconContainer.innerHTML = `\n        <span data-state="checked">\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle size-2 fill-current">\n            <circle cx="12" cy="12" r="10"></circle>\n          </svg>\n        </span>\n      `;
    }
  }
  closeSubmenu(event) {
    const trigger = event.currentTarget;
    const submenu = trigger.nextElementSibling;
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && submenu && submenu.contains(relatedTarget)) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
        this.closeSubmenuAndChildren(submenu, trigger);
      }
      this.closeSubmenuTimeouts.delete(trigger);
    }, 300);
    this.closeSubmenuTimeouts.set(trigger, timeoutId);
  }
  closeSubmenuAndChildren(submenu, trigger) {
    const nestedSubmenus = submenu.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]');
    nestedSubmenus.forEach(nested => {
      nested.classList.add("hidden");
      nested.setAttribute("data-state", "closed");
      const nestedTrigger = nested.previousElementSibling;
      if (nestedTrigger) {
        nestedTrigger.setAttribute("data-state", "closed");
      }
    });
    submenu.classList.add("hidden");
    submenu.setAttribute("data-state", "closed");
    trigger.setAttribute("data-state", "closed");
  }
  closeSiblingSubmenus(currentTrigger) {
    const parentMenu = currentTrigger.closest('[role="menu"]');
    if (!parentMenu) return;
    const siblingTriggers = Array.from(parentMenu.children).filter(child => child !== currentTrigger && child.hasAttribute("data-dropdown-target") && child.getAttribute("data-dropdown-target").includes("item"));
    siblingTriggers.forEach(sibling => {
      const siblingSubmenu = sibling.nextElementSibling;
      if (siblingSubmenu && siblingSubmenu.hasAttribute("role") && siblingSubmenu.getAttribute("role") === "menu") {
        this.closeSubmenuAndChildren(siblingSubmenu, sibling);
      }
    });
  }
  closeAllSubmenus() {
    const submenus = this.element.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]');
    submenus.forEach(submenu => {
      submenu.classList.add("hidden");
      submenu.setAttribute("data-state", "closed");
      const trigger = submenu.previousElementSibling;
      if (trigger) {
        trigger.setAttribute("data-state", "closed");
      }
    });
  }
  toggle(event) {
    this.openValue = !this.openValue;
    const target = this.hasMenuTarget ? this.menuTarget : this.contentTarget;
    target.classList.toggle("hidden");
    if (!target.classList.contains("hidden")) {
      target.setAttribute("data-state", "open");
      this.positionDropdown();
      this.setupKeyboardNavigation();
      setTimeout(() => {
        this.focusItem(0);
      }, 100);
    } else {
      target.setAttribute("data-state", "closed");
      this.teardownKeyboardNavigation();
    }
  }
  close(options = {}) {
    const {returnFocus: returnFocus = this.shouldReturnFocusToTrigger} = options;
    this.openValue = false;
    const target = this.hasMenuTarget ? this.menuTarget : this.contentTarget;
    this.closeAllSubmenus();
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
    this.lastHoveredItem = null;
    if (target) {
      target.classList.add("hidden");
      target.setAttribute("data-state", "closed");
    }
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    this.teardownKeyboardNavigation();
    if (returnFocus && this.hasTriggerTarget) {
      setTimeout(() => {
        if (this.triggerTarget) {
          this.triggerTarget.focus();
        }
      }, 150);
    }
    this.shouldReturnFocusToTrigger = false;
  }
  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close({
        returnFocus: false
      });
    } else if (this.hasTriggerTarget && this.triggerTarget.contains(event.target)) {
      return;
    }
  }
  setupKeyboardNavigation() {
    document.addEventListener("keydown", this.boundHandleKeydown);
  }
  teardownKeyboardNavigation() {
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }
  handleKeydown(event) {
    if (!this.openValue) return;
    const focusedElement = document.activeElement;
    const focusedCommandOption = this.element.querySelector('[data-controller~="command"] [role="option"][data-focused="true"]');
    if (focusedCommandOption && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      const commandElement = focusedCommandOption.closest('[data-controller~="command"]');
      this.handleCommandNavigation(event, commandElement);
      return;
    }
    const items = this.getFocusableItems();
    switch (event.key) {
     case "ArrowDown":
      event.preventDefault();
      this.focusNextItem(items);
      break;

     case "ArrowUp":
      event.preventDefault();
      this.focusPreviousItem(items);
      break;

     case "ArrowRight":
      event.preventDefault();
      if (focusedElement && this.hasSubmenu(focusedElement)) {
        this.openSubmenuWithKeyboard(focusedElement);
      }
      break;

     case "ArrowLeft":
      event.preventDefault();
      if (focusedCommandOption) {
        const commandElement = focusedCommandOption.closest('[data-controller~="command"]');
        this.closeCommandSubmenu(commandElement);
      } else {
        this.closeCurrentSubmenuWithKeyboard(focusedElement);
      }
      break;

     case "Home":
      event.preventDefault();
      this.focusItem(0, items);
      break;

     case "End":
      event.preventDefault();
      this.focusItem(items.length - 1, items);
      break;

     case "Escape":
      event.preventDefault();
      if (focusedCommandOption) {
        const commandElement = focusedCommandOption.closest('[data-controller~="command"]');
        this.closeCommandSubmenu(commandElement);
      } else if (!this.closeCurrentSubmenuWithKeyboard(focusedElement)) {
        this.close();
      }
      break;

     case "Enter":
      event.preventDefault();
      const enterTarget = this.getKeyboardFocusedItem() || focusedElement;
      if (enterTarget && enterTarget.hasAttribute("role")) {
        const role = enterTarget.getAttribute("role");
        if (role === "menuitem") {
          if (this.hasSubmenu(enterTarget)) {
            this.openSubmenuWithKeyboard(enterTarget);
          } else {
            enterTarget.click();
            this.close();
          }
        } else if (role === "menuitemcheckbox" || role === "menuitemradio") {
          enterTarget.click();
          this.shouldReturnFocusToTrigger = true;
          this.close();
        }
      }
      break;

     case " ":
      event.preventDefault();
      const spaceTarget = this.getKeyboardFocusedItem() || focusedElement;
      if (spaceTarget && spaceTarget.hasAttribute("role")) {
        const role = spaceTarget.getAttribute("role");
        if (role === "menuitem") {
          if (this.hasSubmenu(spaceTarget)) {
            this.openSubmenuWithKeyboard(spaceTarget);
          } else {
            spaceTarget.click();
            this.close();
          }
        } else if (role === "menuitemcheckbox" || role === "menuitemradio") {
          spaceTarget.click();
        }
      }
      break;
    }
  }
  getFocusableItems() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    const currentItem = Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
    console.log('[getFocusableItems] currentItem with tabindex="0":', currentItem?.textContent.trim());
    let currentMenu = null;
    if (currentItem) {
      currentMenu = currentItem.closest('[role="menu"]');
      console.log("[getFocusableItems] found currentMenu from currentItem, data-side:", currentMenu?.getAttribute("data-side"));
    } else {
      currentMenu = this.hasMenuTarget ? this.menuTarget : this.contentTarget;
      console.log("[getFocusableItems] no currentItem, defaulting to main menu. hasMenuTarget:", this.hasMenuTarget, "hasContentTarget:", this.hasContentTarget, "currentMenu children count:", currentMenu?.children.length);
    }
    if (!currentMenu) {
      console.log("[getFocusableItems] no currentMenu found, returning empty array");
      return [];
    }
    const items = [];
    Array.from(currentMenu.children).forEach((child, index) => {
      const role = child.getAttribute("role");
      console.log(`[getFocusableItems] child ${index}: role="${role}", hasDataDisabled=${child.hasAttribute("data-disabled")}`);
      if (child.hasAttribute("role") && (role === "menuitem" || role === "menuitemcheckbox" || role === "menuitemradio")) {
        if (!child.hasAttribute("data-disabled")) {
          console.log(`[getFocusableItems] Adding child ${index} to items (role=${role})`);
          items.push(child);
        }
      } else if (child.getAttribute("role") === "group") {
        const radioItems = child.querySelectorAll('[role="menuitemradio"]');
        console.log(`[getFocusableItems] Found radio group with ${radioItems.length} radio items`);
        radioItems.forEach(radioItem => {
          if (!radioItem.hasAttribute("data-disabled")) {
            items.push(radioItem);
          }
        });
      } else if (child.classList && child.classList.contains("relative")) {
        const trigger = child.querySelector(':scope > [role="menuitem"]');
        if (trigger && !trigger.hasAttribute("data-disabled")) {
          items.push(trigger);
        }
      }
    });
    console.log("[getFocusableItems] returning items:", items.map(i => i.textContent.trim()));
    return items;
  }
  focusNextItem(items = null) {
    items = items || this.getFocusableItems();
    console.log("[focusNextItem] items:", items.map(i => i.textContent.trim()));
    if (items.length === 0) return;
    let currentIndex = this.findCurrentItemIndex(items);
    console.log("[focusNextItem] currentIndex:", currentIndex, "item:", items[currentIndex]?.textContent.trim());
    if (currentIndex === -1 || currentIndex >= items.length - 1) {
      console.log("[focusNextItem] wrapping to 0 or starting at 0");
      this.focusItem(0, items);
    } else {
      console.log("[focusNextItem] moving to index:", currentIndex + 1, "item:", items[currentIndex + 1]?.textContent.trim());
      this.focusItem(currentIndex + 1, items);
    }
  }
  focusPreviousItem(items = null) {
    items = items || this.getFocusableItems();
    if (items.length === 0) return;
    let currentIndex = this.findCurrentItemIndex(items);
    if (currentIndex === -1 || currentIndex === 0) {
      this.focusItem(items.length - 1, items);
    } else {
      this.focusItem(currentIndex - 1, items);
    }
  }
  findCurrentItemIndex(items) {
    const currentItem = items.find(item => item.getAttribute("tabindex") === "0");
    if (currentItem) {
      return items.indexOf(currentItem);
    }
    return -1;
  }
  focusItem(index, items = null) {
    console.log("[focusItem] called with index:", index, "items passed:", items?.map(i => i.textContent.trim()));
    items = this.getFocusableItems();
    console.log("[focusItem] after recalculating, items:", items.map(i => i.textContent.trim()));
    if (items.length === 0 || index < 0 || index >= items.length) {
      console.log("[focusItem] early return - items.length:", items.length, "index:", index);
      return;
    }
    const currentMenu = items[0] ? items[0].closest('[role="menu"]') : null;
    if (currentMenu) {
      const siblingsWithSubmenus = Array.from(currentMenu.children).filter(child => {
        if (child.classList && child.classList.contains("relative")) {
          const trigger = child.querySelector(':scope > [role="menuitem"]');
          const submenu = trigger?.nextElementSibling;
          return submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu";
        }
        return false;
      });
      siblingsWithSubmenus.forEach(container => {
        const trigger = container.querySelector(':scope > [role="menuitem"]');
        const submenu = trigger?.nextElementSibling;
        if (submenu && submenu.getAttribute("data-state") === "open") {
          this.closeSubmenuAndChildren(submenu, trigger);
        }
      });
    }
    console.log('[focusItem] setting ALL menuitems in dropdown to tabindex="-1"');
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
    const targetItem = items[index];
    if (!targetItem) {
      console.error("[focusItem] ERROR: targetItem is undefined at index", index, "items:", items);
      return;
    }
    console.log("[focusItem] setting focus on item at index", index, ":", targetItem.textContent.trim());
    targetItem.setAttribute("tabindex", "0");
    targetItem.focus();
    this.lastHoveredItem = targetItem;
    console.log("[focusItem] done, lastHoveredItem:", this.lastHoveredItem?.textContent.trim());
  }
  getKeyboardFocusedItem() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    return Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
  }
  hasSubmenu(menuItem) {
    if (!menuItem) return false;
    const nextSibling = menuItem.nextElementSibling;
    return nextSibling && nextSibling.hasAttribute("role") && nextSibling.getAttribute("role") === "menu";
  }
  openSubmenuWithKeyboard(trigger) {
    const submenu = trigger.nextElementSibling;
    if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
      this.closeSiblingSubmenus(trigger);
      submenu.classList.remove("hidden");
      submenu.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      this.positionSubmenu(trigger, submenu);
      const commandElement = submenu.querySelector('[data-controller~="command"]');
      if (commandElement) {
        this.focusFirstCommandItem(submenu);
        return;
      }
      const submenuItems = [];
      Array.from(submenu.children).forEach(child => {
        if (child.hasAttribute("role") && child.getAttribute("role") === "menuitem") {
          if (!child.hasAttribute("data-disabled")) {
            submenuItems.push(child);
          }
        } else if (child.classList && child.classList.contains("relative")) {
          const itemTrigger = child.querySelector(':scope > [role="menuitem"]');
          if (itemTrigger && !itemTrigger.hasAttribute("data-disabled")) {
            submenuItems.push(itemTrigger);
          }
        }
      });
      const allMenuItems = this.element.querySelectorAll('[role="menuitem"]');
      allMenuItems.forEach(item => {
        item.setAttribute("tabindex", "-1");
      });
      if (submenuItems.length > 0) {
        const firstItem = submenuItems[0];
        firstItem.setAttribute("tabindex", "0");
        firstItem.focus();
        this.lastHoveredItem = firstItem;
      }
    }
  }
  closeCurrentSubmenuWithKeyboard(focusedElement) {
    const allItems = this.element.querySelectorAll('[role="menuitem"]');
    const currentItem = Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
    if (!currentItem) return false;
    const parentMenu = currentItem.closest('[role="menu"]');
    if (!parentMenu) return false;
    const dataSide = parentMenu.getAttribute("data-side");
    if (dataSide === "right" || dataSide === "right-start") {
      const trigger = parentMenu.previousElementSibling;
      this.closeSubmenuAndChildren(parentMenu, trigger);
      if (trigger) {
        const triggerParentMenu = trigger.closest('[role="menu"]');
        if (triggerParentMenu) {
          const parentMenuItems = [];
          Array.from(triggerParentMenu.children).forEach(child => {
            if (child.hasAttribute("role") && child.getAttribute("role") === "menuitem") {
              parentMenuItems.push(child);
            } else if (child.classList && child.classList.contains("relative")) {
              const itemTrigger = child.querySelector(':scope > [role="menuitem"]');
              if (itemTrigger) {
                parentMenuItems.push(itemTrigger);
              }
            }
          });
          parentMenuItems.forEach(item => {
            item.setAttribute("tabindex", "-1");
          });
        }
        trigger.setAttribute("tabindex", "0");
        trigger.focus();
        this.lastHoveredItem = trigger;
      }
      return true;
    }
    return false;
  }
  handleCommandNavigation(event, commandElement) {
    event.preventDefault();
    const allOptions = Array.from(commandElement.querySelectorAll('[role="option"]:not([data-hidden])'));
    const currentOption = allOptions.find(opt => opt.getAttribute("data-focused") === "true");
    let currentIndex = currentOption ? allOptions.indexOf(currentOption) : -1;
    if (event.key === "ArrowDown") {
      currentIndex = currentIndex < allOptions.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === "ArrowUp") {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : allOptions.length - 1;
    }
    allOptions.forEach(opt => {
      opt.removeAttribute("data-focused");
      opt.classList.remove("bg-accent", "text-accent-foreground");
    });
    if (allOptions[currentIndex]) {
      allOptions[currentIndex].setAttribute("data-focused", "true");
      allOptions[currentIndex].classList.add("bg-accent", "text-accent-foreground");
      allOptions[currentIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }
  closeCommandSubmenu(commandElement) {
    const submenu = commandElement.closest('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]');
    if (!submenu) return false;
    const trigger = submenu.previousElementSibling;
    if (!trigger || trigger.getAttribute("role") !== "menuitem") return false;
    const allCommandOptions = commandElement.querySelectorAll('[role="option"]');
    allCommandOptions.forEach(option => {
      option.removeAttribute("data-focused");
      option.classList.remove("bg-accent", "text-accent-foreground");
    });
    submenu.classList.add("hidden");
    submenu.setAttribute("data-state", "closed");
    trigger.setAttribute("data-state", "closed");
    const parentMenu = trigger.closest('[role="menu"]');
    if (parentMenu) {
      const parentItems = [];
      Array.from(parentMenu.children).forEach(child => {
        if (child.hasAttribute("role") && child.getAttribute("role") === "menuitem") {
          parentItems.push(child);
        } else if (child.classList && child.classList.contains("relative")) {
          const itemTrigger = child.querySelector(':scope > [role="menuitem"]');
          if (itemTrigger) {
            parentItems.push(itemTrigger);
          }
        }
      });
      parentItems.forEach(item => {
        item.setAttribute("tabindex", "-1");
      });
    }
    trigger.setAttribute("tabindex", "0");
    trigger.focus();
    this.lastHoveredItem = trigger;
    return true;
  }
  positionDropdown() {
    const trigger = this.hasTriggerTarget ? this.triggerTarget : this.element;
    const content = this.hasContentTarget ? this.contentTarget : this.menuTarget;
    if (!trigger || !content) return;
    if (this.cleanup) {
      this.cleanup();
    }
    const middleware = [];
    if (this.offsetValue > 0) {
      middleware.push(offset(this.offsetValue));
    }
    if (this.flipValue) {
      middleware.push(flip());
    }
    middleware.push(shift({
      padding: 8
    }));
    const update = () => {
      computePosition(trigger, content, {
        placement: this.placementValue,
        middleware: middleware,
        strategy: "absolute"
      }).then(({x: x, y: y, placement: placement, middlewareData: middlewareData}) => {
        Object.assign(content.style, {
          left: `${x}px`,
          top: `${y}px`
        });
        const side = placement.split("-")[0];
        content.setAttribute("data-side", side);
        const align = placement.split("-")[1] || "center";
        content.setAttribute("data-align", align);
      });
    };
    this.cleanup = autoUpdate(trigger, content, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    });
  }
}

class AccordionController extends Controller {
  static targets=[ "item", "trigger", "content" ];
  static values={
    type: {
      type: String,
      default: "single"
    },
    collapsible: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.setupItems();
  }
  setupItems() {
    this.itemTargets.forEach((item, index) => {
      const content = this.contentTargets[index];
      if (content) {
        const isOpen = item.dataset.state === "open";
        content.style.height = isOpen ? `${content.scrollHeight}px` : "0px";
        if (!isOpen) {
          content.setAttribute("hidden", "");
        }
      }
    });
  }
  toggle(event) {
    const trigger = event.currentTarget;
    const index = this.triggerTargets.indexOf(trigger);
    const item = this.itemTargets[index];
    const content = this.contentTargets[index];
    const isOpen = item.dataset.state === "open";
    const shouldOpen = !isOpen;
    if (this.typeValue === "single" && shouldOpen) {
      this.itemTargets.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          this.updateItemState(otherItem, this.triggerTargets[otherIndex], this.contentTargets[otherIndex], false);
        }
      });
    }
    this.updateItemState(item, trigger, content, shouldOpen);
  }
  updateItemState(item, trigger, content, isOpen) {
    const state = isOpen ? "open" : "closed";
    item.dataset.state = state;
    trigger.dataset.state = state;
    trigger.setAttribute("aria-expanded", isOpen);
    content.dataset.state = state;
    const h3 = trigger.parentElement;
    if (h3 && h3.tagName === "H3") {
      h3.dataset.state = state;
    }
    if (isOpen) {
      content.removeAttribute("hidden");
      content.style.height = `${content.scrollHeight}px`;
    } else {
      content.style.height = "0px";
      content.addEventListener("transitionend", () => {
        if (content.dataset.state === "closed") {
          content.setAttribute("hidden", "");
        }
      }, {
        once: true
      });
    }
  }
}

class AlertDialogController extends Controller {
  static targets=[ "container", "overlay", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  };
  connect() {
    if (this.openValue) {
      this.show();
    }
  }
  open() {
    this.openValue = true;
    this.show();
  }
  close() {
    this.openValue = false;
    this.hide();
  }
  show() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "open");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "open");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "open");
    }
    document.body.style.overflow = "hidden";
    this.setupFocusTrap();
    if (this.closeOnEscapeValue) {
      this.escapeHandler = e => {
        if (e.key === "Escape") {
          this.close();
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
    this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
      bubbles: true,
      detail: {
        open: true
      }
    }));
  }
  hide() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "closed");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "closed");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "closed");
    }
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
      this.escapeHandler = null;
    }
    this.element.dispatchEvent(new CustomEvent("alertdialog:close", {
      bubbles: true,
      detail: {
        open: false
      }
    }));
  }
  preventOverlayClose(event) {
    event.stopPropagation();
  }
  setupFocusTrap() {
    if (!this.hasContentTarget) return;
    const focusableElements = this.contentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  disconnect() {
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
    }
  }
}

class AvatarController extends Controller {
  static targets=[ "image", "fallback" ];
  connect() {
    if (this.hasImageTarget) {
      this.boundOnImageLoad = this.onImageLoad.bind(this);
      this.boundOnImageError = this.onImageError.bind(this);
      this.setupImageHandlers();
    }
  }
  setupImageHandlers() {
    if (this.imageTarget.complete) {
      if (this.imageTarget.naturalHeight > 0) {
        this.showImage();
        this.hideFallback();
      } else {
        this.hideImage();
        this.showFallback();
      }
    } else {
      this.imageTarget.addEventListener("load", this.boundOnImageLoad);
      this.imageTarget.addEventListener("error", this.boundOnImageError);
    }
  }
  onImageLoad() {
    this.showImage();
    this.hideFallback();
  }
  onImageError() {
    this.hideImage();
    this.showFallback();
  }
  showImage() {
    if (this.hasImageTarget) {
      this.imageTarget.classList.remove("hidden");
    }
  }
  hideImage() {
    if (this.hasImageTarget) {
      this.imageTarget.classList.add("hidden");
    }
  }
  hideFallback() {
    if (this.hasFallbackTarget) {
      this.fallbackTarget.classList.add("hidden");
    }
  }
  showFallback() {
    if (this.hasFallbackTarget) {
      this.fallbackTarget.classList.remove("hidden");
    }
  }
  disconnect() {
    if (this.hasImageTarget && this.boundOnImageLoad) {
      this.imageTarget.removeEventListener("load", this.boundOnImageLoad);
      this.imageTarget.removeEventListener("error", this.boundOnImageError);
    }
  }
}

class DialogController extends Controller {
  static targets=[ "container", "overlay", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  };
  connect() {
    if (this.openValue) {
      this.show();
    }
  }
  open() {
    this.openValue = true;
    this.show();
  }
  close() {
    this.openValue = false;
    this.hide();
  }
  show() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "open");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "open");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "open");
    }
    document.body.style.overflow = "hidden";
    this.setupFocusTrap();
    if (this.closeOnEscapeValue) {
      this.escapeHandler = e => {
        if (e.key === "Escape") {
          this.close();
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
    this.element.dispatchEvent(new CustomEvent("dialog:open", {
      bubbles: true,
      detail: {
        open: true
      }
    }));
  }
  hide() {
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "closed");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "closed");
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "closed");
    }
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
      this.escapeHandler = null;
    }
    this.element.dispatchEvent(new CustomEvent("dialog:close", {
      bubbles: true,
      detail: {
        open: false
      }
    }));
  }
  closeOnOverlayClick(event) {
    if (this.closeOnOverlayClickValue) {
      this.close();
    }
  }
  setupFocusTrap() {
    if (!this.hasContentTarget) return;
    const focusableElements = this.contentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  disconnect() {
    document.body.style.overflow = "";
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
    }
  }
}

class CheckboxController extends Controller {
  connect() {
    this.updateState();
    this.boundHandleChange = this.handleChange.bind(this);
    this.element.addEventListener("change", this.boundHandleChange);
  }
  disconnect() {
    this.element.removeEventListener("change", this.boundHandleChange);
  }
  handleChange() {
    this.updateState();
  }
  updateState() {
    if (this.element.checked) {
      this.element.dataset.state = "checked";
      this.element.setAttribute("aria-checked", "true");
    } else {
      this.element.dataset.state = "unchecked";
      this.element.setAttribute("aria-checked", "false");
    }
  }
}

function registerControllersInto(application, controllers) {
  for (const [name, controller] of Object.entries(controllers)) {
    try {
      application.register(name, controller);
      console.log(`Registered Stimulus controller: ${name}`);
    } catch (error) {
      console.error(`Failed to register controller ${name}:`, error);
    }
  }
}

const version = "0.1.0";

function registerControllers(application) {
  return registerControllersInto(application, {
    "ui--hello": HelloController,
    "ui--dropdown": DropdownController,
    "ui--accordion": AccordionController,
    "ui--alert-dialog": AlertDialogController,
    "ui--avatar": AvatarController,
    "ui--dialog": DialogController,
    "ui--checkbox": CheckboxController
  });
}

export { AccordionController, AlertDialogController, AvatarController, CheckboxController, DialogController, DropdownController, HelloController, registerControllers, registerControllersInto, version };
