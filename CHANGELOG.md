## 1.1.0 (Dec 03, 2023)

### @safe-fullpage/core

- `onFullpageStart` , `onFullpageEnd` to let user inject callbacks forth and back.
- created custom event `FullpageEvent` to handle fullpage animation. (Previously, handled by `scroll` event)

### @safe-fullpage/vanilla

- `safe-fullpage-container` is now better useable with properties, not by attribute. (but attribute will have higher precedence, like imitating inline-styling)
  -> What I've thought at the first time was web components would be more pratically used declarativly on html not dynamically created with javascript. I've realized that this was naive idea.

### Upcomings

- useFullpage hook ( gives control to lock or scroll programatically)
- Re-write fullpage core logics based on class (currently, function)
  -> To give controls to user, `safeFullpage` context should have closure to `fullpageFactory`. To do this, think its better to transform functions to class.
