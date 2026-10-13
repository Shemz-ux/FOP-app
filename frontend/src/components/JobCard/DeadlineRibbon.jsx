import React from 'react';
import { Calendar, CalendarSync } from 'lucide-react';
import { DEADLINE_LEVELS, DEADLINE_TONES } from './jobCard.config';

/**
 * The pill in the top corner of a job card that says how long is left to apply.
 *
 * A job with no deadline shows a rolling pill; the ribbon is only dropped when
 * a deadline was supplied that could not be read.
 *
 * @param {{ status: ReturnType<import('./deadline.utils').getDeadlineStatus> }} props
 */
export default function DeadlineRibbon({ status }) {
  if (!status) return null;

  const { level, label, title, srLabel, isClosed } = status;
  const isUrgent = level === DEADLINE_LEVELS.URGENT;
  const isRolling = level === DEADLINE_LEVELS.ROLLING;
  const Icon = isRolling ? CalendarSync : Calendar;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${DEADLINE_TONES[level]}`}
      title={title}
    >
      {isUrgent ? (
        // The pulse is what catches the eye when scanning a grid of cards
        <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 animate-ping motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      ) : (
        <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      )}
      <span className={isClosed ? 'line-through' : undefined} aria-hidden="true">
        {label}
      </span>
      <span className="sr-only">{srLabel}</span>
    </span>
  );
}
