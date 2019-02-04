# stylelint-rtlcss-comments

# Usage

```js
module.exports.plugins = [
	// ...
	'stylelint-rtlcss-comments',
	// ...
];

module.exports.rules = {
	// ...
	'rtlcss-comments/block-directives': /* ... */,
	'rtlcss-comments/bang': /* ... */,
	// ...
}
```

## `rtlcss-comments/block-directives`

Disallows usage of `rtl:begin:` and `rtl:end:` block directives depending on options.

### never

`'rtlcss-comments/block-directives': 'never'`

Disallows all the block directives. Other, non-block, directives are still allowed.

```
.invalid {
	/*rtl:begin:ignore*/
	margin-left: 0;
	padding-left: 0;
	/*rtl:end:ignore*/
}
```

```
.valid {
	/*rtl:ignore*/
	margin-left: 0;
	/*rtl:ignore*/
	padding-left: 0;
}
```

### wraps-properties

`'rtlcss-comments/block-directives': 'wraps-properties'`

Only properties (and comments) are allowed within block directives. Directives should begin and end winthin same context: stylesheet, rule or @-rule.

```
.invalid {
	/*rtl:begin:ignore*/
	left: 0;
}
```

```
/*rtl:begin:ignore*/
.invalid {
	left: 0;
}
/*rtl:end:ignore*/
```

```
.valid {
	/*rtl:begin:ignore*/
	left: 0;
	/*rtl:end:ignore*/
}
```


## `rtlcss-comments/bang`

Requires or disallows `!` in all rtlcss directives.

### always

`'rtlcss-comments/bang': 'always'`

```
.invalid {
	/*rtl:ignore*/
	left: 0;
}
```

```
.valid {
	/*!rtl:ignore*/
	left: 0;
}
```

### never

`'rtlcss-comments/bang': 'never'`

```
.invalid {
	/*!rtl:ignore*/
	left: 0;
}
```

```
.valid {
	/*rtl:ignore*/
	left: 0;
}
```
