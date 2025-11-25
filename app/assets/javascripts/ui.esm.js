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

const size = size$1;

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
    } else {
      if (this.hasContainerTarget) {
        this.containerTarget.setAttribute("data-state", "closed");
        this.containerTarget.setAttribute("data-initial", "");
      }
      if (this.hasOverlayTarget) {
        this.overlayTarget.setAttribute("data-state", "closed");
        this.overlayTarget.setAttribute("data-initial", "");
      }
      if (this.hasContentTarget) {
        this.contentTarget.setAttribute("data-state", "closed");
        this.contentTarget.setAttribute("data-initial", "");
      }
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
      this.containerTarget.removeAttribute("data-initial");
      this.containerTarget.setAttribute("data-state", "open");
    }
    if (this.hasOverlayTarget) {
      this.overlayTarget.removeAttribute("data-initial");
      this.overlayTarget.setAttribute("data-state", "open");
    }
    if (this.hasContentTarget) {
      this.contentTarget.removeAttribute("data-initial");
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

class CollapsibleController extends Controller {
  static targets=[ "trigger", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.updateState(this.openValue, false);
  }
  toggle(event) {
    if (this.disabledValue) return;
    event.preventDefault();
    this.openValue = !this.openValue;
  }
  openValueChanged() {
    this.updateState(this.openValue, true);
  }
  updateState(isOpen, animate = true) {
    const state = isOpen ? "open" : "closed";
    this.element.dataset.state = state;
    if (this.hasTriggerTarget) {
      this.triggerTarget.dataset.state = state;
      this.triggerTarget.setAttribute("aria-expanded", isOpen);
    }
    if (this.hasContentTarget) {
      const content = this.contentTarget;
      content.dataset.state = state;
      if (isOpen) {
        content.removeAttribute("hidden");
        content.style.height = `${content.scrollHeight}px`;
      } else {
        if (animate) {
          content.style.height = "0px";
          content.addEventListener("transitionend", () => {
            if (content.dataset.state === "closed") {
              content.setAttribute("hidden", "");
            }
          }, {
            once: true
          });
        } else {
          content.style.height = "0px";
          content.setAttribute("hidden", "");
        }
      }
    }
  }
}

class ComboboxController extends Controller {
  static targets=[ "text", "item" ];
  static values={
    value: String
  };
  connect() {
    this.boundHandleSelect = this.handleSelect.bind(this);
    this.element.addEventListener("command:select", this.boundHandleSelect);
    if (this.valueValue) {
      this.updateCheckIcons();
    }
  }
  disconnect() {
    this.element.removeEventListener("command:select", this.boundHandleSelect);
  }
  handleSelect(event) {
    const {value: value, item: item} = event.detail;
    this.valueValue = value;
    if (this.hasTextTarget) {
      const label = item.querySelector("span")?.textContent || value;
      this.textTarget.textContent = label;
    }
    this.updateCheckIcons();
    this.closeContainer();
  }
  updateCheckIcons() {
    this.itemTargets.forEach(item => {
      const itemValue = item.dataset.value;
      const checkIcon = item.querySelector("svg.ml-auto");
      if (checkIcon) {
        if (itemValue === this.valueValue) {
          checkIcon.classList.remove("opacity-0");
          checkIcon.classList.add("opacity-100");
        } else {
          checkIcon.classList.remove("opacity-100");
          checkIcon.classList.add("opacity-0");
        }
      }
    });
  }
  closeContainer() {
    const popoverController = this.application.getControllerForElementAndIdentifier(this.element, "ui--popover");
    if (popoverController) {
      popoverController.hide();
      return;
    }
    let drawerController = this.application.getControllerForElementAndIdentifier(this.element, "ui--drawer");
    if (!drawerController) {
      const drawerElement = this.element.querySelector('[data-controller~="ui--drawer"]');
      if (drawerElement) {
        drawerController = this.application.getControllerForElementAndIdentifier(drawerElement, "ui--drawer");
      }
    }
    if (drawerController) {
      drawerController.hide();
      return;
    }
    const dropdownController = this.application.getControllerForElementAndIdentifier(this.element, "ui--dropdown");
    if (dropdownController) {
      dropdownController.close();
    }
  }
}

class CommandController extends Controller {
  static targets=[ "input", "list", "item", "group", "empty" ];
  static values={
    loop: {
      type: Boolean,
      default: true
    }
  };
  connect() {
    this.selectedIndex = -1;
    this.updateVisibility();
    this.element.addEventListener("popover:show", this.handleShow.bind(this));
    this.element.addEventListener("drawer:show", this.handleShow.bind(this));
  }
  disconnect() {
    this.element.removeEventListener("popover:show", this.handleShow.bind(this));
    this.element.removeEventListener("drawer:show", this.handleShow.bind(this));
  }
  handleShow() {
    if (this.hasInputTarget) {
      this.inputTarget.focus();
    }
    const visibleItems = this.visibleItems;
    if (visibleItems.length > 0) {
      this.selectedIndex = 0;
      this.updateSelection();
    }
  }
  filter() {
    const query = this.inputTarget.value.toLowerCase().trim();
    let hasVisibleItems = false;
    this.itemTargets.forEach(item => {
      const value = (item.dataset.value || item.textContent).toLowerCase();
      const matches = query === "" || value.includes(query);
      item.hidden = !matches;
      if (matches) hasVisibleItems = true;
    });
    this.groupTargets.forEach(group => {
      const items = group.querySelectorAll('[data-slot="command-item"]');
      const hasVisible = Array.from(items).some(item => !item.hidden);
      group.hidden = !hasVisible;
    });
    if (this.hasEmptyTarget) {
      this.emptyTarget.classList.toggle("hidden", hasVisibleItems || query === "");
    }
    this.selectedIndex = -1;
    this.updateSelection();
  }
  handleKeydown(event) {
    const visibleItems = this.visibleItems;
    switch (event.key) {
     case "ArrowDown":
      event.preventDefault();
      this.selectNext(visibleItems);
      break;

     case "ArrowUp":
      event.preventDefault();
      this.selectPrevious(visibleItems);
      break;

     case "Enter":
      event.preventDefault();
      this.selectCurrent(visibleItems);
      break;

     case "Home":
      event.preventDefault();
      this.selectFirst(visibleItems);
      break;

     case "End":
      event.preventDefault();
      this.selectLast(visibleItems);
      break;
    }
  }
  selectNext(items) {
    if (items.length === 0) return;
    if (this.selectedIndex < items.length - 1) {
      this.selectedIndex++;
    } else if (this.loopValue) {
      this.selectedIndex = 0;
    }
    this.updateSelection();
  }
  selectPrevious(items) {
    if (items.length === 0) return;
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else if (this.loopValue) {
      this.selectedIndex = items.length - 1;
    } else if (this.selectedIndex === -1) {
      this.selectedIndex = items.length - 1;
    }
    this.updateSelection();
  }
  selectFirst(items) {
    if (items.length === 0) return;
    this.selectedIndex = 0;
    this.updateSelection();
  }
  selectLast(items) {
    if (items.length === 0) return;
    this.selectedIndex = items.length - 1;
    this.updateSelection();
  }
  selectCurrent(items) {
    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      const item = items[this.selectedIndex];
      if (!item.dataset.disabled) {
        this.triggerSelect(item);
      }
    }
  }
  select(event) {
    const item = event.currentTarget;
    if (!item.dataset.disabled) {
      this.triggerSelect(item);
    }
  }
  triggerSelect(item) {
    const value = item.dataset.value || item.textContent.trim();
    this.element.dispatchEvent(new CustomEvent("command:select", {
      bubbles: true,
      detail: {
        value: value,
        item: item
      }
    }));
    const onSelect = item.dataset.onSelect;
    if (onSelect) {
      eval(onSelect);
    }
  }
  updateSelection() {
    const items = this.visibleItems;
    items.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      item.dataset.selected = isSelected;
      item.setAttribute("aria-selected", isSelected);
      if (isSelected) {
        item.scrollIntoView({
          block: "nearest"
        });
        if (this.hasListTarget) {
          this.listTarget.setAttribute("aria-activedescendant", item.id || "");
        }
      }
    });
  }
  updateVisibility() {
    this.itemTargets.forEach(item => item.hidden = false);
    this.groupTargets.forEach(group => group.hidden = false);
    if (this.hasEmptyTarget) {
      this.emptyTarget.classList.add("hidden");
    }
  }
  get visibleItems() {
    return this.itemTargets.filter(item => !item.hidden && !item.dataset.disabled);
  }
}

class ContextMenuController extends Controller {
  static targets=[ "trigger", "content", "item" ];
  static values={
    open: {
      type: Boolean,
      default: false
    }
  };
  constructor() {
    super(...arguments);
    this.lastHoveredItem = null;
  }
  connect() {
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    document.addEventListener("click", this.boundHandleClickOutside);
  }
  disconnect() {
    document.removeEventListener("click", this.boundHandleClickOutside);
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }
  open(event) {
    event.preventDefault();
    event.stopPropagation();
    this.closeAllContextMenus();
    this.openValue = true;
    const content = this.contentTarget;
    content.classList.remove("hidden");
    content.setAttribute("data-state", "open");
    this.positionContextMenu(event.clientX, event.clientY);
    this.setupKeyboardNavigation();
    setTimeout(() => {
      this.focusItem(0);
    }, 100);
  }
  close() {
    this.openValue = false;
    const content = this.contentTarget;
    if (content) {
      content.classList.add("hidden");
      content.setAttribute("data-state", "closed");
    }
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
    this.lastHoveredItem = null;
    this.teardownKeyboardNavigation();
  }
  closeAllContextMenus() {
    document.querySelectorAll('[data-ui--context-menu-target="content"][data-state="open"]').forEach(menu => {
      menu.classList.add("hidden");
      menu.setAttribute("data-state", "closed");
    });
  }
  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close();
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
      this.close();
      break;

