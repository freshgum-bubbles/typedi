import { ContainerInstance, ResolutionConstraintFlag, ServiceIdentifier, ServiceNotFoundError } from '../../index.mjs';
import { InferServiceType } from '../../types/infer-service-type.type.mjs';
import { RefHost } from '../util/types/ref-host.class.mjs';

export type LazyRefFactory<TIdentifier extends ServiceIdentifier> = () => TIdentifier;

export class LazyRefHost<
  TIdentifier extends ServiceIdentifier,
  TInstance = InferServiceType<TIdentifier>,
> extends RefHost<TIdentifier, TInstance> {
  // See [RefHost] for documentation:
  protected get id(): TIdentifier {
    return this.getID();
  }

  protected readonly container: ContainerInstance;
  protected readonly constraints: number;
  protected readonly getID: LazyRefFactory<TIdentifier>;

  public constructor(getID: LazyRefFactory<TIdentifier>, container: ContainerInstance, constraints: number) {
    super();

    /**
     * Note to self:
     *   We can't perform any sort of checks here, as we're not yet
     *   able to access the identifier (it'll probably return `undefined`).
     *   We just have to assume `getID` does what it says it does.
     */
    this.getID = getID;
    this.container = container;
    this.constraints = constraints;
  }

  public create(): TInstance {
    /** Ensure the {@link Optional} flag is not present in the constraints mask. */
    return this.resolve(this.constraints & ~ResolutionConstraintFlag.Optional);
  }

  public createOrNull(): TInstance | null {
    return this.resolve(ResolutionConstraintFlag.Optional);
  }
}
