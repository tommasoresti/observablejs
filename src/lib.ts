import {observable, Observable} from "@/observable";
import {proxify} from "@/proxify";
import {notifier} from "@/notifier";

export default <T extends Object>(data: T): Observable<T> & T => {
    const listeners = new Map()
    return Object.assign(
        proxify(data, notifier(data, listeners)),
        observable(data, listeners)
    );
}


