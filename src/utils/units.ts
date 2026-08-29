import { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../types/weather';

export function formatTemperature(
  tempInCelsius: number | undefined | null,
  unit: TemperatureUnit,
  includeSymbol = true
): string {
  if (tempInCelsius === undefined || tempInCelsius === null || isNaN(tempInCelsius)) {
    return '--';
  }
  const val = unit === 'fahrenheit' ? (tempInCelsius * 9) / 5 + 32 : tempInCelsius;
  const rounded = Math.round(val);
  return includeSymbol ? `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}` : `${rounded}°`;
}

export function formatWindSpeed(
  speedInKmh: number | undefined | null,
  unit: TemperatureUnit // when fahrenheit is used, default wind to mph, else km/h
): string {
  if (speedInKmh === undefined || speedInKmh === null || isNaN(speedInKmh)) {
    return '--';
  }
  if (unit === 'fahrenheit') {
    const mph = Math.round(speedInKmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedInKmh)} km/h`;
}

export function formatPrecipitation(
  precipInMm: number | undefined | null,
  unit: TemperatureUnit
): string {
  if (precipInMm === undefined || precipInMm === null || isNaN(precipInMm)) {
    return '0 mm';
  }
  if (unit === 'fahrenheit') {
    const inches = (precipInMm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${precipInMm.toFixed(1)} mm`;
}

export function formatPressure(hPa: number | undefined | null): string {
  if (hPa === undefined || hPa === null || isNaN(hPa)) return '--';
  return `${Math.round(hPa)} hPa`;
}

export function getWindDirectionName(degree: number | undefined | null): string {
  if (degree === undefined || degree === null) return 'N';
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 22.5) % 16;
  return directions[index];
}

export function formatDayName(dateString: string, isToday = false): string {
  if (isToday) return 'Today';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  } catch {
    return dateString;
  }
}

export function formatFullDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatHour(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
    }).format(date);
  } catch {
    return timeStr.slice(11, 16);
  }
}
