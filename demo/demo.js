(function() {
	'use strict';

	var q, r;

	q = function(selector) {
		return document.querySelector(selector);
	};

	// Make a fake GA object if not there
	if (!window._gaq) {
		window._gaq = [];
		window.ga = function() {
			window._gaq.push(arguments);
		};
		ga('create','UA-XXXXX-X','auto');
		ga('send','pageview');
	}

	// Create basic Ractive view
	r = new Ractive({
		el: '#demo-template-view',
		template: q('#demo-template').innerHTML,
		data: {
			ga: window._gaq
		}
	});

	// Activate prettify.js
	prettyPrint();

}());
