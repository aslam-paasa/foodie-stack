# Project Setup:

```js
/**
 * Setting Up Git Repository:
 * 1. What is Git & Why we use it?
 *    - Git is like a time machine for your code.
 *    - Whenever you make changes, Git helps you save versions (commits) so you can:
 *      a. Go back to older versions anytime
 *      b. Work in teams safely
 *      c. Upload your code to GitHub so other (or future you) can see it
 *
 * 2. Setting up your Git Repository
 *    a. Create a .gitignore file:
 *       - .gitignore is a list of files/folders that you don't want to upload
 *         (like  * secrets, node_modules, env files, etc.)
 *       - These will be ignored while pushing to GitHub.
 *
 *    b. Initialize Git:
 *       - Inside your project folder, open terminal and run: git init
 *       - This creates a hidden folder .git - it means Git is now watching your project.
 *
 *    c. Check Status:
 *       - git status
 *       - It shows:
 *         * Untracked Files(Red): Git doesn't know about them yet.
 *         * Staged Files (Green): Git knows these are ready to be saved (committed).
 *
 *    d. Add Files to Staging Area:
 *       - We need to tell Git which files to track before saving.
 *       - To add all files    : git add .
 *       - To add a single file: git add fileName
 *       - Now, files turn green when you do git status - means they're ready to commit
 *
 *    e. Commit Files (Save a Version)
 *       - Now we save the staged files as a version:
 *         - git commit -m "Added .gitignore file"
 *           * -m : stands for "message"
 *           * "Added .gitignore file" : short note describing what you did
 *         - This creates a local save point inside your Git Folder.
 *
 *    f. Create a Remote Repository:
 *       - Now let's upload this project to GitHub (so it's safe in the cloud)
 *         1. Go to github.com
 *         2. Click "New Repository"
 *         3. Name it something like mernspace-c-auth-sercice
 *         4. Copy the commands under "Push an existing repository from the command line".
 *            They'll look like this:
 *            - git remote add origin https://github.com/username/mernspace-c-auth-service
 *            - git branch -M main
 *            - git push -u origin main
 *
 *    g. Sync Local and Remote Repo:
 *       - Now GitHub (remote) and your computer (local) are connected like twins
 *         1. Local Repo : Your Machine
 *         2. Remote Repo: GitHub
 *       - Whenever you make new changes:
 *         - git add .
 *         - git commit -m "Updated feature"
 *         - git push
 *       - That's it - your latest code is live on GitHub.
 */
```

```js
/**
 * Node Version Management Setup:
 * - Imagine you're working in a team and you've got multiple projects like:
 *   a. Project-A (uses Node.js 18)
 *   b. Project-B (uses Node.js 20)
 * - Now, if you try to use one single Node version for both, it can break your code.
 * - That's why we need NVM (Node Version Manager) - it help use switch Node.js
 *   versions per project.
 * - Basically - you can have multiple Node versions on your system and use whichever
 *   you want, anytime!
 *
 * 1. Install NVM:
 *    - If you haven't already installed it:
 *      - windows: download from nvm-windows released page (github)
 *      - Then verify: nvm --version
 *
 * 2. Create a .nvmrc file
 *    - Inside your project folder, create a new file: .nvmrc
 *    - This file tells NVM which Node.js version your project uses.
 *    - For example: 20.15.0
 *    - Think of .nvmrc like a little note that say:
 *      " Hey developer, please use Node 20 for this project! "
 *
 * 3. Check Installed Node Versions:
 *    - See what Node versions are currently installed: nvm ls
 *    - If you don't see the version mentioned in .nvmrc, you'll have to install it
 *
 * 4. Install required Node Version:
 *    - nvm install v22.10.0
 *    - NVM will download and set it up for you
 *
 * 5. Switch to that version:
 *    - Now switch Node.js to the version mentioned in .nvmrc: nvm use
 *    - (If NVM gives an error like "A version argument is required but missing - that
 *      means you didn't install the version yet, so go back and install using the
 *      previous command)
 *    - After that: node -v
 *    - You'll see it now matches the version inside .nvmrc
 *
 * 6. Example Flow:
 *    # Inside project folder
 *    touch .nvmrc
 *
 *    # Add version number inside file → 22.10.0
 *    nvm ls
 *    nvm install v22.10.0
 *    nvm use v22.10.0
 *    node -v
 *
 *    Now your project runs with Node v22.10.0
 *
 * 7. Commit & push .nvmrc to the repo:
 *    - Go to source contol > auth-service
 *    - Add to stage:
 *      - Click plus button
 *      - Comment: add .nvmrc
 *      - Commit
 *    - Push it to github:
 *      - Click on sync changes
 */
```

