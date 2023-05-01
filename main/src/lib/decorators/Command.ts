import { autoInjectable } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types/index.js";
import { CommandBaseOpts } from "../types/CommandBase.js";

export function Command(options: CommandBaseOpts) {
    return function(target: constructor<unknown>) {
        Reflect.defineMetadata("command:data", options, target);
        return autoInjectable()(target);
    };
}
