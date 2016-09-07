//START AjaxControlToolkit.Common.Common.js
Type.registerNamespace('AjaxControlToolkit');AjaxControlToolkit.BoxSide = function() {
}
AjaxControlToolkit.BoxSide.prototype = {
Top : 0,
Right : 1,
Bottom : 2,
Left : 3
}
AjaxControlToolkit.BoxSide.registerEnum("AjaxControlToolkit.BoxSide", false);AjaxControlToolkit._CommonToolkitScripts = function() {
}
AjaxControlToolkit._CommonToolkitScripts.prototype = {
_borderStyleNames : ["borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle"],
_borderWidthNames : ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
_paddingWidthNames : ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
_marginWidthNames : ["marginTop", "marginRight", "marginBottom", "marginLeft"],
getCurrentStyle : function(element, attribute, defaultValue) {
var currentValue = null;if (element) {
if (element.currentStyle) {
currentValue = element.currentStyle[attribute];} else if (document.defaultView && document.defaultView.getComputedStyle) {
var style = document.defaultView.getComputedStyle(element, null);if (style) {
currentValue = style[attribute];}
}
if (!currentValue && element.style.getPropertyValue) {
currentValue = element.style.getPropertyValue(attribute);}
else if (!currentValue && element.style.getAttribute) {
currentValue = element.style.getAttribute(attribute);} 
}
if ((!currentValue || currentValue == "" || typeof(currentValue) === 'undefined')) {
if (typeof(defaultValue) != 'undefined') {
currentValue = defaultValue;}
else {
currentValue = null;}
} 
return currentValue;},
getInheritedBackgroundColor : function(element) {
if (!element) return '#FFFFFF';var background = this.getCurrentStyle(element, 'backgroundColor');try {
while (!background || background == '' || background == 'transparent' || background == 'rgba(0, 0, 0, 0)') {
element = element.parentNode;if (!element) {
background = '#FFFFFF';} else {
background = this.getCurrentStyle(element, 'backgroundColor');}
}
} catch(ex) {
background = '#FFFFFF';}
return background;},
getLocation : function(element) {
if (element === document.documentElement) {
return new Sys.UI.Point(0,0);}
if (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7) {
if (element.window === element || element.nodeType === 9 || !element.getClientRects || !element.getBoundingClientRect) return new Sys.UI.Point(0,0);var screenRects = element.getClientRects();if (!screenRects || !screenRects.length) {
return new Sys.UI.Point(0,0);}
var first = screenRects[0];var dLeft = 0;var dTop = 0;var inFrame = false;try {
inFrame = element.ownerDocument.parentWindow.frameElement;} catch(ex) {
inFrame = true;}
if (inFrame) {
var clientRect = element.getBoundingClientRect();if (!clientRect) {
return new Sys.UI.Point(0,0);}
var minLeft = first.left;var minTop = first.top;for (var i = 1;i < screenRects.length;i++) {
var r = screenRects[i];if (r.left < minLeft) {
minLeft = r.left;}
if (r.top < minTop) {
minTop = r.top;}
}
dLeft = minLeft - clientRect.left;dTop = minTop - clientRect.top;}
var ownerDocument = element.document.documentElement;return new Sys.UI.Point(first.left - 2 - dLeft + ownerDocument.scrollLeft, first.top - 2 - dTop + ownerDocument.scrollTop);}
return Sys.UI.DomElement.getLocation(element);},
setLocation : function(element, point) {
Sys.UI.DomElement.setLocation(element, point.x, point.y);},
getContentSize : function(element) {
if (!element) {
throw Error.argumentNull('element');}
var size = this.getSize(element);var borderBox = this.getBorderBox(element);var paddingBox = this.getPaddingBox(element);return {
width : size.width - borderBox.horizontal - paddingBox.horizontal,
height : size.height - borderBox.vertical - paddingBox.vertical
}
},
getSize : function(element) {
if (!element) {
throw Error.argumentNull('element');}
return {
width: element.offsetWidth,
height: element.offsetHeight
};},
setContentSize : function(element, size) {
if (!element) {
throw Error.argumentNull('element');}
if (!size) {
throw Error.argumentNull('size');}
if(this.getCurrentStyle(element, 'MozBoxSizing') == 'border-box' || this.getCurrentStyle(element, 'BoxSizing') == 'border-box') {
var borderBox = this.getBorderBox(element);var paddingBox = this.getPaddingBox(element);size = {
width: size.width + borderBox.horizontal + paddingBox.horizontal,
height: size.height + borderBox.vertical + paddingBox.vertical
};}
element.style.width = size.width.toString() + 'px';element.style.height = size.height.toString() + 'px';},
setSize : function(element, size) {
if (!element) {
throw Error.argumentNull('element');}
if (!size) {
throw Error.argumentNull('size');}
var borderBox = this.getBorderBox(element);var paddingBox = this.getPaddingBox(element);var contentSize = {
width: size.width - borderBox.horizontal - paddingBox.horizontal,
height: size.height - borderBox.vertical - paddingBox.vertical
};this.setContentSize(element, contentSize);},
getBounds : function(element) {
var offset = $common.getLocation(element);return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);}, 
setBounds : function(element, bounds) {
if (!element) {
throw Error.argumentNull('element');}
if (!bounds) {
throw Error.argumentNull('bounds');}
this.setSize(element, bounds);$common.setLocation(element, bounds);},
getClientBounds : function() {
var clientWidth;var clientHeight;switch(Sys.Browser.agent) {
case Sys.Browser.InternetExplorer:
clientWidth = document.documentElement.clientWidth;clientHeight = document.documentElement.clientHeight;break;case Sys.Browser.Safari:
clientWidth = window.innerWidth;clientHeight = window.innerHeight;break;case Sys.Browser.Opera:
clientWidth = Math.min(window.innerWidth, document.body.clientWidth);clientHeight = Math.min(window.innerHeight, document.body.clientHeight);break;default: 
clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);clientHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);break;}
return new Sys.UI.Bounds(0, 0, clientWidth, clientHeight);},
getMarginBox : function(element) {
if (!element) {
throw Error.argumentNull('element');}
var box = {
top: this.getMargin(element, AjaxControlToolkit.BoxSide.Top),
right: this.getMargin(element, AjaxControlToolkit.BoxSide.Right),
bottom: this.getMargin(element, AjaxControlToolkit.BoxSide.Bottom),
left: this.getMargin(element, AjaxControlToolkit.BoxSide.Left)
};box.horizontal = box.left + box.right;box.vertical = box.top + box.bottom;return box;},
getBorderBox : function(element) {
if (!element) {
throw Error.argumentNull('element');}
var box = {
top: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Top),
right: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Right),
bottom: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Bottom),
left: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Left)
};box.horizontal = box.left + box.right;box.vertical = box.top + box.bottom;return box;},
getPaddingBox : function(element) {
if (!element) {
throw Error.argumentNull('element');}
var box = {
top: this.getPadding(element, AjaxControlToolkit.BoxSide.Top),
right: this.getPadding(element, AjaxControlToolkit.BoxSide.Right),
bottom: this.getPadding(element, AjaxControlToolkit.BoxSide.Bottom),
left: this.getPadding(element, AjaxControlToolkit.BoxSide.Left)
};box.horizontal = box.left + box.right;box.vertical = box.top + box.bottom;return box;},
isBorderVisible : function(element, boxSide) {
if (!element) {
throw Error.argumentNull('element');}
if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));}
var styleName = this._borderStyleNames[boxSide];var styleValue = this.getCurrentStyle(element, styleName);return styleValue != "none";},
getMargin : function(element, boxSide) {
if (!element) {
throw Error.argumentNull('element');}
if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));}
var styleName = this._marginWidthNames[boxSide];var styleValue = this.getCurrentStyle(element, styleName);try { return this.parsePadding(styleValue);} catch(ex) { return 0;}
},
getBorderWidth : function(element, boxSide) {
if (!element) {
throw Error.argumentNull('element');}
if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));}
if(!this.isBorderVisible(element, boxSide)) {
return 0;} 
var styleName = this._borderWidthNames[boxSide];var styleValue = this.getCurrentStyle(element, styleName);return this.parseBorderWidth(styleValue);},
getPadding : function(element, boxSide) {
if (!element) {
throw Error.argumentNull('element');}
if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));}
var styleName = this._paddingWidthNames[boxSide];var styleValue = this.getCurrentStyle(element, styleName);return this.parsePadding(styleValue);},
parseBorderWidth : function(borderWidth) {
if (!this._borderThicknesses) {
var borderThicknesses = { };var div0 = document.createElement('div');div0.style.visibility = 'hidden';div0.style.position = 'absolute';div0.style.fontSize = '1px';document.body.appendChild(div0)
var div1 = document.createElement('div');div1.style.height = '0px';div1.style.overflow = 'hidden';div0.appendChild(div1);var base = div0.offsetHeight;div1.style.borderTop = 'solid black';div1.style.borderTopWidth = 'thin';borderThicknesses['thin'] = div0.offsetHeight - base;div1.style.borderTopWidth = 'medium';borderThicknesses['medium'] = div0.offsetHeight - base;div1.style.borderTopWidth = 'thick';borderThicknesses['thick'] = div0.offsetHeight - base;div0.removeChild(div1);document.body.removeChild(div0);this._borderThicknesses = borderThicknesses;}
if (borderWidth) {
switch(borderWidth) {
case 'thin':
case 'medium':
case 'thick':
return this._borderThicknesses[borderWidth];case 'inherit':
return 0;}
var unit = this.parseUnit(borderWidth);Sys.Debug.assert(unit.type == 'px', String.format(AjaxControlToolkit.Resources.Common_InvalidBorderWidthUnit, unit.type));return unit.size;}
return 0;},
parsePadding : function(padding) {
if(padding) {
if(padding == 'inherit') {
return 0;}
var unit = this.parseUnit(padding);Sys.Debug.assert(unit.type == 'px', String.format(AjaxControlToolkit.Resources.Common_InvalidPaddingUnit, unit.type));return unit.size;}
return 0;},
parseUnit : function(value) {
if (!value) {
throw Error.argumentNull('value');}
value = value.trim().toLowerCase();var l = value.length;var s = -1;for(var i = 0;i < l;i++) {
var ch = value.substr(i, 1);if((ch < '0' || ch > '9') && ch != '-' && ch != '.' && ch != ',') {
break;}
s = i;}
if(s == -1) {
throw Error.create(AjaxControlToolkit.Resources.Common_UnitHasNoDigits);}
var type;var size;if(s < (l - 1)) {
type = value.substring(s + 1).trim();} else {
type = 'px';}
size = parseFloat(value.substr(0, s + 1));if(type == 'px') {
size = Math.floor(size);}
return { 
size: size,
type: type
};},
getElementOpacity : function(element) {
if (!element) {
throw Error.argumentNull('element');}
var hasOpacity = false;var opacity;if (element.filters) {
var filters = element.filters;if (filters.length !== 0) {
var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];if (alphaFilter) {
opacity = alphaFilter.opacity / 100.0;hasOpacity = true;}
}
}
else {
opacity = this.getCurrentStyle(element, 'opacity', 1);hasOpacity = true;}
if (hasOpacity === false) {
return 1.0;}
return parseFloat(opacity);},
setElementOpacity : function(element, value) {
if (!element) {
throw Error.argumentNull('element');}
if (element.filters) {
var filters = element.filters;var createFilter = true;if (filters.length !== 0) {
var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];if (alphaFilter) {
createFilter = false;alphaFilter.opacity = value * 100;}
}
if (createFilter) {
element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (value * 100) + ')';}
}
else {
element.style.opacity = value;}
},
getVisible : function(element) {
return (element &&
("none" != $common.getCurrentStyle(element, "display")) &&
("hidden" != $common.getCurrentStyle(element, "visibility")));},
setVisible : function(element, value) {
if (element && value != $common.getVisible(element)) {
if (value) {
if (element.style.removeAttribute) {
element.style.removeAttribute("display");} else {
element.style.removeProperty("display");}
} else {
element.style.display = 'none';}
element.style.visibility = value ? 'visible' : 'hidden';}
},
resolveFunction : function(value) {
if (value) {
if (value instanceof Function) {
return value;} else if (String.isInstanceOfType(value) && value.length > 0) {
var func;if ((func = window[value]) instanceof Function) {
return func;} else if ((func = eval(value)) instanceof Function) {
return func;}
}
}
return null;},
addCssClasses : function(element, classNames) {
for(var i = 0;i < classNames.length;i++) {
Sys.UI.DomElement.addCssClass(element, classNames[i]);}
},
removeCssClasses : function(element, classNames) {
for(var i = 0;i < classNames.length;i++) {
Sys.UI.DomElement.removeCssClass(element, classNames[i]);}
},
setStyle : function(element, style) {
$common.applyProperties(element.style, style);},
removeHandlers : function(element, events) {
for (var name in events) {
$removeHandler(element, name, events[name]);}
},
overlaps : function(r1, r2) {
return r1.x < (r2.x + r2.width)
&& r2.x < (r1.x + r1.width)
&& r1.y < (r2.y + r2.height)
&& r2.y < (r1.y + r1.height);},
containsPoint : function(rect, x, y) {
return x >= rect.x && x < (rect.x + rect.width) && y >= rect.y && y < (rect.y + rect.height);},
isKeyDigit : function(keyCode) { 
return (0x30 <= keyCode && keyCode <= 0x39);},
isKeyNavigation : function(keyCode) { 
return (Sys.UI.Key.left <= keyCode && keyCode <= Sys.UI.Key.down);},
padLeft : function(text, size, ch, truncate) { 
return $common._pad(text, size || 2, ch || ' ', 'l', truncate || false);},
padRight : function(text, size, ch, truncate) { 
return $common._pad(text, size || 2, ch || ' ', 'r', truncate || false);},
_pad : function(text, size, ch, side, truncate) {
text = text.toString();var length = text.length;var builder = new Sys.StringBuilder();if (side == 'r') {
builder.append(text);} 
while (length < size) {
builder.append(ch);length++;}
if (side == 'l') {
builder.append(text);}
var result = builder.toString();if (truncate && result.length > size) {
if (side == 'l') {
result = result.substr(result.length - size, size);} else {
result = result.substr(0, size);}
}
return result;},
__DOMEvents : {
focusin : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focusin", true, false, window, 1);} },
focusout : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focusout", true, false, window, 1);} },
activate : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("activate", true, true, window, 1);} },
focus : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focus", false, false, window, 1);} },
blur : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("blur", false, false, window, 1);} },
click : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("click", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
dblclick : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("click", true, true, window, 2, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
mousedown : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousedown", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
mouseup : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mouseup", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
mouseover : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mouseover", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
mousemove : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
mouseout : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null);} },
load : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("load", false, false);} },
unload : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("unload", false, false);} },
select : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("select", true, false);} },
change : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("change", true, false);} },
submit : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("submit", true, true);} },
reset : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("reset", true, false);} },
resize : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("resize", true, false);} },
scroll : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("scroll", true, false);} }
},
tryFireRawEvent : function(element, rawEvent) {
try {
if (element.fireEvent) {
element.fireEvent("on" + rawEvent.type, rawEvent);return true;} else if (element.dispatchEvent) {
element.dispatchEvent(rawEvent);return true;}
} catch (e) {
}
return false;}, 
tryFireEvent : function(element, eventName, properties) {
try {
if (document.createEventObject) {
var e = document.createEventObject();$common.applyProperties(e, properties || {});element.fireEvent("on" + eventName, e);return true;} else if (document.createEvent) {
var def = $common.__DOMEvents[eventName];if (def) {
var e = document.createEvent(def.eventGroup);def.init(e, properties || {});element.dispatchEvent(e);return true;}
}
} catch (e) {
}
return false;},
wrapElement : function(innerElement, newOuterElement, newInnerParentElement) {
var parent = innerElement.parentNode;parent.replaceChild(newOuterElement, innerElement);(newInnerParentElement || newOuterElement).appendChild(innerElement);},
unwrapElement : function(innerElement, oldOuterElement) {
var parent = oldOuterElement.parentNode;if (parent != null) {
$common.removeElement(innerElement);parent.replaceChild(innerElement, oldOuterElement);}
},
removeElement : function(element) {
var parent = element.parentNode;if (parent != null) {
parent.removeChild(element);}
},
applyProperties : function(target, properties) {
for (var p in properties) {
var pv = properties[p];if (pv != null && Object.getType(pv)===Object) {
var tv = target[p];$common.applyProperties(tv, pv);} else {
target[p] = pv;}
}
},
createElementFromTemplate : function(template, appendToParent, nameTable) {
if (typeof(template.nameTable)!='undefined') {
var newNameTable = template.nameTable;if (String.isInstanceOfType(newNameTable)) {
newNameTable = nameTable[newNameTable];}
if (newNameTable != null) {
nameTable = newNameTable;}
}
var elementName = null;if (typeof(template.name)!=='undefined') {
elementName = template.name;}
var elt = document.createElement(template.nodeName);if (typeof(template.name)!=='undefined' && nameTable) {
nameTable[template.name] = elt;}
if (typeof(template.parent)!=='undefined' && appendToParent == null) {
var newParent = template.parent;if (String.isInstanceOfType(newParent)) {
newParent = nameTable[newParent];}
if (newParent != null) {
appendToParent = newParent;}
}
if (typeof(template.properties)!=='undefined' && template.properties != null) {
$common.applyProperties(elt, template.properties);}
if (typeof(template.cssClasses)!=='undefined' && template.cssClasses != null) {
$common.addCssClasses(elt, template.cssClasses);}
if (typeof(template.events)!=='undefined' && template.events != null) {
$addHandlers(elt, template.events);}
if (typeof(template.visible)!=='undefined' && template.visible != null) {
this.setVisible(elt, template.visible);}
if (appendToParent) {
appendToParent.appendChild(elt);}
if (typeof(template.opacity)!=='undefined' && template.opacity != null) {
$common.setElementOpacity(elt, template.opacity);}
if (typeof(template.children)!=='undefined' && template.children != null) {
for (var i = 0;i < template.children.length;i++) {
var subtemplate = template.children[i];$common.createElementFromTemplate(subtemplate, elt, nameTable);}
}
var contentPresenter = elt;if (typeof(template.contentPresenter)!=='undefined' && template.contentPresenter != null) {
contentPresenter = nameTable[contentPresenter];}
if (typeof(template.content)!=='undefined' && template.content != null) {
var content = template.content;if (String.isInstanceOfType(content)) {
content = nameTable[content];}
if (content.parentNode) {
$common.wrapElement(content, elt, contentPresenter);} else {
contentPresenter.appendChild(content);}
}
return elt;},
prepareHiddenElementForATDeviceUpdate : function () {
var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');if (!objHidden) {
var objHidden = document.createElement('input');objHidden.setAttribute('type', 'hidden');objHidden.setAttribute('value', '1');objHidden.setAttribute('id', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');objHidden.setAttribute('name', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');if ( document.forms[0] ) {
document.forms[0].appendChild(objHidden);}
}
},
updateFormToRefreshATDeviceBuffer : function () {
var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');if (objHidden) {
if (objHidden.getAttribute('value') == '1') {
objHidden.setAttribute('value', '0');} else {
objHidden.setAttribute('value', '1');}
}
}
}
var CommonToolkitScripts = AjaxControlToolkit.CommonToolkitScripts = new AjaxControlToolkit._CommonToolkitScripts();var $common = CommonToolkitScripts;Sys.UI.DomElement.getVisible = $common.getVisible;Sys.UI.DomElement.setVisible = $common.setVisible;Sys.UI.Control.overlaps = $common.overlaps;AjaxControlToolkit._DomUtility = function() {
}
AjaxControlToolkit._DomUtility.prototype = {
isDescendant : function(ancestor, descendant) {
for (var n = descendant.parentNode;n != null;n = n.parentNode) {
if (n == ancestor) return true;}
return false;},
isDescendantOrSelf : function(ancestor, descendant) {
if (ancestor === descendant) 
return true;return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);},
isAncestor : function(descendant, ancestor) {
return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);},
isAncestorOrSelf : function(descendant, ancestor) {
if (descendant === ancestor)
return true;return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);},
isSibling : function(self, sibling) {
var parent = self.parentNode;for (var i = 0;i < parent.childNodes.length;i++) {
if (parent.childNodes[i] == sibling) return true;}
return false;}
}
AjaxControlToolkit._DomUtility.registerClass("AjaxControlToolkit._DomUtility");AjaxControlToolkit.DomUtility = new AjaxControlToolkit._DomUtility();AjaxControlToolkit.TextBoxWrapper = function(element) {
AjaxControlToolkit.TextBoxWrapper.initializeBase(this, [element]);this._current = element.value;this._watermark = null;this._isWatermarked = false;}
AjaxControlToolkit.TextBoxWrapper.prototype = {
dispose : function() {
this.get_element().AjaxControlToolkitTextBoxWrapper = null;AjaxControlToolkit.TextBoxWrapper.callBaseMethod(this, 'dispose');},
get_Current : function() {
this._current = this.get_element().value;return this._current;},
set_Current : function(value) {
this._current = value;this._updateElement();},
get_Value : function() {
if (this.get_IsWatermarked()) {
return "";} else {
return this.get_Current();}
},
set_Value : function(text) {
this.set_Current(text);if (!text || (0 == text.length)) {
if (null != this._watermark) {
this.set_IsWatermarked(true);}
} else {
this.set_IsWatermarked(false);}
},
get_Watermark : function() {
return this._watermark;},
set_Watermark : function(value) {
this._watermark = value;this._updateElement();},
get_IsWatermarked : function() {
return this._isWatermarked;},
set_IsWatermarked : function(isWatermarked) {
if (this._isWatermarked != isWatermarked) {
this._isWatermarked = isWatermarked;this._updateElement();this._raiseWatermarkChanged();}
},
_updateElement : function() {
var element = this.get_element();if (this._isWatermarked) {
if (element.value != this._watermark) {
element.value = this._watermark;}
} else {
if (element.value != this._current) {
element.value = this._current;}
}
},
add_WatermarkChanged : function(handler) {
this.get_events().addHandler("WatermarkChanged", handler);},
remove_WatermarkChanged : function(handler) {
this.get_events().removeHandler("WatermarkChanged", handler);},
_raiseWatermarkChanged : function() {
var onWatermarkChangedHandler = this.get_events().getHandler("WatermarkChanged");if (onWatermarkChangedHandler) {
onWatermarkChangedHandler(this, Sys.EventArgs.Empty);}
}
}
AjaxControlToolkit.TextBoxWrapper.get_Wrapper = function(element) {
if (null == element.AjaxControlToolkitTextBoxWrapper) {
element.AjaxControlToolkitTextBoxWrapper = new AjaxControlToolkit.TextBoxWrapper(element);}
return element.AjaxControlToolkitTextBoxWrapper;}
AjaxControlToolkit.TextBoxWrapper.registerClass('AjaxControlToolkit.TextBoxWrapper', Sys.UI.Behavior);AjaxControlToolkit.TextBoxWrapper.validatorGetValue = function(id) {
var control = $get(id);if (control && control.AjaxControlToolkitTextBoxWrapper) {
return control.AjaxControlToolkitTextBoxWrapper.get_Value();}
return AjaxControlToolkit.TextBoxWrapper._originalValidatorGetValue(id);}
if (typeof(ValidatorGetValue) == 'function') {
AjaxControlToolkit.TextBoxWrapper._originalValidatorGetValue = ValidatorGetValue;ValidatorGetValue = AjaxControlToolkit.TextBoxWrapper.validatorGetValue;}
if (Sys.CultureInfo.prototype._getAbbrMonthIndex) {
try {
Sys.CultureInfo.prototype._getAbbrMonthIndex('');} catch(ex) {
Sys.CultureInfo.prototype._getAbbrMonthIndex = function(value) {
if (!this._upperAbbrMonths) {
this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);}
return Array.indexOf(this._upperAbbrMonths, this._toUpper(value));}
Sys.CultureInfo.CurrentCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;Sys.CultureInfo.InvariantCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;}
}

