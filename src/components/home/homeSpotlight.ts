/**
 * SAFA — Living Home Spotlight & Deterministic Priority Engine
 * Curation engine for Safa's personal living world.
 */

import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';

export type SpotlightTheme = 'CREATIVE' | 'MUSIC' | 'MEMORY' | 'INSPIRATION' | 'MOVEMENT' | 'TRAVEL' | 'REFLECTION';

export interface DailyAtmosphere {
  greetingEn: string;
  greetingFa: string;
  subtitleEn: string;
  subtitleFa: string;
  themeTag: string;
  accentColor: string;
  orbGradient: string;
}

/**
 * Returns contextual atmosphere based on local hour and day of week
 */
export function getLivingAtmosphere(hour: number, dayOfWeek: number): DailyAtmosphere {
  // Time-of-day contextual greeting & light spectrum
  if (hour >= 5 && hour < 12) {
    return {
      greetingEn: 'Good morning, Safa',
      greetingFa: 'صبح به‌خیر، صفای عزیز',
      subtitleEn: 'Today is yours. Breathe, create, and enjoy the quiet moments.',
      subtitleFa: 'امروز برای توئه؛ با آرامش نفس بکش، خلق کن و از لحظه‌هات لذت ببر.',
      themeTag: 'Morning Light',
      accentColor: '#F59E0B', // Warm Amber / Golden Dawn
      orbGradient: 'radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.35), rgba(244, 63, 94, 0.2) 50%, rgba(14, 14, 19, 0.05) 80%)',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greetingEn: 'Good afternoon, Safa',
      greetingFa: 'عصر به‌خیر، صفا جان',
      subtitleEn: 'Flowing through the day with quiet focus and inspiration.',
      subtitleFa: 'جریان آرام روز در آتلیه؛ پر از تمرکز و حس‌های خوب.',
      themeTag: 'Atelier Sunlight',
      accentColor: '#E0E7FF', // Pearl Sapphire
      orbGradient: 'radial-gradient(circle at 45% 45%, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.18) 55%, rgba(14, 14, 19, 0.05) 80%)',
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greetingEn: 'Good evening, Safa',
      greetingFa: 'غروب به‌خیر، صفای عزیز',
      subtitleEn: 'A golden hour for unwinding, good music, and reflections.',
      subtitleFa: 'لحظه‌های طلایی غروب؛ چای گرم، موسیقی خوب و آرامش دل.',
      themeTag: 'Twilight Hour',
      accentColor: '#F43F5E', // Rose Velvet
      orbGradient: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.35), rgba(168, 85, 247, 0.22) 55%, rgba(14, 14, 19, 0.05) 85%)',
    };
  } else {
    return {
      greetingEn: 'Peaceful night, Safa',
      greetingFa: 'شب آرام، صفای جان',
      subtitleEn: 'Rest your thoughts in stillness and peaceful dreams.',
      subtitleFa: 'آرامش شبانه و خلوت دل؛ استراحت کن و به رویاهات فکر کن.',
      themeTag: 'Deep Obsidian',
      accentColor: '#8B5CF6', // Nocturne Violet
      orbGradient: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.28), rgba(59, 130, 246, 0.15) 60%, rgba(14, 14, 19, 0.02) 85%)',
    };
  }
}

/**
 * Deterministic Day-of-Week Spotlight selector:
 * 0 (Sun): Travel & Dreaming
 * 1 (Mon): Creative & Atelier
 * 2 (Tue): Music & Sound
 * 3 (Wed): Memories & Reflections
 * 4 (Thu): Inspiration & Visuals
 * 5 (Fri): Movement & Wellness
 * 6 (Sat): Reading & Culture
 */
