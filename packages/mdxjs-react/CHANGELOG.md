## v0.5.0

* Added a Reset icon button to live code blocks
* `Code` now passes its `theme` to live code blocks
* The live code editor's toggle button has an accessible name and exposes its state
* Tab indents by a configurable number of spaces, using the `indent` prop or an `indent=4` code block meta value. The default is still 2
* Escape leaves the live code editor, with a hint shown while it has focus
* The live code editor is now built on `use-editable` directly, rather than `LiveEditor`
* The live code editor uses a monospaced font

## v0.4.0

* React 19 support
* Using TypeScript
* Unit tests
* Bug fixes

## v0.3.2

* Fixed style issue where heading link was not displayed
* Added CSS transition when headling link is shown/hidden
* Improved focus styles so the outline does not look awful
* Headling links can now be tabbed to

## v0.3.1

* inline code blocks no-longer fail

## v0.3.0

* isolated scopes for live code blocks
* fixed shameful error when using a P within the MDX document

## v0.2.0

* react-live is now a peerDependency
* removed devDependency on sass
* updated to support react-live 4.x
