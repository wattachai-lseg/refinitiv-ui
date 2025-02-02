<!--
type: page
title: React
location: ./tutorials/react
layout: default
language_tabs: [jsx, tsx]
-->

<div style="float:right">
  <a href="https://reactjs.org/" target="_blank">reactjs.org</a>
</div>

# React Guide

## Try online demo
Playground projects that uses Element Framework. <br>
[React + JavaScript](https://codesandbox.io/s/react-forms-project-mb3nbz).<br>
[React + TypeScript](https://codesandbox.io/p/sandbox/react-17-ts-szvjdv).<br>
[React + TypeScript + @lit-labs/react](https://codesandbox.io/p/sandbox/react-17-ts-lit-lab-ssxlj8).

## Using web components in React

@>This guideline uses create-react-app, React v18.2.0

Web components is framework agnostic and it should work with any frameworks in similar fashion as native HTML elements. However, currently, React has not yet fully supported Web components. You are required to create React Component as a wrapper for your Web Component to pass properties and handle custom events.

@>Experimental version of react is fully support Web Components you can try this yourself with [our live demo](https://codesandbox.io/s/tabbar-router-experimental-dq0npp?file=/src/App.js). To follow the status of it, check out [custom-elements-everywhere.com](https://custom-elements-everywhere.com/#react).

In this tutorial, we will show how to create thin React wrapper components around EF components by using two different approaches. The first approach is to use a utility wrapper tool, this is a preferred option. The second approach is to create the wrapper by yourself.

### Using utility wrapper

To use Web Components in React, you need to handle formatting props, objects and arrays to JSON and registering functions as event listeners.

All can be taken care of by using a wrapper utility, `@lit/react`. It's created by Lit team and it should work with Lit 2, Lit 3 or any Web Component - Lit or not. See more details in [Lit > React](https://lit.dev/docs/frameworks/react/).

From inside your project folder, run:

```sh
npm install @lit/react
```

Import React, utility wrapper and EF Select element class. Then you can use `createComponent` to create React wrapper of the element.

```jsx
import React from 'react';
import { createComponent } from '@lit/react';
import { Select as EfSelect } from '@refinitiv-ui/elements/select';

export const Select = createComponent({
  react: React,
  tagName: 'ef-select',
  elementClass: EfSelect,
  events: {
    onChange: 'value-changed',
  }
});
```

After defining the React component, you can use it just as you would any other React component.

```jsx
const [value, setValue] = useState('');
const data = [{ label: 'Tea', value: 'tea' }, { label: 'Beer', value: 'beer' }];

const handleChange = (event) => {
  setValue(event.detail.value)
}

return (
  <div>
    <Select
      className="my-select"
      data={data}
      value={value}
      onChange={handleChange}
    />
    ...
  </div>
)
```
```tsx
import type { ValueChangedEvent } from "@refinitiv-ui/elements";
import type { SelectData } from "@refinitiv-ui/elements/select";

const [value, setValue] = useState('');
const data: SelectData = [{ label: 'Tea', value: 'tea' }, { label: 'Beer', value: 'beer' }];

const handleChange = (event: Event): void => {
  const { value } = (event as ValueChangedEvent).detail;
  setValue(value);
}

return (
  <div>
    <Select
      className="my-select"
      data={data}
      value={value}
      onChange={handleChange}
    />
    ...
  </div>
)
```

#### Using slot
To render into a named slot, the component will need to be wrapped with a container element that has a slot attribute. See more detail in [Lit > React > Using Slot](https://lit.dev/docs/frameworks/react/#using-slots).

x>```html
x><EfHeader>
x>  <EfButton slot="right">Button</EfButton>
x></EfHeader>
x>```

o>```html
o><EfHeader>
o>  <div slot="right" style="display: content;">
o>    <EfButton>Button</EfButton>
o>  </div>
o></EfHeader>
o>```

### Create a wrapper component

This section will show you how to create a wrapper component by yourself.

Firstly, to create React application we will use [Create React App](https://create-react-app.dev/) CLI tool. Run the following command.

```sh
npx create-react-app my-app
```

At current directory, it will create a new folder called `my-app`. Inside the folder, it will be provided with the initial React project structure and install required dependencies.

<br>

Now, you can install EF components and themes.

```sh
npm install @refinitiv-ui/elements @refinitiv-ui/halo-theme
```

Import elements that you want to use and theme in `src/index.js`. You can also import EF components and themes anywhere in react components but for the simplicity we'll import all at once.

```javascript
import '@refinitiv-ui/elements/select';
import '@refinitiv-ui/elements/panel';

import '@refinitiv-ui/halo-theme/dark/imports/native-elements';
import '@refinitiv-ui/elements/select/themes/halo/dark';
import '@refinitiv-ui/elements/panel/themes/halo/dark';
```

<br>

In our React application, we will need to create React `Select` component that wrap `ef-select` component.
We need to map `ef-select` properties and events to our `Select` component with the `useLayoutEffect` hook (or `componentDidMount` in class component).

```jsx
import React from 'react';

function Select ({ className, value, onChange, data }) {
  const selectRef = React.useRef(); // grab a DOM reference to our `ef-select` 

  React.useLayoutEffect(() => {
    const { current } = ref;

    const handleChange = (event) => {
      onChange(event.detail.value);
    }

    current.data = data;
    current.addEventListener('value-changed', handleChange);

    return () => current.removeEventListener('value-changed', handleChange);

  }, [selectRef, onChange, data]);

  return <ef-select ref={selectRef} class={className} value={value}></ef-select>
}

export default Select;
```
```tsx
import React from 'react';
import type { ValueChangedEvent } from "@refinitiv-ui/elements";
import type { Select as EfSelect } from "@refinitiv-ui/elements/select";

interface SelectProps extends Partial<EfSelect> {
  onChange?: (value: string) => void;
}

function Select ({ className, value, onChange, data = [] }: SelectProps) {
  const selectRef = React.useRef<EfSelect>(); // grab a DOM reference to our `ef-select` 

  React.useLayoutEffect(() => {
    const { current } = selectRef;

    const handleChange = (event: Event) => {
      const { value } = (event as ValueChangedEvent).detail;
      onChange && onChange(value);
    }

    if (current) {
      current.data = data;
      current.addEventListener('value-changed', handleChange);
    }

    return () => {
      if (current) {
        current.removeEventListener("value-changed", handleChange);
      }
    };
  }, [selectRef, onChange, data]);

  return <ef-select ref={selectRef} class={className} value={value}></ef-select>
}

export default Select;
```

One of common confusion when using Web components in React is you need to use `class` instead of `className`.

```html
<ef-select class="my-select"></ef-select>
```

<br>

Now import `Select` component to `src/App.js`.

```jsx
import React, { useState } from 'react';
import Select from './Select';
import './App.css';

function App() {
  const [value, setValue] = useState('');

  const data = [{ label: 'Tea', value: 'tea' }, { label: 'Beer', value: 'beer' }];

  const handleChange = (value) => {
    setValue(value);
  }

  const handleClickReset = () => {
    setValue('');
  }

  return (
    <ef-panel spacing>
      <Select className='my-select' onChange={handleChange} data={data} value={value} />
      <button onClick={handleClickReset}>Reset</button>
    </ef-panel>
  );
}

export default App;
```
```tsx
import React, { useState } from 'react';
import Select from './Select';
import type { SelectData } from "@refinitiv-ui/elements/select";
import './App.css';

function App() {
  const [value, setValue] = useState('');

  const data: SelectData = [{ label: 'Tea', value: 'tea' }, { label: 'Beer', value: 'beer' }];

  const handleChange = (value: string): void => {
    setValue(value);
  }

  const handleClickReset = (): void => {
    setValue('');
  }

  return (
    <ef-panel spacing>
      <Select className='my-select' onChange={handleChange} data={data} value={value} />
      <button onClick={handleClickReset}>Reset</button>
    </ef-panel>
  );
}

export default App;
```

You can style the component in `src/App.css`.

```css
.my-select {
  width: 200px;
  margin-right: 10px;
}
```

Finally, starting your app and it should automatically open `http://localhost:3000/` on your default browser.

```sh
npm start
```

## Testing with Jest

If you use [Create React App](https://create-react-app.dev/), Jest is already included out of the box with useful defaults.

By default, Jest doesn't transform dependencies inside `/node_modules` folder, it will not understand the code and resulting in syntax error. You need to use `transformIgnorePatterns` to allow transpiling EF modules, and other modules if requires [see more](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring).

Additionally, Jest doesn't support package exports feature in package.json yet – this has been supported in new modern bundlers e.g. WebPack 5. As a result, Jest wouldn't be able to find importing modules in your application. You can resolve this by using `moduleNameMapper` in Jest configuration, `package.json`.

```json
  "jest": {
    "transformIgnorePatterns": ["node_modules/(?!@refinitiv-ui)/"],
    "moduleNameMapper": {
      "@refinitiv-ui/((?!.*-theme).*?)/(.*)": "<rootDir>/node_modules/@refinitiv-ui/$1/lib/$2"
    }
  }
```

::footer::
