# Design Document

## Overview

This design outlines the approach for upgrading the live-photo project dependencies to their latest versions and optimizing the build configuration. The upgrade involves major version changes for critical build tools (Rollup 2→4, TypeScript 4→5, @rollup/plugin-typescript 8→12) and requires careful migration to maintain compatibility.

## Architecture

### Dependency Upgrade Strategy

The upgrade will follow a phased approach:

1. **Root Project Dependencies** - Core library build dependencies
2. **Playground Dependencies** - Testing environment dependencies
3. **Configuration Updates** - Adapt configurations to new dependency requirements
4. **Validation** - Ensure all builds and type checks pass

### Version Upgrade Plan

#### Root Project (`package.json`)

| Package | Current | Latest | Change Type |
|---------|---------|--------|-------------|
| rollup | 2.79.2 | 4.52.5 | Major (breaking) |
| @rollup/plugin-typescript | 8.5.0 | 12.3.0 | Major (breaking) |
| typescript | 4.9.5 | 5.9.3 | Major (breaking) |
| changelogen | 0.5.7 | 0.6.2 | Minor |
| rollup-plugin-postcss | 4.0.2 | 4.0.2 | No change |
| tslib | 2.8.1 | 2.8.1 | No change |

#### Playground (`playground/package.json`)

| Package | Current | Latest | Change Type |
|---------|---------|--------|-------------|
| vue | 3.5.13 | 3.5.22 | Patch |
| vite | 6.0.6 | 7.1.12 | Major (breaking) |
| @vitejs/plugin-vue | 5.2.1 | 6.0.1 | Major (breaking) |
| typescript | 5.6.3 | 5.9.3 | Minor |
| vue-tsc | 2.2.0 | 3.1.1 | Major (breaking) |
| @vue/tsconfig | 0.7.0 | 0.8.1 | Minor |

## Components and Interfaces

### 1. Rollup Configuration Migration (rollup.config.js)

**Breaking Changes in Rollup 4:**
- Plugin API changes
- Output options restructuring
- ESM-first approach

**Required Updates:**
```javascript
// Current structure needs validation for:
// - Plugin compatibility with Rollup 4
// - Output format options
// - Source map generation
// - Named exports handling
```

### 2. TypeScript Configuration (tsconfig.json)

**TypeScript 5.x Improvements:**
- Better ES module support
- New compiler options
- Improved type checking

**Potential Optimizations:**
```json
{
  "compilerOptions": {
    "target": "ES2020",  // Upgrade from ES5 for better performance
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],  // Update from ES2015
    "moduleResolution": "bundler",  // Modern resolution
    "skipLibCheck": true,  // Performance optimization
    "strict": true,
    "declaration": true,
    "declarationMap": true,  // Add for better debugging
    "esModuleInterop": true,
    "resolveJsonModule": true  // Add for JSON imports
  }
}
```

### 3. Package.json Optimizations

**Current Export Strategy:**
```json
{
  "main": "dist/LivePhotoViewer.cjs.js",
  "module": "dist/LivePhotoViewer.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/LivePhotoViewer.esm.js",
      "require": "./dist/LivePhotoViewer.cjs.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

**Recommended Optimizations:**
- Add "default" export condition for better compatibility
- Consider adding "browser" field for browser-specific builds
- Ensure proper conditional exports ordering

### 4. Playground Vite Configuration

**Vite 7.x Changes:**
- Performance improvements
- New plugin API features
- Better HMR

**Configuration Review Points:**
- Plugin compatibility
- Build target settings
- Development server options

## Data Models

### Dependency Metadata Structure

```typescript
interface DependencyUpgrade {
  package: string;
  currentVersion: string;
  latestVersion: string;
  changeType: 'major' | 'minor' | 'patch';
  breakingChanges: string[];
  migrationSteps: string[];
}

