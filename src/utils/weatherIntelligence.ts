import {
  ActivityScore,
  CurrentWeatherRaw,
  DailyWeatherRaw,
  HourlyWeatherRaw,
  WeatherCodeInfo,
  WeatherInsight,
  WeatherIntelligenceData,
} from '../types/weather';
import { getWeatherCodeInfo } from './wmoCodes';

// Calculate Dew Point from Celsius temperature and Relative Humidity (%)
export function calculateDewPoint(tempC: number, rh: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(rh / 100);
  return Number(((b * alpha) / (a - alpha)).toFixed(1));
}

// Describe humidity comfort level based on dew point
export function getDewPointDescription(dewPointC: number): { label: string; airFeel: string } {
  if (dewPointC < 10) {
    return { label: 'Dry & Crisp', airFeel: 'Very comfortable, brisk air with low humidity' };
  } else if (dewPointC <= 15) {
    return { label: 'Comfortable', airFeel: 'Ideal human comfort level, pleasantly dry' };
  } else if (dewPointC <= 18) {
    return { label: 'Pleasant', airFeel: 'Slightly perceptible moisture, generally pleasant' };
  } else if (dewPointC <= 21) {
    return { label: 'Humid', airFeel: 'Sticky and muggy, sweat evaporates slowly' };
  } else if (dewPointC <= 24) {
    return { label: 'Very Humid', airFeel: 'Oppressive moisture, heavy and warm atmosphere' };
  } else {
    return { label: 'Extremely Muggy', airFeel: 'Severe discomfort, potential heat stress risk' };
  }
}

