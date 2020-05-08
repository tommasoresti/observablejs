import observe, {Observable} from "../src/lib";

type Dummy = {
    foo: string,
    bar: string,
}

describe("The library creates an observable object", () => {

    let observable: Observable<Dummy> & Dummy;

    beforeEach(() => {
        observable = observe({
            foo: "foo",
            bar: "bar"
        })
    });

    it("it exists", () => {
        expect(observable).not.toBeNull()
    });

    it("it allows fields to be observed", () => {
        let newValueHolder = undefined;
        let observation = (newValue) => newValueHolder = newValue;
        observable.$observe("foo", observation)

        observable.foo = "baz"

        expect(newValueHolder).toBe("baz")
    });

    it("it allows observations to stop", () => {
        let newValueHolder = undefined;
        let observation = (newValue) => newValueHolder = newValue;
        observable.$observe("foo", observation)

        observable.$stop("foo", observation)
        observable.foo = "baz"

        expect(newValueHolder).toBeUndefined()
    });

});