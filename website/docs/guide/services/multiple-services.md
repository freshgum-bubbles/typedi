---
sidebar_position: 3
---

# Multiple Services

In some scenarios, you may want to store multiple instances of a service
in your container.  Using `get` wouldn't accomplish this, as subsequent
calls would provide the same instance.

However, one important feature of TypeDI is its ability to allow you
to store multiple values under one ID. **Let's explore this below with a quick example.**

Let's consider the example of an application which needs to store
information about multiple users.  Some users have different roles,
which we'll also need to represent via individual services.

```ts title="src/user.class.ts"
export class UserService {
    public readonly role = 'user';
    constructor (public name: string) { }
}
```

Now, let's create a `ManagerService` to represent managers.
Managers should have the ability to perform administrative actions, 
so we'll add a `deleteComment` method.

```ts title="src/manager-user.class.ts"
import { User } from './user.class';

export class Manager extends User {
    public readonly role = 'manager';

    constructor (public name: string) {
        super(name);
    }

    deleteComment (commentId: string) {
        // ...
    }
}
```

To store each user, we'd also want a [Token](../tokens/introduction) that we can use to reference them.
Let's do this below.

```ts title="src/app.ts"
import { Container } from '@typed-inject/injector';
import { User } from './user.class';

export const USER = new Token<User>();

const joe = new User("Joe");
const rick = new ManagerUser("Rick");

function addUser (value: User) {
    Container.set({ id: USER, multiple: true, value, dependencies: [ ] });
}

addUser(joe);
addUser(rick);
```

:::note
    
The advantage of this approach is that it's much easier to keep
track of each service instance, as they're all stored in one
container.

:::

You'll notice that while we can *store* individual users,
we can't currently access them. Let's fix that.
```ts title="src/app.ts"
// ...

function getUsers () {
    // highlight-revision-start
    return Container.getMany(USER);
    // highlight-revision-end
}

console.log(getUsers());
// -> [class User, class ManagerUser]
```

There we go! There's a basic example of how to use multiple services in TypeDI.