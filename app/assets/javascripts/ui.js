(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("@hotwired/stimulus")) : typeof define === "function" && define.amd ? define([ "exports", "@hotwired/stimulus" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.UI = {}, global.Stimulus));
})(this, function(exports, stimulus) {
  "use strict";
  class HelloController extends stimulus.Controller {
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
  const arrow$1 = options => ({
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
  const arrow = arrow$1;
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
  function getFocusableItems(container, currentMenu = null) {
    if (!currentMenu) {
      const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
      const currentItem = Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
      if (currentItem) {
        currentMenu = currentItem.closest('[role="menu"]');
      }
    }
    if (!currentMenu) return [];
    const items = [];
    Array.from(currentMenu.children).forEach(child => {
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
      } else if (child.classList && child.classList.contains("relative")) {
        const trigger = child.querySelector(':scope > [role="menuitem"]');
        if (trigger && !trigger.hasAttribute("data-disabled")) {
          items.push(trigger);
        }
      }
    });
    return items;
  }
  function findCurrentItemIndex(items) {
    const currentItem = items.find(item => item.getAttribute("tabindex") === "0");
    return currentItem ? items.indexOf(currentItem) : -1;
  }
  function focusItem(items, index, container) {
    if (items.length === 0 || index < 0 || index >= items.length) return;
    const allMenuItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allMenuItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
    const targetItem = items[index];
    targetItem.setAttribute("tabindex", "0");
    targetItem.focus();
    return targetItem;
  }
  function focusNextItem(items, container, loop = true) {
    if (items.length === 0) return null;
    let currentIndex = findCurrentItemIndex(items);
    if (currentIndex === -1 || currentIndex >= items.length - 1) {
      if (loop) {
        return focusItem(items, 0, container);
      }
      return null;
    }
    return focusItem(items, currentIndex + 1, container);
  }
  function focusPreviousItem(items, container, loop = true) {
    if (items.length === 0) return null;
    let currentIndex = findCurrentItemIndex(items);
    if (currentIndex === -1 || currentIndex === 0) {
      if (loop) {
        return focusItem(items, items.length - 1, container);
      }
      return null;
    }
    return focusItem(items, currentIndex - 1, container);
  }
  function hasSubmenu(menuItem) {
    if (!menuItem) return false;
    const nextSibling = menuItem.nextElementSibling;
    return nextSibling && nextSibling.getAttribute("role") === "menu";
  }
  function openSubmenu(trigger, submenu) {
    if (!submenu || submenu.getAttribute("role") !== "menu") return;
    submenu.classList.remove("hidden");
    submenu.setAttribute("data-state", "open");
    trigger.setAttribute("data-state", "open");
    positionSubmenu(trigger, submenu);
  }
  function closeSubmenu(submenu, trigger) {
    if (!submenu) return;
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
    if (trigger) {
      trigger.setAttribute("data-state", "closed");
    }
  }
  function closeAllSubmenus(container) {
    const submenus = container.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]');
    submenus.forEach(submenu => {
      submenu.classList.add("hidden");
      submenu.setAttribute("data-state", "closed");
      const trigger = submenu.previousElementSibling;
      if (trigger) {
        trigger.setAttribute("data-state", "closed");
      }
    });
  }
  function positionDropdown(trigger, content, options = {}) {
    const {placement: placement = "bottom-start", offsetValue: offsetValue = 4, flipEnabled: flipEnabled = true} = options;
    const middleware = [];
    if (offsetValue > 0) {
      middleware.push(offset(offsetValue));
    }
    if (flipEnabled) {
      middleware.push(flip());
    }
    middleware.push(shift({
      padding: 8
    }));
    return computePosition(trigger, content, {
      placement: placement,
      middleware: middleware,
      strategy: "absolute"
    }).then(({x: x, y: y, placement: finalPlacement}) => {
      Object.assign(content.style, {
        left: `${x}px`,
        top: `${y}px`
      });
      const [side, align] = finalPlacement.split("-");
      content.setAttribute("data-side", side);
      content.setAttribute("data-align", align || "center");
    });
  }
  function positionSubmenu(trigger, submenu) {
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
  function clearAllTabindexes(container) {
    const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    allItems.forEach(item => {
      item.setAttribute("tabindex", "-1");
    });
  }
  function getKeyboardFocusedItem(container) {
    const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    return Array.from(allItems).find(item => item.getAttribute("tabindex") === "0") || null;
  }
  class DropdownController extends stimulus.Controller {
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
      },
      strategy: {
        type: String,
        default: "fixed"
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
      this.boundHandleFocusOut = this.handleFocusOut.bind(this);
      document.addEventListener("click", this.boundHandleClickOutside);
      this.element.addEventListener("focusout", this.boundHandleFocusOut);
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
      this.element.removeEventListener("focusout", this.boundHandleFocusOut);
    }
    handleFocusOut(event) {
      if (!this.openValue) return;
      setTimeout(() => {
        const newFocusedElement = document.activeElement;
        if (!this.element.contains(newFocusedElement)) {
          this.close({
            returnFocus: false
          });
        }
      }, 0);
    }
    openSubmenuHandler(event) {
      const trigger = event.currentTarget;
      const submenu = trigger.nextElementSibling;
      if (document.activeElement && document.activeElement.hasAttribute("role") && document.activeElement.getAttribute("role") === "menuitem") {
        document.activeElement.blur();
      }
      clearAllTabindexes(this.element);
      trigger.setAttribute("tabindex", "0");
      this.lastHoveredItem = trigger;
      if (this.closeSubmenuTimeouts.has(trigger)) {
        clearTimeout(this.closeSubmenuTimeouts.get(trigger));
        this.closeSubmenuTimeouts.delete(trigger);
      }
      if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
        this.closeSiblingSubmenus(trigger);
        openSubmenu(trigger, submenu);
        this.focusFirstCommandItem(submenu);
      }
    }
    openSubmenu(event) {
      return this.openSubmenuHandler(event);
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
      clearAllTabindexes(this.element);
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
    closeSubmenuHandler(event) {
      const trigger = event.currentTarget;
      const submenu = trigger.nextElementSibling;
      const relatedTarget = event.relatedTarget;
      if (relatedTarget && submenu && submenu.contains(relatedTarget)) {
        return;
      }
      const timeoutId = setTimeout(() => {
        if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
          closeSubmenu(submenu, trigger);
        }
        this.closeSubmenuTimeouts.delete(trigger);
      }, 300);
      this.closeSubmenuTimeouts.set(trigger, timeoutId);
    }
    closeSubmenu(event) {
      return this.closeSubmenuHandler(event);
    }
    closeSiblingSubmenus(currentTrigger) {
      const parentMenu = currentTrigger.closest('[role="menu"]');
      if (!parentMenu) return;
      const siblingTriggers = Array.from(parentMenu.children).filter(child => child !== currentTrigger && child.hasAttribute("data-dropdown-target") && child.getAttribute("data-dropdown-target").includes("item"));
      siblingTriggers.forEach(sibling => {
        const siblingSubmenu = sibling.nextElementSibling;
        if (siblingSubmenu && siblingSubmenu.hasAttribute("role") && siblingSubmenu.getAttribute("role") === "menu") {
          closeSubmenu(siblingSubmenu, sibling);
        }
      });
    }
    closeAllSubmenusHandler() {
      closeAllSubmenus(this.element);
    }
    closeAllSubmenus() {
      return this.closeAllSubmenusHandler();
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
      closeAllSubmenus(this.element);
      clearAllTabindexes(this.element);
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
          this.focusTrigger();
        }, 0);
      }
      this.shouldReturnFocusToTrigger = false;
    }
    focusTrigger() {
      if (!this.triggerTarget) return;
      const isFocusable = this.triggerTarget.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (isFocusable) {
        this.triggerTarget.focus();
      } else {
        const focusableChild = this.triggerTarget.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableChild) {
          focusableChild.focus();
        }
      }
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
        if (focusedElement && hasSubmenu(focusedElement)) {
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
          this.close({
            returnFocus: true
          });
        }
        break;

       case "Enter":
        event.preventDefault();
        const enterTarget = getKeyboardFocusedItem(this.element) || focusedElement;
        if (enterTarget && enterTarget.hasAttribute("role")) {
          const role = enterTarget.getAttribute("role");
          if (role === "menuitem") {
            if (hasSubmenu(enterTarget)) {
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
        const spaceTarget = getKeyboardFocusedItem(this.element) || focusedElement;
        if (spaceTarget && spaceTarget.hasAttribute("role")) {
          const role = spaceTarget.getAttribute("role");
          if (role === "menuitem") {
            if (hasSubmenu(spaceTarget)) {
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
      const currentMenu = this.getCurrentMenu();
      return getFocusableItems(this.element, currentMenu);
    }
    getCurrentMenu() {
      const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
      const currentItem = Array.from(allItems).find(item => item.getAttribute("tabindex") === "0");
      if (currentItem) {
        return currentItem.closest('[role="menu"]');
      }
      return this.hasMenuTarget ? this.menuTarget : this.contentTarget;
    }
    focusNextItem(items = null) {
      items = items || this.getFocusableItems();
      if (items.length === 0) return;
      const result = focusNextItem(items, this.element, true);
      if (result) {
        this.lastHoveredItem = result;
      }
    }
    focusPreviousItem(items = null) {
      items = items || this.getFocusableItems();
      if (items.length === 0) return;
      const result = focusPreviousItem(items, this.element, true);
      if (result) {
        this.lastHoveredItem = result;
      }
    }
    focusItem(index, items = null) {
      items = this.getFocusableItems();
      if (items.length === 0 || index < 0 || index >= items.length) {
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
            closeSubmenu(submenu, trigger);
          }
        });
      }
      const targetItem = focusItem(items, index, this.element);
      if (targetItem) {
        this.lastHoveredItem = targetItem;
      }
    }
    openSubmenuWithKeyboard(trigger) {
      const submenu = trigger.nextElementSibling;
      if (submenu && submenu.hasAttribute("role") && submenu.getAttribute("role") === "menu") {
        this.closeSiblingSubmenus(trigger);
        openSubmenu(trigger, submenu);
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
        clearAllTabindexes(this.element);
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
        closeSubmenu(parentMenu, trigger);
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
      closeSubmenu(submenu, trigger);
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
      content.style.setProperty("--ui-dropdown-menu-trigger-width", `${trigger.offsetWidth}px`);
      const update = () => {
        computePosition(trigger, content, {
          placement: this.placementValue,
          middleware: middleware,
          strategy: this.strategyValue
        }).then(({x: x, y: y, placement: placement, middlewareData: middlewareData}) => {
          content.style.setProperty("--ui-dropdown-menu-trigger-width", `${trigger.offsetWidth}px`);
          Object.assign(content.style, {
            position: this.strategyValue,
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
  function setState(element, state, options = {}) {
    if (!element) return;
    element.setAttribute("data-state", state);
    if (options.ariaAttribute) {
      const ariaValue = options.ariaValue !== undefined ? options.ariaValue : state === "open" || state === "checked" || state === "on";
      element.setAttribute(options.ariaAttribute, ariaValue.toString());
    }
  }
  function syncCheckedState(element, checked, options = {}) {
    const state = checked ? "checked" : "unchecked";
    setState(element, state, {
      ariaAttribute: "aria-checked",
      ariaValue: checked
    });
    if (options.additionalTargets) {
      options.additionalTargets.forEach(target => {
        if (target) {
          setState(target, state);
        }
      });
    }
  }
  function syncPressedState(element, pressed, options = {}) {
    const state = options.useOnOff ? pressed ? "on" : "off" : pressed ? "pressed" : "unpressed";
    setState(element, state, {
      ariaAttribute: "aria-pressed",
      ariaValue: pressed
    });
  }
  function syncExpandedState(trigger, content, expanded) {
    const state = expanded ? "open" : "closed";
    if (trigger) {
      setState(trigger, state, {
        ariaAttribute: "aria-expanded",
        ariaValue: expanded
      });
    }
  }
  class AccordionController extends stimulus.Controller {
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
      this.setupKeyboardNavigation();
    }
    disconnect() {
      this.removeKeyboardNavigation();
    }
    setupKeyboardNavigation() {
      this.handleKeydown = this.handleKeydown.bind(this);
      this.element.addEventListener("keydown", this.handleKeydown);
    }
    removeKeyboardNavigation() {
      this.element.removeEventListener("keydown", this.handleKeydown);
    }
    handleKeydown(event) {
      const trigger = event.target.closest("[data-ui--accordion-target='trigger']");
      if (!trigger) return;
      const currentIndex = this.triggerTargets.indexOf(trigger);
      if (currentIndex === -1) return;
      let targetIndex = -1;
      let shouldPreventDefault = true;
      switch (event.key) {
       case "ArrowDown":
        targetIndex = (currentIndex + 1) % this.triggerTargets.length;
        break;

       case "ArrowUp":
        targetIndex = currentIndex - 1;
        if (targetIndex < 0) {
          targetIndex = this.triggerTargets.length - 1;
        }
        break;

       case "Home":
        targetIndex = 0;
        break;

       case "End":
        targetIndex = this.triggerTargets.length - 1;
        break;

       case "Enter":
       case " ":
        this.toggle({
          currentTarget: trigger
        });
        break;

       default:
        shouldPreventDefault = false;
      }
      if (shouldPreventDefault) {
        event.preventDefault();
      }
      if (targetIndex !== -1 && this.triggerTargets[targetIndex]) {
        this.triggerTargets[targetIndex].focus();
      }
    }
    setupItems() {
      this.itemTargets.forEach((item, index) => {
        const content = this.contentTargets[index];
        if (content) {
          const isOpen = item.dataset.state === "open";
          if (isOpen) {
            content.style.height = "auto";
          } else {
            content.style.height = "0px";
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
      syncExpandedState(trigger, null, isOpen);
      content.dataset.state = state;
      const h3 = trigger.parentElement;
      if (h3 && h3.tagName === "H3") {
        h3.dataset.state = state;
      }
      if (isOpen) {
        content.removeAttribute("hidden");
        content.style.height = `${content.scrollHeight}px`;
      } else {
        const currentHeight = content.scrollHeight;
        content.style.height = `${currentHeight}px`;
        content.offsetHeight;
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
  function createEscapeKeyHandler(onEscape, options = {}) {
    const {enabled: enabled = true, stopPropagation: stopPropagation = false, preventDefault: preventDefault = false} = options;
    let handler = null;
    let isAttached = false;
    const keydownHandler = event => {
      if (event.key === "Escape") {
        if (stopPropagation) {
          event.stopPropagation();
        }
        if (preventDefault) {
          event.preventDefault();
        }
        onEscape(event);
      }
    };
    return {
      attach() {
        if (!enabled || isAttached) return;
        handler = keydownHandler;
        document.addEventListener("keydown", handler);
        isAttached = true;
      },
      detach() {
        if (!isAttached || !handler) return;
        document.removeEventListener("keydown", handler);
        handler = null;
        isAttached = false;
      },
      isAttached() {
        return isAttached;
      },
      disable() {
        if (handler) {
          document.removeEventListener("keydown", handler);
        }
      },
      enable() {
        if (handler && isAttached) {
          document.addEventListener("keydown", handler);
        }
      }
    };
  }
  function onEscapeKey(onEscape, options = {}) {
    const handler = createEscapeKeyHandler(onEscape, options);
    handler.attach();
    return () => handler.detach();
  }
  function onEscapeKeyWhen(onEscape, condition) {
    const keydownHandler = event => {
      if (event.key === "Escape" && condition()) {
        onEscape(event);
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  }
  const FOCUSABLE_SELECTOR = [ "button:not([disabled])", "[href]", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", '[tabindex]:not([tabindex="-1"])' ].join(", ");
  const INPUT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea';
  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  }
  function getFirstFocusable(container, options = {}) {
    const elements = getFocusableElements(container);
    if (options.skipInputs) {
      const nonInput = elements.find(el => !el.matches(INPUT_SELECTOR));
      return nonInput || elements[0] || null;
    }
    return elements[0] || null;
  }
  function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
  function focusFirstElement(container, options = {}) {
    const {mobileAware: mobileAware = true, excludeInputsOnMobile: excludeInputsOnMobile = mobileAware, preventScroll: preventScroll = false, preferredElement: preferredElement = null} = options;
    const focusOptions = preventScroll ? {
      preventScroll: true
    } : undefined;
    if (preferredElement && container.contains(preferredElement)) {
      preferredElement.focus(focusOptions);
      return preferredElement;
    }
    const skipInputs = excludeInputsOnMobile && isMobileDevice();
    const element = getFirstFocusable(container, {
      skipInputs: skipInputs
    });
    if (element) {
      element.focus(focusOptions);
      return element;
    }
    return null;
  }
  let scrollLockCount = 0;
  let originalOverflow = "";
  let originalPaddingRight = "";
  function getScrollbarWidth() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = "width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;";
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }
  function hasScrollbar() {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight;
  }
  function lockScroll(options = {}) {
    const {reserveScrollBarGap: reserveScrollBarGap = true} = options;
    scrollLockCount++;
    if (scrollLockCount === 1) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-locked", "1");
      if (reserveScrollBarGap && hasScrollbar()) {
        const scrollbarWidth = getScrollbarWidth();
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
    }
  }
  function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.removeAttribute("data-scroll-locked");
      originalOverflow = "";
      originalPaddingRight = "";
    }
  }
  class AlertDialogController extends stimulus.Controller {
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
      this.escapeHandler = createEscapeKeyHandler(() => this.close(), {
        enabled: this.closeOnEscapeValue
      });
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
      const targets = [ this.hasContainerTarget ? this.containerTarget : null, this.hasOverlayTarget ? this.overlayTarget : null, this.hasContentTarget ? this.contentTarget : null ].filter(Boolean);
      targets.forEach(target => setState(target, "open"));
      lockScroll();
      if (this.hasContentTarget) {
        focusFirstElement(this.contentTarget);
      }
      if (this.closeOnEscapeValue) {
        this.escapeHandler.attach();
      }
      this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
        bubbles: true,
        detail: {
          open: true
        }
      }));
    }
    hide() {
      const targets = [ this.hasContainerTarget ? this.containerTarget : null, this.hasOverlayTarget ? this.overlayTarget : null, this.hasContentTarget ? this.contentTarget : null ].filter(Boolean);
      targets.forEach(target => setState(target, "closed"));
      unlockScroll();
      this.escapeHandler.detach();
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
    disconnect() {
      unlockScroll();
      this.escapeHandler.detach();
    }
  }
  class AvatarController extends stimulus.Controller {
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
  class DialogController extends stimulus.Controller {
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
      this.escapeHandler = createEscapeKeyHandler(() => this.close(), {
        enabled: this.closeOnEscapeValue
      });
      if (this.openValue) {
        this.show();
      } else {
        this.setInitialClosedState();
      }
    }
    setInitialClosedState() {
      const targets = [ this.hasContainerTarget ? this.containerTarget : null, this.hasOverlayTarget ? this.overlayTarget : null, this.hasContentTarget ? this.contentTarget : null ].filter(Boolean);
      targets.forEach(target => {
        setState(target, "closed");
        target.setAttribute("data-initial", "");
      });
      if (this.hasContentTarget) {
        this.contentTarget.inert = true;
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
      const targets = [ this.hasContainerTarget ? this.containerTarget : null, this.hasOverlayTarget ? this.overlayTarget : null, this.hasContentTarget ? this.contentTarget : null ].filter(Boolean);
      targets.forEach(target => {
        target.removeAttribute("data-initial");
        setState(target, "open");
      });
      if (this.hasContentTarget) {
        this.contentTarget.inert = false;
      }
      lockScroll();
      if (this.hasContentTarget) {
        focusFirstElement(this.contentTarget);
      }
      if (this.closeOnEscapeValue) {
        this.escapeHandler.attach();
      }
      this.element.dispatchEvent(new CustomEvent("dialog:open", {
        bubbles: true,
        detail: {
          open: true
        }
      }));
    }
    hide() {
      const targets = [ this.hasContainerTarget ? this.containerTarget : null, this.hasOverlayTarget ? this.overlayTarget : null, this.hasContentTarget ? this.contentTarget : null ].filter(Boolean);
      targets.forEach(target => {
        setState(target, "closed");
      });
      if (this.hasContentTarget) {
        this.contentTarget.inert = true;
      }
      unlockScroll();
      this.escapeHandler.detach();
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
    disconnect() {
      unlockScroll();
      this.escapeHandler.detach();
    }
  }
  class CheckboxController extends stimulus.Controller {
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
      syncCheckedState(this.element, this.element.checked);
    }
  }
  class CollapsibleController extends stimulus.Controller {
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
      syncExpandedState(this.hasTriggerTarget ? this.triggerTarget : null, null, isOpen);
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
  class ComboboxController extends stimulus.Controller {
    static targets=[ "text", "item" ];
    static values={
      value: String
    };
    connect() {
      this.boundHandleSelect = this.handleSelect.bind(this);
      this.element.addEventListener("command:select", this.boundHandleSelect);
      this.boundHandleOpen = this.handleOpen.bind(this);
      this.element.addEventListener("popover:show", this.boundHandleOpen);
      this.element.addEventListener("drawer:open", this.boundHandleOpen);
      this.boundHandleClose = this.handleClose.bind(this);
      this.element.addEventListener("popover:hide", this.boundHandleClose);
      this.element.addEventListener("drawer:close", this.boundHandleClose);
      if (this.valueValue) {
        this.updateCheckIcons();
      }
    }
    disconnect() {
      this.element.removeEventListener("command:select", this.boundHandleSelect);
      this.element.removeEventListener("popover:show", this.boundHandleOpen);
      this.element.removeEventListener("drawer:open", this.boundHandleOpen);
      this.element.removeEventListener("popover:hide", this.boundHandleClose);
      this.element.removeEventListener("drawer:close", this.boundHandleClose);
    }
    handleOpen() {
      requestAnimationFrame(() => {
        const input = this.element.querySelector('[data-slot="command-input"]');
        if (input) {
          input.focus();
        }
      });
    }
    handleClose() {
      const input = this.element.querySelector('[data-slot="command-input"]');
      if (input && input.value) {
        input.value = "";
        input.dispatchEvent(new Event("input", {
          bubbles: true
        }));
      }
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
  class CommandController extends stimulus.Controller {
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
      const href = item.dataset.href;
      if (href) {
        if (item.dataset.turbo === "false") {
          window.location.href = href;
        } else {
          Turbo.visit(href);
        }
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
  class ContextMenuController extends stimulus.Controller {
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
  class CommandDialogController extends stimulus.Controller {
    static values={
      shortcut: {
        type: String,
        default: "meta+j"
      }
    };
    connect() {
      this.dialogElement = this.element.querySelector("[data-controller*='ui--dialog']");
      this.boundHandleDialogClose = this.handleDialogClose.bind(this);
      this.boundHandleFocusOut = this.handleFocusOut.bind(this);
      this.element.addEventListener("dialog:close", this.boundHandleDialogClose);
      this.element.addEventListener("focusout", this.boundHandleFocusOut);
    }
    disconnect() {
      this.element.removeEventListener("dialog:close", this.boundHandleDialogClose);
      this.element.removeEventListener("focusout", this.boundHandleFocusOut);
    }
    handleDialogClose() {
      this.clearInput();
    }
    handleFocusOut(event) {
      if (!this.dialogElement) return;
      const dialogController = this.application.getControllerForElementAndIdentifier(this.dialogElement, "ui--dialog");
      if (!dialogController || !dialogController.openValue) return;
      setTimeout(() => {
        const activeElement = document.activeElement;
        const dialogContent = this.dialogElement.querySelector("[data-ui--dialog-target='content']");
        if (dialogContent && !dialogContent.contains(activeElement)) {
          dialogController.close();
        }
      }, 0);
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
  class DrawerController extends stimulus.Controller {
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
        this.setAllTargetsState("closed");
      }
      if (this.repositionInputsValue && typeof visualViewport !== "undefined") {
        this.viewportResizeHandler = this.handleViewportResize.bind(this);
        visualViewport.addEventListener("resize", this.viewportResizeHandler);
      }
    }
    disconnect() {
      unlockScroll();
      this.cleanupEscapeHandler();
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
      this.dispatchEvent("drawer:drag:start", {
        direction: this.directionValue
      });
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
      this.dispatchEvent("drawer:drag:end", {
        direction: this.directionValue,
        velocity: velocity,
        delta: finalDelta
      });
    }
    getSnapPointY(snapIndex) {
      if (!this.snapPointsValue || snapIndex < 0 || snapIndex >= this.snapPointsValue.length) {
        return 0;
      }
      const snapPoint = this.snapPointsValue[snapIndex];
      const containerSize = this.getContainerSizeForSnapPoint(snapPoint);
      if (containerSize === 0) return 0;
      const pixels = this.snapPointToPixels(snapPoint, containerSize);
      return this.calculateSnapPosition(snapPoint, pixels, containerSize);
    }
    getContainerSizeForSnapPoint(snapPoint) {
      const MOBILE_THRESHOLD = 80;
      if (this.isHorizontalDirection()) {
        return window.innerWidth;
      }
      return snapPoint === 1 ? window.innerHeight - MOBILE_THRESHOLD : window.innerHeight;
    }
    snapPointToPixels(snapPoint, containerSize) {
      if (typeof snapPoint === "string" && snapPoint.includes("px")) {
        return parseInt(snapPoint);
      }
      if (snapPoint > 1) {
        return snapPoint / 100 * containerSize;
      }
      return snapPoint * containerSize;
    }
    calculateSnapPosition(snapPoint, pixels, containerSize) {
      const MOBILE_THRESHOLD = 80;
      const isClosingSide = this.directionValue === "bottom" || this.directionValue === "right";
      if (isClosingSide) {
        if (snapPoint === 1) return MOBILE_THRESHOLD;
        return containerSize - pixels;
      }
      return pixels;
    }
    handleSnapPointRelease(delta, velocity) {
      if (!this.snapPointsValue || this.snapPointsValue.length === 0) {
        this.close();
        return;
      }
      const currentIndex = this.activeSnapPointValue >= 0 ? this.activeSnapPointValue : 0;
      const currentY = delta;
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
        } else {
          targetIndex = Math.min(currentIndex + 1, this.snapPointsValue.length - 1);
        }
      } else {
        targetIndex = this.findClosestSnapPointIndex(currentY);
      }
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
        this.applyTransform(this.getTransformForSnapPoint(snapY), animated);
      }
      this.updateOverlayOpacityForSnapPoint(snapPointIndex);
      this.dispatchEvent("drawer:snap", {
        snapPoint: snapPoint,
        snapPointIndex: snapPointIndex,
        y: snapY
      });
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
    isHorizontalDirection() {
      return this.directionValue === "left" || this.directionValue === "right";
    }
    isVerticalDirection() {
      return this.directionValue === "bottom" || this.directionValue === "top";
    }
    getDelta(start, current) {
      if (this.isHorizontalDirection()) {
        return this.directionValue === "left" ? start.x - current.x : current.x - start.x;
      }
      return this.directionValue === "top" ? start.y - current.y : current.y - start.y;
    }
    isClosingDirection(delta) {
      return delta > 0;
    }
    getDrawerSize() {
      if (!this.hasContentTarget) return 0;
      return this.isHorizontalDirection() ? this.contentTarget.offsetWidth : this.contentTarget.offsetHeight;
    }
    getViewportSize() {
      return this.isHorizontalDirection() ? window.innerWidth : window.innerHeight;
    }
    getClosedPosition() {
      return this.getViewportSize() + this.getDrawerSize();
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
        if (this.isVerticalDirection()) {
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
      this.applyTransform("translate3d(0, 0, 0)", true, true);
      this.updateOverlayOpacity(0);
    }
    getFadeIndex() {
      return this.fadeFromIndexValue >= 0 ? this.fadeFromIndexValue : 0;
    }
    updateOverlayOpacity(currentY) {
      if (!this.hasOverlayTarget || !this.hasSnapPoints()) return;
      const fadeIndex = this.getFadeIndex();
      const fadeStartY = this.getSnapPointY(fadeIndex);
      const fadeEndIndex = Math.min(fadeIndex + 1, this.snapPointsValue.length - 1);
      const fadeEndY = this.getSnapPointY(fadeEndIndex);
      this.setOverlayOpacity(this.calculateOverlayOpacity(currentY, fadeStartY, fadeEndY));
    }
    updateOverlayOpacityForSnapPoint(snapPointIndex) {
      if (!this.hasOverlayTarget || !this.hasSnapPoints()) return;
      const fadeIndex = this.getFadeIndex();
      const fadeEndIndex = fadeIndex + 1;
      if (snapPointIndex < fadeIndex) {
        this.setOverlayOpacity(0);
      } else if (snapPointIndex >= fadeEndIndex) {
        this.setOverlayOpacity(1);
      } else {
        this.updateOverlayOpacity(this.getSnapPointY(snapPointIndex));
      }
    }
    calculateOverlayOpacity(currentY, fadeStartY, fadeEndY) {
      if (currentY < fadeEndY) return 1;
      if (currentY > fadeStartY) return 0;
      const range = fadeStartY - fadeEndY;
      const progress = (fadeStartY - currentY) / range;
      return Math.min(1, Math.max(0, progress));
    }
    setOverlayOpacity(opacity) {
      this.overlayTarget.style.opacity = String(opacity);
    }
    show() {
      this.setAllTargetsState("open");
      if (this.hasSnapPoints()) {
        const initialIndex = 0;
        if (this.hasContentTarget) {
          this.activeSnapPointValue = initialIndex;
          this.positionAtClosed();
          this.snapTo(initialIndex, true);
        }
        this.hasBeenOpened = true;
        this.updateOverlayOpacityForSnapPoint(initialIndex);
      } else {
        if (this.hasContentTarget) {
          this.positionAtClosed();
          this.animateToOpen();
        }
        this.hasBeenOpened = true;
      }
      if (this.modalValue) {
        lockScroll();
        this.preventScrollHandler = this.handlePreventScroll.bind(this);
        document.addEventListener("touchmove", this.preventScrollHandler, {
          passive: false
        });
      }
      this.setupFocusTrap();
      if (this.dismissibleValue) {
        this.setupEscapeHandler();
      }
      this.dispatchEvent("drawer:open", {
        open: true
      });
    }
    hide() {
      this.animateToClosedPosition();
    }
    animateToClosedPosition() {
      if (this.hasContentTarget) {
        const closedPosition = this.getClosedPosition();
        this.contentTarget.style.transition = this.getTransitionStyle();
        this.contentTarget.style.transform = this.getTransformForDirection(closedPosition);
        if (this.hasOverlayTarget) {
          this.overlayTarget.style.transition = `opacity ${this.TRANSITIONS.DURATION}s`;
          this.overlayTarget.style.opacity = "0";
        }
        setTimeout(() => {
          this.cleanupAfterClose();
        }, this.TRANSITIONS.DURATION * 1e3);
      } else {
        this.close();
      }
    }
    cleanupAfterClose() {
      if (this.hasContentTarget) {
        this.contentTarget.style.transition = "none";
        this.contentTarget.style.transform = "";
      }
      if (this.hasOverlayTarget) {
        this.overlayTarget.style.transition = "none";
        this.overlayTarget.style.opacity = "";
      }
      this.setAllTargetsState("closed");
      this.openValue = false;
      unlockScroll();
      if (this.preventScrollHandler) {
        document.removeEventListener("touchmove", this.preventScrollHandler);
        this.preventScrollHandler = null;
      }
      this.cleanupEscapeHandler();
      this.dispatchEvent("drawer:close", {
        open: false
      });
    }
    isMobile() {
      return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    setupFocusTrap() {
      if (!this.hasContentTarget) return;
      focusFirstElement(this.contentTarget, {
        excludeInputsOnMobile: true,
        preventScroll: true
      });
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
    setAllTargetsState(state) {
      const isOpen = state === "open";
      if (this.hasContainerTarget) {
        setState(this.containerTarget, state);
      }
      if (this.hasOverlayTarget) {
        setState(this.overlayTarget, state);
      }
      if (this.hasContentTarget) {
        setState(this.contentTarget, state);
        this.contentTarget.inert = !isOpen;
      }
    }
    hasSnapPoints() {
      return this.snapPointsValue && this.snapPointsValue.length > 0;
    }
    positionAtClosed() {
      const closedPosition = this.getClosedPosition();
      this.contentTarget.style.transition = "none";
      this.contentTarget.style.transform = this.getTransformForDirection(closedPosition);
      this.contentTarget.offsetHeight;
    }
    animateToOpen() {
      this.contentTarget.style.transition = this.getTransitionStyle();
      this.contentTarget.style.transform = "translate3d(0, 0, 0)";
    }
    getTransitionStyle() {
      return `transform ${this.TRANSITIONS.DURATION}s cubic-bezier(${this.TRANSITIONS.EASE.join(",")})`;
    }
    setupEscapeHandler() {
      this.cleanupEscapeHandler();
      this.escapeCleanup = onEscapeKey(() => {
        this.animateToClosedPosition();
      });
    }
    cleanupEscapeHandler() {
      if (this.escapeCleanup) {
        this.escapeCleanup();
        this.escapeCleanup = null;
      }
    }
    applyTransform(transform, animated = false, clearAfter = false) {
      if (!this.hasContentTarget) return;
      if (animated) {
        this.contentTarget.style.transition = this.getTransitionStyle();
      }
      this.contentTarget.style.transform = transform;
      if (animated && clearAfter) {
        setTimeout(() => {
          if (this.hasContentTarget) {
            this.contentTarget.style.transition = "";
            this.contentTarget.style.transform = "";
          }
        }, this.TRANSITIONS.DURATION * 1e3);
      } else if (animated) {
        setTimeout(() => {
          if (this.hasContentTarget) {
            this.contentTarget.style.transition = "";
          }
        }, this.TRANSITIONS.DURATION * 1e3);
      }
    }
    dispatchEvent(eventName, detail = {}) {
      this.element.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: detail
      }));
    }
  }
  class HoverCardController extends stimulus.Controller {
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
    connect() {
      this.showTimeout = null;
      this.hideTimeout = null;
      if (this.hasContentTarget) {
        this.contentTarget.style.position = "fixed";
      }
      if (this.hasTriggerTarget) {
        this.boundHandleFocus = this.handleFocus.bind(this);
        this.boundHandleBlur = this.handleBlur.bind(this);
        this.triggerTarget.addEventListener("focus", this.boundHandleFocus);
        this.triggerTarget.addEventListener("blur", this.boundHandleBlur);
      }
    }
    disconnect() {
      this.clearTimeouts();
      if (this.hasTriggerTarget && this.boundHandleFocus) {
        this.triggerTarget.removeEventListener("focus", this.boundHandleFocus);
        this.triggerTarget.removeEventListener("blur", this.boundHandleBlur);
      }
    }
    handleFocus() {
      this.show();
    }
    handleBlur(event) {
      if (this.hasContentTarget && this.contentTarget.contains(event.relatedTarget)) {
        return;
      }
      this.hide();
    }
    show() {
      this.clearTimeouts();
      this.showTimeout = setTimeout(() => {
        this.openValue = true;
        this.contentTarget.classList.remove("invisible");
        this.contentTarget.classList.add("visible");
        setState(this.contentTarget, "open");
        this.positionContent();
      }, this.openDelayValue);
    }
    hide() {
      this.clearTimeouts();
      this.hideTimeout = setTimeout(() => {
        this.openValue = false;
        this.contentTarget.classList.remove("visible");
        this.contentTarget.classList.add("invisible");
        setState(this.contentTarget, "closed");
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
  class InputOtpController extends stimulus.Controller {
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
  const DEFAULT_CONFIG = {
    placement: "bottom",
    offsetValue: 4,
    flipEnabled: true,
    shiftEnabled: true,
    shiftPadding: 8,
    arrowElement: null,
    arrowPadding: 8,
    strategy: "absolute",
    ancestorScroll: true,
    ancestorResize: true,
    elementResize: true,
    layoutShift: true,
    animationFrame: false
  };
  function buildMiddleware(options) {
    const middleware = [];
    if (options.offsetValue > 0) {
      middleware.push(offset(options.offsetValue));
    }
    if (options.flipEnabled) {
      middleware.push(flip());
    }
    if (options.shiftEnabled) {
      middleware.push(shift({
        padding: options.shiftPadding
      }));
    }
    if (options.arrowElement) {
      middleware.push(arrow({
        element: options.arrowElement,
        padding: options.arrowPadding
      }));
    }
    return middleware;
  }
  function applyPosition(content, position, options = {}) {
    const {x: x, y: y, placement: placement, middlewareData: middlewareData} = position;
    Object.assign(content.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: options.strategy || "absolute"
    });
    const [side, align] = placement.split("-");
    content.setAttribute("data-side", side);
    if (align) {
      content.setAttribute("data-align", align);
    }
    if (options.arrowElement && middlewareData.arrow) {
      const {x: arrowX, y: arrowY} = middlewareData.arrow;
      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      }[side];
      Object.assign(options.arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-4px"
      });
    }
  }
  function createPositioner(reference, floating, options = {}) {
    const config = {
      ...DEFAULT_CONFIG,
      ...options
    };
    let cleanup = null;
    let isActive = false;
    const middleware = buildMiddleware(config);
    const updatePosition = async () => {
      const position = await computePosition(reference, floating, {
        placement: config.placement,
        middleware: middleware,
        strategy: config.strategy
      });
      applyPosition(floating, position, {
        strategy: config.strategy,
        arrowElement: config.arrowElement
      });
      return position;
    };
    return {
      start() {
        if (isActive) return;
        updatePosition();
        cleanup = autoUpdate(reference, floating, updatePosition, {
          ancestorScroll: config.ancestorScroll,
          ancestorResize: config.ancestorResize,
          elementResize: config.elementResize,
          layoutShift: config.layoutShift,
          animationFrame: config.animationFrame
        });
        isActive = true;
      },
      stop() {
        if (!isActive) return;
        if (cleanup) {
          cleanup();
          cleanup = null;
        }
        isActive = false;
      },
      async update() {
        return updatePosition();
      },
      setPlacement(placement) {
        config.placement = placement;
        if (isActive) {
          updatePosition();
        }
      },
      setOffset(offsetValue) {
        config.offsetValue = offsetValue;
        middleware.length = 0;
        middleware.push(...buildMiddleware(config));
        if (isActive) {
          updatePosition();
        }
      },
      isActive() {
        return isActive;
      },
      getConfig() {
        return {
          ...config
        };
      }
    };
  }
  function getPlacementFromAttributes(element) {
    const side = element.getAttribute("data-side") || "bottom";
    const align = element.getAttribute("data-align");
    return align ? `${side}-${align}` : side;
  }
  class TooltipController extends stimulus.Controller {
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
    connect() {
      this.hoverTimeout = null;
      this.isOpen = false;
      this.positioner = null;
      this.cleanupEscape = onEscapeKeyWhen(() => this.hide(), () => this.isOpen);
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
      if (this.positioner) {
        this.positioner.stop();
        this.positioner = null;
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
      if (this.cleanupEscape) {
        this.cleanupEscape();
      }
    }
    show() {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
      this.hoverTimeout = setTimeout(() => {
        if (!this.content || !this.hasTriggerTarget) return;
        this.isOpen = true;
        setState(this.content, "open");
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
      setState(this.content, "closed");
      if (this.positioner) {
        this.positioner.stop();
      }
    }
    updatePosition() {
      if (!this.content || !this.hasTriggerTarget) return;
      const placement = getPlacementFromAttributes(this.content);
      if (!this.positioner) {
        this.positioner = createPositioner(this.triggerTarget, this.content, {
          placement: placement,
          offsetValue: this.sideOffsetValue
        });
      } else {
        this.positioner.setPlacement(placement);
      }
      this.positioner.start();
    }
  }
  function createClickOutsideHandler(elements, onClickOutside, options = {}) {
    const {capture: capture = false, ignoreSelectors: ignoreSelectors = [], mousedown: mousedown = false} = options;
    const elementsArray = Array.isArray(elements) ? elements : [ elements ];
    let handler = null;
    let isAttached = false;
    const eventType = mousedown ? "mousedown" : "click";
    const clickHandler = event => {
      const target = event.target;
      const isInside = elementsArray.some(element => element && element.contains(target));
      if (isInside) return;
      const isIgnored = ignoreSelectors.some(selector => target.closest(selector) !== null);
      if (isIgnored) return;
      onClickOutside(event);
    };
    return {
      attach() {
        if (isAttached) return;
        handler = clickHandler;
        document.addEventListener(eventType, handler, capture);
        isAttached = true;
      },
      detach() {
        if (!isAttached || !handler) return;
        document.removeEventListener(eventType, handler, capture);
        handler = null;
        isAttached = false;
      },
      isAttached() {
        return isAttached;
      },
      updateElements(newElements) {
        elementsArray.length = 0;
        const newArray = Array.isArray(newElements) ? newElements : [ newElements ];
        elementsArray.push(...newArray);
      }
    };
  }
  class PopoverController extends stimulus.Controller {
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
    connect() {
      if (!this.hasTriggerTarget || !this.hasContentTarget) {
        return;
      }
      if (!this.contentTarget.hasAttribute("data-state")) {
        setState(this.contentTarget, this.openValue ? "open" : "closed");
      }
      this.positioner = createPositioner(this.triggerTarget, this.contentTarget, {
        placement: this.placementValue,
        offsetValue: this.offsetValue
      });
      if (this.triggerValue === "click") {
        this.setupClickTrigger();
      } else if (this.triggerValue === "hover") {
        this.setupHoverTrigger();
      }
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      this.boundHandleFocusOut = this.handleFocusOut.bind(this);
      this.element.addEventListener("focusout", this.boundHandleFocusOut);
    }
    disconnect() {
      if (this.positioner) {
        this.positioner.stop();
        this.positioner = null;
      }
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
      this.teardownKeyboardNavigation();
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.detach();
      }
      if (this.boundHandleTriggerClick) {
        this.triggerTarget.removeEventListener("click", this.boundHandleTriggerClick);
      }
      if (this.boundHandleMouseEnter) {
        this.triggerTarget.removeEventListener("mouseenter", this.boundHandleMouseEnter);
        this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave);
      }
      if (this.boundHandleFocusOut) {
        this.element.removeEventListener("focusout", this.boundHandleFocusOut);
      }
    }
    setupKeyboardNavigation() {
      document.addEventListener("keydown", this.boundHandleKeydown);
    }
    teardownKeyboardNavigation() {
      if (this.boundHandleKeydown) {
        document.removeEventListener("keydown", this.boundHandleKeydown);
      }
    }
    handleFocusOut(event) {
      if (!this.openValue || this.isClosing) return;
      setTimeout(() => {
        const newFocusedElement = document.activeElement;
        if (newFocusedElement === document.body) {
          return this.hide({
            returnFocus: true
          });
        }
        if (!this.element.contains(newFocusedElement)) {
          this.hide({
            returnFocus: false
          });
        }
      }, 0);
    }
    handleKeydown(event) {
      if (event.key === "Escape" && this.openValue) {
        event.preventDefault();
        this.hide({
          returnFocus: true
        });
      }
    }
    setupClickTrigger() {
      this.boundHandleTriggerClick = this.toggle.bind(this);
      this.triggerTarget.addEventListener("click", this.boundHandleTriggerClick);
      this.clickOutsideHandler = createClickOutsideHandler(this.element, () => this.hide());
      this.clickOutsideHandler.attach();
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
      this.triggerElementToFocus = this.findTriggerElementToFocus();
      this.openValue = true;
      setState(this.contentTarget, "open");
      this.contentTarget.classList.remove("hidden");
      if (this.positioner) {
        this.positioner.start();
      }
      this.setupKeyboardNavigation();
      this.element.dispatchEvent(new CustomEvent("popover:show", {
        bubbles: true,
        detail: {
          popover: this
        }
      }));
    }
    findTriggerElementToFocus() {
      if (!this.triggerTarget) return null;
      const isFocusable = this.triggerTarget.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (isFocusable) {
        return this.triggerTarget;
      } else {
        return this.triggerTarget.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      }
    }
    hide(options = {}) {
      const {returnFocus: returnFocus = false} = options;
      this.isClosing = true;
      this.openValue = false;
      setState(this.contentTarget, "closed");
      this.contentTarget.classList.add("hidden");
      if (this.positioner) {
        this.positioner.stop();
      }
      this.teardownKeyboardNavigation();
      if (returnFocus && this.triggerElementToFocus) {
        setTimeout(() => {
          if (this.triggerElementToFocus) {
            this.triggerElementToFocus.focus();
          }
          this.isClosing = false;
        }, 100);
      } else {
        this.isClosing = false;
      }
      this.element.dispatchEvent(new CustomEvent("popover:hide", {
        bubbles: true,
        detail: {
          popover: this
        }
      }));
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
  }
  class ResponsiveDialogController extends stimulus.Controller {
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
      setTimeout(() => {
        focusFirstElement(targetEl);
      }, 100);
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
  class ScrollAreaController extends stimulus.Controller {
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
      this.setupFocusHandlers();
    }
    setupFocusHandlers() {
      if (!this.hasViewportTarget) return;
      this.boundHandleViewportFocus = this.handleViewportFocus.bind(this);
      this.boundHandleViewportFocusOut = this.handleViewportFocusOut.bind(this);
      this.viewportTarget.addEventListener("focus", this.boundHandleViewportFocus);
      this.viewportTarget.addEventListener("focusout", this.boundHandleViewportFocusOut);
    }
    handleViewportFocus() {
      this.scrollbarTargets.forEach(scrollbar => {
        const timer = this.hideTimers.get(scrollbar);
        if (timer) {
          clearTimeout(timer);
          this.hideTimers.delete(scrollbar);
        }
        scrollbar.dataset.state = "visible";
      });
    }
    handleViewportFocusOut() {
      this.scrollbarTargets.forEach(scrollbar => {
        const timer = setTimeout(() => {
          scrollbar.dataset.state = "hidden";
          this.hideTimers.delete(scrollbar);
        }, this.scrollHideDelayValue);
        this.hideTimers.set(scrollbar, timer);
      });
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
      if (this.hasViewportTarget) {
        if (this.boundHandleViewportFocus) {
          this.viewportTarget.removeEventListener("focus", this.boundHandleViewportFocus);
        }
        if (this.boundHandleViewportFocusOut) {
          this.viewportTarget.removeEventListener("focusout", this.boundHandleViewportFocusOut);
        }
      }
      this.hideTimers.forEach(timer => clearTimeout(timer));
      this.hideTimers.clear();
      this.scrollEndTimers.forEach(timer => clearTimeout(timer));
      this.scrollEndTimers.clear();
    }
  }
  class SelectController extends stimulus.Controller {
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
      if (this.hasHiddenInputTarget && this.valueValue) {
        this.hiddenInputTarget.value = this.valueValue;
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
    valueValueChanged(value, previousValue) {
      if (previousValue === undefined) return;
      this.updateDisplay(value);
      this.updateSelection(value);
      if (this.hasHiddenInputTarget) {
        this.hiddenInputTarget.value = value;
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
  class SidebarController extends stimulus.Controller {
    static targets=[ "sidebar", "trigger", "mobileSheet", "mobileDrawer" ];
    static values={
      open: {
        type: Boolean,
        default: true
      },
      openMobile: {
        type: Boolean,
        default: false
      },
      collapsible: {
        type: String,
        default: "icon"
      },
      side: {
        type: String,
        default: "left"
      },
      cookieName: {
        type: String,
        default: "sidebar_state"
      },
      cookieExpires: {
        type: Number,
        default: 7
      }
    };
    MOBILE_BREAKPOINT=768;
    connect() {
      this.loadCookie();
      this.boundHandleKeyboard = this.handleKeyboard.bind(this);
      document.addEventListener("keydown", this.boundHandleKeyboard);
      this.boundHandleResize = this.handleResize.bind(this);
      window.addEventListener("resize", this.boundHandleResize);
      this.boundHandleSheetClose = this.handleSheetClose.bind(this);
      this.element.addEventListener("dialog:close", this.boundHandleSheetClose);
      this.updateState();
    }
    disconnect() {
      document.removeEventListener("keydown", this.boundHandleKeyboard);
      window.removeEventListener("resize", this.boundHandleResize);
      this.element.removeEventListener("dialog:close", this.boundHandleSheetClose);
    }
    toggle() {
      if (this.isMobile()) {
        this.toggleMobile();
      } else {
        this.toggleDesktop();
      }
    }
    open() {
      if (this.isMobile()) {
        this.openMobile();
      } else {
        this.openDesktop();
      }
    }
    close() {
      if (this.isMobile()) {
        this.closeMobile();
      } else {
        this.closeDesktop();
      }
    }
    setOpen(open) {
      if (this.isMobile()) {
        this.openMobileValue = open;
      } else {
        this.openValue = open;
        this.saveCookie();
      }
      this.updateState();
    }
    toggleDesktop() {
      this.openValue = !this.openValue;
      this.saveCookie();
      this.updateState();
      this.dispatchToggleEvent();
    }
    openDesktop() {
      this.openValue = true;
      this.saveCookie();
      this.updateState();
      this.dispatchToggleEvent();
    }
    closeDesktop() {
      this.openValue = false;
      this.saveCookie();
      this.updateState();
      this.dispatchToggleEvent();
    }
    toggleMobile() {
      this.openMobileValue = !this.openMobileValue;
      this.updateMobileDrawer();
    }
    openMobile() {
      this.openMobileValue = true;
      this.updateMobileDrawer();
    }
    closeMobile() {
      this.openMobileValue = false;
      this.updateMobileDrawer();
    }
    updateMobileDrawer() {
      if (this.hasMobileSheetTarget) {
        const sheetController = this.application.getControllerForElementAndIdentifier(this.mobileSheetTarget, "ui--dialog");
        if (sheetController) {
          if (this.openMobileValue) {
            sheetController.open();
          } else {
            sheetController.close();
          }
        }
        return;
      }
      if (this.hasMobileDrawerTarget) {
        const drawerController = this.application.getControllerForElementAndIdentifier(this.mobileDrawerTarget, "ui--drawer");
        if (drawerController) {
          if (this.openMobileValue) {
            drawerController.open();
          } else {
            drawerController.close();
          }
        }
      }
    }
    getState() {
      if (this.collapsibleValue === "none") {
        return "expanded";
      }
      return this.openValue ? "expanded" : "collapsed";
    }
    isMobile() {
      return window.innerWidth < this.MOBILE_BREAKPOINT;
    }
    updateState() {
      const state = this.getState();
      const collapsibleAttr = state === "collapsed" ? this.collapsibleValue : "";
      this.element.dataset.state = state;
      this.element.dataset.collapsible = collapsibleAttr;
      this.element.dataset.side = this.sideValue;
      if (this.hasSidebarTarget) {
        this.sidebarTarget.dataset.state = state;
        this.sidebarTarget.dataset.collapsible = collapsibleAttr;
        this.sidebarTarget.dataset.side = this.sideValue;
      }
      this.triggerTargets.forEach(trigger => {
        trigger.dataset.state = state;
      });
    }
    saveCookie() {
      const expires = new Date;
      expires.setDate(expires.getDate() + this.cookieExpiresValue);
      document.cookie = `${this.cookieNameValue}=${this.openValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
    loadCookie() {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find(c => c.startsWith(`${this.cookieNameValue}=`));
      if (cookie) {
        const value = cookie.split("=")[1];
        this.openValue = value === "true";
      }
    }
    handleKeyboard(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        this.toggle();
      }
    }
    handleResize() {
      this.updateState();
    }
    handleSheetClose(event) {
      if (this.hasMobileSheetTarget && this.mobileSheetTarget.contains(event.target)) {
        this.openMobileValue = false;
      }
    }
    dispatchToggleEvent() {
      this.element.dispatchEvent(new CustomEvent("sidebar:toggle", {
        bubbles: true,
        detail: {
          open: this.openValue,
          state: this.getState(),
          collapsible: this.collapsibleValue,
          side: this.sideValue
        }
      }));
    }
    openValueChanged() {
      this.updateState();
    }
    openMobileValueChanged() {
      this.updateMobileDrawer();
    }
    collapsibleValueChanged() {
      this.updateState();
    }
    sideValueChanged() {
      this.updateState();
    }
  }
  class SonnerController extends stimulus.Controller {
    static values={
      position: {
        type: String,
        default: "bottom-right"
      },
      theme: {
        type: String,
        default: "system"
      },
      richColors: {
        type: Boolean,
        default: false
      },
      expand: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        default: 4e3
      },
      closeButton: {
        type: Boolean,
        default: false
      },
      visibleToasts: {
        type: Number,
        default: 3
      },
      gap: {
        type: Number,
        default: 14
      },
      offset: {
        type: Number,
        default: 16
      }
    };
    connect() {
      this.toasts = [];
      this.toastId = 0;
      this.isHovered = false;
      this.lastCloseTimestamp = 0;
      this.setupContainer();
      this.setupEventListeners();
      this.setupHoverListeners();
      this.detectTheme();
    }
    setupContainer() {
      const [yPos, xPos] = this.positionValue.split("-");
      this.element.setAttribute("data-sonner-toaster", "");
      this.element.setAttribute("data-y-position", yPos);
      this.element.setAttribute("data-x-position", xPos);
      this.element.setAttribute("dir", "ltr");
      this.element.style.setProperty("--width", "356px");
      this.element.style.setProperty("--gap", `${this.gapValue}px`);
      this.element.style.setProperty("--offset-top", `${this.offsetValue}px`);
      this.element.style.setProperty("--offset-bottom", `${this.offsetValue}px`);
      this.element.style.setProperty("--offset-left", `${this.offsetValue}px`);
      this.element.style.setProperty("--offset-right", `${this.offsetValue}px`);
      this.element.style.setProperty("--mobile-offset-top", `${this.offsetValue}px`);
      this.element.style.setProperty("--mobile-offset-bottom", `${this.offsetValue}px`);
      this.element.style.setProperty("--mobile-offset-left", `${this.offsetValue}px`);
      this.element.style.setProperty("--mobile-offset-right", `${this.offsetValue}px`);
    }
    detectTheme() {
      let theme = this.themeValue;
      if (theme === "system") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      this.element.setAttribute("data-sonner-theme", theme);
    }
    setupHoverListeners() {
      this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);
      this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);
      this.element.addEventListener("mouseenter", this.boundHandleMouseEnter);
      this.element.addEventListener("mouseleave", this.boundHandleMouseLeave);
    }
    handleMouseEnter() {
      this.isHovered = true;
      this.expandToasts();
      this.pauseAllTimers();
    }
    handleMouseLeave() {
      this.isHovered = false;
      this.collapseToasts();
      this.resumeAllTimers();
    }
    expandToasts() {
      this.toasts.forEach(t => {
        t.element.setAttribute("data-expanded", "true");
      });
      this.updateToastPositions();
    }
    collapseToasts() {
      this.toasts.forEach(t => {
        t.element.setAttribute("data-expanded", "false");
      });
      this.updateToastPositions();
    }
    pauseAllTimers() {
      const now = Date.now();
      this.toasts.forEach(t => {
        if (t.timerId) {
          clearTimeout(t.timerId);
          t.timerId = null;
          t.remainingTime = Math.max(0, t.dismissAt - now);
        }
      });
    }
    resumeAllTimers() {
      const now = Date.now();
      this.toasts.forEach(t => {
        if (t.remainingTime !== undefined && t.remainingTime > 0) {
          t.dismissAt = now + t.remainingTime;
          t.timerId = setTimeout(() => this.dismiss(t.id), t.remainingTime);
        }
      });
    }
    show(message, options = {}) {
      const id = ++this.toastId;
      const toast = this.createToastElement(id, message, options);
      this.element.appendChild(toast);
      const toastData = {
        id: id,
        element: toast,
        options: options,
        timerId: null,
        dismissAt: null,
        remainingTime: null,
        height: null
      };
      this.toasts.push(toastData);
      this.updateToastPositions();
      requestAnimationFrame(() => {
        const height = toast.getBoundingClientRect().height;
        toastData.height = height;
        toast.style.setProperty("--initial-height", `${height}px`);
        this.element.style.setProperty("--front-toast-height", `${height}px`);
        toast.setAttribute("data-mounted", "true");
      });
      const duration = options.duration ?? this.durationValue;
      if (duration !== Infinity) {
        if (!this.isHovered) {
          toastData.dismissAt = Date.now() + duration;
          toastData.timerId = setTimeout(() => this.dismiss(id), duration);
        } else {
          toastData.remainingTime = duration;
        }
      }
      return id;
    }
    createToastElement(id, message, options) {
      const [yPos, xPos] = this.positionValue.split("-");
      const toast = document.createElement("li");
      toast.setAttribute("data-sonner-toast", "");
      toast.setAttribute("data-styled", "true");
      toast.setAttribute("data-y-position", yPos);
      toast.setAttribute("data-x-position", xPos);
      toast.setAttribute("data-front", "true");
      toast.setAttribute("data-visible", "true");
      toast.setAttribute("data-swipe-out", "false");
      toast.setAttribute("data-expanded", this.isHovered || this.expandValue ? "true" : "false");
      if (options.type) toast.setAttribute("data-type", options.type);
      if (this.richColorsValue) toast.setAttribute("data-rich-colors", "true");
      let html = "";
      if (options.type) {
        html += `<div data-icon>${this.getIcon(options.type)}</div>`;
      }
      html += `<div data-content>`;
      html += `<div data-title>${this.escapeHtml(message)}</div>`;
      if (options.description) {
        html += `<div data-description>${this.escapeHtml(options.description)}</div>`;
      }
      html += `</div>`;
      if (options.action) {
        html += `<button data-button>${this.escapeHtml(options.action.label)}</button>`;
      }
      if (this.closeButtonValue || options.closeButton) {
        html += `<button data-close-button aria-label="Close toast"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
      }
      toast.innerHTML = html;
      const actionBtn = toast.querySelector("[data-button]");
      if (actionBtn && options.action) {
        actionBtn.addEventListener("click", () => {
          if (options.action.onClick) {
            options.action.onClick();
          }
          if (options.action.event) {
            document.dispatchEvent(new CustomEvent(options.action.event, {
              detail: options.action.data
            }));
          }
          this.dismiss(id);
        });
      }
      const closeBtn = toast.querySelector("[data-close-button]");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.dismiss(id));
      }
      toast.addEventListener("mouseenter", () => this.handleMouseEnter());
      toast.addEventListener("mouseleave", e => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !relatedTarget.closest("[data-sonner-toast]") && !relatedTarget.closest("[data-sonner-toaster]")) {
          this.handleMouseLeave();
        }
      });
      return toast;
    }
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    getIcon(type) {
      const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        loading: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
      };
      return icons[type] || "";
    }
    updateToastPositions() {
      const visible = this.toasts.slice(-this.visibleToastsValue);
      const totalToasts = this.toasts.length;
      const isExpanded = this.isHovered || this.expandValue;
      const heights = this.toasts.map(t => t.height || t.element.getBoundingClientRect().height || 50);
      let heightOffset = 0;
      for (let i = totalToasts - 1; i >= 0; i--) {
        const t = this.toasts[i];
        const isVisible = visible.includes(t);
        const isFront = i === totalToasts - 1;
        const toastsBefore = totalToasts - 1 - i;
        t.element.setAttribute("data-visible", isVisible ? "true" : "false");
        t.element.setAttribute("data-front", isFront ? "true" : "false");
        t.element.setAttribute("data-expanded", isExpanded ? "true" : "false");
        t.element.style.setProperty("--z-index", i + 1);
        t.element.style.setProperty("--toasts-before", toastsBefore);
        if (t.height) {
          t.element.style.setProperty("--initial-height", `${t.height}px`);
        }
        if (isExpanded) {
          t.element.style.setProperty("--offset", `${heightOffset}px`);
          if (isVisible) {
            heightOffset += heights[i] + this.gapValue;
          }
        } else {
          t.element.style.setProperty("--offset", `${toastsBefore * this.gapValue}px`);
        }
      }
      if (totalToasts > 0) {
        this.element.style.setProperty("--front-toast-height", `${heights[totalToasts - 1]}px`);
        const visibleCount = Math.min(totalToasts, this.visibleToastsValue);
        let totalHeight = 0;
        if (isExpanded) {
          for (let i = totalToasts - 1; i >= totalToasts - visibleCount; i--) {
            totalHeight += heights[i] + this.gapValue;
          }
          totalHeight -= this.gapValue;
        } else {
          totalHeight = heights[totalToasts - 1] + (visibleCount - 1) * this.gapValue;
        }
        this.element.style.height = `${totalHeight}px`;
      } else {
        this.element.style.height = "0";
      }
    }
    dismiss(id) {
      const index = this.toasts.findIndex(t => t.id === id);
      if (index === -1) return;
      const toast = this.toasts[index];
      if (toast.timerId) {
        clearTimeout(toast.timerId);
      }
      toast.element.setAttribute("data-removed", "true");
      toast.element.setAttribute("data-front", "true");
      setTimeout(() => {
        toast.element.remove();
        const currentIndex = this.toasts.findIndex(t => t.id === id);
        if (currentIndex !== -1) {
          this.toasts.splice(currentIndex, 1);
        }
        this.updateToastPositions();
      }, 400);
    }
    dismissAll() {
      const ids = this.toasts.map(t => t.id);
      ids.forEach(id => this.dismiss(id));
    }
    default(event) {
      const {message: message, description: description, duration: duration} = event.params || {};
      if (message) {
        this.show(message, {
          description: description,
          duration: duration
        });
      }
    }
    success(event) {
      const {message: message, description: description, duration: duration} = event.params || {};
      if (message) {
        this.show(message, {
          type: "success",
          description: description,
          duration: duration
        });
      }
    }
    error(event) {
      const {message: message, description: description, duration: duration} = event.params || {};
      if (message) {
        this.show(message, {
          type: "error",
          description: description,
          duration: duration
        });
      }
    }
    info(event) {
      const {message: message, description: description, duration: duration} = event.params || {};
      if (message) {
        this.show(message, {
          type: "info",
          description: description,
          duration: duration
        });
      }
    }
    warning(event) {
      const {message: message, description: description, duration: duration} = event.params || {};
      if (message) {
        this.show(message, {
          type: "warning",
          description: description,
          duration: duration
        });
      }
    }
    setupEventListeners() {
      this.boundHandleToast = this.handleToast.bind(this);
      document.addEventListener("ui:toast", this.boundHandleToast);
    }
    handleToast(event) {
      const detail = event.detail || {};
      const {type: type, message: message, description: description, duration: duration, action: action, closeButton: closeButton} = detail;
      if (message && typeof message === "string" && message.trim()) {
        this.show(message.trim(), {
          type: type,
          description: description,
          duration: duration,
          action: action,
          closeButton: closeButton
        });
      }
    }
    disconnect() {
      document.removeEventListener("ui:toast", this.boundHandleToast);
      this.element.removeEventListener("mouseenter", this.boundHandleMouseEnter);
      this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave);
      this.toasts.forEach(t => {
        if (t.timerId) clearTimeout(t.timerId);
      });
    }
  }
  class ToggleController extends stimulus.Controller {
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
      syncPressedState(this.element, this.pressedValue, {
        useOnOff: true
      });
    }
  }
  class ToggleGroupController extends stimulus.Controller {
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
  class TabsController extends stimulus.Controller {
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
      setState(trigger, "active");
      trigger.setAttribute("aria-selected", "true");
      trigger.setAttribute("tabindex", "0");
    }
    deactivateTrigger(trigger) {
      setState(trigger, "inactive");
      trigger.setAttribute("aria-selected", "false");
      trigger.setAttribute("tabindex", "-1");
    }
    showContent(content) {
      setState(content, "active");
      content.removeAttribute("hidden");
    }
    hideContent(content) {
      setState(content, "inactive");
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
  class SliderController extends stimulus.Controller {
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
  class SwitchController extends stimulus.Controller {
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
      const additionalTargets = this.hasThumbTarget ? [ this.thumbTarget ] : [];
      syncCheckedState(this.element, isChecked, {
        additionalTargets: additionalTargets
      });
      const hiddenInput = this.element.querySelector('input[type="hidden"]');
      if (hiddenInput) {
        hiddenInput.value = isChecked ? "1" : "0";
      }
    }
    checkedValueChanged(value) {
      this.updateState(value, true);
    }
  }
  const millisecondsInWeek = 6048e5;
  const millisecondsInDay = 864e5;
  const millisecondsInMinute = 6e4;
  const millisecondsInHour = 36e5;
  const millisecondsInSecond = 1e3;
  const constructFromSymbol = Symbol.for("constructDateFrom");
  function constructFrom(date, value) {
    if (typeof date === "function") return date(value);
    if (date && typeof date === "object" && constructFromSymbol in date) return date[constructFromSymbol](value);
    if (date instanceof Date) return new date.constructor(value);
    return new Date(value);
  }
  function toDate(argument, context) {
    return constructFrom(context || argument, argument);
  }
  function addDays(date, amount, options) {
    const _date = toDate(date, options?.in);
    if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
    if (!amount) return _date;
    _date.setDate(_date.getDate() + amount);
    return _date;
  }
  function addMonths(date, amount, options) {
    const _date = toDate(date, options?.in);
    if (isNaN(amount)) return constructFrom(date, NaN);
    if (!amount) {
      return _date;
    }
    const dayOfMonth = _date.getDate();
    const endOfDesiredMonth = constructFrom(date, _date.getTime());
    endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
    const daysInMonth = endOfDesiredMonth.getDate();
    if (dayOfMonth >= daysInMonth) {
      return endOfDesiredMonth;
    } else {
      _date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
      return _date;
    }
  }
  let defaultOptions$2 = {};
  function getDefaultOptions$1() {
    return defaultOptions$2;
  }
  function startOfWeek(date, options) {
    const defaultOptions = getDefaultOptions$1();
    const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
    const _date = toDate(date, options?.in);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    _date.setDate(_date.getDate() - diff);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function startOfISOWeek(date, options) {
    return startOfWeek(date, {
      ...options,
      weekStartsOn: 1
    });
  }
  function getISOWeekYear(date, options) {
    const _date = toDate(date, options?.in);
    const year = _date.getFullYear();
    const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
    const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
    if (_date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (_date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  function getTimezoneOffsetInMilliseconds(date) {
    const _date = toDate(date);
    const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
  }
  function normalizeDates(context, ...dates) {
    const normalize = constructFrom.bind(null, dates.find(date => typeof date === "object"));
    return dates.map(normalize);
  }
  function startOfDay(date, options) {
    const _date = toDate(date, options?.in);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function differenceInCalendarDays(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
    const laterStartOfDay = startOfDay(laterDate_);
    const earlierStartOfDay = startOfDay(earlierDate_);
    const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
    const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
    return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
  }
  function startOfISOWeekYear(date, options) {
    const year = getISOWeekYear(date, options);
    const fourthOfJanuary = constructFrom(date, 0);
    fourthOfJanuary.setFullYear(year, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    return startOfISOWeek(fourthOfJanuary);
  }
  function addYears(date, amount, options) {
    return addMonths(date, amount * 12, options);
  }
  function constructNow(date) {
    return constructFrom(date, Date.now());
  }
  function isSameDay(laterDate, earlierDate, options) {
    const [dateLeft_, dateRight_] = normalizeDates(options?.in, laterDate, earlierDate);
    return +startOfDay(dateLeft_) === +startOfDay(dateRight_);
  }
  function isDate(value) {
    return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
  }
  function isValid(date) {
    return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
  }
  function differenceInDays(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
    const sign = compareLocalAsc(laterDate_, earlierDate_);
    const difference = Math.abs(differenceInCalendarDays(laterDate_, earlierDate_));
    laterDate_.setDate(laterDate_.getDate() - sign * difference);
    const isLastDayNotFull = Number(compareLocalAsc(laterDate_, earlierDate_) === -sign);
    const result = sign * (difference - isLastDayNotFull);
    return result === 0 ? 0 : result;
  }
  function compareLocalAsc(laterDate, earlierDate) {
    const diff = laterDate.getFullYear() - earlierDate.getFullYear() || laterDate.getMonth() - earlierDate.getMonth() || laterDate.getDate() - earlierDate.getDate() || laterDate.getHours() - earlierDate.getHours() || laterDate.getMinutes() - earlierDate.getMinutes() || laterDate.getSeconds() - earlierDate.getSeconds() || laterDate.getMilliseconds() - earlierDate.getMilliseconds();
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return diff;
  }
  function endOfMonth(date, options) {
    const _date = toDate(date, options?.in);
    const month = _date.getMonth();
    _date.setFullYear(_date.getFullYear(), month + 1, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  function normalizeInterval(context, interval) {
    const [start, end] = normalizeDates(context, interval.start, interval.end);
    return {
      start: start,
      end: end
    };
  }
  function eachDayOfInterval(interval, options) {
    const {start: start, end: end} = normalizeInterval(options?.in, interval);
    let reversed = +start > +end;
    const endTime = reversed ? +start : +end;
    const date = reversed ? end : start;
    date.setHours(0, 0, 0, 0);
    let step = 1;
    const dates = [];
    while (+date <= endTime) {
      dates.push(constructFrom(start, date));
      date.setDate(date.getDate() + step);
      date.setHours(0, 0, 0, 0);
    }
    return reversed ? dates.reverse() : dates;
  }
  function startOfMonth(date, options) {
    const _date = toDate(date, options?.in);
    _date.setDate(1);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function startOfYear(date, options) {
    const date_ = toDate(date, options?.in);
    date_.setFullYear(date_.getFullYear(), 0, 1);
    date_.setHours(0, 0, 0, 0);
    return date_;
  }
  function endOfWeek(date, options) {
    const defaultOptions = getDefaultOptions$1();
    const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
    const _date = toDate(date, options?.in);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
    _date.setDate(_date.getDate() + diff);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  const formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  const formatDistance = (token, count, options) => {
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options?.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }
    return result;
  };
  function buildFormatLongFn(args) {
    return (options = {}) => {
      const width = options.width ? String(options.width) : args.defaultWidth;
      const format = args.formats[width] || args.formats[args.defaultWidth];
      return format;
    };
  }
  const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  const formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
  const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
  const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
  function buildLocalizeFn(args) {
    return (value, options) => {
      const context = options?.context ? String(options.context) : "standalone";
      let valuesArray;
      if (context === "formatting" && args.formattingValues) {
        const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        const width = options?.width ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        const defaultWidth = args.defaultWidth;
        const width = options?.width ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[width] || args.values[defaultWidth];
      }
      const index = args.argumentCallback ? args.argumentCallback(value) : value;
      return valuesArray[index];
    };
  }
  const eraValues = {
    narrow: [ "B", "A" ],
    abbreviated: [ "BC", "AD" ],
    wide: [ "Before Christ", "Anno Domini" ]
  };
  const quarterValues = {
    narrow: [ "1", "2", "3", "4" ],
    abbreviated: [ "Q1", "Q2", "Q3", "Q4" ],
    wide: [ "1st quarter", "2nd quarter", "3rd quarter", "4th quarter" ]
  };
  const monthValues = {
    narrow: [ "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D" ],
    abbreviated: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    wide: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
  };
  const dayValues = {
    narrow: [ "S", "M", "T", "W", "T", "F", "S" ],
    short: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
    abbreviated: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    wide: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
  };
  const dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  const formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  const ordinalNumber = (dirtyNumber, _options) => {
    const number = Number(dirtyNumber);
    const rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
       case 1:
        return number + "st";

       case 2:
        return number + "nd";

       case 3:
        return number + "rd";
      }
    }
    return number + "th";
  };
  const localize = {
    ordinalNumber: ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: quarter => quarter - 1
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
  function buildMatchFn(args) {
    return (string, options = {}) => {
      const width = options.width;
      const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      const matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      const matchedString = matchResult[0];
      const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, pattern => pattern.test(matchedString)) : findKey(parsePatterns, pattern => pattern.test(matchedString));
      let value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? options.valueCallback(value) : value;
      const rest = string.slice(matchedString.length);
      return {
        value: value,
        rest: rest
      };
    };
  }
  function findKey(object, predicate) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
        return key;
      }
    }
    return undefined;
  }
  function findIndex(array, predicate) {
    for (let key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return undefined;
  }
  function buildMatchPatternFn(args) {
    return (string, options = {}) => {
      const matchResult = string.match(args.matchPattern);
      if (!matchResult) return null;
      const matchedString = matchResult[0];
      const parseResult = string.match(args.parsePattern);
      if (!parseResult) return null;
      let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      const rest = string.slice(matchedString.length);
      return {
        value: value,
        rest: rest
      };
    };
  }
  const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  const parseOrdinalNumberPattern = /\d+/i;
  const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  const parseEraPatterns = {
    any: [ /^b/i, /^(a|c)/i ]
  };
  const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  const parseQuarterPatterns = {
    any: [ /1/i, /2/i, /3/i, /4/i ]
  };
  const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  const parseMonthPatterns = {
    narrow: [ /^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i ],
    any: [ /^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i ]
  };
  const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  const parseDayPatterns = {
    narrow: [ /^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i ],
    any: [ /^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i ]
  };
  const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  const parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  const match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: value => parseInt(value, 10)
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: index => index + 1
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
  const enUS = {
    code: "en-US",
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  function getDayOfYear(date, options) {
    const _date = toDate(date, options?.in);
    const diff = differenceInCalendarDays(_date, startOfYear(_date));
    const dayOfYear = diff + 1;
    return dayOfYear;
  }
  function getISOWeek(date, options) {
    const _date = toDate(date, options?.in);
    const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function getWeekYear(date, options) {
    const _date = toDate(date, options?.in);
    const year = _date.getFullYear();
    const defaultOptions = getDefaultOptions$1();
    const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
    const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
    firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
    const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
    firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
    if (+_date >= +startOfNextYear) {
      return year + 1;
    } else if (+_date >= +startOfThisYear) {
      return year;
    } else {
      return year - 1;
    }
  }
  function startOfWeekYear(date, options) {
    const defaultOptions = getDefaultOptions$1();
    const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
    const year = getWeekYear(date, options);
    const firstWeek = constructFrom(options?.in || date, 0);
    firstWeek.setFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setHours(0, 0, 0, 0);
    const _date = startOfWeek(firstWeek, options);
    return _date;
  }
  function getWeek(date, options) {
    const _date = toDate(date, options?.in);
    const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function addLeadingZeros(number, targetLength) {
    const sign = number < 0 ? "-" : "";
    const output = Math.abs(number).toString().padStart(targetLength, "0");
    return sign + output;
  }
  const lightFormatters = {
    y(date, token) {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
    },
    M(date, token) {
      const month = date.getMonth();
      return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    d(date, token) {
      return addLeadingZeros(date.getDate(), token.length);
    },
    a(date, token) {
      const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
      switch (token) {
       case "a":
       case "aa":
        return dayPeriodEnumValue.toUpperCase();

       case "aaa":
        return dayPeriodEnumValue;

       case "aaaaa":
        return dayPeriodEnumValue[0];

       case "aaaa":
       default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
      }
    },
    h(date, token) {
      return addLeadingZeros(date.getHours() % 12 || 12, token.length);
    },
    H(date, token) {
      return addLeadingZeros(date.getHours(), token.length);
    },
    m(date, token) {
      return addLeadingZeros(date.getMinutes(), token.length);
    },
    s(date, token) {
      return addLeadingZeros(date.getSeconds(), token.length);
    },
    S(date, token) {
      const numberOfDigits = token.length;
      const milliseconds = date.getMilliseconds();
      const fractionalSeconds = Math.trunc(milliseconds * Math.pow(10, numberOfDigits - 3));
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };
  const dayPeriodEnum = {
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  };
  const formatters = {
    G: function(date, token, localize) {
      const era = date.getFullYear() > 0 ? 1 : 0;
      switch (token) {
       case "G":
       case "GG":
       case "GGG":
        return localize.era(era, {
          width: "abbreviated"
        });

       case "GGGGG":
        return localize.era(era, {
          width: "narrow"
        });

       case "GGGG":
       default:
        return localize.era(era, {
          width: "wide"
        });
      }
    },
    y: function(date, token, localize) {
      if (token === "yo") {
        const signedYear = date.getFullYear();
        const year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize.ordinalNumber(year, {
          unit: "year"
        });
      }
      return lightFormatters.y(date, token);
    },
    Y: function(date, token, localize, options) {
      const signedWeekYear = getWeekYear(date, options);
      const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
      if (token === "YY") {
        const twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }
      if (token === "Yo") {
        return localize.ordinalNumber(weekYear, {
          unit: "year"
        });
      }
      return addLeadingZeros(weekYear, token.length);
    },
    R: function(date, token) {
      const isoWeekYear = getISOWeekYear(date);
      return addLeadingZeros(isoWeekYear, token.length);
    },
    u: function(date, token) {
      const year = date.getFullYear();
      return addLeadingZeros(year, token.length);
    },
    Q: function(date, token, localize) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
       case "Q":
        return String(quarter);

       case "QQ":
        return addLeadingZeros(quarter, 2);

       case "Qo":
        return localize.ordinalNumber(quarter, {
          unit: "quarter"
        });

       case "QQQ":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });

       case "QQQQQ":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });

       case "QQQQ":
       default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    q: function(date, token, localize) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
       case "q":
        return String(quarter);

       case "qq":
        return addLeadingZeros(quarter, 2);

       case "qo":
        return localize.ordinalNumber(quarter, {
          unit: "quarter"
        });

       case "qqq":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });

       case "qqqqq":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });

       case "qqqq":
       default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
      }
    },
    M: function(date, token, localize) {
      const month = date.getMonth();
      switch (token) {
       case "M":
       case "MM":
        return lightFormatters.M(date, token);

       case "Mo":
        return localize.ordinalNumber(month + 1, {
          unit: "month"
        });

       case "MMM":
        return localize.month(month, {
          width: "abbreviated",
          context: "formatting"
        });

       case "MMMMM":
        return localize.month(month, {
          width: "narrow",
          context: "formatting"
        });

       case "MMMM":
       default:
        return localize.month(month, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    L: function(date, token, localize) {
      const month = date.getMonth();
      switch (token) {
       case "L":
        return String(month + 1);

       case "LL":
        return addLeadingZeros(month + 1, 2);

       case "Lo":
        return localize.ordinalNumber(month + 1, {
          unit: "month"
        });

       case "LLL":
        return localize.month(month, {
          width: "abbreviated",
          context: "standalone"
        });

       case "LLLLL":
        return localize.month(month, {
          width: "narrow",
          context: "standalone"
        });

       case "LLLL":
       default:
        return localize.month(month, {
          width: "wide",
          context: "standalone"
        });
      }
    },
    w: function(date, token, localize, options) {
      const week = getWeek(date, options);
      if (token === "wo") {
        return localize.ordinalNumber(week, {
          unit: "week"
        });
      }
      return addLeadingZeros(week, token.length);
    },
    I: function(date, token, localize) {
      const isoWeek = getISOWeek(date);
      if (token === "Io") {
        return localize.ordinalNumber(isoWeek, {
          unit: "week"
        });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    d: function(date, token, localize) {
      if (token === "do") {
        return localize.ordinalNumber(date.getDate(), {
          unit: "date"
        });
      }
      return lightFormatters.d(date, token);
    },
    D: function(date, token, localize) {
      const dayOfYear = getDayOfYear(date);
      if (token === "Do") {
        return localize.ordinalNumber(dayOfYear, {
          unit: "dayOfYear"
        });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    E: function(date, token, localize) {
      const dayOfWeek = date.getDay();
      switch (token) {
       case "E":
       case "EE":
       case "EEE":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });

       case "EEEEE":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });

       case "EEEEEE":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });

       case "EEEE":
       default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    e: function(date, token, localize, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
       case "e":
        return String(localDayOfWeek);

       case "ee":
        return addLeadingZeros(localDayOfWeek, 2);

       case "eo":
        return localize.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });

       case "eee":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });

       case "eeeee":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });

       case "eeeeee":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });

       case "eeee":
       default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    c: function(date, token, localize, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
       case "c":
        return String(localDayOfWeek);

       case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);

       case "co":
        return localize.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });

       case "ccc":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });

       case "ccccc":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });

       case "cccccc":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });

       case "cccc":
       default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
      }
    },
    i: function(date, token, localize) {
      const dayOfWeek = date.getDay();
      const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
       case "i":
        return String(isoDayOfWeek);

       case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);

       case "io":
        return localize.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });

       case "iii":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });

       case "iiiii":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });

       case "iiiiii":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });

       case "iiii":
       default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    a: function(date, token, localize) {
      const hours = date.getHours();
      const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      switch (token) {
       case "a":
       case "aa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });

       case "aaa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();

       case "aaaaa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });

       case "aaaa":
       default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    b: function(date, token, localize) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      }
      switch (token) {
       case "b":
       case "bb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });

       case "bbb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();

       case "bbbbb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });

       case "bbbb":
       default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    B: function(date, token, localize) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
       case "B":
       case "BB":
       case "BBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });

       case "BBBBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });

       case "BBBB":
       default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
      }
    },
    h: function(date, token, localize) {
      if (token === "ho") {
        let hours = date.getHours() % 12;
        if (hours === 0) hours = 12;
        return localize.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return lightFormatters.h(date, token);
    },
    H: function(date, token, localize) {
      if (token === "Ho") {
        return localize.ordinalNumber(date.getHours(), {
          unit: "hour"
        });
      }
      return lightFormatters.H(date, token);
    },
    K: function(date, token, localize) {
      const hours = date.getHours() % 12;
      if (token === "Ko") {
        return localize.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    k: function(date, token, localize) {
      let hours = date.getHours();
      if (hours === 0) hours = 24;
      if (token === "ko") {
        return localize.ordinalNumber(hours, {
          unit: "hour"
        });
      }
      return addLeadingZeros(hours, token.length);
    },
    m: function(date, token, localize) {
      if (token === "mo") {
        return localize.ordinalNumber(date.getMinutes(), {
          unit: "minute"
        });
      }
      return lightFormatters.m(date, token);
    },
    s: function(date, token, localize) {
      if (token === "so") {
        return localize.ordinalNumber(date.getSeconds(), {
          unit: "second"
        });
      }
      return lightFormatters.s(date, token);
    },
    S: function(date, token) {
      return lightFormatters.S(date, token);
    },
    X: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return "Z";
      }
      switch (token) {
       case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

       case "XXXX":
       case "XX":
        return formatTimezone(timezoneOffset);

       case "XXXXX":
       case "XXX":
       default:
        return formatTimezone(timezoneOffset, ":");
      }
    },
    x: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
       case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

       case "xxxx":
       case "xx":
        return formatTimezone(timezoneOffset);

       case "xxxxx":
       case "xxx":
       default:
        return formatTimezone(timezoneOffset, ":");
      }
    },
    O: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
       case "O":
       case "OO":
       case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");

       case "OOOO":
       default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    z: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
       case "z":
       case "zz":
       case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");

       case "zzzz":
       default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    t: function(date, token, _localize) {
      const timestamp = Math.trunc(+date / 1e3);
      return addLeadingZeros(timestamp, token.length);
    },
    T: function(date, token, _localize) {
      return addLeadingZeros(+date, token.length);
    }
  };
  function formatTimezoneShort(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = Math.trunc(absOffset / 60);
    const minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours);
    }
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, delimiter) {
    if (offset % 60 === 0) {
      const sign = offset > 0 ? "-" : "+";
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, delimiter);
  }
  function formatTimezone(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
    const minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
  }
  const dateLongFormatter = (pattern, formatLong) => {
    switch (pattern) {
     case "P":
      return formatLong.date({
        width: "short"
      });

     case "PP":
      return formatLong.date({
        width: "medium"
      });

     case "PPP":
      return formatLong.date({
        width: "long"
      });

     case "PPPP":
     default:
      return formatLong.date({
        width: "full"
      });
    }
  };
  const timeLongFormatter = (pattern, formatLong) => {
    switch (pattern) {
     case "p":
      return formatLong.time({
        width: "short"
      });

     case "pp":
      return formatLong.time({
        width: "medium"
      });

     case "ppp":
      return formatLong.time({
        width: "long"
      });

     case "pppp":
     default:
      return formatLong.time({
        width: "full"
      });
    }
  };
  const dateTimeLongFormatter = (pattern, formatLong) => {
    const matchResult = pattern.match(/(P+)(p+)?/) || [];
    const datePattern = matchResult[1];
    const timePattern = matchResult[2];
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong);
    }
    let dateTimeFormat;
    switch (datePattern) {
     case "P":
      dateTimeFormat = formatLong.dateTime({
        width: "short"
      });
      break;

     case "PP":
      dateTimeFormat = formatLong.dateTime({
        width: "medium"
      });
      break;

     case "PPP":
      dateTimeFormat = formatLong.dateTime({
        width: "long"
      });
      break;

     case "PPPP":
     default:
      dateTimeFormat = formatLong.dateTime({
        width: "full"
      });
      break;
    }
    return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong)).replace("{{time}}", timeLongFormatter(timePattern, formatLong));
  };
  const longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };
  const dayOfYearTokenRE = /^D+$/;
  const weekYearTokenRE = /^Y+$/;
  const throwTokens = [ "D", "DD", "YY", "YYYY" ];
  function isProtectedDayOfYearToken(token) {
    return dayOfYearTokenRE.test(token);
  }
  function isProtectedWeekYearToken(token) {
    return weekYearTokenRE.test(token);
  }
  function warnOrThrowProtectedError(token, format, input) {
    const _message = message(token, format, input);
    console.warn(_message);
    if (throwTokens.includes(token)) throw new RangeError(_message);
  }
  function message(token, format, input) {
    const subject = token[0] === "Y" ? "years" : "days of the month";
    return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
  }
  const formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  const longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const escapedStringRegExp$1 = /^'([^]*?)'?$/;
  const doubleQuoteRegExp$1 = /''/g;
  const unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;
  function format(date, formatStr, options) {
    const defaultOptions = getDefaultOptions$1();
    const locale = defaultOptions.locale ?? enUS;
    const firstWeekContainsDate = defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
    const weekStartsOn = defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
    const originalDate = toDate(date, options?.in);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    let parts = formatStr.match(longFormattingTokensRegExp$1).map(substring => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp$1).map(substring => {
      if (substring === "''") {
        return {
          isToken: false,
          value: "'"
        };
      }
      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return {
          isToken: false,
          value: cleanEscapedString$1(substring)
        };
      }
      if (formatters[firstCharacter]) {
        return {
          isToken: true,
          value: substring
        };
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp$1)) {
        throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
      }
      return {
        isToken: false,
        value: substring
      };
    });
    if (locale.localize.preprocessor) {
      parts = locale.localize.preprocessor(originalDate, parts);
    }
    const formatterOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale
    };
    return parts.map(part => {
      if (!part.isToken) return part.value;
      const token = part.value;
      if (isProtectedWeekYearToken(token) || isProtectedDayOfYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, String(date));
      }
      const formatter = formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    }).join("");
  }
  function cleanEscapedString$1(input) {
    const matched = input.match(escapedStringRegExp$1);
    if (!matched) {
      return input;
    }
    return matched[1].replace(doubleQuoteRegExp$1, "'");
  }
  function getDaysInMonth(date, options) {
    const _date = toDate(date, options?.in);
    const year = _date.getFullYear();
    const monthIndex = _date.getMonth();
    const lastDayOfMonth = constructFrom(_date, 0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }
  function getDefaultOptions() {
    return Object.assign({}, getDefaultOptions$1());
  }
  function getISODay(date, options) {
    const day = toDate(date, options?.in).getDay();
    return day === 0 ? 7 : day;
  }
  function getMonth(date, options) {
    return toDate(date, options?.in).getMonth();
  }
  function getYear(date, options) {
    return toDate(date, options?.in).getFullYear();
  }
  function isAfter(date, dateToCompare) {
    return +toDate(date) > +toDate(dateToCompare);
  }
  function isBefore(date, dateToCompare) {
    return +toDate(date) < +toDate(dateToCompare);
  }
  function transpose(date, constructor) {
    const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
    date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    date_.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return date_;
  }
  function isConstructor(constructor) {
    return typeof constructor === "function" && constructor.prototype?.constructor === constructor;
  }
  const TIMEZONE_UNIT_PRIORITY = 10;
  class Setter {
    subPriority=0;
    validate(_utcDate, _options) {
      return true;
    }
  }
  class ValueSetter extends Setter {
    constructor(value, validateValue, setValue, priority, subPriority) {
      super();
      this.value = value;
      this.validateValue = validateValue;
      this.setValue = setValue;
      this.priority = priority;
      if (subPriority) {
        this.subPriority = subPriority;
      }
    }
    validate(date, options) {
      return this.validateValue(date, this.value, options);
    }
    set(date, flags, options) {
      return this.setValue(date, flags, this.value, options);
    }
  }
  class DateTimezoneSetter extends Setter {
    priority=TIMEZONE_UNIT_PRIORITY;
    subPriority=-1;
    constructor(context, reference) {
      super();
      this.context = context || (date => constructFrom(reference, date));
    }
    set(date, flags) {
      if (flags.timestampIsSet) return date;
      return constructFrom(date, transpose(date, this.context));
    }
  }
  class Parser {
    run(dateString, token, match, options) {
      const result = this.parse(dateString, token, match, options);
      if (!result) {
        return null;
      }
      return {
        setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
        rest: result.rest
      };
    }
    validate(_utcDate, _value, _options) {
      return true;
    }
  }
  class EraParser extends Parser {
    priority=140;
    parse(dateString, token, match) {
      switch (token) {
       case "G":
       case "GG":
       case "GGG":
        return match.era(dateString, {
          width: "abbreviated"
        }) || match.era(dateString, {
          width: "narrow"
        });

       case "GGGGG":
        return match.era(dateString, {
          width: "narrow"
        });

       case "GGGG":
       default:
        return match.era(dateString, {
          width: "wide"
        }) || match.era(dateString, {
          width: "abbreviated"
        }) || match.era(dateString, {
          width: "narrow"
        });
      }
    }
    set(date, flags, value) {
      flags.era = value;
      date.setFullYear(value, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "R", "u", "t", "T" ];
  }
  const numericPatterns = {
    month: /^(1[0-2]|0?\d)/,
    date: /^(3[0-1]|[0-2]?\d)/,
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    week: /^(5[0-3]|[0-4]?\d)/,
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    hour11h: /^(1[0-1]|0?\d)/,
    hour12h: /^(1[0-2]|0?\d)/,
    minute: /^[0-5]?\d/,
    second: /^[0-5]?\d/,
    singleDigit: /^\d/,
    twoDigits: /^\d{1,2}/,
    threeDigits: /^\d{1,3}/,
    fourDigits: /^\d{1,4}/,
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    twoDigitsSigned: /^-?\d{1,2}/,
    threeDigitsSigned: /^-?\d{1,3}/,
    fourDigitsSigned: /^-?\d{1,4}/
  };
  const timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
  };
  function mapValue(parseFnResult, mapFn) {
    if (!parseFnResult) {
      return parseFnResult;
    }
    return {
      value: mapFn(parseFnResult.value),
      rest: parseFnResult.rest
    };
  }
  function parseNumericPattern(pattern, dateString) {
    const matchResult = dateString.match(pattern);
    if (!matchResult) {
      return null;
    }
    return {
      value: parseInt(matchResult[0], 10),
      rest: dateString.slice(matchResult[0].length)
    };
  }
  function parseTimezonePattern(pattern, dateString) {
    const matchResult = dateString.match(pattern);
    if (!matchResult) {
      return null;
    }
    if (matchResult[0] === "Z") {
      return {
        value: 0,
        rest: dateString.slice(1)
      };
    }
    const sign = matchResult[1] === "+" ? 1 : -1;
    const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
    const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
    const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
    return {
      value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
      rest: dateString.slice(matchResult[0].length)
    };
  }
  function parseAnyDigitsSigned(dateString) {
    return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
  }
  function parseNDigits(n, dateString) {
    switch (n) {
     case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);

     case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);

     case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);

     case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);

     default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
    }
  }
  function parseNDigitsSigned(n, dateString) {
    switch (n) {
     case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);

     case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);

     case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);

     case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);

     default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
    }
  }
  function dayPeriodEnumToHours(dayPeriod) {
    switch (dayPeriod) {
     case "morning":
      return 4;

     case "evening":
      return 17;

     case "pm":
     case "noon":
     case "afternoon":
      return 12;

     case "am":
     case "midnight":
     case "night":
     default:
      return 0;
    }
  }
  function normalizeTwoDigitYear(twoDigitYear, currentYear) {
    const isCommonEra = currentYear > 0;
    const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
    let result;
    if (absCurrentYear <= 50) {
      result = twoDigitYear || 100;
    } else {
      const rangeEnd = absCurrentYear + 50;
      const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
      const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
      result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
    }
    return isCommonEra ? result : 1 - result;
  }
  function isLeapYearIndex$1(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
  }
  class YearParser extends Parser {
    priority=130;
    incompatibleTokens=[ "Y", "R", "u", "w", "I", "i", "e", "c", "t", "T" ];
    parse(dateString, token, match) {
      const valueCallback = year => ({
        year: year,
        isTwoDigitYear: token === "yy"
      });
      switch (token) {
       case "y":
        return mapValue(parseNDigits(4, dateString), valueCallback);

       case "yo":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "year"
        }), valueCallback);

       default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
    set(date, flags, value) {
      const currentYear = date.getFullYear();
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setFullYear(normalizedTwoDigitYear, 0, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setFullYear(year, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class LocalWeekYearParser extends Parser {
    priority=130;
    parse(dateString, token, match) {
      const valueCallback = year => ({
        year: year,
        isTwoDigitYear: token === "YY"
      });
      switch (token) {
       case "Y":
        return mapValue(parseNDigits(4, dateString), valueCallback);

       case "Yo":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "year"
        }), valueCallback);

       default:
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
    set(date, flags, value, options) {
      const currentYear = getWeekYear(date, options);
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
        date.setHours(0, 0, 0, 0);
        return startOfWeek(date, options);
      }
      const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setFullYear(year, 0, options.firstWeekContainsDate);
      date.setHours(0, 0, 0, 0);
      return startOfWeek(date, options);
    }
    incompatibleTokens=[ "y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T" ];
  }
  class ISOWeekYearParser extends Parser {
    priority=130;
    parse(dateString, token) {
      if (token === "R") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
    set(date, _flags, value) {
      const firstWeekOfYear = constructFrom(date, 0);
      firstWeekOfYear.setFullYear(value, 0, 4);
      firstWeekOfYear.setHours(0, 0, 0, 0);
      return startOfISOWeek(firstWeekOfYear);
    }
    incompatibleTokens=[ "G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T" ];
  }
  class ExtendedYearParser extends Parser {
    priority=130;
    parse(dateString, token) {
      if (token === "u") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
    set(date, _flags, value) {
      date.setFullYear(value, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T" ];
  }
  class QuarterParser extends Parser {
    priority=120;
    parse(dateString, token, match) {
      switch (token) {
       case "Q":
       case "QQ":
        return parseNDigits(token.length, dateString);

       case "Qo":
        return match.ordinalNumber(dateString, {
          unit: "quarter"
        });

       case "QQQ":
        return match.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "QQQQQ":
        return match.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "QQQQ":
       default:
        return match.quarter(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.quarter(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.quarter(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4;
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T" ];
  }
  class StandAloneQuarterParser extends Parser {
    priority=120;
    parse(dateString, token, match) {
      switch (token) {
       case "q":
       case "qq":
        return parseNDigits(token.length, dateString);

       case "qo":
        return match.ordinalNumber(dateString, {
          unit: "quarter"
        });

       case "qqq":
        return match.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "qqqqq":
        return match.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "qqqq":
       default:
        return match.quarter(dateString, {
          width: "wide",
          context: "standalone"
        }) || match.quarter(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.quarter(dateString, {
          width: "narrow",
          context: "standalone"
        });
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4;
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T" ];
  }
  class MonthParser extends Parser {
    incompatibleTokens=[ "Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T" ];
    priority=110;
    parse(dateString, token, match) {
      const valueCallback = value => value - 1;
      switch (token) {
       case "M":
        return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);

       case "MM":
        return mapValue(parseNDigits(2, dateString), valueCallback);

       case "Mo":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "month"
        }), valueCallback);

       case "MMM":
        return match.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.month(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "MMMMM":
        return match.month(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "MMMM":
       default:
        return match.month(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.month(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.month(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      date.setMonth(value, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class StandAloneMonthParser extends Parser {
    priority=110;
    parse(dateString, token, match) {
      const valueCallback = value => value - 1;
      switch (token) {
       case "L":
        return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);

       case "LL":
        return mapValue(parseNDigits(2, dateString), valueCallback);

       case "Lo":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "month"
        }), valueCallback);

       case "LLL":
        return match.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.month(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "LLLLL":
        return match.month(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "LLLL":
       default:
        return match.month(dateString, {
          width: "wide",
          context: "standalone"
        }) || match.month(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.month(dateString, {
          width: "narrow",
          context: "standalone"
        });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      date.setMonth(value, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T" ];
  }
  function setWeek(date, week, options) {
    const date_ = toDate(date, options?.in);
    const diff = getWeek(date_, options) - week;
    date_.setDate(date_.getDate() - diff * 7);
    return toDate(date_, options?.in);
  }
  class LocalWeekParser extends Parser {
    priority=100;
    parse(dateString, token, match) {
      switch (token) {
       case "w":
        return parseNumericPattern(numericPatterns.week, dateString);

       case "wo":
        return match.ordinalNumber(dateString, {
          unit: "week"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53;
    }
    set(date, _flags, value, options) {
      return startOfWeek(setWeek(date, value, options), options);
    }
    incompatibleTokens=[ "y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T" ];
  }
  function setISOWeek(date, week, options) {
    const _date = toDate(date, options?.in);
    const diff = getISOWeek(_date, options) - week;
    _date.setDate(_date.getDate() - diff * 7);
    return _date;
  }
  class ISOWeekParser extends Parser {
    priority=100;
    parse(dateString, token, match) {
      switch (token) {
       case "I":
        return parseNumericPattern(numericPatterns.week, dateString);

       case "Io":
        return match.ordinalNumber(dateString, {
          unit: "week"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53;
    }
    set(date, _flags, value) {
      return startOfISOWeek(setISOWeek(date, value));
    }
    incompatibleTokens=[ "y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T" ];
  }
  const DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  const DAYS_IN_MONTH_LEAP_YEAR = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  class DateParser extends Parser {
    priority=90;
    subPriority=1;
    parse(dateString, token, match) {
      switch (token) {
       case "d":
        return parseNumericPattern(numericPatterns.date, dateString);

       case "do":
        return match.ordinalNumber(dateString, {
          unit: "date"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(date, value) {
      const year = date.getFullYear();
      const isLeapYear = isLeapYearIndex$1(year);
      const month = date.getMonth();
      if (isLeapYear) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    }
    set(date, _flags, value) {
      date.setDate(value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T" ];
  }
  class DayOfYearParser extends Parser {
    priority=90;
    subpriority=1;
    parse(dateString, token, match) {
      switch (token) {
       case "D":
       case "DD":
        return parseNumericPattern(numericPatterns.dayOfYear, dateString);

       case "Do":
        return match.ordinalNumber(dateString, {
          unit: "date"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(date, value) {
      const year = date.getFullYear();
      const isLeapYear = isLeapYearIndex$1(year);
      if (isLeapYear) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    }
    set(date, _flags, value) {
      date.setMonth(0, value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T" ];
  }
  function setDay(date, day, options) {
    const defaultOptions = getDefaultOptions$1();
    const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
    const date_ = toDate(date, options?.in);
    const currentDay = date_.getDay();
    const remainder = day % 7;
    const dayIndex = (remainder + 7) % 7;
    const delta = 7 - weekStartsOn;
    const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
    return addDays(date_, diff, options);
  }
  class DayParser extends Parser {
    priority=90;
    parse(dateString, token, match) {
      switch (token) {
       case "E":
       case "EE":
       case "EEE":
        return match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "EEEEE":
        return match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "EEEEEE":
        return match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "EEEE":
       default:
        return match.day(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "D", "i", "e", "c", "t", "T" ];
  }
  class LocalDayParser extends Parser {
    priority=90;
    parse(dateString, token, match, options) {
      const valueCallback = value => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
       case "e":
       case "ee":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);

       case "eo":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "day"
        }), valueCallback);

       case "eee":
        return match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "eeeee":
        return match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "eeeeee":
        return match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "eeee":
       default:
        return match.day(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T" ];
  }
  class StandAloneLocalDayParser extends Parser {
    priority=90;
    parse(dateString, token, match, options) {
      const valueCallback = value => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
       case "c":
       case "cc":
        return mapValue(parseNDigits(token.length, dateString), valueCallback);

       case "co":
        return mapValue(match.ordinalNumber(dateString, {
          unit: "day"
        }), valueCallback);

       case "ccc":
        return match.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.day(dateString, {
          width: "short",
          context: "standalone"
        }) || match.day(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "ccccc":
        return match.day(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "cccccc":
        return match.day(dateString, {
          width: "short",
          context: "standalone"
        }) || match.day(dateString, {
          width: "narrow",
          context: "standalone"
        });

       case "cccc":
       default:
        return match.day(dateString, {
          width: "wide",
          context: "standalone"
        }) || match.day(dateString, {
          width: "abbreviated",
          context: "standalone"
        }) || match.day(dateString, {
          width: "short",
          context: "standalone"
        }) || match.day(dateString, {
          width: "narrow",
          context: "standalone"
        });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T" ];
  }
  function setISODay(date, day, options) {
    const date_ = toDate(date, options?.in);
    const currentDay = getISODay(date_, options);
    const diff = day - currentDay;
    return addDays(date_, diff, options);
  }
  class ISODayParser extends Parser {
    priority=90;
    parse(dateString, token, match) {
      const valueCallback = value => {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
       case "i":
       case "ii":
        return parseNDigits(token.length, dateString);

       case "io":
        return match.ordinalNumber(dateString, {
          unit: "day"
        });

       case "iii":
        return mapValue(match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        }), valueCallback);

       case "iiiii":
        return mapValue(match.day(dateString, {
          width: "narrow",
          context: "formatting"
        }), valueCallback);

       case "iiiiii":
        return mapValue(match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        }), valueCallback);

       case "iiii":
       default:
        return mapValue(match.day(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.day(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.day(dateString, {
          width: "short",
          context: "formatting"
        }) || match.day(dateString, {
          width: "narrow",
          context: "formatting"
        }), valueCallback);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 7;
    }
    set(date, _flags, value) {
      date = setISODay(date, value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T" ];
  }
  class AMPMParser extends Parser {
    priority=80;
    parse(dateString, token, match) {
      switch (token) {
       case "a":
       case "aa":
       case "aaa":
        return match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "aaaaa":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "aaaa":
       default:
        return match.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "b", "B", "H", "k", "t", "T" ];
  }
  class AMPMMidnightParser extends Parser {
    priority=80;
    parse(dateString, token, match) {
      switch (token) {
       case "b":
       case "bb":
       case "bbb":
        return match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "bbbbb":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "bbbb":
       default:
        return match.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "a", "B", "H", "k", "t", "T" ];
  }
  class DayPeriodParser extends Parser {
    priority=80;
    parse(dateString, token, match) {
      switch (token) {
       case "B":
       case "BB":
       case "BBB":
        return match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "BBBBB":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });

       case "BBBB":
       default:
        return match.dayPeriod(dateString, {
          width: "wide",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "abbreviated",
          context: "formatting"
        }) || match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting"
        });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "a", "b", "t", "T" ];
  }
  class Hour1to12Parser extends Parser {
    priority=70;
    parse(dateString, token, match) {
      switch (token) {
       case "h":
        return parseNumericPattern(numericPatterns.hour12h, dateString);

       case "ho":
        return match.ordinalNumber(dateString, {
          unit: "hour"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 12;
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12;
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setHours(0, 0, 0, 0);
      } else {
        date.setHours(value, 0, 0, 0);
      }
      return date;
    }
    incompatibleTokens=[ "H", "K", "k", "t", "T" ];
  }
  class Hour0to23Parser extends Parser {
    priority=70;
    parse(dateString, token, match) {
      switch (token) {
       case "H":
        return parseNumericPattern(numericPatterns.hour23h, dateString);

       case "Ho":
        return match.ordinalNumber(dateString, {
          unit: "hour"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 23;
    }
    set(date, _flags, value) {
      date.setHours(value, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "a", "b", "h", "K", "k", "t", "T" ];
  }
  class Hour0To11Parser extends Parser {
    priority=70;
    parse(dateString, token, match) {
      switch (token) {
       case "K":
        return parseNumericPattern(numericPatterns.hour11h, dateString);

       case "Ko":
        return match.ordinalNumber(dateString, {
          unit: "hour"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12;
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0);
      } else {
        date.setHours(value, 0, 0, 0);
      }
      return date;
    }
    incompatibleTokens=[ "h", "H", "k", "t", "T" ];
  }
  class Hour1To24Parser extends Parser {
    priority=70;
    parse(dateString, token, match) {
      switch (token) {
       case "k":
        return parseNumericPattern(numericPatterns.hour24h, dateString);

       case "ko":
        return match.ordinalNumber(dateString, {
          unit: "hour"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 24;
    }
    set(date, _flags, value) {
      const hours = value <= 24 ? value % 24 : value;
      date.setHours(hours, 0, 0, 0);
      return date;
    }
    incompatibleTokens=[ "a", "b", "h", "H", "K", "t", "T" ];
  }
  class MinuteParser extends Parser {
    priority=60;
    parse(dateString, token, match) {
      switch (token) {
       case "m":
        return parseNumericPattern(numericPatterns.minute, dateString);

       case "mo":
        return match.ordinalNumber(dateString, {
          unit: "minute"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59;
    }
    set(date, _flags, value) {
      date.setMinutes(value, 0, 0);
      return date;
    }
    incompatibleTokens=[ "t", "T" ];
  }
  class SecondParser extends Parser {
    priority=50;
    parse(dateString, token, match) {
      switch (token) {
       case "s":
        return parseNumericPattern(numericPatterns.second, dateString);

       case "so":
        return match.ordinalNumber(dateString, {
          unit: "second"
        });

       default:
        return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59;
    }
    set(date, _flags, value) {
      date.setSeconds(value, 0);
      return date;
    }
    incompatibleTokens=[ "t", "T" ];
  }
  class FractionOfSecondParser extends Parser {
    priority=30;
    parse(dateString, token) {
      const valueCallback = value => Math.trunc(value * Math.pow(10, -token.length + 3));
      return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
    set(date, _flags, value) {
      date.setMilliseconds(value);
      return date;
    }
    incompatibleTokens=[ "t", "T" ];
  }
  class ISOTimezoneWithZParser extends Parser {
    priority=10;
    parse(dateString, token) {
      switch (token) {
       case "X":
        return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);

       case "XX":
        return parseTimezonePattern(timezonePatterns.basic, dateString);

       case "XXXX":
        return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);

       case "XXXXX":
        return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);

       case "XXX":
       default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date;
      return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
    }
    incompatibleTokens=[ "t", "T", "x" ];
  }
  class ISOTimezoneParser extends Parser {
    priority=10;
    parse(dateString, token) {
      switch (token) {
       case "x":
        return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);

       case "xx":
        return parseTimezonePattern(timezonePatterns.basic, dateString);

       case "xxxx":
        return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);

       case "xxxxx":
        return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);

       case "xxx":
       default:
        return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date;
      return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
    }
    incompatibleTokens=[ "t", "T", "X" ];
  }
  class TimestampSecondsParser extends Parser {
    priority=40;
    parse(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
    set(date, _flags, value) {
      return [ constructFrom(date, value * 1e3), {
        timestampIsSet: true
      } ];
    }
    incompatibleTokens="*";
  }
  class TimestampMillisecondsParser extends Parser {
    priority=20;
    parse(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
    set(date, _flags, value) {
      return [ constructFrom(date, value), {
        timestampIsSet: true
      } ];
    }
    incompatibleTokens="*";
  }
  const parsers = {
    G: new EraParser,
    y: new YearParser,
    Y: new LocalWeekYearParser,
    R: new ISOWeekYearParser,
    u: new ExtendedYearParser,
    Q: new QuarterParser,
    q: new StandAloneQuarterParser,
    M: new MonthParser,
    L: new StandAloneMonthParser,
    w: new LocalWeekParser,
    I: new ISOWeekParser,
    d: new DateParser,
    D: new DayOfYearParser,
    E: new DayParser,
    e: new LocalDayParser,
    c: new StandAloneLocalDayParser,
    i: new ISODayParser,
    a: new AMPMParser,
    b: new AMPMMidnightParser,
    B: new DayPeriodParser,
    h: new Hour1to12Parser,
    H: new Hour0to23Parser,
    K: new Hour0To11Parser,
    k: new Hour1To24Parser,
    m: new MinuteParser,
    s: new SecondParser,
    S: new FractionOfSecondParser,
    X: new ISOTimezoneWithZParser,
    x: new ISOTimezoneParser,
    t: new TimestampSecondsParser,
    T: new TimestampMillisecondsParser
  };
  const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const escapedStringRegExp = /^'([^]*?)'?$/;
  const doubleQuoteRegExp = /''/g;
  const notWhitespaceRegExp = /\S/;
  const unescapedLatinCharacterRegExp = /[a-zA-Z]/;
  function parse(dateStr, formatStr, referenceDate, options) {
    const invalidDate = () => constructFrom(referenceDate, NaN);
    const defaultOptions = getDefaultOptions();
    const locale = defaultOptions.locale ?? enUS;
    const firstWeekContainsDate = defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
    const weekStartsOn = defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
    if (!formatStr) return dateStr ? invalidDate() : toDate(referenceDate, options?.in);
    const subFnOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale
    };
    const setters = [ new DateTimezoneSetter(options?.in, referenceDate) ];
    const tokens = formatStr.match(longFormattingTokensRegExp).map(substring => {
      const firstCharacter = substring[0];
      if (firstCharacter in longFormatters) {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp);
    const usedTokens = [];
    for (let token of tokens) {
      if (isProtectedWeekYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, dateStr);
      }
      if (isProtectedDayOfYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, dateStr);
      }
      const firstCharacter = token[0];
      const parser = parsers[firstCharacter];
      if (parser) {
        const {incompatibleTokens: incompatibleTokens} = parser;
        if (Array.isArray(incompatibleTokens)) {
          const incompatibleToken = usedTokens.find(usedToken => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter);
          if (incompatibleToken) {
            throw new RangeError(`The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`);
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
          throw new RangeError(`The format string mustn't contain \`${token}\` and any other token at the same time`);
        }
        usedTokens.push({
          token: firstCharacter,
          fullToken: token
        });
        const parseResult = parser.run(dateStr, token, locale.match, subFnOptions);
        if (!parseResult) {
          return invalidDate();
        }
        setters.push(parseResult.setter);
        dateStr = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString(token);
        }
        if (dateStr.indexOf(token) === 0) {
          dateStr = dateStr.slice(token.length);
        } else {
          return invalidDate();
        }
      }
    }
    if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
      return invalidDate();
    }
    const uniquePrioritySetters = setters.map(setter => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map(priority => setters.filter(setter => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)).map(setterArray => setterArray[0]);
    let date = toDate(referenceDate, options?.in);
    if (isNaN(+date)) return invalidDate();
    const flags = {};
    for (const setter of uniquePrioritySetters) {
      if (!setter.validate(date, subFnOptions)) {
        return invalidDate();
      }
      const result = setter.set(date, flags, subFnOptions);
      if (Array.isArray(result)) {
        date = result[0];
        Object.assign(flags, result[1]);
      } else {
        date = result;
      }
    }
    return date;
  }
  function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
  }
  function isSameMonth(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
    return laterDate_.getFullYear() === earlierDate_.getFullYear() && laterDate_.getMonth() === earlierDate_.getMonth();
  }
  function isToday(date, options) {
    return isSameDay(constructFrom(date, date), constructNow(date));
  }
  function isWithinInterval(date, interval, options) {
    const time = +toDate(date, options?.in);
    const [startTime, endTime] = [ +toDate(interval.start, options?.in), +toDate(interval.end, options?.in) ].sort((a, b) => a - b);
    return time >= startTime && time <= endTime;
  }
  function parseISO(argument, options) {
    const invalidDate = () => constructFrom(options?.in, NaN);
    const additionalDigits = 2;
    const dateStrings = splitDateString(argument);
    let date;
    if (dateStrings.date) {
      const parseYearResult = parseYear(dateStrings.date, additionalDigits);
      date = parseDate(parseYearResult.restDateString, parseYearResult.year);
    }
    if (!date || isNaN(+date)) return invalidDate();
    const timestamp = +date;
    let time = 0;
    let offset;
    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
      if (isNaN(time)) return invalidDate();
    }
    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
      if (isNaN(offset)) return invalidDate();
    } else {
      const tmpDate = new Date(timestamp + time);
      const result = toDate(0, options?.in);
      result.setFullYear(tmpDate.getUTCFullYear(), tmpDate.getUTCMonth(), tmpDate.getUTCDate());
      result.setHours(tmpDate.getUTCHours(), tmpDate.getUTCMinutes(), tmpDate.getUTCSeconds(), tmpDate.getUTCMilliseconds());
      return result;
    }
    return toDate(timestamp + time + offset, options?.in);
  }
  const patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/
  };
  const dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
  const timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
  const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
  function splitDateString(dateString) {
    const dateStrings = {};
    const array = dateString.split(patterns.dateTimeDelimiter);
    let timeString;
    if (array.length > 2) {
      return dateStrings;
    }
    if (/:/.test(array[0])) {
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
      if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
        dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
        timeString = dateString.substr(dateStrings.date.length, dateString.length);
      }
    }
    if (timeString) {
      const token = patterns.timezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], "");
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }
    return dateStrings;
  }
  function parseYear(dateString, additionalDigits) {
    const regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
    const captures = dateString.match(regex);
    if (!captures) return {
      year: NaN,
      restDateString: ""
    };
    const year = captures[1] ? parseInt(captures[1]) : null;
    const century = captures[2] ? parseInt(captures[2]) : null;
    return {
      year: century === null ? year : century * 100,
      restDateString: dateString.slice((captures[1] || captures[2]).length)
    };
  }
  function parseDate(dateString, year) {
    if (year === null) return new Date(NaN);
    const captures = dateString.match(dateRegex);
    if (!captures) return new Date(NaN);
    const isWeekDate = !!captures[4];
    const dayOfYear = parseDateUnit(captures[1]);
    const month = parseDateUnit(captures[2]) - 1;
    const day = parseDateUnit(captures[3]);
    const week = parseDateUnit(captures[4]);
    const dayOfWeek = parseDateUnit(captures[5]) - 1;
    if (isWeekDate) {
      if (!validateWeekDate(year, week, dayOfWeek)) {
        return new Date(NaN);
      }
      return dayOfISOWeekYear(year, week, dayOfWeek);
    } else {
      const date = new Date(0);
      if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
        return new Date(NaN);
      }
      date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
      return date;
    }
  }
  function parseDateUnit(value) {
    return value ? parseInt(value) : 1;
  }
  function parseTime(timeString) {
    const captures = timeString.match(timeRegex);
    if (!captures) return NaN;
    const hours = parseTimeUnit(captures[1]);
    const minutes = parseTimeUnit(captures[2]);
    const seconds = parseTimeUnit(captures[3]);
    if (!validateTime(hours, minutes, seconds)) {
      return NaN;
    }
    return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
  }
  function parseTimeUnit(value) {
    return value && parseFloat(value.replace(",", ".")) || 0;
  }
  function parseTimezone(timezoneString) {
    if (timezoneString === "Z") return 0;
    const captures = timezoneString.match(timezoneRegex);
    if (!captures) return 0;
    const sign = captures[1] === "+" ? -1 : 1;
    const hours = parseInt(captures[2]);
    const minutes = captures[3] && parseInt(captures[3]) || 0;
    if (!validateTimezone(hours, minutes)) {
      return NaN;
    }
    return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
  }
  function dayOfISOWeekYear(isoWeekYear, week, day) {
    const date = new Date(0);
    date.setUTCFullYear(isoWeekYear, 0, 4);
    const fourthOfJanuaryDay = date.getUTCDay() || 7;
    const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }
  const daysInMonths = [ 31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  function isLeapYearIndex(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
  }
  function validateDate(year, month, date) {
    return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
  }
  function validateDayOfYearDate(year, dayOfYear) {
    return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
  }
  function validateWeekDate(_year, week, day) {
    return week >= 1 && week <= 53 && day >= 0 && day <= 6;
  }
  function validateTime(hours, minutes, seconds) {
    if (hours === 24) {
      return minutes === 0 && seconds === 0;
    }
    return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
  }
  function validateTimezone(_hours, minutes) {
    return minutes >= 0 && minutes <= 59;
  }
  function setMonth(date, month, options) {
    const _date = toDate(date, options?.in);
    const year = _date.getFullYear();
    const day = _date.getDate();
    const midMonth = constructFrom(date, 0);
    midMonth.setFullYear(year, month, 15);
    midMonth.setHours(0, 0, 0, 0);
    const daysInMonth = getDaysInMonth(midMonth);
    _date.setMonth(month, Math.min(day, daysInMonth));
    return _date;
  }
  function setYear(date, year, options) {
    const date_ = toDate(date, options?.in);
    if (isNaN(+date_)) return constructFrom(date, NaN);
    date_.setFullYear(year);
    return date_;
  }
  function subMonths(date, amount, options) {
    return addMonths(date, -1, options);
  }
  function subYears(date, amount, options) {
    return addYears(date, -1, options);
  }
  class CalendarController extends stimulus.Controller {
    static targets=[ "grid", "monthLabel", "input", "monthSelect", "yearSelect", "liveRegion", "weekdaysHeader", "monthContainer" ];
    static values={
      mode: {
        type: String,
        default: "single"
      },
      selected: {
        type: Array,
        default: []
      },
      month: {
        type: String,
        default: ""
      },
      numberOfMonths: {
        type: Number,
        default: 1
      },
      weekStartsOn: {
        type: Number,
        default: 0
      },
      locale: {
        type: String,
        default: "en-US"
      },
      minDate: {
        type: String,
        default: ""
      },
      maxDate: {
        type: String,
        default: ""
      },
      disabled: {
        type: Array,
        default: []
      },
      showOutsideDays: {
        type: Boolean,
        default: true
      },
      fixedWeeks: {
        type: Boolean,
        default: false
      },
      yearRange: {
        type: Number,
        default: 100
      },
      minRangeDays: {
        type: Number,
        default: 0
      },
      maxRangeDays: {
        type: Number,
        default: 0
      },
      excludeDisabled: {
        type: Boolean,
        default: false
      }
    };
    connect() {
      this.currentMonth = this.monthValue ? new Date(this.monthValue) : new Date;
      this.hoveredDate = null;
      this.animationDirection = null;
      this.initializeLocale();
      this.render();
      this.renderWeekdayHeaders();
    }
    disconnect() {
      this.hoveredDate = null;
    }
    initializeLocale() {
      const locale = this.localeValue || "en-US";
      this.monthFormatter = new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric"
      });
      this.weekdayFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "short"
      });
      this.weekdayFullFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "long"
      });
      this.monthNameFormatter = new Intl.DateTimeFormat(locale, {
        month: "long"
      });
      this.dayFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    previousMonth() {
      this.animationDirection = "prev";
      this.currentMonth = subMonths(this.currentMonth);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    nextMonth() {
      this.animationDirection = "next";
      this.currentMonth = addMonths(this.currentMonth, 1);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    previousYear() {
      this.animationDirection = "prev";
      this.currentMonth = subYears(this.currentMonth);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    nextYear() {
      this.animationDirection = "next";
      this.currentMonth = addYears(this.currentMonth, 1);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    goToMonth(event) {
      const month = parseInt(event.target.value);
      const oldMonth = getMonth(this.currentMonth);
      this.animationDirection = month > oldMonth ? "next" : "prev";
      this.currentMonth = setMonth(this.currentMonth, month);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    goToYear(event) {
      const year = parseInt(event.target.value);
      const oldYear = getYear(this.currentMonth);
      this.animationDirection = year > oldYear ? "next" : "prev";
      this.currentMonth = setYear(this.currentMonth, year);
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
    }
    goToToday() {
      const today = new Date;
      const oldMonth = this.currentMonth;
      this.animationDirection = isBefore(oldMonth, today) ? "next" : "prev";
      this.currentMonth = startOfMonth(today);
      this.focusedDate = format(today, "yyyy-MM-dd");
      this.render();
      this.announceMonthChange();
      this.dispatchMonthChange();
      this.restoreFocus();
    }
    dispatchMonthChange() {
      this.dispatch("monthChange", {
        detail: {
          month: this.currentMonth,
          direction: this.animationDirection
        }
      });
    }
    announceMonthChange() {
      if (this.hasLiveRegionTarget) {
        const monthName = this.monthFormatter.format(this.currentMonth);
        this.liveRegionTarget.textContent = monthName;
      }
    }
    announceSelection(dateStr) {
      if (this.hasLiveRegionTarget) {
        const date = parseISO(dateStr);
        const formattedDate = this.dayFormatter.format(date);
        this.liveRegionTarget.textContent = `Selected: ${formattedDate}`;
      }
    }
    selectDate(event) {
      event.stopPropagation();
      const dateStr = event.currentTarget.dataset.date;
      if (this.isDisabled(parseISO(dateStr))) return;
      this.focusedDate = dateStr;
      switch (this.modeValue) {
       case "single":
        this.selectedValue = [ dateStr ];
        break;

       case "range":
        this.selectRange(dateStr);
        break;

       case "multiple":
        this.toggleDate(dateStr);
        break;
      }
      this.updateInput();
      this.render();
      this.restoreFocus();
      this.announceSelection(dateStr);
      this.dispatch("select", {
        detail: {
          selected: this.selectedValue,
          date: dateStr
        }
      });
    }
    selectRange(dateStr) {
      const selected = this.selectedValue;
      if (selected.length === 0 || selected.length === 2) {
        this.selectedValue = [ dateStr ];
      } else {
        const start = parseISO(selected[0]);
        const end = parseISO(dateStr);
        const [rangeStart, rangeEnd] = isBefore(end, start) ? [ end, start ] : [ start, end ];
        const daysDiff = differenceInDays(rangeEnd, rangeStart);
        if (this.minRangeDaysValue > 0 && daysDiff < this.minRangeDaysValue) {
          this.dispatch("rangeError", {
            detail: {
              error: "min",
              minDays: this.minRangeDaysValue,
              actualDays: daysDiff
            }
          });
          return;
        }
        if (this.maxRangeDaysValue > 0 && daysDiff > this.maxRangeDaysValue) {
          this.dispatch("rangeError", {
            detail: {
              error: "max",
              maxDays: this.maxRangeDaysValue,
              actualDays: daysDiff
            }
          });
          return;
        }
        if (this.excludeDisabledValue) {
          const hasDisabledInRange = this.hasDisabledDatesInRange(rangeStart, rangeEnd);
          if (hasDisabledInRange) {
            this.dispatch("rangeError", {
              detail: {
                error: "disabled",
                message: "Range contains disabled dates"
              }
            });
            return;
          }
        }
        this.selectedValue = [ format(rangeStart, "yyyy-MM-dd"), format(rangeEnd, "yyyy-MM-dd") ];
      }
    }
    hasDisabledDatesInRange(start, end) {
      const days = eachDayOfInterval({
        start: start,
        end: end
      });
      return days.some(day => this.isDisabled(day));
    }
    toggleDate(dateStr) {
      const idx = this.selectedValue.indexOf(dateStr);
      if (idx === -1) {
        this.selectedValue = [ ...this.selectedValue, dateStr ];
      } else {
        this.selectedValue = this.selectedValue.filter((_, i) => i !== idx);
      }
    }
    handleDayHover(event) {
      if (this.modeValue !== "range") return;
      if (this.selectedValue.length !== 1) return;
      const dateStr = event.currentTarget.dataset.date;
      if (!dateStr) return;
      this.hoveredDate = parseISO(dateStr);
      this.updateRangePreview();
    }
    handleDayLeave() {
      if (this.modeValue !== "range") return;
      if (!this.hoveredDate) return;
      this.hoveredDate = null;
      this.updateRangePreview();
    }
    updateRangePreview() {
      if (!this.hasGridTarget) return;
      const buttons = this.element.querySelectorAll("[data-date]");
      buttons.forEach(button => {
        const dateStr = button.dataset.date;
        const date = parseISO(dateStr);
        const isInPreview = this.isInRangePreview(date);
        const isPreviewStart = this.isRangePreviewStart(date);
        const isPreviewEnd = this.isRangePreviewEnd(date);
        const td = button.closest("td");
        if (td) {
          td.classList.toggle("bg-accent/50", isInPreview && !this.isSelected(date));
        }
        button.classList.toggle("bg-accent/50", isInPreview && !this.isSelected(date));
        if (isPreviewStart && !isPreviewEnd) {
          button.classList.add("rounded-l-md", "rounded-r-none");
        } else if (isPreviewEnd && !isPreviewStart) {
          button.classList.add("rounded-r-md", "rounded-l-none");
        } else if (!isInPreview) {
          if (!this.isRangeStart(date) && !this.isRangeEnd(date)) {
            button.classList.remove("rounded-l-md", "rounded-r-md", "rounded-l-none", "rounded-r-none");
            button.classList.add("rounded-md");
          }
        }
      });
    }
    isInRangePreview(date) {
      if (this.modeValue !== "range") return false;
      if (this.selectedValue.length !== 1) return false;
      if (!this.hoveredDate) return false;
      const start = parseISO(this.selectedValue[0]);
      const end = this.hoveredDate;
      const [rangeStart, rangeEnd] = isBefore(end, start) ? [ end, start ] : [ start, end ];
      return isWithinInterval(date, {
        start: rangeStart,
        end: rangeEnd
      });
    }
    isRangePreviewStart(date) {
      if (!this.isInRangePreview(date)) return false;
      const start = parseISO(this.selectedValue[0]);
      const end = this.hoveredDate;
      const actualStart = isBefore(end, start) ? end : start;
      return isSameDay(date, actualStart);
    }
    isRangePreviewEnd(date) {
      if (!this.isInRangePreview(date)) return false;
      const start = parseISO(this.selectedValue[0]);
      const end = this.hoveredDate;
      const actualEnd = isBefore(end, start) ? start : end;
      return isSameDay(date, actualEnd);
    }
    render() {
      this.renderMonthLabels();
      this.renderDropdowns();
      this.renderGrids();
    }
    renderMonthLabels() {
      if (this.hasMonthLabelTarget) {
        this.monthLabelTargets.forEach((label, index) => {
          const monthDate = addMonths(this.currentMonth, index);
          label.textContent = this.monthFormatter.format(monthDate);
        });
      }
    }
    renderWeekdayHeaders() {
      if (!this.hasWeekdaysHeaderTarget) return;
      this.weekdaysHeaderTargets.forEach(header => {
        const weekdays = this.getLocalizedWeekdays();
        header.innerHTML = weekdays.map(day => `<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="${day.full}">${day.short}</th>`).join("");
      });
    }
    getLocalizedWeekdays() {
      const weekdays = [];
      const baseSunday = new Date(1970, 0, 4);
      for (let i = 0; i < 7; i++) {
        const dayIndex = (i + this.weekStartsOnValue) % 7;
        const date = new Date(baseSunday);
        date.setDate(baseSunday.getDate() + dayIndex);
        weekdays.push({
          short: this.weekdayFormatter.format(date).slice(0, 2),
          full: this.weekdayFullFormatter.format(date)
        });
      }
      return weekdays;
    }
    getLocalizedMonthNames() {
      const months = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(2024, i, 1);
        months.push({
          value: i,
          name: this.monthNameFormatter.format(date)
        });
      }
      return months;
    }
    renderDropdowns() {
      if (this.hasMonthSelectTarget) {
        this.monthSelectTargets.forEach((select, index) => {
          const monthDate = addMonths(this.currentMonth, index);
          const value = getMonth(monthDate).toString();
          this.updateSelectValue(select, value);
        });
      }
      if (this.hasYearSelectTarget) {
        this.yearSelectTargets.forEach((select, index) => {
          const monthDate = addMonths(this.currentMonth, index);
          const value = getYear(monthDate).toString();
          this.updateSelectValue(select, value);
        });
      }
    }
    updateSelectValue(element, value) {
      if (element.tagName === "SELECT") {
        element.value = value;
        return;
      }
      element.value = value;
      const selectElement = element.closest("[data-controller='ui--select']");
      if (selectElement) {
        selectElement.dataset.uiSelectValueValue = value;
      }
    }
    renderGrids() {
      if (!this.hasGridTarget) return;
      if (this.animationDirection) {
        this.animateMonthTransition();
      }
      this.gridTargets.forEach((grid, index) => {
        const monthDate = addMonths(this.currentMonth, index);
        this.renderGrid(grid, monthDate);
      });
    }
    animateMonthTransition() {
      this.gridTargets.forEach(grid => {
        grid.style.opacity = "0";
        grid.style.transform = this.animationDirection === "next" ? "translateX(10px)" : "translateX(-10px)";
        requestAnimationFrame(() => {
          grid.style.transition = "opacity 150ms ease-out, transform 150ms ease-out";
          grid.style.opacity = "1";
          grid.style.transform = "translateX(0)";
        });
        setTimeout(() => {
          grid.style.transition = "";
          grid.style.transform = "";
          this.animationDirection = null;
        }, 160);
      });
    }
    renderGrid(gridElement, monthDate) {
      const days = this.getDaysInMonth(monthDate);
      let html = "";
      for (let i = 0; i < days.length; i += 7) {
        html += '<tr class="flex w-full mt-2">';
        for (let j = i; j < i + 7 && j < days.length; j++) {
          html += this.renderDay(days[j], monthDate);
        }
        html += "</tr>";
      }
      gridElement.innerHTML = html;
    }
    getDaysInMonth(monthDate) {
      const start = startOfWeek(startOfMonth(monthDate), {
        weekStartsOn: this.weekStartsOnValue
      });
      const end = endOfWeek(endOfMonth(monthDate), {
        weekStartsOn: this.weekStartsOnValue
      });
      if (this.fixedWeeksValue) {
        const days = eachDayOfInterval({
          start: start,
          end: end
        });
        while (days.length < 42) {
          days.push(addDays(days[days.length - 1], 1));
        }
        return days;
      }
      return eachDayOfInterval({
        start: start,
        end: end
      });
    }
    renderDay(date, monthDate) {
      const dateStr = format(date, "yyyy-MM-dd");
      const isSelected = this.isSelected(date);
      const isCurrentMonth = isSameMonth(date, monthDate);
      const isTodayDate = isToday(date);
      const isDisabledDate = this.isDisabled(date);
      const isRangeMiddle = this.isInRange(date) && !isSelected;
      const classes = this.getDayClasses({
        isSelected: isSelected,
        isCurrentMonth: isCurrentMonth,
        isTodayDate: isTodayDate,
        isDisabled: isDisabledDate,
        isRangeMiddle: isRangeMiddle,
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date)
      });
      if (!isCurrentMonth && !this.showOutsideDaysValue) {
        return `<td class="relative p-0 text-center text-sm h-9 w-9"></td>`;
      }
      let actions = "click->ui--calendar#selectDate focus->ui--calendar#handleDayFocus blur->ui--calendar#handleDayBlur";
      if (this.modeValue === "range") {
        actions += " mouseenter->ui--calendar#handleDayHover mouseleave->ui--calendar#handleDayLeave";
      }
      return `\n      <td class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 ${this.getTdClasses(isSelected, isCurrentMonth, isRangeMiddle)}">\n        <button\n          type="button"\n          data-date="${dateStr}"\n          data-action="${actions}"\n          ${isDisabledDate ? "disabled" : ""}\n          aria-selected="${isSelected}"\n          class="${classes}"\n          tabindex="${isSelected || isTodayDate ? 0 : -1}"\n        >${date.getDate()}</button>\n      </td>\n    `;
    }
    handleDayFocus(event) {
      const dateStr = event.currentTarget.dataset.date;
      if (!dateStr) return;
      this.dispatch("dayFocus", {
        detail: {
          date: dateStr,
          element: event.currentTarget
        }
      });
    }
    handleDayBlur(event) {
      const dateStr = event.currentTarget.dataset.date;
      if (!dateStr) return;
      this.dispatch("dayBlur", {
        detail: {
          date: dateStr,
          element: event.currentTarget
        }
      });
    }
    getTdClasses(isSelected, isCurrentMonth, isRangeMiddle) {
      const classes = [];
      if (isSelected || isRangeMiddle) {
        classes.push("bg-accent");
        if (!isCurrentMonth) classes.push("bg-accent/50");
      }
      return classes.join(" ");
    }
    getDayClasses({isSelected: isSelected, isCurrentMonth: isCurrentMonth, isTodayDate: isTodayDate, isDisabled: isDisabled, isRangeMiddle: isRangeMiddle, isRangeStart: isRangeStart, isRangeEnd: isRangeEnd}) {
      const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9 p-0 font-normal";
      const classes = [ base ];
      if (isSelected && !isRangeMiddle) {
        classes.push("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground");
      } else if (isRangeMiddle) {
        classes.push("bg-accent text-accent-foreground rounded-none");
      } else if (isTodayDate && !isSelected) {
        classes.push("bg-accent text-accent-foreground");
      } else {
        classes.push("hover:bg-accent hover:text-accent-foreground");
      }
      if (!isCurrentMonth) {
        classes.push("text-muted-foreground opacity-50");
      }
      if (isDisabled) {
        classes.push("text-muted-foreground opacity-50 pointer-events-none");
      }
      if (isRangeStart) {
        classes.push("rounded-l-md rounded-r-none");
      }
      if (isRangeEnd) {
        classes.push("rounded-r-md rounded-l-none");
      }
      return classes.join(" ");
    }
    isSelected(date) {
      return this.selectedValue.some(d => isSameDay(parseISO(d), date));
    }
    isDisabled(date) {
      if (this.minDateValue && isBefore(date, parseISO(this.minDateValue))) return true;
      if (this.maxDateValue && isAfter(date, parseISO(this.maxDateValue))) return true;
      return this.disabledValue.some(d => isSameDay(parseISO(d), date));
    }
    isInRange(date) {
      if (this.modeValue !== "range" || this.selectedValue.length !== 2) return false;
      const [start, end] = this.selectedValue.map(d => parseISO(d));
      return isWithinInterval(date, {
        start: start,
        end: end
      });
    }
    isRangeStart(date) {
      if (this.modeValue !== "range" || this.selectedValue.length === 0) return false;
      return isSameDay(parseISO(this.selectedValue[0]), date);
    }
    isRangeEnd(date) {
      if (this.modeValue !== "range" || this.selectedValue.length !== 2) return false;
      return isSameDay(parseISO(this.selectedValue[1]), date);
    }
    updateInput() {
      if (this.hasInputTarget) {
        this.inputTarget.value = this.selectedValue.join(",");
      }
    }
    handleKeydown(event) {
      const focusedElement = document.activeElement;
      const isFocusOnDayButton = focusedElement?.hasAttribute("data-date");
      if ((event.key === "Enter" || event.key === " ") && !isFocusOnDayButton) {
        return;
      }
      if (event.shiftKey) {
        const shiftActions = {
          ArrowLeft: () => this.navigateAndFocus("previousMonth"),
          ArrowRight: () => this.navigateAndFocus("nextMonth"),
          ArrowUp: () => this.navigateAndFocus("previousYear"),
          ArrowDown: () => this.navigateAndFocus("nextYear"),
          PageUp: () => this.navigateAndFocus("previousYear"),
          PageDown: () => this.navigateAndFocus("nextYear")
        };
        if (shiftActions[event.key]) {
          event.preventDefault();
          shiftActions[event.key]();
          return;
        }
      }
      const actions = {
        ArrowLeft: () => this.moveFocus(-1),
        ArrowRight: () => this.moveFocus(1),
        ArrowUp: () => this.moveFocus(-7),
        ArrowDown: () => this.moveFocus(7),
        PageUp: () => this.navigateAndFocus("previousMonth"),
        PageDown: () => this.navigateAndFocus("nextMonth"),
        Home: () => this.moveToStartOfWeek(),
        End: () => this.moveToEndOfWeek(),
        Enter: () => this.selectFocusedDate(),
        " ": () => this.selectFocusedDate()
      };
      if (actions[event.key]) {
        event.preventDefault();
        actions[event.key]();
      }
    }
    moveFocus(days) {
      const focused = this.element.querySelector("[data-date]:focus");
      let currentDateStr = focused?.dataset.date || this.focusedDate;
      if (!currentDateStr) {
        const firstButton = this.element.querySelector("[data-date]");
        if (!firstButton) return;
        currentDateStr = firstButton.dataset.date;
      }
      const currentDate = parseISO(currentDateStr);
      const newDate = addDays(currentDate, days);
      const newDateStr = format(newDate, "yyyy-MM-dd");
      this.focusedDate = newDateStr;
      let target = this.element.querySelector(`[data-date="${newDateStr}"]`);
      if (!target) {
        if (days > 0) {
          this.nextMonth();
        } else {
          this.previousMonth();
        }
        requestAnimationFrame(() => {
          target = this.element.querySelector(`[data-date="${newDateStr}"]`);
          target?.focus();
        });
      } else {
        target.focus();
      }
    }
    selectFocusedDate() {
      const focused = this.element.querySelector("[data-date]:focus");
      focused?.click();
    }
    restoreFocus() {
      if (this.focusedDate) {
        requestAnimationFrame(() => {
          const target = this.element.querySelector(`[data-date="${this.focusedDate}"]`);
          target?.focus();
        });
      }
    }
    navigateAndFocus(direction) {
      const focused = this.element.querySelector("[data-date]:focus");
      let currentDateStr = focused?.dataset.date || this.focusedDate;
      if (!currentDateStr) {
        this[direction]();
        return;
      }
      const currentDate = parseISO(currentDateStr);
      let newDate;
      switch (direction) {
       case "previousMonth":
        newDate = subMonths(currentDate);
        break;

       case "nextMonth":
        newDate = addMonths(currentDate, 1);
        break;

       case "previousYear":
        newDate = subYears(currentDate);
        break;

       case "nextYear":
        newDate = addYears(currentDate, 1);
        break;
      }
      const newDateStr = format(newDate, "yyyy-MM-dd");
      this.focusedDate = newDateStr;
      this.currentMonth = startOfMonth(newDate);
      this.render();
      this.announceMonthChange();
      requestAnimationFrame(() => {
        const target = this.element.querySelector(`[data-date="${newDateStr}"]`);
        target?.focus();
      });
    }
    moveToStartOfWeek() {
      const focused = this.element.querySelector("[data-date]:focus");
      let currentDateStr = focused?.dataset.date || this.focusedDate;
      if (!currentDateStr) {
        const firstButton = this.element.querySelector("[data-date]");
        if (!firstButton) return;
        currentDateStr = firstButton.dataset.date;
      }
      const currentDate = parseISO(currentDateStr);
      const weekStart = startOfWeek(currentDate, {
        weekStartsOn: this.weekStartsOnValue
      });
      const weekStartStr = format(weekStart, "yyyy-MM-dd");
      this.focusedDate = weekStartStr;
      let target = this.element.querySelector(`[data-date="${weekStartStr}"]`);
      if (!target) {
        this.previousMonth();
        requestAnimationFrame(() => {
          target = this.element.querySelector(`[data-date="${weekStartStr}"]`);
          target?.focus();
        });
      } else {
        target.focus();
      }
    }
    moveToEndOfWeek() {
      const focused = this.element.querySelector("[data-date]:focus");
      let currentDateStr = focused?.dataset.date || this.focusedDate;
      if (!currentDateStr) {
        const firstButton = this.element.querySelector("[data-date]");
        if (!firstButton) return;
        currentDateStr = firstButton.dataset.date;
      }
      const currentDate = parseISO(currentDateStr);
      const weekEnd = endOfWeek(currentDate, {
        weekStartsOn: this.weekStartsOnValue
      });
      const weekEndStr = format(weekEnd, "yyyy-MM-dd");
      this.focusedDate = weekEndStr;
      let target = this.element.querySelector(`[data-date="${weekEndStr}"]`);
      if (!target) {
        this.nextMonth();
        requestAnimationFrame(() => {
          target = this.element.querySelector(`[data-date="${weekEndStr}"]`);
          target?.focus();
        });
      } else {
        target.focus();
      }
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
  class CarouselController extends stimulus.Controller {
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
  class DatepickerController extends stimulus.Controller {
    static targets=[ "trigger", "label", "input", "hiddenInput", "calendar" ];
    static outlets=[ "ui--popover", "ui--calendar" ];
    static values={
      format: {
        type: String,
        default: "long"
      },
      locale: {
        type: String,
        default: "en-US"
      },
      placeholder: {
        type: String,
        default: "Select date"
      },
      rangePlaceholder: {
        type: String,
        default: "Select date range"
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      mode: {
        type: String,
        default: "single"
      },
      selected: {
        type: Array,
        default: []
      },
      inputFormat: {
        type: String,
        default: "yyyy-MM-dd"
      }
    };
    connect() {
      if (this.selectedValue.length > 0) {
        this.updateDisplay();
      }
    }
    handleSelect(event) {
      const {selected: selected, date: date} = event.detail;
      this.selectedValue = selected;
      this.updateDisplay();
      this.updateHiddenInput();
      if (this.shouldClosePopover()) {
        this.closePopover();
      }
      this.dispatch("select", {
        detail: {
          selected: this.selectedValue,
          date: date,
          formatted: this.getFormattedDate()
        }
      });
    }
    handleInput(event) {
      const inputValue = event.target.value;
      if (!inputValue.trim()) {
        this.selectedValue = [];
        this.syncCalendarMonth(new Date);
        return;
      }
      const parsedDate = this.parseInputDate(inputValue);
      if (parsedDate && isValid(parsedDate)) {
        const dateStr = format(parsedDate, "yyyy-MM-dd");
        this.selectedValue = [ dateStr ];
        this.syncCalendarMonth(parsedDate);
        this.syncCalendarSelection([ dateStr ]);
      }
    }
    handleInputKeydown(event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.openPopover();
      }
    }
    parseInputDate(value) {
      const formats = [ "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "MMMM dd, yyyy", "MMM dd, yyyy", "dd MMMM yyyy", "dd MMM yyyy" ];
      const nativeDate = new Date(value);
      if (isValid(nativeDate) && !isNaN(nativeDate.getTime())) {
        return nativeDate;
      }
      for (const fmt of formats) {
        try {
          const parsed = parse(value, fmt, new Date);
          if (isValid(parsed)) {
            return parsed;
          }
        } catch {}
      }
      return null;
    }
    updateDisplay() {
      const formatted = this.getFormattedDate();
      if (this.hasLabelTarget) {
        this.labelTarget.textContent = formatted;
      }
      if (this.hasInputTarget) {
        this.inputTarget.value = formatted;
      }
      if (this.hasTriggerTarget && !this.hasLabelTarget && !this.hasInputTarget) {
        this.triggerTarget.textContent = formatted;
      }
    }
    updateHiddenInput() {
      if (this.hasHiddenInputTarget) {
        if (this.modeValue === "range" && this.selectedValue.length === 2) {
          this.hiddenInputTarget.value = this.selectedValue.join(",");
        } else if (this.selectedValue.length > 0) {
          this.hiddenInputTarget.value = this.selectedValue.join(",");
        } else {
          this.hiddenInputTarget.value = "";
        }
      }
    }
    getFormattedDate() {
      if (this.selectedValue.length === 0) {
        return this.modeValue === "range" ? this.rangePlaceholderValue : this.placeholderValue;
      }
      if (this.modeValue === "range") {
        return this.formatRangeDate();
      }
      if (this.modeValue === "multiple") {
        return this.formatMultipleDates();
      }
      return this.formatSingleDate(this.selectedValue[0]);
    }
    formatSingleDate(dateStr) {
      if (!dateStr) return this.placeholderValue;
      try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return this.placeholderValue;
        const options = this.getDateFormatOptions();
        const formatter = new Intl.DateTimeFormat(this.localeValue, options);
        return formatter.format(date);
      } catch {
        return this.placeholderValue;
      }
    }
    formatRangeDate() {
      if (this.selectedValue.length === 0) {
        return this.rangePlaceholderValue;
      }
      if (this.selectedValue.length === 1) {
        return this.formatSingleDate(this.selectedValue[0]) + " - ...";
      }
      const start = this.formatSingleDate(this.selectedValue[0]);
      const end = this.formatSingleDate(this.selectedValue[1]);
      return `${start} - ${end}`;
    }
    formatMultipleDates() {
      if (this.selectedValue.length === 0) {
        return this.placeholderValue;
      }
      if (this.selectedValue.length === 1) {
        return this.formatSingleDate(this.selectedValue[0]);
      }
      return `${this.selectedValue.length} dates selected`;
    }
    getDateFormatOptions() {
      switch (this.formatValue) {
       case "short":
        return {
          dateStyle: "short"
        };

       case "medium":
        return {
          dateStyle: "medium"
        };

       case "long":
        return {
          dateStyle: "long"
        };

       case "full":
        return {
          dateStyle: "full"
        };

       default:
        return {
          dateStyle: "long"
        };
      }
    }
    shouldClosePopover() {
      if (!this.closeOnSelectValue) return false;
      switch (this.modeValue) {
       case "single":
        return this.selectedValue.length === 1;

       case "range":
        return this.selectedValue.length === 2;

       case "multiple":
        return false;

       default:
        return true;
      }
    }
    closePopover() {
      if (this.hasUiPopoverOutlet) {
        this.uiPopoverOutlet.hide();
        return;
      }
      const popoverElement = this.element.querySelector("[data-controller*='ui--popover']");
      if (popoverElement) {
        const popoverController = this.application.getControllerForElementAndIdentifier(popoverElement, "ui--popover");
        if (popoverController) {
          popoverController.hide();
        }
      }
    }
    openPopover() {
      if (this.hasUiPopoverOutlet) {
        this.uiPopoverOutlet.show();
        return;
      }
      const popoverElement = this.element.querySelector("[data-controller*='ui--popover']");
      if (popoverElement) {
        const popoverController = this.application.getControllerForElementAndIdentifier(popoverElement, "ui--popover");
        if (popoverController) {
          popoverController.show();
        }
      }
    }
    syncCalendarMonth(date) {
      if (this.hasUiCalendarOutlet) {
        this.uiCalendarOutlet.currentMonth = date;
        this.uiCalendarOutlet.render();
        return;
      }
      const calendarElement = this.element.querySelector("[data-controller*='ui--calendar']");
      if (calendarElement) {
        const calendarController = this.application.getControllerForElementAndIdentifier(calendarElement, "ui--calendar");
        if (calendarController) {
          calendarController.currentMonth = date;
          calendarController.render();
        }
      }
    }
    syncCalendarSelection(selected) {
      if (this.hasUiCalendarOutlet) {
        this.uiCalendarOutlet.selectedValue = selected;
        this.uiCalendarOutlet.render();
        return;
      }
      const calendarElement = this.element.querySelector("[data-controller*='ui--calendar']");
      if (calendarElement) {
        const calendarController = this.application.getControllerForElementAndIdentifier(calendarElement, "ui--calendar");
        if (calendarController) {
          calendarController.selectedValue = selected;
          calendarController.render();
        }
      }
    }
    toggle(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  class MenubarController extends stimulus.Controller {
    static targets=[ "trigger", "content", "item" ];
    static values={
      open: {
        type: Boolean,
        default: false
      },
      activeIndex: {
        type: Number,
        default: -1
      }
    };
    connect() {
      this.closeSubmenuTimeouts = new Map;
      this.submenuCleanups = new Map;
      this.lastHoveredItem = null;
      this.isMenubarActive = false;
      this.boundHandleClickOutside = this.handleClickOutside.bind(this);
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      document.addEventListener("click", this.boundHandleClickOutside);
      this.initializeTriggers();
    }
    disconnect() {
      this.closeSubmenuTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
      this.closeSubmenuTimeouts.clear();
      this.submenuCleanups.forEach(cleanup => cleanup());
      this.submenuCleanups.clear();
      document.removeEventListener("click", this.boundHandleClickOutside);
      document.removeEventListener("keydown", this.boundHandleKeydown);
    }
    initializeTriggers() {
      this.triggerTargets.forEach((trigger, index) => {
        trigger.setAttribute("tabindex", index === 0 ? "0" : "-1");
      });
    }
    toggle(event) {
      if (event.detail === 0) return;
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      const content = this.contentTargets[triggerIndex];
      if (!content) return;
      const isCurrentlyOpen = !content.classList.contains("hidden");
      this.closeAll();
      if (!isCurrentlyOpen) {
        this.openMenu(triggerIndex);
      }
    }
    openMenu(index) {
      const trigger = this.triggerTargets[index];
      const content = this.contentTargets[index];
      if (!trigger || !content) return;
      this.triggerTargets.forEach((t, i) => {
        const c = this.contentTargets[i];
        if (c) {
          closeAllSubmenus(c);
          c.classList.add("hidden");
          c.setAttribute("data-state", "closed");
          clearAllTabindexes(c);
        }
        t.setAttribute("data-state", "closed");
        t.setAttribute("aria-expanded", "false");
        t.blur();
      });
      content.classList.remove("hidden");
      content.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      trigger.setAttribute("aria-expanded", "true");
      this.openValue = true;
      this.activeIndexValue = index;
      this.isMenubarActive = true;
      positionDropdown(trigger, content, {
        placement: "bottom-start",
        offsetValue: 4,
        flipEnabled: true
      });
      this.setupKeyboardNavigation();
      clearAllTabindexes(content);
      this.lastHoveredItem = null;
    }
    closeAll(options = {}) {
      const {returnFocus: returnFocus = false} = options;
      this.submenuCleanups.forEach(cleanup => cleanup());
      this.submenuCleanups.clear();
      this.triggerTargets.forEach((trigger, index) => {
        const content = this.contentTargets[index];
        if (content) {
          closeAllSubmenus(content);
          content.classList.add("hidden");
          content.setAttribute("data-state", "closed");
          clearAllTabindexes(content);
        }
        trigger.setAttribute("data-state", "closed");
        trigger.setAttribute("aria-expanded", "false");
      });
      this.openValue = false;
      this.lastHoveredItem = null;
      this.teardownKeyboardNavigation();
      if (returnFocus && this.activeIndexValue >= 0) {
        const trigger = this.triggerTargets[this.activeIndexValue];
        if (trigger) {
          setTimeout(() => trigger.focus(), 50);
        }
      }
    }
    handleTriggerHover(event) {
      if (!this.isMenubarActive || !this.openValue) return;
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      if (triggerIndex !== this.activeIndexValue && triggerIndex >= 0) {
        this.openMenu(triggerIndex);
      }
    }
    trackHoveredItem(event) {
      const item = event.currentTarget;
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!activeContent) return;
      clearAllTabindexes(activeContent);
      item.setAttribute("tabindex", "0");
      item.focus();
      this.lastHoveredItem = item;
      const parentMenu = item.closest('[role="menu"]');
      if (parentMenu) {
        this.closeSiblingSubmenus(item, parentMenu);
      }
    }
    selectItem(event) {
      const item = event.currentTarget;
      const role = item.getAttribute("role");
      if (role === "menuitemcheckbox") {
        event.stopPropagation();
        this.toggleCheckbox(item);
      } else if (role === "menuitemradio") {
        event.stopPropagation();
        this.selectRadio(item);
      } else {
        this.closeAll();
        this.isMenubarActive = false;
      }
    }
    openSubmenu(event) {
      const trigger = event.currentTarget;
      const submenu = trigger.nextElementSibling;
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!submenu || submenu.getAttribute("role") !== "menu") return;
      if (this.closeSubmenuTimeouts.has(trigger)) {
        clearTimeout(this.closeSubmenuTimeouts.get(trigger));
        this.closeSubmenuTimeouts.delete(trigger);
      }
      if (activeContent) {
        clearAllTabindexes(activeContent);
        trigger.setAttribute("tabindex", "0");
        trigger.focus();
        this.lastHoveredItem = trigger;
      }
      const parentMenu = trigger.closest('[role="menu"]');
      if (parentMenu) {
        this.closeSiblingSubmenus(trigger, parentMenu);
      }
      this.openSubmenuWithAutoUpdate(trigger, submenu);
    }
    openSubmenuWithAutoUpdate(trigger, submenu) {
      if (!submenu || submenu.getAttribute("role") !== "menu") return;
      if (this.submenuCleanups.has(submenu)) {
        this.submenuCleanups.get(submenu)();
        this.submenuCleanups.delete(submenu);
      }
      submenu.classList.remove("hidden");
      submenu.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      const side = submenu.getAttribute("data-side") || "right";
      const align = submenu.getAttribute("data-align") || "start";
      const placement = `${side}-${align}`;
      const update = () => {
        computePosition(trigger, submenu, {
          placement: placement,
          middleware: [ offset(4), flip({
            fallbackPlacements: [ "left-start" ]
          }), shift({
            padding: 8
          }) ],
          strategy: "fixed"
        }).then(({x: x, y: y, placement: finalPlacement}) => {
          Object.assign(submenu.style, {
            position: "fixed",
            left: `${x}px`,
            top: `${y}px`
          });
          const [finalSide, finalAlign] = finalPlacement.split("-");
          submenu.setAttribute("data-side", finalSide);
          submenu.setAttribute("data-align", finalAlign || "start");
        });
      };
      const cleanup = autoUpdate(trigger, submenu, update, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: true
      });
      this.submenuCleanups.set(submenu, cleanup);
    }
    closeSubmenuAndCleanup(submenu, trigger) {
      if (!submenu) return;
      if (this.submenuCleanups.has(submenu)) {
        this.submenuCleanups.get(submenu)();
        this.submenuCleanups.delete(submenu);
      }
      const nestedSubmenus = submenu.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]');
      nestedSubmenus.forEach(nested => {
        if (this.submenuCleanups.has(nested)) {
          this.submenuCleanups.get(nested)();
          this.submenuCleanups.delete(nested);
        }
        nested.classList.add("hidden");
        nested.setAttribute("data-state", "closed");
        const nestedTrigger = nested.previousElementSibling;
        if (nestedTrigger) {
          nestedTrigger.setAttribute("data-state", "closed");
        }
      });
      submenu.classList.add("hidden");
      submenu.setAttribute("data-state", "closed");
      if (trigger) {
        trigger.setAttribute("data-state", "closed");
      }
    }
    closeSubmenu(event) {
      const trigger = event.currentTarget;
      const submenu = trigger.nextElementSibling;
      const relatedTarget = event.relatedTarget;
      if (!submenu || submenu.getAttribute("role") !== "menu") return;
      if (relatedTarget && submenu.contains(relatedTarget)) {
        return;
      }
      const timeoutId = setTimeout(() => {
        this.closeSubmenuAndCleanup(submenu, trigger);
        this.closeSubmenuTimeouts.delete(trigger);
      }, 300);
      this.closeSubmenuTimeouts.set(trigger, timeoutId);
    }
    cancelSubmenuClose(event) {
      const submenu = event.currentTarget;
      const trigger = submenu.previousElementSibling;
      if (trigger && this.closeSubmenuTimeouts.has(trigger)) {
        clearTimeout(this.closeSubmenuTimeouts.get(trigger));
        this.closeSubmenuTimeouts.delete(trigger);
      }
    }
    closeSiblingSubmenus(currentItem, parentMenu) {
      Array.from(parentMenu.children).forEach(child => {
        if (child.classList && child.classList.contains("relative")) {
          const trigger = child.querySelector(':scope > [role="menuitem"]');
          const submenu = trigger?.nextElementSibling;
          if (trigger !== currentItem && submenu && submenu.getAttribute("role") === "menu") {
            this.closeSubmenuAndCleanup(submenu, trigger);
          }
        }
      });
    }
    handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.closeAll();
        this.isMenubarActive = false;
      }
    }
    setupKeyboardNavigation() {
      document.addEventListener("keydown", this.boundHandleKeydown);
    }
    teardownKeyboardNavigation() {
      document.removeEventListener("keydown", this.boundHandleKeydown);
    }
    handleKeydown(event) {
      if (!this.openValue) {
        const isTrigger = this.triggerTargets.includes(event.target);
        if (isTrigger) {
          this.handleTriggerKeydown(event);
        }
        return;
      }
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!activeContent) return;
      switch (event.key) {
       case "ArrowDown":
        event.preventDefault();
        this.focusNextMenuItem();
        break;

       case "ArrowUp":
        event.preventDefault();
        this.focusPreviousMenuItem();
        break;

       case "ArrowRight":
        event.preventDefault();
        this.handleArrowRight();
        break;

       case "ArrowLeft":
        event.preventDefault();
        this.handleArrowLeft();
        break;

       case "Home":
        event.preventDefault();
        this.focusFirstMenuItem();
        break;

       case "End":
        event.preventDefault();
        this.focusLastMenuItem();
        break;

       case "Escape":
        event.preventDefault();
        if (!this.closeCurrentSubmenu()) {
          this.closeAll({
            returnFocus: true
          });
        }
        break;

       case "Enter":
       case " ":
        event.preventDefault();
        this.activateCurrentItem();
        break;

       case "Tab":
        this.closeAll();
        this.isMenubarActive = false;
        break;
      }
    }
    handleTriggerKeydown(event) {
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      if (triggerIndex === -1) return;
      switch (event.key) {
       case "ArrowRight":
        event.preventDefault();
        this.focusNextTrigger(triggerIndex);
        break;

       case "ArrowLeft":
        event.preventDefault();
        this.focusPreviousTrigger(triggerIndex);
        break;

       case "ArrowDown":
       case "Enter":
       case " ":
        event.preventDefault();
        event.stopPropagation();
        this.openMenu(triggerIndex);
        break;

       case "Home":
        event.preventDefault();
        this.focusTrigger(0);
        break;

       case "End":
        event.preventDefault();
        this.focusTrigger(this.triggerTargets.length - 1);
        break;
      }
    }
    handleArrowRight() {
      const activeContent = this.contentTargets[this.activeIndexValue];
      const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem;
      if (currentItem && hasSubmenu(currentItem)) {
        this.openSubmenuWithKeyboard(currentItem);
      } else {
        this.navigateToNextMenu();
      }
    }
    handleArrowLeft() {
      if (!this.closeCurrentSubmenu()) {
        this.navigateToPreviousMenu();
      }
    }
    focusNextTrigger(currentIndex) {
      const nextIndex = (currentIndex + 1) % this.triggerTargets.length;
      this.focusTrigger(nextIndex);
    }
    focusPreviousTrigger(currentIndex) {
      const prevIndex = currentIndex === 0 ? this.triggerTargets.length - 1 : currentIndex - 1;
      this.focusTrigger(prevIndex);
    }
    focusTrigger(index) {
      this.triggerTargets.forEach((t, i) => {
        t.setAttribute("tabindex", i === index ? "0" : "-1");
      });
      this.triggerTargets[index].focus();
    }
    navigateToNextMenu() {
      const nextIndex = (this.activeIndexValue + 1) % this.triggerTargets.length;
      this.openMenu(nextIndex);
    }
    navigateToPreviousMenu() {
      const prevIndex = this.activeIndexValue === 0 ? this.triggerTargets.length - 1 : this.activeIndexValue - 1;
      this.openMenu(prevIndex);
    }
    getDirectMenuItems(menu) {
      const items = [];
      Array.from(menu.children).forEach(child => {
        const role = child.getAttribute("role");
        if (role === "menuitem" || role === "menuitemcheckbox" || role === "menuitemradio") {
          if (!child.hasAttribute("data-disabled")) {
            items.push(child);
          }
        } else if (role === "group") {
          const radioItems = child.querySelectorAll('[role="menuitemradio"]');
          radioItems.forEach(item => {
            if (!item.hasAttribute("data-disabled")) {
              items.push(item);
            }
          });
        } else if (child.classList && child.classList.contains("relative")) {
          const trigger = child.querySelector(':scope > [role="menuitem"]');
          if (trigger && !trigger.hasAttribute("data-disabled")) {
            items.push(trigger);
          }
        }
      });
      return items;
    }
    getCurrentMenuItems() {
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!activeContent) return [];
      const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem;
      let currentMenu;
      if (currentItem) {
        currentMenu = currentItem.closest('[role="menu"]');
      } else {
        currentMenu = activeContent.getAttribute("role") === "menu" ? activeContent : activeContent.querySelector('[role="menu"]');
      }
      if (!currentMenu) return [];
      return this.getDirectMenuItems(currentMenu);
    }
    focusMenuItem(item, content) {
      if (!item) return;
      content = content || this.contentTargets[this.activeIndexValue];
      if (!content) return;
      clearAllTabindexes(content);
      item.setAttribute("tabindex", "0");
      item.focus();
      this.lastHoveredItem = item;
      const parentMenu = item.closest('[role="menu"]');
      if (parentMenu) {
        this.closeSiblingSubmenus(item, parentMenu);
      }
    }
    focusNextMenuItem() {
      const items = this.getCurrentMenuItems();
      if (items.length === 0) return;
      const currentItem = getKeyboardFocusedItem(this.contentTargets[this.activeIndexValue]) || this.lastHoveredItem;
      let currentIndex = currentItem ? items.indexOf(currentItem) : -1;
      const nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
      this.focusMenuItem(items[nextIndex]);
    }
    focusPreviousMenuItem() {
      const items = this.getCurrentMenuItems();
      if (items.length === 0) return;
      const currentItem = getKeyboardFocusedItem(this.contentTargets[this.activeIndexValue]) || this.lastHoveredItem;
      let currentIndex = currentItem ? items.indexOf(currentItem) : -1;
      const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      this.focusMenuItem(items[prevIndex]);
    }
    focusFirstMenuItem() {
      const items = this.getCurrentMenuItems();
      if (items.length > 0) {
        this.focusMenuItem(items[0]);
      }
    }
    focusLastMenuItem() {
      const items = this.getCurrentMenuItems();
      if (items.length > 0) {
        this.focusMenuItem(items[items.length - 1]);
      }
    }
    openSubmenuWithKeyboard(trigger) {
      const submenu = trigger.nextElementSibling;
      if (!submenu || submenu.getAttribute("role") !== "menu") return;
      const activeContent = this.contentTargets[this.activeIndexValue];
      const parentMenu = trigger.closest('[role="menu"]');
      if (parentMenu) {
        this.closeSiblingSubmenus(trigger, parentMenu);
      }
      this.openSubmenuWithAutoUpdate(trigger, submenu);
      const submenuItems = this.getDirectMenuItems(submenu);
      if (submenuItems.length > 0 && activeContent) {
        clearAllTabindexes(activeContent);
        submenuItems[0].setAttribute("tabindex", "0");
        submenuItems[0].focus();
        this.lastHoveredItem = submenuItems[0];
      }
    }
    closeCurrentSubmenu() {
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!activeContent) return false;
      const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem;
      if (!currentItem) return false;
      const parentMenu = currentItem.closest('[role="menu"]');
      if (!parentMenu) return false;
      const dataSide = parentMenu.getAttribute("data-side");
      if (dataSide === "right" || dataSide === "right-start") {
        const trigger = parentMenu.previousElementSibling;
        this.closeSubmenuAndCleanup(parentMenu, trigger);
        if (trigger) {
          clearAllTabindexes(activeContent);
          trigger.setAttribute("tabindex", "0");
          trigger.focus();
          this.lastHoveredItem = trigger;
        }
        return true;
      }
      return false;
    }
    activateCurrentItem() {
      const activeContent = this.contentTargets[this.activeIndexValue];
      if (!activeContent) return;
      const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem;
      if (!currentItem) return;
      const role = currentItem.getAttribute("role");
      if (role === "menuitem") {
        if (hasSubmenu(currentItem)) {
          this.openSubmenuWithKeyboard(currentItem);
        } else {
          currentItem.click();
          this.closeAll();
          this.isMenubarActive = false;
        }
      } else if (role === "menuitemcheckbox") {
        this.toggleCheckbox(currentItem);
      } else if (role === "menuitemradio") {
        this.selectRadio(currentItem);
      }
    }
    toggleCheckbox(item) {
      if (item.getAttribute("role") !== "menuitemcheckbox") return;
      const currentState = item.getAttribute("data-state");
      const newState = currentState === "checked" ? "unchecked" : "checked";
      const isChecked = newState === "checked";
      item.setAttribute("data-state", newState);
      item.setAttribute("aria-checked", isChecked);
      const iconContainer = item.querySelector(".absolute.left-2") || item.querySelector("span.absolute");
      if (iconContainer) {
        iconContainer.innerHTML = isChecked ? `\n        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">\n          <path d="M20 6 9 17l-5-5"></path>\n        </svg>\n      ` : "";
      }
    }
    selectRadio(item) {
      if (item.getAttribute("role") !== "menuitemradio") return;
      const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]');
      if (!radioGroup) return;
      const allRadios = radioGroup.querySelectorAll('[role="menuitemradio"]');
      allRadios.forEach(radio => {
        radio.setAttribute("data-state", "unchecked");
        radio.setAttribute("aria-checked", "false");
        const iconContainer = radio.querySelector(".absolute.left-2") || radio.querySelector("span.absolute");
        if (iconContainer) {
          iconContainer.innerHTML = "";
        }
      });
      item.setAttribute("data-state", "checked");
      item.setAttribute("aria-checked", "true");
      const iconContainer = item.querySelector(".absolute.left-2") || item.querySelector("span.absolute");
      if (iconContainer) {
        iconContainer.innerHTML = `\n        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-2">\n          <circle cx="12" cy="12" r="10"></circle>\n        </svg>\n      `;
      }
    }
  }
  class NavigationMenuController extends stimulus.Controller {
    static targets=[ "trigger", "content", "viewport", "item" ];
    static values={
      viewport: {
        type: Boolean,
        default: true
      },
      delayDuration: {
        type: Number,
        default: 200
      },
      skipDelayDuration: {
        type: Number,
        default: 300
      },
      activeIndex: {
        type: Number,
        default: -1
      },
      previousIndex: {
        type: Number,
        default: -1
      }
    };
    connect() {
      this.openTimerRef = null;
      this.closeTimerRef = null;
      this.skipDelayTimerRef = null;
      this.isOpenDelayed = true;
      this.isMenuActive = false;
      this.boundHandleClickOutside = this.handleClickOutside.bind(this);
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      document.addEventListener("click", this.boundHandleClickOutside);
      document.addEventListener("keydown", this.boundHandleKeydown);
      this.initializeTriggers();
    }
    disconnect() {
      this.clearTimers();
      document.removeEventListener("click", this.boundHandleClickOutside);
      document.removeEventListener("keydown", this.boundHandleKeydown);
    }
    initializeTriggers() {
      this.triggerTargets.forEach((trigger, index) => {
        trigger.setAttribute("tabindex", index === 0 ? "0" : "-1");
      });
    }
    clearTimers() {
      if (this.openTimerRef) {
        clearTimeout(this.openTimerRef);
        this.openTimerRef = null;
      }
      if (this.closeTimerRef) {
        clearTimeout(this.closeTimerRef);
        this.closeTimerRef = null;
      }
      if (this.skipDelayTimerRef) {
        clearTimeout(this.skipDelayTimerRef);
        this.skipDelayTimerRef = null;
      }
    }
    toggle(event) {
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      const content = this.contentTargets[triggerIndex];
      if (!content) return;
      const isCurrentlyOpen = trigger.getAttribute("data-state") === "open";
      if (isCurrentlyOpen) {
        this.closeMenu();
      } else {
        this.openMenu(triggerIndex);
      }
    }
    openMenu(index) {
      const trigger = this.triggerTargets[index];
      const content = this.contentTargets[index];
      if (!trigger || !content) return;
      const enterMotion = this.calculateEnterMotion(index);
      const exitMotion = this.calculateExitMotion(index);
      this.triggerTargets.forEach((t, i) => {
        const c = this.contentTargets[i];
        if (c && i !== index && t.getAttribute("data-state") === "open") {
          this.animateContentOut(c, t, exitMotion);
        }
      });
      content.setAttribute("data-motion", enterMotion);
      content.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      trigger.setAttribute("aria-expanded", "true");
      this.previousIndexValue = this.activeIndexValue;
      this.activeIndexValue = index;
      this.isMenuActive = true;
      if (this.viewportValue && this.hasViewportTarget) {
        this.updateViewport(content);
      }
    }
    animateContentOut(content, trigger, motion) {
      content.setAttribute("data-motion", motion);
      trigger.setAttribute("data-state", "closed");
      trigger.setAttribute("aria-expanded", "false");
      content.addEventListener("animationend", () => {
        content.setAttribute("data-state", "closed");
      }, {
        once: true
      });
    }
    closeMenu() {
      const index = this.activeIndexValue;
      if (index < 0) return;
      const trigger = this.triggerTargets[index];
      const content = this.contentTargets[index];
      if (content && trigger) {
        const motion = "to-none";
        this.animateContentOut(content, trigger, motion);
      }
      if (this.viewportValue && this.hasViewportTarget) {
        this.viewportTarget.setAttribute("data-state", "closed");
      }
      this.previousIndexValue = this.activeIndexValue;
      this.activeIndexValue = -1;
      this.isMenuActive = false;
    }
    closeAll() {
      this.triggerTargets.forEach((trigger, index) => {
        const content = this.contentTargets[index];
        if (content) {
          content.setAttribute("data-state", "closed");
        }
        trigger.setAttribute("data-state", "closed");
        trigger.setAttribute("aria-expanded", "false");
      });
      if (this.viewportValue && this.hasViewportTarget) {
        this.viewportTarget.setAttribute("data-state", "closed");
      }
      this.activeIndexValue = -1;
      this.isMenuActive = false;
    }
    handleTriggerHover(event) {
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      if (this.closeTimerRef) {
        clearTimeout(this.closeTimerRef);
        this.closeTimerRef = null;
      }
      if (this.isMenuActive && triggerIndex !== this.activeIndexValue) {
        this.openMenu(triggerIndex);
        return;
      }
      if (triggerIndex === this.activeIndexValue) {
        return;
      }
      if (this.isOpenDelayed) {
        this.openTimerRef = setTimeout(() => {
          this.openMenu(triggerIndex);
          this.isOpenDelayed = false;
          this.skipDelayTimerRef = setTimeout(() => {
            this.isOpenDelayed = true;
          }, this.skipDelayDurationValue);
        }, this.delayDurationValue);
      } else {
        this.openMenu(triggerIndex);
      }
    }
    handleTriggerLeave(event) {
      const trigger = event.currentTarget;
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      const relatedTarget = event.relatedTarget;
      if (this.openTimerRef) {
        clearTimeout(this.openTimerRef);
        this.openTimerRef = null;
      }
      const content = this.contentTargets[triggerIndex];
      if (content && content.contains(relatedTarget)) {
        return;
      }
      if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
        return;
      }
      if (this.hasViewportTarget && this.viewportTarget.contains(relatedTarget)) {
        return;
      }
      this.closeTimerRef = setTimeout(() => {
        this.closeMenu();
      }, this.delayDurationValue);
    }
    handleContentLeave(event) {
      const content = event.currentTarget;
      const contentIndex = this.contentTargets.indexOf(content);
      const relatedTarget = event.relatedTarget;
      const trigger = this.triggerTargets[contentIndex];
      if (trigger && trigger.contains(relatedTarget)) {
        return;
      }
      if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
        return;
      }
      if (this.hasViewportTarget && this.viewportTarget.contains(relatedTarget)) {
        return;
      }
      this.closeTimerRef = setTimeout(() => {
        this.closeMenu();
      }, this.delayDurationValue);
    }
    handleViewportEnter() {
      if (this.closeTimerRef) {
        clearTimeout(this.closeTimerRef);
        this.closeTimerRef = null;
      }
    }
    handleViewportLeave(event) {
      const relatedTarget = event.relatedTarget;
      if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
        return;
      }
      this.closeTimerRef = setTimeout(() => {
        this.closeMenu();
      }, this.delayDurationValue);
    }
    calculateEnterMotion(newIndex) {
      if (this.activeIndexValue === -1) {
        return "from-none";
      }
      if (newIndex > this.activeIndexValue) {
        return "from-end";
      }
      return "from-start";
    }
    calculateExitMotion(newIndex) {
      if (newIndex > this.activeIndexValue) {
        return "to-start";
      }
      return "to-end";
    }
    updateViewport(content) {
      if (!this.hasViewportTarget) return;
      const viewport = this.viewportTarget;
      viewport.innerHTML = "";
      const clonedContent = content.cloneNode(true);
      clonedContent.style.position = "relative";
      clonedContent.style.left = "auto";
      clonedContent.style.top = "auto";
      viewport.appendChild(clonedContent);
      const contentRect = clonedContent.getBoundingClientRect();
      viewport.style.setProperty("--ui-navigation-menu-viewport-width", `${contentRect.width}px`);
      viewport.style.setProperty("--ui-navigation-menu-viewport-height", `${contentRect.height}px`);
      viewport.setAttribute("data-state", "open");
    }
    handleKeydown(event) {
      if (!this.element.contains(document.activeElement)) return;
      const trigger = this.triggerTargets.find(t => t === document.activeElement);
      if (!trigger) {
        if (this.isMenuActive) {
          this.handleContentKeydown(event);
        }
        return;
      }
      const triggerIndex = this.triggerTargets.indexOf(trigger);
      switch (event.key) {
       case "ArrowRight":
        event.preventDefault();
        this.focusNextTrigger(triggerIndex);
        break;

       case "ArrowLeft":
        event.preventDefault();
        this.focusPreviousTrigger(triggerIndex);
        break;

       case "ArrowDown":
        event.preventDefault();
        if (this.activeIndexValue === triggerIndex) {
          this.focusFirstContentLink();
        } else {
          this.openMenu(triggerIndex);
          setTimeout(() => this.focusFirstContentLink(), 50);
        }
        break;

       case "Enter":
       case " ":
        event.preventDefault();
        if (this.activeIndexValue === triggerIndex) {
          this.closeMenu();
        } else {
          this.openMenu(triggerIndex);
        }
        break;

       case "Escape":
        event.preventDefault();
        if (this.isMenuActive) {
          this.closeMenu();
          const activeTrigger = this.triggerTargets[this.previousIndexValue >= 0 ? this.previousIndexValue : 0];
          if (activeTrigger) activeTrigger.focus();
        }
        break;

       case "Home":
        event.preventDefault();
        this.focusTrigger(0);
        break;

       case "End":
        event.preventDefault();
        this.focusTrigger(this.triggerTargets.length - 1);
        break;

       case "Tab":
        if (!event.shiftKey && this.isMenuActive) ; else if (event.shiftKey && this.isMenuActive) {
          this.closeMenu();
        }
        break;
      }
    }
    handleContentKeydown(event) {
      switch (event.key) {
       case "Escape":
        event.preventDefault();
        this.closeMenu();
        const activeTrigger = this.triggerTargets[this.previousIndexValue >= 0 ? this.previousIndexValue : this.activeIndexValue];
        if (activeTrigger) activeTrigger.focus();
        break;

       case "Tab":
        const content = this.contentTargets[this.activeIndexValue];
        if (content) {
          const focusableElements = content.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
          const lastFocusable = focusableElements[focusableElements.length - 1];
          if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            this.closeMenu();
            this.focusNextTrigger(this.activeIndexValue);
          } else if (event.shiftKey && document.activeElement === focusableElements[0]) {
            event.preventDefault();
            this.closeMenu();
            this.focusTrigger(this.activeIndexValue >= 0 ? this.activeIndexValue : 0);
          }
        }
        break;
      }
    }
    focusNextTrigger(currentIndex) {
      const nextIndex = (currentIndex + 1) % this.triggerTargets.length;
      this.focusTrigger(nextIndex);
    }
    focusPreviousTrigger(currentIndex) {
      const prevIndex = currentIndex === 0 ? this.triggerTargets.length - 1 : currentIndex - 1;
      this.focusTrigger(prevIndex);
    }
    focusTrigger(index) {
      this.triggerTargets.forEach((t, i) => {
        t.setAttribute("tabindex", i === index ? "0" : "-1");
      });
      this.triggerTargets[index]?.focus();
    }
    focusFirstContentLink() {
      const content = this.contentTargets[this.activeIndexValue];
      if (!content) return;
      const firstLink = content.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (firstLink) firstLink.focus();
    }
    handleClickOutside(event) {
      if (!this.element.contains(event.target)) {
        this.closeAll();
      }
    }
  }
  class ResizableController extends stimulus.Controller {
    static targets=[ "panel", "handle" ];
    static values={
      direction: {
        type: String,
        default: "horizontal"
      },
      keyboardResizeBy: {
        type: Number,
        default: 10
      }
    };
    connect() {
      this.isDragging = false;
      this.activeHandleIndex = -1;
      this.startPosition = 0;
      this.startSizes = [];
      this.activePointerId = null;
      this.initializePanelSizes();
      this.element.setAttribute("data-panel-group-direction", this.directionValue);
      this.handleTargets.forEach((handle, index) => {
        handle.setAttribute("tabindex", "0");
        handle.setAttribute("role", "separator");
        handle.setAttribute("aria-valuenow", "50");
        handle.setAttribute("aria-valuemin", "0");
        handle.setAttribute("aria-valuemax", "100");
        handle.setAttribute("data-resize-handle-state", "inactive");
        handle.setAttribute("data-panel-group-direction", this.directionValue);
        handle.style.touchAction = "none";
        handle.addEventListener("keydown", this.handleKeyDown.bind(this, index));
      });
      this._boundHandleMove = this.handleMove.bind(this);
      this._boundEndDrag = this.endDrag.bind(this);
    }
    disconnect() {
      this.handleTargets.forEach((handle, index) => {
        handle.removeEventListener("keydown", this.handleKeyDown.bind(this, index));
      });
      document.removeEventListener("pointermove", this._boundHandleMove);
      document.removeEventListener("pointerup", this._boundEndDrag);
      document.removeEventListener("pointercancel", this._boundEndDrag);
      if (this.isDragging) {
        this.cleanupDragState();
      }
    }
    cleanupDragState() {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
    initializePanelSizes() {
      const panels = this.panelTargets;
      let totalDefaultSize = 0;
      let panelsWithoutDefault = 0;
      panels.forEach(panel => {
        const defaultSize = parseFloat(panel.dataset.defaultSize);
        if (!isNaN(defaultSize)) {
          totalDefaultSize += defaultSize;
        } else {
          panelsWithoutDefault++;
        }
      });
      const remainingSpace = 100 - totalDefaultSize;
      const defaultForUnspecified = panelsWithoutDefault > 0 ? remainingSpace / panelsWithoutDefault : 0;
      panels.forEach(panel => {
        let size = parseFloat(panel.dataset.defaultSize);
        if (isNaN(size)) {
          size = defaultForUnspecified;
        }
        this.setPanelSize(panel, size);
      });
    }
    setPanelSize(panel, size) {
      panel.dataset.panelSize = size;
      panel.style.flexGrow = size.toString();
      panel.style.flexShrink = size.toString();
      panel.style.flexBasis = "0";
    }
    getPanelSize(panel) {
      return parseFloat(panel.dataset.panelSize) || 0;
    }
    startDrag(event) {
      const handle = event.currentTarget;
      const handleIndex = this.handleTargets.indexOf(handle);
      if (handleIndex === -1) return;
      event.preventDefault();
      this.isDragging = true;
      this.activeHandleIndex = handleIndex;
      this.activePointerId = event.pointerId;
      if (this.directionValue === "horizontal") {
        this.startPosition = event.clientX;
      } else {
        this.startPosition = event.clientY;
      }
      const leftPanel = this.panelTargets[handleIndex];
      const rightPanel = this.panelTargets[handleIndex + 1];
      this.startSizes = [ this.getPanelSize(leftPanel), this.getPanelSize(rightPanel) ];
      handle.setAttribute("data-resize-handle-state", "drag");
      handle.setAttribute("data-resize-handle-active", "pointer");
      document.body.style.userSelect = "none";
      document.body.style.cursor = this.directionValue === "horizontal" ? "col-resize" : "row-resize";
      handle.setPointerCapture(event.pointerId);
      document.addEventListener("pointermove", this._boundHandleMove);
      document.addEventListener("pointerup", this._boundEndDrag);
      document.addEventListener("pointercancel", this._boundEndDrag);
      this.dispatch("resizeStart", {
        detail: {
          handleIndex: handleIndex,
          sizes: this.getCurrentSizes()
        }
      });
    }
    handleMove(event) {
      if (!this.isDragging || this.activeHandleIndex === -1) return;
      event.preventDefault();
      let delta;
      if (this.directionValue === "horizontal") {
        delta = event.clientX - this.startPosition;
      } else {
        delta = event.clientY - this.startPosition;
      }
      const containerRect = this.element.getBoundingClientRect();
      const containerSize = this.directionValue === "horizontal" ? containerRect.width : containerRect.height;
      const percentageDelta = delta / containerSize * 100;
      const leftPanel = this.panelTargets[this.activeHandleIndex];
      const rightPanel = this.panelTargets[this.activeHandleIndex + 1];
      let newLeftSize = this.startSizes[0] + percentageDelta;
      let newRightSize = this.startSizes[1] - percentageDelta;
      const leftMin = parseFloat(leftPanel.dataset.minSize) || 0;
      const leftMax = parseFloat(leftPanel.dataset.maxSize) || 100;
      const rightMin = parseFloat(rightPanel.dataset.minSize) || 0;
      const rightMax = parseFloat(rightPanel.dataset.maxSize) || 100;
      if (newLeftSize < leftMin) {
        const adjustment = leftMin - newLeftSize;
        newLeftSize = leftMin;
        newRightSize -= adjustment;
      }
      if (newLeftSize > leftMax) {
        const adjustment = newLeftSize - leftMax;
        newLeftSize = leftMax;
        newRightSize += adjustment;
      }
      if (newRightSize < rightMin) {
        const adjustment = rightMin - newRightSize;
        newRightSize = rightMin;
        newLeftSize -= adjustment;
      }
      if (newRightSize > rightMax) {
        const adjustment = newRightSize - rightMax;
        newRightSize = rightMax;
        newLeftSize += adjustment;
      }
      newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
      newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));
      this.setPanelSize(leftPanel, newLeftSize);
      this.setPanelSize(rightPanel, newRightSize);
      const handle = this.handleTargets[this.activeHandleIndex];
      handle.setAttribute("aria-valuenow", Math.round(newLeftSize));
      this.dispatch("resize", {
        detail: {
          handleIndex: this.activeHandleIndex,
          sizes: this.getCurrentSizes()
        }
      });
    }
    endDrag(event) {
      if (!this.isDragging) return;
      const handle = this.handleTargets[this.activeHandleIndex];
      if (handle) {
        handle.setAttribute("data-resize-handle-state", "inactive");
        handle.removeAttribute("data-resize-handle-active");
        if (this.activePointerId !== null) {
          try {
            handle.releasePointerCapture(this.activePointerId);
          } catch (e) {}
        }
      }
      this.isDragging = false;
      this.activeHandleIndex = -1;
      this.activePointerId = null;
      this.cleanupDragState();
      document.removeEventListener("pointermove", this._boundHandleMove);
      document.removeEventListener("pointerup", this._boundEndDrag);
      document.removeEventListener("pointercancel", this._boundEndDrag);
      this.dispatch("resizeEnd", {
        detail: {
          sizes: this.getCurrentSizes()
        }
      });
    }
    handleEnter(event) {
      if (!this.isDragging) {
        event.currentTarget.setAttribute("data-resize-handle-state", "hover");
      }
    }
    handleLeave(event) {
      if (!this.isDragging) {
        event.currentTarget.setAttribute("data-resize-handle-state", "inactive");
      }
    }
    handleKeyDown(handleIndex, event) {
      const leftPanel = this.panelTargets[handleIndex];
      const rightPanel = this.panelTargets[handleIndex + 1];
      if (!leftPanel || !rightPanel) return;
      let delta = 0;
      const resizeBy = this.keyboardResizeByValue;
      const isHorizontal = this.directionValue === "horizontal";
      switch (event.key) {
       case "ArrowLeft":
        if (isHorizontal) delta = -resizeBy;
        event.preventDefault();
        break;

       case "ArrowRight":
        if (isHorizontal) delta = resizeBy;
        event.preventDefault();
        break;

       case "ArrowUp":
        if (!isHorizontal) delta = -resizeBy;
        event.preventDefault();
        break;

       case "ArrowDown":
        if (!isHorizontal) delta = resizeBy;
        event.preventDefault();
        break;

       case "Home":
        delta = -(this.getPanelSize(leftPanel) - (parseFloat(leftPanel.dataset.minSize) || 0));
        event.preventDefault();
        break;

       case "End":
        delta = (parseFloat(leftPanel.dataset.maxSize) || 100) - this.getPanelSize(leftPanel);
        event.preventDefault();
        break;

       case "Enter":
       case " ":
        event.preventDefault();
        break;

       default:
        return;
      }
      if (delta === 0) return;
      const handle = this.handleTargets[handleIndex];
      handle.setAttribute("data-resize-handle-active", "keyboard");
      let newLeftSize = this.getPanelSize(leftPanel) + delta;
      let newRightSize = this.getPanelSize(rightPanel) - delta;
      const leftMin = parseFloat(leftPanel.dataset.minSize) || 0;
      const leftMax = parseFloat(leftPanel.dataset.maxSize) || 100;
      const rightMin = parseFloat(rightPanel.dataset.minSize) || 0;
      const rightMax = parseFloat(rightPanel.dataset.maxSize) || 100;
      newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
      newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));
      const total = newLeftSize + newRightSize;
      if (Math.abs(total - (this.getPanelSize(leftPanel) + this.getPanelSize(rightPanel))) > .1) {
        const targetTotal = this.getPanelSize(leftPanel) + this.getPanelSize(rightPanel);
        const ratio = targetTotal / total;
        newLeftSize *= ratio;
        newRightSize *= ratio;
      }
      this.setPanelSize(leftPanel, newLeftSize);
      this.setPanelSize(rightPanel, newRightSize);
      handle.setAttribute("aria-valuenow", Math.round(newLeftSize));
      this.dispatch("resize", {
        detail: {
          handleIndex: handleIndex,
          sizes: this.getCurrentSizes()
        }
      });
      setTimeout(() => {
        handle.removeAttribute("data-resize-handle-active");
      }, 100);
    }
    handleFocus(event) {
      event.currentTarget.setAttribute("data-resize-handle-state", "hover");
    }
    handleBlur(event) {
      event.currentTarget.setAttribute("data-resize-handle-state", "inactive");
    }
    getCurrentSizes() {
      return this.panelTargets.map(panel => this.getPanelSize(panel));
    }
    setSizes(sizes) {
      if (sizes.length !== this.panelTargets.length) {
        console.warn("Number of sizes must match number of panels");
        return;
      }
      this.panelTargets.forEach((panel, index) => {
        this.setPanelSize(panel, sizes[index]);
      });
      this.handleTargets.forEach((handle, index) => {
        handle.setAttribute("aria-valuenow", Math.round(sizes[index]));
      });
      this.dispatch("resize", {
        detail: {
          sizes: this.getCurrentSizes()
        }
      });
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
      "ui--sidebar": SidebarController,
      "ui--slider": SliderController,
      "ui--sonner": SonnerController,
      "ui--switch": SwitchController,
      "ui--tabs": TabsController,
      "ui--toggle": ToggleController,
      "ui--toggle-group": ToggleGroupController,
      "ui--calendar": CalendarController,
      "ui--carousel": CarouselController,
      "ui--datepicker": DatepickerController,
      "ui--menubar": MenubarController,
      "ui--navigation-menu": NavigationMenuController,
      "ui--resizable": ResizableController
    });
  }
  exports.AccordionController = AccordionController;
  exports.AlertDialogController = AlertDialogController;
  exports.AvatarController = AvatarController;
  exports.CalendarController = CalendarController;
  exports.CarouselController = CarouselController;
  exports.CheckboxController = CheckboxController;
  exports.CollapsibleController = CollapsibleController;
  exports.ComboboxController = ComboboxController;
  exports.CommandController = CommandController;
  exports.CommandDialogController = CommandDialogController;
  exports.ContextMenuController = ContextMenuController;
  exports.DatepickerController = DatepickerController;
  exports.DialogController = DialogController;
  exports.DrawerController = DrawerController;
  exports.DropdownController = DropdownController;
  exports.HelloController = HelloController;
  exports.HoverCardController = HoverCardController;
  exports.InputOtpController = InputOtpController;
  exports.MenubarController = MenubarController;
  exports.NavigationMenuController = NavigationMenuController;
  exports.PopoverController = PopoverController;
  exports.ResizableController = ResizableController;
  exports.ResponsiveDialogController = ResponsiveDialogController;
  exports.ScrollAreaController = ScrollAreaController;
  exports.SelectController = SelectController;
  exports.SidebarController = SidebarController;
  exports.SliderController = SliderController;
  exports.SonnerController = SonnerController;
  exports.SwitchController = SwitchController;
  exports.TabsController = TabsController;
  exports.ToggleController = ToggleController;
  exports.ToggleGroupController = ToggleGroupController;
  exports.TooltipController = TooltipController;
  exports.registerControllers = registerControllers;
  exports.registerControllersInto = registerControllersInto;
  exports.version = version;
});