```js
/**
 * Assignment: Mastering Node Version Manager (NVM)
 *
 * # Objective
 *   - To demonstrate your understanding of installing, managing, and using multiple
 *     versions of Node.js using Node Version Manager (NVM).
 *
 * # Requirements:
 *   1. NVM Installation:
 *      a. Install NVM according to your operating system.
 *      b. Use a terminal or command prompt command to confirm NVM has been successfully
 *         installed.
 *
 *   2. Managing Node Version with NVM:
 *      a. List all the available versions of Node.js
 *      b. Install the latest stable version of Node.js
 *      c. Install another older version of Node.js for testing purposes
 *         (e.g., a version from a year ago)
 *      d. Confirm the installed versions using NVM
 *      e. Set one of the installed versions as the default Node version
 *
 *   3. Switching Between Node Versions:
 *      a. Use NVM to switch to the older version you installed.
 *      b. Confirm the version switch using a terminal command.
 *      c. Switch back to the latest version and confirm the switch.
 *
 *   4. Creating a Sample Project:
 *      a. Initialize a new Node.js project using the npm init command.
 *      b. Create a simple app.js file that logs the current Node.js version.
 *
 *   5. Uninstalling a Node Version:
 *      a. Uninstall the older version of Node.js that you previously installed.
 *      b. Confirm that the version has been removed using NVM.
 *
 *   6. Updating NVM:
 *      a. Research how to update NVM to its latest version for your operating system.
 *      b. Update NVM and confirm the successful update with a terminal command.
 */
```

```js
/**
 * NodeJs Project Setup:
 * - Imagine we're about to create a mini backend project called auth-service .
 * - This will handle user login, signup, etc.
 *
 * 1. Create Project Folder Structure:
 *    a. Open your VS Code (or terminal)
 *    b. Create a new folder for your service, for example:
 *       - auth-service
 *    c. Go inside the folder:
 *       - cd auth-service
 *    d. Now create a src folder
 *       - mkdir src
 *    e. Inside src, create a file named server.js:
 *       - touch src/server.js
 *       - This src/server.js file will be the entry point for your app - this is where our server will start.
 *
 * 2. Initialize the Project with NPM
 *    a. Run this command: npm init
 *       - package name: auth-service (default)
 *       - version: (1.0.0)
 *       - description: The user management service
 *       - entry point: (index.js)
 *       - test command:
 *       - git repository:
 *       - keywords:
 *       - author: Mohammad <aslampaasa421@gmail.com>
 *       - licence: (ISC)
 *       - package created!
 *
 * 3. Add scripts in package.json:
 *    - Now open your package.json file
 *    - Inside, look for the "scripts" section and make it look like this:
 *      - "scripts": {
 *          "dev": "node src/server.js",
 *          "test": "echo \"Error: no test specified\" && exit 1"
 *        }
 *    - The "dev" script helps us run our server with:
 *      - npm run dev
 *
 * 4. Commit & push to GitHub
 *    - Go to source contol > auth-service
 *    - Add to stage:
 *      - Click plus button
 *      - Comment: add package.json
 *      - Commit
 *    - Push it to github:
 *      - Click on sync changes
 */
```

