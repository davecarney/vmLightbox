/*
* vmLightbox() 1.3.4
*
* Copyright 2017
*
* By Dave Carney, https://vehiclemedia.com/
* Minimal image lightbox plugin
* works in all modern browsers including IE 11+
* 
* 	activate with:
* 		$(document).vmLightbox();
*
* 	or overide defaults with:
* 		$(document).vmLightbox({
*			selector: '.example-element a',
*			item_count: true
* 		});
*
* 	watches for:
* 		data-target="vm-lightbox" 	(default: add this data-attribute to image links if you don't specify a selector)
* 		data-caption="some caption here"
* 		data-group="group-these-images-together"
*
* 	note: if you change the markup order for the caption or nav links,
* 		you will need to alter the "update" functions so they know where to place a previously non-existent element
*
*/

(function ( $ ) {
	$.fn.vmLightbox = function(options) {

		// icons
		var close_icon = '<svg id="vm-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.41 31.41"><line x1="0.71" y1="0.71" x2="0.71" y2="0.71" style="stroke-miterlimit:10"/><line x1="0.71" y1="0.71" x2="30.71" y2="30.71" style="stroke-miterlimit:10;"/><line x1="30.71" y1="0.71" x2="0.71" y2="30.71" style="stroke-miterlimit:10;"/></svg>';
		var chevron_icon = '<svg id="vm-chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.62 66.41"><polyline points="33.91 0.71 1.41 33.21 33.91 65.71" style="stroke-miterlimit:10;"/></svg>';
		var spinner = '<svg id="vm-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28.26"><circle cx="3.93" cy="14.88" r="3.93" style="fill:#fff"/><circle cx="7.39" cy="7.41" r="3.53" transform="translate(-3.07 6.52) rotate(-45)" style="fill:#fff;opacity:0.875"/><circle cx="15.73" cy="3.08" r="3.08" style="fill:#fff;opacity:0.75"/><circle cx="24.07" cy="7.41" r="2.64" transform="translate(1.81 18.32) rotate(-45)" style="fill:#fff;opacity:0.625"/><circle cx="27.53" cy="14.88" r="2.47" style="fill:#fff;opacity:0.5"/><circle cx="24.07" cy="24.09" r="1.98" transform="translate(-9.98 23.21) rotate(-45)" style="fill:#fff;opacity:0.375"/><circle cx="15.73" cy="26.67" r="1.58" style="fill:#fff;opacity:0.25"/><circle cx="7.39" cy="24.09" r="1.32" transform="translate(-14.87 11.41) rotate(-45)" style="fill:#fff;opacity:0.125"/></svg>';

		// set defaults
		options = $.extend({
					selector: 			'a[data-target="vm-lightbox"]',
					prev_link_class: 	'prev-nav',
					prev_link_text: 	'<span class="vm-chevron-left">' + chevron_icon + '</span>',
					next_link_class: 	'next-nav',
					next_link_text: 	'<span class="vm-chevron-right">' + chevron_icon + '</span>',
					single: 			false, 		// overide to true to prevent grouping
					item_count: 		false, 		// overide to true to display image count
					close_text: 		close_icon + '<span class="sr-only">Close Lightbox</span>' // overide to change the 'X'

		}, options );

		// define image
		function get_image(item) {
			var index = $(item).index(options.selector);
			var hold_image = {
					href: 			$(item).attr('href'),
					caption: 		$(item).data('caption'),
					prev_index: 	index - 1,
					next_index: 	index + 1,
					prev_href: 		$(document).find(options.selector).eq(index - 1).attr('href'),
					next_href: 		$(document).find(options.selector).eq(index + 1).attr('href'),
					total_items: 	$(document).find(options.selector).length
				};
			function this_image() {
				return hold_image;
			}
			return this_image;
		}

		// remove empty data-group and empty data-caption attributes
		$('*[data-group=""]').removeAttr('data-group');
		$('*[data-caption=""]').removeAttr('data-caption');

		// check for the existence of a data-group
		var grouping = false;
		if ($('*[data-group]').length > 0) {
			grouping = true;
			var original_selector = options.selector;
		}

		// build loading element
		function img_loading() {
			return '<div class="vm-loading">' + spinner + '</div>';
		}

		// build image count
		function image_count(item) {
			if (item.total_items > 1) {
				return '<p class="vm-lightbox-image-count"><span>' + item.next_index + '</span> of ' + item.total_items + '</p>';				
			} else {
				return '';
			}
		}

		// build the caption if needed
		function build_caption(item) {
			if (item !== undefined) {
				return caption(item);	
			} else {
				return '';
			}
		}

		// define caption
		function caption(item) {
			return '<p class="vm-lightbox-caption">' + item + '</p>';
		}

		// build prev item if needed
		function build_prev_nav(item) {
			if (item.prev_index >= 0) {
				return nav_link(options.prev_link_class, item.prev_href, options.prev_link_text);
			} else {
				return '';
			}
		}

		// build next item if needed
		function build_next_nav(item) {
			if (item.next_href !== undefined) {
				return nav_link(options.next_link_class, item.next_href, options.next_link_text);
			} else {
				return '';
			}
		}

		// define navigation link
		function nav_link(link_class, nav_href, link_text) {
			return '<a class="vm-lightbox-nav ' + link_class + '" href="' + nav_href + '">' + link_text + '</a>';
		}

		// set image height
		function set_image_height() {

			// container height minus all other elements equals maximum allowable image height
			var hold_image_height = $('#vm-lightbox').height() - $('.vm-lightbox-info').outerHeight();
			function this_image_height() {
				$('.vm-lightbox-img').css('max-height', hold_image_height);
			}
			this_image_height();
		}

		// set the image
		function set_image(item) {
			set_image_height();
			var this_img = new Image();
				this_img.onload = function() {
					$('.vm-loading').fadeOut(250, function() {
						$('.vm-lightbox-img').animate({
							opacity: 1
						}, 400);
					});
				};
				this_img.src = item;
				$('.vm-lightbox-img').attr('src', this_img.src);
		}

		// update the caption
		function update_caption(item) {
			var existing = $('.vm-lightbox-caption');
			if (item.caption !== undefined) {
				if (existing.length > 0) {
					existing.text(item.caption);
				} else {
					$('.vm-lightbox-info').append(build_caption(item.caption));
				}
			} else {
				existing.remove();
				return '';
			}
		}

		// update the prev item if needed
		function update_prev_nav(item) {
			var existing_prev = $('.' + options.prev_link_class);
			var existing_next = $('.' + options.next_link_class);
			if (item.prev_index >= 0) {
				if (existing_prev.length > 0) {
					existing_prev.attr('href', item.prev_href);
				} else {
					existing_next.before(nav_link(options.prev_link_class, item.prev_href, options.prev_link_text));
				}
			} else {
				existing_prev.remove();
			}
		}

		// update the next item if needed
		function update_next_nav(item) {
			var existing_prev = $('.' + options.prev_link_class);
			var existing_next = $('.' + options.next_link_class);
			if (item.next_href === undefined) {
				existing_next.remove();
			} else {
				if (existing_next.length > 0) {
					existing_next.attr('href', item.next_href);
				} else {
					existing_prev.after(nav_link(options.next_link_class, item.next_href, options.next_link_text));
				}
			}
		}

		// update info elements
		function update_info(item) {
			$('.vm-lightbox-image-count span').text(item.next_index);
			update_prev_nav(item);
			update_next_nav(item);
			update_caption(item);
			function reset_image() {
				set_image(item.href);				
			}
			return reset_image();
		}

		// resize the lightbox on window resize
		$(window).resize(function() {
			
			clearTimeout($.data(this, 'resizeTimer'));
			$.data(this, 'resizeTimer', setTimeout(set_image_height, 500));

		});

		// initialize lightbox
		$(document).on('click', options.selector, function(e) {

			// stop hyperlink and build "loading" element
			e.preventDefault();
			$('body').append(img_loading());

			// change the selector to filter/restrict grouped items
			if (grouping) {
				if ($(this).data('group')) {
					options.selector += '[data-group="' + $(this).data('group') + '"]';
				} else {
					options.selector += ':not([data-group])';
				}
			}

			// set 'image'
			var image = get_image(this);

			// make sure lightbox doesn't exist already
			if ($('#vm-lightbox').length === 0) {

				// Create markup for lightbox window
				var lightbox = '<div id="vm-lightbox" style="opacity: 0;">' +
									'<div class="vm-lightbox-container">' +
										'<div class="vm-lightbox-img-container">' +
											'<a class="vm-lightbox-close" title="Close">' + options.close_text + '</a>' +
											'<img class="vm-lightbox-img" src="" style="opacity: 0;">' +
										'</div> <!-- .vm-lightbox-img-container -->' +
										'<div class="vm-lightbox-info">';
											if (options.item_count) {
												lightbox += image_count(image());
											}
											if (!options.single) {
												lightbox += build_prev_nav(image()) +
															build_next_nav(image());
											}
											lightbox += build_caption(image().caption);
										lightbox += '</div> <!-- .vm-lightbox-info -->' +
									'</div>' +
								'</div>';

				// insert lightbox markup into page
				// fade it in
				// set the image height
				$(lightbox).appendTo('body').fadeTo(250, 1,
					set_image(image().href)
				);

			}
		});

		// update lightbox upon navigation click
		$(document).on('click touchend onpointerup', 'a.vm-lightbox-nav', function(e) {

			e.preventDefault();
			$('.vm-lightbox-img').css('opacity', '0');
			$('.vm-loading').show();

			var new_href = $(this).attr('href');
			var find_image = $(document).find(options.selector + '[href="' + new_href + '"]');
			
			var new_image = get_image(find_image);

			update_info(new_image());
		});

		// Close the lightbox
		$(document).on('click', '.vm-lightbox-close', function() {
			$('#vm-lightbox').fadeOut(250, function() {
				$('.vm-lightbox-img').attr('src', '');
				$('#vm-lightbox, .vm-loading').remove();
			});

			// reset selector if there were grouped items
			if (grouping) {
				options.selector = original_selector;
			}
		});

		// Check if you are clicking one of the elements, if not close the lightbox
		$(document).on('click touchend onpointerup', '#vm-lightbox', function(e) {
			e.preventDefault();
			var class_list = ['vm-lightbox-img','vm-lightbox-image-count','vm-lightbox-caption'];
			if (class_list.indexOf($(e.target).attr('class')) >= 0) {
				return;
			} else if ($(e.target).closest('a.vm-lightbox-nav').is('.vm-lightbox-nav')) {
				return;
			} else {
				$('#vm-lightbox').fadeOut(250, function() {
					$('#vm-lightbox, .vm-loading').remove();
				});
				if (grouping) {
					options.selector = original_selector;
				}
			}
		});

	};
}( jQuery ));

