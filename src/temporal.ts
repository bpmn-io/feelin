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

      // raw dates - if no zone specified, use UTC for date() calls
      // but for date and time() calls, zone would be passed explicitly
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
    
    // Check if string already has timezone info
    const hasTimezone = upperStr.includes('@') || upperStr.endsWith('Z') || upperStr.match(/[+-]\d{2}:\d{2}$/);
    
    // If zone is provided AND string doesn't have timezone, apply it
    if (zone && !hasTimezone) {
      // Remove any existing zone info from the string (shouldn't be any)
      const cleanStr = upperStr.replace(/Z$/i, '').replace(/[+-]\d{2}:\d{2}$/, '');
      return Temporal.ZonedDateTime.from(`${cleanStr}[${zone}]`);
    }

    // Handle @ notation for named timezones
    if (upperStr.includes('@')) {
      if (zone) {
        throw new Error('<zone> already provided');
      }

      const [ datePart, zonePart ] = upperStr.split('@');

      return date(datePart, null, zonePart);
    }

    // Try to parse as ZonedDateTime (includes time zone info)
    try {
      return Temporal.ZonedDateTime.from(upperStr);
    } catch {
      // If no time zone info, parse as Instant and convert to timezone
      // Check if already has offset or Z
      if (upperStr.match(/Z$|[+-]\d{2}:\d{2}$/)) {
        // Already has timezone info, parse as Instant and use UTC
        return Temporal.Instant.from(upperStr).toZonedDateTimeISO('UTC');
      } else {
        // No timezone info, add Z and parse with provided zone or UTC
        return Temporal.Instant.from(upperStr + 'Z').toZonedDateTimeISO(zone || 'UTC');
      }
    }
  }

  return Temporal.Now.zonedDateTimeISO();
}