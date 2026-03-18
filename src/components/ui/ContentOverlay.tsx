'use client'

import type { ContentItem } from '@/types'

interface ContentOverlayProps {
  content: ContentItem | null | undefined
  allZoneContent: ContentItem[]
  onClose: () => void
  onSelectItem: (id: string) => void
}

export default function ContentOverlay({
  content,
  allZoneContent,
  onClose,
  onSelectItem,
}: ContentOverlayProps) {
  if (!content) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto overlay-scroll"
        style={{
          background: 'rgba(6, 6, 6, 0.95)',
          borderLeft: '1px solid rgba(201, 168, 76, 0.2)',
          animation: 'slideIn 0.3s ease-out forwards',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: '#f0ead8',
            border: '1px solid rgba(201, 168, 76, 0.2)',
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6 pt-16">
          {/* Zone badge */}
          <div
            className="inline-block px-3 py-1 text-xs uppercase tracking-widest mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              color: '#c9a84c',
            }}
          >
            {content.zoneId.replace(/_/g, ' ')}
          </div>

          {/* Title */}
          <h2
            className="text-3xl mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: '#f0ead8' }}
          >
            {content.title}
          </h2>

          {/* Subtitle */}
          {content.subtitle && (
            <p className="text-sm mb-4" style={{ color: '#a09880' }}>
              {content.subtitle}
            </p>
          )}

          {/* Divider */}
          <div
            className="w-12 h-0.5 mb-6"
            style={{ background: '#c9a84c' }}
          />

          {/* Media Preview */}
          {content.mediaType === 'image' && content.mediaUrl && (
            <div className="mb-6 w-full overload-hidden" style={{ border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <img src={content.mediaUrl} alt={content.title} className="w-full h-auto object-cover" style={{ maxHeight: '350px' }} />
            </div>
          )}

          {content.mediaType === 'embed' && content.mediaUrl && (
            <div className="mb-6 relative w-full aspect-video overload-hidden" style={{ border: '1px solid rgba(201, 168, 76, 0.2)', background: '#000' }}>
              <iframe
                src={content.mediaUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#f0ead8' }}>
            {content.description}
          </p>

          {/* Metadata */}
          {content.metadata && (
            <div className="mb-6 space-y-2">
              {Object.entries(content.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="uppercase tracking-wider text-xs" style={{ color: '#a09880' }}>
                    {key}
                  </span>
                  <span style={{ color: '#f0ead8' }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price + Purchase */}
          {content.price && (
            <div className="mb-6">
              <p className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#c9a84c' }}>
                ${content.price.toLocaleString()}
              </p>
              {content.purchasable && (
                <button
                  className="w-full py-3 text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    background: '#c9a84c',
                    color: '#060606',
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          )}

          {/* Contact form placeholder */}
          {content.zoneId === 'telephone_booth' && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: '#f0ead8',
                  outline: 'none',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: '#f0ead8',
                  outline: 'none',
                }}
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 text-sm resize-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: '#f0ead8',
                  outline: 'none',
                }}
              />
              <button
                className="w-full py-3 text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-heading)',
                  background: '#c0392b',
                  color: '#f0ead8',
                }}
              >
                Send Message
              </button>
            </div>
          )}

          {/* Other items in this zone */}
          {allZoneContent.length > 1 && (
            <>
              <div className="h-px my-6" style={{ background: 'rgba(201, 168, 76, 0.15)' }} />
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: '#a09880', fontFamily: 'var(--font-heading)' }}
              >
                More in this section
              </p>
              <div className="space-y-2">
                {allZoneContent
                  .filter((item) => item.id !== content.id)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className="w-full text-left p-3 transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(201, 168, 76, 0.1)',
                      }}
                    >
                      <p className="text-sm" style={{ color: '#f0ead8' }}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: '#a09880' }}>
                          {item.subtitle}
                        </p>
                      )}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

      </div>
    </>
  )
}
