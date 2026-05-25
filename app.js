/**
 * Linux Mastery App Logic
 * Handles UI interactions, rendering, and state management.
 */

class App {
    constructor() {
        this.currentDay = null;
        this.completedDays = this.loadProgress();
        this.streak = this.calculateStreak();
        
        // Cache DOM elements
        this.cacheDOM();
        this.bindEvents();
        
        // Initialize App
        this.init();
    }

    cacheDOM() {
        // Layout
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.appContainer = document.querySelector('.app-container');
        
        // Terminal
        this.terminalToggle = document.getElementById('terminal-toggle');
        this.terminalContainer = document.getElementById('terminal-container');
        this.terminalResize = document.getElementById('terminal-resize-btn');
        this.terminalClear = document.getElementById('terminal-clear-btn');
        this.terminalReset = document.getElementById('terminal-reset-btn');
        
        // Navigation & Search
        this.dayList = document.getElementById('day-list');
        this.phaseFilters = document.getElementById('phase-filters');
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        
        // Content Areas
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.dayContent = document.getElementById('day-content');
        this.welcomePhases = document.getElementById('welcome-phases');
        
        // Stats
        this.statCompleted = document.getElementById('stat-completed');
        this.statTotal = document.getElementById('stat-total');
        this.streakCount = document.getElementById('streak-count');
        this.progressPercent = document.getElementById('progress-percent');
        this.progressRingFill = document.getElementById('progress-ring-fill');
        
        // Day Elements
        this.dayTitle = document.getElementById('day-title');
        this.dayBadge = document.getElementById('day-badge');
        this.dayPhaseTag = document.getElementById('day-phase-tag');
        this.dayDifficulty = document.getElementById('day-difficulty');
        
        // Sections
        this.objectivesList = document.getElementById('objectives-list');
        this.theoryContent = document.getElementById('theory-content');
        this.commandsContent = document.getElementById('commands-content');
        this.exercisesContent = document.getElementById('exercises-content');
        this.tipsContent = document.getElementById('tips-content');
        
        // Buttons
        this.prevBtn = document.getElementById('prev-day');
        this.nextBtn = document.getElementById('next-day');
        this.markCompleteBtn = document.getElementById('mark-complete-btn');
        this.startJourneyBtn = document.getElementById('start-journey-btn');
    }

