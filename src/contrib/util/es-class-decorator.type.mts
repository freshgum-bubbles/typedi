/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

/**
 * A description of an ES class decorator (as of TypeScript 5.0).
 *
 * @typeParam TSubject - The type of function being decorated.
 * @typeParam TReturn - The return value of the decorator. Defaults to `TSubject | void`.
 */
export type ESClassDecorator<TSubject extends Function, TReturn = TSubject | void> = (
  value: TSubject,
  context: ClassDecoratorContext
) => TReturn;
