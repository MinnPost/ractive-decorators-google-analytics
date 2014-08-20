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
	var googleAnalyticsDecorator = function(node) {
		var i, eventHandler;

		// Make sure events are an array
		if (Object.prototype.toString.call(googleAnalyticsDecorator.events) !== '[object Array]') {
			googleAnalyticsDecorator.events = [googleAnalyticsDecorator.events];
		}

		// Handle event
		eventHandler = function(eName) {
			// Options e parameter is not used
			return function() {
				// If action is auto, then use the name of the event
				if (googleAnalyticsDecorator.action === 'auto') {
					googleAnalyticsDecorator.action = eName;
				}

				if (googleAnalyticsDecorator.isLegacy === true) {
					_gaq.push([
						'_trackEvent',
						googleAnalyticsDecorator.category,
						googleAnalyticsDecorator.action,
						googleAnalyticsDecorator.label,
						googleAnalyticsDecorator.value
					]);
				}
				else {
					ga(
						'send',
						googleAnalyticsDecorator.category,
						googleAnalyticsDecorator.action,
						googleAnalyticsDecorator.label,
						googleAnalyticsDecorator.value
					);
				}
			};
		};

		// Go through all tracked events and add listeners
		for (i = 0; i < googleAnalyticsDecorator.events.length; i++) {
	    node.addEventListener(googleAnalyticsDecorator.events[i],
				eventHandler(googleAnalyticsDecorator.events[i]), false);
		}
	};

	// Default parameters
	googleAnalyticsDecorator.isLegacy = (typeof window._gaq !== 'undefined');
	googleAnalyticsDecorator.events = ['click'];
	googleAnalyticsDecorator.category = 'RactiveEvents';
	googleAnalyticsDecorator.action = 'auto';
	googleAnalyticsDecorator.label = 'element';
	googleAnalyticsDecorator.value = undefined;
	googleAnalyticsDecorator.options = undefined;

	// Add to Ractive
	Ractive.decorators.ga = googleAnalyticsDecorator;

}));
