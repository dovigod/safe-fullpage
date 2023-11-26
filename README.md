# Safe-fullpage

---

Simple library to let you build page with basic fullpage animation easily with fully mobile compatibilty.

For the ones who don't want to read docs but peek the taste of fullpage.

## Note

For the **🐖lazy devs🐖**, just remember **ONE THING**

1. only one **FullpageContainer** per page.

## Contribution

Any suggestions and PRs are welcomed.

Any of your suggestion or idea or criticizings or any advises would help me a lot.

I'll be glad to hear it.

## Installing

React.js

```
pnpm install @safe-fullpage/react
```

Vanilla.js

```
pnpm install @safe-fullpage/vanilla
```

## Usage

### Vanilla

```
/*  index.html */
<body>
    <safe-fullpage-container>
      <safe-fullpage-element>
        <div class="d1"></div>
      </safe-fullpage-element>
      <safe-fullpage-element>
        <div class="d2"></div>
      </safe-fullpage-element>
      <safe-fullpage-element>
        <div class="d3"></div>
      </safe-fullpage-element>
    </safe-fullpage-container>
    <script type="module" src="/src/main.ts"></script>
</body>
```

```
/*  main.ts */
import '@safe-fullpage/vanilla'
```

### React

```
import { FullpageContainer , FullpageElement } from '@safe-fullpage/react'

const Page = () => {

  return (
    <FullpageContainer>
      <FullpageElement>{/* element */}</FullpageElement>
      <FullpageElement>{/* element */}</FullpageElement>
      <FullpageElement>{/* element */}</FullpageElement>
    </FullpageContainer>
  )
}
```

## Interface

#### FullpageContainer

- ###### **enableKeydown**
  **type** : boolean
  
  **default** : false
  
  **description**: enables triggering fullpage animation via keydown

---

- ###### **scrollDelay**
  **type** : number
  
  **default** : 1500
  
  **description**: minimum time interval between each animation

---

- ###### **touchMovementThreshold**
  **type** : number
  
  **default** : 20
  
  **description**: minimum pan movement to trigger animation ( usally for mobile devices )

---

- ###### **duration**
  **type** : number
  
  **default** : 900
  
  **description**: time taken to transition for each animation

---

- ###### **timingMethod**
  **type** : "ease" | "ease-in" | "linear" | "ease-in-out" | "ease-out";
  
  **default** : "ease"
  
  **description**: timing function, which will describe how the transition will be held


---

#### FullpageElement

- ###### **elementType**
  **type** : "content" | "footer;
  
  **default** : "content"
  
  **description**: Describe how scolling should be handled for current element.
  
  _ **content** : Position current element to stick to bottom of viewport
  
  _ **footer** : Position current element to stick to top of viewport
  
  ⚠️Warning⚠️) Do not use 'footer' unless its not literally at the end of FullpageElement List.
  

---

## License

MIT
