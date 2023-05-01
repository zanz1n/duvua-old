import { autoInjectable } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types/index.js";
import { EventBaseOpts } from "../types/EventBase.js";

export function Event(options: EventBaseOpts) {
    return function(target: constructor<unknown>) {
        Reflect.defineMetadata("event:data", options, target);
        return autoInjectable()(target);
    };
}
