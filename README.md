# observablejs
Turn your plain js objects into observable objects


## Usage

```$js
import observe from './lib'

const observable = observe({
    foo: "foo",
    bar: "bar"
})

let observer = (newValue, oldValue) => {
  console.log(`Foo updated with ${newValue} from ${oldValue}`)
}

observable.$observe('foo', observer)

observable.foo = "FOO"
```

This produce the output: `Foo updated with FOO from foo`

## WIP:

- deep observation
