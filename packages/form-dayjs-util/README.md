# thazstack form-dayjs-util

Until the Temporal API is available more widely this code relies on the official polyfill as a peerDependency.

This package is an extension of `@thazstack/form-util` that adapts form schemas and hooks for component libraries that work with [Day.js](https://day.js.org/) values (e.g. MUI date pickers). It re-exports everything from `@thazstack/form-util` and extends the schemas to also accept `Dayjs` inputs, and adds `useNormalizeFieldValueDayJS` for converting any supported temporal value into a `Dayjs` for consumption in form components.

## Schemas

All schemas accept `null` (nullable overload) or reject it (required overload). Pass `{ wrongTypeMessage }` for the nullable overload or `{ wrongTypeMessage, requiredMessage }` for the required overload.

### `dayjs(message?)`

Validates that the value is a Day.js instance. This is a low-level schema — most users will use the composite schemas below.

```ts
import { dayjs } from '@thazstack/form-dayjs-util';

const schema = dayjs('Please provide a valid date');
```

### `instant(messages, ...actions)`

Extends `@thazstack/form-util`'s `instant` schema to additionally accept a valid `Dayjs` value, converting it to `Temporal.Instant` via ISO string.

**Accepts:** `null` | `undefined` → `null` | `Temporal.Instant` | `Temporal.ZonedDateTime` → `Temporal.Instant` | `Dayjs` (valid) → `Temporal.Instant`

```ts
import { instant } from '@thazstack/form-dayjs-util';

const nullableSchema = instant({ wrongTypeMessage: 'Invalid date' });
const requiredSchema = instant({ wrongTypeMessage: 'Invalid date', requiredMessage: 'Required' });
```

### `plainDate(messages, ...actions)`

Extends `@thazstack/form-util`'s `plainDate` to additionally accept a valid `Dayjs`, converting it to `Temporal.PlainDate` via year/month/day components.

**Accepts:** `null` | `undefined` → `null` | `Temporal.PlainDate` | `Temporal.ZonedDateTime` | `Temporal.PlainDateTime` | `Dayjs` (valid) → `Temporal.PlainDate`

### `plainDateTime(messages, ...actions)`

Extends `@thazstack/form-util`'s `plainDateTime` to additionally accept a valid `Dayjs`, converting it to `Temporal.PlainDateTime` via date/time components.

**Accepts:** `null` | `undefined` → `null` | `Temporal.PlainDateTime` | `Temporal.ZonedDateTime` | `Dayjs` (valid) → `Temporal.PlainDateTime`

### `plainTime(messages, ...actions)`

Extends `@thazstack/form-util`'s `plainTime` to additionally accept a valid `Dayjs`, converting it to `Temporal.PlainTime` via hour/minute/second/millisecond components.

**Accepts:** `null` | `undefined` → `null` | `Temporal.PlainTime` | `Temporal.ZonedDateTime` | `Temporal.PlainDateTime` | `Dayjs` (valid) → `Temporal.PlainTime`

### `zonedDateTime(options, messages, ...actions)`

Extends `@thazstack/form-util`'s `zonedDateTime` to additionally accept a valid `Dayjs`, converting it to `Temporal.ZonedDateTime` using the provided timezone options.

**Accepts:** `null` | `undefined` → `null` | `Temporal.ZonedDateTime` | `Dayjs` (valid) → `Temporal.ZonedDateTime` (in `options.timeZone`)

```ts
import { zonedDateTime } from '@thazstack/form-dayjs-util';

const schema = zonedDateTime(
  { timeZone: 'America/New_York' },
  { wrongTypeMessage: 'Invalid date', requiredMessage: 'Required' },
);
```

### `string(messages, ...actions)` / `number(messages, ...actions)`

Re-exported from `@thazstack/form-util` unchanged. See that package for details.

## Actions

### `isDayJSValid(message?)`

Valibot validation action that checks `dayjs.isValid()`. Use in a `v.pipe` after a `dayjs()` schema.

### `toDayJS(message?)`

Transforms any supported Temporal type or existing Dayjs to a `Dayjs` value:

- `Temporal.ZonedDateTime` → `dayJS.utc(...).tz(timeZoneId)`
- `Temporal.Instant` → `dayJS.utc(...)`
- `Temporal.PlainDateTime` / `PlainDate` / `PlainTime` → local dayjs via components
- `Dayjs` → pass-through

### `toInstant(message?)` / `toPlainDate(message?)` / `toPlainDateTime(message?)` / `toPlainTime(message?)` / `toZonedDateTime(options, message?)`

Transform a `Dayjs` value to the corresponding `Temporal` type. Pass-through if the value is already the target type.

## Hooks

All hooks must be called inside a field component provided via `form.AppField`.

### `useNormalizeFieldValueDayJS(options: TimeZoneOptions)`

Reads the current field value from context and normalizes it to `Dayjs | null`.

**Accepts:** `Temporal.ZonedDateTime` | `Temporal.Instant` | `Temporal.PlainDateTime` | `Temporal.PlainDate` | `Temporal.PlainTime` | `Dayjs` | `null` | `undefined`

Throws `FormConversionError` if the conversion fails, and `FormTypeError` for any other unexpected type.

```ts
const dayjsValue = useNormalizeFieldValueDayJS({ timeZone: 'America/New_York' });
```

### `useNormalizeFieldValueString()` / `useNormalizeFieldValueNumber()`

Re-exported from `@thazstack/form-util`. See that package for details.

### `useCanSubmit(options?)` / `useFieldErrorMessageList()` / `usePromptUnsaved(options)`

Re-exported from `@thazstack/form-util`. See that package for details.