```js
/**
 * Configuring TypeScript in Your Project:
 * - TypeScript adds type checking to JavaScript, helping catch errors early:
 *   - JavaScript only shows errors when running the code (runtime)
 *   - TypeScript shows errors while writing code (compile time)
 *   - Benefits: Fewer bugs, cleaner code, better development experience
 *
 * 1. Install TypeScript:
 *    a. Run this command in your terminal:
 *       - Command: npm install -D typescript
 *       - This installs the TypeScript compiler
 *       - The -D flag marks it as a development dependency
 *
 * 2. Create Your First TypeScript File:
 *    a. Rename server.js to server.ts
 *    b. Add this example code to test TypeScript:
 *
 *       function welcome(name: string) {
 *           console.log(`Welcome ${name} to our TypeScript project!`);
 *       }
 *       welcome("Developer");
 *
 *       - Notice the `: string` - this tells TypeScript that name must be a string
 *       - Try passing a number instead - TypeScript will show an error immediately!
 *
 * 3. Configure TypeScript:
 *    a. Create the configuration file:
 *       - Command: npx tsc --init
 *    b. This creates tsconfig.json - it tells TypeScript how to:
 *       - Which files to compile
 *       - Where to put the output
 *       - What JavaScript version to target
 *       - And many other options
 *
 * 4. Add Node.js Type Definitions:
 *    a. Install the types package:
 *       - Command: npm install -D @types/node
 *    b. This helps TypeScript understand Node.js built-in features like:
 *       - File system (fs)
 *       - Path handling
 *       - HTTP modules
 *       - And more
 *
 * 5. Compile Your Code:
 *    a. Run the TypeScript compiler:
 *       - Command: npx tsc
 *    b. This will:
 *       - Create a dist/ folder
 *       - Convert your .ts files to .js
 *       - Follow the rules in tsconfig.json
 *
 * 6. Run Your Code:
 *    a. Execute the compiled JavaScript:
 *       - Command: node dist/server.js
 *    b. You should see your welcome message!
 *
 * Now you have a working TypeScript setup! Each time you make changes:
 * 1. Write your TypeScript code
 * 2. Run `npx tsc` to compile
 * 3. Run `node dist/server.js` to execute
 */
```

```js
/**
 * Setting up Prettier for Code Formatting:
 *
 * 1. What is Prettier?
 *    - An automatic code formatter that makes your code look consistent
 *    - Like having a professional designer automatically organize your room!
 *    - Works with many languages: JavaScript, TypeScript, CSS, and more
 *
 * 2. Installation:
 *    - npm install --save-dev --save-exact prettier
 *      a. --save-dev   : only needed during development
 *      b. --save-exact : it ensures everyone uses the same version
 *
 * 3. Configure a simple config file:
 *    - Create .prettierrc in your project root
 *      {
 *        "semi": true,
 *        "singleQuote": true,
 *        "tabWidth": 2,
 *        "printWidth": 100,
 *        "trailingComma": "es5"
 *      }
 *      a. semi: add ; at line ends
 *      b. singleQuote: use ' instead of "
 *      c. tabWidth: number of spaces per indent
 *      d. printWidth: preferred line length (wrap after this)
 *      e. tailingComma: makes diffs cleaner (es5 is safe for most projects)
 *
 *
 * 4. Create .prettierignore:
 *    - Create .prettierignore to ignore files which you don't want formatted.
 *    - Ex: dist
 *          coverage
 *
 * 5. Add npm scripts (run formatting):
 *    - Open package.json and add:
 *      "scripts": {
 *        "format": "prettier --write .",
 *        "format:check": "prettier --check ."
 *      }
 *      a. npm run format - formats files
 *      b. npm run format:check - checks if files are formatted (useful in CI)
 *
 *    - You can also format a single file:
 *      npx prettier --write src/server.ts
 */
```

