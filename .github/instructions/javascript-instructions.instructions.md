---
applyTo: '**/*.js'
---
<javascript_development> When working with JavaScript applications, follow these specific guidelines:

JavaScript Version: Use modern JavaScript (ES6+) features including:

Arrow functions, destructuring, spread/rest operators
Template literals, optional chaining, nullish coalescing
Async/await for asynchronous operations
Modules (import/export)
Package Management:

Use npm or yarn for package management
Include package.json with proper dependencies and scripts
Use package-lock.json or yarn.lock for reproducible builds
Consider using pnpm for better performance and disk space
Project Structure: Follow modern JavaScript conventions:

project-name/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── styles/
│   └── index.js
├── public/
├── package.json
├── README.md
└── .gitignore
Code Quality:

Use ESLint for linting with appropriate rules
Use Prettier for code formatting
Follow consistent naming conventions (camelCase for variables/functions, PascalCase for components)
Use meaningful variable and function names
Include JSDoc comments for complex functions
Frontend Frameworks:

React (preferred for modern web applications):

Use functional components with hooks
Implement proper state management (useState, useContext, Redux/Zustand)
Use React Router for navigation
Implement proper error boundaries
Use React.memo and useMemo for performance optimization
Vue.js:

Use Composition API for new projects
Implement proper component structure
Use Vuex or Pinia for state management
Use Vue Router for navigation
Angular:

Follow Angular CLI conventions
Use TypeScript for type safety
Implement proper dependency injection
Use Angular Material for UI components
Svelte:

Use SvelteKit for full-stack applications
Implement reactive statements properly
Use stores for state management
Backend/Full-Stack:

Node.js with Express.js for APIs
Next.js for React full-stack applications
Nuxt.js for Vue.js full-stack applications
SvelteKit for Svelte full-stack applications
Styling:

CSS-in-JS: styled-components, emotion, or CSS modules
CSS Frameworks: Tailwind CSS, Bootstrap, or Material-UI
Preprocessors: Sass/SCSS or Less
Use responsive design principles
Testing:

Jest for unit testing
React Testing Library for React component testing
Cypress or Playwright for E2E testing
Vitest for Vite-based projects
Build Tools:

Vite (preferred for modern projects)
Webpack for complex configurations
Parcel for zero-config builds
esbuild for fast builds
TypeScript:

Use TypeScript for better type safety and developer experience
Define proper interfaces and types
Use strict mode configuration
Implement proper error handling with typed errors
State Management:

Redux Toolkit for complex state management
Zustand for lightweight state management
React Query/TanStack Query for server state
Context API for simple state sharing
Performance:

Implement code splitting and lazy loading
Use React.lazy() for component lazy loading
Optimize bundle size with tree shaking
Implement proper caching strategies
Use service workers for PWA capabilities
Security:

Sanitize user inputs
Implement proper CORS policies
Use HTTPS in production
Implement Content Security Policy (CSP)
Use environment variables for sensitive data
Accessibility:

Follow WCAG guidelines
Use semantic HTML elements
Implement proper ARIA attributes
Ensure keyboard navigation support
Test with screen readers
Development Tools:

Use browser developer tools effectively
Implement proper logging and debugging
Use React DevTools, Vue DevTools, or Angular DevTools
Set up proper source maps for debugging </javascript_development>