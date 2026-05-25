/**
 * Linux Mastery Curriculum Data
 * Structure for the 120-day journey.
 */

const PHASES = [
    { id: 'basics', name: 'Phase 1: The Foundation', color: 'green', days: 'Days 1-15' },
    { id: 'files', name: 'Phase 2: File System & Permissions', color: 'blue', days: 'Days 16-30' },
    { id: 'processes', name: 'Phase 3: Processes & System Monitoring', color: 'purple', days: 'Days 31-45' },
    { id: 'networking', name: 'Phase 4: Networking & Security', color: 'orange', days: 'Days 46-60' },
    { id: 'scripting', name: 'Phase 5: Shell Scripting Basics', color: 'cyan', days: 'Days 61-75' },
    { id: 'advanced-scripting', name: 'Phase 6: Advanced Scripting & Automation', color: 'pink', days: 'Days 76-90' },
    { id: 'services', name: 'Phase 7: Services & Daemons', color: 'yellow', days: 'Days 91-105' },
    { id: 'pro', name: 'Phase 8: Pro System Administration', color: 'red', days: 'Days 106-120' }
];

const CURRICULUM = [
    {
        day: 1,
        phaseId: 'basics',
        title: 'Welcome to the Terminal',
        difficulty: 'Beginner',
        objectives: [
            'Understand what the Linux terminal is',
            'Learn the anatomy of a command',
            'Master basic navigation commands (pwd, ls, cd)'
        ],
        theory: `
            <h4>What is the Terminal?</h4>
            <p>The terminal (or command-line interface) is a text-based way to interact with your computer. Unlike a Graphical User Interface (GUI) where you click buttons, in the terminal you type commands to tell the system what to do.</p>
            
            <h4>The Shell</h4>
            <p>When you type in the terminal, a program called the "shell" interprets your commands. The most common shell in Linux is <strong>Bash</strong> (Bourne Again SHell). It takes your commands and passes them to the operating system to execute.</p>
            
            <h4>The Anatomy of a Command</h4>
            <p>A typical Linux command has three parts:</p>
            <code>command [options] [arguments]</code>
            <ul>
                <li><strong>command</strong>: The action to perform (e.g., <code>ls</code>)</li>
                <li><strong>options</strong>: Modifies the behavior, usually starting with a dash (e.g., <code>-l</code>)</li>
                <li><strong>arguments</strong>: What the command acts upon, like a file or directory (e.g., <code>/Documents</code>)</li>
            </ul>
            
            <div class="note-box">
                <strong>Note:</strong> Linux is case-sensitive! <code>Desktop</code> is different from <code>desktop</code>.
            </div>
        `,
        commands: [
            {
                syntax: 'pwd',
                desc: 'Print Working Directory. Tells you exactly where you are in the file system.',
                example: 'user@linuxmastery:~$ pwd\n/home/user'
            },
            {
                syntax: 'ls [options] [directory]',
                desc: 'List contents of a directory. By default, lists the current directory.',
                example: 'user@linuxmastery:~$ ls\nDocuments Downloads Music Pictures'
            },
            {
                syntax: 'cd [directory]',
                desc: 'Change Directory. Used to navigate through the file system.',
                example: 'user@linuxmastery:~$ cd Documents\nuser@linuxmastery:~/Documents$'
            }
        ],
        exercises: [
            {
                question: 'Find out your current location in the file system.',
                hint: 'Use the command that prints the working directory.',
                solution: 'pwd'
            },
            {
                question: 'List the files and folders in your current directory.',
                hint: 'Use the list command.',
                solution: 'ls'
            }
        ],
        tips: [
            {
                text: 'You can use the Up and Down arrow keys in the terminal to cycle through commands you have previously typed.'
            },
            {
                text: 'Pressing <code>Tab</code> will auto-complete file and directory names.'
            }
        ]
    },
    {
        day: 2,
        phaseId: 'basics',
        title: 'Exploring the File System',
        difficulty: 'Beginner',
        objectives: [
            'Understand the Linux directory structure',
            'Use absolute vs relative paths',
            'Learn advanced listing options (ls -l, ls -a)'
        ],
        theory: `
            <h4>The Linux Directory Tree</h4>
            <p>In Linux, everything starts at the root directory, represented by a forward slash <code>/</code>. Unlike Windows which has drive letters (C:, D:), Linux places all files and devices under this single tree.</p>
            
            <h4>Important Directories:</h4>
            <ul>
                <li><code>/home</code>: Where user personal files are stored.</li>
                <li><code>/etc</code>: System-wide configuration files.</li>
                <li><code>/var</code>: Variable data like logs and databases.</li>
                <li><code>/bin</code>: Essential command binaries (programs).</li>
            </ul>

            <h4>Absolute vs Relative Paths</h4>
            <p>An <strong>absolute path</strong> always starts from the root (<code>/</code>). Example: <code>/home/user/Documents</code>.</p>
            <p>A <strong>relative path</strong> starts from your current directory. Example: if you are in <code>/home/user</code>, the relative path to Documents is just <code>Documents</code>.</p>
            
            <p>Special relative paths:</p>
            <ul>
                <li><code>.</code> (single dot): Current directory</li>
                <li><code>..</code> (double dot): Parent directory (one level up)</li>
                <li><code>~</code> (tilde): Your home directory</li>
            </ul>
        `,
        commands: [
            {
                syntax: 'ls -l',
                desc: 'Long format listing. Shows permissions, owner, size, and modification date.',
                example: 'user@linuxmastery:~$ ls -l\ndrwxr-xr-x 2 user user 4096 Oct 10 09:00 Documents'
            },
            {
                syntax: 'ls -a',
                desc: 'List ALL files, including hidden files (files starting with a dot).',
                example: 'user@linuxmastery:~$ ls -a\n. .. .bashrc Documents'
            },
            {
                syntax: 'cd ..',
                desc: 'Move up one directory level.',
                example: 'user@linuxmastery:~/Documents$ cd ..\nuser@linuxmastery:~$'
            }
        ],
        exercises: [
            {
                question: 'Navigate to your home directory, then move up one level. Where are you?',
                hint: 'Use cd ~ to go home, then cd .. to go up.',
                solution: 'cd ~\ncd ..\npwd\n# Output: /home'
            },
            {
                question: 'List all files (including hidden ones) in detailed format.',
                hint: 'You can combine options like -l and -a.',
                solution: 'ls -la'
            }
        ],
        tips: [
            {
                text: 'You can combine command options! <code>ls -l -a</code> is exactly the same as <code>ls -la</code>.'
            },
            {
                text: 'Typing just <code>cd</code> with no arguments always takes you back to your home directory.'
            }
        ]
    }
];

// Generate placeholder days up to 120
for (let i = 3; i <= 120; i++) {
    let phaseId = 'basics';
    if (i > 15) phaseId = 'files';
    if (i > 30) phaseId = 'processes';
    if (i > 45) phaseId = 'networking';
    if (i > 60) phaseId = 'scripting';
    if (i > 75) phaseId = 'advanced-scripting';
    if (i > 90) phaseId = 'services';
    if (i > 105) phaseId = 'pro';

    CURRICULUM.push({
        day: i,
        phaseId: phaseId,
        title: \`Day \${i} Placeholder\`,
        difficulty: 'Pending Notes...',
        objectives: ['Pending User Notes...'],
        theory: '<p>Awaiting user notes for this day. Once provided, this section will be updated with detailed research and concepts.</p>',
        commands: [],
        exercises: [],
        tips: []
    });
}