     case "Enter":
     case " ":
      event.preventDefault();
      const target = this.getKeyboardFocusedItem();
      if (target) {
        target.click();
        this.close();
      }
      break;
    }
  }
  getFocusableItems() {
    if (!this.hasContentTarget) return [];
    const content = this.contentTarget;
    const items = [];
    Array.from(content.children).forEach(child => {
      const role = child.getAttribute("role");
      if (role === "menuitem" || role === "menuitemcheckbox" || role === "menuitemradio") {
        if (!child.hasAttribute("data-disabled")) {
          items.push(child);
        }
      } else if (role === "group") {
        const radioItems = child.querySelectorAll('[role="menuitemradio"]');
        radioItems.forEach(radioItem => {
          if (!radioItem.hasAttribute("data-disabled")) {
            items.push(radioItem);
          }
        });
      }
    });
    return items;
  }
  getKeyboardFocusedItem() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    return Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
  }
  focusNextItem(items = null) {
    items = items || this.getFocusableItems();
    if (items.length === 0) return;
    let currentIndex = this.findCurrentItemIndex(items);
    if (currentIndex === -1 || currentIndex >= items.length - 1) {
      this.focusItem(0, items);
    } else {
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
    return currentItem ? items.indexOf(currentItem) : -1;
  }
  focusItem(index, items = null) {
    items = items || this.getFocusableItems();
    if (items.length === 0 || index < 0 || index >= items.length) return;
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
    const targetItem = items[index];
    targetItem.setAttribute("tabindex", "0");
    targetItem.focus();
    this.lastHoveredItem = targetItem;
  }
  trackHoveredItem(event) {
    const item = event.currentTarget;
    if (document.activeElement && document.activeElement.hasAttribute("role") && (document.activeElement.getAttribute("role") === "menuitem" || document.activeElement.getAttribute("role") === "menuitemcheckbox" || document.activeElement.getAttribute("role") === "menuitemradio")) {
      document.activeElement.blur();
    }
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute("tabindex", "-1");
    });
    item.setAttribute("tabindex", "0");
    this.lastHoveredItem = item;
  }
  positionContextMenu(x, y) {
    const content = this.contentTarget;
    if (!content) return;
    Object.assign(content.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`
    });
    requestAnimationFrame(() => {
      const rect = content.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let adjustedX = x;
      let adjustedY = y;
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8;
      }
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8;
      }
      adjustedX = Math.max(8, adjustedX);
      adjustedY = Math.max(8, adjustedY);
      content.style.left = `${adjustedX}px`;
      content.style.top = `${adjustedY}px`;
      if (adjustedY < y) {
        content.setAttribute("data-side", "top");
      } else if (adjustedX < x) {
        content.setAttribute("data-side", "left");
      } else {
        content.setAttribute("data-side", "bottom");
      }
    });
  }
}

class CommandDialogController extends Controller {
  static values={
    shortcut: {
      type: String,
      default: "meta+j"
    }
  };
  connect() {
    this.dialogElement = this.element.querySelector("[data-controller*='ui--dialog']");
    this.element.addEventListener("dialog:close", this.handleDialogClose.bind(this));
  }
  disconnect() {
    this.element.removeEventListener("dialog:close", this.handleDialogClose.bind(this));
  }
  handleDialogClose() {
    this.clearInput();
  }
  toggle(event) {
    event.preventDefault();
    if (!this.dialogElement) return;
    const dialogController = this.application.getControllerForElementAndIdentifier(this.dialogElement, "ui--dialog");
    if (dialogController) {
      if (dialogController.openValue) {
        dialogController.close();
      } else {
        dialogController.open();
        this.focusInput();
      }
    }
  }
  focusInput() {
    setTimeout(() => {
      const input = this.element.querySelector("[data-ui--command-target='input']");
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  }
  clearInput() {
    const input = this.element.querySelector("[data-ui--command-target='input']");
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }
  }
}

class DrawerController extends Controller {
  static targets=[ "container", "overlay", "content", "handle" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: "bottom"
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    snapPoints: {
      type: Array,
      default: []
    },
    activeSnapPoint: {
      type: Number,
      default: -1
    },
    fadeFromIndex: {
      type: Number,
      default: -1
    },
    snapToSequentialPoint: {
      type: Boolean,
      default: false
    },
    handleOnly: {
      type: Boolean,
      default: false
    },
    repositionInputs: {
      type: Boolean,
      default: true
    }
  };
  TRANSITIONS={
    DURATION: .65,
    EASE: [ .32, .72, 0, 1 ]
  };
  VELOCITY_THRESHOLD=.4;
  CLOSE_THRESHOLD=.25;
  DRAG_CLASS="vaul-dragging";
  SCROLL_LOCK_TIMEOUT=500;
  connect() {
    this.isPointerDown = false;
    this.pointerStart = null;
    this.dragStartTime = null;
    this.isDragging = false;
    this.lastPositions = [];
    this.lastScrollTime = 0;
    this.hasBeenOpened = false;
    this.dragStartY = 0;
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    if (this.hasContentTarget) {
      this.resizeObserver.observe(this.contentTarget);
    }
    if (this.openValue) {
      this.show();
    } else {
      if (this.hasContainerTarget) {
        this.containerTarget.setAttribute("data-state", "closed");
      }
      if (this.hasOverlayTarget) {
        this.overlayTarget.setAttribute("data-state", "closed");
      }
      if (this.hasContentTarget) {
        this.contentTarget.setAttribute("data-state", "closed");
      }
    }
    if (this.repositionInputsValue && typeof visualViewport !== "undefined") {
      this.viewportResizeHandler = this.handleViewportResize.bind(this);
      visualViewport.addEventListener("resize", this.viewportResizeHandler);
    }
  }
  disconnect() {
    document.body.style.overflow = "";
    document.body.removeAttribute("data-scroll-locked");
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
    }
    if (this.preventScrollHandler) {
      document.removeEventListener("touchmove", this.preventScrollHandler);
    }
    if (this.viewportResizeHandler && typeof visualViewport !== "undefined") {
      visualViewport.removeEventListener("resize", this.viewportResizeHandler);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  open() {
    this.openValue = true;
    this.show();
  }
  close() {
    if (!this.dismissibleValue) return;
    this.openValue = false;
    this.hide();
  }
  closeOnOverlayClick(event) {
    if (this.dismissibleValue && this.modalValue) {
      this.animateToClosedPosition();
    }
  }
  handlePointerDown(event) {
    if (this.handleOnlyValue && !this.isHandleEvent(event)) {
      return;
    }
    if (this.shouldIgnoreDrag(event)) {
      return;
    }
    this.isPointerDown = true;
    this.pointerStart = this.getPointerPosition(event);
    this.dragStartTime = Date.now();
    this.lastPositions = [ {
      position: this.pointerStart,
      time: this.dragStartTime
    } ];
    if (this.hasContentTarget) {
      this.contentTarget.setPointerCapture(event.pointerId);
    }
  }
  handlePointerMove(event) {
    if (!this.isPointerDown) return;
    const currentPos = this.getPointerPosition(event);
    const delta = this.getDelta(this.pointerStart, currentPos);
    if (!this.isDragging) {
      const threshold = event.pointerType === "touch" ? 10 : 2;
      if (Math.abs(delta) > threshold) {
        this.startDrag();
      } else {
        return;
      }
    }
    const now = Date.now();
    this.lastPositions.push({
      position: currentPos,
      time: now
    });
    if (this.lastPositions.length > 5) {
      this.lastPositions.shift();
    }
    const dampedDelta = this.applyDamping(delta);
    this.updateTransform(dampedDelta);
  }
  handlePointerUp(event) {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    if (this.hasContentTarget) {
      this.contentTarget.releasePointerCapture(event.pointerId);
    }
    if (!this.isDragging) return;
    const velocity = this.calculateVelocity();
    const currentPos = this.getPointerPosition(event);
    const delta = this.getDelta(this.pointerStart, currentPos);
    const dampedDelta = this.applyDamping(delta);
    this.endDrag(dampedDelta, velocity);
  }
  handlePointerCancel(event) {
    this.handlePointerUp(event);
  }
  startDrag() {
    this.isDragging = true;
    this.hasBeenOpened = true;
    if (this.snapPointsValue && this.snapPointsValue.length > 0 && this.activeSnapPointValue >= 0) {
      this.dragStartY = this.getSnapPointY(this.activeSnapPointValue);
    } else {
      this.dragStartY = 0;
    }
    if (this.hasContentTarget) {
      this.contentTarget.classList.add(this.DRAG_CLASS);
      this.contentTarget.style.transition = "none";
    }
    this.element.dispatchEvent(new CustomEvent("drawer:drag:start", {
      bubbles: true,
      detail: {
        direction: this.directionValue
      }
    }));
  }
  updateTransform(delta) {
    if (!this.hasContentTarget) return;
    let finalDelta = delta;
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      finalDelta = this.dragStartY + delta;
    }
    const transform = this.getTransformForDirection(finalDelta);
    this.contentTarget.style.transform = transform;
    this.updateOverlayOpacity(finalDelta);
  }
  endDrag(delta, velocity) {
    this.isDragging = false;
    if (this.hasContentTarget) {
      this.contentTarget.classList.remove(this.DRAG_CLASS);
    }
    let finalDelta = delta;
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      finalDelta = this.dragStartY + delta;
    }
    if (this.snapPointsValue.length > 0) {
      this.handleSnapPointRelease(finalDelta, velocity);
    } else {
      this.handleRegularRelease(delta, velocity);
    }
    this.element.dispatchEvent(new CustomEvent("drawer:drag:end", {
      bubbles: true,
      detail: {
        direction: this.directionValue,
        velocity: velocity,
        delta: finalDelta
      }
    }));
  }
  getSnapPointY(snapIndex) {
    if (!this.snapPointsValue || snapIndex < 0 || snapIndex >= this.snapPointsValue.length) {
      return 0;
    }
    const snapPoint = this.snapPointsValue[snapIndex];
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const MOBILE_THRESHOLD = 80;
    console.log("📏 Viewport size:", {
      height: viewportHeight,
      width: viewportWidth
    });
    let containerSize;
    if (this.directionValue === "left" || this.directionValue === "right") {
      containerSize = viewportWidth;
    } else {
      if (snapPoint === 1) {
        containerSize = viewportHeight - MOBILE_THRESHOLD;
      } else {
        containerSize = viewportHeight;
      }
    }
    if (containerSize === 0) return 0;
    let pixels;
    if (typeof snapPoint === "string" && snapPoint.includes("px")) {
      pixels = parseInt(snapPoint);
    } else if (snapPoint > 1) {
      pixels = snapPoint / 100 * containerSize;
    } else {
      pixels = snapPoint * containerSize;
    }
    let yPosition;
    if (this.directionValue === "bottom" || this.directionValue === "right") {
      yPosition = containerSize - pixels;
      if (snapPoint === 1) {
        yPosition = MOBILE_THRESHOLD;
      }
    } else {
      yPosition = pixels;
    }
    console.log("📐 Snap point calculation:", {
      snapIndex: snapIndex,
      snapPoint: snapPoint,
      containerSize: containerSize,
      pixels: pixels,
      pixelsPercentage: `${(pixels / containerSize * 100).toFixed(1)}%`,
      yPosition: yPosition,
      direction: this.directionValue
    });
    return yPosition;
  }
  handleSnapPointRelease(delta, velocity) {
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) {
      this.close();
      return;
    }
    const currentIndex = this.activeSnapPointValue >= 0 ? this.activeSnapPointValue : 0;
    const currentY = delta;
    console.log("🎯 handleSnapPointRelease called:", {
      currentIndex: currentIndex,
      delta: delta,
      velocity: velocity,
      velocityAbs: Math.abs(velocity),
      threshold: this.VELOCITY_THRESHOLD,
      isHighVelocity: Math.abs(velocity) > this.VELOCITY_THRESHOLD,
      isClosingDirection: this.isClosingDirection(delta)
    });
    if (currentIndex === 0 && this.isClosingDirection(delta)) {
      const firstSnapY = this.getSnapPointY(0);
      const isDraggedBeyondFirstSnap = this.directionValue === "bottom" || this.directionValue === "right" ? currentY > firstSnapY : currentY < firstSnapY;
      if (isDraggedBeyondFirstSnap) {
        this.animateToClosedPosition();
        return;
      }
    }
    let targetIndex;
    if (Math.abs(velocity) > this.VELOCITY_THRESHOLD && !this.snapToSequentialPointValue) {
      if (velocity > 0) {
        targetIndex = Math.max(currentIndex - 1, 0);
        console.log("⬇️ High velocity CLOSING: currentIndex", currentIndex, "→ targetIndex", targetIndex);
      } else {
        targetIndex = Math.min(currentIndex + 1, this.snapPointsValue.length - 1);
        console.log("⬆️ High velocity OPENING: currentIndex", currentIndex, "→ targetIndex", targetIndex);
      }
    } else {
      targetIndex = this.findClosestSnapPointIndex(currentY);
      console.log("🐌 Low velocity: using closest snap point, targetIndex", targetIndex);
    }
    console.log("✅ Final targetIndex:", targetIndex);
    this.snapTo(targetIndex);
  }
  handleRegularRelease(delta, velocity) {
    const drawerSize = this.getDrawerSize();
    const dragPercentage = Math.abs(delta) / drawerSize;
    if (Math.abs(velocity) > this.VELOCITY_THRESHOLD && this.isClosingDirection(delta)) {
      this.close();
      return;
    }
    if (dragPercentage > this.CLOSE_THRESHOLD && this.isClosingDirection(delta)) {
      this.close();
    } else {
      this.resetPosition();
    }
  }
  findClosestSnapPointIndex(currentY) {
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return 0;
    let closestIndex = 0;
    let closestDistance = Infinity;
    this.snapPointsValue.forEach((_, index) => {
      const snapY = this.getSnapPointY(index);
      const distance = Math.abs(currentY - snapY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  }
  snapTo(snapPointIndex, animated = true) {
    if (snapPointIndex < 0 || snapPointIndex >= this.snapPointsValue.length) {
      return;
    }
    this.activeSnapPointValue = snapPointIndex;
    const snapPoint = this.snapPointsValue[snapPointIndex];
    const snapY = this.getSnapPointY(snapPointIndex);
    if (this.hasContentTarget) {
      const currentTransform = this.contentTarget.style.transform;
      const targetTransform = this.getTransformForSnapPoint(snapY);
      if (animated) {
        console.log("📍 snapTo (animated):", {
          snapPointIndex: snapPointIndex,
          currentTransform: currentTransform,
          targetTransform: targetTransform,
          duration: this.TRANSITIONS.DURATION
        });
        this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(",")})`;
      }
      this.contentTarget.style.transform = targetTransform;
      if (animated) {
        setTimeout(() => {
          if (this.hasContentTarget) {
            this.contentTarget.style.transition = "";
          }
        }, this.TRANSITIONS.DURATION * 1e3);
      }
    }
    this.updateOverlayOpacityForSnapPoint(snapPointIndex);
    this.element.dispatchEvent(new CustomEvent("drawer:snap", {
      bubbles: true,
      detail: {
        snapPoint: snapPoint,
        snapPointIndex: snapPointIndex,
        y: snapY
      }
    }));
  }
  snapPointToPercentage(snapPoint) {
    if (snapPoint === 1) return 1;
    if (typeof snapPoint === "number" && snapPoint < 1) return snapPoint;
    const drawerSize = this.getDrawerSize();
    const pixels = parseInt(snapPoint);
    return Math.min(pixels / drawerSize, 1);
  }
  getTransformForSnapPoint(offset) {
    switch (this.directionValue) {
     case "bottom":
      return `translate3d(0, ${offset}px, 0)`;

     case "top":
      return `translate3d(0, ${-offset}px, 0)`;

     case "left":
      return `translate3d(${-offset}px, 0, 0)`;

     case "right":
      return `translate3d(${offset}px, 0, 0)`;

     default:
      return `translate3d(0, ${offset}px, 0)`;
    }
  }
  getTransformForDirection(delta) {
    switch (this.directionValue) {
     case "bottom":
      return `translate3d(0, ${delta}px, 0)`;

     case "top":
      return `translate3d(0, ${-delta}px, 0)`;

     case "left":
      return `translate3d(${-delta}px, 0, 0)`;

     case "right":
      return `translate3d(${delta}px, 0, 0)`;

     default:
      return `translate3d(0, ${delta}px, 0)`;
    }
  }
  getDelta(start, current) {
    switch (this.directionValue) {
     case "bottom":
      return current.y - start.y;

     case "top":
      return start.y - current.y;

     case "left":
      return start.x - current.x;

     case "right":
      return current.x - start.x;

     default:
      return current.y - start.y;
    }
  }
  isClosingDirection(delta) {
    return delta > 0;
  }
  getDrawerSize() {
    if (!this.hasContentTarget) return 0;
    if (this.directionValue === "left" || this.directionValue === "right") {
      return this.contentTarget.offsetWidth;
    } else {
      return this.contentTarget.offsetHeight;
    }
  }
  getClosedPosition() {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const drawerSize = this.getDrawerSize();
    switch (this.directionValue) {
     case "bottom":
     case "top":
      return viewportHeight + drawerSize;

     case "right":
     case "left":
      return viewportWidth + drawerSize;

     default:
      return 0;
    }
  }
  calculateVelocity() {
    if (this.lastPositions.length < 2) return 0;
    const latest = this.lastPositions[this.lastPositions.length - 1];
    const earliest = this.lastPositions[0];
    const timeDelta = latest.time - earliest.time;
    if (timeDelta === 0) return 0;
    const positionDelta = this.getDelta(earliest.position, latest.position);
    return positionDelta / timeDelta;
  }
  applyDamping(delta) {
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      return delta;
    }
    if (!this.isClosingDirection(delta)) {
      return delta * .1;
    }
    return delta;
  }
  getPointerPosition(event) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  shouldIgnoreDrag(event) {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return true;
    }
    if (event.target.closest("[data-vaul-no-drag]")) {
      return true;
    }
    const scrollableEl = event.target.closest("[data-vaul-scrollable]");
    if (scrollableEl) {
      const now = Date.now();
      if (now - this.lastScrollTime < this.SCROLL_LOCK_TIMEOUT) {
        return true;
      }
      const isVertical = this.directionValue === "bottom" || this.directionValue === "top";
      if (isVertical) {
        const canScrollUp = scrollableEl.scrollTop > 0;
        const canScrollDown = scrollableEl.scrollTop < scrollableEl.scrollHeight - scrollableEl.clientHeight;
        if (canScrollUp || canScrollDown) {
          return true;
        }
      }
    }
    return false;
  }
  isHandleEvent(event) {
    if (!this.hasHandleTarget) return false;
    return event.target === this.handleTarget || this.handleTarget.contains(event.target);
  }
  resetPosition() {
    if (!this.hasContentTarget) return;
    this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(",")})`;
    this.contentTarget.style.transform = "translate3d(0, 0, 0)";
    setTimeout(() => {
      if (this.hasContentTarget) {
        this.contentTarget.style.transition = "";
        this.contentTarget.style.transform = "";
      }
    }, this.TRANSITIONS.DURATION * 1e3);
    this.updateOverlayOpacity(0);
  }
  updateOverlayOpacity(delta) {
    if (!this.hasOverlayTarget) return;
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return;
    const currentY = delta;
    let fadeIndex;
    if (this.fadeFromIndexValue >= 0) {
      fadeIndex = this.fadeFromIndexValue;
    } else {
      fadeIndex = 0;
    }
    const fadeStartY = this.getSnapPointY(fadeIndex);
    const fadeEndIndex = Math.min(fadeIndex + 1, this.snapPointsValue.length - 1);
    const fadeEndY = this.getSnapPointY(fadeEndIndex);
    console.log("🔍 updateOverlayOpacity:", {
      delta: delta,
      currentY: currentY,
      fadeIndex: fadeIndex,
      fadeEndIndex: fadeEndIndex,
      fadeStartY: fadeStartY,
      fadeEndY: fadeEndY,
      "currentY <= fadeEndY?": currentY <= fadeEndY,
      "fadeEndY < currentY <= fadeStartY?": currentY > fadeEndY && currentY <= fadeStartY
    });
    if (currentY < fadeEndY) {
      console.log("✅ Setting opacity = 1 (more open than fadeEndIndex)");
      this.overlayTarget.style.opacity = "1";
      return;
    }
    if (currentY >= fadeEndY && currentY <= fadeStartY) {
      const range = fadeStartY - fadeEndY;
      const progress = (fadeStartY - currentY) / range;
      const finalOpacity = Math.min(1, Math.max(0, progress));
      console.log("📈 Setting opacity =", finalOpacity, "(gradual fade)");
      this.overlayTarget.style.opacity = finalOpacity;
      return;
    }
    console.log("❌ Setting opacity = 0 (more closed than fadeFromIndex)");
    this.overlayTarget.style.opacity = "0";
  }
  updateOverlayOpacityForSnapPoint(snapPointIndex) {
    if (!this.hasOverlayTarget) return;
    if (!this.snapPointsValue || this.snapPointsValue.length === 0) return;
    const fadeIndex = this.fadeFromIndexValue >= 0 ? this.fadeFromIndexValue : 0;
    const fadeEndIndex = fadeIndex + 1;
    if (snapPointIndex < fadeIndex) {
      this.overlayTarget.style.opacity = "0";
      return;
    }
    if (snapPointIndex >= fadeEndIndex) {
      this.overlayTarget.style.opacity = "1";
      return;
    }
    const currentY = this.getSnapPointY(snapPointIndex);
    this.updateOverlayOpacity(currentY);
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
    if (this.snapPointsValue && this.snapPointsValue.length > 0) {
      const initialIndex = 0;
      if (this.hasContentTarget) {
        this.activeSnapPointValue = initialIndex;
        const closedPosition = this.getClosedPosition();
        this.contentTarget.style.transition = "none";
        this.contentTarget.style.transform = this.getTransformForDirection(closedPosition);
        this.contentTarget.offsetHeight;
        this.snapTo(initialIndex, true);
      }
      this.hasBeenOpened = true;
      this.updateOverlayOpacityForSnapPoint(initialIndex);
    } else {
      if (this.hasContentTarget) {
        const closedPosition = this.getClosedPosition();
        this.contentTarget.style.transition = "none";
        this.contentTarget.style.transform = this.getTransformForDirection(closedPosition);
        this.contentTarget.offsetHeight;
        this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(",")})`;
        this.contentTarget.style.transform = "translate3d(0, 0, 0)";
      }
      this.hasBeenOpened = true;
    }
    if (this.modalValue) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-locked", "1");
      this.preventScrollHandler = this.handlePreventScroll.bind(this);
      document.addEventListener("touchmove", this.preventScrollHandler, {
        passive: false
      });
    }
    this.setupFocusTrap();
    if (this.dismissibleValue) {
      this.escapeHandler = e => {
        if (e.key === "Escape") {
          this.animateToClosedPosition();
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
    this.element.dispatchEvent(new CustomEvent("drawer:open", {
      bubbles: true,
      detail: {
        open: true
      }
    }));
  }
  hide() {
    console.log("🔒 hide() called - delegating to animateToClosedPosition()");
    this.animateToClosedPosition();
  }
  animateToClosedPosition() {
    if (this.hasContentTarget) {
      const closedPosition = this.getClosedPosition();
      const currentTransform = this.contentTarget.style.transform;
      console.log("🚪 animateToClosedPosition:", {
        currentTransform: currentTransform,
        closedPosition: closedPosition,
        duration: this.TRANSITIONS.DURATION,
        targetTransform: this.getTransformForDirection(closedPosition)
      });
      this.contentTarget.style.transition = `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(",")})`;
      this.contentTarget.style.transform = this.getTransformForDirection(closedPosition);
      if (this.hasOverlayTarget) {
        this.overlayTarget.style.transition = `opacity ${this.TRANSITIONS.DURATION}s`;
        this.overlayTarget.style.opacity = "0";
      }
      setTimeout(() => {
        if (this.hasContentTarget) {
          this.contentTarget.style.transition = "none";
          this.contentTarget.style.transform = "";
          this.contentTarget.setAttribute("data-state", "closed");
        }
        if (this.hasOverlayTarget) {
          this.overlayTarget.style.transition = "none";
          this.overlayTarget.style.opacity = "";
          this.overlayTarget.setAttribute("data-state", "closed");
        }
        if (this.hasContainerTarget) {
          this.containerTarget.setAttribute("data-state", "closed");
        }
        this.openValue = false;
        document.body.style.overflow = "";
        document.body.removeAttribute("data-scroll-locked");
        if (this.preventScrollHandler) {
          document.removeEventListener("touchmove", this.preventScrollHandler);
          this.preventScrollHandler = null;
        }
        if (this.escapeHandler) {
          document.removeEventListener("keydown", this.escapeHandler);
          this.escapeHandler = null;
        }
        this.element.dispatchEvent(new CustomEvent("drawer:close", {
          bubbles: true,
          detail: {
            open: false
          }
        }));
      }, this.TRANSITIONS.DURATION * 1e3);
    } else {
      this.close();
    }
  }
  isMobile() {
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  setupFocusTrap() {
    if (!this.hasContentTarget) return;
    const focusableElements = this.contentTarget.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;
    if (this.isMobile()) {
      const nonInputElement = Array.from(focusableElements).find(el => el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && el.tagName !== "SELECT");
      if (nonInputElement) {
        nonInputElement.focus({
          preventScroll: true
        });
      }
    } else {
      focusableElements[0].focus({
        preventScroll: true
      });
    }
  }
  handleResize() {
    if (this.openValue && this.snapPointsValue && this.snapPointsValue.length > 0 && this.activeSnapPointValue >= 0) {
      this.snapTo(this.activeSnapPointValue, false);
    }
  }
  handleViewportResize() {
    if (!this.hasContentTarget || !this.openValue) return;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      setTimeout(() => {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  }
  handlePreventScroll(event) {
    if (!this.hasContentTarget) return;
    const target = event.target;
    const isInsideDrawer = this.contentTarget.contains(target);
    if (isInsideDrawer) {
      let scrollableParent = target;
      while (scrollableParent && scrollableParent !== this.contentTarget) {
        const overflowY = window.getComputedStyle(scrollableParent).overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";
        if (isScrollable && scrollableParent.scrollHeight > scrollableParent.clientHeight) {
          return;
        }
        scrollableParent = scrollableParent.parentElement;
      }
    }
    event.preventDefault();
  }
}

class HoverCardController extends Controller {
  static targets=[ "trigger", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: "center"
    },
    sideOffset: {
      type: Number,
      default: 4
    },
    openDelay: {
      type: Number,
      default: 200
    },
    closeDelay: {
      type: Number,
      default: 300
    }
  };
  constructor() {
    super(...arguments);
    this.showTimeout = null;
    this.hideTimeout = null;
  }
  connect() {
    if (this.hasContentTarget) {
      this.contentTarget.style.position = "fixed";
    }
  }
  disconnect() {
    this.clearTimeouts();
  }
  show() {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      this.openValue = true;
      this.contentTarget.classList.remove("invisible");
      this.contentTarget.classList.add("visible");
      this.contentTarget.setAttribute("data-state", "open");
      this.positionContent();
    }, this.openDelayValue);
  }
  hide() {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.openValue = false;
      this.contentTarget.classList.remove("visible");
      this.contentTarget.classList.add("invisible");
      this.contentTarget.setAttribute("data-state", "closed");
    }, this.closeDelayValue);
  }
  keepOpen() {
    this.clearTimeouts();
  }
  scheduleHide() {
    this.hide();
  }
  clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  positionContent() {
    const content = this.contentTarget;
    if (!content) return;
    const trigger = this.triggerTarget;
    if (!trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const align = content.dataset.align || this.alignValue;
    const sideOffset = parseInt(content.dataset.sideOffset) || this.sideOffsetValue;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    let side = "bottom";
    if (spaceBelow < contentRect.height + sideOffset && spaceAbove > spaceBelow) {
      side = "top";
    }
    if (side === "bottom") {
      content.style.top = `${triggerRect.bottom + sideOffset}px`;
      content.setAttribute("data-side", "bottom");
    } else {
      content.style.top = `${triggerRect.top - contentRect.height - sideOffset}px`;
      content.setAttribute("data-side", "top");
    }
    if (align === "center") {
      const left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
      content.style.left = `${Math.max(8, Math.min(left, viewportWidth - contentRect.width - 8))}px`;
    } else if (align === "start") {
      content.style.left = `${Math.max(8, triggerRect.left)}px`;
    } else if (align === "end") {
      content.style.left = `${Math.max(8, triggerRect.right - contentRect.width)}px`;
    }
  }
}

