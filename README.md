# vmLightbox #

## Minimal image lightbox plugin ##

### Activate With ###

$(document).vmLightbox();

### Or overide defaults with: ###

```
$(document).vmLightbox({
	selector: '.example-element a',
	item_count: true
});
```

### Watches for: ###

* data-target="vm-lightbox" ( default: add this data-attribute to image links if you don't specify a selector )
* data-caption="some caption here"
* data-group="group-these-images-together"

### Note: ###

If you change the markup order for the caption or nav links,
you will need to alter the "update" functions so they know where to place a previously non-existent element.

### Example Usage: ###

```

$(document).vmLightbox({
	selector: '.example-lightbox-image'
});

<a class="example-lightbox-image" href="assets/image1-full.jpg" data-caption="Pretty Photo" data-group="group1">
	<img src="assets/image1-thumbnail.jpg">
</a>

```

### Example Usage with defaults: ###

```

$(document).vmLightbox();

<a href="assets/image1-full.jpg" data-target="vm-lightbox" data-caption="Pretty Photo" data-group="group1">
	<img src="assets/image1-thumbnail.jpg">
</a>

```

### Dependencies ###
jQuery 1.7