    bindEvents() {
        // Layout Toggle
        this.sidebarToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('collapsed');
        });
        
        // Terminal Toggle & Controls
        this.terminalToggle.addEventListener('click', () => this.toggleTerminal());
        this.terminalResize.addEventListener('click', () => {
            this.terminalContainer.classList.toggle('expanded');
        });
        this.terminalClear.addEventListener('click', () => {
            if(termInstance) termInstance.executeCommand('clear');
        });
        this.terminalReset.addEventListener('click', () => {
            if(termInstance) {
                termInstance.fs = new FileSystem(); // Reset FS
                termInstance.executeCommand('clear');
                termInstance.printLine('Terminal reset to initial state.', 'info-line');
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + ` (backtick) to toggle terminal
            if (e.ctrlKey && e.key === '\`') {
                e.preventDefault();
                this.toggleTerminal();
            }
            
            // Search focus: /
            if (e.key === '/' && document.activeElement !== this.searchInput && !this.terminalContainer.classList.contains('open')) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });

        // Navigation
        this.prevBtn.addEventListener('click', () => this.navigateDay(-1));
        this.nextBtn.addEventListener('click', () => this.navigateDay(1));
        this.startJourneyBtn.addEventListener('click', () => this.loadDay(1));
        
        // Completion
        this.markCompleteBtn.addEventListener('click', () => this.toggleDayCompletion());
        
        // Search
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.searchResults.classList.add('hidden');
            }
        });

        // Solution Toggles (Event Delegation)
        this.exercisesContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('solution-toggle')) {
                const solution = e.target.nextElementSibling;
                solution.classList.toggle('visible');
                e.target.textContent = solution.classList.contains('visible') ? 'Hide Solution' : 'Show Solution';
            }
        });
        
        // Command Copy (Event Delegation)
        this.commandsContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('command-copy-btn')) {
                const code = e.target.previousElementSibling.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    this.showToast('Command copied to clipboard!', 'success');
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => e.target.textContent = originalText, 2000);
                });
            }
        });
    }

    init() {
        // Initialize Terminal
        termInstance = new Terminal('terminal-container', 'terminal-input', 'terminal-output', 'terminal-prompt');
        
        // Render Initial UI
        this.renderSidebar();
        this.renderWelcomePhases();
        this.updateStats();
        
        // Typewriter effect on welcome
        this.typewriterEffect();
        
        // Hide splash screen after short delay
        setTimeout(() => {
            document.getElementById('splash-loader').classList.add('hidden');
        }, 1500);
    }

    // --- State Management ---
    
    loadProgress() {
        const saved = localStorage.getItem('linuxMasteryProgress');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveProgress() {
        localStorage.setItem('linuxMasteryProgress', JSON.stringify(this.completedDays));
        
        // Update last active date for streak
        const today = new Date().toDateString();
        localStorage.setItem('linuxMasteryLastActive', today);
        
        this.updateStats();
        this.renderSidebar(); // Re-render to show checkmarks
    }
    
    calculateStreak() {
        // Very basic streak calculation for demo
        const lastActive = localStorage.getItem('linuxMasteryLastActive');
        const today = new Date().toDateString();
        if (lastActive === today) return parseInt(localStorage.getItem('linuxMasteryStreak') || 1);
        
        // Real logic would check if it was yesterday
        localStorage.setItem('linuxMasteryStreak', 1);
        return 1;
    }

    // --- Terminal ---
    
    toggleTerminal() {
        this.terminalContainer.classList.toggle('open');
        this.appContainer.classList.toggle('terminal-open');
        
        if (this.terminalContainer.classList.contains('open')) {
            setTimeout(() => {
                document.getElementById('terminal-input').focus();
            }, 300);
        }
    }

    // --- Rendering ---
    
    renderSidebar() {
        this.dayList.innerHTML = '';
        this.phaseFilters.innerHTML = '<button class="phase-filter-btn active" data-phase="all">All Phases</button>';
        
        // Add filter buttons
        PHASES.forEach(phase => {
            const btn = document.createElement('button');
            btn.className = 'phase-filter-btn';
            btn.dataset.phase = phase.id;
            btn.textContent = phase.id;
            btn.addEventListener('click', (e) => this.filterSidebar(e, phase.id));
            this.phaseFilters.appendChild(btn);
        });

        // Group curriculum by phase
        PHASES.forEach(phase => {
            const phaseDays = CURRICULUM.filter(d => d.phaseId === phase.id);
            if (phaseDays.length === 0) return;
            
            const phaseContainer = document.createElement('div');
            phaseContainer.className = 'day-list-phase';
            phaseContainer.dataset.phase = phase.id;
            
            const header = document.createElement('div');
            header.className = 'phase-header';
            header.dataset.color = phase.color;
            header.textContent = phase.name;
            phaseContainer.appendChild(header);
            
            phaseDays.forEach(day => {
                const isCompleted = this.completedDays.includes(day.day);
                const isActive = this.currentDay === day.day;
                
                const dayEl = document.createElement('div');
                dayEl.className = \`day-item \${isCompleted ? 'completed' : ''} \${isActive ? 'active' : ''}\`;
                dayEl.dataset.day = day.day;
                dayEl.addEventListener('click', () => this.loadDay(day.day));
                
                dayEl.innerHTML = \`
                    <div class="day-item-check">\${isCompleted ? '✓' : ''}</div>
                    <div class="day-item-info">
                        <div class="day-item-number">Day \${day.day}</div>
                        <div class="day-item-title" title="\${day.title}">\${day.title}</div>
                    </div>
                \`;
                
                phaseContainer.appendChild(dayEl);
            });
            
            this.dayList.appendChild(phaseContainer);
        });
    }

    filterSidebar(event, phaseId) {
        // Update active button
        document.querySelectorAll('.phase-filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter items
        const groups = document.querySelectorAll('.day-list-phase');
        groups.forEach(group => {
            if (phaseId === 'all' || group.dataset.phase === phaseId) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    }

    renderWelcomePhases() {
        this.welcomePhases.innerHTML = '';
        PHASES.forEach(phase => {
            const card = document.createElement('div');
            card.className = 'welcome-phase-card';
            card.style.borderTopColor = \`var(--accent-\${phase.color})\`;
            
            // Extract short name
            const shortName = phase.name.split(':')[1]?.trim() || phase.name;
            
            card.innerHTML = \`
                <div class="phase-num" style="color: var(--accent-\${phase.color})">\${phase.name.split(':')[0]}</div>
                <h3>\${shortName}</h3>
                <div class="phase-days">\${phase.days}</div>
            \`;
            
            // Click to filter sidebar
            card.addEventListener('click', () => {
                const btn = document.querySelector(\`.phase-filter-btn[data-phase="\${phase.id}"]\`);
                if(btn) btn.click();
            });
            
            this.welcomePhases.appendChild(card);
        });
    }

    updateStats() {
        const total = CURRICULUM.length;
        const completed = this.completedDays.length;
        const percent = Math.round((completed / total) * 100) || 0;
        
        this.statCompleted.textContent = completed;
        this.statTotal.textContent = total;
        this.streakCount.textContent = this.streak;
        
        this.progressPercent.textContent = \`\${percent}%\`;
        
        // Update SVG Ring (circumference is ~113)
        const offset = 113.1 - (113.1 * percent) / 100;
        this.progressRingFill.style.strokeDashoffset = offset;
    }

    // --- Day Loading & Navigation ---
    
    loadDay(dayNumber) {
        const dayData = CURRICULUM.find(d => d.day === dayNumber);
        if (!dayData) return;
        
        this.currentDay = dayNumber;
        const phaseData = PHASES.find(p => p.id === dayData.phaseId);
        
        // Hide Welcome, Show Content
        this.welcomeScreen.classList.add('hidden');
        this.dayContent.classList.remove('hidden');
        
        // Update Sidebar Active State
        document.querySelectorAll('.day-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector(\`.day-item[data-day="\${dayNumber}"]\`);
        if (activeItem) {
            activeItem.classList.add('active');
            // Scroll sidebar if needed
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Header Info
        this.dayTitle.textContent = dayData.title;
        this.dayBadge.textContent = \`Day \${dayData.day}\`;
        
        this.dayPhaseTag.textContent = phaseData ? phaseData.name.split(':')[1].trim() : 'Phase';
        this.dayPhaseTag.style.background = \`var(--accent-\${phaseData.color}-glow)\`;
        this.dayPhaseTag.style.color = \`var(--accent-\${phaseData.color})\`;
        this.dayPhaseTag.style.border = \`1px solid rgba(var(--accent-\${phaseData.color}-rgb), 0.2)\`;
        
        this.dayDifficulty.textContent = dayData.difficulty;
        
        // Navigation Buttons
        this.prevBtn.disabled = dayNumber === 1;
        this.nextBtn.disabled = dayNumber === CURRICULUM.length;
        
        // Render Sections
        this.renderObjectives(dayData.objectives);
        this.renderTheory(dayData.theory);
        this.renderCommands(dayData.commands);
        this.renderExercises(dayData.exercises);
        this.renderTips(dayData.tips);
        
        // Update Completion Button
        this.updateCompletionButtonState();
        
        // Scroll to top
        this.appContainer.querySelector('#main-content').scrollTop = 0;
    }

    navigateDay(direction) {
        if (!this.currentDay) return;
        const newDay = this.currentDay + direction;
        if (newDay > 0 && newDay <= CURRICULUM.length) {
            this.loadDay(newDay);
        }
    }

    // --- Content Rendering Helpers ---
    
    renderObjectives(objectives) {
        const section = document.getElementById('objectives-section');
        if (!objectives || objectives.length === 0) {
            section.classList.add('hidden');
            return;
        }
        section.classList.remove('hidden');
        
        this.objectivesList.innerHTML = objectives.map(obj => \`<li>\${obj}</li>\`).join('');
    }
    
    renderTheory(theoryHTML) {
        const section = document.getElementById('theory-section');
        if (!theoryHTML) {
            section.classList.add('hidden');
            return;
        }
        section.classList.remove('hidden');
        this.theoryContent.innerHTML = theoryHTML;
    }
    
    renderCommands(commands) {
        const section = document.getElementById('commands-section');
        if (!commands || commands.length === 0) {
            section.classList.add('hidden');
            return;
        }
        section.classList.remove('hidden');
        
        this.commandsContent.innerHTML = commands.map(cmd => \`
            <div class="command-block">
                <div class="command-syntax">
                    <code>\${cmd.syntax}</code>
                    <button class="command-copy-btn">Copy</button>
                </div>
                <div class="command-desc">\${cmd.desc}</div>
                \${cmd.example ? \`
                <div class="command-example">
                    <div class="example-label">Example Usage</div>
                    <div>\${cmd.example.replace(/\\n/g, '<br>')}</div>
                </div>
                \` : ''}
            </div>
        \`).join('');
    }
    
    renderExercises(exercises) {
        const section = document.getElementById('exercises-section');
        if (!exercises || exercises.length === 0) {
            section.classList.add('hidden');
            return;
        }
        section.classList.remove('hidden');
        
        this.exercisesContent.innerHTML = exercises.map((ex, index) => \`
            <div class="exercise-item">
                <div class="exercise-number">Exercise \${index + 1}</div>
                <div class="exercise-question">\${ex.question}</div>
                \${ex.hint ? \`<div class="exercise-hint">Hint: \${ex.hint}</div>\` : ''}
                <div class="exercise-solution">
                    <button class="solution-toggle">Show Solution</button>
                    <div class="solution-content">\${ex.solution.replace(/\\n/g, '<br>')}</div>
                </div>
            </div>
        \`).join('');
    }
    
    renderTips(tips) {
        const section = document.getElementById('tips-section');
        if (!tips || tips.length === 0) {
            section.classList.add('hidden');
            return;
        }
        section.classList.remove('hidden');
        
        this.tipsContent.innerHTML = tips.map(tip => \`
            <div class="tip-item">
                <div class="tip-icon">💡</div>
                <div class="tip-text">\${tip.text}</div>
            </div>
        \`).join('');
    }

    // --- Action Handlers ---
    
    toggleDayCompletion() {
        if (!this.currentDay) return;
        
        if (this.completedDays.includes(this.currentDay)) {
            // Already completed, do nothing or unmark
            return; 
        } else {
            this.completedDays.push(this.currentDay);
            this.showToast(\`Awesome! Day \${this.currentDay} completed.\`, 'success');
            
            // Confetti effect could go here
        }
        
        this.saveProgress();
        this.updateCompletionButtonState();
        
        // Auto-navigate after delay
        if (this.currentDay < CURRICULUM.length) {
            setTimeout(() => {
                this.navigateDay(1);
            }, 1500);
        }
    }
    
    updateCompletionButtonState() {
        if (this.completedDays.includes(this.currentDay)) {
            this.markCompleteBtn.classList.add('completed');
            this.markCompleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Completed</span>';
        } else {
            this.markCompleteBtn.classList.remove('completed');
            this.markCompleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Mark Day as Complete</span>';
        }
    }

    handleSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            this.searchResults.classList.add('hidden');
            return;
        }
        
        const results = [];
        
        // Search through curriculum
        CURRICULUM.forEach(day => {
            if (day.title.toLowerCase().includes(query)) {
                results.push({ day: day.day, title: day.title, match: 'Matched title' });
                return;
            }
            
            if (day.commands) {
                for (let cmd of day.commands) {
                    if (cmd.syntax.toLowerCase().includes(query)) {
                        results.push({ day: day.day, title: day.title, match: \`Matched command: \${cmd.syntax}\` });
                        return;
                    }
                }
            }
        });
        
        this.renderSearchResults(results);
    }
    
    renderSearchResults(results) {
        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result-item"><div class="result-title">No results found</div></div>';
        } else {
            // Limit to 5 results
            results.slice(0, 5).forEach(res => {
                const el = document.createElement('div');
                el.className = 'search-result-item';
                el.innerHTML = \`
                    <div class="result-day">Day \${res.day}</div>
                    <div class="result-title">\${res.title}</div>
                    <div class="result-match">\${res.match}</div>
                \`;
                el.addEventListener('click', () => {
                    this.loadDay(res.day);
                    this.searchResults.classList.add('hidden');
                    this.searchInput.value = '';
                });
                this.searchResults.appendChild(el);
            });
        }
        
        this.searchResults.classList.remove('hidden');
    }

    // --- Utilities ---
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        
        toast.innerHTML = \`<span>\${icon}</span><span>\${message}</span>\`;
        container.appendChild(toast);
        
        // Remove after animation completes
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }
    
    typewriterEffect() {
        const el = document.getElementById('welcome-typewriter');
        if (!el) return;
        
        const text = "sudo become_linux_pro";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                el.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Initialize App on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    window.linuxApp = new App();
});