class InputOtpController extends Controller {
  static targets=[ "input" ];
  static values={
    length: {
      type: Number,
      default: 6
    },
    pattern: {
      type: String,
      default: "\\d"
    },
    complete: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    if (this.hasInputTarget) {
      this.inputTargets[0]?.focus();
    }
  }
  input(event) {
    const input = event.target;
    const value = input.value;
    const index = this.inputTargets.indexOf(input);
    const regex = new RegExp(`^${this.patternValue}$`);
    if (value && !regex.test(value)) {
      input.value = "";
      return;
    }
    if (value && index < this.inputTargets.length - 1) {
      this.inputTargets[index + 1].focus();
    }
    this.checkComplete();
  }
  keydown(event) {
    const input = event.target;
    const index = this.inputTargets.indexOf(input);
    if (event.key === "Backspace") {
      if (!input.value && index > 0) {
        event.preventDefault();
        this.inputTargets[index - 1].focus();
        this.inputTargets[index - 1].value = "";
      }
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      this.inputTargets[index - 1].focus();
    }
    if (event.key === "ArrowRight" && index < this.inputTargets.length - 1) {
      event.preventDefault();
      this.inputTargets[index + 1].focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      this.inputTargets[0].focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      this.inputTargets[this.inputTargets.length - 1].focus();
    }
  }
  paste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();
    const regex = new RegExp(`^${this.patternValue}+$`);
    if (!regex.test(pastedData)) {
      return;
    }
    const chars = pastedData.split("");
    chars.forEach((char, index) => {
      if (index < this.inputTargets.length) {
        this.inputTargets[index].value = char;
      }
    });
    const nextEmptyIndex = this.inputTargets.findIndex(input => !input.value);
    if (nextEmptyIndex >= 0) {
      this.inputTargets[nextEmptyIndex].focus();
    } else {
      this.inputTargets[this.inputTargets.length - 1].focus();
    }
    this.checkComplete();
  }
  checkComplete() {
    const allFilled = this.inputTargets.every(input => input.value);
    const wasComplete = this.completeValue;
    this.completeValue = allFilled;
    if (allFilled && !wasComplete) {
      const value = this.inputTargets.map(input => input.value).join("");
      this.element.dispatchEvent(new CustomEvent("inputotp:complete", {
        bubbles: true,
        detail: {
          value: value
        }
      }));
    }
  }
  getValue() {
    return this.inputTargets.map(input => input.value).join("");
  }
  clear() {
    this.inputTargets.forEach(input => {
      input.value = "";
    });
    this.completeValue = false;
    if (this.hasInputTarget) {
      this.inputTargets[0].focus();
    }
  }
}

