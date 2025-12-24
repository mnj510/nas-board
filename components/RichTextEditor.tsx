'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image as ImageIcon, X } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageUpload: (file: File) => Promise<string>
  onThumbnailSelect?: (imageUrl: string) => void
  thumbnailUrl?: string | null
}

export default function RichTextEditor({
  content,
  onChange,
  onImageUpload,
  onThumbnailSelect,
  thumbnailUrl,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null)

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const insertImage = useCallback(
    async (imageUrl: string, isThumbnail: boolean = false) => {
      if (!editorRef.current) return

      const selection = window.getSelection()
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

      const wrapper = document.createElement('div')
      wrapper.className = 'relative w-full my-4'
      wrapper.style.textAlign = 'center'

      const imageContainer = document.createElement('div')
      imageContainer.className = 'relative inline-block group'
      imageContainer.style.position = 'relative'

      const img = document.createElement('img')
      img.src = imageUrl
      img.className = 'max-w-full h-auto rounded-lg'
      img.style.display = 'block'
      img.style.maxWidth = '100%'
      img.setAttribute('data-image-url', imageUrl)
      if (isThumbnail) {
        img.setAttribute('data-thumbnail', 'true')
      }

      imageContainer.appendChild(img)

      if (onThumbnailSelect) {
        const thumbnailBtn = document.createElement('button')
        thumbnailBtn.type = 'button'
        thumbnailBtn.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-lg shadow-lg transition-colors z-10 ${
          thumbnailUrl === imageUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
        }`
        thumbnailBtn.textContent = thumbnailUrl === imageUrl ? '썸네일 ✓' : '썸네일'
        thumbnailBtn.style.opacity = '0'
        thumbnailBtn.style.transition = 'opacity 0.2s'
        imageContainer.addEventListener('mouseenter', () => {
          thumbnailBtn.style.opacity = '1'
        })
        imageContainer.addEventListener('mouseleave', () => {
          thumbnailBtn.style.opacity = '0'
        })
        thumbnailBtn.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (onThumbnailSelect) {
            onThumbnailSelect(imageUrl)
          }
          // 모든 썸네일 버튼 업데이트
          const allButtons = editorRef.current?.querySelectorAll('[data-thumbnail-btn]')
          allButtons?.forEach((btn) => {
            const btnElement = btn as HTMLButtonElement
            const imgUrl = btnElement.getAttribute('data-image-url')
            if (imgUrl === imageUrl) {
              btnElement.textContent = '썸네일 ✓'
              btnElement.className = btnElement.className.replace('bg-blue-600', 'bg-green-600').replace('hover:bg-blue-700', 'hover:bg-green-700')
            } else {
              btnElement.textContent = '썸네일'
              btnElement.className = btnElement.className.replace('bg-green-600', 'bg-blue-600').replace('hover:bg-green-700', 'hover:bg-blue-700')
            }
          })
        }
        thumbnailBtn.setAttribute('data-thumbnail-btn', 'true')
        thumbnailBtn.setAttribute('data-image-url', imageUrl)
        imageContainer.appendChild(thumbnailBtn)
      }

      wrapper.appendChild(imageContainer)

      if (range) {
        range.deleteContents()
        range.insertNode(wrapper)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      } else {
        editorRef.current.appendChild(wrapper)
      }

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    },
    [onChange, onThumbnailSelect, thumbnailUrl]
  )

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = items[i].getAsFile()
          if (file) {
            const imageId = `upload-${Date.now()}`
            setUploadingImageId(imageId)
            setUploading(true)
            try {
              const url = await onImageUpload(file)
              await insertImage(url)
            } catch (error) {
              console.error('Image upload error:', error)
              alert('이미지 업로드에 실패했습니다.')
            } finally {
              setUploading(false)
              setUploadingImageId(null)
            }
          }
        }
      }
    },
    [onImageUpload, insertImage]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      if (!file.type.startsWith('image/')) return

      const imageId = `upload-${Date.now()}`
      setUploadingImageId(imageId)
      setUploading(true)

      try {
        const url = await onImageUpload(file)
        await insertImage(url)
      } catch (error) {
        console.error('Image upload error:', error)
        alert('이미지 업로드에 실패했습니다.')
      } finally {
        setUploading(false)
        setUploadingImageId(null)
      }
    },
    [onImageUpload, insertImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    noClick: true,
    disabled: uploading,
  })

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // 기존 이미지에 썸네일 버튼 추가
  useEffect(() => {
    if (!editorRef.current || !onThumbnailSelect) return

    const images = editorRef.current.querySelectorAll('img[data-image-url]')
    images.forEach((img) => {
      const imageUrl = img.getAttribute('data-image-url')
      if (!imageUrl) return

      let imageContainer = img.parentElement
      if (!imageContainer || imageContainer.tagName !== 'DIV') {
        // 이미지 컨테이너가 없으면 생성
        imageContainer = document.createElement('div')
        imageContainer.className = 'relative inline-block group'
        imageContainer.style.position = 'relative'
        img.parentNode?.insertBefore(imageContainer, img)
        imageContainer.appendChild(img)
      }

      // 이미 썸네일 버튼이 있으면 스킵
      if (imageContainer.querySelector('[data-thumbnail-btn]')) return

      const thumbnailBtn = document.createElement('button')
      thumbnailBtn.type = 'button'
      thumbnailBtn.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-lg shadow-lg transition-colors z-10 ${
        thumbnailUrl === imageUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
      }`
      thumbnailBtn.textContent = thumbnailUrl === imageUrl ? '썸네일 ✓' : '썸네일'
      thumbnailBtn.style.opacity = '0'
      thumbnailBtn.style.transition = 'opacity 0.2s'
      imageContainer.addEventListener('mouseenter', () => {
        thumbnailBtn.style.opacity = '1'
      })
      imageContainer.addEventListener('mouseleave', () => {
        thumbnailBtn.style.opacity = '0'
      })
      thumbnailBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (onThumbnailSelect) {
          onThumbnailSelect(imageUrl)
        }
        const allButtons = editorRef.current?.querySelectorAll('[data-thumbnail-btn]')
        allButtons?.forEach((btn) => {
          const btnElement = btn as HTMLButtonElement
          const imgUrl = btnElement.getAttribute('data-image-url')
          if (imgUrl === imageUrl) {
            btnElement.textContent = '썸네일 ✓'
            btnElement.className = btnElement.className.replace('bg-blue-600', 'bg-green-600').replace('hover:bg-blue-700', 'hover:bg-green-700')
          } else {
            btnElement.textContent = '썸네일'
            btnElement.className = btnElement.className.replace('bg-green-600', 'bg-blue-600').replace('hover:bg-green-700', 'hover:bg-blue-700')
          }
        })
      }
      thumbnailBtn.setAttribute('data-thumbnail-btn', 'true')
      thumbnailBtn.setAttribute('data-image-url', imageUrl)
      imageContainer.appendChild(thumbnailBtn)
    })
  }, [content, thumbnailUrl, onThumbnailSelect])

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-gray-300 rounded-lg min-h-[400px] p-4 ${
        isDragActive ? 'border-primary-500 bg-primary-50' : ''
      } ${uploading ? 'opacity-50' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 bg-primary-100 bg-opacity-50 flex items-center justify-center z-20 rounded-lg">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-primary-600 mb-4" />
            <p className="text-lg font-semibold text-primary-700">
              여기에 이미지를 놓으세요
            </p>
          </div>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="outline-none min-h-[400px] prose prose-sm max-w-none"
        style={{
          wordBreak: 'break-word',
        }}
        suppressContentEditableWarning
      />
      {uploading && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          이미지 업로드 중...
        </div>
      )}
    </div>
  )
}

