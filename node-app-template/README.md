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