```js
/**
 * Integrating Eslint into Your Workflow:
 * - You're writing code, and you forgot a semicolon, or maybe you use a bad practice
 *   like using var instead of let...
 * - ESLint automatically scans the code, finds problems, and tells you what to fix.
 * - It's like a code reviewer who never sleeps
 * - In short:
 *   a. ESLint = "Code quality police"
 *   b. Helps you follow best practices
 *   c. Catches bugs, typos, and anti-patterns early
 *   d. Works beautifully with TypeScript + Prettier
 *
 * 1. Installation:
 *    - Command: npm install --save-dev eslint @eslint/js @types/eslint__js typescript-eslint
 *      a. eslint: the main tool that checks your code
 *      b. @eslint/js: built-in recommended rules for JS
 *      c. typescript-eslint: makes ESLint understand TypeScript syntax
 *
 * 2. Create ESLint Config File:
 *    - Create a file called eslint.config.mjs in your project root.
 *    - Now add this basic setup:
 *
 *      // @ts-check
 *
 *      import eslint from '@eslint/js';
 *      import { defineConfig } from 'eslint/config';
 *      import tseslint from 'typescript-eslint';
 *
 *      export default defineConfig(
 *        eslint.configs.recommended,
 *        tseslint.configs.recommended
 *      );
 *
 *    - What this does:
 *      - Uses ESLint's recommended rules
 *      - Adds TypeScript's recommended rules
 *      - Keeps your code clean and consistent
 *
 * 3. Run ESLint for the first time
 *    - Command: npx eslint .
 *    - If you see it scanning dist/ or node_modules and throwing a bunch of errors
 *    - no worries, we'll fix that next
 *
 * 4. Ignore unwanted folders
 *    - Let's stop ESLint from scanning unnecessary files like dist or node_modules
 *    - Update your eslint.config.mjs like this:
 *
 *      // @ts-check
 *
 *      import eslint from '@eslint/js';
 *      import { defineConfig } from 'eslint/config';
 *      import tseslint from 'typescript-eslint';
 *
 *      export default defineConfig(
 *        eslint.configs.recommended,
 *        tseslint.configs.recommended,
 *        {
 *          ignores: ['dist', 'node_modules', 'eslint.config.mjs']
 *        }
 *      );
 *    - Now ESLint will skip those folders while checking your code.
 *
 * 5. Enable Linting with Type Information (Advanced Setup)
 *    - If you want ESLint to fully understand your TypeScript types,
 *      not just syntax - then use this version (type-aware linting).
 *
 *    // @ts-check
 *
 *    import eslint from '@eslint/js';
 *    import { defineConfig } from 'eslint/config';
 *    import tseslint from 'typescript-eslint';
 *
 *    export default defineConfig(
 *    eslint.configs.recommended,
 *    tseslint.configs.recommended,
 *    tseslint.configs.recommendedTypeChecked,
 *       {
 *          ignores: ['dist', 'node_modules', 'eslint.config.mjs'],
 *       },
 *       {
 *          languageOptions: {
 *             parserOptions: {
 *             projectService: true,
 *             },
 *          },
 *          rules: {
 *             "no-console": "error"
 *          }
 *       }
 *    );
 *
 *    - Explanation:
 *      - recommendedTypeChecked: gives ESLint type-level power
 *      - ignores: folders/files to skip
 *      - no-console: throws error if you use console.log
 *        (you can customize or remove this rule)
 *
 * 6. Add ESLint Scripts to package.json:
 *    - Open your package.json and add these under "scripts":
 *
 *    "scripts": {
 *       "dev": "node src/server.js",
 *       "test": "echo \"Error: no test specified\" && exit 1",
 *       "format": "prettier . --write",
 *       "format:check": "prettier . --check",
 *       "lint:check": "eslint .",
 *       "lint:fix": "eslint . --fix"
 *    }
 *
 *    - Run lint check: npm run lint:check
 *    - Auto-fix error: npm run lint:fix
 */
```

