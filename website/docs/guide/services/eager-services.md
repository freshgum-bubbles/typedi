---
sidebar_position: 2
---

# Eager Services

Ordinarily, services aren't created until either:
  - They're explicitly called via `Container.get`, or...
  - A service which *is* called via `Container.get` uses the service as a dependency.
  
Therefore, if you need a way to start a service immediately, TypeDI provides a concept called Eager Services.

:::caution

Eager Services create fragile application code, and should only be used in a few limited scenarios.
If you think you need this feature, consider its application carefully and use it very frugally.

In future, eager services will not be initialised by default without an explicit call to `enableEagerLoading` (see [#17](https://github.com/freshgum-bubbles/typedi/pull/17)).

For more information on why eager services are discouraged, [see the section below on its dangers](#the-dangers-of-eager-true).

:::

## Example

To create a service which is immediately run upon declaration, we can do the following:

```ts title="src/log.service.ts"
import { Service } from '@typed-inject/injector';

@Service({ eager: true }, [ ])
export class LogService {
    constructor () {
        this.log("LogService is ready!");
    }

    public log (message: string) {
        console.log(message);
    }
}
```

Then, once `LogService` is imported, its constructor will immediately run and log the message to the console.


## The Dangers of `eager: true`

If you declare an eager service, the service won't be run until it's been imported by another file.
Therefore, if you forget to import your eager `DatabaseService`, the connection to the database won't
be initialised early on in the application flow.

Another pain-point of eager services is testability: by making side-effects run on import, we
create a dangerous precedent for the API, and overall make it much harder to test.

Consider the following (simplified) example:

```ts title="src/database.service.ts"
import { Service } from '@typed-inject/injector';

@Service({ eager: true }, [ ])
export class DatabaseService {
    constructor () {
        this.connect();
    }

    private connection: Connection;

    private async connect () {
        // Connect to the database here...
    }

    public async getValue (name: string): string {
        return this.connection.getValue(name);
    }
}
```

If we're looking to test our application and replace `DatabaseService` with something else,
how would we import it to get the ID to replace?

Normally, to stub the database connection, you would do something like this:

```ts title="spec/app.service.ts"
import { Service } from '@typed-inject/injector';
import { DatabaseService } from '../src/database.service.ts'; // Oops!

@Service({ id: DatabaseService }, [ ])
export class FakeDatabaseService implements DatabaseService {
    private map = new Map<string, unknown>;

    private async connect () { }

    public async getValue (name: string): string {
        return this.map.get(name);
    }
}

// Test our app...
```

Do you see the issue?  We've imported `DatabaseService` to get its ID (to replace with a stub),
but by doing that, we've created a connection to the database!
This means that, currently, we can't test the application without also creating a wasted database connection.

:::tip

Instead of using eager services, consider creating a root service which runs side effects
such as database initialisation before the rest of the environment is loaded.
This does the same thing without the above disadvantages.

:::