class TooltipController extends Controller {
  static targets=[ "trigger", "content" ];
  static values={
    sideOffset: {
      type: Number,
      default: 4
    },
    hoverDelay: {
      type: Number,
      default: 0
    }
  };
  constructor() {
    super(...arguments);
    this.cleanup = null;
    this.hoverTimeout = null;
    this.isOpen = false;
  }
  connect() {
    this.boundHandleEscape = this.handleEscape.bind(this);
    document.addEventListener("keydown", this.boundHandleEscape);
    if (this.hasContentTarget) {
      this.content = this.contentTarget;
      this.originalParent = this.content.parentNode;
      requestAnimationFrame(() => {
        if (this.content) {
          document.body.appendChild(this.content);
        }
      });
    }
  }
  disconnect() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.content && this.content.parentNode === document.body) {
      if (this.originalParent) {
        this.originalParent.appendChild(this.content);
      } else {
        document.body.removeChild(this.content);
      }
    }
    document.removeEventListener("keydown", this.boundHandleEscape);
  }
  show() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.hoverTimeout = setTimeout(() => {
      if (!this.content || !this.hasTriggerTarget) return;
      this.isOpen = true;
      this.content.setAttribute("data-state", "open");
      this.updatePosition();
    }, this.hoverDelayValue);
  }
  hide() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (!this.content) return;
    this.isOpen = false;
    this.content.setAttribute("data-state", "closed");
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }
  handleEscape(event) {
    if (event.key === "Escape" && this.isOpen) {
      this.hide();
    }
  }
  updatePosition() {
    if (!this.content || !this.hasTriggerTarget) return;
    if (this.cleanup) {
      this.cleanup();
    }
    const side = this.content.getAttribute("data-side") || "top";
    const align = this.content.getAttribute("data-align") || "center";
    const placement = align === "center" ? side : `${side}-${align}`;
    const middleware = [ offset(this.sideOffsetValue), flip(), shift({
      padding: 8
    }) ];
    this.cleanup = autoUpdate(this.triggerTarget, this.content, () => {
      computePosition(this.triggerTarget, this.content, {
        placement: placement,
        middleware: middleware,
        strategy: "absolute"
      }).then(({x: x, y: y, placement: actualPlacement}) => {
        Object.assign(this.content.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`
        });
        const actualSide = actualPlacement.split("-")[0];
        this.content.setAttribute("data-side", actualSide);
      });
    }, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    });
  }
}

class PopoverController extends Controller {
  static targets=[ "trigger", "content" ];
  static values={
    open: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "bottom"
    },
    offset: {
      type: Number,
      default: 4
    },
    trigger: {
      type: String,
      default: "click"
    },
    hoverDelay: {
      type: Number,
      default: 200
    }
  };
  constructor() {
    super(...arguments);
    this.cleanup = null;
    this.hoverTimeout = null;
  }
  connect() {
    console.log("placement", this.placementValue);
    if (!this.hasTriggerTarget || !this.hasContentTarget) {
      return;
    }
    if (!this.contentTarget.hasAttribute("data-state")) {
      this.contentTarget.setAttribute("data-state", this.openValue ? "open" : "closed");
    }
    if (this.triggerValue === "click") {
      this.setupClickTrigger();
    } else if (this.triggerValue === "hover") {
      this.setupHoverTrigger();
    }
    this.boundHandleEscape = this.handleEscape.bind(this);
    document.addEventListener("keydown", this.boundHandleEscape);
  }
  disconnect() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    document.removeEventListener("keydown", this.boundHandleEscape);
    if (this.boundHandleClickOutside) {
      document.removeEventListener("click", this.boundHandleClickOutside);
    }
    if (this.boundHandleTriggerClick) {
      this.triggerTarget.removeEventListener("click", this.boundHandleTriggerClick);
    }
    if (this.boundHandleMouseEnter) {
      this.triggerTarget.removeEventListener("mouseenter", this.boundHandleMouseEnter);
      this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave);
    }
  }
  setupClickTrigger() {
    this.boundHandleTriggerClick = this.toggle.bind(this);
    this.triggerTarget.addEventListener("click", this.boundHandleTriggerClick);
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
    document.addEventListener("click", this.boundHandleClickOutside);
  }
  setupHoverTrigger() {
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);
    this.triggerTarget.addEventListener("mouseenter", this.boundHandleMouseEnter);
    this.element.addEventListener("mouseleave", this.boundHandleMouseLeave);
  }
  toggle(event) {
    event.stopPropagation();
    this.openValue = !this.openValue;
    if (this.openValue) {
      this.show();
    } else {
      this.hide();
    }
  }
  show() {
    this.openValue = true;
    this.contentTarget.setAttribute("data-state", "open");
    this.updatePosition();
    this.element.dispatchEvent(new CustomEvent("popover:show", {
      bubbles: true,
      detail: {
        popover: this
      }
    }));
  }
  hide() {
    this.openValue = false;
    this.contentTarget.setAttribute("data-state", "closed");
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    this.element.dispatchEvent(new CustomEvent("popover:hide", {
      bubbles: true,
      detail: {
        popover: this
      }
    }));
  }
  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
  handleMouseEnter() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoverTimeout = setTimeout(() => {
      this.show();
    }, this.hoverDelayValue);
  }
  handleMouseLeave() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.hide();
  }
  handleEscape(event) {
    if (event.key === "Escape" && this.openValue && this.hasContentTarget) {
      this.hide();
    }
  }
  updatePosition() {
    if (!this.hasTriggerTarget || !this.hasContentTarget) return;
    if (this.cleanup) {
      this.cleanup();
    }
    const middleware = [];
    if (this.offsetValue > 0) {
      middleware.push(offset(this.offsetValue));
    }
    middleware.push(flip());
    middleware.push(shift({
      padding: 8
    }));
    this.cleanup = autoUpdate(this.triggerTarget, this.contentTarget, () => {
      computePosition(this.triggerTarget, this.contentTarget, {
        placement: this.placementValue,
        middleware: middleware
      }).then(({x: x, y: y, placement: placement, middlewareData: middlewareData}) => {
        Object.assign(this.contentTarget.style, {
          left: `${x}px`,
          top: `${y}px`
        });
        const side = placement.split("-")[0];
        this.contentTarget.setAttribute("data-side", side);
      });
    }, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    });
  }
}

class ResponsiveDialogController extends Controller {
  static targets=[ "drawer", "dialog" ];
  static values={
    breakpoint: {
      type: Number,
      default: 768
    },
    open: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.mediaQuery = window.matchMedia(`(min-width: ${this.breakpointValue}px)`);
    this.handleBreakpointChangeHandler = this.handleBreakpointChange.bind(this);
    this.mediaQuery.addEventListener("change", this.handleBreakpointChangeHandler);
    this.syncState();
  }
  disconnect() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener("change", this.handleBreakpointChangeHandler);
    }
  }
  open() {
    this.openValue = true;
    this.syncState();
  }
  close() {
    this.openValue = false;
    this.syncState();
  }
  toggle() {
    this.openValue = !this.openValue;
    this.syncState();
  }
  handleBreakpointChange(event) {
    this.syncState();
    if (this.openValue) {
      this.transferFocus();
    }
    this.element.dispatchEvent(new CustomEvent("responsive-dialog:resize", {
      bubbles: true,
      detail: {
        isDesktop: event.matches,
        breakpoint: this.breakpointValue
      }
    }));
  }
  syncState() {
    const isDesktop = this.mediaQuery.matches;
    const activeComponent = isDesktop ? "dialog" : "drawer";
    const inactiveComponent = isDesktop ? "drawer" : "dialog";
    if (this.openValue) {
      this.openComponent(activeComponent);
      this.ensureClosedComponent(inactiveComponent);
    } else {
      this.ensureClosedComponent("drawer");
      this.ensureClosedComponent("dialog");
    }
  }
  openComponent(componentType) {
    const target = componentType === "dialog" ? this.dialogTarget : this.drawerTarget;
    if (!target) return;
    const openEvent = new CustomEvent(`${componentType}:open`, {
      bubbles: true,
      detail: {
        open: true
      }
    });
    target.dispatchEvent(openEvent);
  }
  ensureClosedComponent(componentType) {
    const target = componentType === "dialog" ? this.dialogTarget : this.drawerTarget;
    if (!target) return;
    const closeEvent = new CustomEvent(`${componentType}:close`, {
      bubbles: true,
      detail: {
        open: false
      }
    });
    target.dispatchEvent(closeEvent);
  }
  transferFocus() {
    const isDesktop = this.mediaQuery.matches;
    const targetEl = isDesktop ? this.dialogTarget : this.drawerTarget;
    if (!targetEl) return;
    const focusableElements = targetEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
      }, 100);
    }
  }
  get isDesktop() {
    return this.mediaQuery.matches;
  }
  get isMobile() {
    return !this.mediaQuery.matches;
  }
  get activeComponentType() {
    return this.isDesktop ? "dialog" : "drawer";
  }
}

class ScrollAreaController extends Controller {
  static targets=[ "viewport", "scrollbar", "thumb" ];
  static values={
    type: {
      type: String,
      default: "hover"
    },
    scrollHideDelay: {
      type: Number,
      default: 600
    }
  };
  constructor() {
    super(...arguments);
    this.rafId = null;
    this.isDragging = false;
    this.dragStartPointer = 0;
    this.dragStartScroll = 0;
    this.resizeObserver = null;
    this.scrollbarStates = new Map;
    this.hideTimers = new Map;
    this.scrollEndTimers = new Map;
  }
  connect() {
    this.applyViewportOverflow();
    this.initializeScrollbarBehavior();
    this.boundSyncThumbPosition = this.syncThumbPosition.bind(this);
    this.startScrollSync();
    this.setupResizeObserver();
    this.setupScrollbarClickHandlers();
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
  }
  applyViewportOverflow() {
    if (!this.hasViewportTarget) return;
    const hasVertical = this.scrollbarTargets.some(sb => sb.dataset.orientation === "vertical");
    const hasHorizontal = this.scrollbarTargets.some(sb => sb.dataset.orientation === "horizontal");
    this.viewportTarget.style.overflowX = hasHorizontal ? "scroll" : "hidden";
    this.viewportTarget.style.overflowY = hasVertical ? "scroll" : "hidden";
  }
  initializeScrollbarBehavior() {
    this.scrollbarTargets.forEach(scrollbar => {
      const orientation = scrollbar.dataset.orientation;
      switch (this.typeValue) {
       case "hover":
        this.initializeHoverScrollbar(scrollbar);
        break;

       case "scroll":
        this.initializeScrollScrollbar(scrollbar, orientation);
        break;

       case "auto":
        this.initializeAutoScrollbar(scrollbar, orientation);
        break;

       case "always":
        this.initializeAlwaysScrollbar(scrollbar, orientation);
        break;
      }
    });
  }
  initializeHoverScrollbar(scrollbar) {
    scrollbar.dataset.state = "hidden";
    const handlePointerEnter = () => {
      const timer = this.hideTimers.get(scrollbar);
      if (timer) {
        clearTimeout(timer);
        this.hideTimers.delete(scrollbar);
      }
      scrollbar.dataset.state = "visible";
    };
    const handlePointerLeave = () => {
      const timer = setTimeout(() => {
        scrollbar.dataset.state = "hidden";
        this.hideTimers.delete(scrollbar);
      }, this.scrollHideDelayValue);
      this.hideTimers.set(scrollbar, timer);
    };
    this.element.addEventListener("pointerenter", handlePointerEnter);
    this.element.addEventListener("pointerleave", handlePointerLeave);
    if (!this.cleanupFunctions) this.cleanupFunctions = [];
    this.cleanupFunctions.push(() => {
      this.element.removeEventListener("pointerenter", handlePointerEnter);
      this.element.removeEventListener("pointerleave", handlePointerLeave);
    });
  }
  initializeScrollScrollbar(scrollbar, orientation) {
    this.scrollbarStates.set(scrollbar, "hidden");
    scrollbar.dataset.state = "hidden";
    const scrollDirection = orientation === "horizontal" ? "scrollLeft" : "scrollTop";
    let prevScrollPos = this.viewportTarget[scrollDirection];
    const sendEvent = event => {
      const state = this.scrollbarStates.get(scrollbar);
      switch (state) {
       case "hidden":
        if (event === "SCROLL") {
          this.scrollbarStates.set(scrollbar, "scrolling");
          scrollbar.dataset.state = "visible";
        }
        break;

       case "scrolling":
        if (event === "SCROLL_END") {
          this.scrollbarStates.set(scrollbar, "idle");
          const timer = setTimeout(() => {
            if (this.scrollbarStates.get(scrollbar) === "idle") {
              this.scrollbarStates.set(scrollbar, "hidden");
              scrollbar.dataset.state = "hidden";
            }
          }, this.scrollHideDelayValue);
          this.hideTimers.set(scrollbar, timer);
        } else if (event === "POINTER_ENTER") {
          this.scrollbarStates.set(scrollbar, "interacting");
        }
        break;

       case "interacting":
        if (event === "POINTER_LEAVE") {
          this.scrollbarStates.set(scrollbar, "idle");
          const timer = setTimeout(() => {
            if (this.scrollbarStates.get(scrollbar) === "idle") {
              this.scrollbarStates.set(scrollbar, "hidden");
              scrollbar.dataset.state = "hidden";
            }
          }, this.scrollHideDelayValue);
          this.hideTimers.set(scrollbar, timer);
        }
        break;

       case "idle":
        if (event === "SCROLL") {
          this.scrollbarStates.set(scrollbar, "scrolling");
          const timer = this.hideTimers.get(scrollbar);
          if (timer) {
            clearTimeout(timer);
            this.hideTimers.delete(scrollbar);
          }
        } else if (event === "POINTER_ENTER") {
          this.scrollbarStates.set(scrollbar, "interacting");
          const timer = this.hideTimers.get(scrollbar);
          if (timer) {
            clearTimeout(timer);
            this.hideTimers.delete(scrollbar);
          }
        }
        break;
      }
    };
    const debounceScrollEnd = () => {
      const timer = this.scrollEndTimers.get(scrollbar);
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => {
        sendEvent("SCROLL_END");
        this.scrollEndTimers.delete(scrollbar);
      }, 100);
      this.scrollEndTimers.set(scrollbar, newTimer);
    };
    const handleScroll = () => {
      const scrollPos = this.viewportTarget[scrollDirection];
      if (prevScrollPos !== scrollPos) {
        sendEvent("SCROLL");
        debounceScrollEnd();
      }
      prevScrollPos = scrollPos;
    };
    const handlePointerEnter = () => sendEvent("POINTER_ENTER");
    const handlePointerLeave = () => sendEvent("POINTER_LEAVE");
    this.viewportTarget.addEventListener("scroll", handleScroll);
    scrollbar.addEventListener("pointerenter", handlePointerEnter);
    scrollbar.addEventListener("pointerleave", handlePointerLeave);
    if (!this.cleanupFunctions) this.cleanupFunctions = [];
    this.cleanupFunctions.push(() => {
      this.viewportTarget.removeEventListener("scroll", handleScroll);
      scrollbar.removeEventListener("pointerenter", handlePointerEnter);
      scrollbar.removeEventListener("pointerleave", handlePointerLeave);
      const timer = this.scrollEndTimers.get(scrollbar);
      if (timer) clearTimeout(timer);
      const hideTimer = this.hideTimers.get(scrollbar);
      if (hideTimer) clearTimeout(hideTimer);
    });
  }
  initializeAutoScrollbar(scrollbar, orientation) {
    this.updateAutoScrollbar(scrollbar, orientation);
  }
  updateAutoScrollbar(scrollbar, orientation) {
    if (!this.hasViewportTarget) return;
    let hasOverflow = false;
    if (orientation === "horizontal") {
      hasOverflow = this.viewportTarget.scrollWidth > this.viewportTarget.clientWidth;
    } else {
      hasOverflow = this.viewportTarget.scrollHeight > this.viewportTarget.clientHeight;
    }
    scrollbar.dataset.state = hasOverflow ? "visible" : "hidden";
  }
  initializeAlwaysScrollbar(scrollbar, orientation) {
    this.updateAlwaysScrollbar(scrollbar, orientation);
  }
  updateAlwaysScrollbar(scrollbar, orientation) {
    if (!this.hasViewportTarget) return;
    let hasOverflow = false;
    if (orientation === "horizontal") {
      hasOverflow = this.viewportTarget.scrollWidth > this.viewportTarget.clientWidth;
    } else {
      hasOverflow = this.viewportTarget.scrollHeight > this.viewportTarget.clientHeight;
    }
    scrollbar.dataset.state = hasOverflow ? "visible" : "hidden";
  }
  startScrollSync() {
    const sync = () => {
      this.syncThumbPosition();
      this.rafId = requestAnimationFrame(sync);
    };
    this.rafId = requestAnimationFrame(sync);
  }
  setupResizeObserver() {
    if (!this.hasViewportTarget) return;
    this.resizeObserver = new ResizeObserver(() => {
      this.scrollbarTargets.forEach(scrollbar => {
        const orientation = scrollbar.dataset.orientation;
        if (this.typeValue === "auto") {
          this.updateAutoScrollbar(scrollbar, orientation);
        } else if (this.typeValue === "always") {
          this.updateAlwaysScrollbar(scrollbar, orientation);
        }
      });
      this.updateThumbSize();
    });
    this.resizeObserver.observe(this.viewportTarget);
    if (this.viewportTarget.firstElementChild) {
      this.resizeObserver.observe(this.viewportTarget.firstElementChild);
    }
  }
  setupScrollbarClickHandlers() {
    this.scrollbarTargets.forEach((scrollbar, index) => {
      const handleScrollbarClick = event => {
        if (event.target.closest('[data-ui--scroll-area-target="thumb"]')) {
          return;
        }
        const orientation = scrollbar.dataset.orientation;
        const thumb = this.thumbTargets[index];
        if (!thumb) return;
        const viewport = this.viewportTarget;
        const rect = scrollbar.getBoundingClientRect();
        if (orientation === "horizontal") {
          const clickX = event.clientX - rect.left;
          const scrollbarWidth = scrollbar.clientWidth;
          const contentWidth = viewport.scrollWidth;
          const viewportWidth = viewport.clientWidth;
          const scrollableWidth = contentWidth - viewportWidth;
          const ratio = clickX / scrollbarWidth;
          viewport.scrollLeft = ratio * scrollableWidth;
        } else {
          const clickY = event.clientY - rect.top;
          const scrollbarHeight = scrollbar.clientHeight;
          const contentHeight = viewport.scrollHeight;
          const viewportHeight = viewport.clientHeight;
          const scrollableHeight = contentHeight - viewportHeight;
          const ratio = clickY / scrollbarHeight;
          viewport.scrollTop = ratio * scrollableHeight;
        }
      };
      scrollbar.addEventListener("click", handleScrollbarClick);
      if (!this.cleanupFunctions) this.cleanupFunctions = [];
      this.cleanupFunctions.push(() => {
        scrollbar.removeEventListener("click", handleScrollbarClick);
      });
    });
  }
  syncThumbPosition() {
    if (!this.hasViewportTarget) return;
    this.scrollbarTargets.forEach((scrollbar, index) => {
      const orientation = scrollbar.dataset.orientation;
      const thumb = this.thumbTargets[index];
      if (!thumb) return;
      if (orientation === "horizontal") {
        this.updateHorizontalThumb(scrollbar, thumb);
      } else {
        this.updateVerticalThumb(scrollbar, thumb);
      }
    });
  }
  updateVerticalThumb(scrollbar, thumb) {
    const viewport = this.viewportTarget;
    const contentHeight = viewport.scrollHeight;
    const viewportHeight = viewport.clientHeight;
    if (contentHeight <= viewportHeight) {
      return;
    }
    const scrollbarHeight = scrollbar.clientHeight;
    const scrollbarPadding = 2;
    const availableHeight = scrollbarHeight - scrollbarPadding;
    const thumbRatio = viewportHeight / contentHeight;
    const thumbHeight = Math.max(18, availableHeight * thumbRatio);
    const scrollableHeight = contentHeight - viewportHeight;
    const scrollRatio = scrollableHeight > 0 ? viewport.scrollTop / scrollableHeight : 0;
    const maxThumbTop = availableHeight - thumbHeight;
    const thumbTop = scrollRatio * maxThumbTop;
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
  }
  updateHorizontalThumb(scrollbar, thumb) {
    const viewport = this.viewportTarget;
    const contentWidth = viewport.scrollWidth;
    const viewportWidth = viewport.clientWidth;
    if (contentWidth <= viewportWidth) {
      return;
    }
    const scrollbarWidth = scrollbar.clientWidth;
    const scrollbarPadding = 2;
    const availableWidth = scrollbarWidth - scrollbarPadding;
    const thumbRatio = viewportWidth / contentWidth;
    const thumbWidth = Math.max(18, availableWidth * thumbRatio);
    const scrollableWidth = contentWidth - viewportWidth;
    const scrollRatio = scrollableWidth > 0 ? viewport.scrollLeft / scrollableWidth : 0;
    const maxThumbLeft = availableWidth - thumbWidth;
    const thumbLeft = scrollRatio * maxThumbLeft;
    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translate3d(${thumbLeft}px, 0, 0)`;
  }
  updateThumbSize() {
    if (!this.hasViewportTarget) return;
    this.scrollbarTargets.forEach((scrollbar, index) => {
      const orientation = scrollbar.dataset.orientation;
      const thumb = this.thumbTargets[index];
      if (!thumb) return;
      if (orientation === "horizontal") {
        const contentWidth = this.viewportTarget.scrollWidth;
        const viewportWidth = this.viewportTarget.clientWidth;
        const scrollbarWidth = scrollbar.clientWidth;
        const scrollbarPadding = 2;
        const availableWidth = scrollbarWidth - scrollbarPadding;
        const thumbRatio = viewportWidth / contentWidth;
        const thumbWidth = Math.max(18, availableWidth * thumbRatio);
        thumb.style.width = `${thumbWidth}px`;
      } else {
        const contentHeight = this.viewportTarget.scrollHeight;
        const viewportHeight = this.viewportTarget.clientHeight;
        const scrollbarHeight = scrollbar.clientHeight;
        const scrollbarPadding = 2;
        const availableHeight = scrollbarHeight - scrollbarPadding;
        const thumbRatio = viewportHeight / contentHeight;
        const thumbHeight = Math.max(18, availableHeight * thumbRatio);
        thumb.style.height = `${thumbHeight}px`;
      }
    });
  }
  startDrag(event) {
    event.preventDefault();
    const thumb = event.currentTarget;
    const index = this.thumbTargets.indexOf(thumb);
    const scrollbar = this.scrollbarTargets[index];
    const orientation = scrollbar.dataset.orientation;
    this.isDragging = true;
    this.currentScrollbar = scrollbar;
    this.currentThumb = thumb;
    this.currentOrientation = orientation;
    this.prevWebkitUserSelect = document.body.style.webkitUserSelect;
    document.body.style.webkitUserSelect = "none";
    if (orientation === "horizontal") {
      this.dragStartPointer = event.clientX;
      this.dragStartScroll = this.viewportTarget.scrollLeft;
    } else {
      this.dragStartPointer = event.clientY;
      this.dragStartScroll = this.viewportTarget.scrollTop;
    }
    if (this.viewportTarget) {
      this.viewportTarget.style.scrollBehavior = "auto";
    }
    document.addEventListener("pointermove", this.boundHandlePointerMove);
    document.addEventListener("pointerup", this.boundHandlePointerUp);
    thumb.setPointerCapture(event.pointerId);
  }
  handlePointerMove(event) {
    if (!this.isDragging) return;
    const viewport = this.viewportTarget;
    const scrollbar = this.currentScrollbar;
    const thumb = this.currentThumb;
    const orientation = this.currentOrientation;
    if (orientation === "horizontal") {
      const deltaX = event.clientX - this.dragStartPointer;
      const scrollbarWidth = scrollbar.clientWidth;
      const contentWidth = viewport.scrollWidth;
      const viewportWidth = viewport.clientWidth;
      const scrollableWidth = contentWidth - viewportWidth;
      const thumbWidth = parseFloat(thumb.style.width) || 18;
      const scrollbarPadding = 2;
      const maxThumbLeft = scrollbarWidth - scrollbarPadding - thumbWidth;
      const scrollDelta = maxThumbLeft > 0 ? deltaX / maxThumbLeft * scrollableWidth : 0;
      viewport.scrollLeft = this.dragStartScroll + scrollDelta;
    } else {
      const deltaY = event.clientY - this.dragStartPointer;
      const scrollbarHeight = scrollbar.clientHeight;
      const contentHeight = viewport.scrollHeight;
      const viewportHeight = viewport.clientHeight;
      const scrollableHeight = contentHeight - viewportHeight;
      const thumbHeight = parseFloat(thumb.style.height) || 18;
      const scrollbarPadding = 2;
      const maxThumbTop = scrollbarHeight - scrollbarPadding - thumbHeight;
      const scrollDelta = maxThumbTop > 0 ? deltaY / maxThumbTop * scrollableHeight : 0;
      viewport.scrollTop = this.dragStartScroll + scrollDelta;
    }
  }
  handlePointerUp(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.webkitUserSelect = this.prevWebkitUserSelect;
    if (this.viewportTarget) {
      this.viewportTarget.style.scrollBehavior = "";
    }
    this.currentScrollbar = null;
    this.currentThumb = null;
    this.currentOrientation = null;
    document.removeEventListener("pointermove", this.boundHandlePointerMove);
    document.removeEventListener("pointerup", this.boundHandlePointerUp);
  }
  disconnect() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.cleanupFunctions) {
      this.cleanupFunctions.forEach(fn => fn());
      this.cleanupFunctions = [];
    }
    document.removeEventListener("pointermove", this.boundHandlePointerMove);
    document.removeEventListener("pointerup", this.boundHandlePointerUp);
    this.hideTimers.forEach(timer => clearTimeout(timer));
    this.hideTimers.clear();
    this.scrollEndTimers.forEach(timer => clearTimeout(timer));
    this.scrollEndTimers.clear();
  }
}

class SelectController extends Controller {
  static targets=[ "trigger", "content", "item", "valueDisplay", "hiddenInput", "scrollUpButton", "scrollDownButton", "viewport", "itemCheck" ];
  static values={
    value: String,
    open: {
      type: Boolean,
      default: false
    }
  };
  constructor() {
    super(...arguments);
    this.scrollInterval = null;
    this.boundHandleClickOutside = null;
  }
  connect() {
    if (this.valueValue) {
      this.updateDisplay(this.valueValue);
      this.updateSelection(this.valueValue);
    }
    this.contentTarget.dataset.state = "closed";
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    this.boundHandleScroll = this.handleScroll.bind(this);
    if (this.hasViewportTarget) {
      this.viewportTarget.addEventListener("scroll", this.boundHandleScroll, {
        passive: true
      });
    }
  }
  toggle(event) {
    event?.preventDefault();
    if (this.openValue) {
      this.close();
    } else {
      this.open();
    }
  }
  async open() {
    this.openValue = true;
    this.contentTarget.dataset.state = "open";
    this.triggerTarget.setAttribute("aria-expanded", "true");
    await this.updatePosition();
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
    setTimeout(() => {
      document.addEventListener("click", this.boundHandleClickOutside);
      document.addEventListener("keydown", this.boundHandleKeydown);
    }, 0);
    setTimeout(() => {
      this.handleScroll();
    }, 50);
    this.focusItem(this.getSelectedItem() || this.getFirstItem());
  }
  close() {
    this.openValue = false;
    this.contentTarget.dataset.state = "closed";
    this.triggerTarget.setAttribute("aria-expanded", "false");
    if (this.boundHandleClickOutside) {
      document.removeEventListener("click", this.boundHandleClickOutside);
      document.removeEventListener("keydown", this.boundHandleKeydown);
      this.boundHandleClickOutside = null;
    }
    this.triggerTarget.focus();
  }
  async updatePosition() {
    const maxHeight = 384;
    const {x: x, y: y, middlewareData: middlewareData, placement: placement} = await computePosition(this.triggerTarget, this.contentTarget, {
      placement: "bottom-start",
      middleware: [ offset(4), flip(), shift({
        padding: 8
      }), size({
        apply({availableHeight: availableHeight, availableWidth: availableWidth, elements: elements, rects: rects}) {
          const contentHeight = Math.min(maxHeight, Math.max(200, availableHeight - 16));
          elements.floating.style.maxHeight = `${contentHeight}px`;
          elements.floating.style.setProperty("--ui-select-content-available-width", `${availableWidth}px`);
          elements.floating.style.setProperty("--ui-select-content-available-height", `${contentHeight}px`);
          elements.floating.style.setProperty("--ui-select-trigger-width", `${rects.reference.width}px`);
          elements.floating.style.setProperty("--ui-select-trigger-height", `${rects.reference.height}px`);
        }
      }) ]
    });
    Object.assign(this.contentTarget.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: "absolute"
    });
    const side = placement.split("-")[0];
    this.contentTarget.dataset.side = side;
  }
  selectItem(event) {
    if (!event || !event.currentTarget) return;
    const item = event.currentTarget;
    const value = item.dataset.value;
    if (item.dataset.disabled === "true") return;
    this.valueValue = value;
    this.updateDisplay(value);
    this.updateSelection(value);
    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = value;
      this.hiddenInputTarget.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }
    this.close();
  }
  updateDisplay(value) {
    const selectedItem = this.itemTargets.find(item => item.dataset.value === value);
    if (selectedItem && this.hasValueDisplayTarget) {
      const span = selectedItem.querySelector("span:first-child");
      this.valueDisplayTarget.textContent = span ? span.textContent.trim() : selectedItem.textContent.trim();
    }
  }
  updateSelection(value) {
    this.itemTargets.forEach((item, index) => {
      const isSelected = item.dataset.value === value;
      item.setAttribute("aria-selected", isSelected);
      item.dataset.state = isSelected ? "checked" : "unchecked";
      const checks = item.querySelectorAll('[data-ui--select-target="itemCheck"]');
      checks.forEach(check => {
        if (isSelected) {
          check.classList.remove("opacity-0");
          check.classList.add("opacity-100");
        } else {
          check.classList.remove("opacity-100");
          check.classList.add("opacity-0");
        }
      });
      item.classList.remove("bg-accent", "text-accent-foreground");
    });
  }
  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close();
    }
  }
  handleKeydown(event) {
    if (!this.openValue) return;
    const currentItem = this.getFocusedItem();
    switch (event.key) {
     case "ArrowDown":
      event.preventDefault();
      this.focusNextItem(currentItem);
      break;

     case "ArrowUp":
      event.preventDefault();
      this.focusPreviousItem(currentItem);
      break;

     case "Enter":
     case " ":
      event.preventDefault();
      if (currentItem) {
        currentItem.click();
      }
      break;

     case "Escape":
      event.preventDefault();
      this.close();
      break;

     case "Home":
      event.preventDefault();
      this.focusItem(this.getFirstItem());
      break;

     case "End":
      event.preventDefault();
      this.focusItem(this.getLastItem());
      break;
    }
  }
  getFocusedItem() {
    return this.itemTargets.find(item => item.classList.contains("bg-accent") || item.classList.contains("text-accent-foreground"));
  }
  getSelectedItem() {
    return this.itemTargets.find(item => item.getAttribute("aria-selected") === "true");
  }
  getFirstItem() {
    return this.getEnabledItems()[0];
  }
  getLastItem() {
    const items = this.getEnabledItems();
    return items[items.length - 1];
  }
  getEnabledItems() {
    return this.itemTargets.filter(item => item.dataset.disabled !== "true");
  }
  focusItem(item, scrollDirection = null) {
    if (!item) return;
    this.itemTargets.forEach(i => {
      i.classList.remove("bg-accent", "text-accent-foreground");
      delete i.dataset.highlighted;
    });
    item.classList.add("bg-accent", "text-accent-foreground");
    item.dataset.highlighted = "true";
    const items = this.getEnabledItems();
    const isFirstItem = item === items[0];
    const isLastItem = item === items[items.length - 1];
    if (isFirstItem && this.hasScrollUpButtonTarget) {
      this.scrollUpButtonTarget.style.display = "none";
    }
    if (isLastItem && this.hasScrollDownButtonTarget) {
      this.scrollDownButtonTarget.style.display = "none";
    }
    if (scrollDirection === "down" && !isLastItem) {
      if (this.hasViewportTarget) {
        const viewport = this.viewportTarget;
        const itemRect = item.getBoundingClientRect();
        const viewportRect = viewport.getBoundingClientRect();
        const targetBottom = viewportRect.bottom - 24;
        if (itemRect.bottom > targetBottom) {
          const scrollAmount = itemRect.bottom - targetBottom;
          viewport.scrollTop += scrollAmount;
        }
      }
    } else if (scrollDirection === "up" && !isFirstItem) {
      if (this.hasViewportTarget) {
        const viewport = this.viewportTarget;
        const itemRect = item.getBoundingClientRect();
        const viewportRect = viewport.getBoundingClientRect();
        const targetTop = viewportRect.top + 24;
        if (itemRect.top < targetTop) {
          const scrollAmount = targetTop - itemRect.top;
          viewport.scrollTop -= scrollAmount;
        }
      }
    } else {
      item.scrollIntoView({
        block: "nearest",
        behavior: "auto"
      });
    }
  }
  focusNextItem(currentItem) {
    const items = this.getEnabledItems();
    if (items.length === 0) return;
    if (!currentItem) {
      this.focusItem(items[0], "down");
      return;
    }
    const currentIndex = items.indexOf(currentItem);
    if (currentIndex >= items.length - 1) {
      return;
    }
    const nextIndex = currentIndex + 1;
    this.focusItem(items[nextIndex], "down");
  }
  focusPreviousItem(currentItem) {
    const items = this.getEnabledItems();
    if (items.length === 0) return;
    if (!currentItem) {
      this.focusItem(items[items.length - 1], "up");
      return;
    }
    const currentIndex = items.indexOf(currentItem);
    if (currentIndex <= 0) {
      return;
    }
    const previousIndex = currentIndex - 1;
    this.focusItem(items[previousIndex], "up");
  }
  scrollUp() {
    if (!this.scrollInterval) {
      this.scrollInterval = setInterval(() => {
        if (this.hasViewportTarget) {
          this.viewportTarget.scrollTop -= 5;
        }
      }, 16);
    }
  }
  scrollDown() {
    if (!this.scrollInterval) {
      this.scrollInterval = setInterval(() => {
        if (this.hasViewportTarget) {
          this.viewportTarget.scrollTop += 5;
        }
      }, 16);
    }
  }
  stopScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
  handleScroll() {
    if (!this.hasViewportTarget) return;
    const viewport = this.viewportTarget;
    viewport.scrollTop <= 0;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const isAtBottom = Math.ceil(viewport.scrollTop) >= maxScroll;
    const focusedItem = this.getFocusedItem();
    const items = this.getEnabledItems();
    focusedItem === items[0];
    const isLastItemFocused = focusedItem === items[items.length - 1];
    if (this.hasScrollUpButtonTarget) {
      const canScrollUp = viewport.scrollTop > 0;
      this.scrollUpButtonTarget.style.display = canScrollUp ? "flex" : "none";
    }
    if (this.hasScrollDownButtonTarget) {
      this.scrollDownButtonTarget.style.display = isAtBottom || isLastItemFocused ? "none" : "flex";
    }
  }
  handleItemMouseEnter(event) {
    if (!this.openValue) return;
    const item = event.currentTarget;
    if (item.dataset.disabled === "true") return;
    this.focusItem(item);
  }
  handleItemMouseLeave(event) {}
  disconnect() {
    this.stopScroll();
    if (this.boundHandleClickOutside) {
      document.removeEventListener("click", this.boundHandleClickOutside);
      document.removeEventListener("keydown", this.boundHandleKeydown);
    }
    if (this.boundHandleScroll && this.hasViewportTarget) {
      this.viewportTarget.removeEventListener("scroll", this.boundHandleScroll);
    }
  }
}

