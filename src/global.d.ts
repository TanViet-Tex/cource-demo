// Global ambient declarations to silence some third-party or project-specific types
declare module 'lord-icon'

declare namespace JSX {
  interface IntrinsicElements {
    'lord-icon': any
  }
}

// Allow imports that use the ~ alias to be treated as any for now
declare module '~/*'
