/**
 * The narrative layer of a product page: alternating image/copy blocks and a
 * real customer quote, between the spec grids and the cross-sell. Turns the
 * page from a data sheet into a reason to buy.
 */
import { productStories } from '../../data/productStories';

export const ProductStory = ({ productId }: { productId: string }) => {
  const story = productStories[productId];
  if (!story) return null;

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <p className="text-sm font-bold tracking-widest text-gray-500 mb-2">{story.kicker}</p>
        <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto">{story.headline}</h2>
      </div>

      <div className="space-y-12">
        {story.blocks.map((block, i) => (
          <div
            key={block.title}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
              i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <img
              src={block.image}
              alt={block.imageAlt}
              loading="lazy"
              className="w-full aspect-[4/3] rounded-2xl object-cover"
            />
            <div>
              <h3 className="text-2xl font-bold mb-3">{block.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{block.body}</p>
            </div>
          </div>
        ))}
      </div>

      <figure className="mt-14 mx-auto max-w-2xl rounded-2xl bg-gray-50 p-8 text-center">
        <div className="text-yellow-400 text-xl mb-3" aria-label="5 star review">★★★★★</div>
        <blockquote className="text-xl font-medium leading-relaxed">
          &ldquo;{story.quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-sm text-gray-500">
          {story.quote.name} · verified {story.quote.product} owner
        </figcaption>
      </figure>
    </div>
  );
};
