export interface FormWrongTypeMessage {
  wrongTypeMessage: string;
}

export interface FormRequiredMessage extends FormWrongTypeMessage {
  requiredMessage: string;
}

export function isFormRequiredMessage(
  messages: FormWrongTypeMessage | FormRequiredMessage,
): messages is FormRequiredMessage {
  return 'requiredMessage' in messages;
}