```js
/**
 * Implementing Git Hooks (with Husky + Lint-Staged):
 *
 * 1. What are Git Hooks?
 *    - Imagine you're working in a team (or even solo) and you want to
 *      make sure only clean, formatted, linted code goes into your GitHub repo.
 *    - Now... you don't want unformatted or buggy code to sneak in before a commit,
 *      right? That's where Git Hooks come in.
 *
 *    "Git Hooks are custom scripts that run automatically at specific points in your
 *     git workflow - like before you make a commit, before you push, etc."
 *
 *    - We'll use the pre-commit hook - this one runs right before your code is
 *      committed.
 *    - And we'll make it:
 *      a. Run ESLint for linting
 *      b. Run Prettier for formatting
 *      c. And only check changed files for faster performance
 *
 * 2. Install Husky:
 *    - Husky helps us easily manage git hooks in Nodejs projects:
 *      npm install --save-dev husky
 *
 *    - Why husky?
 *      Normally, Git Hooks are tricky to manage - Husky makes them super simple and
 *      consistent across machines.
 *
 * 3. Initialize Husky:
 *    - Run this command: npx husky init (create hook)
 *    - This will:
 *      a. Create a .husky/ folder in your project root
 *      b. Add a default pre-commit file inside it
 *    - Your folder structure will now look like this:
 *      .husky/
 *       ├── _
 *       └── pre-commit
 *
 * 4. Configure the pre-commit Hook:
 *    - Open the file .husky/pre-commit - this is the script that runs before
 *      each commit
 *    - Add this line to it: npx lint-staged
 *    - What this means:
 *      "Before committing, Husky will trigger lint-staged, which will check
 *       and format only staged (changed) files."
 *
 * 5. Install lint-staged:
 *    - We'll use lint-staged to avoid running ESLint and Prettier on the entire
 *      project - it'll only run them on files that have changed.
 *    - Install it: npm install --save-dev lint-staged
 *
 * 6. Add lint-staged Configuration:
 *    - Open your package.json and add this section:
 *
 *      "lint-staged": {
 *        "*.ts": ["prettier --list-different", "eslint"]
 *      }
 *
 *    - Explanation:
 *      - "*.ts" - Target all typescript files
 *      - "prettier --list-different" - Checks if formatting is correct
 *      - "eslint" - Runs ESLint to check code quality
 *    - This means whenever you try to commit:
 *      a. Lint-Staged grabs only the changed .ts files
 *      b. Runs Prettier and ESLint on them
 *      c. Stops commit if issues are found
 *
 * 7. Connect Everything
 *    - Your .husky/pre-commit file should now look like this:
 *      npx lint-staged
 *    - That's it!
 *
 *    - Now, before any commit happens,
 *      Husky -> runs Lint-Staged -> which runs ESLint + Prettier.
 *    - If something fails (like linting errors or bad formatting),
 *      the commit is blocked.
 *
 * 8. Example Full Setup Recap:
 *    - Your Project should have:
 *       ├── .husky/
 *       │   ├── _
 *       │   └── pre-commit
 *       ├── package.json
 *       ├── eslint.config.mjs
 *       ├── .prettierrc
 *       ├── .prettierignore
 *       └── src/
 *    - Your package.json scripts might look like this:
 *       "scripts": {
 *          "dev": "node src/server.js",
 *          "format": "prettier . --write",
 *          "format:check": "prettier . --check",
 *          "lint:check": "eslint .",
 *          "lint:fix": "eslint . --fix",
 *          "prepare": "husky"
 *       },
 *          "lint-staged": {
 *          "*.ts": ["prettier --list-different", "eslint"]
 *       }
 *    - The "prepare": "husky" script ensures Husky is automatically setup whenever
 *      someone installs your dependencies (e.g., via npm install)
 *
 * 9. Test your Hook:
 *    - Try making a small commit:
 *       git add .
 *       git commit -m "test: husky setup"
 *    - If your code has lint or format issues - commit will fail
 *    - If everything's clean - commit succeeds
 *
 * 10. Auto-Fix on Commit (Optional):
 *     - If you want to auto-fix issues of just checking, modify your lint-staged
 *       config like this:
 *
 *       "lint-staged": {
 *          "*.ts": ["prettier --write", "eslint --fix"]
 *       }
 *
 *    - Now whenever you commit:
 *      a. Prettier will format the code
 *      b. ESLint will fix fixable issues automatically
 *      c. Add only clean code goes to GitHub
 *
 */
```

