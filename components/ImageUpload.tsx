'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<string>
  thumbnailUrl?: string | null
  onRemove?: () => void
}

export default function ImageUpload({
  onImageUpload,
  thumbnailUrl,
  onRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(thumbnailUrl || null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploading(true)

      try {
        // 미리보기 생성
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // 업로드
        const url = await onImageUpload(file)
        setPreview(url)
      } catch (error) {
        console.error('Image upload error:', error)
        alert('이미지 업로드에 실패했습니다.')
      } finally {
        setUploading(false)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
    disabled: uploading,
  })

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) onRemove()
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          {uploading ? (
            <p className="text-gray-600">업로드 중...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                {isDragActive
                  ? '여기에 이미지를 놓으세요'
                  : '이미지를 드래그하거나 클릭하여 업로드'}
              </p>
              <p className="text-sm text-gray-500">
                JPEG, PNG, GIF, WEBP 지원
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

