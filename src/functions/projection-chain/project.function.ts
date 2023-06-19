import { ContainerInstance } from "../../container-instance.class";
import { ResolutionConstraint } from "../../resolution-constraint.const";
import { Transform } from "./transform.function";
import { AnyInjectIdentifier, InjectedFactory } from "../../types/inject-identifier.type";
import { ServiceIdentifier } from "../../types/service-identifier.type";

export function Project<T extends AnyInjectIdentifier> (identifier: ServiceIdentifier, transforms: ResolutionConstraint[]): InjectedFactory<T> {
    return Transform(identifier, container => {
        // todo: inline doc comments & tsdoc for func
        const isSelfDeclared = transforms.includes(ResolutionConstraint.Self);
        const isSkipSelfDeclared = transforms.includes(ResolutionConstraint.SkipSelf);
        const isOptionalDeclared = transforms.includes(ResolutionConstraint.Optional);
        const isManyDeclared = transforms.includes(ResolutionConstraint.Many);
        const isRecursiveDeclared = transforms.includes(ResolutionConstraint.Recursive);

        if (isSelfDeclared && isSkipSelfDeclared) {
            throw new Error('SkipSelf() and Self() cannot be declared in the same projection chain.');
        }

        let subjectContainer: ContainerInstance = container;

        if (isSkipSelfDeclared) {
            if (!container.parent) {
                throw new Error('SkipSelf() was declared, but the current container lacks a parent container.');
            }

            subjectContainer = container.parent;
        }

        if (isManyDeclared) {
            return subjectContainer[isOptionalDeclared ? 'getManyOrNull' : 'getMany'](identifier, isRecursiveDeclared);
        } else {
            return subjectContainer[isOptionalDeclared ? 'getOrNull' : 'get'](identifier, isRecursiveDeclared);
        }
    });
}