export function generateWeatherIntelligence(
  current: CurrentWeatherRaw,
  hourly: HourlyWeatherRaw,
  daily: DailyWeatherRaw
): WeatherIntelligenceData {
  const codeInfo: WeatherCodeInfo = getWeatherCodeInfo(current.weather_code);
  const tempC = current.temperature_2m;
  const apparentC = current.apparent_temperature;
  const windKmh = current.wind_speed_10m;
  const uv = current.uv_index;
  const rain = current.precipitation;
  const humidity = current.relative_humidity_2m;

  const dewPoint = calculateDewPoint(tempC, humidity);
  const comfort = getDewPointDescription(dewPoint);

  // 1. Warnings and Action Badges
  const warnings: WeatherInsight[] = [];

  // Precipitation / Umbrella check
  const maxRainChanceToday = daily.precipitation_probability_max?.[0] ?? 0;
  const rainSumToday = daily.precipitation_sum?.[0] ?? 0;
  const isRainingNow = rain > 0.1 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(current.weather_code);
  const isSnowingNow = [71, 73, 75, 77, 85, 86].includes(current.weather_code);

  if (isRainingNow) {
    warnings.push({
      id: 'rain-alert',
      type: 'umbrella',
      title: 'Umbrella Essential',
      message: 'Active precipitation detected. Carry a sturdy umbrella and water-resistant coat.',
      badge: 'Active Rain',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: 'Umbrella',
    });
  } else if (maxRainChanceToday >= 50 || rainSumToday > 2) {
    warnings.push({
      id: 'rain-risk',
      type: 'umbrella',
      title: 'Rain Likely Later',
      message: `There is a ${maxRainChanceToday}% probability of precipitation today. Keep an umbrella handy.`,
      badge: `${maxRainChanceToday}% Chance`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: 'Umbrella',
    });
  } else if (isSnowingNow) {
    warnings.push({
      id: 'snow-alert',
      type: 'umbrella',
      title: 'Winter Snowfall Warning',
      message: 'Snow is falling. Wear insulated waterproof boots and watch for slick ground.',
      badge: 'Snow Alert',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: 'Snowflake',
    });
  }

  // UV Alert
  const maxUvToday = daily.uv_index_max?.[0] ?? uv;
  if (maxUvToday >= 8) {
    warnings.push({
      id: 'uv-extreme',
      type: 'uv',
      title: 'Extreme UV Radiation',
      message: `Peak UV is ${maxUvToday.toFixed(1)}. High risk of sunburn in under 15 mins. Apply SPF 50+, sunglasses, and seek midday shade.`,
      badge: `UV ${maxUvToday.toFixed(0)} Extreme`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: 'SunDim',
    });
  } else if (maxUvToday >= 6) {
    warnings.push({
      id: 'uv-high',
      type: 'uv',
      title: 'High UV Index',
      message: `Peak UV is ${maxUvToday.toFixed(1)}. Wear UV-rated sunglasses, apply SPF 30+ sunscreen, and wear a hat outdoors.`,
      badge: `UV ${maxUvToday.toFixed(0)} High`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: 'Sun',
    });
  } else if (maxUvToday >= 3) {
    warnings.push({
      id: 'uv-moderate',
      type: 'uv',
      title: 'Moderate UV Exposure',
      message: `UV level is ${maxUvToday.toFixed(1)}. Sun protection advised if staying outdoors for prolonged periods.`,
      badge: `UV ${maxUvToday.toFixed(0)} Moderate`,
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      icon: 'SunMedium',
    });
  }

  // Wind Advisory
  if (windKmh >= 45 || current.wind_gusts_10m >= 60) {
    warnings.push({
      id: 'wind-gale',
      type: 'wind',
      title: 'High Wind Warning',
      message: `Gusts up to ${Math.round(current.wind_gusts_10m || windKmh)} km/h. Secure loose outdoor objects and exercise caution while driving.`,
      badge: 'High Gusts',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      icon: 'Wind',
    });
  } else if (windKmh >= 30) {
    warnings.push({
      id: 'wind-breezy',
      type: 'wind',
      title: 'Breezy Conditions',
      message: `Sustained winds of ${Math.round(windKmh)} km/h. A windbreaker jacket is recommended.`,
      badge: 'Breezy',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      icon: 'Wind',
    });
  }

  // Severe Thunderstorm Alert
  if ([95, 96, 99].includes(current.weather_code)) {
    warnings.push({
      id: 'thunderstorm-severe',
      type: 'outdoor',
      title: 'Active Thunderstorm Alert',
      message: 'Lightning and storm turbulence present. Stay indoors and away from open elevated fields.',
      badge: 'Storm Warning',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: 'Zap',
    });
  }

  // 2. Clothing & Gear Advisory
  let layers = '';
  let footwear = '';
  const accessories: string[] = [];

  if (apparentC <= 0) {
    layers = 'Heavy thermal base layer, thick fleece/wool sweater, and insulated windproof winter coat.';
    footwear = 'Insulated waterproof winter boots with high traction.';
    accessories.push('Thermal Beanie', 'Insulated Gloves', 'Wool Scarf', 'Lip Balm');
  } else if (apparentC <= 10) {
    layers = 'Long-sleeve shirt paired with a warm jacket, coat, or layered knitwear.';
    footwear = 'Enclosed leather shoes or warm sneakers.';
    accessories.push('Light Scarf', 'Light Gloves for morning/evening');
  } else if (apparentC <= 18) {
    layers = 'Breathable light shirt or tee with a light jacket, cardigan, or denim layer.';
    footwear = 'Comfortable sneakers, casual shoes, or loafers.';
    accessories.push('Light Layer / Hoodie');
  } else if (apparentC <= 26) {
    layers = 'Lightweight breathable cotton or linen clothing, t-shirts, or short-sleeve tops.';
    footwear = 'Breathable lightweight sneakers, loafers, or open footwear.';
    if (uv >= 3) accessories.push('Sunglasses', 'Sunscreen SPF 30+');
  } else {
    layers = 'Ultralight, moisture-wicking loose apparel in light colors to reflect solar heat.';
    footwear = 'Well-ventilated running shoes or breathable sandals.';
    accessories.push('UV Sunglasses', 'Sun Hat / Cap', 'Sunscreen SPF 50+', 'Water Bottle');
  }

  if (isRainingNow || maxRainChanceToday > 40) {
    footwear = footwear + ' (waterproof recommended)';
    accessories.unshift('Compact Umbrella');
  }

  // 3. Activity Suitability Scoring (0-100)
  const calculateActivityScores = (): ActivityScore[] => {
    // Helper scoring functions
    const rainPenalty = isRainingNow ? 50 : maxRainChanceToday > 50 ? 30 : maxRainChanceToday > 20 ? 15 : 0;
    const windPenalty = Math.max(0, (windKmh - 20) * 1.8);
    
    // Running / Jogging
    let runScore = 100;
    if (apparentC < 5) runScore -= (5 - apparentC) * 4;
    else if (apparentC > 24) runScore -= (apparentC - 24) * 4;
    runScore -= rainPenalty * 1.1;
    runScore -= windPenalty * 0.8;
    if (humidity > 80 && tempC > 22) runScore -= 15;
    runScore = Math.max(10, Math.min(100, Math.round(runScore)));

    // Cycling
    let bikeScore = 100;
    if (apparentC < 6) bikeScore -= (6 - apparentC) * 3.5;
    else if (apparentC > 28) bikeScore -= (apparentC - 28) * 3.5;
    bikeScore -= windPenalty * 1.5; // Wind severely affects cycling
    bikeScore -= rainPenalty * 1.4; // Wet roads are hazardous
    bikeScore = Math.max(10, Math.min(100, Math.round(bikeScore)));

    // Outdoor Dining
    let diningScore = 100;
    if (apparentC < 16) diningScore -= (16 - apparentC) * 6;
    else if (apparentC > 30) diningScore -= (apparentC - 30) * 5;
    diningScore -= rainPenalty * 1.8;
    diningScore -= windPenalty * 1.2;
    diningScore = Math.max(10, Math.min(100, Math.round(diningScore)));

    // Hiking / Nature Trails
    let hikeScore = 100;
    if (apparentC < 4) hikeScore -= (4 - apparentC) * 4;
    else if (apparentC > 29) hikeScore -= (apparentC - 29) * 4;
    hikeScore -= rainPenalty * 1.2;
    hikeScore -= windPenalty * 0.9;
    if ([45, 48].includes(current.weather_code)) hikeScore -= 20; // fog
    hikeScore = Math.max(10, Math.min(100, Math.round(hikeScore)));

    // Outdoor Photography / Sightseeing
    let photoScore = 100;
    if (isRainingNow || isSnowingNow) photoScore -= 45;
    if ([0, 1, 2].includes(current.weather_code)) photoScore += 5; // Golden hour / nice sky
    if (current.weather_code === 3) photoScore -= 10; // Overcast flat lighting
    if (current.weather_code === 45) photoScore += 5; // Foggy moody shots
    if (windKmh > 35) photoScore -= 20;
    photoScore = Math.max(15, Math.min(100, Math.round(photoScore)));

    // Stargazing / Night Walks
    let starScore = 100;
    const cloudCover = current.cloud_cover ?? 50;
    starScore -= cloudCover * 0.8; // clouds ruin stargazing
    if (apparentC < 2) starScore -= 15;
    if (rainPenalty > 0) starScore -= 40;
    starScore = Math.max(10, Math.min(100, Math.round(starScore)));

    const getRating = (score: number): { rating: 'Optimal' | 'Good' | 'Fair' | 'Poor'; color: string } => {
      if (score >= 80) return { rating: 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      if (score >= 65) return { rating: 'Good', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      if (score >= 45) return { rating: 'Fair', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      return { rating: 'Poor', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    };

    return [
      {
        id: 'running',
        name: 'Running & Cardio',
        icon: 'Footprints',
        score: runScore,
        ...getRating(runScore),
        summary: runScore >= 75 ? 'Excellent temperature for endurance running' : runScore >= 50 ? 'Moderate conditions; pace yourself' : 'Challenging conditions outdoors',
        tips: apparentC > 22 ? 'Hydrate frequently and wear breathable fabrics.' : apparentC < 8 ? 'Warm up thoroughly and wear wind protection.' : 'Ideal conditions for your personal best!',
        colorClass: getRating(runScore).color,
      },
      {
        id: 'cycling',
        name: 'Cycling & Commuting',
        icon: 'Bike',
        score: bikeScore,
        ...getRating(bikeScore),
        summary: bikeScore >= 75 ? 'Clean roads and favorable wind resistance' : bikeScore >= 50 ? 'Breezy or damp roads; ride attentively' : 'Poor cycling conditions today',
        tips: windKmh > 25 ? 'Expect headwind gusts on open routes.' : isRainingNow ? 'Braking distances increase on wet asphalt.' : 'Great day for commuting or trail riding.',
        colorClass: getRating(bikeScore).color,
      },
      {
        id: 'dining',
        name: 'Outdoor Patio Dining',
        icon: 'Utensils',
        score: diningScore,
        ...getRating(diningScore),
        summary: diningScore >= 75 ? 'Pleasant patio and rooftop dining weather' : diningScore >= 50 ? 'Comfortable with outdoor heaters or shade' : 'Better to dine inside today',
        tips: apparentC < 18 ? 'Choose a heated or sheltered terrace.' : apparentC > 28 ? 'Look for shaded patio seating with mist fans.' : 'Prime weather for al fresco dining!',
        colorClass: getRating(diningScore).color,
      },
      {
        id: 'hiking',
        name: 'Hiking & Walking',
        icon: 'Mountain',
        score: hikeScore,
        ...getRating(hikeScore),
        summary: hikeScore >= 75 ? 'Superb trail visibility and comfortable pace' : hikeScore >= 50 ? 'Decent hiking; check trail dampness' : 'Muddy or harsh trails expected',
        tips: maxRainChanceToday > 30 ? 'Pack a rain shell in your backpack.' : 'Carry sufficient water and sunscreen.',
        colorClass: getRating(hikeScore).color,
      },
      {
        id: 'photography',
        name: 'Photography & Tours',
        icon: 'Camera',
        score: photoScore,
        ...getRating(photoScore),
        summary: photoScore >= 75 ? 'Great natural illumination and scenic skies' : photoScore >= 50 ? 'Soft diffuse lighting for portraits' : 'Low contrast or damp lens risk',
        tips: codeInfo.category === 'clear' ? 'Catch the golden hour near sunrise or sunset.' : 'Overcast skies provide soft shadow-free lighting.',
        colorClass: getRating(photoScore).color,
      },
      {
        id: 'stargazing',
        name: 'Stargazing / Nightwalk',
        icon: 'Sparkles',
        score: starScore,
        ...getRating(starScore),
        summary: starScore >= 75 ? 'Clear night skies with high stellar visibility' : starScore >= 50 ? 'Partial cloud cover passing through' : 'Dense clouds obscuring celestial views',
        tips: cloudCover < 20 ? 'Ideal night to spot planets and constellations!' : 'Check satellite cloud feed before setting up telescope.',
        colorClass: getRating(starScore).color,
      },
    ];
  };

  // 4. Best Outdoor Window Analysis
  let bestWindow: { start: string; end: string; reason: string } | null = null;
  if (hourly && hourly.time && hourly.time.length >= 12) {
    const now = new Date();
    // find upcoming 16 daylight or immediate hours
    const candidateHours: { time: string; score: number }[] = [];
    
    for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
      const timeStr = hourly.time[i];
      const t = new Date(timeStr);
      if (t < now && t.getHours() !== now.getHours()) continue;

      const hourTemp = hourly.temperature_2m[i];
      const hourRainProb = hourly.precipitation_probability?.[i] ?? 0;
      const hourWind = hourly.wind_speed_10m?.[i] ?? 10;
      const isDay = hourly.is_day?.[i] ?? 1;

      // evaluate hour suitability
      let hScore = 100;
      if (hourTemp < 10) hScore -= (10 - hourTemp) * 3;
      if (hourTemp > 28) hScore -= (hourTemp - 28) * 3;
      hScore -= hourRainProb * 0.8;
      hScore -= Math.max(0, hourWind - 20) * 1.5;
      if (isDay === 0) hScore -= 10;

      candidateHours.push({ time: timeStr, score: hScore });
    }

    if (candidateHours.length >= 2) {
      // Find 3 consecutive best hours
      let bestSum = -999;
      let bestStartIndex = 0;
      for (let i = 0; i <= candidateHours.length - 2; i++) {
        const windowSum = candidateHours[i].score + candidateHours[i + 1].score;
        if (windowSum > bestSum) {
          bestSum = windowSum;
          bestStartIndex = i;
        }
      }

      const startHour = new Date(candidateHours[bestStartIndex].time);
      const endHour = new Date(candidateHours[Math.min(candidateHours.length - 1, bestStartIndex + 2)].time);

      const formatTimeOnly = (d: Date) =>
        new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true }).format(d);

      bestWindow = {
        start: formatTimeOnly(startHour),
        end: formatTimeOnly(endHour),
        reason: 'Lowest rain risk, moderate thermal comfort, and favorable wind conditions.',
      };
    }
  }

  // General human summary
  let generalSummary = `${codeInfo.label} with ${Math.round(tempC)}°C (feels like ${Math.round(apparentC)}°C). `;
  if (isRainingNow) {
    generalSummary += 'Active rain is falling. ';
  } else if (maxRainChanceToday > 50) {
    generalSummary += `Rain is likely later today (${maxRainChanceToday}% peak probability). `;
  } else {
    generalSummary += 'Dry conditions expected throughout the day. ';
  }

  if (windKmh > 30) {
    generalSummary += `Expect breezy winds up to ${Math.round(windKmh)} km/h.`;
  } else if (maxUvToday >= 6) {
    generalSummary += `High UV levels peak around midday.`;
  } else {
    generalSummary += `Gentle breeze and good overall visibility.`;
  }

  return {
    generalSummary,
    comfortIndex: {
      label: comfort.label,
      score: Math.max(10, Math.min(100, Math.round(100 - Math.abs(dewPoint - 12) * 5))),
      dewPoint,
      airFeel: comfort.airFeel,
    },
    clothingAdvice: {
      layers,
      footwear,
      accessories,
    },
    warnings,
    activityScores: calculateActivityScores(),
    bestOutdoorHours: bestWindow,
  };
}
