(function() {
	'use strict';

	var q, r;

	q = function(selector) {
		return document.querySelector(selector);
	};

	// Create basic Ractive view
	r = new Ractive({
		el: '#demo-template-view',
		template: q('#demo-template').innerHTML,
		data: {
			ga: []
		}
	});

	// Since GA is usually loaded last, but we want to reference things
	// in our view, we use a timeout (hacky)
	setTimeout(function() {
		r.set('ga', (typeof window._gaq !== 'undefined') ? window._gaq : ga.q);
	}, 1000);

	// Activate prettify.js
	prettyPrint();

}());