class ToggleController extends Controller {
  static values={
    pressed: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.updateState();
  }
  toggle() {
    this.pressedValue = !this.pressedValue;
  }
  pressedValueChanged() {
    this.updateState();
  }
  updateState() {
    const state = this.pressedValue ? "on" : "off";
    this.element.setAttribute("data-state", state);
    this.element.setAttribute("aria-pressed", this.pressedValue.toString());
  }
}

class ToggleGroupController extends Controller {
  static targets=[ "item" ];
  static values={
    type: {
      type: String,
      default: "single"
    },
    value: {
      type: String,
      default: "[]"
    }
  };
  connect() {
    try {
      this.selectedValues = JSON.parse(this.valueValue || "[]");
      if (!Array.isArray(this.selectedValues)) {
        this.selectedValues = this.selectedValues ? [ this.selectedValues ] : [];
      }
    } catch {
      this.selectedValues = [];
    }
    this.updateAllItems();
  }
  toggle(event) {
    const item = event.currentTarget;
    const value = item.dataset.value;
    if (!value) return;
    if (this.typeValue === "single") {
      this.toggleSingle(value, item);
    } else {
      this.toggleMultiple(value, item);
    }
    this.dispatch("change", {
      detail: {
        value: this.typeValue === "single" ? this.selectedValues[0] || null : this.selectedValues,
        type: this.typeValue
      }
    });
  }
  toggleSingle(value, item) {
    const currentValue = this.selectedValues[0];
    if (currentValue === value) {
      this.selectedValues = [];
    } else {
      this.selectedValues = [ value ];
    }
    this.updateAllItems();
  }
  toggleMultiple(value, item) {
    const index = this.selectedValues.indexOf(value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(value);
    }
    this.updateAllItems();
  }
  updateAllItems() {
    this.itemTargets.forEach(item => {
      const value = item.dataset.value;
      const isSelected = this.selectedValues.includes(value);
      item.dataset.state = isSelected ? "on" : "off";
      item.setAttribute("data-state", isSelected ? "on" : "off");
      if (this.typeValue === "single") {
        item.setAttribute("aria-checked", isSelected ? "true" : "false");
      } else {
        item.setAttribute("aria-pressed", isSelected ? "true" : "false");
      }
    });
    this.valueValue = JSON.stringify(this.selectedValues);
  }
  getValue() {
    if (this.typeValue === "single") {
      return this.selectedValues[0] || null;
    }
    return this.selectedValues;
  }
  setValue(newValue) {
    if (this.typeValue === "single") {
      this.selectedValues = newValue ? [ newValue ] : [];
    } else {
      this.selectedValues = Array.isArray(newValue) ? newValue : [];
    }
    this.updateAllItems();
  }
}

class TabsController extends Controller {
  static targets=[ "trigger", "content" ];
  static values={
    defaultValue: {
      type: String,
      default: ""
    },
    orientation: {
      type: String,
      default: "horizontal"
    },
    activationMode: {
      type: String,
      default: "automatic"
    }
  };
  connect() {
    this.setupTabs();
    this.setupKeyboardNavigation();
  }
  setupTabs() {
    const activeValue = this.defaultValueValue;
    this.triggerTargets.forEach(trigger => {
      const value = trigger.dataset.value;
      const isActive = value === activeValue;
      if (isActive) {
        this.activateTrigger(trigger);
      }
    });
    this.contentTargets.forEach(content => {
      const value = content.dataset.value;
      const isActive = value === activeValue;
      if (isActive) {
        this.showContent(content);
      } else {
        this.hideContent(content);
      }
    });
  }
  setupKeyboardNavigation() {
    this.triggerTargets.forEach(trigger => {
      trigger.addEventListener("keydown", this.handleKeyDown.bind(this));
    });
  }
  selectTab(event) {
    const trigger = event.currentTarget;
    const value = trigger.dataset.value;
    this.triggerTargets.forEach(t => {
      this.deactivateTrigger(t);
    });
    this.activateTrigger(trigger);
    this.contentTargets.forEach(content => {
      this.hideContent(content);
    });
    const content = this.contentTargets.find(c => c.dataset.value === value);
    if (content) {
      this.showContent(content);
    }
    trigger.focus();
  }
  activateTrigger(trigger) {
    trigger.dataset.state = "active";
    trigger.setAttribute("aria-selected", "true");
    trigger.setAttribute("tabindex", "0");
  }
  deactivateTrigger(trigger) {
    trigger.dataset.state = "inactive";
    trigger.setAttribute("aria-selected", "false");
    trigger.setAttribute("tabindex", "-1");
  }
  showContent(content) {
    content.dataset.state = "active";
    content.removeAttribute("hidden");
  }
  hideContent(content) {
    content.dataset.state = "inactive";
    content.setAttribute("hidden", "");
  }
  handleKeyDown(event) {
    const trigger = event.target;
    const triggers = this.triggerTargets;
    const currentIndex = triggers.indexOf(trigger);
    let nextIndex = currentIndex;
    const isHorizontal = this.orientationValue === "horizontal";
    switch (event.key) {
     case "ArrowRight":
      if (isHorizontal) {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % triggers.length;
      }
      break;

     case "ArrowLeft":
      if (isHorizontal) {
        event.preventDefault();
        nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1;
      }
      break;

     case "ArrowDown":
      if (!isHorizontal) {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % triggers.length;
      }
      break;

     case "ArrowUp":
      if (!isHorizontal) {
        event.preventDefault();
        nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1;
      }
      break;

     case "Home":
      event.preventDefault();
      nextIndex = 0;
      break;

     case "End":
      event.preventDefault();
      nextIndex = triggers.length - 1;
      break;

     default:
      return;
    }
    const nextTrigger = triggers[nextIndex];
    if (nextTrigger) {
      nextTrigger.focus();
      if (this.activationModeValue === "automatic") {
        nextTrigger.click();
      }
    }
  }
}

class SliderController extends Controller {
  static targets=[ "track", "range", "thumb" ];
  static values={
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default: [ 0 ]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: "horizontal"
    },
    inverted: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    centerPoint: {
      type: Number,
      default: null
    }
  };
  connect() {
    this.isDragging = false;
    this.currentThumbIndex = -1;
    const orientation = this.element.getAttribute("data-orientation");
    if (this.hasTrackTarget) {
      this.trackTarget.setAttribute("data-orientation", orientation);
    }
    if (this.hasRangeTarget) {
      this.rangeTarget.setAttribute("data-orientation", orientation);
    }
    this.updateUI();
    this.thumbTargets.forEach((thumb, index) => {
      thumb.addEventListener("keydown", this.handleKeyDown.bind(this, index));
    });
  }
  disconnect() {
    this.thumbTargets.forEach((thumb, index) => {
      thumb.removeEventListener("keydown", this.handleKeyDown.bind(this, index));
    });
  }
  startDrag(event) {
    if (this.disabledValue) return;
    event.preventDefault();
    const thumbIndex = this.thumbTargets.indexOf(event.currentTarget);
    this.currentThumbIndex = thumbIndex;
    this.isDragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.addEventListener("pointermove", this.handleMove.bind(this));
    document.addEventListener("pointerup", this.endDrag.bind(this));
  }
  handleMove(event) {
    if (!this.isDragging || this.currentThumbIndex === -1) return;
    event.preventDefault();
    const newValue = this.getValueFromPointer(event);
    const newValues = [ ...this.valueValue ];
    newValues[this.currentThumbIndex] = newValue;
    newValues.sort((a, b) => a - b);
    this.valueValue = newValues;
    this.updateUI();
    this.dispatchChangeEvent();
  }
  endDrag(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.currentThumbIndex = -1;
    document.removeEventListener("pointermove", this.handleMove.bind(this));
    document.removeEventListener("pointerup", this.endDrag.bind(this));
    this.dispatchCommitEvent();
  }
  clickTrack(event) {
    if (this.disabledValue) return;
    if (this.thumbTargets.some(thumb => thumb.contains(event.target))) return;
    event.preventDefault();
    const clickValue = this.getValueFromPointer(event);
    const closestIndex = this.getClosestThumbIndex(clickValue);
    const newValues = [ ...this.valueValue ];
    newValues[closestIndex] = clickValue;
    newValues.sort((a, b) => a - b);
    this.valueValue = newValues;
    this.updateUI();
    this.dispatchChangeEvent();
    this.dispatchCommitEvent();
  }
  getValueFromPointer(event) {
    if (!this.hasTrackTarget) return this.minValue;
    const rect = this.trackTarget.getBoundingClientRect();
    let percentage;
    if (this.orientationValue === "horizontal") {
      const x = event.clientX - rect.left;
      percentage = x / rect.width;
      if (this.invertedValue) percentage = 1 - percentage;
    } else {
      const y = event.clientY - rect.top;
      percentage = 1 - y / rect.height;
      if (this.invertedValue) percentage = 1 - percentage;
    }
    percentage = Math.max(0, Math.min(1, percentage));
    const rawValue = this.minValue + percentage * (this.maxValue - this.minValue);
    const steppedValue = Math.round((rawValue - this.minValue) / this.stepValue) * this.stepValue + this.minValue;
    return Math.max(this.minValue, Math.min(this.maxValue, steppedValue));
  }
  getClosestThumbIndex(value) {
    let closestIndex = 0;
    let closestDistance = Math.abs(this.valueValue[0] - value);
    for (let i = 1; i < this.valueValue.length; i++) {
      const distance = Math.abs(this.valueValue[i] - value);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    return closestIndex;
  }
  handleKeyDown(thumbIndex, event) {
    if (this.disabledValue) return;
    let newValue = this.valueValue[thumbIndex];
    const largeStep = (this.maxValue - this.minValue) / 10;
    switch (event.key) {
     case "ArrowRight":
     case "ArrowUp":
      newValue += this.stepValue;
      event.preventDefault();
      break;

     case "ArrowLeft":
     case "ArrowDown":
      newValue -= this.stepValue;
      event.preventDefault();
      break;

     case "PageUp":
      newValue += largeStep;
      event.preventDefault();
      break;

     case "PageDown":
      newValue -= largeStep;
      event.preventDefault();
      break;

     case "Home":
      newValue = this.minValue;
      event.preventDefault();
      break;

     case "End":
      newValue = this.maxValue;
      event.preventDefault();
      break;

     default:
      return;
    }
    newValue = Math.max(this.minValue, Math.min(this.maxValue, newValue));
    const newValues = [ ...this.valueValue ];
    newValues[thumbIndex] = newValue;
    newValues.sort((a, b) => a - b);
    this.valueValue = newValues;
    this.updateUI();
    this.dispatchChangeEvent();
    this.dispatchCommitEvent();
  }
  updateUI() {
    if (!this.hasTrackTarget) return;
    if (this.hasRangeTarget) {
      let startValue, endValue;
      if (this.valueValue.length === 1) {
        const currentValue = this.valueValue[0];
        if (this.hasCenterPointValue && this.centerPointValue !== null) {
          if (currentValue >= this.centerPointValue) {
            startValue = this.centerPointValue;
            endValue = currentValue;
          } else {
            startValue = currentValue;
            endValue = this.centerPointValue;
          }
        } else {
          startValue = this.minValue;
          endValue = currentValue;
        }
      } else {
        startValue = Math.min(...this.valueValue);
        endValue = Math.max(...this.valueValue);
      }
      const startPercent = (startValue - this.minValue) / (this.maxValue - this.minValue) * 100;
      const endPercent = (endValue - this.minValue) / (this.maxValue - this.minValue) * 100;
      if (this.orientationValue === "horizontal") {
        this.rangeTarget.style.left = `${startPercent}%`;
        this.rangeTarget.style.width = `${endPercent - startPercent}%`;
        this.rangeTarget.style.top = "0";
        this.rangeTarget.style.height = "100%";
      } else {
        this.rangeTarget.style.bottom = `${startPercent}%`;
        this.rangeTarget.style.height = `${endPercent - startPercent}%`;
        this.rangeTarget.style.left = "0";
        this.rangeTarget.style.width = "100%";
      }
    }
    this.thumbTargets.forEach((thumb, index) => {
      const value = this.valueValue[index] ?? this.minValue;
      const percent = (value - this.minValue) / (this.maxValue - this.minValue) * 100;
      if (this.orientationValue === "horizontal") {
        thumb.style.left = `${percent}%`;
        thumb.style.top = "50%";
        thumb.style.transform = "translate(-50%, -50%)";
      } else {
        thumb.style.bottom = `${percent}%`;
        thumb.style.left = "50%";
        thumb.style.transform = "translate(-50%, 50%)";
      }
      thumb.setAttribute("aria-valuenow", value);
      thumb.setAttribute("aria-valuemin", this.minValue);
      thumb.setAttribute("aria-valuemax", this.maxValue);
      thumb.setAttribute("aria-orientation", this.orientationValue);
      if (this.disabledValue) {
        thumb.setAttribute("aria-disabled", "true");
      } else {
        thumb.removeAttribute("aria-disabled");
      }
    });
  }
  dispatchChangeEvent() {
    this.element.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: {
        value: this.valueValue
      }
    }));
  }
  dispatchCommitEvent() {
    this.element.dispatchEvent(new CustomEvent("slider:commit", {
      bubbles: true,
      detail: {
        value: this.valueValue
      }
    }));
  }
  valueValueChanged() {
    this.updateUI();
  }
  disabledValueChanged() {
    if (this.disabledValue) {
      this.element.setAttribute("data-disabled", "");
    } else {
      this.element.removeAttribute("data-disabled");
    }
    this.updateUI();
  }
  orientationValueChanged() {
    this.element.setAttribute("data-orientation", this.orientationValue);
    if (this.hasTrackTarget) {
      this.trackTarget.setAttribute("data-orientation", this.orientationValue);
    }
    if (this.hasRangeTarget) {
      this.rangeTarget.setAttribute("data-orientation", this.orientationValue);
    }
    this.updateUI();
  }
}

class SwitchController extends Controller {
  static targets=[ "thumb" ];
  static values={
    checked: {
      type: Boolean,
      default: false
    }
  };
  connect() {
    this.updateState(this.checkedValue, false);
  }
  toggle(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.element.hasAttribute("disabled")) {
      return;
    }
    this.checkedValue = !this.checkedValue;
    this.updateState(this.checkedValue, true);
    this.element.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
  handleKeydown(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.toggle();
    }
  }
  updateState(isChecked, animate = true) {
    this.element.setAttribute("data-state", isChecked ? "checked" : "unchecked");
    this.element.setAttribute("aria-checked", isChecked);
    if (this.hasThumbTarget) {
      this.thumbTarget.setAttribute("data-state", isChecked ? "checked" : "unchecked");
    }
    const hiddenInput = this.element.querySelector('input[type="hidden"]');
    if (hiddenInput) {
      hiddenInput.value = isChecked ? "1" : "0";
    }
  }
  checkedValueChanged(value) {
    this.updateState(value, true);
  }
}

function isNumber(subject) {
  return typeof subject === "number";
}

function isString(subject) {
  return typeof subject === "string";
}

function isBoolean(subject) {
  return typeof subject === "boolean";
}

function isObject(subject) {
  return Object.prototype.toString.call(subject) === "[object Object]";
}

function mathAbs(n) {
  return Math.abs(n);
}

function mathSign(n) {
  return Math.sign(n);
}

function deltaAbs(valueB, valueA) {
  return mathAbs(valueB - valueA);
}

function factorAbs(valueB, valueA) {
  if (valueB === 0 || valueA === 0) return 0;
  if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
  const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
  return mathAbs(diff / valueB);
}

function roundToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}

function arrayKeys(array) {
  return objectKeys(array).map(Number);
}

function arrayLast(array) {
  return array[arrayLastIndex(array)];
}

function arrayLastIndex(array) {
  return Math.max(0, array.length - 1);
}

function arrayIsLastIndex(array, index) {
  return index === arrayLastIndex(array);
}

function arrayFromNumber(n, startAt = 0) {
  return Array.from(Array(n), (_, i) => startAt + i);
}

function objectKeys(object) {
  return Object.keys(object);
}

function objectsMergeDeep(objectA, objectB) {
  return [ objectA, objectB ].reduce((mergedObjects, currentObject) => {
    objectKeys(currentObject).forEach(key => {
      const valueA = mergedObjects[key];
      const valueB = currentObject[key];
      const areObjects = isObject(valueA) && isObject(valueB);
      mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
    });
    return mergedObjects;
  }, {});
}

function isMouseEvent(evt, ownerWindow) {
  return typeof ownerWindow.MouseEvent !== "undefined" && evt instanceof ownerWindow.MouseEvent;
}

function Alignment(align, viewSize) {
  const predefined = {
    start: start,
    center: center,
    end: end
  };
  function start() {
    return 0;
  }
  function center(n) {
    return end(n) / 2;
  }
  function end(n) {
    return viewSize - n;
  }
  function measure(n, index) {
    if (isString(align)) return predefined[align](n);
    return align(viewSize, n, index);
  }
  const self = {
    measure: measure
  };
  return self;
}

function EventStore() {
  let listeners = [];
  function add(node, type, handler, options = {
    passive: true
  }) {
    let removeListener;
    if ("addEventListener" in node) {
      node.addEventListener(type, handler, options);
      removeListener = () => node.removeEventListener(type, handler, options);
    } else {
      const legacyMediaQueryList = node;
      legacyMediaQueryList.addListener(handler);
      removeListener = () => legacyMediaQueryList.removeListener(handler);
    }
    listeners.push(removeListener);
    return self;
  }
  function clear() {
    listeners = listeners.filter(remove => remove());
  }
  const self = {
    add: add,
    clear: clear
  };
  return self;
}

function Animations(ownerDocument, ownerWindow, update, render) {
  const documentVisibleHandler = EventStore();
  const fixedTimeStep = 1e3 / 60;
  let lastTimeStamp = null;
  let accumulatedTime = 0;
  let animationId = 0;
  function init() {
    documentVisibleHandler.add(ownerDocument, "visibilitychange", () => {
      if (ownerDocument.hidden) reset();
    });
  }
  function destroy() {
    stop();
    documentVisibleHandler.clear();
  }
  function animate(timeStamp) {
    if (!animationId) return;
    if (!lastTimeStamp) {
      lastTimeStamp = timeStamp;
      update();
      update();
    }
    const timeElapsed = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    accumulatedTime += timeElapsed;
    while (accumulatedTime >= fixedTimeStep) {
      update();
      accumulatedTime -= fixedTimeStep;
    }
    const alpha = accumulatedTime / fixedTimeStep;
    render(alpha);
    if (animationId) {
      animationId = ownerWindow.requestAnimationFrame(animate);
    }
  }
  function start() {
    if (animationId) return;
    animationId = ownerWindow.requestAnimationFrame(animate);
  }
  function stop() {
    ownerWindow.cancelAnimationFrame(animationId);
    lastTimeStamp = null;
    accumulatedTime = 0;
    animationId = 0;
  }
  function reset() {
    lastTimeStamp = null;
    accumulatedTime = 0;
  }
  const self = {
    init: init,
    destroy: destroy,
    start: start,
    stop: stop,
    update: update,
    render: render
  };
  return self;
}