interface ConfigurationChange {
  file: string;
  section: string;
  currentValue: any;
  proposedValue: any;
  rationale: string;
}
```

## Error Handling

### Build Failure Recovery

1. **Rollup Plugin Incompatibility**
   - Fallback: Test with intermediate versions
   - Solution: Update plugin configuration syntax

2. **TypeScript Compilation Errors**
   - Fallback: Adjust tsconfig.json strictness
   - Solution: Fix type errors in source code

3. **Playground Build Failures**
   - Fallback: Keep playground dependencies separate
   - Solution: Update Vite configuration

### Validation Strategy

```
1. Update root dependencies
2. Run: bun run build
3. Verify: dist/ output files exist
4. Update playground dependencies
5. Run: cd playground && bun run build
6. Verify: playground builds successfully
7. Run: cd playground && bun run dev (manual test)
```

## Testing Strategy

### Build Verification

1. **Root Project Build**
   - Execute `bun run build`
   - Verify all three bundle formats are generated (UMD, ESM, CJS)
   - Check that type definitions are generated
   - Validate source maps are created

2. **Type Checking**
   - Execute `bun tsc --noEmit`
   - Ensure no type errors in source code
   - Verify type definitions are valid

3. **Playground Build**
   - Execute `cd playground && bun run build`
   - Verify production build succeeds
   - Test development server starts without errors

### Compatibility Testing

1. **Bundle Format Testing**
   - Verify UMD bundle works in browser
   - Verify ESM bundle works with modern bundlers
   - Verify CJS bundle works in Node.js

2. **Demo Validation**
   - Test HTML demo files still work
   - Verify React demo compatibility
   - Verify Vue3 demo compatibility

## Migration Risks and Mitigation

### High Risk: Rollup 2 → 4 Migration

**Risk:** Plugin API breaking changes may cause build failures

**Mitigation:**
- Review Rollup 4 migration guide
- Test build after each major dependency update
- Keep rollup-plugin-postcss compatibility in mind

### Medium Risk: TypeScript 4 → 5 Migration

**Risk:** New strict checks may reveal type issues

**Mitigation:**
- Enable new checks incrementally
- Fix type errors before finalizing upgrade
- Ensure generated .d.ts files remain compatible

### Low Risk: Vite 6 → 7 Migration

**Risk:** Playground may have HMR or build issues

**Mitigation:**
- Vite upgrades are generally backward compatible
- Test dev server and production build
- Update vite.config.ts if needed

## Configuration Optimization Recommendations

### 1. Modern JavaScript Target

**Current:** ES5 target is overly conservative for 2024

**Recommendation:** Upgrade to ES2020
- Better performance
- Smaller bundle sizes
- Modern browsers support ES2020
- Transpile down if needed by consumers

### 2. Module Resolution

**Current:** Default module resolution

**Recommendation:** Use "bundler" mode
- Better for library development
- Aligns with modern tooling
- Improved type checking

### 3. Build Performance

**Additions:**
- `skipLibCheck: true` - Faster builds
- `declarationMap: true` - Better debugging
- `incremental: true` - Faster rebuilds (if needed)

### 4. Package.json Scripts

**Current Scripts:**
```json
{
  "build": "rollup -c",
  "dev": "rollup -c -w",
  "release": "changelogen --release && npm publish --registry https://registry.npmjs.org"
}
```

**Potential Additions:**
- `"typecheck": "tsc --noEmit"` - Separate type checking
- `"clean": "rm -rf dist"` - Clean build artifacts
- `"prepublishOnly": "bun run build"` - Ensure build before publish

## Implementation Phases

### Phase 1: Root Dependencies
1. Update package.json versions
2. Run `bun install`
3. Update rollup.config.js if needed
4. Test build

### Phase 2: Configuration Optimization
1. Update tsconfig.json
2. Optimize package.json exports
3. Add helpful scripts
4. Test build and types

### Phase 3: Playground Dependencies
1. Update playground/package.json
2. Run `bun install` in playground
3. Update vite.config.ts if needed
4. Test playground build and dev server

### Phase 4: Validation
1. Run all builds
2. Test demo files
3. Verify type definitions
4. Document any breaking changes
# Design Document

## Overview

This design outlines the approach for upgrading the live-photo project dependencies from their current versions to the latest stable releases, along with configuration optimizations. The upgrade focuses on the main library dependencies (Rollup 2.x → 4.x, TypeScript 4.x → 5.x, and related plugins) while maintaining backward compatibility and improving build performance.

## Current State Analysis

### Dependency Versions (Current → Latest)

**Main Dependencies:**
- `rollup`: 2.79.2 → 4.52.5 (major version upgrade)
- `@rollup/plugin-typescript`: 8.5.0 → 12.3.0 (major version upgrade)
- `typescript`: 4.9.5 → 5.9.3 (major version upgrade)
- `changelogen`: 0.5.7 → 0.6.2 (minor version upgrade)
- `rollup-plugin-postcss`: 4.0.2 → latest (needs verification)
- `tslib`: 2.8.1 (already latest)

### Breaking Changes Identified

**Rollup 4.x Breaking Changes:**
1. Requires Node.js 18.0.0 or higher
2. Changed default output format behavior
3. Updated plugin API (mostly backward compatible)
4. Improved tree-shaking and code splitting

**TypeScript 5.x Breaking Changes:**
1. Stricter type checking in some scenarios
2. Updated lib definitions
3. Better ES module support
4. Improved performance

**@rollup/plugin-typescript 12.x:**
1. Requires Rollup 4.x
2. Better integration with TypeScript 5.x
3. Updated tsconfig handling

## Architecture

### Upgrade Strategy

The upgrade will follow a phased approach to minimize risk:

1. **Phase 1: TypeScript Upgrade**
   - Update TypeScript to 5.9.3
   - Verify type checking passes
   - Update tsconfig.json for TypeScript 5.x best practices

2. **Phase 2: Rollup Core Upgrade**
   - Update Rollup to 4.52.5
   - Update @rollup/plugin-typescript to 12.3.0
   - Adjust rollup.config.js for Rollup 4.x

3. **Phase 3: Supporting Dependencies**
   - Update changelogen to 0.6.2
   - Verify rollup-plugin-postcss compatibility
   - Update any other minor dependencies

4. **Phase 4: Configuration Optimization**
   - Optimize tsconfig.json
   - Optimize rollup.config.js
   - Update package.json scripts if needed

## Components and Interfaces

### Package.json Updates

```json
{
  "devDependencies": {
    "@rollup/plugin-typescript": "^12.3.0",
    "changelogen": "^0.6.2",
    "rollup": "^4.52.5",
    "rollup-plugin-postcss": "^4.0.2",
    "typescript": "^5.9.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### TypeScript Configuration Optimizations

**Current tsconfig.json issues:**
- `target: "es5"` is outdated for modern browsers
- `lib: ["dom", "es2015"]` can be updated
- Missing modern compiler options

**Optimized tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["DOM", "ES2015", "ES2017"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "playground"]
}
```

**Rationale for changes:**
- `target: "ES2015"`: Better balance between compatibility and modern features
- `declarationMap: true`: Enables better IDE navigation
- `skipLibCheck: true`: Faster compilation
- `moduleResolution: "bundler"`: Optimized for Rollup bundling
- `isolatedModules: true`: Better compatibility with bundlers

### Rollup Configuration Optimizations

**Current rollup.config.js issues:**
- No explicit external dependencies handling
- Missing optimization options
- Could benefit from Rollup 4.x features

**Optimized rollup.config.js:**
```javascript
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/LivePhotoViewer.js',
      format: 'umd',
      name: 'LivePhotoViewer',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/LivePhotoViewer.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/LivePhotoViewer.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: ['tslib'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationMap: true,
    }),
    postcss({
      minimize: true,
      inject: false,
      extract: false,
    }),
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
};
```

**Rationale for changes:**
- `external: ['tslib']`: Prevents bundling tslib (it's a dependency)
- `declarationMap: true`: Generates declaration maps for better IDE support
- `postcss` options: Explicit configuration for CSS handling
- `treeshake`: Enhanced tree-shaking for smaller bundles

## Data Models

No data model changes required - this is purely a build system upgrade.

## Error Handling

### Potential Issues and Mitigations

1. **TypeScript Compilation Errors**
   - Issue: Stricter type checking in TS 5.x
   - Mitigation: Review and fix any new type errors; use `@ts-expect-error` sparingly if needed

2. **Rollup Plugin Compatibility**
   - Issue: rollup-plugin-postcss may have issues with Rollup 4.x
   - Mitigation: Test thoroughly; consider alternative if needed (rollup-plugin-postcss is maintained)

3. **Build Output Changes**
   - Issue: Different output due to improved tree-shaking
   - Mitigation: Compare bundle sizes before/after; verify functionality

4. **Node.js Version Requirements**
   - Issue: Rollup 4.x requires Node 18+
   - Mitigation: Document in README; add engines field to package.json

## Testing Strategy

### Verification Steps

1. **Build Verification**
   ```bash
   npm run build
   ```
   - Verify all three output formats are generated
   - Check for compilation errors
   - Compare bundle sizes

2. **Type Checking**
   ```bash
   npx tsc --noEmit
   ```
   - Ensure no type errors

3. **Bundle Analysis**
   - Verify UMD bundle works in browser
   - Verify ESM bundle works with modern bundlers
   - Verify CJS bundle works in Node.js

4. **Source Map Verification**
   - Check that source maps are generated correctly
   - Verify debugging experience

### Success Criteria

- All builds complete without errors
- Bundle sizes are similar or smaller
- Type definitions are generated correctly
- No breaking changes to public API
- Source maps work correctly

## Migration Path

### Step-by-Step Upgrade Process

1. **Backup current state**
   - Commit all changes
   - Note current bundle sizes

2. **Update package.json**
   - Update all dependency versions
   - Add engines field

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Update tsconfig.json**
   - Apply optimizations
   - Test compilation

5. **Update rollup.config.js**
   - Apply optimizations
   - Test build

6. **Verify builds**
   - Run build command
   - Check outputs

7. **Test in playground (optional)**
   - Link local package
   - Verify functionality

8. **Document changes**
   - Update README if needed
   - Note any breaking changes

## Configuration Best Practices

### Package.json Optimizations

1. **Add engines field** to specify Node.js version requirements
2. **Verify exports field** is correctly configured for modern Node.js
3. **Consider adding sideEffects: false** for better tree-shaking

### Build Performance

Expected improvements:
- Faster TypeScript compilation (TS 5.x is faster)
- Better tree-shaking (Rollup 4.x improvements)
- Smaller bundle sizes (improved optimization)

## Rollback Plan

If issues arise:
1. Revert package.json changes
2. Run `npm install`
3. Restore original config files
4. Document issues encountered
