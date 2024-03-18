import { ServiceIdentifier, VisitRetrievalOptions } from '../../../../index.mjs';

// todo: add tsdoc to all of this

export interface TreeRetrievalDescriptor {
  /** The time at which the retrieval was performed. */
  readonly time: number;

  /** The identifier being retrieved. */
  readonly identifier: ServiceIdentifier;

  /** The {@link VisitRetrievalOptions} value passed to the visitor. */
  readonly options: VisitRetrievalOptions;
}
