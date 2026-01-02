// Generate placeholder images as data URLs with colored backgrounds
// This creates simple SVG placeholders for development

export const generatePlaceholder = (width, height, text, bgColor = '#1a365d', textColor = '#ffffff') => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="${bgColor}"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Predefined placeholders for common use cases
export const placeholders = {
  // Products
  productDress: generatePlaceholder(400, 500, 'Wrap Dress', '#D4703C'),
  productTrousers: generatePlaceholder(400, 500, 'Trousers', '#4A5D5E'),
  productJacketHover: generatePlaceholder(400, 500, 'Jacket Detail', '#2c5282'),
  productDressHover: generatePlaceholder(400, 500, 'Dress Detail', '#E8B44C'),
  productTrousersHover: generatePlaceholder(400, 500, 'Trousers Detail', '#6B6B6B'),
  productTopHover: generatePlaceholder(400, 500, 'Top Detail', '#8B9D83'),

  // Categories
  categoryOuterwear: generatePlaceholder(600, 800, 'Outerwear', '#1a365d'),
  categorySensory: generatePlaceholder(600, 800, 'Sensory-Friendly', '#D4703C'),
  categorySeated: generatePlaceholder(600, 800, 'Seated Comfort', '#4A5D5E'),
  categoryEasyDressing: generatePlaceholder(600, 800, 'Easy Dressing', '#E8B44C'),

  // About
  aboutMission: generatePlaceholder(800, 600, 'Our Mission', '#2c5282'),

  // Instagram
  instagram1: generatePlaceholder(400, 400, 'Post 1', '#C13584'),
  instagram2: generatePlaceholder(400, 400, 'Post 2', '#E1306C'),
  instagram3: generatePlaceholder(400, 400, 'Post 3', '#F56040'),
  instagram4: generatePlaceholder(400, 400, 'Post 4', '#FCAF45'),
  instagram5: generatePlaceholder(400, 400, 'Post 5', '#833AB4'),
  instagram6: generatePlaceholder(400, 400, 'Post 6', '#5851DB'),

  // Testimonials
  testimonial1: generatePlaceholder(100, 100, 'SM', '#1a365d'),
  testimonial2: generatePlaceholder(100, 100, 'JO', '#D4703C'),
  testimonial3: generatePlaceholder(100, 100, 'AH', '#4A5D5E'),
  testimonial4: generatePlaceholder(100, 100, 'DK', '#E8B44C'),
}

// Helper function to generate placeholder images dynamically
export const getPlaceholderImage = (width, height, text, bgColor) => {
  return generatePlaceholder(width, height, text, bgColor)
}
