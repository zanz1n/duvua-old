import { singleton } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types/index.js";

export function Service() {
    return function(target: constructor<unknown>) {
        singleton()(target);
    };
}
