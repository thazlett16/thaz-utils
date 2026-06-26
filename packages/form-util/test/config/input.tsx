import { useFieldContext } from '#src/tanstack-form.config';

export function TestInput() {
  const field = useFieldContext<string>();

  return (
    <input
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => {
        field.handleChange(e.target.value);
      }}
    />
  );
}
