/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

/**
 * A re-export of {@link Array.isArray}.
 *
 * This has two benefits:
 *   1. We prevent any unexpected behaviour by assuming the environment is hostile.
 *      By caching the function, we are able to (reasonably) safely assume that we
 *      have attained a copy of it prior to any user-modification.
 *   2. It reduces the final size of the bundle.
 */
export const { isArray } = Array;
