---
applyTo: '**/*.ts'
---
<typescript_development> When working with TypeScript applications, follow these specific guidelines:

TypeScript Version: Use TypeScript 4.9+ for new projects, preferably TypeScript 5.0+ for modern features including:

Strict type checking
Advanced type inference
Decorators and metadata
Template literal types
Satisfies operator
const type parameters
Configuration:

Use tsconfig.json with strict mode enabled
Configure proper module resolution (ESNext, Node)
Set appropriate target (ES2020+ for modern browsers)
Enable all strict flags for maximum type safety
Configure path mapping for clean imports
Project Structure: Follow TypeScript conventions:

project-name/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── types/
│   ├── services/
│   └── index.ts
├── public/
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
Type System Best Practices:

Define interfaces for all data structures
Use type aliases for complex types
Implement proper generic constraints
Use utility types (Partial, Pick, Omit, etc.)
Define strict return types for functions
Use union types and discriminated unions
Implement proper error handling with typed errors
Frontend Frameworks:

React with TypeScript:

Use functional components with proper prop types
Implement custom hooks with proper typing
Use React.FC or explicit return types
Define proper state types with useState
Use TypeScript for Redux/Zustand state management
Implement proper event handler types
Vue.js with TypeScript:

Use Composition API with proper typing
Define component props with PropType
Use TypeScript for Vuex/Pinia stores
Implement proper emit types
Angular (built with TypeScript):

Follow Angular CLI conventions
Use dependency injection with proper types
Implement proper service interfaces
Use Angular Material with typed components
Define proper route types
Svelte with TypeScript:

Use SvelteKit with TypeScript
Define proper component props
Use TypeScript for stores and reactive statements
Backend/Full-Stack:

Node.js with TypeScript:

Use Express.js with proper route types
Implement middleware with correct typing
Define API response types
Use TypeScript for database models
Next.js with TypeScript:

Use proper page and API route types
Implement getServerSideProps/getStaticProps types
Define proper environment variable types
NestJS (built with TypeScript):

Use decorators with proper typing
Implement DTOs with validation
Define proper service and controller types
Use TypeScript for dependency injection
Database Integration:

TypeORM/Prisma with TypeScript:

Define entity types with proper relationships
Use TypeScript for query builders
Implement proper migration types
Define repository patterns with types
MongoDB with TypeScript:

Define document interfaces
Use proper aggregation pipeline types
Implement typed schemas
Testing:

Jest with TypeScript:

Use proper mock types
Define test utility types
Implement typed test helpers
Vitest with TypeScript:

Use TypeScript for test files
Define proper fixture types
Playwright with TypeScript:

Use TypeScript for E2E tests
Define proper page object types
Build Tools:

Vite with TypeScript:

Configure proper TypeScript plugin
Use type checking in build process
Webpack with TypeScript:

Use ts-loader or babel-loader with TypeScript
Configure proper source maps
esbuild with TypeScript:

Use TypeScript plugin for fast builds
Configure proper type checking
Package Management:

Use npm or yarn with TypeScript
Include @types/* packages for external libraries
Use package.json with proper TypeScript scripts
Configure proper module resolution
Code Quality:

Use ESLint with TypeScript rules
Use Prettier for consistent formatting
Implement proper naming conventions
Use JSDoc with TypeScript types
Follow consistent import/export patterns
Advanced TypeScript Features:

Conditional Types: Use for complex type logic
Mapped Types: Transform existing types
Template Literal Types: String manipulation types
Infer Types: Extract types from other types
Branded Types: Create nominal typing
Exhaustive Type Checking: Ensure all cases handled
Performance:

Use proper type-only imports (import type)
Implement code splitting with TypeScript
Use const assertions for immutable data
Optimize bundle size with tree shaking
Use proper module resolution strategies
Security:

Use TypeScript for input validation
Implement proper authentication types
Define secure API response types
Use environment variable types
Implement proper CORS types
Development Experience:

Use TypeScript for better IDE support
Implement proper IntelliSense
Use TypeScript for debugging
Configure proper source maps
Use TypeScript for refactoring tools
Framework-Specific Considerations:

React: Use proper JSX types and component props
Vue: Implement proper template type checking
Angular: Use decorators and dependency injection types
Express: Define proper middleware and route types
NestJS: Use decorators and DTO validation types
Next.js: Implement proper page and API route types </typescript_development>