# FrontendAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

### Quick Start Options

**Option 1: Start with auto-browser opening (Recommended)**
```bash
npm run dev
```

**Option 2: Using the convenient shell script**
```bash
./start-dev.sh
```

**Option 3: Basic server start**
```bash
npm start
# or
ng serve
```

### Available Development Scripts

- `npm run dev` - Starts the server and automatically opens your browser
- `npm start` - Basic server start (manual browser navigation required)
- `npm run serve` - Starts server accessible from any network interface
- `npm run serve:open` - Network accessible server with auto-browser opening
- `./start-dev.sh` - Convenient shell script that checks dependencies and starts with browser

### Server Details

Once the server is running, it will be available at `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

**Note:** If you get a "this site cannot be reached" error, make sure the development server is running using one of the commands above.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

### Development Build
```bash
npm run build
# or
ng build
```

### Production Build (Recommended for deployment)
```bash
npm run build:prod
# or
ng build --configuration production
```

### Watch Mode (Continuous building during development)
```bash
npm run watch
```

This will compile your project and store the build artifacts in the `dist/` directory. The production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
