/**
 * Announces a message to screen readers using aria-live regions
 * @param message The message to announce
 * @param priority The priority level for the announcement (polite or assertive)
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return; // Guard for SSR
  
  // Create or get the announcement container
  let container = document.getElementById('screen-reader-announcer');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'screen-reader-announcer';
    container.setAttribute('aria-live', priority);
    container.setAttribute('aria-atomic', 'true');
    container.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    container.style.position = 'absolute';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.padding = '0';
    container.style.margin = '-1px';
    container.style.overflow = 'hidden';
    container.style.clip = 'rect(0, 0, 0, 0)';
    container.style.whiteSpace = 'nowrap';
    container.style.border = '0';
    document.body.appendChild(container);
  }
  
  // Set the appropriate aria-live attribute
  container.setAttribute('aria-live', priority);
  
  // Clear previous announcements
  container.textContent = '';
  
  // We need to do this in a timeout to ensure the content change is announced
  setTimeout(() => {
    container.textContent = message;
    
    // Clean up after some time (optional)
    setTimeout(() => {
      container.textContent = '';
    }, 3000);
  }, 50);
}

/**
 * Ensures an element is focusable by setting tabindex if necessary
 * @param element The element to make focusable
 * @returns The element (for chaining)
 */
export function ensureFocusable(element: HTMLElement): HTMLElement {
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
    
    // Remove tabindex when the element loses focus to keep DOM clean
    const handleBlur = () => {
      element.removeAttribute('tabindex');
      element.removeEventListener('blur', handleBlur);
    };
    
    element.addEventListener('blur', handleBlur, { once: true });
  }
  
  return element;
}

/**
 * Attempts to focus an element by ID
 * @param id The ID of the element to focus
 * @returns True if successful, false otherwise
 */
export function focusElement(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;
  
  ensureFocusable(element).focus();
  return true;
}

/**
 * Creates a focus trap within a container
 * @param containerId The ID of the element to trap focus within
 * @returns A function to remove the trap
 */
export function createFocusTrap(containerId: string): () => void {
  const container = document.getElementById(containerId);
  if (!container) return () => {};
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
} 