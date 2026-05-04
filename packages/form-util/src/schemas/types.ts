/** Messages used when a form field value has an unrecognised type. */
export interface FormWrongTypeMessage {
  /** Error message shown when the input does not match any accepted type. */
  wrongTypeMessage: string;
}

/** Messages used when a form field is required but empty or absent. */
export interface FormRequiredMessage extends FormWrongTypeMessage {
  /** Error message shown when the field is required but the value is empty or resolves to `null`. */
  requiredMessage: string;
}

export function isFormRequiredMessage(
  messages: FormWrongTypeMessage | FormRequiredMessage,
): messages is FormRequiredMessage {
  return 'requiredMessage' in messages;
}
