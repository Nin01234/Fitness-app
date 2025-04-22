"use client"

// Add type declaration for Web Bluetooth API at the top of the file
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        filters?: Array<{
          services?: string[];
          name?: string;
          namePrefix?: string;
        }>;
        optionalServices?: string[];
      }): Promise<{
        id: string;
        name?: string;
        gatt?: {
          connected?: boolean;
        };
      }>;
    };
  }
}
// Export something to make this file a module
export {}; 