import Util from 'util';

import { SetRequired } from 'type-fest';

export interface TestCase<T> {
  value: T;
  name?: string;
}

type TestCaseWithName<T> = SetRequired<TestCase<T>, 'name'>;

export function addNameToTestCaseIfNotExists<T>(testCase: TestCase<T>): TestCaseWithName<T> {
  return { ...testCase, name: testCase.name ?? Util.inspect(testCase.value) };
}

export function addNamesToTestCasesIfNotExists(cases: TestCase<unknown>[]): TestCaseWithName<unknown>[] {
  return cases.map(addNameToTestCaseIfNotExists);
}
