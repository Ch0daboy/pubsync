export interface PlatformInfo {
  platform_type: 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'blog'
  name: string
  url: string
  detected: boolean
}

export function analyzePlatformUrl(url: string): PlatformInfo {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    const pathname = urlObj.pathname

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let name = 'YouTube Channel'
      
      // Extract channel name from various YouTube URL formats
      if (pathname.includes('/channel/')) {
        name = 'YouTube Channel'
      } else if (pathname.includes('/c/')) {
        name = pathname.split('/c/')[1]?.split('/')[0] || 'YouTube Channel'
      } else if (pathname.includes('/@')) {
        name = pathname.split('/@')[1]?.split('/')[0] || 'YouTube Channel'
      } else if (pathname.includes('/user/')) {
        name = pathname.split('/user/')[1]?.split('/')[0] || 'YouTube Channel'
      }
      
      return {
        platform_type: 'youtube',
        name: name.charAt(0).toUpperCase() + name.slice(1),
        url,
        detected: true
      }
    }

    // Instagram
    if (hostname.includes('instagram.com')) {
      let name = 'Instagram Account'
      
      if (pathname.startsWith('/')) {
        const username = pathname.split('/')[1]
        if (username && username !== '') {
          name = `@${username}`
        }
      }
      
      return {
        platform_type: 'instagram',
        name,
        url,
        detected: true
      }
    }

    // Twitter/X
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      let name = 'Twitter Account'
      
      if (pathname.startsWith('/')) {
        const username = pathname.split('/')[1]
        if (username && username !== '') {
          name = `@${username}`
        }
      }
      
      return {
        platform_type: 'twitter',
        name,
        url,
        detected: true
      }
    }

    // LinkedIn
    if (hostname.includes('linkedin.com')) {
      let name = 'LinkedIn Profile'
      
      if (pathname.includes('/in/')) {
        const profileId = pathname.split('/in/')[1]?.split('/')[0]
        if (profileId && profileId !== '') {
          name = 'LinkedIn Profile'
        }
      } else if (pathname.includes('/company/')) {
        const companyId = pathname.split('/company/')[1]?.split('/')[0]
        if (companyId && companyId !== '') {
          name = 'LinkedIn Company'
        }
      }
      
      return {
        platform_type: 'linkedin',
        name,
        url,
        detected: true
      }
    }

    // TikTok
    if (hostname.includes('tiktok.com')) {
      let name = 'TikTok Account'
      
      if (pathname.startsWith('/@')) {
        const username = pathname.split('/@')[1]?.split('/')[0]
        if (username && username !== '') {
          name = `@${username}`
        }
      }
      
      return {
        platform_type: 'tiktok',
        name,
        url,
        detected: true
      }
    }

    // Blog (anything else)
    return {
      platform_type: 'blog',
      name: urlObj.hostname.replace('www.', ''),
      url,
      detected: true
    }

  } catch {
    // If URL parsing fails, return a default blog entry
    return {
      platform_type: 'blog',
      name: 'Blog',
      url,
      detected: false
    }
  }
} 