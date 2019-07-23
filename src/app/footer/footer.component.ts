import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: [ './footer.component.scss' ]
})
export class FooterComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
	scrollToTop() {
		this.scroll(0);
	}

	scroll(destination, duration = 500, easing = 'easeInOutQuint', callback?) {
		const easings = {
			easeInOutQuint(t) {
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
			}
		};

		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

		const documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);

		const windowHeight =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.getElementsByTagName('body')[0].clientHeight;

		const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;

		const destinationOffsetToScroll = Math.round(
			documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset
		);

		if ('requestAnimationFrame' in window === false) {
			window.scroll(0, destinationOffsetToScroll);
			if (callback) {
				callback();
			}

			return;
		}

		function scroll() {
			const now = 'now' in window.performance ? performance.now() : new Date().getTime();
			const time = Math.min(1, (now - startTime) / duration);
			const timeFunction = easings[easing](time);
			window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

			if (window.pageYOffset === destinationOffsetToScroll) {
				if (callback) {
					callback();
				}
				return;
			}

			requestAnimationFrame(scroll);
		}

		scroll();
	}
}
