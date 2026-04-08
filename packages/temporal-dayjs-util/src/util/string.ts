import { dayJS } from '#src/dayjs.config';

export function convertStringToDayJS(input: string) {
    return dayJS(input);
}
