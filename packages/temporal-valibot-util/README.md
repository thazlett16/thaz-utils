# thazstack temporal-valibot-util

Until the Temporal API is available more widely this code relies on the official polyfill as a peerDependency.

The goal of this package is to support valibot by adding support for Temporal. Refer to [valibot](https://valibot.dev/) for documentation on the greater library and ecosystem.

When working with this library you should import and use similar to the base valibot. The convention I use is `* as t` as shown below:

```ts
import * as v from 'valibot';
import * as t from '@thazstack/temporal-valibot-util';

t.instant();
t.instant('Customer Error Message');
```
