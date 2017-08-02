# Simmerplate

A "good enough" UI baseline so you can focus on development. It's not quite a boilerplate.

[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE.md)
[![NPM Information](https://img.shields.io/npm/v/simmerplate.svg)](https://www.npmjs.com/package/simmerplate)
[![Change Log](https://img.shields.io/badge/changelog-md-blue.svg)](CHANGELOG.md)

--------------------------------------

## Installation

### NPM

```
npm install --save simmerplate

```

If you've got CSS and font loading set up in your project (from something like `create-react-app`, eg.) you can simply include it.

```
import 'simmerplate';
```

#### Variants

Simmerplate comes in a serif and sans-serif version. The default import is for sans. If you want to use the serif font version, you can pull it in like so:

```
import 'simmerplate/css/simmerplate-serif.css';
```

**Good ol' Copy/Paste or Download**

You can manually grab the latest CSS and font files as handy archives [here](https://github.com/phillipluther/simmerplate/tree/master/downloads).


## Demo

... coming soon ...


## About the Project

Rendered browser defaults futz with my chi. They're awful. CSS normalizers improve things but don't look great. CSS frameworks come with a ton of baggage you often don't need.

Simmerplate is a drop-in CSS file to get initial formatting out of the way.

### Simmerplate Is

Simmerplate is an approximation of designed typography and UI polish. Under the hood, it's an extended version of Nicolas Gallagher's stellar [normalize.css](https://github.com/necolas/normalize.css/) project.

In addition to browser normalization it also provides sane spacing and layout tweaks to make your text look good'ish. You'll get:

* All the sweetness from normalize.css, plus
* Solid-looking typography with good vertical rhythm
* Better-than-default styling for form elements
* A sound starting point for creating your own typography styles; it's non-specific and easy to override
* A no-worries, "fine for now" development baseline so you can focus on heavy-lifting, not finessing text and form inputs


### Simmerplate is Not

Simmerplate is not an assertion of perfect text flow. If you dig how it looks, roll with it. If not, style over it or scrap it altogether down the way.

It's also not a full theme or CSS framework. It doesn't include a grid. It also contains no Javascript so it relies on what browsers are able to process purely via CSS. Simmerplate merely tries to whip the browser default UI into better shape.


## Contributing

Simmerplate is a fledgling project. To contribute, just [open a pull request](https://github.com/phillipluther/simmerplate/pulls) or [log an issue](https://github.com/phillipluther/simmerplate/issues) on GitHub.
