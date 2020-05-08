import observe, {Observable} from "../src/lib";

describe('The library creates', () => {

    type Dummy = {
        foo: string,
        bar: string,
    }

    describe("an observable object from a plain object", () => {

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

        it("it updates his fields when modified", () => {
            observable.foo = "FOO"

            expect(observable.foo).toBe("FOO")
            expect(observable.bar).toBe("bar")
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

    describe("an observable object from an object with functions", () => {

        type DummyWithFunctions = {
            baz: (string) => string
        } & Dummy

        let observable: Observable<DummyWithFunctions> & DummyWithFunctions;

        beforeEach(() => {

            const object: DummyWithFunctions = {
                foo: "foo",
                bar: "bar",
                baz: (value) => value
            }

            observable = observe(object)
        });

        it("it should maintain his functions", () => {
            expect(observable.baz("Hello! Baz.")).toBe("Hello! Baz.")
        });
    });

});
