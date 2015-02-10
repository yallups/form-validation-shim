;(function (document) {
  main();

  function main() {
    var sheet, forms, i, origSubmit, form;

    sheet = makeSheet();
    sheet.addCSSRule('.invalid input:required:invalid', 'background: #BE4C54;');

    forms = document.querySelectorAll('form');
    for (i = 0; i < forms.length; i++) {
      form = forms.item(i);
      origSubmit = form.onsubmit; // Dont have a way of getting all callback for on submit

      addEventListener(form, 'submit', function onSubmit (e) {
        if (hasHtml5Validation()) {
          if (!this.checkValidity()) {
            e.preventDefault();
            this.classList.add('invalid');
          } else {
            this.classList.remove('invalid');
            origSubmit && origSubmit();
          }
        }
      });
    }
  }

  function makeSheet () {
    var sheet;
    var style = document.createElement("style");

    // WebKit hack
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);

    sheet = style.sheet;
    sheet.addCSSRule = addCSSRule.bind(sheet, sheet);
    return style.sheet;
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
    if (el.addEventListener) {                    // For all major browsers, except IE 8 and earlier
      el.addEventListener(event, cb);
    } else if (el.attachEvent) {                  // For IE 8 and earlier versions
      el.attachEvent("on"+event, cb);
    }
  }
})(document);
