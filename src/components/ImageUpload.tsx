'use client'

interface ImageUploadProps {
  onImageCropped: (croppedImage: string) => void | Promise<void>
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
}

export function ImageUpload({ 
  onImageCropped, 
  aspectRatio = 1, 
  cropShape = 'round' 
}: ImageUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        alert(`File size must be less than 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageCropped(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  )
} 