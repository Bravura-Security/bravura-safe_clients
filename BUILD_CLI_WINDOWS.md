# Building Bravura Safe CLI for Windows

This document describes how to build the Bravura Safe CLI as a native Windows executable.

## Prerequisites

### Required Software
- **Node.js**: v20.x (tested with v20.19.5)
- **NPM**: v10.x (tested with v10.8.2)
- **Operating System**: Windows (tested on Windows with PowerShell)

### Verify Prerequisites
```powershell
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

## Build Process

### Step 1: Install Dependencies
From the root directory of the repository:

```powershell
npm install
```

This installs all dependencies for the monorepo workspace, including the CLI and its dependencies.

### Step 2: Build the CLI (Production)
Build the CLI with production optimizations:

```powershell
npm run build:oss:prod --workspace=@bitwarden/cli
```

**What this does:**
- Uses webpack to bundle the TypeScript source code
- Applies production optimizations (minification, tree-shaking)
- Outputs to `apps/cli/build/bsafe.js`
- Takes approximately 30-40 seconds

**Expected output:**
```
asset bsafe.js 2.2 MiB [compared for emit]
webpack 5.92.0 compiled successfully
```

### Step 3: Package as Windows Executable
Create a standalone Windows executable:

```powershell
npm run package:win --workspace=@bitwarden/cli
```

**What this does:**
- Uses `@yao-pkg/pkg` to package the Node.js application
- Creates a self-contained executable with Node.js runtime embedded
- Outputs to `apps/cli/dist/windows/bsafe.exe`
- Takes approximately 1-2 minutes

**Expected warnings (safe to ignore):**
```
Warning Cannot include file %1 into executable.
  %1: ..\..\node_modules\open\xdg-open
```
This warning is expected - the `xdg-open` file is a Linux utility not needed on Windows.

### Step 4: Verify the Build
Check that the executable was created successfully:

```powershell
Test-Path apps/cli/dist/windows/bsafe.exe  # Should return True
apps/cli/dist/windows/bsafe.exe --version  # Should show version number
apps/cli/dist/windows/bsafe.exe --help     # Should show help information
```

## Build Output

**Location:** `apps/cli/dist/windows/bsafe.exe`

**Size:** ~96 MB (includes embedded Node.js runtime and all dependencies)

**Version:** 2025-1.0 (as of this build)

## Alternative Build Commands

### Development Build (with watch mode)
For active development with automatic rebuilds:

```powershell
npm run build:oss:watch --workspace=@bitwarden/cli
```

Then run directly with Node.js:
```powershell
node apps/cli/build/bsafe.js --help
```

### Single Development Build
For a one-time development build without watch mode:

```powershell
npm run build:oss --workspace=@bitwarden/cli
```

### Build All Platforms
To build executables for Windows, macOS, and Linux:

```powershell
npm run package --workspace=@bitwarden/cli
```

Outputs:
- `apps/cli/dist/windows/bsafe.exe` (Windows)
- `apps/cli/dist/macos/bsafe` (macOS)
- `apps/cli/dist/linux/bsafe` (Linux)

## Troubleshooting

### Build Fails with "Cannot find module"
**Solution:** Ensure dependencies are installed:
```powershell
npm install
```

### Webpack Compilation Errors
**Solution:** Clean the build directory and rebuild:
```powershell
npm run clean --workspace=@bitwarden/cli
npm run build:oss:prod --workspace=@bitwarden/cli
```

### pkg Packaging Fails
**Solution:** Ensure the build step completed successfully first. The `build/bsafe.js` file must exist before packaging.

## Project Structure

```
apps/cli/
├── src/              # TypeScript source code
├── build/            # Compiled JavaScript output
│   └── bsafe.js      # Main bundled application
├── dist/             # Packaged executables
│   └── windows/
│       └── bsafe.exe # Windows executable
├── package.json      # CLI package configuration
└── webpack.config.js # Webpack build configuration
```

## Build Tools Used

- **webpack 5.92.0**: Bundles TypeScript/JavaScript modules
- **@yao-pkg/pkg 5.11.5**: Packages Node.js app as executable
- **cross-env**: Sets environment variables cross-platform
- **TypeScript 5.1.6**: TypeScript compiler

## Notes

- The executable is self-contained and does not require Node.js to be installed on the target system
- The large file size (~96 MB) is due to the embedded Node.js runtime and all dependencies
- The CLI uses the name `bsafe` (Bravura Safe) instead of `bw` (Bitwarden)
- Build artifacts in `apps/cli/build/` and `apps/cli/dist/` are typically git-ignored
