import { dayJS } from '#src/dayjs.config';

export function convertDateToDayJS(input: Date) {
    return dayJS(input);
}
