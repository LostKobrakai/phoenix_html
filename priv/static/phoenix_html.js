"use strict";

(function() {
  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  function handleLinkClick(link) {
    var phoenixLinkEvent = document.createEvent('Event');
    phoenixLinkEvent.initEvent('phoenix.link', true, true);
		var cancelled = !link.dispatchEvent(phoenixLinkEvent);
		
		if(cancelled) {
			return;
		}

    var to = link.getAttribute("data-to"),
        method = buildHiddenInput("_method", link.getAttribute("data-method")),
        csrf = buildHiddenInput("_csrf_token", link.getAttribute("data-csrf")),
        form = document.createElement("form"),
        target = link.getAttribute("target");

    form.method = (link.getAttribute("data-method") === "get") ? "get" : "post";
    form.action = to;
    form.style.display = "hidden";

    if (target) form.target = target;

    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    form.submit();
  }

  window.addEventListener("click", function(e) {
    var element = e.target;

    while (element && element.getAttribute) {
      if(element.getAttribute("data-method")) {
        handleLinkClick(element);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);
  
  window.addEventListener('phoenix.link', function (e) {
    var message = e.target.getAttribute("data-confirm");
    if(message && !window.confirm(message)) {
      e.preventDefault();
    }
	}, false);
})();
