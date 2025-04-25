/*
 * Light YouTube Embeds by @labnol
 * Credit: https://www.labnol.org/internet/light-youtube-embeds/27941/
 * Modified for TypeScript and modern frameworks
 */

export function initYouTubeLite() {
  if (typeof window === 'undefined') return;
  
  function labnolIframe(div: HTMLElement) {
    const videoId = div.dataset.id;
    if (!videoId) return;
    
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '1');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    div.replaceWith(iframe);
  }

  function initVideos() {
    const playerElements = document.querySelectorAll('.youtube-lite');
    for (let i = 0; i < playerElements.length; i++) {
      const element = playerElements[i] as HTMLElement;
      const videoId = element.dataset.id;
      
      if (!videoId) continue;
      
      // Create container div
      const div = document.createElement('div');
      div.setAttribute('data-id', videoId);
      
      // Create thumbnail
      const thumbNode = document.createElement('img');
      thumbNode.src = `//i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      div.appendChild(thumbNode);
      
      // Create play button
      const playButton = document.createElement('div');
      playButton.setAttribute('class', 'play');
      div.appendChild(playButton);
      
      // Set click handler
      div.onclick = function() {
        labnolIframe(div);
      };
      
      // Replace the original element
      element.innerHTML = '';
      element.appendChild(div);
    }
  }

  // Run initialization when DOM is loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initVideos();
  } else {
    document.addEventListener('DOMContentLoaded', initVideos);
  }
  
  // Re-run for dynamic content
  return initVideos;
}

// Helper function for creating YouTube Lite embeds in client code
export function createYouTubeLite(container: HTMLElement, videoId: string, title = 'YouTube Video'): void {
  if (typeof window === 'undefined') return;
  
  // Clear container
  container.innerHTML = '';
  
  // Add YouTube lite class
  container.classList.add('youtube-lite');
  container.dataset.id = videoId;
  
  // Create thumbnail
  const img = document.createElement('img');
  img.src = `//i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  img.alt = title;
  container.appendChild(img);
  
  // Create play button
  const playButton = document.createElement('div');
  playButton.classList.add('play');
  container.appendChild(playButton);
  
  // Initialize
  initYouTubeLite();
} 