```js
/**
 * Configuring Application Settings:
 * 1. Every application needs different configuration settings:
 *    - Port number where the server runs
 *    - Database credentials (username, password, connection string)
 *    - API keys for external services
 *    - Other environment-specific variables
 *
 * 2. Best Practices for Configuration:
 *    - Never hardcode sensitive information directly in your code
 *    - Use environment variables (.env files) or configuration files
 *    - Keep all config values in a centralized location
 *    - Validate configuration values on application startup
 *
 * 3. For this service, we will:
 *    - Set up environment variables using .env files
 *    - Create a central config management system
 *    - Learn how to securely store and access configuration values
 *    - Implement configuration validation
 *
 * 4. Environment Variables Setup:
 *    a. Install dotenv package to handle environment variables: npm install dotenv --save
 *
 *    b. Create configuration files:
 *       - Create a `.env` file in the root folder
 *       - Add these basic environment variables:
 *         PORT=3000
 *         NODE_ENV=development
 *
 *    c. Set up configuration management:
 *       - Create a `config` folder inside `src`
 *       - Create `index.ts` inside config folder
 *       - This file will:
 *         - Read all environment variables
 *         - Export them in a structured way
 *         - Be the single source of configuration for the app
 *
 *          import { config } from 'dotenv'
 *          config()
 *
 *          const { PORT, NODE_ENV } = process.env
 *
 *          export const Config = {
 *             PORT,
 *             NODE_ENV,
 *          }
 *
 *    d. Available configurations:
 *       - PORT: The port number where server will run
 *       - NODE_ENV: Application environment (development/production/test)
 */
```

```js
/**
 * ExpressJS App Configuration:
 * a. Install required packages:
 *    - npm install express --save
 *    - npm install -D @types/express
 *    - npm i -D nodemon ts-node
 *    - "scripts": {
 *         "dev": "nodemon src/server.ts",
 *       }
 * b. Create configuration files:
 *    - Create `app.ts` inside `src` folder
 *    - Add basic Express setup:
 *
 *      App.ts:
 *       import express from 'express'
 *
 *       const app = express()
 *
 *       app.get('/', (req, res) => {
 *          res.send('Welcome to Auth Service')
 *       })
 *
 *       export default app
 *
 *      Server.ts:
 *       import { Config } from './config/index.js'
 *       import app from './app.js'
 *
 *       const startServer = () => {
 *          const PORT = Config.PORT
 *          try {
 *             app.listen(PORT, () => {
 *                   console.log(`Server is running on port $
 *                   {PORT}`)
 *             })
 *          } catch (err) {
 *             console.error(err)
 *             process.exit(1)
 *          }
 *       }
 *
 *       startServer()
 *
 */
```

