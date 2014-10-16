/**
 * ractive-decorators-google-analytics
 *
 * A decorator to make it easy to include custom track events
 * for Google Analytics in Ractive.
 *
 * For Event Tracking API, see:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 *
 * Legacy GA API:
 * https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
 */

(function ( global, factory ) {
	'use strict';

	// AMD environment
	if (typeof define === 'function' && define.amd) {
		define(['ractive'], factory );
	}
	// Common JS (i.e. node/browserify)
	else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		factory(require('ractive'));
	}
	// browser global
	else if (global.Ractive) {
		factory(global.Ractive);
	}
	else {
		throw new Error('Could not find Ractive! It must be loaded before the ractive-decorators-google-analytics plugin');
	}

}(typeof window !== 'undefined' ? window : this, function(Ractive) {
	'use strict';

	// Decorator handler.  Optional content parameter is not used
	var googleAnalyticsDecorator = function(node, events, category, action, label, value, testLegacy) {
		var i, eventHandler;

		// Handle defaults
		events = events || googleAnalyticsDecorator.events;
		category = category || googleAnalyticsDecorator.category;
		action = action || googleAnalyticsDecorator.action;
		label = label || googleAnalyticsDecorator.label;
		value = value || googleAnalyticsDecorator.value;
		testLegacy = testLegacy || googleAnalyticsDecorator.testLegacy;

		// Make sure events are an array
		if (Object.prototype.toString.call(events) !== '[object Array]') {
			events = [events];
		}

		// Handle event
		eventHandler = function(eName) {
			// If action is auto, then use the name of the event
			var localAction = (action === 'auto') ? eName : action;

			// Options e parameter is not used
			return function() {

				if (testLegacy()) {
					_gaq.push([
						'_trackEvent',
						category,
						localAction,
						label,
						value
					]);
				}
				else {
					ga(
						'send',
						category,
						localAction,
						label,
						value
					);
				}
			};
		};

		// Go through all tracked events and add listeners
		for (i = 0; i < events.length; i++) {
	    node.addEventListener(events[i], eventHandler(events[i]), false);
		}


	  // Return an object with a `teardown()` method that removes the
	  // event handlers when we no longer need them
	  return {
	    teardown: function() {
				for (i = 0; i < events.length; i++) {
					node.removeEventListener(events[i], eventHandler(events[i]), false);
				}
	    }
	  };
	};

	// Default parameters
	googleAnalyticsDecorator.testLegacy = function() {
		return (typeof window._gaq !== 'undefined');
	}
	googleAnalyticsDecorator.events = ['click'];
	googleAnalyticsDecorator.category = 'RactiveEvents';
	googleAnalyticsDecorator.action = 'auto';
	googleAnalyticsDecorator.label = 'element';
	googleAnalyticsDecorator.value = undefined;
	googleAnalyticsDecorator.options = undefined;

	// Add to Ractive
	Ractive.decorators.ga = googleAnalyticsDecorator;

}));
