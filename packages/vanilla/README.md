# Safe-fullpage

---

Simple library to let you build page with basic fullpage animation easily with fully mobile compatibilty.

For the ones who don't want to read docs but peek the taste of fullpage.

## Introduction

For the **🐖lazy devs🐖**, just remember **ONE THING**

1. only one **FullpageContainer** per page.

Thanks for reading.

## Contribution

Any suggestions and PRs are welcomed.

Just to note, I'm junior developer, so my code might not fit your needs.

So, any of your suggestion or idea or criticizings or any advises would help me a lot.

I'll be glad to hear for it. (If it makes sense, else 👹)

## Installing

For React

```
pnpm install @safe-fullpage/react
```

For vanilla (under development)

```
pnpm install @safe-fullpage/vanilla
```

## Usage

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
