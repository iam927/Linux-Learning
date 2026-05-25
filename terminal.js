/**
 * Linux Terminal Emulator
 * Simulates a basic Linux file system and bash shell environment.
 */

class FileSystem {
    constructor() {
        this.root = {
            name: '/',
            type: 'dir',
            content: {
                'home': {
                    name: 'home',
                    type: 'dir',
                    content: {
                        'user': {
                            name: 'user',
                            type: 'dir',
                            content: {
                                'Documents': { name: 'Documents', type: 'dir', content: {} },
                                'Downloads': { name: 'Downloads', type: 'dir', content: {} },
                                'Music': { name: 'Music', type: 'dir', content: {} },
                                'Pictures': { name: 'Pictures', type: 'dir', content: {} },
                                'notes.txt': { name: 'notes.txt', type: 'file', content: 'Learn Linux every day!' },
                                '.bashrc': { name: '.bashrc', type: 'file', content: '# bash config' }
                            }
                        }
                    }
                },
                'etc': {
                    name: 'etc',
                    type: 'dir',
                    content: {
                        'passwd': { name: 'passwd', type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash' }
                    }
                },
                'var': { name: 'var', type: 'dir', content: { 'log': { name: 'log', type: 'dir', content: {} } } },
                'bin': { name: 'bin', type: 'dir', content: {} }
            }
        };
        this.currentPath = '/home/user';
        this.user = 'user';
        this.hostname = 'linuxmastery';
    }

    getPrompt() {
        let displayPath = this.currentPath;
        if (displayPath.startsWith('/home/user')) {
            displayPath = displayPath.replace('/home/user', '~');
        }
        return \`\${this.user}@\${this.hostname}:\${displayPath}$ \`;
    }

    getNode(path) {
        if (path === '/') return this.root;
        if (path === '~') return this.getNode('/home/user');
        
        // Handle relative paths
        if (!path.startsWith('/')) {
            if (this.currentPath === '/') {
                path = '/' + path;
            } else {
                path = this.currentPath + '/' + path;
            }
        }

        path = path.replace(/\\/\\//g, '/'); // cleanup double slashes

        let parts = path.split('/').filter(p => p !== '' && p !== '.');
        let current = this.root;
        
        let resolvedParts = [];
        for (let part of parts) {
            if (part === '..') {
                resolvedParts.pop();
            } else {
                resolvedParts.push(part);
            }
        }

        for (let part of resolvedParts) {
            if (current.type !== 'dir' || !current.content[part]) {
                return null;
            }
            current = current.content[part];
        }
        return current;
    }

    getParentPath(path) {
        if (path === '/') return '/';
        let parts = path.split('/').filter(p => p !== '');
        parts.pop();
        if (parts.length === 0) return '/';
        return '/' + parts.join('/');
    }

    resolvePath(path) {
        if (!path || path === '.') return this.currentPath;
        if (path === '..') return this.getParentPath(this.currentPath);
        if (path === '~') return '/home/user';
        
        let targetNode = this.getNode(path);
        if (!targetNode) return null;
        
        // Reconstruct absolute path
        if (path.startsWith('/')) {
             let resolvedParts = [];
             let parts = path.split('/').filter(p => p !== '' && p !== '.');
             for (let part of parts) {
                 if (part === '..') resolvedParts.pop();
                 else resolvedParts.push(part);
             }
             return '/' + resolvedParts.join('/');
        } else {
            let base = this.currentPath === '/' ? '' : this.currentPath;
            let combined = base + '/' + path;
            let resolvedParts = [];
            let parts = combined.split('/').filter(p => p !== '' && p !== '.');
            for (let part of parts) {
                if (part === '..') resolvedParts.pop();
                else resolvedParts.push(part);
            }
            return '/' + resolvedParts.join('/');
        }
    }
}

class Terminal {
    constructor(containerId, inputId, outputId, promptId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.output = document.getElementById(outputId);
        this.promptElem = document.getElementById(promptId);
        
        this.fs = new FileSystem();
        this.history = [];
        this.historyIndex = -1;
        
        this.setupEventListeners();
        this.updatePrompt();
        
        // Initial greeting
        this.printLine('Welcome to Linux Mastery Terminal', 'success-line');
        this.printLine('Type "help" to see available commands.', 'info-line');
        this.printLine('');
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim();
                this.executeCommand(cmd);
                this.input.value = '';
                
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                }
                
                // Scroll to bottom
                this.output.scrollTop = this.output.scrollHeight;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            } else if (e.key === 'c' && e.ctrlKey) {
                // Ctrl+C simulation
                this.printLine(\`\${this.fs.getPrompt()}\${this.input.value}^C\`, 'cmd-line');
                this.input.value = '';
                this.output.scrollTop = this.output.scrollHeight;
            }
        });
        
        // Focus input when clicking anywhere in terminal
        this.container.addEventListener('click', () => {
            // Only focus if not selecting text
            if (window.getSelection().toString() === '') {
                this.input.focus();
            }
        });
    }

    updatePrompt() {
        this.promptElem.textContent = this.fs.getPrompt();
    }

    printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = \`output-line \${className}\`;
        line.textContent = text;
        this.output.appendChild(line);
    }
    
    printHTML(html, className = '') {
        const line = document.createElement('div');
        line.className = \`output-line \${className}\`;
        line.innerHTML = html;
        this.output.appendChild(line);
    }

    executeCommand(cmdStr) {
        this.printLine(\`\${this.fs.getPrompt()}\${cmdStr}\`, 'cmd-line');
        if (!cmdStr) return;

        // Parse args properly handling quotes (basic)
        const args = cmdStr.match(/\\w+|"[^"]+"|'[^']+'|\\S+/g) || [];
        const command = args[0];
        
        switch (command) {
            case 'help':
                this.cmdHelp();
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            case 'pwd':
                this.printLine(this.fs.currentPath);
                break;
            case 'cd':
                this.cmdCd(args);
                break;
            case 'ls':
                this.cmdLs(args);
                break;
            case 'echo':
                this.printLine(args.slice(1).join(' ').replace(/["']/g, ''));
                break;
            case 'cat':
                this.cmdCat(args);
                break;
            case 'whoami':
                this.printLine(this.fs.user);
                break;
            default:
                this.printLine(\`bash: \${command}: command not found\`, 'error-line');
        }
    }

    cmdHelp() {
        this.printLine('Available commands:');
        this.printLine('  cd [dir]    Change directory');
        this.printLine('  ls [-l|-a]  List directory contents');
        this.printLine('  pwd         Print working directory');
        this.printLine('  cat [file]  Concatenate files and print on the standard output');
        this.printLine('  echo [txt]  Display a line of text');
        this.printLine('  clear       Clear the terminal screen');
        this.printLine('  whoami      Print effective userid');
        this.printLine('  help        Display this help message');
    }

    cmdCd(args) {
        if (args.length === 1) {
            this.fs.currentPath = '/home/user';
            this.updatePrompt();
            return;
        }
        
        let path = args[1];
        let targetNode = this.fs.getNode(path);
        
        if (!targetNode) {
            this.printLine(\`bash: cd: \${path}: No such file or directory\`, 'error-line');
            return;
        }
        
        if (targetNode.type !== 'dir') {
            this.printLine(\`bash: cd: \${path}: Not a directory\`, 'error-line');
            return;
        }
        
        this.fs.currentPath = this.fs.resolvePath(path);
        this.updatePrompt();
    }

    cmdLs(args) {
        let showAll = false;
        let longFormat = false;
        let targetPath = '.';

        // Basic arg parsing
        for (let i = 1; i < args.length; i++) {
            if (args[i].startsWith('-')) {
                if (args[i].includes('a')) showAll = true;
                if (args[i].includes('l')) longFormat = true;
            } else {
                targetPath = args[i];
            }
        }

        let targetNode = this.fs.getNode(targetPath);
        if (!targetNode) {
            this.printLine(\`ls: cannot access '\${targetPath}': No such file or directory\`, 'error-line');
            return;
        }

        if (targetNode.type === 'file') {
            this.printLine(targetNode.name);
            return;
        }

        let contents = Object.values(targetNode.content);
        
        if (showAll) {
            contents.unshift(
                { name: '.', type: 'dir' },
                { name: '..', type: 'dir' }
            );
        } else {
            contents = contents.filter(c => !c.name.startsWith('.'));
        }
        
        contents.sort((a, b) => a.name.localeCompare(b.name));

        if (longFormat) {
            let total = 0; // fake total
            this.printLine(\`total 8\`);
            for (let item of contents) {
                let perms = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
                let links = item.type === 'dir' ? '2' : '1';
                let size = item.type === 'dir' ? '4096' : (item.content ? item.content.length.toString() : '0');
                let date = 'Oct 10 09:00';
                
                let nameHtml = item.type === 'dir' ? \`<span class="dir-color">\${item.name}</span>\` : item.name;
                
                // Align columns simply by padding (in a real term this is more complex)
                let line = \`\${perms} \${links.padStart(2)} \${this.fs.user} \${this.fs.user} \${size.padStart(5)} \${date} \${nameHtml}\`;
                this.printHTML(line);
            }
        } else {
            // Simple space-separated listing
            let out = [];
            for (let item of contents) {
                if (item.type === 'dir') {
                    out.push(\`<span class="dir-color">\${item.name}</span>\`);
                } else {
                    out.push(item.name);
                }
            }
            if (out.length > 0) {
                this.printHTML(out.join('  '));
            }
        }
    }
    
    cmdCat(args) {
        if (args.length === 1) {
            // In a real terminal cat without args waits for stdin. We'll just print error.
            this.printLine('cat: missing operand', 'error-line');
            return;
        }
        
        let targetNode = this.fs.getNode(args[1]);
        if (!targetNode) {
            this.printLine(\`cat: \${args[1]}: No such file or directory\`, 'error-line');
            return;
        }
        
        if (targetNode.type === 'dir') {
            this.printLine(\`cat: \${args[1]}: Is a directory\`, 'error-line');
            return;
        }
        
        this.printLine(targetNode.content || '');
    }
}

// Will be initialized in app.js
let termInstance = null;