function Axis(axis, contentDirection) {
  const isRightToLeft = contentDirection === "rtl";
  const isVertical = axis === "y";
  const scroll = isVertical ? "y" : "x";
  const cross = isVertical ? "x" : "y";
  const sign = !isVertical && isRightToLeft ? -1 : 1;
  const startEdge = getStartEdge();
  const endEdge = getEndEdge();
  function measureSize(nodeRect) {
    const {height: height, width: width} = nodeRect;
    return isVertical ? height : width;
  }
  function getStartEdge() {
    if (isVertical) return "top";
    return isRightToLeft ? "right" : "left";
  }
  function getEndEdge() {
    if (isVertical) return "bottom";
    return isRightToLeft ? "left" : "right";
  }
  function direction(n) {
    return n * sign;
  }
  const self = {
    scroll: scroll,
    cross: cross,
    startEdge: startEdge,
    endEdge: endEdge,
    measureSize: measureSize,
    direction: direction
  };
  return self;
}

function Limit(min = 0, max = 0) {
  const length = mathAbs(min - max);
  function reachedMin(n) {
    return n < min;
  }
  function reachedMax(n) {
    return n > max;
  }
  function reachedAny(n) {
    return reachedMin(n) || reachedMax(n);
  }
  function constrain(n) {
    if (!reachedAny(n)) return n;
    return reachedMin(n) ? min : max;
  }
  function removeOffset(n) {
    if (!length) return n;
    return n - length * Math.ceil((n - max) / length);
  }
  const self = {
    length: length,
    max: max,
    min: min,
    constrain: constrain,
    reachedAny: reachedAny,
    reachedMax: reachedMax,
    reachedMin: reachedMin,
    removeOffset: removeOffset
  };
  return self;
}

function Counter(max, start, loop) {
  const {constrain: constrain} = Limit(0, max);
  const loopEnd = max + 1;
  let counter = withinLimit(start);
  function withinLimit(n) {
    return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd);
  }
  function get() {
    return counter;
  }
  function set(n) {
    counter = withinLimit(n);
    return self;
  }
  function add(n) {
    return clone().set(get() + n);
  }
  function clone() {
    return Counter(max, get(), loop);
  }
  const self = {
    get: get,
    set: set,
    add: add,
    clone: clone
  };
  return self;
}

function DragHandler(axis, rootNode, ownerDocument, ownerWindow, target, dragTracker, location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, baseFriction, watchDrag) {
  const {cross: crossAxis, direction: direction} = axis;
  const focusNodes = [ "INPUT", "SELECT", "TEXTAREA" ];
  const nonPassiveEvent = {
    passive: false
  };
  const initEvents = EventStore();
  const dragEvents = EventStore();
  const goToNextThreshold = Limit(50, 225).constrain(percentOfView.measure(20));
  const snapForceBoost = {
    mouse: 300,
    touch: 400
  };
  const freeForceBoost = {
    mouse: 500,
    touch: 600
  };
  const baseSpeed = dragFree ? 43 : 25;
  let isMoving = false;
  let startScroll = 0;
  let startCross = 0;
  let pointerIsDown = false;
  let preventScroll = false;
  let preventClick = false;
  let isMouse = false;
  function init(emblaApi) {
    if (!watchDrag) return;
    function downIfAllowed(evt) {
      if (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) down(evt);
    }
    const node = rootNode;
    initEvents.add(node, "dragstart", evt => evt.preventDefault(), nonPassiveEvent).add(node, "touchmove", () => undefined, nonPassiveEvent).add(node, "touchend", () => undefined).add(node, "touchstart", downIfAllowed).add(node, "mousedown", downIfAllowed).add(node, "touchcancel", up).add(node, "contextmenu", up).add(node, "click", click, true);
  }
  function destroy() {
    initEvents.clear();
    dragEvents.clear();
  }
  function addDragEvents() {
    const node = isMouse ? ownerDocument : rootNode;
    dragEvents.add(node, "touchmove", move, nonPassiveEvent).add(node, "touchend", up).add(node, "mousemove", move, nonPassiveEvent).add(node, "mouseup", up);
  }
  function isFocusNode(node) {
    const nodeName = node.nodeName || "";
    return focusNodes.includes(nodeName);
  }
  function forceBoost() {
    const boost = dragFree ? freeForceBoost : snapForceBoost;
    const type = isMouse ? "mouse" : "touch";
    return boost[type];
  }
  function allowedForce(force, targetChanged) {
    const next = index.add(mathSign(force) * -1);
    const baseForce = scrollTarget.byDistance(force, !dragFree).distance;
    if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce;
    if (skipSnaps && targetChanged) return baseForce * .5;
    return scrollTarget.byIndex(next.get(), 0).distance;
  }
  function down(evt) {
    const isMouseEvt = isMouseEvent(evt, ownerWindow);
    isMouse = isMouseEvt;
    preventClick = dragFree && isMouseEvt && !evt.buttons && isMoving;
    isMoving = deltaAbs(target.get(), location.get()) >= 2;
    if (isMouseEvt && evt.button !== 0) return;
    if (isFocusNode(evt.target)) return;
    pointerIsDown = true;
    dragTracker.pointerDown(evt);
    scrollBody.useFriction(0).useDuration(0);
    target.set(location);
    addDragEvents();
    startScroll = dragTracker.readPoint(evt);
    startCross = dragTracker.readPoint(evt, crossAxis);
    eventHandler.emit("pointerDown");
  }
  function move(evt) {
    const isTouchEvt = !isMouseEvent(evt, ownerWindow);
    if (isTouchEvt && evt.touches.length >= 2) return up(evt);
    const lastScroll = dragTracker.readPoint(evt);
    const lastCross = dragTracker.readPoint(evt, crossAxis);
    const diffScroll = deltaAbs(lastScroll, startScroll);
    const diffCross = deltaAbs(lastCross, startCross);
    if (!preventScroll && !isMouse) {
      if (!evt.cancelable) return up(evt);
      preventScroll = diffScroll > diffCross;
      if (!preventScroll) return up(evt);
    }
    const diff = dragTracker.pointerMove(evt);
    if (diffScroll > dragThreshold) preventClick = true;
    scrollBody.useFriction(.3).useDuration(.75);
    animation.start();
    target.add(direction(diff));
    evt.preventDefault();
  }
  function up(evt) {
    const currentLocation = scrollTarget.byDistance(0, false);
    const targetChanged = currentLocation.index !== index.get();
    const rawForce = dragTracker.pointerUp(evt) * forceBoost();
    const force = allowedForce(direction(rawForce), targetChanged);
    const forceFactor = factorAbs(rawForce, force);
    const speed = baseSpeed - 10 * forceFactor;
    const friction = baseFriction + forceFactor / 50;
    preventScroll = false;
    pointerIsDown = false;
    dragEvents.clear();
    scrollBody.useDuration(speed).useFriction(friction);
    scrollTo.distance(force, !dragFree);
    isMouse = false;
    eventHandler.emit("pointerUp");
  }
  function click(evt) {
    if (preventClick) {
      evt.stopPropagation();
      evt.preventDefault();
      preventClick = false;
    }
  }
  function pointerDown() {
    return pointerIsDown;
  }
  const self = {
    init: init,
    destroy: destroy,
    pointerDown: pointerDown
  };
  return self;
}

function DragTracker(axis, ownerWindow) {
  const logInterval = 170;
  let startEvent;
  let lastEvent;
  function readTime(evt) {
    return evt.timeStamp;
  }
  function readPoint(evt, evtAxis) {
    const property = evtAxis || axis.scroll;
    const coord = `client${property === "x" ? "X" : "Y"}`;
    return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord];
  }
  function pointerDown(evt) {
    startEvent = evt;
    lastEvent = evt;
    return readPoint(evt);
  }
  function pointerMove(evt) {
    const diff = readPoint(evt) - readPoint(lastEvent);
    const expired = readTime(evt) - readTime(startEvent) > logInterval;
    lastEvent = evt;
    if (expired) startEvent = evt;
    return diff;
  }
  function pointerUp(evt) {
    if (!startEvent || !lastEvent) return 0;
    const diffDrag = readPoint(lastEvent) - readPoint(startEvent);
    const diffTime = readTime(evt) - readTime(startEvent);
    const expired = readTime(evt) - readTime(lastEvent) > logInterval;
    const force = diffDrag / diffTime;
    const isFlick = diffTime && !expired && mathAbs(force) > .1;
    return isFlick ? force : 0;
  }
  const self = {
    pointerDown: pointerDown,
    pointerMove: pointerMove,
    pointerUp: pointerUp,
    readPoint: readPoint
  };
  return self;
}

function NodeRects() {
  function measure(node) {
    const {offsetTop: offsetTop, offsetLeft: offsetLeft, offsetWidth: offsetWidth, offsetHeight: offsetHeight} = node;
    const offset = {
      top: offsetTop,
      right: offsetLeft + offsetWidth,
      bottom: offsetTop + offsetHeight,
      left: offsetLeft,
      width: offsetWidth,
      height: offsetHeight
    };
    return offset;
  }
  const self = {
    measure: measure
  };
  return self;
}

function PercentOfView(viewSize) {
  function measure(n) {
    return viewSize * (n / 100);
  }
  const self = {
    measure: measure
  };
  return self;
}

function ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects) {
  const observeNodes = [ container ].concat(slides);
  let resizeObserver;
  let containerSize;
  let slideSizes = [];
  let destroyed = false;
  function readSize(node) {
    return axis.measureSize(nodeRects.measure(node));
  }
  function init(emblaApi) {
    if (!watchResize) return;
    containerSize = readSize(container);
    slideSizes = slides.map(readSize);
    function defaultCallback(entries) {
      for (const entry of entries) {
        if (destroyed) return;
        const isContainer = entry.target === container;
        const slideIndex = slides.indexOf(entry.target);
        const lastSize = isContainer ? containerSize : slideSizes[slideIndex];
        const newSize = readSize(isContainer ? container : slides[slideIndex]);
        const diffSize = mathAbs(newSize - lastSize);
        if (diffSize >= .5) {
          emblaApi.reInit();
          eventHandler.emit("resize");
          break;
        }
      }
    }
    resizeObserver = new ResizeObserver(entries => {
      if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
        defaultCallback(entries);
      }
    });
    ownerWindow.requestAnimationFrame(() => {
      observeNodes.forEach(node => resizeObserver.observe(node));
    });
  }
  function destroy() {
    destroyed = true;
    if (resizeObserver) resizeObserver.disconnect();
  }
  const self = {
    init: init,
    destroy: destroy
  };
  return self;
}

function ScrollBody(location, offsetLocation, previousLocation, target, baseDuration, baseFriction) {
  let scrollVelocity = 0;
  let scrollDirection = 0;
  let scrollDuration = baseDuration;
  let scrollFriction = baseFriction;
  let rawLocation = location.get();
  let rawLocationPrevious = 0;
  function seek() {
    const displacement = target.get() - location.get();
    const isInstant = !scrollDuration;
    let scrollDistance = 0;
    if (isInstant) {
      scrollVelocity = 0;
      previousLocation.set(target);
      location.set(target);
      scrollDistance = displacement;
    } else {
      previousLocation.set(location);
      scrollVelocity += displacement / scrollDuration;
      scrollVelocity *= scrollFriction;
      rawLocation += scrollVelocity;
      location.add(scrollVelocity);
      scrollDistance = rawLocation - rawLocationPrevious;
    }
    scrollDirection = mathSign(scrollDistance);
    rawLocationPrevious = rawLocation;
    return self;
  }
  function settled() {
    const diff = target.get() - offsetLocation.get();
    return mathAbs(diff) < .001;
  }
  function duration() {
    return scrollDuration;
  }
  function direction() {
    return scrollDirection;
  }
  function velocity() {
    return scrollVelocity;
  }
  function useBaseDuration() {
    return useDuration(baseDuration);
  }
  function useBaseFriction() {
    return useFriction(baseFriction);
  }
  function useDuration(n) {
    scrollDuration = n;
    return self;
  }
  function useFriction(n) {
    scrollFriction = n;
    return self;
  }
  const self = {
    direction: direction,
    duration: duration,
    velocity: velocity,
    seek: seek,
    settled: settled,
    useBaseFriction: useBaseFriction,
    useBaseDuration: useBaseDuration,
    useFriction: useFriction,
    useDuration: useDuration
  };
  return self;
}

function ScrollBounds(limit, location, target, scrollBody, percentOfView) {
  const pullBackThreshold = percentOfView.measure(10);
  const edgeOffsetTolerance = percentOfView.measure(50);
  const frictionLimit = Limit(.1, .99);
  let disabled = false;
  function shouldConstrain() {
    if (disabled) return false;
    if (!limit.reachedAny(target.get())) return false;
    if (!limit.reachedAny(location.get())) return false;
    return true;
  }
  function constrain(pointerDown) {
    if (!shouldConstrain()) return;
    const edge = limit.reachedMin(location.get()) ? "min" : "max";
    const diffToEdge = mathAbs(limit[edge] - location.get());
    const diffToTarget = target.get() - location.get();
    const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance);
    target.subtract(diffToTarget * friction);
    if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
      target.set(limit.constrain(target.get()));
      scrollBody.useDuration(25).useBaseFriction();
    }
  }
  function toggleActive(active) {
    disabled = !active;
  }
  const self = {
    shouldConstrain: shouldConstrain,
    constrain: constrain,
    toggleActive: toggleActive
  };
  return self;
}

function ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance) {
  const scrollBounds = Limit(-contentSize + viewSize, 0);
  const snapsBounded = measureBounded();
  const scrollContainLimit = findScrollContainLimit();
  const snapsContained = measureContained();
  function usePixelTolerance(bound, snap) {
    return deltaAbs(bound, snap) <= 1;
  }
  function findScrollContainLimit() {
    const startSnap = snapsBounded[0];
    const endSnap = arrayLast(snapsBounded);
    const min = snapsBounded.lastIndexOf(startSnap);
    const max = snapsBounded.indexOf(endSnap) + 1;
    return Limit(min, max);
  }
  function measureBounded() {
    return snapsAligned.map((snapAligned, index) => {
      const {min: min, max: max} = scrollBounds;
      const snap = scrollBounds.constrain(snapAligned);
      const isFirst = !index;
      const isLast = arrayIsLastIndex(snapsAligned, index);
      if (isFirst) return max;
      if (isLast) return min;
      if (usePixelTolerance(min, snap)) return min;
      if (usePixelTolerance(max, snap)) return max;
      return snap;
    }).map(scrollBound => parseFloat(scrollBound.toFixed(3)));
  }
  function measureContained() {
    if (contentSize <= viewSize + pixelTolerance) return [ scrollBounds.max ];
    if (containScroll === "keepSnaps") return snapsBounded;
    const {min: min, max: max} = scrollContainLimit;
    return snapsBounded.slice(min, max);
  }
  const self = {
    snapsContained: snapsContained,
    scrollContainLimit: scrollContainLimit
  };
  return self;
}

function ScrollLimit(contentSize, scrollSnaps, loop) {
  const max = scrollSnaps[0];
  const min = loop ? max - contentSize : arrayLast(scrollSnaps);
  const limit = Limit(min, max);
  const self = {
    limit: limit
  };
  return self;
}

function ScrollLooper(contentSize, limit, location, vectors) {
  const jointSafety = .1;
  const min = limit.min + jointSafety;
  const max = limit.max + jointSafety;
  const {reachedMin: reachedMin, reachedMax: reachedMax} = Limit(min, max);
  function shouldLoop(direction) {
    if (direction === 1) return reachedMax(location.get());
    if (direction === -1) return reachedMin(location.get());
    return false;
  }
  function loop(direction) {
    if (!shouldLoop(direction)) return;
    const loopDistance = contentSize * (direction * -1);
    vectors.forEach(v => v.add(loopDistance));
  }
  const self = {
    loop: loop
  };
  return self;
}

function ScrollProgress(limit) {
  const {max: max, length: length} = limit;
  function get(n) {
    const currentLocation = n - max;
    return length ? currentLocation / -length : 0;
  }
  const self = {
    get: get
  };
  return self;
}

function ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll) {
  const {startEdge: startEdge, endEdge: endEdge} = axis;
  const {groupSlides: groupSlides} = slidesToScroll;
  const alignments = measureSizes().map(alignment.measure);
  const snaps = measureUnaligned();
  const snapsAligned = measureAligned();
  function measureSizes() {
    return groupSlides(slideRects).map(rects => arrayLast(rects)[endEdge] - rects[0][startEdge]).map(mathAbs);
  }
  function measureUnaligned() {
    return slideRects.map(rect => containerRect[startEdge] - rect[startEdge]).map(snap => -mathAbs(snap));
  }
  function measureAligned() {
    return groupSlides(snaps).map(g => g[0]).map((snap, index) => snap + alignments[index]);
  }
  const self = {
    snaps: snaps,
    snapsAligned: snapsAligned
  };
  return self;
}

function SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes) {
  const {groupSlides: groupSlides} = slidesToScroll;
  const {min: min, max: max} = scrollContainLimit;
  const slideRegistry = createSlideRegistry();
  function createSlideRegistry() {
    const groupedSlideIndexes = groupSlides(slideIndexes);
    const doNotContain = !containSnaps || containScroll === "keepSnaps";
    if (scrollSnaps.length === 1) return [ slideIndexes ];
    if (doNotContain) return groupedSlideIndexes;
    return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
      const isFirst = !index;
      const isLast = arrayIsLastIndex(groups, index);
      if (isFirst) {
        const range = arrayLast(groups[0]) + 1;
        return arrayFromNumber(range);
      }
      if (isLast) {
        const range = arrayLastIndex(slideIndexes) - arrayLast(groups)[0] + 1;
        return arrayFromNumber(range, arrayLast(groups)[0]);
      }
      return group;
    });
  }
  const self = {
    slideRegistry: slideRegistry
  };
  return self;
}

