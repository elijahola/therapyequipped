/**
 * "Real athletes. Real recovery." — the brand's own footage doing the selling.
 *
 * Assets that were sitting in Drive/Downloads doing nothing: the produced
 * commercial (web-compressed), a customer's review video, and real customer
 * photos from courts, gyms, and living rooms. Videos are click-to-play with
 * poster frames so the section costs nothing until someone engages.
 */
import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { track } from '../../lib/analytics';

const VideoCard = ({
  src,
  poster,
  label,
  tall,
}: {
  src: string;
  poster: string;
  label: string;
  tall?: boolean;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    ref.current?.play();
    track('video_played', { video: src });
  };

  return (
    <div
      className={`relative h-full overflow-hidden rounded-xl bg-black ${tall ? 'row-span-2' : ''}`}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          onClick={start}
          aria-label={`Play: ${label}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 transition hover:bg-black/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="ml-1 h-7 w-7 text-brand-black" fill="currentColor" />
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">
            {label}
          </span>
        </button>
      )}
    </div>
  );
};

export const SocialProof = () => (
  <section className="py-16 md:py-24">
    <div className="container-custom">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Real Athletes. Real Recovery.
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        From the court to the gym to game day — see how athletes get equipped.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4">
        {/* The commercial anchors the grid */}
        <div className="col-span-2 row-span-2">
          <VideoCard
            src="/videos/te-commercial.mp4"
            poster="/videos/te-commercial-poster.jpg"
            label="Watch: Get Equipped"
            tall
          />
        </div>

        <VideoCard
          src="/videos/lillian-review.mp4"
          poster="/videos/lillian-poster.jpg"
          label="Why I love my TEgun"
          tall
        />

        <img
          src="/images/ugc/courtside.jpg"
          alt="Athlete using the TEgun courtside after practice"
          className="h-full w-full rounded-xl object-cover"
          loading="lazy"
        />
        <img
          src="/images/ugc/gym.jpg"
          alt="Customer working out a forearm with the TEgun at the gym"
          className="h-full w-full rounded-xl object-cover"
          loading="lazy"
        />
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Photos and videos from real Therapy Equipped customers and partner athletes.
      </p>
    </div>
  </section>
);
