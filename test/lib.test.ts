import {Observable} from "../src/observable";
import observe from "../src/lib";

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

        it("it allows fields to be observed", (done) => {
            observable.$observe("foo", (newValue: string) => {
                expect(newValue).toBe("baz")
                done()
            })

            observable.foo = "baz"

        });

        it("it allows observations to stop", () => {
            let newValueHolder = undefined;
            let observation = (newValue: string) => newValueHolder = newValue;
            observable.$observe("foo", observation)

            observable.$stop("foo", observation)
            observable.foo = "baz"

            expect(newValueHolder).toBeUndefined()
        });
    });

    describe("an observable object from an object with functions", () => {

        type DummyWithFunctions = {
            baz: (string: string) => string
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

    describe("an observable object with nested objects", () => {

        type DummyWithNested = {
            nested: Dummy
        } & Dummy

        let observable: Observable<DummyWithNested> & DummyWithNested;

        beforeEach(() => {
            observable = observe({
                foo: "foo",
                bar: "bar",
                nested: {
                    foo: "nested_foo",
                    bar: "nested_bar",
                }
            })
        })

        it("it allows to observe the nested object", (done) => {
            observable.$observe("nested", (newNested: Dummy) => {
                expect(newNested.foo).toBe("new_foo")
                expect(newNested.bar).toBe("new_bar")
                done()
            })

            observable.nested = {
                foo: "new_foo",
                bar: "new_bar",
            }
        });

        xit("it allows to observe the nested object fields", (done) => {
            observable.$observe("nested", (newNested: Dummy) => {
                expect(newNested.foo).toBe("new_foo")
                expect(newNested.bar).toBe("new_bar")
                done()
            })

            // TODO
            // observable.nested.$observe("foo", () => {})
        });
    });

});
