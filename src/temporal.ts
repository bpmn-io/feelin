import { Temporal } from 'temporal-polyfill';

import { isDateTime, isDuration } from './types.js';

export {
  isDateTime,
  isDuration
};

import { notImplemented } from './utils.js';

export type TemporalDateTime = Temporal.ZonedDateTime;
export type TemporalDuration = Temporal.Duration;

export function ms(temporal) {

  if (isDateTime(temporal)) {
    return temporal.epochMilliseconds;
  }

  if (isDuration(temporal)) {
    return temporal.total({ unit: 'milliseconds' });
  }

  return null;
}

export function duration(opts: string|number) : TemporalDuration {

  if (typeof opts === 'number') {
    return Temporal.Duration.from({ milliseconds: opts });
  }

  return Temporal.Duration.from(opts);
}

export function date(str: string = null, time: string = null, zone: string = null) : TemporalDateTime {

  if (time) {
    if (str) {
      throw new Error('<str> and <time> provided');
    }

    return date(`1900-01-01T${ time }`, null);
  }

  if (typeof str === 'string') {

    if (str.startsWith('-')) {
      throw notImplemented('negative date');
    }

    if (!str.includes('T')) {

      // raw dates are in UTC time zone
      return date(str + 'T00:00:00', null, zone || 'UTC');
    }

    if (str.includes('@')) {

      if (zone) {
        throw new Error('<zone> already provided');
      }

      const [ datePart, zonePart ] = str.split('@');

      return date(datePart, null, zonePart);
    }

    // Parse ISO string with time zone
    const upperStr = str.toUpperCase();
    
    // If zone is provided, append it
    if (zone) {
      // Remove any existing zone info from the string
      const cleanStr = upperStr.replace(/Z$/i, '').replace(/[+-]\d{2}:\d{2}$/, '');
      return Temporal.ZonedDateTime.from(`${cleanStr}[${zone}]`);
    }

    // Try to parse as ZonedDateTime (includes time zone info)
    try {
      return Temporal.ZonedDateTime.from(upperStr);
    } catch {
      // If no time zone info, use UTC
      // Only add 'Z' if not already present
      const withZ = upperStr.endsWith('Z') ? upperStr : upperStr + 'Z';
      return Temporal.Instant.from(withZ).toZonedDateTimeISO('UTC');
    }
  }

  return Temporal.Now.zonedDateTimeISO();
}