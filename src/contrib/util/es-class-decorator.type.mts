/**
 * A description of an ES class decorator (as of TypeScript 5.0).
 *
 * @typeParam TSubject - The type of function being decorated.
 * @typeParam TReturn - The return value of the decorator. Defaults to `TSubject | void`.
 */
export type ESClassDecorator<TSubject extends Function, TReturn = TSubject | void> = (value: TSubject, context: ClassDecoratorContext) => TReturn;