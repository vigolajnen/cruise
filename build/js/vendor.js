'use strict';
function pixelGlass() {

  'use strict';

  var doc = document;
  var controlsPanel;
  var bodyContentWrapper;
  var panelClass = 'controls-panel';
  var canBeDisabled = [];

  var prefix = 'pg';
  var filtersList = ['none', 'invert'];
  var statesList = ['off', 'on'];

  var currents = {
    state: getCurrent('state', statesList[1]),
    filter: getCurrent('filter', filtersList[0]),
    opacity: getCurrent('opacity', 0.5)
  };

  var targets = {
    state: {
      elem: doc.documentElement,
      attr: 'data'
    },
    filter: {
      elem: doc.body,
      attr: 'data'
    },
    opacity: {
      elem: doc.body,
      attr: 'style'
    }
  };

  // States switcher params
  var paramsStates = {
    elemTag: 'button',
    elemText: 'on',
    listName: 'states',
    itemName: 'state',
    target: targets.state,
    type: 'button',
    list: statesList,
    canDisableAll: true,
    attrs: {
      tabindex: 1,
    }
  };

  // Filters switcher params
  var paramsFilters = {
    elemTag: 'button',
    elemText: 'invert',
    listName: 'filters',
    itemName: 'filter',
    target: targets.filter,
    type: 'button',
    list: filtersList,
    attrs: {
      tabindex: 2,
    }
  };

  // Opacity range params
  var paramsOpacity = {
    itemName: 'opacity',
    type: 'number',
    target: targets.opacity,
    setAttr: 'style',
    attrs: {
      min: 0,
      max: 1,
      step: 0.1,
      tabindex: 3,
    }
  };

  //---------------------------------------------

  init();

  //---------------------------------------------

  function init() {
    createContolsPanel();
    applyCurrentData();

    if (currents.state === 'on'){
      applyCurrentStyles();
    }
  }

  //---------------------------------------------

  function createContolsPanel() {
    var targetElem = doc.documentElement;

    if ( hasData( doc.body, 'has-sticky-point' ) ) {
      var stickyPoint = doc.querySelector('.sticky-point');

      if( stickyPoint && !localStorage['pg-released'] ) {
        targetElem = stickyPoint;
      }
      // Override defaults for demo page
      currents.state = 'off';
    }

    controlsPanel = doc.createElement('div');
    controlsPanel.classList.add(panelClass);
    targetElem.appendChild(controlsPanel);
    var sides = ['top', 'right', 'bottom', 'left'];

    sides.forEach(function(item) {
      var itemVal = getCurrent(item, '');
      if ( itemVal ) {
        controlsPanel.style[ item ] = itemVal;
      }
    });

    initControls();
  }

  //---------------------------------------------

  function initControls() {
    createButton(paramsStates);
    createButton(paramsFilters);
    createInputNumber(paramsOpacity);

    createDragButton();
  }

  //---------------------------------------------

  function createButton(params) {
    var listName = params.listName;
    var itemName = params.itemName;
    var elemTag = params.elemTag;
    var elemText = params.elemText;
    var type = params.type;
    var list = params.list;
    var action = params.action;
    var currentVal = currents[itemName];
    var attrs = params.attrs;
    var currentNum = list.indexOf(currentVal);
    var canDisableAll = params.canDisableAll;

    var id = itemName;
    var input = doc.createElement(elemTag);
    setClasses( input, [
      panelClass + '__control',
      panelClass + '__control--' + type
    ]);
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    setData( input, 'state-num', currentNum );

    if ( attrs ) {
      for (var attr in attrs) {
        input.setAttribute(attr, attrs[attr]);
      }
    }

    if (elemTag === 'button') {
      input.innerHTML = elemText;
    }

    if ( !canDisableAll ) {
      canBeDisabled.push(input);
    }

    controlsPanel.appendChild(input);

    input.onclick = function() {
      if (!params.target) {
        return;
      }

      currentNum = +!currentNum;
      currentVal = list[currentNum];

      setData( input, 'state-num', currentNum );
      setData( params.target.elem, itemName, currentVal );

      saveLocalStorage(itemName, currentVal);

      if (canDisableAll && canDisableAll === true) {
        if (currentVal === 'off'){
          removeCurrentStyles();
          disableInputs();
        }
        else {
          applyCurrentStyles();
          enableInputs();
        }
      }
    };
  }

  //---------------------------------------------

  function createInputNumber(params) {
    var itemName = params.itemName;
    var attrs = params.attrs;
    var type = params.type;
    var setAttr = params.setAttr;
    var canDisableAll = params.canDisableAll;

    var id = itemName;
    var input = doc.createElement('input');
    setClasses( input, [
      panelClass + '__control',
      panelClass + '__control--' + type
    ]);
    input.setAttribute('type', type);
    input.setAttribute('id', id);

    for (var attr in attrs) {
      input.setAttribute(attr, attrs[attr]);
    }
    input.setAttribute('value', currents[itemName]);

    if ( !canDisableAll ) {
      canBeDisabled.push(input);
    }

    controlsPanel.appendChild(input);

    input.oninput = function() {
      if (setAttr === 'style') {
        params.target.elem.style[itemName] = this.value;
        saveLocalStorage(itemName, this.value);
      }
    };
  }

  //---------------------------------------------

  function createDragButton() {
    var input = doc.createElement('button');
    setClasses( input, [
      panelClass + '__control',
      panelClass + '__control--drag-n-drop'
    ]);
    input.setAttribute('type', 'button');
    input.innerHTML = ' ';

    controlsPanel.appendChild(input);

    input.onmousedown = function () {
      //Place it here to get real sizes after
      // external styles has been loaded
      var offsetTop = this.offsetTop;
      var offsetLeft = controlsPanel.clientWidth - this.clientWidth;
      var styles = getComputedStyle(controlsPanel);

      controlsPanel.style.top = styles.top;
      controlsPanel.style.left = styles.left;
      controlsPanel.style.right = 'auto';
      controlsPanel.style.bottom = 'auto';

      doc.onmousemove = function ( ev ) {
        var x = (ev.clientX - offsetLeft ) + 'px';
        var y = (ev.clientY) + 'px';

        controlsPanel.style.left = x;
        controlsPanel.style.top = y;
      };
    };

    input.onmouseup = function () {
      var styles = getComputedStyle(controlsPanel);
      var left = +styles.left.replace(/px/,'');
      var right = +styles.right.replace(/px/,'');
      var top = +styles.top.replace(/px/,'');
      var bottom = +styles.bottom.replace(/px/,'');

      if ( left > right ) {
        saveLocalStorage('left', 'auto');
        saveLocalStorage('right', styles.right);

        controlsPanel.style.right = styles.right;
        controlsPanel.style.left = 'auto';
      }
      else {
        saveLocalStorage('left', styles.left);
        saveLocalStorage('right', 'auto'); //'auto' needs to override default position;
      }
      if ( top > bottom ) {
        saveLocalStorage('top', 'auto');
        saveLocalStorage('bottom', styles.bottom);

        controlsPanel.style.bottom = styles.bottom;
        controlsPanel.style.top = 'auto';
      }
      else {
        saveLocalStorage('top', styles.top);
        saveLocalStorage('bottom', 'auto');
      }

      doc.onmousemove = null;
    };
  }

  //---------------------------------------------

  function disableInputs() {
    canBeDisabled.forEach(function(item) {
      item.setAttribute('disabled', '');
    });
  }

  //---------------------------------------------

  function enableInputs() {
    canBeDisabled.forEach(function(item) {
      item.removeAttribute('disabled');
    });
  }

  //---------------------------------------------

  function getCurrent(name, defaultValue) {
    var itemName = [prefix, name].join('-');
    var localStorageVal = localStorage[ itemName ];
    return localStorageVal ? localStorageVal : defaultValue;
  }

  //---------------------------------------------

  function saveLocalStorage(name, value) {
    var itemName = [prefix, name].join('-');
    localStorage[itemName] = value;
  }

  //---------------------------------------------

  // Not used
  function getBodyOpacity() {
    var opacityStr = getComputedStyle(doc.body).opacity;
    return +opacityStr;
  }

  //---------------------------------------------

  // Not used
  function addExternalCSS() {
    var styleElem = doc.createElement('style');
    var cssLink = doc.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', '../pixel-glass-js/styles.css');

    doc.head.appendChild(cssLink);
  }

  //---------------------------------------------

  function applyCurrentData() {
    for (var key in targets ) {
      var target = targets[ key ];
      var current = currents[ key ];

      if (target.attr === 'data') {
        setData( target.elem, key, current );
      }
    }

    if(currents.state === 'off') {
      disableInputs();
    }
  }
  //---------------------------------------------

  function applyCurrentStyles() {
    for (var key in targets ) {
      var target = targets[ key ];
      var current = currents[ key ];

      if (target.attr === 'style') {
        target.elem.style[ key ] = current;
      }
    }
  }

  //---------------------------------------------

  function removeCurrentStyles() {
    for (var key in targets ) {
      var target = targets[ key ];

      if (target.attr === 'style') {
        target.elem.style[ key ] = '';
      }
    }
  }

  //---------------------------------------------

  // Made for IE10, it doesn't support dataset

  function hasData( elem, dataName ) {
    if ( !elem ) {
      return false;
    }

    dataName = 'data-' + dataName;

    if ( elem.getAttribute( dataName) !== undefined && elem.getAttribute( dataName) !== null ) {
      return true;
    }

    return false;
  }

  //---------------------------------------------

  function setData( elem, dataName, dataVal ) {
    if ( !elem ) {
      return;
    }

    dataName = 'data-' + dataName;
    elem.setAttribute( dataName, dataVal );
  }

  //---------------------------------------------

  // Made for IE10, it doesn't support
  // multiply classes for classList.add

  function setClasses( elem, classes ) {
    if ( !elem ) {
      return;
    }

    if ( classes.length > 0 ) {
      classes.forEach( function ( className ) {
        elem.classList.add( className );
      });
    }
  }

  //---------------------------------------------
}

window.onload = function () {
  pixelGlass();
};
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), 
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
svg4everybody();