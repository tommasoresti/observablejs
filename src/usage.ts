import observe from './lib'

const observable = observe({
    foo: "foo",
    bar: "bar"
})

let observer = (newValue: string, oldValue: string) => console.log(`Foo updated with ${newValue} from ${oldValue}`);

observable.$observe('foo', observer)

observable.foo = "FOO"

