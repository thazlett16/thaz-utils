import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

function configureDayJSPlugins() {
    dayjs.extend(objectSupport);
    dayjs.extend(timezone);
    dayjs.extend(utc);

    return dayjs;
}

export const dayJS = configureDayJSPlugins();
