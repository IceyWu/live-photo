# Implementation Plan

- [x] 1. Create project structure and type definitions


  - Create src/types/index.ts with all TypeScript interfaces and types
  - Create src/utils directory
  - Export all types from main index.ts
  - Add proper Window interface declaration for global LivePhotoViewer
  - _Requirements: 4.1, 4.2, 4.4_



- [ ] 2. Implement utility functions
  - Create src/utils/debounce.ts with debounce function
  - Create src/utils/validators.ts with validateOptions function
  - Create src/utils/helpers.ts for shared helper functions


  - Add proper TypeScript types for all utility functions
  - _Requirements: 3.1, 4.3, 7.5_

- [ ] 3. Implement StateManager module
  - Create src/core/StateManager.ts
  - Implement constructor with initial state
  - Implement getState() method returning readonly state


  - Implement setState() method with immutable updates
  - Implement subscribe() method for state change listeners
  - Implement destroy() method for cleanup
  - _Requirements: 1.5, 2.3, 8.1_

- [x] 4. Implement EventManager module


  - Create src/core/EventManager.ts
  - Implement addEventListener() method with automatic binding
  - Implement removeEventListener() method
  - Track all event registrations in internal array
  - Implement destroy() method to remove all listeners
  - _Requirements: 1.4, 2.2, 2.5_



- [ ] 5. Implement VideoLoader module
  - Create src/core/VideoLoader.ts
  - Implement loadVideo() method with retry logic
  - Implement exponential backoff for retries
  - Add progress tracking during video load
  - Handle load errors and throw after max retries
  - _Requirements: 3.5, 7.1, 7.2_

- [ ] 6. Implement UIComponents module
  - Create src/core/UIComponents.ts


  - Implement createContainer() static method
  - Implement createPhoto() static method
  - Implement createVideo() static method
  - Implement createBadge() static method
  - Implement createProgressBar() static method
  - Implement createDropMenu() static method



  - Implement updateBadgeContent() static method
  - Implement applyCustomization() private helper method
  - Implement preventDefaultBehaviors() private helper method
  - _Requirements: 1.3, 5.3_

- [ ] 7. Update CSS with variables and remove inline styles
  - Add CSS variables to :root in LivePhotoViewer.css
  - Add theme-specific CSS variables for [data-theme="dark"] and [data-theme="light"]
  - Move progress bar styles from inline to CSS file
  - Replace all hardcoded color values with CSS variables
  - Remove transition and style definitions from TypeScript code
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ] 8. Refactor LivePhotoViewer main class - Part 1 (Setup)
  - Update constructor to use validateOptions
  - Initialize StateManager, EventManager, and VideoLoader
  - Replace direct UI creation with UIComponents methods
  - Create assembleDOM() method to organize DOM assembly
  - Update constructor to set default options
  - _Requirements: 1.1, 1.2, 7.5_

- [x] 9. Refactor LivePhotoViewer main class - Part 2 (Event Handling)
  - Create setupEventListeners() method
  - Migrate all addEventListener calls to use EventManager
  - Create separate setupMobileEvents() and setupDesktopEvents() methods
  - Implement handlePhotoLoad(), handlePhotoError() methods
  - Implement handleVideoEnd(), handleVideoError(), handleVideoProgress() methods
  - Apply debounce to handleVideoProgress
  - _Requirements: 1.4, 3.1, 3.3_

- [x] 10. Refactor LivePhotoViewer main class - Part 3 (State Management)
  - Replace all direct state property access with StateManager
  - Update play(), pause(), stop(), toggle() methods to use StateManager
  - Remove direct state properties (isPlaying, videoError, etc.)
  - Subscribe to state changes where needed
  - _Requirements: 1.5, 8.3_

- [x] 11. Implement destroy() method and resource cleanup
  - Create public destroy() method
  - Disconnect IntersectionObserver if exists
  - Call eventManager.destroy() to remove all listeners
  - Call stateManager.destroy() to cleanup subscriptions
  - Release video and photo resources (clear src, call load())
  - Remove container from DOM
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 12. Implement lazy loading with IntersectionObserver
  - Create setupLazyLoading() method
  - Use IntersectionObserver to detect when container is visible
  - Load video source only when container enters viewport
  - Disconnect observer after video is loaded
  - _Requirements: 3.2, 6.2_

- [x] 13. Add new configuration options
  - Add theme option support (light, dark, auto)
  - Add preload option for video loading strategy
  - Add retryAttempts option (pass to VideoLoader)
  - Add enableVibration option
  - Add onLoadStart and onLoadProgress callbacks
  - Apply theme attribute to container element
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 14. Implement enhanced error handling
  - Create LivePhotoError interface with type, message, originalError
  - Update all error callbacks to use LivePhotoError
  - Integrate VideoLoader retry logic into video loading
  - Add detailed error messages for different error types
  - Add console logging for errors in development mode
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 15. Add getState() method for testing
  - Implement public getState() method
  - Return readonly state from StateManager
  - Ensure state is frozen/immutable
  - _Requirements: 8.1, 8.5_

- [x] 16. Update exports and maintain backward compatibility
  - Update src/index.ts to export all new types
  - Ensure LivePhotoViewer class is exported
  - Verify all existing public APIs remain unchanged
  - Add Window.LivePhotoViewer assignment for browser use
  - _Requirements: 4.4, 8.5_

- [x] 17. Build and verify refactored code
  - Run bun run build
  - Verify all three bundle formats are generated
  - Check that bundle size increase is minimal
  - Run TypeScript type checking with bunx tsc --noEmit
  - Verify no type errors exist
  - _Requirements: 4.1, 4.5_

- [ ]* 18. Create test utilities
  - Create src/utils/testUtils.ts
  - Implement createMockOptions() helper
  - Implement simulateVideoLoad() helper
  - Implement simulateVideoError() helper
  - Export test utilities from main index
  - _Requirements: 8.2, 8.3_

- [ ]* 19. Update documentation
  - Document new destroy() method in README
  - Document new configuration options (theme, preload, retryAttempts, etc.)
  - Add migration guide for new features
  - Document CSS variables for customization
  - Add examples of using getState() for testing
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 20. Test refactored implementation
  - Test basic functionality (play, pause, stop, toggle)
  - Test destroy() method cleans up all resources
  - Test lazy loading with IntersectionObserver
  - Test error handling and retry logic
  - Test theme switching
  - Test mobile and desktop interactions
  - _Requirements: 8.1, 8.2, 8.5_