export function getDailySpotlightTheme(date: Date): SpotlightTheme {
  const day = date.getDay();
  switch (day) {
    case 1:
      return 'CREATIVE';
    case 2:
      return 'MUSIC';
    case 3:
      return 'MEMORY';
    case 4:
      return 'INSPIRATION';
    case 5:
      return 'MOVEMENT';
    case 6:
      return 'REFLECTION';
    case 0:
    default:
      return 'TRAVEL';
  }
}

/**
 * Curated Intentions / Daily Reflections
 */
export const DAILY_INTENTIONS = [
  {
    textFa: 'امروز لازم نیست همه‌چیز را حل کنی؛ فقط با آرامش قدم بعدی را بردار.',
    textEn: "You don't have to figure everything out today; just take the next quiet step.",
    author: 'صفای درون',
  },
  {
    textFa: 'زیبایی واقعی در سادگی، اصالت و فضایی است که برای نفس کشیدن می‌گذاری.',
    textEn: 'True elegance lies in restraint, authenticity, and space to breathe.',
    author: 'هنر سادگی',
  },
  {
    textFa: 'هر خطی که در آتلیه می‌کشی، بازتابی از دنیای آرام درون توست.',
    textEn: 'Every line drawn in the atelier is a reflection of your serene inner world.',
    author: 'آتلیه صفا',
  },
  {
    textFa: 'لحظه‌ها سریع می‌گذرند؛ آنچه با عشق و حضور لمس شود جاودانه می‌ماند.',
    textEn: 'Moments pass swiftly; what is touched with stillness and love remains forever.',
    author: 'حضور',
  },
  {
    textFa: 'آرامش، غیبت هیاهو نیست؛ حضور صلح‌آمیز در میان هر اتفاقی است.',
    textEn: 'Peace is not the absence of noise, but a composed stillness within.',
    author: 'خلوت دل',
  },
];

/**
 * Curated Daily Fortunes (فال و نجوای صفا)
 */
export const DAILY_FORTUNES = [
  {
    id: 'f-1',
    symbol: '✧',
    categoryFa: 'الهام و آفرینش',
    categoryEn: 'Creative Spark',
    whisperFa: 'امروز یک ایده کوچک و خام می‌تواند سرآغاز زیباترین پروژه فصل باشد. به جرقه‌های ذهنت اعتماد کن.',
    whisperEn: 'A subtle, raw idea today holds the seed for your most stunning project of the season.',
    hafezVerse: 'سحر با باد می‌گفتم حدیث آرزومندی...',
  },
  {
    id: 'f-2',
    symbol: '☾',
    categoryFa: 'آرامش و گره‌گشایی',
    categoryEn: 'Peace & Serenity',
    whisperFa: 'یک دغدغه کهن با آرامشی غیرمنتظره گشوده می‌شود. تنها کاری که باید بکنی رها کردن شتاب است.',
    whisperEn: 'An old tension resolves with unexpected softness. All you need is to release the rush.',
    hafezVerse: 'دوش وقت سحر از غصه نجاتم دادند...',
  },
  {
    id: 'f-3',
    symbol: '✦',
    categoryFa: 'ارتباط و صمیمیت',
    categoryEn: 'Deep Connection',
    whisperFa: 'پیامی یا دیداری کوتاه، روزت را سرشار از نور و گرمای قلبی می‌کند. در را به روی مهر باز بگذار.',
    whisperEn: 'A brief note or encounter will fill your day with warmth and light.',
    hafezVerse: 'مژده ای دل که مسیحا نفسی می‌آید...',
  },
  {
    id: 'f-4',
    symbol: '🪷',
    categoryFa: 'حرکت و بالندگی',
    categoryEn: 'Flow & Momentum',
    whisperFa: 'هر گامی که در سکوت برمی‌داری، پلی محکم به سوی هدف‌های بزرگ‌تر می‌سازد. از مسیر لذت ببر.',
    whisperEn: 'Every quiet step is building an effortless bridge toward your highest dreams.',
    hafezVerse: 'همای گو مفکن سایه شرف هرگز...',
  },
];
