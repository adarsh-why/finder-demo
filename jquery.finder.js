$(document).ready(function () {
	$(finder.activator).click(function() {
		finder.activate();
	});

	$(document).mousedown(function (event) {
		if (event.which === 1) {
			switch ($(event.target).attr('id') || $(event.target).parents().attr('id')) {
				case 'finderClose':
					finder.closeFinder();
					break;
				case 'finderPrev':
					finder.prevResult();
					break;
				case 'finderNext':
					finder.nextResult();
					break;
				default:
					return true;
			}
		}
	});
});

const finder = {
	activator: '[data-finder-activator]',
	content: '[data-finder-content]',
	wrapper: '[data-finder-wrapper]',
	scrollOffset: () => $(finder.wrapper).data('finderScrollOffset'),
	activate: () => {
		if (!$('#finder').length) {
			finder.createFinder();
		}
		setTimeout(function () {
			$('#finder').addClass('active');
			$('#finderInput').focus();
			if ($('#finderInput').val()) {
				finder.findTerm($('#finderInput').val());
			}
			$('#finderInput').on('input', function () {
				finder.findTerm($(this).val());
			});
		}, 50);
	},
	createFinder: () => {
		const finderElem = $('<div />')
			.attr({
				'id': 'finder',
				'class': 'finder'
			})
			.prependTo(finder.wrapper);

		const finderElemContent = $('<div />')
			.attr({
				'id': 'findercontent',
				'class': 'findercontent'
			})
			.appendTo(finderElem);

		const sbLogo = $('<div />')
			.attr({
				'id': 'finderLogo',
				'type': 'div',
				'class': 'finder-logo',
			})
			.appendTo(finderElemContent);

		const searchIcon = $('<div />')
			.attr({
				'id': 'finderSearchIcon',
				'type': 'div',
				'class': 'finder-search-icon',
			})
			.appendTo(finderElemContent);

		const searchText = $('<div />')
			.attr({
				'id': 'finderSearchText',
				'type': 'div',
				'class': 'finder-search-text',
			}).text("Search")
			.appendTo(finderElemContent);

		const input = $('<input oninput="hideElem()"/>')
			.attr({
				'id': 'finderInput',
				'type': 'text',
				'class': 'finder-input',
			})
			.appendTo(finderElemContent);

		const prev = $('<button />')
			.attr({
				'id': 'finderPrev',
				'class': 'btn btn-finder btn-finder-prev',
			})
			.appendTo(finderElemContent);

		const prevIcon = $('<i />')
			.attr({
				'class': 'fas fa-angle-up',
			})
			.appendTo(prev);

		const next = $('<button />')
			.attr({
				'id': 'finderNext',
				'class': 'btn btn-finder btn-finder-next',
			})
			.appendTo(finderElemContent);

		const nextIcon = $('<i />')
			.attr({
				'class': 'fas fa-angle-down',
			})
			.appendTo(next);

		const close = $('<button />')
			.attr({
				'id': 'finderClose',
				'class': 'btn close-btn-finder btn-finder-close',
			})
			.appendTo(finderElemContent);

		const closeIcon = $('<i />')
			.attr({
				'class': 'fas fa-times',
			})
			.appendTo(close);
	},

	closeFinder: () => {
		$('#finder').removeClass('active');
		$(finder.content).unhighlight();
	},

	resultsCount: 0,

	currentResult: 0,

	findTerm: (term) => {
		// highlight results
		$(finder.content).unhighlight();
		$(finder.content).highlight(term);

		// count results
		finder.resultsCount = $('.highlight').length;

		if (finder.resultsCount) {
			// there are results, scroll to first one
			finder.currentResult = 1;
			finder.scrollToCurrent();
		} else {
			// no results
			finder.currentResult = 0;
		}

		// term not found
		if (!finder.resultsCount && term) {
			$('#finderInput').addClass('not-found');
		} else {
			$('#finderInput').removeClass('not-found');
		}

		finder.updateCurrent();
	},

	scrollToCurrent: () => {
		let scrollingElement;

		let i = finder.currentResult - 1;
		$('.highlight').removeClass('active');
		$(`.highlight:eq(${i})`).addClass('active');

		let offsetTop = -100;
		if (finder.scrollOffset() !== null) {
			offsetTop = finder.scrollOffset() * -1;
		}

		$(finder.wrapper).scrollTo('.highlight.active', {
			offset: {
				left: 0,
				top: offsetTop,
			},
		});
	},

	prevResult: () => {
		if (finder.resultsCount) {
			if (finder.currentResult > 1) {
				finder.currentResult--;
			} else {
				finder.currentResult = finder.resultsCount;
			}
			finder.scrollToCurrent();
		}

		finder.updateCurrent();
	},

	nextResult: () => {
		if (finder.resultsCount) {
			if (finder.currentResult < finder.resultsCount) {
				finder.currentResult++;
			} else {
				finder.currentResult = 1;
			}
			finder.scrollToCurrent();
		}

		finder.updateCurrent();
	},

	updateCurrent: () => {
		if ($('#finderInput').val()) {
			if (!$('#finderCount').length) {
				$('.btn-finder').show()
				const countElem = $('<span />')
					.attr({
						'id': 'finderCount',
						'class': 'finder-count',
					})
					.insertAfter('#finderInput');
			}
			setTimeout(function () {
				$('#finderCount').text(finder.currentResult + ' of ' + finder.resultsCount);
			}, 50);
		} else {
			$('.btn-finder').hide()
			$('.finder-search-icon').show();
			$('.finder-search-text').show();
			$('#finderCount').remove();
		}
	},
}

function hideElem() {
	$('.finder-search-icon').hide();
	$('.finder-search-text').hide();
}