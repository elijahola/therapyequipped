/**
 * Community + education, straight from the brand's own Instagram archive.
 *
 * CommunityGrid: real posts (beach, gym, recovery) linking to the profile —
 * social proof that doubles as a follow funnel. StatStrip: the brand's
 * designed stat cards (student-athlete injury data) reframed as the "why"
 * behind recovery gear. All assets are owned; people appearing consented
 * (paid promo / gift exchange).
 */
import { track } from '../../lib/analytics';

const IG_URL = 'https://www.instagram.com/therapyequipped/';

const photos = [
  { src: '/images/community/beach-neck.jpg', alt: 'Working out the neck after beach volleyball' },
  { src: '/images/ugc/courtside.jpg', alt: 'Courtside recovery after practice' },
  { src: '/images/community/gym-bike.jpg', alt: 'Between sets recovery at the gym' },
  { src: '/images/community/back-work.jpg', alt: 'Deep tissue work on the upper back' },
  { src: '/images/ugc/gym.jpg', alt: 'Forearm relief mid-workout' },
  { src: '/images/community/recover.jpg', alt: 'Recover. Recover. Recover.' },
];

export const CommunityGrid = () => (
  <section className="py-16 md:py-24 bg-gray-50">
    <div className="container-custom">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Join the Community
      </h2>
      <p className="text-gray-600 text-center mb-10">
        Athletes getting equipped, every week on{' '}
        <a
          href={IG_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline"
          onClick={() => track('instagram_click', { from: 'community_grid' })}
        >
          @therapyequipped
        </a>
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {photos.map((p) => (
          <a
            key={p.src}
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('instagram_click', { from: 'community_photo', photo: p.src })}
            className="group relative block aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);

const stats = [
  { src: '/images/stats/stat-90.jpg', alt: '90% of student athletes report sports-related injury' },
  { src: '/images/stats/stat-54.jpg', alt: '54% of student athletes report they have played while injured' },
  { src: '/images/stats/stat-37.jpg', alt: '37% of high school athletes say they have experienced sprains' },
];

export const StatStrip = () => (
  <section className="py-16 md:py-20">
    <div className="container-custom">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Recovery Isn't Optional
      </h2>
      <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
        Most athletes play hurt. The right recovery routine is how you stay in the game.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {stats.map((s) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading="lazy"
            className="w-full rounded-xl shadow-sm"
          />
        ))}
      </div>
    </div>
  </section>
);
