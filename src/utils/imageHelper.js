/**
 * Image processing helper functions
 * Handles file to base64 conversion for image uploads
 */

/**
 * Convert File object to base64 data URL
 * @param {File} file - Image file from input
 * @returns {Promise<string>} Base64 data URL (data:image/...;base64,...)
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        // Validate file is an image
        if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'))
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result) // Returns data URL (data:image/png;base64,...)
        }

        reader.onerror = (error) => {
            reject(error)
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Convert File object to base64 string (without data URL prefix)
 * @param {File} file - Image file from input
 * @returns {Promise<string>} Base64 string only
 */
export const fileToBase64String = async (file) => {
    const dataUrl = await fileToBase64(file)
    // Remove the data URL prefix (data:image/png;base64,)
    return dataUrl.split(',')[1]
}

/**
 * Validate image file size
 * @param {File} file - Image file
 * @param {number} maxSizeMB - Maximum size in MB (default 5MB)
 * @returns {boolean}
 */
export const validateImageSize = (file, maxSizeMB = 5) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
}

/**
 * Validate image file type
 * @param {File} file - Image file
 * @param {Array<string>} allowedTypes - Allowed MIME types (default: common image types)
 * @returns {boolean}
 */
export const validateImageType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
    return allowedTypes.includes(file.type)
}

/**
 * Comprehensive image validation
 * @param {File} file - Image file
 * @param {Object} options - Validation options { maxSizeMB, allowedTypes }
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateImage = (file, options = {}) => {
    const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] } = options

    if (!file) {
        return { valid: false, error: 'No file selected' }
    }

    if (!validateImageType(file, allowedTypes)) {
        return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }
    }

    if (!validateImageSize(file, maxSizeMB)) {
        return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
    }

    return { valid: true, error: null }
}

/**
 * Get image preview URL from File object
 * @param {File} file - Image file
 * @returns {string} Object URL for preview
 */
export const getImagePreview = (file) => {
    return URL.createObjectURL(file)
}

/**
 * Cleanup object URL (call when component unmounts)
 * @param {string} url - Object URL to revoke
 */
export const cleanupPreview = (url) => {
    URL.revokeObjectURL(url)
}

/**
 * Resize image before upload (optional, for optimizing large images)
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<string>} Resized image as base64 data URL
 */
export const resizeImage = (file, maxWidth = 1200, maxHeight = 1200) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height
                        height = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                // Convert to base64
                const resizedDataUrl = canvas.toDataURL(file.type, 0.9) // 0.9 = 90% quality
                resolve(resizedDataUrl)
            }

            img.onerror = reject
            img.src = e.target.result
        }

        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