```js
/**
Setting Up a Logger:
1. Why logging?
   - Track what your app does (requests, jobs, errors)
   - Debugging & monitoring - logs help you reproduce issues
   - Observability - useful for production troubleshooting and audits

2. Why not console.log() in production?
   - Slower and can block I/O
   - No built-in levels (info/warn/error)
   - Logs are ephemeral (gone after restart) and hard to filter
   - No file/rotation/remote transport support

3. Use Winston - install
   - npm i winston
   - npm i -D @types/winston

4. Minimal, beginner-friendly Winston Setup (TS)
   - Create src/config/logger.ts:
      import winston from 'winston';

      const logger = winston.createLogger({
         level: 'info',
         defaultMeta: {
            serviceName: 'auth-service',
         },
         transports: [
            new winston.transports.Console({
                  level: 'info',
                  format: winston.format.json(),
            }),
         ]
      })

      export default logger;

   - Explanation:
     a. import winston from 'winston'
        - This imports the Winston library
        - Winston is a logging tool (way better than console.log) that supports log levels, 
          formats, and multiple outputs (called transports)

     b. const logger = winston.createLogger({})
        - createLogger() makes a new instance. Think of it as your app's logging engine.
        - You configure behavior (levels, metadata, transports) inside the { ... }

     c. level: 'info'
        - This tells Winston which level of messages it should show:
          - error: something broke like database down
          - warn : warning, not a crash like low disk space
          - info : Normal info like Server started
          - debug: Developer-only detail like User object: {...}
        - If we set level: 'info', then only info, warn and error logs will appear.
        - debug logs will be ignored unless we change it.

     d. defaultMeta: { serviceName: 'auth-service' }
        - This adds extra information automatically to every log.
        - For example, if your log says:
          { "level": "info", "message": "Server started" }
        - Then winston will automatically add this meta info:
          { "level": "info", "message": "Server started", "serviceName": "auth-service" }
        - Useful when you have many microservices like (auth-service, user-service, 
          payment-service) so you can tell where each log came from.

     e. transports: [ ... ]
        - Think of transports as where your logs go.
        - You can send logs to:
          - Console (your terminal)
          - Files (like error.log)
          - Cloud logging tools (like Datalog or AWS CloudWatch)
        - Right now, we're just sending them to the console.
        - Inside the console transport:

            new winston.transports.Console({
               level: 'info',
               format: winston.format.json(),
            })

        - Let's break this mini block too:
          - new winston.transports.Console() tells Winston to print logs on screen
          - level: 'info', same idea as before, only log info and above
          - format: winston.format.json(), logs appear in JSON format, like this:
               {"level":"info","message":"Server started","serviceName":"auth-service"}
          - JSON is machine-friendly and used in real-production systems

     f. export default logger:
        - This simply makes your logger across your project

     g. Import and use it in server.ts:
        - logger.info - 
          {
             "level": "info",
             "message": "Server is running on port 5555",
             "serviceName": "auth-service"
          }
        - logger.error
         import app from './app'
         import { Config } from './config/index'
         import logger from './config/logger'

         const startServer = () => {
            const PORT = Config.PORT
            try {
               app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`))
            } catch (err) {
               logger.error('Failed to start server:', err)
               process.exit(1)
            }
         }
         startServer()

   - How can we store the logs in a file?
     - Add new transport: new winston.transports.File({})
         import winston from 'winston';

         const logger = winston.createLogger({
            level: 'info',
            defaultMeta: {
               serviceName: 'auth-service',
            },
            transports: [
               new winston.transports.File({
                     level: 'info',
                     dirname: 'logs',
                     filename: 'app.log',
                     format: winston.format.combine(
                        winston.format.timestamp(), 
                        winston.format.json()
                     ),
               }),
               new winston.transports.Console({
                     level: 'info',
                     format: winston.format.combine(
                        winston.format.timestamp(), 
                        winston.format.json()
                     ),
               }),
            ]
         })

         export default logger;

   - How to silent the logs during testing?
      const logger = winston.createLogger({
         level: 'info',
         defaultMeta: {
            serviceName: 'auth-service',
         },
         transports: [
            new winston.transports.File({
                  level: 'info',
                  dirname: 'logs',
                  filename: 'combined.log',
                  format: winston.format.combine(
                     winston.format.timestamp(), 
                     winston.format.json()
                  ),
                  silent: false,
            }),
            new winston.transports.File({
                  level: 'error',
                  dirname: 'logs',
                  filename: 'error.log',
                  format: winston.format.combine(
                     winston.format.timestamp(), 
                     winston.format.json()
                  ),
                  silent: false,
            }),
            new winston.transports.Console({
                  level: 'info',
                  format: winston.format.combine(
                     winston.format.timestamp(), 
                     winston.format.json()
                  ),
                  silent: Config.NODE_ENV === 'test',
            }),
         ]
      })