//END AjaxControlToolkit.Common.Common.js
//START AjaxControlToolkit.Common.DateTime.js
Type.registerNamespace("AjaxControlToolkit");AjaxControlToolkit.TimeSpan = function() {
if (arguments.length == 0) this._ctor$0.apply(this, arguments);else if (arguments.length == 1) this._ctor$1.apply(this, arguments);else if (arguments.length == 3) this._ctor$2.apply(this, arguments);else if (arguments.length == 4) this._ctor$3.apply(this, arguments);else if (arguments.length == 5) this._ctor$4.apply(this, arguments);else throw Error.parameterCount();}
AjaxControlToolkit.TimeSpan.prototype = {
_ctor$0 : function() {
this._ticks = 0;}, 
_ctor$1 : function(ticks) {
this._ctor$0();this._ticks = ticks;},
_ctor$2 : function(hours, minutes, seconds) {
this._ctor$0();this._ticks = 
(hours * AjaxControlToolkit.TimeSpan.TicksPerHour) +
(minutes * AjaxControlToolkit.TimeSpan.TicksPerMinute) +
(seconds * AjaxControlToolkit.TimeSpan.TicksPerSecond);},
_ctor$3 : function(days, hours, minutes, seconds) {
this._ctor$0();this._ticks = 
(days * AjaxControlToolkit.TimeSpan.TicksPerDay) +
(hours * AjaxControlToolkit.TimeSpan.TicksPerHour) +
(minutes * AjaxControlToolkit.TimeSpan.TicksPerMinute) +
(seconds * AjaxControlToolkit.TimeSpan.TicksPerSecond);},
_ctor$4 : function(days, hours, minutes, seconds, milliseconds) {
this._ctor$0();this._ticks = 
(days * AjaxControlToolkit.TimeSpan.TicksPerDay) +
(hours * AjaxControlToolkit.TimeSpan.TicksPerHour) +
(minutes * AjaxControlToolkit.TimeSpan.TicksPerMinute) +
(seconds * AjaxControlToolkit.TimeSpan.TicksPerSecond) +
(milliseconds * AjaxControlToolkit.TimeSpan.TicksPerMillisecond);},
getDays : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerDay);},
getHours : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerHour) % 24;},
getMinutes : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerMinute) % 60;},
getSeconds : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerSecond) % 60;},
getMilliseconds : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerMillisecond) % 1000;},
getDuration : function() { 
return new AjaxControlToolkit.TimeSpan(Math.abs(this._ticks));},
getTicks : function() { 
return this._ticks;},
getTotalDays : function() { 
Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerDay);},
getTotalHours : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerHour);},
getTotalMinutes : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerMinute);},
getTotalSeconds : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerSecond);},
getTotalMilliseconds : function() { 
return Math.floor(this._ticks / AjaxControlToolkit.TimeSpan.TicksPerMillisecond);},
add : function(value) { 
return new AjaxControlToolkit.TimeSpan(this._ticks + value.getTicks());},
subtract : function(value) { 
return new AjaxControlToolkit.TimeSpan(this._ticks - value.getTicks());},
negate : function() { 
return new AjaxControlToolkit.TimeSpan(-this._ticks);},
equals : function(value) { 
return this._ticks == value.getTicks();},
compareTo : function(value) { 
if(this._ticks > value.getTicks()) 
return 1;else if(this._ticks < value.getTicks()) 
return -1;else 
return 0;},
toString : function() { 
return this.format("F");},
format : function(format) { 
if (!format) {
format = "F";}
if (format.length == 1) {
switch (format) {
case "t": format = AjaxControlToolkit.TimeSpan.ShortTimeSpanPattern;break;case "T": format = AjaxControlToolkit.TimeSpan.LongTimeSpanPattern;break;case "F": format = AjaxControlToolkit.TimeSpan.FullTimeSpanPattern;break;default: throw Error.createError(String.format(AjaxControlToolkit.Resources.Common_DateTime_InvalidTimeSpan, format));}
}
var regex = /dd|d|hh|h|mm|m|ss|s|nnnn|nnn|nn|n/g;var builder = new Sys.StringBuilder();var ticks = this._ticks;if (ticks < 0) {
builder.append("-");ticks = -ticks;}
for (;;) {
var index = regex.lastIndex;var ar = regex.exec(format);builder.append(format.slice(index, ar ? ar.index : format.length));if (!ar) break;switch (ar[0]) {
case "dd":
case "d":
builder.append($common.padLeft(Math.floor(ticks / AjaxControlToolkit.TimeSpan.TicksPerDay, ar[0].length, '0')));break;case "hh":
case "h":
builder.append($common.padLeft(Math.floor(ticks / AjaxControlToolkit.TimeSpan.TicksPerHour) % 24, ar[0].length, '0'));break;case "mm":
case "m":
builder.append($common.padLeft(Math.floor(ticks / AjaxControlToolkit.TimeSpan.TicksPerMinute) % 60, ar[0].length, '0'));break;case "ss":
case "s":
builder.append($common.padLeft(Math.floor(ticks / AjaxControlToolkit.TimeSpan.TicksPerSecond) % 60, ar[0].length, '0'));break;case "nnnn":
case "nnn":
case "nn":
case "n":
builder.append($common.padRight(Math.floor(ticks / AjaxControlToolkit.TimeSpan.TicksPerMillisecond) % 1000, ar[0].length, '0', true));break;default:
Sys.Debug.assert(false);}
}
return builder.toString();}
}
AjaxControlToolkit.TimeSpan.parse = function(text) {
var parts = text.split(":");var d = 0;var h = 0;var m = 0;var s = 0;var n = 0;var ticks = 0;switch(parts.length) {
case 1:
if (parts[0].indexOf(".") != -1) {
var parts2 = parts[0].split(".");s = parseInt(parts2[0]);n = parseInt(parts2[1]);} else {
ticks = parseInt(parts[0]);}
break;case 2:
h = parseInt(parts[0]);m = parseInt(parts[1]);break;case 3:
h = parseInt(parts[0]);m = parseInt(parts[1]);if (parts[2].indexOf(".") != -1) {
var parts2 = parts[2].split(".");s = parseInt(parts2[0]);n = parseInt(parts2[1]);} else {
s = parseInt(parts[2]);}
break;case 4:
d = parseInt(parts[0]);h = parseInt(parts[1]);m = parseInt(parts[2]);if (parts[3].indexOf(".") != -1) {
var parts2 = parts[3].split(".");s = parseInt(parts2[0]);n = parseInt(parts2[1]);} else {
s = parseInt(parts[3]);}
break;}
ticks += (d * AjaxControlToolkit.TimeSpan.TicksPerDay) +
(h * AjaxControlToolkit.TimeSpan.TicksPerHour) +
(m * AjaxControlToolkit.TimeSpan.TicksPerMinute) +
(s * AjaxControlToolkit.TimeSpan.TicksPerSecond) +
(n * AjaxControlToolkit.TimeSpan.TicksPerMillisecond);if(!isNaN(ticks)) {
return new AjaxControlToolkit.TimeSpan(ticks);} 
throw Error.create(AjaxControlToolkit.Resources.Common_DateTime_InvalidFormat);}
AjaxControlToolkit.TimeSpan.fromTicks = function(ticks) { 
return new AjaxControlToolkit.TimeSpan(ticks);}
AjaxControlToolkit.TimeSpan.fromDays = function(days) { 
return new AjaxControlToolkit.TimeSpan(days * AjaxControlToolkit.TimeSpan.TicksPerDay);}
AjaxControlToolkit.TimeSpan.fromHours = function(hours) { 
return new AjaxControlToolkit.TimeSpan(hours * AjaxControlToolkit.TimeSpan.TicksPerHour);}
AjaxControlToolkit.TimeSpan.fromMinutes = function(minutes) { 
return new AjaxControlToolkit.TimeSpan(minutes * AjaxControlToolkit.TimeSpan.TicksPerMinute);}
AjaxControlToolkit.TimeSpan.fromSeconds = function(seconds) { 
return new AjaxControlToolkit.TimeSpan(minutes * AjaxControlToolkit.TimeSpan.TicksPerSecond);}
AjaxControlToolkit.TimeSpan.fromMilliseconds = function(milliseconds) { 
return new AjaxControlToolkit.TimeSpan(minutes * AjaxControlToolkit.TimeSpan.TicksPerMillisecond);}
AjaxControlToolkit.TimeSpan.TicksPerDay = 864000000000;AjaxControlToolkit.TimeSpan.TicksPerHour = 36000000000;AjaxControlToolkit.TimeSpan.TicksPerMinute = 600000000;AjaxControlToolkit.TimeSpan.TicksPerSecond = 10000000;AjaxControlToolkit.TimeSpan.TicksPerMillisecond = 10000;AjaxControlToolkit.TimeSpan.FullTimeSpanPattern = "dd:hh:mm:ss.nnnn";AjaxControlToolkit.TimeSpan.ShortTimeSpanPattern = "hh:mm";AjaxControlToolkit.TimeSpan.LongTimeSpanPattern = "hh:mm:ss";Date.prototype.getTimeOfDay = function Date$getTimeOfDay() {
return new AjaxControlToolkit.TimeSpan(
0, 
this.getHours(), 
this.getMinutes(), 
this.getSeconds(), 
this.getMilliseconds());}
Date.prototype.getDateOnly = function Date$getDateOnly() {
return new Date(this.getFullYear(), this.getMonth(), this.getDate());}
Date.prototype.add = function Date$add(span) {
return new Date(this.getTime() + span.getTotalMilliseconds());}
Date.prototype.subtract = function Date$subtract(span) {
return this.add(span.negate());}
Date.prototype.getTicks = function Date$getTicks() {
return this.getTime() * AjaxControlToolkit.TimeSpan.TicksPerMillisecond;}
AjaxControlToolkit.FirstDayOfWeek = function() {
}
AjaxControlToolkit.FirstDayOfWeek.prototype = {
Sunday : 0,
Monday : 1,
Tuesday : 2,
Wednesday : 3,
Thursday : 4,
Friday : 5,
Saturday : 6,
Default : 7
}
AjaxControlToolkit.FirstDayOfWeek.registerEnum("AjaxControlToolkit.FirstDayOfWeek");
//END AjaxControlToolkit.Common.DateTime.js
//START AjaxControlToolkit.Compat.Timer.Timer.js
/////////////////////////////////////////////////////////////////////////////
Sys.Timer = function() {
Sys.Timer.initializeBase(this);this._interval = 1000;this._enabled = false;this._timer = null;}
Sys.Timer.prototype = {
get_interval: function() {
return this._interval;},
set_interval: function(value) {
if (this._interval !== value) {
this._interval = value;this.raisePropertyChanged('interval');if (!this.get_isUpdating() && (this._timer !== null)) {
this._stopTimer();this._startTimer();}
}
},
get_enabled: function() {
return this._enabled;},
set_enabled: function(value) {
if (value !== this.get_enabled()) {
this._enabled = value;this.raisePropertyChanged('enabled');if (!this.get_isUpdating()) {
if (value) {
this._startTimer();}
else {
this._stopTimer();}
}
}
},
add_tick: function(handler) {
this.get_events().addHandler("tick", handler);},
remove_tick: function(handler) {
this.get_events().removeHandler("tick", handler);},
dispose: function() {
this.set_enabled(false);this._stopTimer();Sys.Timer.callBaseMethod(this, 'dispose');},
updated: function() {
Sys.Timer.callBaseMethod(this, 'updated');if (this._enabled) {
this._stopTimer();this._startTimer();}
},
_timerCallback: function() {
var handler = this.get_events().getHandler("tick");if (handler) {
handler(this, Sys.EventArgs.Empty);}
},
_startTimer: function() {
this._timer = window.setInterval(Function.createDelegate(this, this._timerCallback), this._interval);},
_stopTimer: function() {
window.clearInterval(this._timer);this._timer = null;}
}
Sys.Timer.descriptor = {
properties: [ {name: 'interval', type: Number},
{name: 'enabled', type: Boolean} ],
events: [ {name: 'tick'} ]
}
Sys.Timer.registerClass('Sys.Timer', Sys.Component);
//END AjaxControlToolkit.Compat.Timer.Timer.js
//START AjaxControlToolkit.Animation.Animations.js
Type.registerNamespace('AjaxControlToolkit.Animation');var $AA = AjaxControlToolkit.Animation;$AA.registerAnimation = function(name, type) {
if (type && ((type === $AA.Animation) || (type.inheritsFrom && type.inheritsFrom($AA.Animation)))) {
if (!$AA.__animations) {
$AA.__animations = { };}
$AA.__animations[name.toLowerCase()] = type;type.play = function() {
var animation = new type();type.apply(animation, arguments);animation.initialize();var handler = Function.createDelegate(animation,
function() {
animation.remove_ended(handler);handler = null;animation.dispose();});animation.add_ended(handler);animation.play();}
} else {
throw Error.argumentType('type', type, $AA.Animation, AjaxControlToolkit.Resources.Animation_InvalidBaseType);}
}
$AA.buildAnimation = function(json, defaultTarget) {
if (!json || json === '') {
return null;}
var obj;json = '(' + json + ')';if (! Sys.Debug.isDebug) {
try { obj = Sys.Serialization.JavaScriptSerializer.deserialize(json);} catch (ex) { } 
} else {
obj = Sys.Serialization.JavaScriptSerializer.deserialize(json);}
return $AA.createAnimation(obj, defaultTarget);}
$AA.createAnimation = function(obj, defaultTarget) {
if (!obj || !obj.AnimationName) {
throw Error.argument('obj', AjaxControlToolkit.Resources.Animation_MissingAnimationName);}
var type = $AA.__animations[obj.AnimationName.toLowerCase()];if (!type) {
throw Error.argument('type', String.format(AjaxControlToolkit.Resources.Animation_UknownAnimationName, obj.AnimationName));}
var animation = new type();if (defaultTarget) {
animation.set_target(defaultTarget);}
if (obj.AnimationChildren && obj.AnimationChildren.length) {
if ($AA.ParentAnimation.isInstanceOfType(animation)) {
for (var i = 0;i < obj.AnimationChildren.length;i++) {
var child = $AA.createAnimation(obj.AnimationChildren[i]);if (child) {
animation.add(child);}
}
} else {
throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_ChildrenNotAllowed, type.getName()));}
}
var properties = type.__animationProperties;if (!properties) {
type.__animationProperties = { };type.resolveInheritance();for (var name in type.prototype) {
if (name.startsWith('set_')) {
type.__animationProperties[name.substr(4).toLowerCase()] = name;}
}
delete type.__animationProperties['id'];properties = type.__animationProperties;}
for (var property in obj) {
var prop = property.toLowerCase();if (prop == 'animationname' || prop == 'animationchildren') {
continue;}
var value = obj[property];var setter = properties[prop];if (setter && String.isInstanceOfType(setter) && animation[setter]) {
if (! Sys.Debug.isDebug) {
try { animation[setter](value);} catch (ex) { }
} else {
animation[setter](value);}
} else {
if (prop.endsWith('script')) {
setter = properties[prop.substr(0, property.length - 6)];if (setter && String.isInstanceOfType(setter) && animation[setter]) {
animation.DynamicProperties[setter] = value;} else if ( Sys.Debug.isDebug) {
throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_NoDynamicPropertyFound, property, property.substr(0, property.length - 5)));}
} else if ( Sys.Debug.isDebug) {
throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_NoPropertyFound, property));}
}
}
return animation;}
$AA.Animation = function(target, duration, fps) {
$AA.Animation.initializeBase(this);this._duration = 1;this._fps = 25;this._target = null;this._tickHandler = null;this._timer = null;this._percentComplete = 0;this._percentDelta = null;this._owner = null;this._parentAnimation = null;this.DynamicProperties = { };if (target) {
this.set_target(target);}
if (duration) {
this.set_duration(duration);}
if (fps) { 
this.set_fps(fps);}
}
$AA.Animation.prototype = {
dispose: function() {
if (this._timer) {
this._timer.dispose();this._timer = null;}
this._tickHandler = null;this._target = null;$AA.Animation.callBaseMethod(this, 'dispose');},
play: function() {
if (!this._owner) {
var resume = true;if (!this._timer) {
resume = false;if (!this._tickHandler) {
this._tickHandler = Function.createDelegate(this, this._onTimerTick);}
this._timer = new Sys.Timer();this._timer.add_tick(this._tickHandler);this.onStart();this._timer.set_interval(1000 / this._fps);this._percentDelta = 100 / (this._duration * this._fps);this._updatePercentComplete(0, true);}
this._timer.set_enabled(true);this.raisePropertyChanged('isPlaying');if (!resume) {
this.raisePropertyChanged('isActive');}
}
},
pause: function() {
if (!this._owner) {
if (this._timer) {
this._timer.set_enabled(false);this.raisePropertyChanged('isPlaying');}
}
},
stop: function(finish) {
if (!this._owner) {
var t = this._timer;this._timer = null;if (t) {
t.dispose();if (this._percentComplete !== 100) {
this._percentComplete = 100;this.raisePropertyChanged('percentComplete');if (finish || finish === undefined) {
this.onStep(100);}
}
this.onEnd();this.raisePropertyChanged('isPlaying');this.raisePropertyChanged('isActive');}
}
},
onStart: function() {
this.raiseStarted();for (var property in this.DynamicProperties) {
try {
this[property](eval(this.DynamicProperties[property]));} catch (ex) {
if (Sys.Debug.isDebug) {
throw ex;}
}
}
},
onStep: function(percentage) {
this.setValue(this.getAnimatedValue(percentage));this.raiseStep();},
onEnd: function() {
this.raiseEnded();},
getAnimatedValue: function(percentage) {
throw Error.notImplemented();},
setValue: function(value) {
throw Error.notImplemented();},
interpolate: function(start, end, percentage) {
return start + (end - start) * (percentage / 100);},
_onTimerTick: function() {
this._updatePercentComplete(this._percentComplete + this._percentDelta, true);},
_updatePercentComplete: function(percentComplete, animate) {
if (percentComplete > 100) {
percentComplete = 100;}
this._percentComplete = percentComplete;this.raisePropertyChanged('percentComplete');if (animate) {
this.onStep(percentComplete);}
if (percentComplete === 100) {
this.stop(false);}
},
setOwner: function(owner) {
this._owner = owner;},
raiseStarted: function() {
var handlers = this.get_events().getHandler('started');if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
add_started: function(handler) {
this.get_events().addHandler("started", handler);},
remove_started: function(handler) {
this.get_events().removeHandler("started", handler);},
raiseEnded: function() {
var handlers = this.get_events().getHandler('ended');if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
add_ended: function(handler) {
this.get_events().addHandler("ended", handler);},
remove_ended: function(handler) {
this.get_events().removeHandler("ended", handler);},
raiseStep: function() {
var handlers = this.get_events().getHandler('step');if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
add_step: function(handler) {
this.get_events().addHandler("step", handler);},
remove_step: function(handler) {
this.get_events().removeHandler("step", handler);},
get_target: function() {
if (!this._target && this._parentAnimation) {
return this._parentAnimation.get_target();}
return this._target;},
set_target: function(value) {
if (this._target != value) {
this._target = value;this.raisePropertyChanged('target');}
},
set_animationTarget: function(id) {
var target = null;var element = $get(id);if (element) {
target = element;} else {
var ctrl = $find(id);if (ctrl) {
element = ctrl.get_element();if (element) {
target = element;}
}
}
if (target) {
this.set_target(target);} else {
throw Error.argument('id', String.format(AjaxControlToolkit.Resources.Animation_TargetNotFound, id));}
},
get_duration: function() {
return this._duration;},
set_duration: function(value) {
value = this._getFloat(value);if (this._duration != value) {
this._duration = value;this.raisePropertyChanged('duration');}
},
get_fps: function() {
return this._fps;},
set_fps: function(value) {
value = this._getInteger(value);if (this.fps != value) {
this._fps = value;this.raisePropertyChanged('fps');}
},
get_isActive: function() {
return (this._timer !== null);},
get_isPlaying: function() {
return (this._timer !== null) && this._timer.get_enabled();},
get_percentComplete: function() {
return this._percentComplete;},
_getBoolean: function(value) {
if (String.isInstanceOfType(value)) {
return Boolean.parse(value);}
return value;},
_getInteger: function(value) {
if (String.isInstanceOfType(value)) {
return parseInt(value);}
return value;},
_getFloat: function(value) {
if (String.isInstanceOfType(value)) {
return parseFloat(value);}
return value;},
_getEnum: function(value, type) {
if (String.isInstanceOfType(value) && type && type.parse) {
return type.parse(value);}
return value;}
}
$AA.Animation.registerClass('AjaxControlToolkit.Animation.Animation', Sys.Component);$AA.registerAnimation('animation', $AA.Animation);$AA.ParentAnimation = function(target, duration, fps, animations) {
$AA.ParentAnimation.initializeBase(this, [target, duration, fps]);this._animations = [];if (animations && animations.length) {
for (var i = 0;i < animations.length;i++) {
this.add(animations[i]);}
}
}
$AA.ParentAnimation.prototype = {
initialize : function() {
$AA.ParentAnimation.callBaseMethod(this, 'initialize');if (this._animations) {
for (var i = 0;i < this._animations.length;i++) {
var animation = this._animations[i];if (animation && !animation.get_isInitialized) {
animation.initialize();}
}
}
},
dispose : function() {
this.clear();this._animations = null;$AA.ParentAnimation.callBaseMethod(this, 'dispose');},
get_animations : function() {
return this._animations;},
add : function(animation) {
if (this._animations) {
if (animation) {
animation._parentAnimation = this;}
Array.add(this._animations, animation);this.raisePropertyChanged('animations');}
},
remove : function(animation) {
if (this._animations) {
if (animation) {
animation.dispose();}
Array.remove(this._animations, animation);this.raisePropertyChanged('animations');}
},
removeAt : function(index) {
if (this._animations) {
var animation = this._animations[index];if (animation) {
animation.dispose();}
Array.removeAt(this._animations, index);this.raisePropertyChanged('animations');}
},
clear : function() {
if (this._animations) {
for (var i = this._animations.length - 1;i >= 0;i--) {
this._animations[i].dispose();this._animations[i] = null;}
Array.clear(this._animations);this._animations = [];this.raisePropertyChanged('animations');}
}
}
$AA.ParentAnimation.registerClass('AjaxControlToolkit.Animation.ParentAnimation', $AA.Animation);$AA.registerAnimation('parent', $AA.ParentAnimation);$AA.ParallelAnimation = function(target, duration, fps, animations) {
$AA.ParallelAnimation.initializeBase(this, [target, duration, fps, animations]);}
$AA.ParallelAnimation.prototype = {
add : function(animation) {
$AA.ParallelAnimation.callBaseMethod(this, 'add', [animation]);animation.setOwner(this);},
onStart : function() {
$AA.ParallelAnimation.callBaseMethod(this, 'onStart');var animations = this.get_animations();for (var i = 0;i < animations.length;i++) {
animations[i].onStart();}
},
onStep : function(percentage) {
var animations = this.get_animations();for (var i = 0;i < animations.length;i++) {
animations[i].onStep(percentage);}
},
onEnd : function() {
var animations = this.get_animations();for (var i = 0;i < animations.length;i++) {
animations[i].onEnd();}
$AA.ParallelAnimation.callBaseMethod(this, 'onEnd');}
}
$AA.ParallelAnimation.registerClass('AjaxControlToolkit.Animation.ParallelAnimation', $AA.ParentAnimation);$AA.registerAnimation('parallel', $AA.ParallelAnimation);$AA.SequenceAnimation = function(target, duration, fps, animations, iterations) {
$AA.SequenceAnimation.initializeBase(this, [target, duration, fps, animations]);this._handler = null;this._paused = false;this._playing = false;this._index = 0;this._remainingIterations = 0;this._iterations = (iterations !== undefined) ? iterations : 1;}
$AA.SequenceAnimation.prototype = {
dispose : function() {
this._handler = null;$AA.SequenceAnimation.callBaseMethod(this, 'dispose');},
stop : function() {
if (this._playing) {
var animations = this.get_animations();if (this._index < animations.length) {
animations[this._index].remove_ended(this._handler);for (var i = this._index;i < animations.length;i++) {
animations[i].stop();}
}
this._playing = false;this._paused = false;this.raisePropertyChanged('isPlaying');this.onEnd();}
},
pause : function() {
if (this.get_isPlaying()) {
var current = this.get_animations()[this._index];if (current != null) {
current.pause();}
this._paused = true;this.raisePropertyChanged('isPlaying');}
},
play : function() {
var animations = this.get_animations();if (!this._playing) {
this._playing = true;if (this._paused) {
this._paused = false;var current = animations[this._index];if (current != null) {
current.play();this.raisePropertyChanged('isPlaying');}
} else {
this.onStart();this._index = 0;var first = animations[this._index];if (first) {
first.add_ended(this._handler);first.play();this.raisePropertyChanged('isPlaying');} else {
this.stop();}
}
}
},
onStart : function() {
$AA.SequenceAnimation.callBaseMethod(this, 'onStart');this._remainingIterations = this._iterations - 1;if (!this._handler) {
this._handler = Function.createDelegate(this, this._onEndAnimation);}
},
_onEndAnimation : function() {
var animations = this.get_animations();var current = animations[this._index++];if (current) {
current.remove_ended(this._handler);}
if (this._index < animations.length) {
var next = animations[this._index];next.add_ended(this._handler);next.play();} else if (this._remainingIterations >= 1 || this._iterations <= 0) {
this._remainingIterations--;this._index = 0;var first = animations[0];first.add_ended(this._handler);first.play();} else {
this.stop();}
},
onStep : function(percentage) {
throw Error.invalidOperation(AjaxControlToolkit.Resources.Animation_CannotNestSequence);},
onEnd : function() {
this._remainingIterations = 0;$AA.SequenceAnimation.callBaseMethod(this, 'onEnd');},
get_isActive : function() {
return true;},
get_isPlaying : function() {
return this._playing && !this._paused;},
get_iterations : function() {
return this._iterations;},
set_iterations : function(value) {
value = this._getInteger(value);if (this._iterations != value) {
this._iterations = value;this.raisePropertyChanged('iterations');}
},
get_isInfinite : function() {
return this._iterations <= 0;}
}
$AA.SequenceAnimation.registerClass('AjaxControlToolkit.Animation.SequenceAnimation', $AA.ParentAnimation);$AA.registerAnimation('sequence', $AA.SequenceAnimation);$AA.SelectionAnimation = function(target, duration, fps, animations) {
$AA.SelectionAnimation.initializeBase(this, [target, duration, fps, animations]);this._selectedIndex = -1;this._selected = null;}
$AA.SelectionAnimation.prototype = { 
getSelectedIndex : function() {
throw Error.notImplemented();},
onStart : function() {
$AA.SelectionAnimation.callBaseMethod(this, 'onStart');var animations = this.get_animations();this._selectedIndex = this.getSelectedIndex();if (this._selectedIndex >= 0 && this._selectedIndex < animations.length) {
this._selected = animations[this._selectedIndex];if (this._selected) {
this._selected.setOwner(this);this._selected.onStart();}
}
},
onStep : function(percentage) {
if (this._selected) {
this._selected.onStep(percentage);}
},
onEnd : function() {
if (this._selected) {
this._selected.onEnd();this._selected.setOwner(null);}
this._selected = null;this._selectedIndex = null;$AA.SelectionAnimation.callBaseMethod(this, 'onEnd');}
}
$AA.SelectionAnimation.registerClass('AjaxControlToolkit.Animation.SelectionAnimation', $AA.ParentAnimation);$AA.registerAnimation('selection', $AA.SelectionAnimation);$AA.ConditionAnimation = function(target, duration, fps, animations, conditionScript) {
$AA.ConditionAnimation.initializeBase(this, [target, duration, fps, animations]);this._conditionScript = conditionScript;}
$AA.ConditionAnimation.prototype = { 
getSelectedIndex : function() {
var selected = -1;if (this._conditionScript && this._conditionScript.length > 0) {
try {
selected = eval(this._conditionScript) ? 0 : 1;} catch(ex) {
}
}
return selected;},
get_conditionScript : function() {
return this._conditionScript;},
set_conditionScript : function(value) {
if (this._conditionScript != value) {
this._conditionScript = value;this.raisePropertyChanged('conditionScript');}
}
}
$AA.ConditionAnimation.registerClass('AjaxControlToolkit.Animation.ConditionAnimation', $AA.SelectionAnimation);$AA.registerAnimation('condition', $AA.ConditionAnimation);$AA.CaseAnimation = function(target, duration, fps, animations, selectScript) {
$AA.CaseAnimation.initializeBase(this, [target, duration, fps, animations]);this._selectScript = selectScript;}
$AA.CaseAnimation.prototype = {
getSelectedIndex : function() {
var selected = -1;if (this._selectScript && this._selectScript.length > 0) {
try {
var result = eval(this._selectScript)
if (result !== undefined)
selected = result;} catch (ex) {
}
}
return selected;},
get_selectScript : function() {
return this._selectScript;},
set_selectScript : function(value) {
if (this._selectScript != value) {
this._selectScript = value;this.raisePropertyChanged('selectScript');}
}
}
$AA.CaseAnimation.registerClass('AjaxControlToolkit.Animation.CaseAnimation', $AA.SelectionAnimation);$AA.registerAnimation('case', $AA.CaseAnimation);$AA.FadeEffect = function() {
throw Error.invalidOperation();}
$AA.FadeEffect.prototype = {
FadeIn : 0,
FadeOut : 1
}
$AA.FadeEffect.registerEnum("AjaxControlToolkit.Animation.FadeEffect", false);$AA.FadeAnimation = function(target, duration, fps, effect, minimumOpacity, maximumOpacity, forceLayoutInIE) {
$AA.FadeAnimation.initializeBase(this, [target, duration, fps]);this._effect = (effect !== undefined) ? effect : $AA.FadeEffect.FadeIn;this._max = (maximumOpacity !== undefined) ? maximumOpacity : 1;this._min = (minimumOpacity !== undefined) ? minimumOpacity : 0;this._start = this._min;this._end = this._max;this._layoutCreated = false;this._forceLayoutInIE = (forceLayoutInIE === undefined || forceLayoutInIE === null) ? true : forceLayoutInIE;this._currentTarget = null;this._resetOpacities();}
$AA.FadeAnimation.prototype = {
_resetOpacities : function() {
if (this._effect == $AA.FadeEffect.FadeIn) {
this._start = this._min;this._end = this._max;} else {
this._start = this._max;this._end = this._min;}
},
_createLayout : function() {
var element = this._currentTarget;if (element) {
this._originalWidth = $common.getCurrentStyle(element, 'width');var originalHeight = $common.getCurrentStyle(element, 'height');this._originalBackColor = $common.getCurrentStyle(element, 'backgroundColor');if ((!this._originalWidth || this._originalWidth == '' || this._originalWidth == 'auto') &&
(!originalHeight || originalHeight == '' || originalHeight == 'auto')) {
element.style.width = element.offsetWidth + 'px';}
if (!this._originalBackColor || this._originalBackColor == '' || this._originalBackColor == 'transparent' || this._originalBackColor == 'rgba(0, 0, 0, 0)') {
element.style.backgroundColor = $common.getInheritedBackgroundColor(element);}
this._layoutCreated = true;}
},
onStart : function() {
$AA.FadeAnimation.callBaseMethod(this, 'onStart');this._currentTarget = this.get_target();this.setValue(this._start);if (this._forceLayoutInIE && !this._layoutCreated && Sys.Browser.agent == Sys.Browser.InternetExplorer) {
this._createLayout();}
},
getAnimatedValue : function(percentage) {
return this.interpolate(this._start, this._end, percentage);},
setValue : function(value) {
if (this._currentTarget) {
$common.setElementOpacity(this._currentTarget, value);}
},
get_effect : function() {
return this._effect;},
set_effect : function(value) {
value = this._getEnum(value, $AA.FadeEffect);if (this._effect != value) {
this._effect = value;this._resetOpacities();this.raisePropertyChanged('effect');}
},
get_minimumOpacity : function() {
return this._min;},
set_minimumOpacity : function(value) {
value = this._getFloat(value);if (this._min != value) {
this._min = value;this._resetOpacities();this.raisePropertyChanged('minimumOpacity');}
},
get_maximumOpacity : function() {
return this._max;},
set_maximumOpacity : function(value) {
value = this._getFloat(value);if (this._max != value) {
this._max = value;this._resetOpacities();this.raisePropertyChanged('maximumOpacity');}
},
get_forceLayoutInIE : function() {
return this._forceLayoutInIE;},
set_forceLayoutInIE : function(value) {
value = this._getBoolean(value);if (this._forceLayoutInIE != value) {
this._forceLayoutInIE = value;this.raisePropertyChanged('forceLayoutInIE');}
},
set_startValue : function(value) {
value = this._getFloat(value);this._start = value;}
}
$AA.FadeAnimation.registerClass('AjaxControlToolkit.Animation.FadeAnimation', $AA.Animation);$AA.registerAnimation('fade', $AA.FadeAnimation);$AA.FadeInAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
$AA.FadeInAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeIn, minimumOpacity, maximumOpacity, forceLayoutInIE]);}
$AA.FadeInAnimation.prototype = {
onStart : function() {
$AA.FadeInAnimation.callBaseMethod(this, 'onStart');if (this._currentTarget) {
this.set_startValue($common.getElementOpacity(this._currentTarget));}
}
}
$AA.FadeInAnimation.registerClass('AjaxControlToolkit.Animation.FadeInAnimation', $AA.FadeAnimation);$AA.registerAnimation('fadeIn', $AA.FadeInAnimation);$AA.FadeOutAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
$AA.FadeOutAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeOut, minimumOpacity, maximumOpacity, forceLayoutInIE]);}
$AA.FadeOutAnimation.prototype = {
onStart : function() {
$AA.FadeOutAnimation.callBaseMethod(this, 'onStart');if (this._currentTarget) {
this.set_startValue($common.getElementOpacity(this._currentTarget));}
}
}
$AA.FadeOutAnimation.registerClass('AjaxControlToolkit.Animation.FadeOutAnimation', $AA.FadeAnimation);$AA.registerAnimation('fadeOut', $AA.FadeOutAnimation);$AA.PulseAnimation = function(target, duration, fps, iterations, minimumOpacity, maximumOpacity, forceLayoutInIE) {
$AA.PulseAnimation.initializeBase(this, [target, duration, fps, null, ((iterations !== undefined) ? iterations : 3)]);this._out = new $AA.FadeOutAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);this.add(this._out);this._in = new $AA.FadeInAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);this.add(this._in);}
$AA.PulseAnimation.prototype = {
get_minimumOpacity : function() {
return this._out.get_minimumOpacity();},
set_minimumOpacity : function(value) {
value = this._getFloat(value);this._out.set_minimumOpacity(value);this._in.set_minimumOpacity(value);this.raisePropertyChanged('minimumOpacity');},
get_maximumOpacity : function() {
return this._out.get_maximumOpacity();},
set_maximumOpacity : function(value) {
value = this._getFloat(value);this._out.set_maximumOpacity(value);this._in.set_maximumOpacity(value);this.raisePropertyChanged('maximumOpacity');},
get_forceLayoutInIE : function() {
return this._out.get_forceLayoutInIE();},
set_forceLayoutInIE : function(value) {
value = this._getBoolean(value);this._out.set_forceLayoutInIE(value);this._in.set_forceLayoutInIE(value);this.raisePropertyChanged('forceLayoutInIE');},
set_duration : function(value) {
value = this._getFloat(value);$AA.PulseAnimation.callBaseMethod(this, 'set_duration', [value]);this._in.set_duration(value);this._out.set_duration(value);},
set_fps : function(value) {
value = this._getInteger(value);$AA.PulseAnimation.callBaseMethod(this, 'set_fps', [value]);this._in.set_fps(value);this._out.set_fps(value);}
}
$AA.PulseAnimation.registerClass('AjaxControlToolkit.Animation.PulseAnimation', $AA.SequenceAnimation);$AA.registerAnimation('pulse', $AA.PulseAnimation);$AA.PropertyAnimation = function(target, duration, fps, property, propertyKey) {
$AA.PropertyAnimation.initializeBase(this, [target, duration, fps]);this._property = property;this._propertyKey = propertyKey;this._currentTarget = null;}
$AA.PropertyAnimation.prototype = {
onStart : function() {
$AA.PropertyAnimation.callBaseMethod(this, 'onStart');this._currentTarget = this.get_target();},
setValue : function(value) {
var element = this._currentTarget;if (element && this._property && this._property.length > 0) { 
if (this._propertyKey && this._propertyKey.length > 0 && element[this._property]) {
element[this._property][this._propertyKey] = value;} else {
element[this._property] = value;}
}
},
getValue : function() {
var element = this.get_target();if (element && this._property && this._property.length > 0) { 
var property = element[this._property];if (property) {
if (this._propertyKey && this._propertyKey.length > 0) {
return property[this._propertyKey];}
return property;}
}
return null;},
get_property : function() {
return this._property;},
set_property : function(value) {
if (this._property != value) {
this._property = value;this.raisePropertyChanged('property');}
},
get_propertyKey : function() {
return this._propertyKey;},
set_propertyKey : function(value) {
if (this._propertyKey != value) {
this._propertyKey = value;this.raisePropertyChanged('propertyKey');}
}
}
$AA.PropertyAnimation.registerClass('AjaxControlToolkit.Animation.PropertyAnimation', $AA.Animation);$AA.registerAnimation('property', $AA.PropertyAnimation);$AA.DiscreteAnimation = function(target, duration, fps, property, propertyKey, values) {
$AA.DiscreteAnimation.initializeBase(this, [target, duration, fps, property, propertyKey]);this._values = (values && values.length) ? values : [];}
$AA.DiscreteAnimation.prototype = {
getAnimatedValue : function(percentage) {
var index = Math.floor(this.interpolate(0, this._values.length - 1, percentage));return this._values[index];},
get_values : function() {
return this._values;},
set_values : function(value) {
if (this._values != value) {
this._values = value;this.raisePropertyChanged('values');}
}
}
$AA.DiscreteAnimation.registerClass('AjaxControlToolkit.Animation.DiscreteAnimation', $AA.PropertyAnimation);$AA.registerAnimation('discrete', $AA.DiscreteAnimation);$AA.InterpolatedAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
$AA.InterpolatedAnimation.initializeBase(this, [target, duration, fps, ((property !== undefined) ? property : 'style'), propertyKey]);this._startValue = startValue;this._endValue = endValue;}
$AA.InterpolatedAnimation.prototype = {
get_startValue : function() {
return this._startValue;},
set_startValue : function(value) {
value = this._getFloat(value);if (this._startValue != value) {
this._startValue = value;this.raisePropertyChanged('startValue');}
},
get_endValue : function() {
return this._endValue;},
set_endValue : function(value) {
value = this._getFloat(value);if (this._endValue != value) {
this._endValue = value;this.raisePropertyChanged('endValue');}
} 
}
$AA.InterpolatedAnimation.registerClass('AjaxControlToolkit.Animation.InterpolatedAnimation', $AA.PropertyAnimation);$AA.registerAnimation('interpolated', $AA.InterpolatedAnimation);$AA.ColorAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
$AA.ColorAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);this._start = null;this._end = null;this._interpolateRed = false;this._interpolateGreen = false;this._interpolateBlue = false;}
$AA.ColorAnimation.prototype = {
onStart : function() {
$AA.ColorAnimation.callBaseMethod(this, 'onStart');this._start = $AA.ColorAnimation.getRGB(this.get_startValue());this._end = $AA.ColorAnimation.getRGB(this.get_endValue());this._interpolateRed = (this._start.Red != this._end.Red);this._interpolateGreen = (this._start.Green != this._end.Green);this._interpolateBlue = (this._start.Blue != this._end.Blue);},
getAnimatedValue : function(percentage) {
var r = this._start.Red;var g = this._start.Green;var b = this._start.Blue;if (this._interpolateRed)
r = Math.round(this.interpolate(r, this._end.Red, percentage));if (this._interpolateGreen)
g = Math.round(this.interpolate(g, this._end.Green, percentage));if (this._interpolateBlue)
b = Math.round(this.interpolate(b, this._end.Blue, percentage));return $AA.ColorAnimation.toColor(r, g, b);},
set_startValue : function(value) {
if (this._startValue != value) {
this._startValue = value;this.raisePropertyChanged('startValue');}
},
set_endValue : function(value) {
if (this._endValue != value) {
this._endValue = value;this.raisePropertyChanged('endValue');}
} 
}
$AA.ColorAnimation.getRGB = function(color) {
if (!color || color.length != 7) {
throw String.format(AjaxControlToolkit.Resources.Animation_InvalidColor, color);}
return { 'Red': parseInt(color.substr(1,2), 16),
'Green': parseInt(color.substr(3,2), 16),
'Blue': parseInt(color.substr(5,2), 16) };}
$AA.ColorAnimation.toColor = function(red, green, blue) {
var r = red.toString(16);var g = green.toString(16);var b = blue.toString(16);if (r.length == 1) r = '0' + r;if (g.length == 1) g = '0' + g;if (b.length == 1) b = '0' + b;return '#' + r + g + b;}
$AA.ColorAnimation.registerClass('AjaxControlToolkit.Animation.ColorAnimation', $AA.InterpolatedAnimation);$AA.registerAnimation('color', $AA.ColorAnimation);$AA.LengthAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue, unit) {
$AA.LengthAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);this._unit = (unit != null) ? unit : 'px';}
$AA.LengthAnimation.prototype = {
getAnimatedValue : function(percentage) {
var value = this.interpolate(this.get_startValue(), this.get_endValue(), percentage);return Math.round(value) + this._unit;},
get_unit : function() {
return this._unit;},
set_unit : function(value) {
if (this._unit != value) {
this._unit = value;this.raisePropertyChanged('unit');}
}
}
$AA.LengthAnimation.registerClass('AjaxControlToolkit.Animation.LengthAnimation', $AA.InterpolatedAnimation);$AA.registerAnimation('length', $AA.LengthAnimation);$AA.MoveAnimation = function(target, duration, fps, horizontal, vertical, relative, unit) {
$AA.MoveAnimation.initializeBase(this, [target, duration, fps, null]);this._horizontal = horizontal ? horizontal : 0;this._vertical = vertical ? vertical : 0;this._relative = (relative === undefined) ? true : relative;this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'left', null, null, unit);this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'top', null, null, unit);this.add(this._verticalAnimation);this.add(this._horizontalAnimation);}
$AA.MoveAnimation.prototype = {
onStart : function() {
$AA.MoveAnimation.callBaseMethod(this, 'onStart');var element = this.get_target();this._horizontalAnimation.set_startValue(element.offsetLeft);this._horizontalAnimation.set_endValue(this._relative ? element.offsetLeft + this._horizontal : this._horizontal);this._verticalAnimation.set_startValue(element.offsetTop);this._verticalAnimation.set_endValue(this._relative ? element.offsetTop + this._vertical : this._vertical);},
get_horizontal : function() {
return this._horizontal;},
set_horizontal : function(value) {
value = this._getFloat(value);if (this._horizontal != value) {
this._horizontal = value;this.raisePropertyChanged('horizontal');}
},
get_vertical : function() {
return this._vertical;},
set_vertical : function(value) {
value = this._getFloat(value);if (this._vertical != value) {
this._vertical = value;this.raisePropertyChanged('vertical');}
},
get_relative : function() {
return this._relative;},
set_relative : function(value) {
value = this._getBoolean(value);if (this._relative != value) {
this._relative = value;this.raisePropertyChanged('relative');}
},
get_unit : function() {
this._horizontalAnimation.get_unit();},
set_unit : function(value) {
var unit = this._horizontalAnimation.get_unit();if (unit != value) {
this._horizontalAnimation.set_unit(value);this._verticalAnimation.set_unit(value);this.raisePropertyChanged('unit');}
}
}
$AA.MoveAnimation.registerClass('AjaxControlToolkit.Animation.MoveAnimation', $AA.ParallelAnimation);$AA.registerAnimation('move', $AA.MoveAnimation);$AA.ResizeAnimation = function(target, duration, fps, width, height, unit) {
$AA.ResizeAnimation.initializeBase(this, [target, duration, fps, null]);this._width = width;this._height = height;this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'width', null, null, unit);this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'height', null, null, unit);this.add(this._horizontalAnimation);this.add(this._verticalAnimation);}
$AA.ResizeAnimation.prototype = {
onStart : function() {
$AA.ResizeAnimation.callBaseMethod(this, 'onStart');var element = this.get_target();this._horizontalAnimation.set_startValue(element.offsetWidth);this._verticalAnimation.set_startValue(element.offsetHeight);this._horizontalAnimation.set_endValue((this._width !== null && this._width !== undefined) ?
this._width : element.offsetWidth);this._verticalAnimation.set_endValue((this._height !== null && this._height !== undefined) ?
this._height : element.offsetHeight);},
get_width : function() {
return this._width;},
set_width : function(value) {
value = this._getFloat(value);if (this._width != value) {
this._width = value;this.raisePropertyChanged('width');}
},
get_height : function() {
return this._height;},
set_height : function(value) {
value = this._getFloat(value);if (this._height != value) {
this._height = value;this.raisePropertyChanged('height');}
},
get_unit : function() {
this._horizontalAnimation.get_unit();},
set_unit : function(value) {
var unit = this._horizontalAnimation.get_unit();if (unit != value) {
this._horizontalAnimation.set_unit(value);this._verticalAnimation.set_unit(value);this.raisePropertyChanged('unit');}
}
}
$AA.ResizeAnimation.registerClass('AjaxControlToolkit.Animation.ResizeAnimation', $AA.ParallelAnimation);$AA.registerAnimation('resize', $AA.ResizeAnimation);$AA.ScaleAnimation = function(target, duration, fps, scaleFactor, unit, center, scaleFont, fontUnit) {
$AA.ScaleAnimation.initializeBase(this, [target, duration, fps]);this._scaleFactor = (scaleFactor !== undefined) ? scaleFactor : 1;this._unit = (unit !== undefined) ? unit : 'px';this._center = center;this._scaleFont = scaleFont;this._fontUnit = (fontUnit !== undefined) ? fontUnit : 'pt';this._element = null;this._initialHeight = null;this._initialWidth = null;this._initialTop = null;this._initialLeft = null;this._initialFontSize = null;}
$AA.ScaleAnimation.prototype = { 
getAnimatedValue : function(percentage) {
return this.interpolate(1.0, this._scaleFactor, percentage);},
onStart : function() {
$AA.ScaleAnimation.callBaseMethod(this, 'onStart');this._element = this.get_target();if (this._element) {
this._initialHeight = this._element.offsetHeight;this._initialWidth = this._element.offsetWidth;if (this._center) {
this._initialTop = this._element.offsetTop;this._initialLeft = this._element.offsetLeft;}
if (this._scaleFont) {
this._initialFontSize = parseFloat(
$common.getCurrentStyle(this._element, 'fontSize'));}
}
},
setValue : function(scale) {
if (this._element) {
var width = Math.round(this._initialWidth * scale);var height = Math.round(this._initialHeight * scale);this._element.style.width = width + this._unit;this._element.style.height = height + this._unit;if (this._center) {
this._element.style.top = (this._initialTop +
Math.round((this._initialHeight - height) / 2)) + this._unit;this._element.style.left = (this._initialLeft +
Math.round((this._initialWidth - width) / 2)) + this._unit;}
if (this._scaleFont) {
var size = this._initialFontSize * scale;if (this._fontUnit == 'px' || this._fontUnit == 'pt') {
size = Math.round(size);}
this._element.style.fontSize = size + this._fontUnit;}
}
},
onEnd : function() {
this._element = null;this._initialHeight = null;this._initialWidth = null;this._initialTop = null;this._initialLeft = null;this._initialFontSize = null;$AA.ScaleAnimation.callBaseMethod(this, 'onEnd');},
get_scaleFactor : function() {
return this._scaleFactor;},
set_scaleFactor : function(value) {
value = this._getFloat(value);if (this._scaleFactor != value) {
this._scaleFactor = value;this.raisePropertyChanged('scaleFactor');}
},
get_unit : function() {
return this._unit;},
set_unit : function(value) {
if (this._unit != value) {
this._unit = value;this.raisePropertyChanged('unit');}
},
get_center : function() {
return this._center;},
set_center : function(value) {
value = this._getBoolean(value);if (this._center != value) {
this._center = value;this.raisePropertyChanged('center');}
},
get_scaleFont : function() {
return this._scaleFont;},
set_scaleFont : function(value) {
value = this._getBoolean(value);if (this._scaleFont != value) {
this._scaleFont = value;this.raisePropertyChanged('scaleFont');}
},
get_fontUnit : function() {
return this._fontUnit;},
set_fontUnit : function(value) {
if (this._fontUnit != value) { 
this._fontUnit = value;this.raisePropertyChanged('fontUnit');}
}
}
$AA.ScaleAnimation.registerClass('AjaxControlToolkit.Animation.ScaleAnimation', $AA.Animation);$AA.registerAnimation('scale', $AA.ScaleAnimation);$AA.Action = function(target, duration, fps) {
$AA.Action.initializeBase(this, [target, duration, fps]);if (duration === undefined) {
this.set_duration(0);}
}
$AA.Action.prototype = {
onEnd : function() {
this.doAction();$AA.Action.callBaseMethod(this, 'onEnd');},
doAction : function() {
throw Error.notImplemented();},
getAnimatedValue : function() {
},
setValue : function() {
}
}
$AA.Action.registerClass('AjaxControlToolkit.Animation.Action', $AA.Animation);$AA.registerAnimation('action', $AA.Action);$AA.EnableAction = function(target, duration, fps, enabled) {
$AA.EnableAction.initializeBase(this, [target, duration, fps]);this._enabled = (enabled !== undefined) ? enabled : true;}
$AA.EnableAction.prototype = {
doAction : function() {
var element = this.get_target();if (element) {
element.disabled = !this._enabled;}
},
get_enabled : function() {
return this._enabled;},
set_enabled : function(value) {
value = this._getBoolean(value);if (this._enabled != value) {
this._enabled = value;this.raisePropertyChanged('enabled');}
}
}
$AA.EnableAction.registerClass('AjaxControlToolkit.Animation.EnableAction', $AA.Action);$AA.registerAnimation('enableAction', $AA.EnableAction);$AA.HideAction = function(target, duration, fps, visible) {
$AA.HideAction.initializeBase(this, [target, duration, fps]);this._visible = visible;}
$AA.HideAction.prototype = {
doAction : function() {
var element = this.get_target();if (element) {
$common.setVisible(element, this._visible);}
},
get_visible : function() {
return this._visible;},
set_visible : function(value) {
if (this._visible != value) {
this._visible = value;this.raisePropertyChanged('visible');}
}
}
$AA.HideAction.registerClass('AjaxControlToolkit.Animation.HideAction', $AA.Action);$AA.registerAnimation('hideAction', $AA.HideAction);$AA.StyleAction = function(target, duration, fps, attribute, value) {
$AA.StyleAction.initializeBase(this, [target, duration, fps]);this._attribute = attribute;this._value = value;}
$AA.StyleAction.prototype = {
doAction : function() {
var element = this.get_target();if (element) {
element.style[this._attribute] = this._value;}
},
get_attribute : function() {
return this._attribute;},
set_attribute : function(value) {
if (this._attribute != value) {
this._attribute = value;this.raisePropertyChanged('attribute');}
},
get_value : function() {
return this._value;},
set_value : function(value) {
if (this._value != value) {
this._value = value;this.raisePropertyChanged('value');}
}
}
$AA.StyleAction.registerClass('AjaxControlToolkit.Animation.StyleAction', $AA.Action);$AA.registerAnimation('styleAction', $AA.StyleAction);$AA.OpacityAction = function(target, duration, fps, opacity) {
$AA.OpacityAction.initializeBase(this, [target, duration, fps]);this._opacity = opacity;}
$AA.OpacityAction.prototype = {
doAction : function() {
var element = this.get_target();if (element) {
$common.setElementOpacity(element, this._opacity);}
},
get_opacity : function() {
return this._opacity;},
set_opacity : function(value) {
value = this._getFloat(value);if (this._opacity != value) {
this._opacity = value;this.raisePropertyChanged('opacity');}
}
}
$AA.OpacityAction.registerClass('AjaxControlToolkit.Animation.OpacityAction', $AA.Action);$AA.registerAnimation('opacityAction', $AA.OpacityAction);$AA.ScriptAction = function(target, duration, fps, script) {
$AA.ScriptAction.initializeBase(this, [target, duration, fps]);this._script = script;}
$AA.ScriptAction.prototype = {
doAction : function() {
try {
eval(this._script);} catch (ex) {
}
},
get_script : function() {
return this._script;},
set_script : function(value) {
if (this._script != value) {
this._script = value;this.raisePropertyChanged('script');}
}
}
$AA.ScriptAction.registerClass('AjaxControlToolkit.Animation.ScriptAction', $AA.Action);$AA.registerAnimation('scriptAction', $AA.ScriptAction);
//END AjaxControlToolkit.Animation.Animations.js
//START AjaxControlToolkit.ExtenderBase.BaseScripts.js
Type.registerNamespace('AjaxControlToolkit');AjaxControlToolkit.BehaviorBase = function(element) {
AjaxControlToolkit.BehaviorBase.initializeBase(this,[element]);this._clientStateFieldID = null;this._pageRequestManager = null;this._partialUpdateBeginRequestHandler = null;this._partialUpdateEndRequestHandler = null;}
AjaxControlToolkit.BehaviorBase.prototype = {
initialize : function() {
AjaxControlToolkit.BehaviorBase.callBaseMethod(this, 'initialize');},
dispose : function() {
AjaxControlToolkit.BehaviorBase.callBaseMethod(this, 'dispose');if (this._pageRequestManager) {
if (this._partialUpdateBeginRequestHandler) {
this._pageRequestManager.remove_beginRequest(this._partialUpdateBeginRequestHandler);this._partialUpdateBeginRequestHandler = null;}
if (this._partialUpdateEndRequestHandler) {
this._pageRequestManager.remove_endRequest(this._partialUpdateEndRequestHandler);this._partialUpdateEndRequestHandler = null;}
this._pageRequestManager = null;}
},
get_ClientStateFieldID : function() {
return this._clientStateFieldID;},
set_ClientStateFieldID : function(value) {
if (this._clientStateFieldID != value) {
this._clientStateFieldID = value;this.raisePropertyChanged('ClientStateFieldID');}
},
get_ClientState : function() {
if (this._clientStateFieldID) {
var input = document.getElementById(this._clientStateFieldID);if (input) {
return input.value;}
}
return null;},
set_ClientState : function(value) {
if (this._clientStateFieldID) {
var input = document.getElementById(this._clientStateFieldID);if (input) {
input.value = value;}
}
},
registerPartialUpdateEvents : function() {
if (Sys && Sys.WebForms && Sys.WebForms.PageRequestManager){
this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();if (this._pageRequestManager) {
this._partialUpdateBeginRequestHandler = Function.createDelegate(this, this._partialUpdateBeginRequest);this._pageRequestManager.add_beginRequest(this._partialUpdateBeginRequestHandler);this._partialUpdateEndRequestHandler = Function.createDelegate(this, this._partialUpdateEndRequest);this._pageRequestManager.add_endRequest(this._partialUpdateEndRequestHandler);}
}
},
_partialUpdateBeginRequest : function(sender, beginRequestEventArgs) {
},
_partialUpdateEndRequest : function(sender, endRequestEventArgs) {
}
}
AjaxControlToolkit.BehaviorBase.registerClass('AjaxControlToolkit.BehaviorBase', Sys.UI.Behavior);AjaxControlToolkit.DynamicPopulateBehaviorBase = function(element) {
AjaxControlToolkit.DynamicPopulateBehaviorBase.initializeBase(this, [element]);this._DynamicControlID = null;this._DynamicContextKey = null;this._DynamicServicePath = null;this._DynamicServiceMethod = null;this._cacheDynamicResults = false;this._dynamicPopulateBehavior = null;this._populatingHandler = null;this._populatedHandler = null;}
AjaxControlToolkit.DynamicPopulateBehaviorBase.prototype = {
initialize : function() {
AjaxControlToolkit.DynamicPopulateBehaviorBase.callBaseMethod(this, 'initialize');this._populatingHandler = Function.createDelegate(this, this._onPopulating);this._populatedHandler = Function.createDelegate(this, this._onPopulated);},
dispose : function() {
if (this._populatedHandler) {
if (this._dynamicPopulateBehavior) {
this._dynamicPopulateBehavior.remove_populated(this._populatedHandler);}
this._populatedHandler = null;}
if (this._populatingHandler) {
if (this._dynamicPopulateBehavior) {
this._dynamicPopulateBehavior.remove_populating(this._populatingHandler);}
this._populatingHandler = null;}
if (this._dynamicPopulateBehavior) {
this._dynamicPopulateBehavior.dispose();this._dynamicPopulateBehavior = null;}
AjaxControlToolkit.DynamicPopulateBehaviorBase.callBaseMethod(this, 'dispose');},
populate : function(contextKeyOverride) {
if (this._dynamicPopulateBehavior && (this._dynamicPopulateBehavior.get_element() != $get(this._DynamicControlID))) {
this._dynamicPopulateBehavior.dispose();this._dynamicPopulateBehavior = null;}
if (!this._dynamicPopulateBehavior && this._DynamicControlID && this._DynamicServiceMethod) {
this._dynamicPopulateBehavior = $create(AjaxControlToolkit.DynamicPopulateBehavior,
{
"id" : this.get_id() + "_DynamicPopulateBehavior",
"ContextKey" : this._DynamicContextKey,
"ServicePath" : this._DynamicServicePath,
"ServiceMethod" : this._DynamicServiceMethod,
"cacheDynamicResults" : this._cacheDynamicResults
}, null, null, $get(this._DynamicControlID));this._dynamicPopulateBehavior.add_populating(this._populatingHandler);this._dynamicPopulateBehavior.add_populated(this._populatedHandler);}
if (this._dynamicPopulateBehavior) {
this._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : this._DynamicContextKey);}
},
_onPopulating : function(sender, eventArgs) {
this.raisePopulating(eventArgs);},
_onPopulated : function(sender, eventArgs) {
this.raisePopulated(eventArgs);},
get_dynamicControlID : function() {
return this._DynamicControlID;},
get_DynamicControlID : this.get_dynamicControlID,
set_dynamicControlID : function(value) {
if (this._DynamicControlID != value) {
this._DynamicControlID = value;this.raisePropertyChanged('dynamicControlID');this.raisePropertyChanged('DynamicControlID');}
},
set_DynamicControlID : this.set_dynamicControlID,
get_dynamicContextKey : function() {
return this._DynamicContextKey;},
get_DynamicContextKey : this.get_dynamicContextKey,
set_dynamicContextKey : function(value) {
if (this._DynamicContextKey != value) {
this._DynamicContextKey = value;this.raisePropertyChanged('dynamicContextKey');this.raisePropertyChanged('DynamicContextKey');}
},
set_DynamicContextKey : this.set_dynamicContextKey,
get_dynamicServicePath : function() {
return this._DynamicServicePath;},
get_DynamicServicePath : this.get_dynamicServicePath,
set_dynamicServicePath : function(value) {
if (this._DynamicServicePath != value) {
this._DynamicServicePath = value;this.raisePropertyChanged('dynamicServicePath');this.raisePropertyChanged('DynamicServicePath');}
},
set_DynamicServicePath : this.set_dynamicServicePath,
get_dynamicServiceMethod : function() {
return this._DynamicServiceMethod;},
get_DynamicServiceMethod : this.get_dynamicServiceMethod,
set_dynamicServiceMethod : function(value) {
if (this._DynamicServiceMethod != value) {
this._DynamicServiceMethod = value;this.raisePropertyChanged('dynamicServiceMethod');this.raisePropertyChanged('DynamicServiceMethod');}
},
set_DynamicServiceMethod : this.set_dynamicServiceMethod,
get_cacheDynamicResults : function() {
return this._cacheDynamicResults;},
set_cacheDynamicResults : function(value) {
if (this._cacheDynamicResults != value) {
this._cacheDynamicResults = value;this.raisePropertyChanged('cacheDynamicResults');}
},
add_populated : function(handler) {
this.get_events().addHandler("populated", handler);},
remove_populated : function(handler) {
this.get_events().removeHandler("populated", handler);},
raisePopulated : function(arg) {
var handler = this.get_events().getHandler("populated");if (handler) handler(this, arg);},
add_populating : function(handler) {
this.get_events().addHandler('populating', handler);},
remove_populating : function(handler) {
this.get_events().removeHandler('populating', handler);},
raisePopulating : function(eventArgs) {
var handler = this.get_events().getHandler('populating');if (handler) {
handler(this, eventArgs);}
}
}
AjaxControlToolkit.DynamicPopulateBehaviorBase.registerClass('AjaxControlToolkit.DynamicPopulateBehaviorBase', AjaxControlToolkit.BehaviorBase);AjaxControlToolkit.ControlBase = function(element) {
AjaxControlToolkit.ControlBase.initializeBase(this, [element]);this._clientStateField = null;this._callbackTarget = null;this._onsubmit$delegate = Function.createDelegate(this, this._onsubmit);this._oncomplete$delegate = Function.createDelegate(this, this._oncomplete);this._onerror$delegate = Function.createDelegate(this, this._onerror);}
AjaxControlToolkit.ControlBase.prototype = {
initialize : function() {
AjaxControlToolkit.ControlBase.callBaseMethod(this, "initialize");if (this._clientStateField) {
this.loadClientState(this._clientStateField.value);}
if (typeof(Sys.WebForms)!=="undefined" && typeof(Sys.WebForms.PageRequestManager)!=="undefined") {
Array.add(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);} else {
$addHandler(document.forms[0], "submit", this._onsubmit$delegate);}
},
dispose : function() {
if (typeof(Sys.WebForms)!=="undefined" && typeof(Sys.WebForms.PageRequestManager)!=="undefined") {
Array.remove(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);} else {
$removeHandler(document.forms[0], "submit", this._onsubmit$delegate);}
AjaxControlToolkit.ControlBase.callBaseMethod(this, "dispose");},
findElement : function(id) {
return $get(this.get_id() + '_' + id.split(':').join('_'));},
get_clientStateField : function() {
return this._clientStateField;},
set_clientStateField : function(value) {
if (this.get_isInitialized()) throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_CannotSetClientStateField);if (this._clientStateField != value) {
this._clientStateField = value;this.raisePropertyChanged('clientStateField');}
},
loadClientState : function(value) {
},
saveClientState : function() {
return null;},
_invoke : function(name, args, cb) {
if (!this._callbackTarget) {
throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_ControlNotRegisteredForCallbacks);}
if (typeof(WebForm_DoCallback)==="undefined") {
throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_PageNotRegisteredForCallbacks);}
var ar = [];for (var i = 0;i < args.length;i++) 
ar[i] = args[i];var clientState = this.saveClientState();if (clientState != null && !String.isInstanceOfType(clientState)) {
throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_InvalidClientStateType);}
var payload = Sys.Serialization.JavaScriptSerializer.serialize({name:name,args:ar,state:this.saveClientState()});WebForm_DoCallback(this._callbackTarget, payload, this._oncomplete$delegate, cb, this._onerror$delegate, true);},
_oncomplete : function(result, context) {
result = Sys.Serialization.JavaScriptSerializer.deserialize(result);if (result.error) {
throw Error.create(result.error);}
this.loadClientState(result.state);context(result.result);},
_onerror : function(message, context) {
throw Error.create(message);},
_onsubmit : function() {
if (this._clientStateField) {
this._clientStateField.value = this.saveClientState();}
return true;} 
}
AjaxControlToolkit.ControlBase.registerClass("AjaxControlToolkit.ControlBase", Sys.UI.Control);
AjaxControlToolkit.Resources={
"PasswordStrength_InvalidWeightingRatios":"密碼複雜性的權重比例必須有 4 種","Animation_ChildrenNotAllowed":"AjaxControlToolkit.Animation.createAnimation 無法加入一個不是衍生自 AjaxControlToolkit.Animation.ParentAnimation 且類型為 {0} 的子動畫","PasswordStrength_RemainingSymbols":"還需要 {0} 個符號","ExtenderBase_CannotSetClientStateField":"只能在初始化之前設定 clientStateField","RTE_PreviewHTML":"Preview HTML","RTE_JustifyCenter":"Justify Center","PasswordStrength_RemainingUpperCase":"{0} more upper case characters","Animation_TargetNotFound":"AjaxControlToolkit.Animation.Animation.set_animationTarget 需要一個 Sys.UI.DomElement 或 Sys.UI.Control 類別的控制項  ID。找不到相對應的  {0} 之項目或控制項","RTE_FontColor":"Font Color","RTE_LabelColor":"Label Color","Common_InvalidBorderWidthUnit":"單位類型 {0} 對 parseBorderWidth 而言無效","RTE_Heading":"Heading","Tabs_PropertySetBeforeInitialization":"於初始化之前，無法變更 {0}","RTE_OrderedList":"Ordered List","ReorderList_DropWatcherBehavior_NoChild":"無法找到 ID 為 {0} 的子清單","CascadingDropDown_MethodTimeout":"[方法逾時]","RTE_Columns":"Columns","RTE_InsertImage":"Insert Image","RTE_InsertTable":"Insert Table","RTE_Values":"Values","RTE_OK":"OK","ExtenderBase_PageNotRegisteredForCallbacks":"這個頁面尚未註冊，無法提供回呼","Animation_NoDynamicPropertyFound":"AjaxControlToolkit.Animation.createAnimation 找不到相對應的  {0} 或 {1} 屬性","Animation_InvalidBaseType":"AjaxControlToolkit.Animation.registerAnimation 只能註冊那些繼承自 AjaxControlToolkit.Animation.Animation 的類型","RTE_UnorderedList":"Unordered List","ResizableControlBehavior_InvalidHandler":"{0} 處理常式不是函式、函式名稱、或是函式文字","Animation_InvalidColor":"標記名稱 Color 必須是 7 個字元的 16 進位字串（例如：#246ACF），不能是 {0}","RTE_CellColor":"Cell Color","PasswordStrength_RemainingMixedCase":"大小寫混合","RTE_Italic":"Italic","CascadingDropDown_NoParentElement":"無法找到父項目 {0}","ValidatorCallout_DefaultErrorMessage":"這個控制項無效","RTE_Indent":"Indent","ReorderList_DropWatcherBehavior_CallbackError":"無法重新排列，請參考下面的說明：\\r\\n\\r\\n{0}","PopupControl_NoDefaultProperty":"類型 {1} 的 控制項 {0} 不支援預設屬性","RTE_Normal":"Normal","PopupExtender_NoParentElement":"無法找到父項目 {0}","RTE_ViewValues":"View Values","RTE_Legend":"Legend","RTE_Labels":"Labels","RTE_CellSpacing":"Cell Spacing","PasswordStrength_RemainingNumbers":"還需要 {0} 個數字","RTE_Border":"Border","RTE_Create":"Create","RTE_BackgroundColor":"Background Color","RTE_Cancel":"Cancel","RTE_JustifyFull":"Justify Full","RTE_JustifyLeft":"Justify Left","RTE_Cut":"Cut","ResizableControlBehavior_CannotChangeProperty":"不支援對 {0} 的變更","RTE_ViewSource":"View Source","Common_InvalidPaddingUnit":"單位類型 {0} 對 parsePadding 而言無效","RTE_Paste":"Paste","ExtenderBase_ControlNotRegisteredForCallbacks":"這個控制項尚未註冊，無法提供回呼","Calendar_Today":"今天:  {0}","MultiHandleSlider_CssHeightWidthRequired":"You must specify a CSS width and height for all handle styles as well as the rail.","Common_DateTime_InvalidFormat":"格式無效","ListSearch_DefaultPrompt":"請鍵入以便搜尋","CollapsiblePanel_NoControlID":"無法找到項目 {0}","RTE_ViewEditor":"View Editor","RTE_BarColor":"Bar Color","PasswordStrength_DefaultStrengthDescriptions":"沒有;很弱;弱;差;差強人意;尚可;普通;好;很好;非常好;臻於完美！","RTE_Inserttexthere":"Insert text here","Animation_UknownAnimationName":"AjaxControlToolkit.Animation.createAnimation 找不到名稱為 {0} 的動畫","ExtenderBase_InvalidClientStateType":"saveClientState 必須傳回 String 型別的值","Rating_CallbackError":"發生未處理的例外狀況：\\r\\n{0}","Tabs_OwnerExpected":"於初始化之前，必須設定擁有者","DynamicPopulate_WebServiceTimeout":"呼叫 Web 服務逾時","PasswordStrength_RemainingLowerCase":"{0} more lower case characters","Animation_MissingAnimationName":"AjaxControlToolkit.Animation.createAnimation 必須持有一個 AnimationName 屬性的物件","RTE_JustifyRight":"Justify Right","Tabs_ActiveTabArgumentOutOfRange":"參數不是索引標籤 (Tab) 集合的成員","RTE_CellPadding":"Cell Padding","RTE_ClearFormatting":"Clear Formatting","AlwaysVisible_ElementRequired":"必須替 AjaxControlToolkit.AlwaysVisibleControlBehavior 指定一個項目","Slider_NoSizeProvided":"請在 Slider 的 CSS Class 中，設定高度與寬度屬性的有效值","DynamicPopulate_WebServiceError":"無法呼叫 Web 服務：{0}","PasswordStrength_StrengthPrompt":"複雜性：","PasswordStrength_RemainingCharacters":"還需要 {0} 個字元","PasswordStrength_Satisfied":"密碼複雜性已經足夠","RTE_Hyperlink":"Hyperlink","Animation_NoPropertyFound":"AjaxControlToolkit.Animation.createAnimation 找不到相對應的 {0} 屬性","PasswordStrength_InvalidStrengthDescriptionStyles":"密碼複雜性文字說明的樣式表，必須符合文字內容之個數","PasswordStrength_GetHelpRequirements":"取得密碼複雜性的要求說明","PasswordStrength_InvalidStrengthDescriptions":"所指定的密碼複雜性文字內容個數無效","RTE_Underline":"Underline","Tabs_PropertySetAfterInitialization":"於初始化之後，無法變更 {0}","RTE_Rows":"Rows","RTE_Redo":"Redo","RTE_Size":"Size","RTE_Undo":"Undo","RTE_Bold":"Bold","RTE_Copy":"Copy","RTE_Font":"Font","CascadingDropDown_MethodError":"[方法錯誤 {0}]","RTE_BorderColor":"Border Color","RTE_Paragraph":"Paragraph","RTE_InsertHorizontalRule":"Insert Horizontal Rule","Common_UnitHasNoDigits":"沒有數字","RTE_Outdent":"Outdent","Common_DateTime_InvalidTimeSpan":"{0} 的 TimeSpan 格式無效","Animation_CannotNestSequence":"AjaxControlToolkit.Animation.ParallelAnimation 不能內含 AjaxControlToolkit.Animation.SequenceAnimation","Shared_BrowserSecurityPreventsPaste":"您的瀏覽器安全性設定，不允許執行自動貼上的操作。請改用鍵盤快速鍵 Ctrl + V。"};
//END AjaxControlToolkit.ExtenderBase.BaseScripts.js
//START AjaxControlToolkit.Animation.AnimationBehavior.js
Type.registerNamespace('AjaxControlToolkit.Animation');AjaxControlToolkit.Animation.AnimationBehavior = function(element) {
AjaxControlToolkit.Animation.AnimationBehavior.initializeBase(this, [element]);this._onLoad = null;this._onClick = null;this._onMouseOver = null;this._onMouseOut = null;this._onHoverOver = null;this._onHoverOut = null;this._onClickHandler = null;this._onMouseOverHandler = null;this._onMouseOutHandler = null;}
AjaxControlToolkit.Animation.AnimationBehavior.prototype = {
initialize : function() {
AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'initialize');var element = this.get_element();if (element) {
this._onClickHandler = Function.createDelegate(this, this.OnClick);$addHandler(element, 'click', this._onClickHandler);this._onMouseOverHandler = Function.createDelegate(this, this.OnMouseOver);$addHandler(element, 'mouseover', this._onMouseOverHandler);this._onMouseOutHandler = Function.createDelegate(this, this.OnMouseOut);$addHandler(element, 'mouseout', this._onMouseOutHandler);}
},
dispose : function() {
var element = this.get_element();if (element) {
if (this._onClickHandler) {
$removeHandler(element, 'click', this._onClickHandler);this._onClickHandler = null;}
if (this._onMouseOverHandler) {
$removeHandler(element, 'mouseover', this._onMouseOverHandler);this._onMouseOverHandler = null;}
if (this._onMouseOutHandler) {
$removeHandler(element, 'mouseout', this._onMouseOutHandler);this._onMouseOutHandler = null;}
}
this._onLoad = null;this._onClick = null;this._onMouseOver = null;this._onMouseOut = null;this._onHoverOver = null;this._onHoverOut = null;AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'dispose');},
get_OnLoad : function() {
return this._onLoad ? this._onLoad.get_json() : null;},
set_OnLoad : function(value) {
if (!this._onLoad) {
this._onLoad = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onLoad.initialize();}
this._onLoad.set_json(value);this.raisePropertyChanged('OnLoad');this._onLoad.play();},
get_OnLoadBehavior : function() {
return this._onLoad;},
get_OnClick : function() {
return this._onClick ? this._onClick.get_json() : null;},
set_OnClick : function(value) {
if (!this._onClick) {
this._onClick = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onClick.initialize();}
this._onClick.set_json(value);this.raisePropertyChanged('OnClick');},
get_OnClickBehavior : function() {
return this._onClick;},
OnClick : function() {
if (this._onClick) {
this._onClick.play();}
},
get_OnMouseOver : function() {
return this._onMouseOver ? this._onMouseOver.get_json() : null;},
set_OnMouseOver : function(value) {
if (!this._onMouseOver) {
this._onMouseOver = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onMouseOver.initialize();}
this._onMouseOver.set_json(value);this.raisePropertyChanged('OnMouseOver');},
get_OnMouseOverBehavior : function() {
return this._onMouseOver;},
OnMouseOver : function() {
if (this._onMouseOver) {
this._onMouseOver.play();}
if (this._onHoverOver) {
if (this._onHoverOut) {
this._onHoverOut.quit();}
this._onHoverOver.play();}
},
get_OnMouseOut : function() {
return this._onMouseOut ? this._onMouseOut.get_json() : null;},
set_OnMouseOut : function(value) {
if (!this._onMouseOut) {
this._onMouseOut = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onMouseOut.initialize();}
this._onMouseOut.set_json(value);this.raisePropertyChanged('OnMouseOut');},
get_OnMouseOutBehavior : function() {
return this._onMouseOut;},
OnMouseOut : function() {
if (this._onMouseOut) {
this._onMouseOut.play();}
if (this._onHoverOut) {
if (this._onHoverOver) {
this._onHoverOver.quit();}
this._onHoverOut.play();}
},
get_OnHoverOver : function() {
return this._onHoverOver ? this._onHoverOver.get_json() : null;},
set_OnHoverOver : function(value) {
if (!this._onHoverOver) {
this._onHoverOver = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onHoverOver.initialize();}
this._onHoverOver.set_json(value);this.raisePropertyChanged('OnHoverOver');},
get_OnHoverOverBehavior : function() {
return this._onHoverOver;},
get_OnHoverOut : function() {
return this._onHoverOut ? this._onHoverOut.get_json() : null;},
set_OnHoverOut : function(value) {
if (!this._onHoverOut) {
this._onHoverOut = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onHoverOut.initialize();}
this._onHoverOut.set_json(value);this.raisePropertyChanged('OnHoverOut');},
get_OnHoverOutBehavior : function() {
return this._onHoverOut;}
}
AjaxControlToolkit.Animation.AnimationBehavior.registerClass('AjaxControlToolkit.Animation.AnimationBehavior', AjaxControlToolkit.BehaviorBase);AjaxControlToolkit.Animation.GenericAnimationBehavior = function(element) {
AjaxControlToolkit.Animation.GenericAnimationBehavior.initializeBase(this, [element]);this._json = null;this._animation = null;}
AjaxControlToolkit.Animation.GenericAnimationBehavior.prototype = {
dispose : function() {
this.disposeAnimation();AjaxControlToolkit.Animation.GenericAnimationBehavior.callBaseMethod(this, 'dispose');},
disposeAnimation : function() {
if (this._animation) {
this._animation.dispose();}
this._animation = null;},
play : function() {
if (this._animation && !this._animation.get_isPlaying()) {
this.stop();this._animation.play();}
},
stop : function() {
if (this._animation) {
if (this._animation.get_isPlaying()) {
this._animation.stop(true);}
}
},
quit : function() {
if (this._animation) {
if (this._animation.get_isPlaying()) {
this._animation.stop(false);}
}
},
get_json : function() {
return this._json;},
set_json : function(value) {
if (this._json != value) {
this._json = value;this.raisePropertyChanged('json');this.disposeAnimation();var element = this.get_element();if (element) {
this._animation = AjaxControlToolkit.Animation.buildAnimation(this._json, element);if (this._animation) {
this._animation.initialize();}
this.raisePropertyChanged('animation');}
}
},
get_animation : function() {
return this._animation;}
}
AjaxControlToolkit.Animation.GenericAnimationBehavior.registerClass('AjaxControlToolkit.Animation.GenericAnimationBehavior', AjaxControlToolkit.BehaviorBase);
//END AjaxControlToolkit.Animation.AnimationBehavior.js
//START AjaxControlToolkit.PopupExtender.PopupBehavior.js
Type.registerNamespace('AjaxControlToolkit');AjaxControlToolkit.PopupBehavior = function(element) {
AjaxControlToolkit.PopupBehavior.initializeBase(this, [element]);this._x = 0;this._y = 0;this._positioningMode = AjaxControlToolkit.PositioningMode.Absolute;this._parentElement = null;this._parentElementID = null;this._moveHandler = null;this._firstPopup = true;this._originalParent = null;this._visible = false;this._onShow = null;this._onShowEndedHandler = null;this._onHide = null;this._onHideEndedHandler = null;}
AjaxControlToolkit.PopupBehavior.prototype = {
initialize : function() {
AjaxControlToolkit.PopupBehavior.callBaseMethod(this, 'initialize');this._hidePopup();this.get_element().style.position = "absolute";this._onShowEndedHandler = Function.createDelegate(this, this._onShowEnded);this._onHideEndedHandler = Function.createDelegate(this, this._onHideEnded);},
dispose : function() {
var element = this.get_element();if (element) {
if (this._visible) {
this.hide();}
if (this._originalParent) {
element.parentNode.removeChild(element);this._originalParent.appendChild(element);this._originalParent = null;}
element._hideWindowedElementsIFrame = null;}
this._parentElement = null;if (this._onShow && this._onShow.get_animation() && this._onShowEndedHandler) {
this._onShow.get_animation().remove_ended(this._onShowEndedHandler);}
this._onShowEndedHandler = null;this._onShow = null;if (this._onHide && this._onHide.get_animation() && this._onHideEndedHandler) {
this._onHide.get_animation().remove_ended(this._onHideEndedHandler);}
this._onHideEndedHandler = null;this._onHide = null;AjaxControlToolkit.PopupBehavior.callBaseMethod(this, 'dispose');},
show : function() {
if (this._visible) {
return;}
var eventArgs = new Sys.CancelEventArgs();this.raiseShowing(eventArgs);if (eventArgs.get_cancel()) {
return;}
this._visible = true;var element = this.get_element();$common.setVisible(element, true);this.setupPopup();if (this._onShow) {
$common.setVisible(element, false);this.onShow();} else {
this.raiseShown(Sys.EventArgs.Empty);}
},
hide : function() {
if (!this._visible) {
return;}
var eventArgs = new Sys.CancelEventArgs();this.raiseHiding(eventArgs);if (eventArgs.get_cancel()) {
return;}
this._visible = false;if (this._onHide) {
this.onHide();} else {
this._hidePopup();this._hideCleanup();}
},
getBounds : function() {
var element = this.get_element();var offsetParent = element.offsetParent || document.documentElement;var diff;var parentBounds;if (this._parentElement) {
parentBounds = $common.getBounds(this._parentElement);var offsetParentLocation = $common.getLocation(offsetParent);diff = {x: parentBounds.x - offsetParentLocation.x, y:parentBounds.y - offsetParentLocation.y};} else {
parentBounds = $common.getBounds(offsetParent);diff = {x:0, y:0};}
var width = element.offsetWidth - (element.clientLeft ? element.clientLeft * 2 : 0);var height = element.offsetHeight - (element.clientTop ? element.clientTop * 2 : 0);if (this._firstpopup) {
element.style.width = width + "px";this._firstpopup = false;}
var position;switch (this._positioningMode) {
case AjaxControlToolkit.PositioningMode.Center:
position = {
x: Math.round(parentBounds.width / 2 - width / 2),
y: Math.round(parentBounds.height / 2 - height / 2)
};break;case AjaxControlToolkit.PositioningMode.BottomLeft:
position = {
x: 0,
y: parentBounds.height
};break;case AjaxControlToolkit.PositioningMode.BottomRight:
position = {
x: parentBounds.width - width,
y: parentBounds.height
};break;case AjaxControlToolkit.PositioningMode.TopLeft:
position = {
x: 0,
y: -element.offsetHeight
};break;case AjaxControlToolkit.PositioningMode.TopRight:
position = {
x: parentBounds.width - width,
y: -element.offsetHeight
};break;case AjaxControlToolkit.PositioningMode.Right:
position = {
x: parentBounds.width,
y: 0
};break;case AjaxControlToolkit.PositioningMode.Left:
position = {
x: -element.offsetWidth,
y: 0
};break;default:
position = {x: 0, y: 0};}
position.x += this._x + diff.x;position.y += this._y + diff.y;return new Sys.UI.Bounds(position.x, position.y, width, height);},
adjustPopupPosition : function(bounds) {
var element = this.get_element();if (!bounds) {
bounds = this.getBounds();}
var newPosition = $common.getBounds(element);var updateNeeded = false;if (newPosition.x < 0) {
bounds.x -= newPosition.x;updateNeeded = true;}
if (newPosition.y < 0) {
bounds.y -= newPosition.y;updateNeeded = true;}
if (updateNeeded) {
$common.setLocation(element, bounds);}
},
addBackgroundIFrame : function() {
var element = this.get_element();if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
var childFrame = element._hideWindowedElementsIFrame;if (!childFrame) {
childFrame = document.createElement("iframe");childFrame.src = "javascript:'<html></html>';";childFrame.style.position = "absolute";childFrame.style.display = "none";childFrame.scrolling = "no";childFrame.frameBorder = "0";childFrame.tabIndex = "-1";childFrame.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";element.parentNode.insertBefore(childFrame, element);element._hideWindowedElementsIFrame = childFrame;this._moveHandler = Function.createDelegate(this, this._onMove);Sys.UI.DomEvent.addHandler(element, "move", this._moveHandler);}
$common.setBounds(childFrame, $common.getBounds(element));childFrame.style.display = element.style.display;if (element.currentStyle && element.currentStyle.zIndex) {
childFrame.style.zIndex = element.currentStyle.zIndex;} else if (element.style.zIndex) {
childFrame.style.zIndex = element.style.zIndex;}
}
},
setupPopup : function() {
var element = this.get_element();var bounds = this.getBounds();$common.setLocation(element, bounds);this.adjustPopupPosition(bounds);element.zIndex = 1000;this.addBackgroundIFrame();},
_hidePopup : function() {
var element = this.get_element();$common.setVisible(element, false);if (element.originalWidth) {
element.style.width = element.originalWidth + "px";element.originalWidth = null;}
},
_hideCleanup : function() {
var element = this.get_element();if (this._moveHandler) {
Sys.UI.DomEvent.removeHandler(element, "move", this._moveHandler);this._moveHandler = null;}
if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
var childFrame = element._hideWindowedElementsIFrame;if (childFrame) {
childFrame.style.display = "none";}
}
this.raiseHidden(Sys.EventArgs.Empty);},
_onMove : function() {
var element = this.get_element();if (element._hideWindowedElementsIFrame) {
element.parentNode.insertBefore(element._hideWindowedElementsIFrame, element);element._hideWindowedElementsIFrame.style.top = element.style.top;element._hideWindowedElementsIFrame.style.left = element.style.left;}
},
get_onShow : function() {
return this._onShow ? this._onShow.get_json() : null;},
set_onShow : function(value) {
if (!this._onShow) {
this._onShow = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onShow.initialize();}
this._onShow.set_json(value);var animation = this._onShow.get_animation();if (animation) {
animation.add_ended(this._onShowEndedHandler);}
this.raisePropertyChanged('onShow');},
get_onShowBehavior : function() {
return this._onShow;},
onShow : function() {
if (this._onShow) {
if (this._onHide) {
this._onHide.quit();}
this._onShow.play();}
},
_onShowEnded : function() {
this.adjustPopupPosition();this.addBackgroundIFrame();this.raiseShown(Sys.EventArgs.Empty);},
get_onHide : function() {
return this._onHide ? this._onHide.get_json() : null;},
set_onHide : function(value) {
if (!this._onHide) {
this._onHide = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());this._onHide.initialize();}
this._onHide.set_json(value);var animation = this._onHide.get_animation();if (animation) {
animation.add_ended(this._onHideEndedHandler);}
this.raisePropertyChanged('onHide');},
get_onHideBehavior : function() {
return this._onHide;},
onHide : function() {
if (this._onHide) {
if (this._onShow) {
this._onShow.quit();}
this._onHide.play();}
},
_onHideEnded : function() {
this._hideCleanup();},
get_parentElement : function() {
if (!this._parentElement && this._parentElementID) {
this.set_parentElement($get(this._parentElementID));Sys.Debug.assert(this._parentElement != null, String.format(AjaxControlToolkit.Resources.PopupExtender_NoParentElement, this._parentElementID));} 
return this._parentElement;},
set_parentElement : function(element) {
this._parentElement = element;this.raisePropertyChanged('parentElement');},
get_parentElementID : function() {
if (this._parentElement) {
return this._parentElement.id
}
return this._parentElementID;},
set_parentElementID : function(elementID) {
this._parentElementID = elementID;if (this.get_isInitialized()) {
this.set_parentElement($get(elementID));}
},
get_positioningMode : function() {
return this._positioningMode;},
set_positioningMode : function(mode) {
this._positioningMode = mode;this.raisePropertyChanged('positioningMode');},
get_x : function() {
return this._x;},
set_x : function(value) {
if (value != this._x) {
this._x = value;if (this._visible) {
this.setupPopup();}
this.raisePropertyChanged('x');}
},
get_y : function() {
return this._y;},
set_y : function(value) {
if (value != this._y) {
this._y = value;if (this._visible) {
this.setupPopup();}
this.raisePropertyChanged('y');}
},
get_visible : function() {
return this._visible;},
add_showing : function(handler) {
this.get_events().addHandler('showing', handler);},
remove_showing : function(handler) {
this.get_events().removeHandler('showing', handler);},
raiseShowing : function(eventArgs) {
var handler = this.get_events().getHandler('showing');if (handler) {
handler(this, eventArgs);}
},
add_shown : function(handler) {
this.get_events().addHandler('shown', handler);},
remove_shown : function(handler) {
this.get_events().removeHandler('shown', handler);},
raiseShown : function(eventArgs) {
var handler = this.get_events().getHandler('shown');if (handler) {
handler(this, eventArgs);}
}, 
add_hiding : function(handler) {
this.get_events().addHandler('hiding', handler);},
remove_hiding : function(handler) {
this.get_events().removeHandler('hiding', handler);},
raiseHiding : function(eventArgs) {
var handler = this.get_events().getHandler('hiding');if (handler) {
handler(this, eventArgs);}
},
add_hidden : function(handler) {
this.get_events().addHandler('hidden', handler);},
remove_hidden : function(handler) {
this.get_events().removeHandler('hidden', handler);},
raiseHidden : function(eventArgs) {
var handler = this.get_events().getHandler('hidden');if (handler) {
handler(this, eventArgs);}
}
}
AjaxControlToolkit.PopupBehavior.registerClass('AjaxControlToolkit.PopupBehavior', AjaxControlToolkit.BehaviorBase);AjaxControlToolkit.PositioningMode = function() {
throw Error.invalidOperation();}
AjaxControlToolkit.PositioningMode.prototype = {
Absolute: 0,
Center: 1,
BottomLeft: 2,
BottomRight: 3,
TopLeft: 4,
TopRight: 5,
Right: 6,
Left: 7
}
AjaxControlToolkit.PositioningMode.registerEnum('AjaxControlToolkit.PositioningMode');
//END AjaxControlToolkit.PopupExtender.PopupBehavior.js
//START AjaxControlToolkit.Common.Threading.js
Type.registerNamespace('AjaxControlToolkit');AjaxControlToolkit.DeferredOperation = function(delay, context, callback) {
this._delay = delay;this._context = context;this._callback = callback;this._completeCallback = null;this._errorCallback = null;this._timer = null;this._callArgs = null;this._isComplete = false;this._completedSynchronously = false;this._asyncResult = null;this._exception = null;this._throwExceptions = true;this._oncomplete$delegate = Function.createDelegate(this, this._oncomplete);this.post = Function.createDelegate(this, this.post);}
AjaxControlToolkit.DeferredOperation.prototype = {
get_isPending : function() { 
return (this._timer != null);},
get_isComplete : function() { 
return this._isComplete;},
get_completedSynchronously : function() {
return this._completedSynchronously;},
get_exception : function() {
return this._exception;},
get_throwExceptions : function() {
return this._throwExceptions;}, 
set_throwExceptions : function(value) {
this._throwExceptions = value;},
get_delay : function() { 
return this._delay;},
set_delay : function(value) { 
this._delay = value;},
post : function(args) {
var ar = [];for (var i = 0;i < arguments.length;i++) {
ar[i] = arguments[i];}
this.beginPost(ar, null, null);},
beginPost : function(args, completeCallback, errorCallback) {
this.cancel();this._callArgs = Array.clone(args || []);this._completeCallback = completeCallback;this._errorCallback = errorCallback;if (this._delay == -1) { 
try {
this._oncomplete();} finally {
this._completedSynchronously = true;}
} else { 
this._timer = setTimeout(this._oncomplete$delegate, this._delay);}
}, 
cancel : function() {
if (this._timer) {
clearTimeout(this._timer);this._timer = null;}
this._callArgs = null;this._isComplete = false;this._asyncResult = null;this._completeCallback = null;this._errorCallback = null;this._exception = null;this._completedSynchronously = false;},
call : function(args) {
var ar = [];for (var i = 0;i < arguments.length;i++) {
ar[i] = arguments[i];}
this.cancel();this._callArgs = ar;this._completeCallback = null;this._errorCallback = null;try {
this._oncomplete();} finally {
this._completedSynchronously = true;}
if (this._exception) {
throw this._exception;}
return this._asyncResult;},
complete : function() {
if (this._timer) {
try {
this._oncomplete();} finally {
this._completedSynchronously = true;}
return this._asyncResult;} else if (this._isComplete) {
return this._asyncResult;}
}, 
_oncomplete : function() {
var args = this._callArgs;var completeCallback = this._completeCallback;var errorCallback = this._errorCallback;this.cancel();try {
if (args) {
this._asyncResult = this._callback.apply(this._context, args);} else {
this._asyncResult = this._callback.call(this._context);}
this._isComplete = true;this._completedSynchronously = false;if (completeCallback) {
completeCallback(this);}
} catch (e) {
this._isComplete = true;this._completedSynchronously = false;this._exception = e;if (errorCallback) {
if (errorCallback(this)) {
return;}
} 
if (this._throwExceptions) {
throw e;}
}
}
}
AjaxControlToolkit.DeferredOperation.registerClass("AjaxControlToolkit.DeferredOperation");
//END AjaxControlToolkit.Common.Threading.js
//START AjaxControlToolkit.Calendar.CalendarBehavior.js
Type.registerNamespace("AjaxControlToolkit");AjaxControlToolkit.CalendarBehavior = function(element) {
AjaxControlToolkit.CalendarBehavior.initializeBase(this, [element]);this._textbox = AjaxControlToolkit.TextBoxWrapper.get_Wrapper(element);this._format = "d";this._cssClass = "ajax__calendar";this._enabled = true;this._animated = true;this._buttonID = null;this._layoutRequested = 0;this._layoutSuspended = false;this._button = null;this._popupMouseDown = false;this._selectedDate = null;this._visibleDate = null;this._todaysDate = null;this._firstDayOfWeek = AjaxControlToolkit.FirstDayOfWeek.Default;this._container = null;this._popupDiv = null;this._header = null;this._prevArrow = null;this._nextArrow = null;this._title = null;this._body = null;this._today = null;this._days = null;this._daysTable = null;this._daysTableHeader = null;this._daysTableHeaderRow = null;this._daysBody = null;this._months = null;this._monthsTable = null;this._monthsBody = null;this._years = null;this._yearsTable = null;this._yearsBody = null;this._popupPosition = AjaxControlToolkit.CalendarPosition.BottomLeft;this._popupBehavior = null;this._modeChangeAnimation = null;this._modeChangeMoveTopOrLeftAnimation = null;this._modeChangeMoveBottomOrRightAnimation = null;this._mode = "days";this._selectedDateChanging = false;this._isOpen = false;this._isAnimating = false;this._width = 170;this._height = 139;this._modes = {"days" : null, "months" : null, "years" : null};this._modeOrder = {"days" : 0, "months" : 1, "years" : 2 };this._hourOffsetForDst = 12;this._blur = new AjaxControlToolkit.DeferredOperation(1, this, this.blur);this._button$delegates = {
click : Function.createDelegate(this, this._button_onclick),
keypress : Function.createDelegate(this, this._button_onkeypress),
blur : Function.createDelegate(this, this._button_onblur)
}
this._element$delegates = {
change : Function.createDelegate(this, this._element_onchange),
keypress : Function.createDelegate(this, this._element_onkeypress),
click : Function.createDelegate(this, this._element_onclick),
focus : Function.createDelegate(this, this._element_onfocus),
blur : Function.createDelegate(this, this._element_onblur)
}
this._popup$delegates = { 
mousedown: Function.createDelegate(this, this._popup_onmousedown),
mouseup: Function.createDelegate(this, this._popup_onmouseup),
drag: Function.createDelegate(this, this._popup_onevent),
dragstart: Function.createDelegate(this, this._popup_onevent),
select: Function.createDelegate(this, this._popup_onevent)
}
this._cell$delegates = {
mouseover : Function.createDelegate(this, this._cell_onmouseover),
mouseout : Function.createDelegate(this, this._cell_onmouseout),
click : Function.createDelegate(this, this._cell_onclick)
}
}
AjaxControlToolkit.CalendarBehavior.prototype = { 
get_animated : function() {
return this._animated;},
set_animated : function(value) {
if (this._animated != value) {
this._animated = value;this.raisePropertyChanged("animated");}
},
get_enabled : function() {
return this._enabled;},
set_enabled : function(value) {
if (this._enabled != value) {
this._enabled = value;this.raisePropertyChanged("enabled");}
},
get_button : function() {
return this._button;},
set_button : function(value) {
if (this._button != value) {
if (this._button && this.get_isInitialized()) {
$common.removeHandlers(this._button, this._button$delegates);}
this._button = value;if (this._button && this.get_isInitialized()) {
$addHandlers(this._button, this._button$delegates);}
this.raisePropertyChanged("button");}
},
get_popupPosition : function() {
return this._popupPosition;},
set_popupPosition : function(value) {
if (this._popupPosition != value) {
this._popupPosition = value;this.raisePropertyChanged('popupPosition');}
},
get_format : function() { 
return this._format;},
set_format : function(value) { 
if (this._format != value) {
this._format = value;this.raisePropertyChanged("format");}
},
get_selectedDate : function() {
if (this._selectedDate == null) {
var value = this._textbox.get_Value();if (value) {
value = this._parseTextValue(value);if (value) {
this._selectedDate = value.getDateOnly();}
}
}
return this._selectedDate;},
set_selectedDate : function(value) {
if(value && (String.isInstanceOfType(value)) && (value.length != 0)) {
value = new Date(value);}
if (value) value = value.getDateOnly();if (this._selectedDate != value) {
this._selectedDate = value;this._selectedDateChanging = true;var text = "";if (value) {
text = value.localeFormat(this._format);}
if (text != this._textbox.get_Value()) {
this._textbox.set_Value(text);this._fireChanged();}
this._selectedDateChanging = false;this.invalidate();this.raisePropertyChanged("selectedDate");}
},
get_visibleDate : function() {
return this._visibleDate;},
set_visibleDate : function(value) {
if (value) value = value.getDateOnly();if (this._visibleDate != value) {
this._switchMonth(value, !this._isOpen);this.raisePropertyChanged("visibleDate");}
},
get_isOpen : function() {
return this._isOpen;},
get_todaysDate : function() {
if (this._todaysDate != null) {
return this._todaysDate;}
return new Date().getDateOnly();},
set_todaysDate : function(value) {
if (value) value = value.getDateOnly();if (this._todaysDate != value) {
this._todaysDate = value;this.invalidate();this.raisePropertyChanged("todaysDate");}
},
get_firstDayOfWeek : function() {
return this._firstDayOfWeek;},
set_firstDayOfWeek : function(value) {
if (this._firstDayOfWeek != value) {
this._firstDayOfWeek = value;this.invalidate();this.raisePropertyChanged("firstDayOfWeek");}
},
get_cssClass : function() {
return this._cssClass;},
set_cssClass : function(value) {
if (this._cssClass != value) {
if (this._cssClass && this.get_isInitialized()) {
Sys.UI.DomElement.removeCssClass(this._container, this._cssClass);}
this._cssClass = value;if (this._cssClass && this.get_isInitialized()) {
Sys.UI.DomElement.addCssClass(this._container, this._cssClass);}
this.raisePropertyChanged("cssClass");}
},
get_todayButton : function() {
return this._today;},
get_dayCell : function(row, col) {
if (this._daysBody) {
return this._daysBody.rows[row].cells[col].firstChild;}
return null;},
add_showing : function(handler) {
this.get_events().addHandler("showing", handler);},
remove_showing : function(handler) {
this.get_events().removeHandler("showing", handler);},
raiseShowing : function(eventArgs) {
var handler = this.get_events().getHandler('showing');if (handler) {
handler(this, eventArgs);}
},
add_shown : function(handler) {
this.get_events().addHandler("shown", handler);},
remove_shown : function(handler) {
this.get_events().removeHandler("shown", handler);},
raiseShown : function() {
var handlers = this.get_events().getHandler("shown");if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
add_hiding : function(handler) {
this.get_events().addHandler("hiding", handler);},
remove_hiding : function(handler) {
this.get_events().removeHandler("hiding", handler);},
raiseHiding : function(eventArgs) {
var handler = this.get_events().getHandler('hiding');if (handler) {
handler(this, eventArgs);}
},
add_hidden : function(handler) {
this.get_events().addHandler("hidden", handler);},
remove_hidden : function(handler) {
this.get_events().removeHandler("hidden", handler);},
raiseHidden : function() {
var handlers = this.get_events().getHandler("hidden");if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
add_dateSelectionChanged : function(handler) {
this.get_events().addHandler("dateSelectionChanged", handler);},
remove_dateSelectionChanged : function(handler) {
this.get_events().removeHandler("dateSelectionChanged", handler);},
raiseDateSelectionChanged : function() {
var handlers = this.get_events().getHandler("dateSelectionChanged");if (handlers) {
handlers(this, Sys.EventArgs.Empty);}
},
initialize : function() {
AjaxControlToolkit.CalendarBehavior.callBaseMethod(this, "initialize");var elt = this.get_element();$addHandlers(elt, this._element$delegates);if (this._button) {
$addHandlers(this._button, this._button$delegates);}
this._modeChangeMoveTopOrLeftAnimation = new AjaxControlToolkit.Animation.LengthAnimation(null, null, null, "style", null, 0, 0, "px");this._modeChangeMoveBottomOrRightAnimation = new AjaxControlToolkit.Animation.LengthAnimation(null, null, null, "style", null, 0, 0, "px");this._modeChangeAnimation = new AjaxControlToolkit.Animation.ParallelAnimation(null, .25, null, [ this._modeChangeMoveTopOrLeftAnimation, this._modeChangeMoveBottomOrRightAnimation ]);var value = this.get_selectedDate();if (value) {
this.set_selectedDate(value);} 
},
dispose : function() {
if (this._popupBehavior) {
this._popupBehavior.dispose();this._popupBehavior = null;}
this._modes = null;this._modeOrder = null;if (this._modeChangeMoveTopOrLeftAnimation) {
this._modeChangeMoveTopOrLeftAnimation.dispose();this._modeChangeMoveTopOrLeftAnimation = null;}
if (this._modeChangeMoveBottomOrRightAnimation) {
this._modeChangeMoveBottomOrRightAnimation.dispose();this._modeChangeMoveBottomOrRightAnimation = null;}
if (this._modeChangeAnimation) {
this._modeChangeAnimation.dispose();this._modeChangeAnimation = null;}
if (this._container) {
if(this._container.parentNode) { 
this._container.parentNode.removeChild(this._container);}
this._container = null;}
if (this._popupDiv) {
$common.removeHandlers(this._popupDiv, this._popup$delegates);this._popupDiv = null;} 
if (this._prevArrow) {
$common.removeHandlers(this._prevArrow, this._cell$delegates);this._prevArrow = null;}
if (this._nextArrow) {
$common.removeHandlers(this._nextArrow, this._cell$delegates);this._nextArrow = null;}
if (this._title) {
$common.removeHandlers(this._title, this._cell$delegates);this._title = null;}
if (this._today) {
$common.removeHandlers(this._today, this._cell$delegates);this._today = null;}
if (this._button) {
$common.removeHandlers(this._button, this._button$delegates);this._button = null;}
if (this._daysBody) {
for (var i = 0;i < this._daysBody.rows.length;i++) {
var row = this._daysBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
$common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);}
}
this._daysBody = null;}
if (this._monthsBody) {
for (var i = 0;i < this._monthsBody.rows.length;i++) {
var row = this._monthsBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
$common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);}
}
this._monthsBody = null;}
if (this._yearsBody) {
for (var i = 0;i < this._yearsBody.rows.length;i++) {
var row = this._yearsBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
$common.removeHandlers(row.cells[j].firstChild, this._cell$delegates);}
}
this._yearsBody = null;} 
var elt = this.get_element();$common.removeHandlers(elt, this._element$delegates);AjaxControlToolkit.CalendarBehavior.callBaseMethod(this, "dispose");},
show : function() {
this._ensureCalendar();if (!this._isOpen) {
var eventArgs = new Sys.CancelEventArgs();this.raiseShowing(eventArgs);if (eventArgs.get_cancel()) {
return;}
this._isOpen = true;this._switchMonth(null, true);this._popupBehavior.show();this.raiseShown();}
}, 
hide : function() {
if (this._isOpen) {
var eventArgs = new Sys.CancelEventArgs();this.raiseHiding(eventArgs);if (eventArgs.get_cancel()) {
return;}
if (this._container) {
this._popupBehavior.hide();this._switchMode("days", true);}
this._isOpen = false;this.raiseHidden();this._popupMouseDown = false;}
},
focus : function() {
if (this._button) {
this._button.focus();} else {
this.get_element().focus();}
},
blur : function(force) {
if (!force && Sys.Browser.agent === Sys.Browser.Opera) {
this._blur.post(true);} else {
if (!this._popupMouseDown) {
this.hide();} 
this._popupMouseDown = false;}
},
suspendLayout : function() {
this._layoutSuspended++;},
resumeLayout : function() {
this._layoutSuspended--;if (this._layoutSuspended <= 0) {
this._layoutSuspended = 0;if (this._layoutRequested) {
this._performLayout();}
}
},
invalidate : function() {
if (this._layoutSuspended > 0) {
this._layoutRequested = true;} else {
this._performLayout();}
},
_buildCalendar : function() {
var elt = this.get_element();var id = this.get_id();this._container = $common.createElementFromTemplate({
nodeName : "div",
properties : { id : id + "_container" },
cssClasses : [this._cssClass]
}, elt.parentNode);this._popupDiv = $common.createElementFromTemplate({ 
nodeName : "div",
events : this._popup$delegates, 
properties : {
id : id + "_popupDiv"
},
cssClasses : ["ajax__calendar_container"], 
visible : false 
}, this._container);},
_buildHeader : function() {
var id = this.get_id();this._header = $common.createElementFromTemplate({ 
nodeName : "div",
properties : { id : id + "_header" },
cssClasses : [ "ajax__calendar_header" ]
}, this._popupDiv);var prevArrowWrapper = $common.createElementFromTemplate({ nodeName : "div" }, this._header);this._prevArrow = $common.createElementFromTemplate({ 
nodeName : "div",
properties : {
id : id + "_prevArrow",
mode : "prev"
},
events : this._cell$delegates,
cssClasses : [ "ajax__calendar_prev" ] 
}, prevArrowWrapper);var nextArrowWrapper = $common.createElementFromTemplate({ nodeName : "div" }, this._header);this._nextArrow = $common.createElementFromTemplate({ 
nodeName : "div",
properties : {
id : id + "_nextArrow",
mode : "next"
},
events : this._cell$delegates, 
cssClasses : [ "ajax__calendar_next" ] 
}, nextArrowWrapper);var titleWrapper = $common.createElementFromTemplate({ nodeName : "div" }, this._header);this._title = $common.createElementFromTemplate({ 
nodeName : "div",
properties : {
id : id + "_title",
mode : "title"
},
events : this._cell$delegates, 
cssClasses : [ "ajax__calendar_title" ] 
}, titleWrapper);},
_buildBody : function() {
this._body = $common.createElementFromTemplate({ 
nodeName : "div",
properties : { id : this.get_id() + "_body" },
cssClasses : [ "ajax__calendar_body" ]
}, this._popupDiv);this._buildDays();this._buildMonths();this._buildYears();},
_buildFooter : function() {
var todayWrapper = $common.createElementFromTemplate({ nodeName : "div" }, this._popupDiv);this._today = $common.createElementFromTemplate({
nodeName : "div",
properties : {
id : this.get_id() + "_today",
mode : "today"
},
events : this._cell$delegates,
cssClasses : [ "ajax__calendar_footer", "ajax__calendar_today" ]
}, todayWrapper);},
_buildDays : function() {
var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;var id = this.get_id();this._days = $common.createElementFromTemplate({ 
nodeName : "div",
properties : { id : id + "_days" },
cssClasses : [ "ajax__calendar_days" ]
}, this._body);this._modes["days"] = this._days;this._daysTable = $common.createElementFromTemplate({ 
nodeName : "table",
properties : {
id : id + "_daysTable",
cellPadding : 0,
cellSpacing : 0,
border : 0,
style : { margin : "auto" }
} 
}, this._days);this._daysTableHeader = $common.createElementFromTemplate({ nodeName : "thead", properties : { id : id + "_daysTableHeader" } }, this._daysTable);this._daysTableHeaderRow = $common.createElementFromTemplate({ nodeName : "tr", properties : { id : id + "_daysTableHeaderRow" } }, this._daysTableHeader);for (var i = 0;i < 7;i++) {
var dayCell = $common.createElementFromTemplate({ nodeName : "td" }, this._daysTableHeaderRow);var dayDiv = $common.createElementFromTemplate({
nodeName : "div",
cssClasses : [ "ajax__calendar_dayname" ]
}, dayCell);}
this._daysBody = $common.createElementFromTemplate({ nodeName: "tbody", properties : { id : id + "_daysBody" } }, this._daysTable);for (var i = 0;i < 6;i++) {
var daysRow = $common.createElementFromTemplate({ nodeName : "tr" }, this._daysBody);for(var j = 0;j < 7;j++) {
var dayCell = $common.createElementFromTemplate({ nodeName : "td" }, daysRow);var dayDiv = $common.createElementFromTemplate({
nodeName : "div",
properties : {
mode : "day",
id : id + "_day_" + i + "_" + j,
innerHTML : "&nbsp;"
},
events : this._cell$delegates,
cssClasses : [ "ajax__calendar_day" ]
}, dayCell);}
}
},
_buildMonths : function() {
var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;var id = this.get_id();this._months = $common.createElementFromTemplate({
nodeName : "div",
properties : { id : id + "_months" },
cssClasses : [ "ajax__calendar_months" ],
visible : false
}, this._body);this._modes["months"] = this._months;this._monthsTable = $common.createElementFromTemplate({
nodeName : "table",
properties : {
id : id + "_monthsTable",
cellPadding : 0,
cellSpacing : 0,
border : 0,
style : { margin : "auto" }
}
}, this._months);this._monthsBody = $common.createElementFromTemplate({ nodeName : "tbody", properties : { id : id + "_monthsBody" } }, this._monthsTable);for (var i = 0;i < 3;i++) {
var monthsRow = $common.createElementFromTemplate({ nodeName : "tr" }, this._monthsBody);for (var j = 0;j < 4;j++) {
var monthCell = $common.createElementFromTemplate({ nodeName : "td" }, monthsRow);var monthDiv = $common.createElementFromTemplate({
nodeName : "div",
properties : {
id : id + "_month_" + i + "_" + j,
mode : "month",
month : (i * 4) + j,
innerHTML : "<br />" + dtf.AbbreviatedMonthNames[(i * 4) + j]
},
events : this._cell$delegates,
cssClasses : [ "ajax__calendar_month" ]
}, monthCell);}
}
},
_buildYears : function() {
var id = this.get_id();this._years = $common.createElementFromTemplate({
nodeName : "div",
properties : { id : id + "_years" },
cssClasses : [ "ajax__calendar_years" ],
visible : false
}, this._body);this._modes["years"] = this._years;this._yearsTable = $common.createElementFromTemplate({
nodeName : "table",
properties : {
id : id + "_yearsTable",
cellPadding : 0,
cellSpacing : 0,
border : 0,
style : { margin : "auto" }
}
}, this._years);this._yearsBody = $common.createElementFromTemplate({ nodeName : "tbody", properties : { id : id + "_yearsBody" } }, this._yearsTable);for (var i = 0;i < 3;i++) {
var yearsRow = $common.createElementFromTemplate({ nodeName : "tr" }, this._yearsBody);for (var j = 0;j < 4;j++) {
var yearCell = $common.createElementFromTemplate({ nodeName : "td" }, yearsRow);var yearDiv = $common.createElementFromTemplate({ 
nodeName : "div", 
properties : { 
id : id + "_year_" + i + "_" + j,
mode : "year",
year : ((i * 4) + j) - 1
},
events : this._cell$delegates,
cssClasses : [ "ajax__calendar_year" ]
}, yearCell);}
}
},
_performLayout : function() {
var elt = this.get_element();if (!elt) return;if (!this.get_isInitialized()) return;if (!this._isOpen) return;var dtf = Sys.CultureInfo.CurrentCulture.dateTimeFormat;var selectedDate = this.get_selectedDate();var visibleDate = this._getEffectiveVisibleDate();var todaysDate = this.get_todaysDate();switch (this._mode) {
case "days":
var firstDayOfWeek = this._getFirstDayOfWeek();var daysToBacktrack = visibleDate.getDay() - firstDayOfWeek;if (daysToBacktrack <= 0)
daysToBacktrack += 7;var startDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), visibleDate.getDate() - daysToBacktrack, this._hourOffsetForDst);var currentDate = startDate;for (var i = 0;i < 7;i++) {
var dayCell = this._daysTableHeaderRow.cells[i].firstChild;if (dayCell.firstChild) {
dayCell.removeChild(dayCell.firstChild);}
dayCell.appendChild(document.createTextNode(dtf.ShortestDayNames[(i + firstDayOfWeek) % 7]));}
for (var week = 0;week < 6;week ++) {
var weekRow = this._daysBody.rows[week];for (var dayOfWeek = 0;dayOfWeek < 7;dayOfWeek++) {
var dayCell = weekRow.cells[dayOfWeek].firstChild;if (dayCell.firstChild) {
dayCell.removeChild(dayCell.firstChild);}
dayCell.appendChild(document.createTextNode(currentDate.getDate()));dayCell.title = currentDate.localeFormat("D");dayCell.date = currentDate;$common.removeCssClasses(dayCell.parentNode, [ "ajax__calendar_other", "ajax__calendar_active" ]);Sys.UI.DomElement.addCssClass(dayCell.parentNode, this._getCssClass(dayCell.date, 'd'));currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, this._hourOffsetForDst);}
}
this._prevArrow.date = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1, this._hourOffsetForDst);this._nextArrow.date = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1, this._hourOffsetForDst);if (this._title.firstChild) {
this._title.removeChild(this._title.firstChild);}
this._title.appendChild(document.createTextNode(visibleDate.localeFormat("MMMM, yyyy")));this._title.date = visibleDate;break;case "months":
for (var i = 0;i < this._monthsBody.rows.length;i++) {
var row = this._monthsBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
var cell = row.cells[j].firstChild;cell.date = new Date(visibleDate.getFullYear(), cell.month, 1, this._hourOffsetForDst);cell.title = cell.date.localeFormat("Y");$common.removeCssClasses(cell.parentNode, [ "ajax__calendar_other", "ajax__calendar_active" ]);Sys.UI.DomElement.addCssClass(cell.parentNode, this._getCssClass(cell.date, 'M'));}
}
if (this._title.firstChild) {
this._title.removeChild(this._title.firstChild);}
this._title.appendChild(document.createTextNode(visibleDate.localeFormat("yyyy")));this._title.date = visibleDate;this._prevArrow.date = new Date(visibleDate.getFullYear() - 1, 0, 1, this._hourOffsetForDst);this._nextArrow.date = new Date(visibleDate.getFullYear() + 1, 0, 1, this._hourOffsetForDst);break;case "years":
var minYear = (Math.floor(visibleDate.getFullYear() / 10) * 10);for (var i = 0;i < this._yearsBody.rows.length;i++) {
var row = this._yearsBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
var cell = row.cells[j].firstChild;cell.date = new Date(minYear + cell.year, 0, 1, this._hourOffsetForDst);if (cell.firstChild) {
cell.removeChild(cell.lastChild);} else {
cell.appendChild(document.createElement("br"));}
cell.appendChild(document.createTextNode(minYear + cell.year));$common.removeCssClasses(cell.parentNode, [ "ajax__calendar_other", "ajax__calendar_active" ]);Sys.UI.DomElement.addCssClass(cell.parentNode, this._getCssClass(cell.date, 'y'));}
}
if (this._title.firstChild) {
this._title.removeChild(this._title.firstChild);}
this._title.appendChild(document.createTextNode(minYear.toString() + "-" + (minYear + 9).toString()));this._title.date = visibleDate;this._prevArrow.date = new Date(minYear - 10, 0, 1, this._hourOffsetForDst);this._nextArrow.date = new Date(minYear + 10, 0, 1, this._hourOffsetForDst);break;}
if (this._today.firstChild) {
this._today.removeChild(this._today.firstChild);}
this._today.appendChild(document.createTextNode(String.format(AjaxControlToolkit.Resources.Calendar_Today, todaysDate.localeFormat("MMMM d, yyyy"))));this._today.date = todaysDate;},
_ensureCalendar : function() {
if (!this._container) {
var elt = this.get_element();this._buildCalendar();this._buildHeader();this._buildBody();this._buildFooter();this._popupBehavior = new $create(AjaxControlToolkit.PopupBehavior, { parentElement : elt }, {}, {}, this._popupDiv);if (this._popupPosition == AjaxControlToolkit.CalendarPosition.TopLeft) {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.TopLeft);} else if (this._popupPosition == AjaxControlToolkit.CalendarPosition.TopRight) {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.TopRight);} else if (this._popupPosition == AjaxControlToolkit.CalendarPosition.BottomRight) {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.BottomRight);} else if (this._popupPosition == AjaxControlToolkit.CalendarPosition.Right) {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.Right);} else if (this._popupPosition == AjaxControlToolkit.CalendarPosition.Left) {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.Left);} else {
this._popupBehavior.set_positioningMode(AjaxControlToolkit.PositioningMode.BottomLeft);}
}
},
_fireChanged : function() {
var elt = this.get_element();if (document.createEventObject) {
elt.fireEvent("onchange");} else if (document.createEvent) {
var e = document.createEvent("HTMLEvents");e.initEvent("change", true, true);elt.dispatchEvent(e);}
},
_switchMonth : function(date, dontAnimate) {
if (this._isAnimating) {
return;}
var visibleDate = this._getEffectiveVisibleDate();if ((date && date.getFullYear() == visibleDate.getFullYear() && date.getMonth() == visibleDate.getMonth())) {
dontAnimate = true;}
if (this._animated && !dontAnimate) {
this._isAnimating = true;var newElement = this._modes[this._mode];var oldElement = newElement.cloneNode(true);this._body.appendChild(oldElement);if (visibleDate > date) {
$common.setLocation(newElement, {x:-162,y:0});$common.setVisible(newElement, true);this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("left");this._modeChangeMoveTopOrLeftAnimation.set_target(newElement);this._modeChangeMoveTopOrLeftAnimation.set_startValue(-this._width);this._modeChangeMoveTopOrLeftAnimation.set_endValue(0);$common.setLocation(oldElement, {x:0,y:0});$common.setVisible(oldElement, true);this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("left");this._modeChangeMoveBottomOrRightAnimation.set_target(oldElement);this._modeChangeMoveBottomOrRightAnimation.set_startValue(0);this._modeChangeMoveBottomOrRightAnimation.set_endValue(this._width);} else {
$common.setLocation(oldElement, {x:0,y:0});$common.setVisible(oldElement, true);this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("left");this._modeChangeMoveTopOrLeftAnimation.set_target(oldElement);this._modeChangeMoveTopOrLeftAnimation.set_endValue(-this._width);this._modeChangeMoveTopOrLeftAnimation.set_startValue(0);$common.setLocation(newElement, {x:162,y:0});$common.setVisible(newElement, true);this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("left");this._modeChangeMoveBottomOrRightAnimation.set_target(newElement);this._modeChangeMoveBottomOrRightAnimation.set_endValue(0);this._modeChangeMoveBottomOrRightAnimation.set_startValue(this._width);}
this._visibleDate = date;this.invalidate();var endHandler = Function.createDelegate(this, function() { 
this._body.removeChild(oldElement);oldElement = null;this._isAnimating = false;this._modeChangeAnimation.remove_ended(endHandler);});this._modeChangeAnimation.add_ended(endHandler);this._modeChangeAnimation.play();} else {
this._visibleDate = date;this.invalidate();}
},
_switchMode : function(mode, dontAnimate) {
if (this._isAnimating || (this._mode == mode)) {
return;}
var moveDown = this._modeOrder[this._mode] < this._modeOrder[mode];var oldElement = this._modes[this._mode];var newElement = this._modes[mode];this._mode = mode;if (this._animated && !dontAnimate) { 
this._isAnimating = true;this.invalidate();if (moveDown) {
$common.setLocation(newElement, {x:0,y:-this._height});$common.setVisible(newElement, true);this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("top");this._modeChangeMoveTopOrLeftAnimation.set_target(newElement);this._modeChangeMoveTopOrLeftAnimation.set_startValue(-this._height);this._modeChangeMoveTopOrLeftAnimation.set_endValue(0);$common.setLocation(oldElement, {x:0,y:0});$common.setVisible(oldElement, true);this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("top");this._modeChangeMoveBottomOrRightAnimation.set_target(oldElement);this._modeChangeMoveBottomOrRightAnimation.set_startValue(0);this._modeChangeMoveBottomOrRightAnimation.set_endValue(this._height);} else {
$common.setLocation(oldElement, {x:0,y:0});$common.setVisible(oldElement, true);this._modeChangeMoveTopOrLeftAnimation.set_propertyKey("top");this._modeChangeMoveTopOrLeftAnimation.set_target(oldElement);this._modeChangeMoveTopOrLeftAnimation.set_endValue(-this._height);this._modeChangeMoveTopOrLeftAnimation.set_startValue(0);$common.setLocation(newElement, {x:0,y:139});$common.setVisible(newElement, true);this._modeChangeMoveBottomOrRightAnimation.set_propertyKey("top");this._modeChangeMoveBottomOrRightAnimation.set_target(newElement);this._modeChangeMoveBottomOrRightAnimation.set_endValue(0);this._modeChangeMoveBottomOrRightAnimation.set_startValue(this._height);}
var endHandler = Function.createDelegate(this, function() { 
this._isAnimating = false;this._modeChangeAnimation.remove_ended(endHandler);});this._modeChangeAnimation.add_ended(endHandler);this._modeChangeAnimation.play();} else {
this._mode = mode;$common.setVisible(oldElement, false);this.invalidate();$common.setVisible(newElement, true);$common.setLocation(newElement, {x:0,y:0});}
},
_isSelected : function(date, part) {
var value = this.get_selectedDate();if (!value) return false;switch (part) {
case 'd':
if (date.getDate() != value.getDate()) return false;case 'M':
if (date.getMonth() != value.getMonth()) return false;case 'y':
if (date.getFullYear() != value.getFullYear()) return false;break;}
return true;},
_isOther : function(date, part) {
var value = this._getEffectiveVisibleDate();switch (part) {
case 'd': 
return (date.getFullYear() != value.getFullYear() || date.getMonth() != value.getMonth());case 'M': 
return false;case 'y': 
var minYear = (Math.floor(value.getFullYear() / 10) * 10);return date.getFullYear() < minYear || (minYear + 10) <= date.getFullYear();}
return false;},
_getCssClass : function(date, part) {
if (this._isSelected(date, part)) {
return "ajax__calendar_active";} else if (this._isOther(date, part)) {
return "ajax__calendar_other";} else {
return "";}
},
_getEffectiveVisibleDate : function() {
var value = this.get_visibleDate();if (value == null) 
value = this.get_selectedDate();if (value == null)
value = this.get_todaysDate();return new Date(value.getFullYear(), value.getMonth(), 1, this._hourOffsetForDst);},
_getFirstDayOfWeek : function() {
if (this.get_firstDayOfWeek() != AjaxControlToolkit.FirstDayOfWeek.Default) {
return this.get_firstDayOfWeek();}
return Sys.CultureInfo.CurrentCulture.dateTimeFormat.FirstDayOfWeek;},
_parseTextValue : function(text) {
var value = null;if(text) {
value = Date.parseLocale(text, this.get_format());}
if(isNaN(value)) {
value = null;}
return value;},
_element_onfocus : function(e) {
if (!this._enabled) return;if (!this._button) {
this.show();this._popupMouseDown = false;}
},
_element_onblur : function(e) {
if (!this._enabled) return;if (!this._button) {
this.blur();}
},
_element_onchange : function(e) {
if (!this._selectedDateChanging) {
var value = this._parseTextValue(this._textbox.get_Value());if (value) value = value.getDateOnly();this._selectedDate = value;if (this._isOpen) {
this._switchMonth(this._selectedDate, this._selectedDate == null);} 
}
},
_element_onkeypress : function(e) {
if (!this._enabled) return;if (!this._button && e.charCode == Sys.UI.Key.esc) {
e.stopPropagation();e.preventDefault();this.hide();}
},
_element_onclick : function(e) {
if (!this._enabled) return;if (!this._button) {
this.show();this._popupMouseDown = false;}
},
_popup_onevent : function(e) {
e.stopPropagation();e.preventDefault();},
_popup_onmousedown : function(e) {
this._popupMouseDown = true;},
_popup_onmouseup : function(e) {
if (Sys.Browser.agent === Sys.Browser.Opera && this._blur.get_isPending()) {
this._blur.cancel();}
this._popupMouseDown = false;this.focus();},
_cell_onmouseover : function(e) {
e.stopPropagation();if (Sys.Browser.agent === Sys.Browser.Safari) {
for (var i = 0;i < this._daysBody.rows.length;i++) {
var row = this._daysBody.rows[i];for (var j = 0;j < row.cells.length;j++) {
Sys.UI.DomElement.removeCssClass(row.cells[j].firstChild.parentNode, "ajax__calendar_hover");}
}
}
var target = e.target;Sys.UI.DomElement.addCssClass(target.parentNode, "ajax__calendar_hover");},
_cell_onmouseout : function(e) {
e.stopPropagation();var target = e.target;Sys.UI.DomElement.removeCssClass(target.parentNode, "ajax__calendar_hover");},
_cell_onclick : function(e) {
e.stopPropagation();e.preventDefault();if (!this._enabled) return;var target = e.target;var visibleDate = this._getEffectiveVisibleDate();Sys.UI.DomElement.removeCssClass(target.parentNode, "ajax__calendar_hover");switch(target.mode) {
case "prev":
case "next":
this._switchMonth(target.date);break;case "title":
switch (this._mode) {
case "days": this._switchMode("months");break;case "months": this._switchMode("years");break;}
break;case "month":
if (target.month == visibleDate.getMonth()) {
this._switchMode("days");} else {
this._visibleDate = target.date;this._switchMode("days");}
break;case "year":
if (target.date.getFullYear() == visibleDate.getFullYear()) {
this._switchMode("months");} else {
this._visibleDate = target.date;this._switchMode("months");}
break;case "day":
this.set_selectedDate(target.date);this._switchMonth(target.date);this._blur.post(true);this.raiseDateSelectionChanged();break;case "today":
this.set_selectedDate(target.date);this._switchMonth(target.date);this._blur.post(true);this.raiseDateSelectionChanged();break;}
},
_button_onclick : function(e) {
e.preventDefault();e.stopPropagation();if (!this._enabled) return;if (!this._isOpen) {
this.show();} else {
this.hide();}
this.focus();this._popupMouseDown = false;},
_button_onblur : function(e) {
if (!this._enabled) return;if (!this._popupMouseDown) {
this.hide();}
this._popupMouseDown = false;},
_button_onkeypress : function(e) {
if (!this._enabled) return;if (e.charCode == Sys.UI.Key.esc) {
e.stopPropagation();e.preventDefault();this.hide();}
this._popupMouseDown = false;}
}
AjaxControlToolkit.CalendarBehavior.registerClass("AjaxControlToolkit.CalendarBehavior", AjaxControlToolkit.BehaviorBase);AjaxControlToolkit.CalendarPosition = function() {
throw Error.invalidOperation();}
AjaxControlToolkit.CalendarPosition.prototype = {
BottomLeft: 0,
BottomRight: 1,
TopLeft: 2,
TopRight: 3,
Right: 4,
Left: 5
}
AjaxControlToolkit.CalendarPosition.registerEnum('AjaxControlToolkit.CalendarPosition');
//END AjaxControlToolkit.Calendar.CalendarBehavior.js
if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();
(function() {var fn = function() {$get('ToolkitScriptManager1_HiddenField').value += ';;AjaxControlToolkit, Version=3.0.20820.16598, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:zh-TW:707835dd-fa4b-41d1-89e7-6df5d518ffb5:e2e86ef9:a9a7729d:9ea3f0e2:9e8e87e9:1df13a87:4c9865be:ba594826:507fcf1b:c7a4182e';Sys.Application.remove_load(fn);};Sys.Application.add_load(fn);})();
