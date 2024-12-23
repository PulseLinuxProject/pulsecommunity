'use client'

import React from 'react'
import { useState } from 'react'
import { ImageModal } from './ImageModal'
import DOMPurify from 'isomorphic-dompurify'

interface ThreadContentProps {
  thread: {
    content: string
    images: Array<{ url: string }>
  }
}

export function ThreadContent({ thread }: ThreadContentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const processContent = (content: string) => {
    // Convert URLs to clickable links (both with and without protocol)
    const processedContent = content.replace(
      /(https?:\/\/[^\s]+)|(?<![:/])(www\.[^\s]+)|([^\s@]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi,
      (match, withProtocol, withWww, withoutProtocol) => {
        let url = match
        if (withWww) url = 'http://' + match
        if (withoutProtocol && !withProtocol && !withWww) url = 'http://' + match
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">${match}</a>`
      }
    )

    return DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: ['a', 'br', 'p'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    })
  }

  return (
    <>
      <div 
        className="prose prose-invert max-w-none mb-6 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: processContent(thread.content) }}
      />

      {thread.images && thread.images.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          {thread.images.map((image, index) => (
            <div 
              key={index} 
              className="relative max-w-lg cursor-pointer group"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={`Thread image ${index + 1}`}
                className="rounded-lg max-h-[500px] w-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">Click to view</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
} 