*/
```

```js
/**
 * Implementing Error Handling:
 * - Global Error Handler ka use kar k humare application k andr jo v errors
 *   aa rhe hai usko hum catch kar sakte hai
 * - Create a middleware at the end of app.ts file:
 *   - Install: npm i http-errors
 *              npm i -D @types/http-errors
 *   - Jab v humein http error throw karna hoga to hum iss package ka use karnge
 *
 *       app.get('/', (req, res) => {
 *          const err = createHttpError(401, "You cannot access this route")
 *          throw err
 *          res.send('Welcome to Auth Service')
 *       })
 *
 *
 *        // global error handler
 *
 *       // eslint-disable-next-line @typescript-eslint/no-unused-vars
 *       app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
 *          logger.error(err.message)
 *          const statusCode = err.statusCode || 500;
 *
 *          res.status(statusCode).json({
 *             errors: [
 *                   {
 *                      type: err.name,
 *                      msg: err.message,
 *                      path: "",
 *                      location: ""
 *                   }
 *             ]
 *          })
 *       })
 *
 *
 * - But there is a catch, if we use async in our api then server will crash
 *   instead of error handling
 *
 *   app.get('/', async (req, res) => {
 *       const err = createHttpError(401, "You cannot access this route")
 *       throw err
 *       res.send('Welcome to Auth Service')
 *   })
 *
 *   // global error handler
 *   // eslint-disable-next-line @typescript-eslint/no-unused-vars
 *   app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
 *       logger.error(err.message)
 *       const statusCode = err.statusCode || 500;
 *
 *       res.status(statusCode).json({
 *           errors: [
 *               {
 *                   type: err.name,
 *                   msg: err.message,
 *                   path: "",
 *                   location: ""
 *               }
 *           ]
 *       })
 *   })
 *
 * - Solution: Instead of 'throw err', pass third param i.e. next jisko hum
 *   call kar denge jo error check karega.
 *
 *    app.get('/', async (req: Request, res: Response, next: NextFunction) => {
 *       const err = createHttpError(401, "You cannot access this route")
 *       next(err)
 *       // res.send('Welcome to Auth Service')
 *    })
 *
 *    // global error handler
 *
 *    // eslint-disable-next-line @typescript-eslint/no-unused-vars
 *    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
 *       logger.error(err.message)
 *       const statusCode = err.statusCode || 500;
 *
 *       res.status(statusCode).json({
 *          errors: [
 *                {
 *                   type: err.name,
 *                   msg: err.message,
 *                   path: "",
 *                   location: ""
 *                }
 *          ]
 *       })
 *    })
```

```js
/**
 * Setting Up Automated Tests:
 * 1. What do we normally do?
 *    - When we build a new feature (like signup, login, etc), we usually test it 
 *      manually. 
 *      a. We open the browser
 *      b. Try the feature
 *      c. Or use Postman to check if the API works properly
 *    - This is called manual testing.
 * 
 * 2. The Problem with Manual Testing
 *    - Let's say you just finished Feature-1 and tested it - works fine.
 *    - Now you build Feature-2, test it - also fine.
 *    - But... what if Feature-2 accidentally broke Feature-1?
 *    - If you only test the new feature, you might miss bugs in the old ones.
 *    - So, before launching anything, you'd have to:
 *      a. Re-test every single feature manually again and again
 *      b. Which take a lot of time
 *      c. And humans can easily make mistakes
 * 
 * 3. The Smart Solution - Automated Testing
 *    - Instead of manually clicking buttons everytime, we write test scripts 
 *      that check the app automatically.
 *    - So now, when you run just one command (like npm test), it will automatically
 *      test your entire application and tell you which features are passing or failing.
 * 
 * 
 * 4. How this fits in real projects?
 *    - When we use CI/CD pipelines (like GitHub Actions, Jenkins, etc.)
 *      - Everytime we push code or deploy our app,
 *      - The pipeline runs all test cases automatically
 *      - It checks: "Is everything working fine before deployment?"
 *    - If all tests pass - Code is deployed
 *    - If any test fails - Deployment stops (to prevent bugs in production)
 * 
 * 
 * 5. Unit Testing Setup:
 *    - install jest: npm install --save-dev jest
 *                    npm install --save-dev ts-jest
 *                    npm install --save-dev @types/jest
 *    - config: npx ts-jest config:init
 *    - package.json:
 *      "scripts": {
 *          "test": "jest --watch --runInBand"
 *      }
 * 
 *    - src/utils.ts:
 *      export const calculateDiscount = (price: number, percentage: number) => {
 *          return price * (percentage / 100)
 *      }
 * 
 *    - app.spec.ts:
 *      import { calculateDiscount } from "./src/utils";
 *      import { describe, it, expect } from '@jest/globals';
 *      
 *      describe("App", () => {
 *          it("should return the correct discount amount", () => {
 *              const discount = calculateDiscount(100, 10);
 *              expect(discount).toBe(10);
 *          });
 *      });
 * 
 * API/Integration/HTTP Testing Setup:
 * - npm i supertest --save-dev
 * - npm i @types/supertest --save-dev
 * 
 *    import { calculateDiscount } from "./src/utils";
 *    import { describe, it, expect } from '@jest/globals';
 *    import request from "supertest";
 *    import app from "./src/app";
 * 
 *    describe("App", () => {
 *       
 *       # Unit Testing
 *       it("should return the correct discount amount", () => {
 *          const discount = calculateDiscount(100, 10);
 *          expect(discount).toBe(10);
 *       });
 * 
 *        # API Testing
 *       it("should return 200 status code", async () => {
 *          const response = await request(app).get("/").send();
 *          expect(response.status).toBe(200);
 *       });
 *    });
*/
```
