/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ContainerIdentifier, ContainerInstance } from '../index.mjs';

type MergeID<T extends ContainerInstance, TID extends ContainerIdentifier> = T & { id: TID };

/**
 * A collection of individual containers, where the key is a {@link ContainerIdentifier},
 * and each value is a {@link ContainerInstance}.
 *
 * @remarks
 * This implements stronger typing over traditional {@link Map} types.
 * It ensures that, for each newly-set container, the key is identical to the container's
 * identifier.
 * The same assertion is provided for containers ascertained via {@link ContainerCollection.get | .get}.
 * One further modification is that {@link ContainerCollection.get | .get} may return `undefined`.
 */
export interface ContainerCollection<
  TIdentifierBase extends ContainerIdentifier = ContainerIdentifier,
  TContainer extends ContainerInstance = ContainerInstance,
> extends Map<TIdentifierBase, TContainer> {
  get<TIdentifier extends TIdentifierBase>(id: TIdentifier): undefined | MergeID<TContainer, TIdentifier>;
  set<TIdentifier extends TIdentifierBase>(id: TIdentifier, container: MergeID<TContainer, TIdentifier>): this;
}