function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
  const {reachedAny: reachedAny, removeOffset: removeOffset, constrain: constrain} = limit;
  function minDistance(distances) {
    return distances.concat().sort((a, b) => mathAbs(a) - mathAbs(b))[0];
  }
  function findTargetSnap(target) {
    const distance = loop ? removeOffset(target) : constrain(target);
    const ascDiffsToSnaps = scrollSnaps.map((snap, index) => ({
      diff: shortcut(snap - distance, 0),
      index: index
    })).sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff));
    const {index: index} = ascDiffsToSnaps[0];
    return {
      index: index,
      distance: distance
    };
  }
  function shortcut(target, direction) {
    const targets = [ target, target + contentSize, target - contentSize ];
    if (!loop) return target;
    if (!direction) return minDistance(targets);
    const matchingTargets = targets.filter(t => mathSign(t) === direction);
    if (matchingTargets.length) return minDistance(matchingTargets);
    return arrayLast(targets) - contentSize;
  }
  function byIndex(index, direction) {
    const diffToSnap = scrollSnaps[index] - targetVector.get();
    const distance = shortcut(diffToSnap, direction);
    return {
      index: index,
      distance: distance
    };
  }
  function byDistance(distance, snap) {
    const target = targetVector.get() + distance;
    const {index: index, distance: targetSnapDistance} = findTargetSnap(target);
    const reachedBound = !loop && reachedAny(target);
    if (!snap || reachedBound) return {
      index: index,
      distance: distance
    };
    const diffToSnap = scrollSnaps[index] - targetSnapDistance;
    const snapDistance = distance + shortcut(diffToSnap, 0);
    return {
      index: index,
      distance: snapDistance
    };
  }
  const self = {
    byDistance: byDistance,
    byIndex: byIndex,
    shortcut: shortcut
  };
  return self;
}

function ScrollTo(animation, indexCurrent, indexPrevious, scrollBody, scrollTarget, targetVector, eventHandler) {
  function scrollTo(target) {
    const distanceDiff = target.distance;
    const indexDiff = target.index !== indexCurrent.get();
    targetVector.add(distanceDiff);
    if (distanceDiff) {
      if (scrollBody.duration()) {
        animation.start();
      } else {
        animation.update();
        animation.render(1);
        animation.update();
      }
    }
    if (indexDiff) {
      indexPrevious.set(indexCurrent.get());
      indexCurrent.set(target.index);
      eventHandler.emit("select");
    }
  }
  function distance(n, snap) {
    const target = scrollTarget.byDistance(n, snap);
    scrollTo(target);
  }
  function index(n, direction) {
    const targetIndex = indexCurrent.clone().set(n);
    const target = scrollTarget.byIndex(targetIndex.get(), direction);
    scrollTo(target);
  }
  const self = {
    distance: distance,
    index: index
  };
  return self;
}

function SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus) {
  const focusListenerOptions = {
    passive: true,
    capture: true
  };
  let lastTabPressTime = 0;
  function init(emblaApi) {
    if (!watchFocus) return;
    function defaultCallback(index) {
      const nowTime = (new Date).getTime();
      const diffTime = nowTime - lastTabPressTime;
      if (diffTime > 10) return;
      eventHandler.emit("slideFocusStart");
      root.scrollLeft = 0;
      const group = slideRegistry.findIndex(group => group.includes(index));
      if (!isNumber(group)) return;
      scrollBody.useDuration(0);
      scrollTo.index(group, 0);
      eventHandler.emit("slideFocus");
    }
    eventStore.add(document, "keydown", registerTabPress, false);
    slides.forEach((slide, slideIndex) => {
      eventStore.add(slide, "focus", evt => {
        if (isBoolean(watchFocus) || watchFocus(emblaApi, evt)) {
          defaultCallback(slideIndex);
        }
      }, focusListenerOptions);
    });
  }
  function registerTabPress(event) {
    if (event.code === "Tab") lastTabPressTime = (new Date).getTime();
  }
  const self = {
    init: init
  };
  return self;
}

function Vector1D(initialValue) {
  let value = initialValue;
  function get() {
    return value;
  }
  function set(n) {
    value = normalizeInput(n);
  }
  function add(n) {
    value += normalizeInput(n);
  }
  function subtract(n) {
    value -= normalizeInput(n);
  }
  function normalizeInput(n) {
    return isNumber(n) ? n : n.get();
  }
  const self = {
    get: get,
    set: set,
    add: add,
    subtract: subtract
  };
  return self;
}

function Translate(axis, container) {
  const translate = axis.scroll === "x" ? x : y;
  const containerStyle = container.style;
  let previousTarget = null;
  let disabled = false;
  function x(n) {
    return `translate3d(${n}px,0px,0px)`;
  }
  function y(n) {
    return `translate3d(0px,${n}px,0px)`;
  }
  function to(target) {
    if (disabled) return;
    const newTarget = roundToTwoDecimals(axis.direction(target));
    if (newTarget === previousTarget) return;
    containerStyle.transform = translate(newTarget);
    previousTarget = newTarget;
  }
  function toggleActive(active) {
    disabled = !active;
  }
  function clear() {
    if (disabled) return;
    containerStyle.transform = "";
    if (!container.getAttribute("style")) container.removeAttribute("style");
  }
  const self = {
    clear: clear,
    to: to,
    toggleActive: toggleActive
  };
  return self;
}

function SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, location, slides) {
  const roundingSafety = .5;
  const ascItems = arrayKeys(slideSizesWithGaps);
  const descItems = arrayKeys(slideSizesWithGaps).reverse();
  const loopPoints = startPoints().concat(endPoints());
  function removeSlideSizes(indexes, from) {
    return indexes.reduce((a, i) => a - slideSizesWithGaps[i], from);
  }
  function slidesInGap(indexes, gap) {
    return indexes.reduce((a, i) => {
      const remainingGap = removeSlideSizes(a, gap);
      return remainingGap > 0 ? a.concat([ i ]) : a;
    }, []);
  }
  function findSlideBounds(offset) {
    return snaps.map((snap, index) => ({
      start: snap - slideSizes[index] + roundingSafety + offset,
      end: snap + viewSize - roundingSafety + offset
    }));
  }
  function findLoopPoints(indexes, offset, isEndEdge) {
    const slideBounds = findSlideBounds(offset);
    return indexes.map(index => {
      const initial = isEndEdge ? 0 : -contentSize;
      const altered = isEndEdge ? contentSize : 0;
      const boundEdge = isEndEdge ? "end" : "start";
      const loopPoint = slideBounds[index][boundEdge];
      return {
        index: index,
        loopPoint: loopPoint,
        slideLocation: Vector1D(-1),
        translate: Translate(axis, slides[index]),
        target: () => location.get() > loopPoint ? initial : altered
      };
    });
  }
  function startPoints() {
    const gap = scrollSnaps[0];
    const indexes = slidesInGap(descItems, gap);
    return findLoopPoints(indexes, contentSize, false);
  }
  function endPoints() {
    const gap = viewSize - scrollSnaps[0] - 1;
    const indexes = slidesInGap(ascItems, gap);
    return findLoopPoints(indexes, -contentSize, true);
  }
  function canLoop() {
    return loopPoints.every(({index: index}) => {
      const otherIndexes = ascItems.filter(i => i !== index);
      return removeSlideSizes(otherIndexes, viewSize) <= .1;
    });
  }
  function loop() {
    loopPoints.forEach(loopPoint => {
      const {target: target, translate: translate, slideLocation: slideLocation} = loopPoint;
      const shiftLocation = target();
      if (shiftLocation === slideLocation.get()) return;
      translate.to(shiftLocation);
      slideLocation.set(shiftLocation);
    });
  }
  function clear() {
    loopPoints.forEach(loopPoint => loopPoint.translate.clear());
  }
  const self = {
    canLoop: canLoop,
    clear: clear,
    loop: loop,
    loopPoints: loopPoints
  };
  return self;
}

function SlidesHandler(container, eventHandler, watchSlides) {
  let mutationObserver;
  let destroyed = false;
  function init(emblaApi) {
    if (!watchSlides) return;
    function defaultCallback(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          emblaApi.reInit();
          eventHandler.emit("slidesChanged");
          break;
        }
      }
    }
    mutationObserver = new MutationObserver(mutations => {
      if (destroyed) return;
      if (isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) {
        defaultCallback(mutations);
      }
    });
    mutationObserver.observe(container, {
      childList: true
    });
  }
  function destroy() {
    if (mutationObserver) mutationObserver.disconnect();
    destroyed = true;
  }
  const self = {
    init: init,
    destroy: destroy
  };
  return self;
}

function SlidesInView(container, slides, eventHandler, threshold) {
  const intersectionEntryMap = {};
  let inViewCache = null;
  let notInViewCache = null;
  let intersectionObserver;
  let destroyed = false;
  function init() {
    intersectionObserver = new IntersectionObserver(entries => {
      if (destroyed) return;
      entries.forEach(entry => {
        const index = slides.indexOf(entry.target);
        intersectionEntryMap[index] = entry;
      });
      inViewCache = null;
      notInViewCache = null;
      eventHandler.emit("slidesInView");
    }, {
      root: container.parentElement,
      threshold: threshold
    });
    slides.forEach(slide => intersectionObserver.observe(slide));
  }
  function destroy() {
    if (intersectionObserver) intersectionObserver.disconnect();
    destroyed = true;
  }
  function createInViewList(inView) {
    return objectKeys(intersectionEntryMap).reduce((list, slideIndex) => {
      const index = parseInt(slideIndex);
      const {isIntersecting: isIntersecting} = intersectionEntryMap[index];
      const inViewMatch = inView && isIntersecting;
      const notInViewMatch = !inView && !isIntersecting;
      if (inViewMatch || notInViewMatch) list.push(index);
      return list;
    }, []);
  }
  function get(inView = true) {
    if (inView && inViewCache) return inViewCache;
    if (!inView && notInViewCache) return notInViewCache;
    const slideIndexes = createInViewList(inView);
    if (inView) inViewCache = slideIndexes;
    if (!inView) notInViewCache = slideIndexes;
    return slideIndexes;
  }
  const self = {
    init: init,
    destroy: destroy,
    get: get
  };
  return self;
}

function SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow) {
  const {measureSize: measureSize, startEdge: startEdge, endEdge: endEdge} = axis;
  const withEdgeGap = slideRects[0] && readEdgeGap;
  const startGap = measureStartGap();
  const endGap = measureEndGap();
  const slideSizes = slideRects.map(measureSize);
  const slideSizesWithGaps = measureWithGaps();
  function measureStartGap() {
    if (!withEdgeGap) return 0;
    const slideRect = slideRects[0];
    return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
  }
  function measureEndGap() {
    if (!withEdgeGap) return 0;
    const style = ownerWindow.getComputedStyle(arrayLast(slides));
    return parseFloat(style.getPropertyValue(`margin-${endEdge}`));
  }
  function measureWithGaps() {
    return slideRects.map((rect, index, rects) => {
      const isFirst = !index;
      const isLast = arrayIsLastIndex(rects, index);
      if (isFirst) return slideSizes[index] + startGap;
      if (isLast) return slideSizes[index] + endGap;
      return rects[index + 1][startEdge] - rect[startEdge];
    }).map(mathAbs);
  }
  const self = {
    slideSizes: slideSizes,
    slideSizesWithGaps: slideSizesWithGaps,
    startGap: startGap,
    endGap: endGap
  };
  return self;
}

function SlidesToScroll(axis, viewSize, slidesToScroll, loop, containerRect, slideRects, startGap, endGap, pixelTolerance) {
  const {startEdge: startEdge, endEdge: endEdge, direction: direction} = axis;
  const groupByNumber = isNumber(slidesToScroll);
  function byNumber(array, groupSize) {
    return arrayKeys(array).filter(i => i % groupSize === 0).map(i => array.slice(i, i + groupSize));
  }
  function bySize(array) {
    if (!array.length) return [];
    return arrayKeys(array).reduce((groups, rectB, index) => {
      const rectA = arrayLast(groups) || 0;
      const isFirst = rectA === 0;
      const isLast = rectB === arrayLastIndex(array);
      const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge];
      const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge];
      const gapA = !loop && isFirst ? direction(startGap) : 0;
      const gapB = !loop && isLast ? direction(endGap) : 0;
      const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA));
      if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB);
      if (isLast) groups.push(array.length);
      return groups;
    }, []).map((currentSize, index, groups) => {
      const previousSize = Math.max(groups[index - 1] || 0);
      return array.slice(previousSize, currentSize);
    });
  }
  function groupSlides(array) {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array);
  }
  const self = {
    groupSlides: groupSlides
  };
  return self;
}

function Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler) {
  const {align: align, axis: scrollAxis, direction: direction, startIndex: startIndex, loop: loop, duration: duration, dragFree: dragFree, dragThreshold: dragThreshold, inViewThreshold: inViewThreshold, slidesToScroll: groupSlides, skipSnaps: skipSnaps, containScroll: containScroll, watchResize: watchResize, watchSlides: watchSlides, watchDrag: watchDrag, watchFocus: watchFocus} = options;
  const pixelTolerance = 2;
  const nodeRects = NodeRects();
  const containerRect = nodeRects.measure(container);
  const slideRects = slides.map(nodeRects.measure);
  const axis = Axis(scrollAxis, direction);
  const viewSize = axis.measureSize(containerRect);
  const percentOfView = PercentOfView(viewSize);
  const alignment = Alignment(align, viewSize);
  const containSnaps = !loop && !!containScroll;
  const readEdgeGap = loop || !!containScroll;
  const {slideSizes: slideSizes, slideSizesWithGaps: slideSizesWithGaps, startGap: startGap, endGap: endGap} = SlideSizes(axis, containerRect, slideRects, slides, readEdgeGap, ownerWindow);
  const slidesToScroll = SlidesToScroll(axis, viewSize, groupSlides, loop, containerRect, slideRects, startGap, endGap, pixelTolerance);
  const {snaps: snaps, snapsAligned: snapsAligned} = ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll);
  const contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
  const {snapsContained: snapsContained, scrollContainLimit: scrollContainLimit} = ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance);
  const scrollSnaps = containSnaps ? snapsContained : snapsAligned;
  const {limit: limit} = ScrollLimit(contentSize, scrollSnaps, loop);
  const index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
  const indexPrevious = index.clone();
  const slideIndexes = arrayKeys(slides);
  const update = ({dragHandler: dragHandler, scrollBody: scrollBody, scrollBounds: scrollBounds, options: {loop: loop}}) => {
    if (!loop) scrollBounds.constrain(dragHandler.pointerDown());
    scrollBody.seek();
  };
  const render = ({scrollBody: scrollBody, translate: translate, location: location, offsetLocation: offsetLocation, previousLocation: previousLocation, scrollLooper: scrollLooper, slideLooper: slideLooper, dragHandler: dragHandler, animation: animation, eventHandler: eventHandler, scrollBounds: scrollBounds, options: {loop: loop}}, alpha) => {
    const shouldSettle = scrollBody.settled();
    const withinBounds = !scrollBounds.shouldConstrain();
    const hasSettled = loop ? shouldSettle : shouldSettle && withinBounds;
    const hasSettledAndIdle = hasSettled && !dragHandler.pointerDown();
    if (hasSettledAndIdle) animation.stop();
    const interpolatedLocation = location.get() * alpha + previousLocation.get() * (1 - alpha);
    offsetLocation.set(interpolatedLocation);
    if (loop) {
      scrollLooper.loop(scrollBody.direction());
      slideLooper.loop();
    }
    translate.to(offsetLocation.get());
    if (hasSettledAndIdle) eventHandler.emit("settle");
    if (!hasSettled) eventHandler.emit("scroll");
  };
  const animation = Animations(ownerDocument, ownerWindow, () => update(engine), alpha => render(engine, alpha));
  const friction = .68;
  const startLocation = scrollSnaps[index.get()];
  const location = Vector1D(startLocation);
  const previousLocation = Vector1D(startLocation);
  const offsetLocation = Vector1D(startLocation);
  const target = Vector1D(startLocation);
  const scrollBody = ScrollBody(location, offsetLocation, previousLocation, target, duration, friction);
  const scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);
  const scrollTo = ScrollTo(animation, index, indexPrevious, scrollBody, scrollTarget, target, eventHandler);
  const scrollProgress = ScrollProgress(limit);
  const eventStore = EventStore();
  const slidesInView = SlidesInView(container, slides, eventHandler, inViewThreshold);
  const {slideRegistry: slideRegistry} = SlideRegistry(containSnaps, containScroll, scrollSnaps, scrollContainLimit, slidesToScroll, slideIndexes);
  const slideFocus = SlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore, eventHandler, watchFocus);
  const engine = {
    ownerDocument: ownerDocument,
    ownerWindow: ownerWindow,
    eventHandler: eventHandler,
    containerRect: containerRect,
    slideRects: slideRects,
    animation: animation,
    axis: axis,
    dragHandler: DragHandler(axis, root, ownerDocument, ownerWindow, target, DragTracker(axis, ownerWindow), location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, dragFree, dragThreshold, skipSnaps, friction, watchDrag),
    eventStore: eventStore,
    percentOfView: percentOfView,
    index: index,
    indexPrevious: indexPrevious,
    limit: limit,
    location: location,
    offsetLocation: offsetLocation,
    previousLocation: previousLocation,
    options: options,
    resizeHandler: ResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects),
    scrollBody: scrollBody,
    scrollBounds: ScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
    scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [ location, offsetLocation, previousLocation, target ]),
    scrollProgress: scrollProgress,
    scrollSnapList: scrollSnaps.map(scrollProgress.get),
    scrollSnaps: scrollSnaps,
    scrollTarget: scrollTarget,
    scrollTo: scrollTo,
    slideLooper: SlideLooper(axis, viewSize, contentSize, slideSizes, slideSizesWithGaps, snaps, scrollSnaps, offsetLocation, slides),
    slideFocus: slideFocus,
    slidesHandler: SlidesHandler(container, eventHandler, watchSlides),
    slidesInView: slidesInView,
    slideIndexes: slideIndexes,
    slideRegistry: slideRegistry,
    slidesToScroll: slidesToScroll,
    target: target,
    translate: Translate(axis, container)
  };
  return engine;
}

function EventHandler() {
  let listeners = {};
  let api;
  function init(emblaApi) {
    api = emblaApi;
  }
  function getListeners(evt) {
    return listeners[evt] || [];
  }
  function emit(evt) {
    getListeners(evt).forEach(e => e(api, evt));
    return self;
  }
  function on(evt, cb) {
    listeners[evt] = getListeners(evt).concat([ cb ]);
    return self;
  }
  function off(evt, cb) {
    listeners[evt] = getListeners(evt).filter(e => e !== cb);
    return self;
  }
  function clear() {
    listeners = {};
  }
  const self = {
    init: init,
    emit: emit,
    off: off,
    on: on,
    clear: clear
  };
  return self;
}

const defaultOptions$1 = {
  align: "center",
  axis: "x",
  container: null,
  slides: null,
  containScroll: "trimSnaps",
  direction: "ltr",
  slidesToScroll: 1,
  inViewThreshold: 0,
  breakpoints: {},
  dragFree: false,
  dragThreshold: 10,
  loop: false,
  skipSnaps: false,
  duration: 25,
  startIndex: 0,
  active: true,
  watchDrag: true,
  watchResize: true,
  watchSlides: true,
  watchFocus: true
};

