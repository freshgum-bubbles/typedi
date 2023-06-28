---
sidebar_position: 3
sidebar_class_name: sidebar_doc_incomplete
---

# Multiple Services

In some scenarios, you may want to store multiple instances of a service
in your container.  TypeDI caters to this with the `getMany` method, which
we'll explore below.

While we *could* implement this by creating a container
for each page (and that's totally fine!), we can *also* do it
by utilising *multiple services*.

Let's consider the example of a diagnostics collector service.
The application would have multiple instances of this service
for each page of the app.

```ts title="src/diagnostics.service.ts"
import { Container, Service } from '@typed-inject/injector';

interface DiagnosticsEvent {
    name: string;
    value: string;
}

@Service({ multiple: true }, [ ])
export class DiagnosticsService {
    private buffer: DiagnosticsEvent[] = [ ];

    addEvent (name: string, value: string) {
        this.buffer.push({ name, value });
    }

    getAllEvents (): DiagnosticsEvent[] {
        return this.buffer;
    }
}
```

:::note

The advantage of this approach is that it's much easier to keep
track of each service instance, as they're all stored in one
container.

:::

We stated that in each page, we would have multiple diagnostics collectors.
Let's update the diagnostics service with a static method easier to create 
new ones, so we can start using the diagnostics service in other services.


```ts title="app/diagnostics.service.ts"
import { Container } from '@typed-inject/injector';
import { DiagnosticsService } from './diagnostics.service';

@Service()
```