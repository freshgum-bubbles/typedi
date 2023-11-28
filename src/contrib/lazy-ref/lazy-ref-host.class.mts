import { ContainerInstance, ResolutionConstraintFlag, ServiceIdentifier, ServiceNotFoundError } from '../../index.mjs';
import { InferServiceType } from '../../types/infer-service-type.type.mjs';
import { RefHost } from '../util/types/ref-host.class.mjs';

export class LazyRefHost<
  TIdentifier extends ServiceIdentifier,
  TInstance = InferServiceType<TIdentifier>,
> extends RefHost<TIdentifier, TInstance> {
  // See [RefHost] for documentation:
  protected readonly id: TIdentifier;
  protected readonly container: ContainerInstance;
  protected readonly constraints: number;

  public constructor(id: TIdentifier, container: ContainerInstance, constraints: number) {
    super();

    this.id = id;
    this.container = container;
    this.constraints = constraints;

    const status = this.getIDStatus();

    /**
     * Like in {@link TransientRefHost}, we do a preliminary check to make sure
     * the identifier exists before we successfully instantiate the host.
     */
    if (!status) {
      throw new ServiceNotFoundError(id);
    }
  }

  public create(): TInstance {
    /** Ensure the {@link Optional} flag is not present in the constraints mask. */
    return this.resolve(this.constraints & ~ResolutionConstraintFlag.Optional);
  }

  public createOrNull(): TInstance | null {
    return this.resolve(ResolutionConstraintFlag.Optional);
  }
}
