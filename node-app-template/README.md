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