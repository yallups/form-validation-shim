/**
 * form-validation-shim
 * by Shawn Jones <mryallups@gmail.com> https://github.com/yallups
 * V 0.0.1
 */

;(function (document) {
  var eventBinder = Element.prototype.addEventListener || Element.prototype.attachEvent;

  Element.prototype._eventsQueue = {};
  if (Element.prototype.addEventListener) {
    Element.prototype.addEventListener = queuingEventBinder
  } else if (Element.prototype.attachEvent)  {
    Element.prototype.attachEvent = queuingEventBinder;
  }

  function queuingEventBinder(event, cb) {
    if (!this._eventsQueue[event]) this._eventsQueue[event] = [];
    this._eventsQueue[event].push(cb);
    eventBinder.apply(this, arguments);
  }

  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      main();
    }
  }, 10);

  function main() {
    var sheet, forms, i, origSubmit, form;

    sheet = makeSheet();
    sheet.addCSSRule(
      '.invalid input:required:invalid', [
        'border: 1px solid #a94442;',
        'background-color: #f2dede;',
        '-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);',
        'box-shadow: inset 0 1px 1px rgba(0,0,0,.075);'
      ].join('')
    );

    forms = document.querySelectorAll('form');
    for (i = 0; i < forms.length; i++) {
      form = forms.item(i);
      origSubmit = form.onsubmit; // Dont have a way of getting all callback for on submit
      form.onsubmit = null;

      addEventListener(form, 'submit', onSubmit.bind(form, origSubmit));
    }
  }

  function onSubmit (cb, e) {
    if (hasHtml5Validation()) {
      if (!this.checkValidity()) {
        e.preventDefault();
        this.classList.add('invalid');
      } else {
        this.classList.remove('invalid');
        cb && cb();
      }
    }
  }

  // TODO: Use module at https://github.com/yallups/css-sheet-injector.git
  function makeSheet () {
    var sheet;
    var head = document.head;
    var style = document.createElement("style");

    // WebKit hack
    style.appendChild(document.createTextNode(""));

    head.insertBefore(style, head.firstElementChild);

    sheet = style.sheet;
    sheet.addCSSRule = addCSSRule.bind(sheet, sheet);
    return sheet;
  }

  function addCSSRule(sheet, selector, rules, index) {
    if("insertRule" in sheet) {
      sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else if("addRule" in sheet) {
      sheet.addRule(selector, rules, index);
    }
  }

  function hasHtml5Validation () {
    return typeof document.createElement('input').checkValidity === 'function';
  }

  function addEventListener (el, event, cb) {
    if (el.attachEvent) {                  // For IE 8 and earlier versions
      el.attachEvent("on"+event, cb);
    } else if (el.addEventListener) {                    // For all major browsers, except IE 8 and earlier
      el.addEventListener(event, cb);
    }
  }
})(document);