function OptionsHandler(ownerWindow) {
  function mergeOptions(optionsA, optionsB) {
    return objectsMergeDeep(optionsA, optionsB || {});
  }
  function optionsAtMedia(options) {
    const optionsAtMedia = options.breakpoints || {};
    const matchedMediaOptions = objectKeys(optionsAtMedia).filter(media => ownerWindow.matchMedia(media).matches).map(media => optionsAtMedia[media]).reduce((a, mediaOption) => mergeOptions(a, mediaOption), {});
    return mergeOptions(options, matchedMediaOptions);
  }
  function optionsMediaQueries(optionsList) {
    return optionsList.map(options => objectKeys(options.breakpoints || {})).reduce((acc, mediaQueries) => acc.concat(mediaQueries), []).map(ownerWindow.matchMedia);
  }
  const self = {
    mergeOptions: mergeOptions,
    optionsAtMedia: optionsAtMedia,
    optionsMediaQueries: optionsMediaQueries
  };
  return self;
}

function PluginsHandler(optionsHandler) {
  let activePlugins = [];
  function init(emblaApi, plugins) {
    activePlugins = plugins.filter(({options: options}) => optionsHandler.optionsAtMedia(options).active !== false);
    activePlugins.forEach(plugin => plugin.init(emblaApi, optionsHandler));
    return plugins.reduce((map, plugin) => Object.assign(map, {
      [plugin.name]: plugin
    }), {});
  }
  function destroy() {
    activePlugins = activePlugins.filter(plugin => plugin.destroy());
  }
  const self = {
    init: init,
    destroy: destroy
  };
  return self;
}

function EmblaCarousel(root, userOptions, userPlugins) {
  const ownerDocument = root.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const optionsHandler = OptionsHandler(ownerWindow);
  const pluginsHandler = PluginsHandler(optionsHandler);
  const mediaHandlers = EventStore();
  const eventHandler = EventHandler();
  const {mergeOptions: mergeOptions, optionsAtMedia: optionsAtMedia, optionsMediaQueries: optionsMediaQueries} = optionsHandler;
  const {on: on, off: off, emit: emit} = eventHandler;
  const reInit = reActivate;
  let destroyed = false;
  let engine;
  let optionsBase = mergeOptions(defaultOptions$1, EmblaCarousel.globalOptions);
  let options = mergeOptions(optionsBase);
  let pluginList = [];
  let pluginApis;
  let container;
  let slides;
  function storeElements() {
    const {container: userContainer, slides: userSlides} = options;
    const customContainer = isString(userContainer) ? root.querySelector(userContainer) : userContainer;
    container = customContainer || root.children[0];
    const customSlides = isString(userSlides) ? container.querySelectorAll(userSlides) : userSlides;
    slides = [].slice.call(customSlides || container.children);
  }
  function createEngine(options) {
    const engine = Engine(root, container, slides, ownerDocument, ownerWindow, options, eventHandler);
    if (options.loop && !engine.slideLooper.canLoop()) {
      const optionsWithoutLoop = Object.assign({}, options, {
        loop: false
      });
      return createEngine(optionsWithoutLoop);
    }
    return engine;
  }
  function activate(withOptions, withPlugins) {
    if (destroyed) return;
    optionsBase = mergeOptions(optionsBase, withOptions);
    options = optionsAtMedia(optionsBase);
    pluginList = withPlugins || pluginList;
    storeElements();
    engine = createEngine(options);
    optionsMediaQueries([ optionsBase, ...pluginList.map(({options: options}) => options) ]).forEach(query => mediaHandlers.add(query, "change", reActivate));
    if (!options.active) return;
    engine.translate.to(engine.location.get());
    engine.animation.init();
    engine.slidesInView.init();
    engine.slideFocus.init(self);
    engine.eventHandler.init(self);
    engine.resizeHandler.init(self);
    engine.slidesHandler.init(self);
    if (engine.options.loop) engine.slideLooper.loop();
    if (container.offsetParent && slides.length) engine.dragHandler.init(self);
    pluginApis = pluginsHandler.init(self, pluginList);
  }
  function reActivate(withOptions, withPlugins) {
    const startIndex = selectedScrollSnap();
    deActivate();
    activate(mergeOptions({
      startIndex: startIndex
    }, withOptions), withPlugins);
    eventHandler.emit("reInit");
  }
  function deActivate() {
    engine.dragHandler.destroy();
    engine.eventStore.clear();
    engine.translate.clear();
    engine.slideLooper.clear();
    engine.resizeHandler.destroy();
    engine.slidesHandler.destroy();
    engine.slidesInView.destroy();
    engine.animation.destroy();
    pluginsHandler.destroy();
    mediaHandlers.clear();
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    mediaHandlers.clear();
    deActivate();
    eventHandler.emit("destroy");
    eventHandler.clear();
  }
  function scrollTo(index, jump, direction) {
    if (!options.active || destroyed) return;
    engine.scrollBody.useBaseFriction().useDuration(jump === true ? 0 : options.duration);
    engine.scrollTo.index(index, direction || 0);
  }
  function scrollNext(jump) {
    const next = engine.index.add(1).get();
    scrollTo(next, jump, -1);
  }
  function scrollPrev(jump) {
    const prev = engine.index.add(-1).get();
    scrollTo(prev, jump, 1);
  }
  function canScrollNext() {
    const next = engine.index.add(1).get();
    return next !== selectedScrollSnap();
  }
  function canScrollPrev() {
    const prev = engine.index.add(-1).get();
    return prev !== selectedScrollSnap();
  }
  function scrollSnapList() {
    return engine.scrollSnapList;
  }
  function scrollProgress() {
    return engine.scrollProgress.get(engine.offsetLocation.get());
  }
  function selectedScrollSnap() {
    return engine.index.get();
  }
  function previousScrollSnap() {
    return engine.indexPrevious.get();
  }
  function slidesInView() {
    return engine.slidesInView.get();
  }
  function slidesNotInView() {
    return engine.slidesInView.get(false);
  }
  function plugins() {
    return pluginApis;
  }
  function internalEngine() {
    return engine;
  }
  function rootNode() {
    return root;
  }
  function containerNode() {
    return container;
  }
  function slideNodes() {
    return slides;
  }
  const self = {
    canScrollNext: canScrollNext,
    canScrollPrev: canScrollPrev,
    containerNode: containerNode,
    internalEngine: internalEngine,
    destroy: destroy,
    off: off,
    on: on,
    emit: emit,
    plugins: plugins,
    previousScrollSnap: previousScrollSnap,
    reInit: reInit,
    rootNode: rootNode,
    scrollNext: scrollNext,
    scrollPrev: scrollPrev,
    scrollProgress: scrollProgress,
    scrollSnapList: scrollSnapList,
    scrollTo: scrollTo,
    selectedScrollSnap: selectedScrollSnap,
    slideNodes: slideNodes,
    slidesInView: slidesInView,
    slidesNotInView: slidesNotInView
  };
  activate(userOptions, userPlugins);
  setTimeout(() => eventHandler.emit("init"), 0);
  return self;
}

EmblaCarousel.globalOptions = undefined;

const defaultOptions = {
  active: true,
  breakpoints: {},
  delay: 4e3,
  jump: false,
  playOnInit: true,
  stopOnFocusIn: true,
  stopOnInteraction: true,
  stopOnMouseEnter: false,
  stopOnLastSnap: false,
  rootNode: null
};

function normalizeDelay(emblaApi, delay) {
  const scrollSnaps = emblaApi.scrollSnapList();
  if (typeof delay === "number") {
    return scrollSnaps.map(() => delay);
  }
  return delay(scrollSnaps, emblaApi);
}

function getAutoplayRootNode(emblaApi, rootNode) {
  const emblaRootNode = emblaApi.rootNode();
  return rootNode && rootNode(emblaRootNode) || emblaRootNode;
}

function Autoplay(userOptions = {}) {
  let options;
  let emblaApi;
  let destroyed;
  let delay;
  let timerStartTime = null;
  let timerId = 0;
  let autoplayActive = false;
  let mouseIsOver = false;
  let playOnDocumentVisible = false;
  let jump = false;
  function init(emblaApiInstance, optionsHandler) {
    emblaApi = emblaApiInstance;
    const {mergeOptions: mergeOptions, optionsAtMedia: optionsAtMedia} = optionsHandler;
    const optionsBase = mergeOptions(defaultOptions, Autoplay.globalOptions);
    const allOptions = mergeOptions(optionsBase, userOptions);
    options = optionsAtMedia(allOptions);
    if (emblaApi.scrollSnapList().length <= 1) return;
    jump = options.jump;
    destroyed = false;
    delay = normalizeDelay(emblaApi, options.delay);
    const {eventStore: eventStore, ownerDocument: ownerDocument} = emblaApi.internalEngine();
    const isDraggable = !!emblaApi.internalEngine().options.watchDrag;
    const root = getAutoplayRootNode(emblaApi, options.rootNode);
    eventStore.add(ownerDocument, "visibilitychange", visibilityChange);
    if (isDraggable) {
      emblaApi.on("pointerDown", pointerDown);
    }
    if (isDraggable && !options.stopOnInteraction) {
      emblaApi.on("pointerUp", pointerUp);
    }
    if (options.stopOnMouseEnter) {
      eventStore.add(root, "mouseenter", mouseEnter);
    }
    if (options.stopOnMouseEnter && !options.stopOnInteraction) {
      eventStore.add(root, "mouseleave", mouseLeave);
    }
    if (options.stopOnFocusIn) {
      emblaApi.on("slideFocusStart", stopAutoplay);
    }
    if (options.stopOnFocusIn && !options.stopOnInteraction) {
      eventStore.add(emblaApi.containerNode(), "focusout", startAutoplay);
    }
    if (options.playOnInit) startAutoplay();
  }
  function destroy() {
    emblaApi.off("pointerDown", pointerDown).off("pointerUp", pointerUp).off("slideFocusStart", stopAutoplay);
    stopAutoplay();
    destroyed = true;
    autoplayActive = false;
  }
  function setTimer() {
    const {ownerWindow: ownerWindow} = emblaApi.internalEngine();
    ownerWindow.clearTimeout(timerId);
    timerId = ownerWindow.setTimeout(next, delay[emblaApi.selectedScrollSnap()]);
    timerStartTime = (new Date).getTime();
    emblaApi.emit("autoplay:timerset");
  }
  function clearTimer() {
    const {ownerWindow: ownerWindow} = emblaApi.internalEngine();
    ownerWindow.clearTimeout(timerId);
    timerId = 0;
    timerStartTime = null;
    emblaApi.emit("autoplay:timerstopped");
  }
  function startAutoplay() {
    if (destroyed) return;
    if (documentIsHidden()) {
      playOnDocumentVisible = true;
      return;
    }
    if (!autoplayActive) emblaApi.emit("autoplay:play");
    setTimer();
    autoplayActive = true;
  }
  function stopAutoplay() {
    if (destroyed) return;
    if (autoplayActive) emblaApi.emit("autoplay:stop");
    clearTimer();
    autoplayActive = false;
  }
  function visibilityChange() {
    if (documentIsHidden()) {
      playOnDocumentVisible = autoplayActive;
      return stopAutoplay();
    }
    if (playOnDocumentVisible) startAutoplay();
  }
  function documentIsHidden() {
    const {ownerDocument: ownerDocument} = emblaApi.internalEngine();
    return ownerDocument.visibilityState === "hidden";
  }
  function pointerDown() {
    if (!mouseIsOver) stopAutoplay();
  }
  function pointerUp() {
    if (!mouseIsOver) startAutoplay();
  }
  function mouseEnter() {
    mouseIsOver = true;
    stopAutoplay();
  }
  function mouseLeave() {
    mouseIsOver = false;
    startAutoplay();
  }
  function play(jumpOverride) {
    if (typeof jumpOverride !== "undefined") jump = jumpOverride;
    startAutoplay();
  }
  function stop() {
    if (autoplayActive) stopAutoplay();
  }
  function reset() {
    if (autoplayActive) startAutoplay();
  }
  function isPlaying() {
    return autoplayActive;
  }
  function next() {
    const {index: index} = emblaApi.internalEngine();
    const nextIndex = index.clone().add(1).get();
    const lastIndex = emblaApi.scrollSnapList().length - 1;
    const kill = options.stopOnLastSnap && nextIndex === lastIndex;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext(jump);
    } else {
      emblaApi.scrollTo(0, jump);
    }
    emblaApi.emit("autoplay:select");
    if (kill) return stopAutoplay();
    startAutoplay();
  }
  function timeUntilNext() {
    if (!timerStartTime) return null;
    const currentDelay = delay[emblaApi.selectedScrollSnap()];
    const timePastSinceStart = (new Date).getTime() - timerStartTime;
    return currentDelay - timePastSinceStart;
  }
  const self = {
    name: "autoplay",
    options: userOptions,
    init: init,
    destroy: destroy,
    play: play,
    stop: stop,
    reset: reset,
    isPlaying: isPlaying,
    timeUntilNext: timeUntilNext
  };
  return self;
}

Autoplay.globalOptions = undefined;

class CarouselController extends Controller {
  static targets=[ "viewport", "prevButton", "nextButton", "container" ];
  static values={
    orientation: {
      type: String,
      default: "horizontal"
    },
    opts: {
      type: Object,
      default: {}
    },
    plugins: {
      type: Array,
      default: []
    }
  };
  connect() {
    this.initializeCarousel();
  }
  disconnect() {
    if (this.emblaApi) {
      this.emblaApi.destroy();
    }
  }
  initializeCarousel() {
    if (!this.hasViewportTarget) {
      console.error("Carousel: viewport target not found");
      return;
    }
    this.applyOrientationClasses();
    const options = {
      ...this.optsValue,
      axis: this.orientationValue === "vertical" ? "y" : "x"
    };
    const plugins = this.buildPlugins();
    this.emblaApi = EmblaCarousel(this.viewportTarget, options, plugins);
    this.setupButtonStates();
    this.emblaApi.on("select", () => this.updateButtonStates());
    this.emblaApi.on("reInit", () => this.updateButtonStates());
    this.element.dispatchEvent(new CustomEvent("carousel:init", {
      detail: {
        api: this.emblaApi
      },
      bubbles: true
    }));
  }
  buildPlugins() {
    const plugins = [];
    this.pluginsValue.forEach(pluginConfig => {
      if (pluginConfig.name === "autoplay") {
        plugins.push(Autoplay(pluginConfig.options || {}));
      }
    });
    return plugins;
  }
  applyOrientationClasses() {
    if (!this.hasContainerTarget) {
      console.error("Carousel: container target not found");
      return;
    }
    const items = this.element.querySelectorAll('[role="group"]');
    if (this.orientationValue === "vertical") {
      this.containerTarget.classList.add("flex-col");
      this.containerTarget.classList.remove("-ml-4", "-ml-1", "-ml-2", "-ml-3");
      items.forEach(item => {
        item.classList.remove("pl-4", "pl-1", "pl-2", "pl-3");
      });
      if (this.hasPrevButtonTarget) {
        this.prevButtonTarget.classList.remove("top-1/2", "-translate-y-1/2", "-left-12", "rounded-lg", "border-0");
        this.prevButtonTarget.classList.add("left-1/2", "-translate-x-1/2", "-top-12", "rotate-90", "rounded-full", "border", "border-input");
      }
      if (this.hasNextButtonTarget) {
        this.nextButtonTarget.classList.remove("top-1/2", "-translate-y-1/2", "-right-12", "rounded-lg", "border-0");
        this.nextButtonTarget.classList.add("left-1/2", "-translate-x-1/2", "-bottom-12", "rotate-90", "rounded-full", "border", "border-input");
      }
    } else {
      this.containerTarget.classList.remove("flex-col");
      items.forEach(item => {
        const hasPadding = Array.from(item.classList).some(cls => /^pl-\d+$/.test(cls));
        if (!hasPadding) {
          item.classList.add("pl-4");
        }
      });
      if (this.hasPrevButtonTarget) {
        this.prevButtonTarget.classList.remove("left-1/2", "-translate-x-1/2", "-top-12", "rotate-90", "rounded-full", "border", "border-input");
        if (!this.prevButtonTarget.classList.contains("top-1/2")) {
          this.prevButtonTarget.classList.add("top-1/2", "-translate-y-1/2", "-left-12", "rounded-lg", "border-0");
        }
      }
      if (this.hasNextButtonTarget) {
        this.nextButtonTarget.classList.remove("left-1/2", "-translate-x-1/2", "-bottom-12", "rotate-90", "rounded-full", "border", "border-input");
        if (!this.nextButtonTarget.classList.contains("top-1/2")) {
          this.nextButtonTarget.classList.add("top-1/2", "-translate-y-1/2", "-right-12", "rounded-lg", "border-0");
        }
      }
    }
  }
  setupButtonStates() {
    this.updateButtonStates();
  }
  updateButtonStates() {
    if (!this.emblaApi) return;
    if (this.hasPrevButtonTarget) {
      const canScrollPrev = this.emblaApi.canScrollPrev();
      this.prevButtonTarget.disabled = !canScrollPrev;
      this.prevButtonTarget.classList.toggle("opacity-50", !canScrollPrev);
      this.prevButtonTarget.classList.toggle("cursor-not-allowed", !canScrollPrev);
    }
    if (this.hasNextButtonTarget) {
      const canScrollNext = this.emblaApi.canScrollNext();
      this.nextButtonTarget.disabled = !canScrollNext;
      this.nextButtonTarget.classList.toggle("opacity-50", !canScrollNext);
      this.nextButtonTarget.classList.toggle("cursor-not-allowed", !canScrollNext);
    }
  }
  scrollPrev() {
    if (this.emblaApi) {
      this.emblaApi.scrollPrev();
    }
  }
  scrollNext() {
    if (this.emblaApi) {
      this.emblaApi.scrollNext();
    }
  }
  getApi() {
    return this.emblaApi;
  }
  keydown(event) {
    if (this.orientationValue === "horizontal") {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        this.scrollNext();
      }
    } else {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.scrollPrev();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        this.scrollNext();
      }
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
    "ui--drawer": DrawerController,
    "ui--checkbox": CheckboxController,
    "ui--collapsible": CollapsibleController,
    "ui--combobox": ComboboxController,
    "ui--command": CommandController,
    "ui--command-dialog": CommandDialogController,
    "ui--context-menu": ContextMenuController,
    "ui--hover-card": HoverCardController,
    "ui--input-otp": InputOtpController,
    "ui--tooltip": TooltipController,
    "ui--popover": PopoverController,
    "ui--responsive-dialog": ResponsiveDialogController,
    "ui--scroll-area": ScrollAreaController,
    "ui--select": SelectController,
    "ui--slider": SliderController,
    "ui--switch": SwitchController,
    "ui--tabs": TabsController,
    "ui--toggle": ToggleController,
    "ui--toggle-group": ToggleGroupController,
    "ui--carousel": CarouselController
  });
}

export { AccordionController, AlertDialogController, AvatarController, CarouselController, CheckboxController, CollapsibleController, ComboboxController, CommandController, CommandDialogController, ContextMenuController, DialogController, DrawerController, DropdownController, HelloController, HoverCardController, InputOtpController, PopoverController, ResponsiveDialogController, ScrollAreaController, SelectController, SliderController, SwitchController, TabsController, ToggleController, ToggleGroupController, TooltipController, registerControllers, registerControllersInto, version };
