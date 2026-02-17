// ============================================
// CHECKPOINT TRACKER - Complete Implementation
// ============================================

console.log('Script loaded');

// ============================================
// THEME MANAGEMENT (Disabled - Dark theme always on)
// ============================================

function initializeTheme() {
    // Dark theme toggle removed - using dark mode only
    console.log('✅ Using dark theme (toggle removed)');
}

// ============================================
// TAB SWITCHING
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    console.log('Found', tabButtons.length, 'tab buttons');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            console.log('Switching to tab:', tabId);
            switchToTab(tabId);
        });
    });

    // Attach delete handlers for custom tabs
    attachDeleteHandlers();

    // Set first tab as active on load
    switchToTab('dsa');
}

function attachDeleteHandlers() {
    // Find all nav-tab-wrappers and add delete buttons
    const wrappers = document.querySelectorAll('.nav-tab-wrapper');
    wrappers.forEach(wrapper => {
        const subjectId = wrapper.getAttribute('data-subject');
        const button = wrapper.querySelector('.nav-tab');
        
        // Remove existing delete button if any
        const existingDelete = wrapper.querySelector('.delete-tab-btn');
        if (existingDelete) existingDelete.remove();
        
        // Add delete button to all subjects
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-tab-btn';
        deleteBtn.title = 'Delete subject';
        deleteBtn.innerHTML = '✕';
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const subjectName = button.textContent.trim();
            if (confirm(`Delete "${subjectName}" subject? This cannot be undone.`)) {
                removeSubject(subjectId);
            }
        });
        
        wrapper.appendChild(deleteBtn);
    });
}

function switchToTab(tabId) {
    console.log('Switching to:', tabId);

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(tabId);
    if (section) {
        section.classList.add('active');
        console.log('Activated section:', tabId);
    }

    // Activate button
    const button = document.querySelector(`[data-tab="${tabId}"]`);
    if (button) {
        button.classList.add('active');
        console.log('Activated button:', tabId);
    }

    // Update stats
    updateStats(tabId);
}

// ============================================
// DATA MANAGEMENT
// ============================================

const STORAGE_KEY = 'checkpoint-data';
const SUBJECTS_KEY = 'checkpoint-subjects';

// Default subjects
const DEFAULT_SUBJECTS = [
    { id: 'dsa', name: 'DSA', emoji: '📚' },
    { id: 'java', name: 'Java', emoji: '☕' },
    { id: 'webdev', name: 'Web Dev', emoji: '🌐' },
    { id: 'projects', name: 'Projects', emoji: '🚀' }
];

function getSubjects() {
    const saved = localStorage.getItem(SUBJECTS_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(DEFAULT_SUBJECTS));
    return DEFAULT_SUBJECTS;
}

function addNewSubject(name, emoji) {
    const subjects = getSubjects();
    const id = 'subject-' + Date.now();
    const newSubject = { id, name, emoji };
    subjects.push(newSubject);
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    
    // Add to UI
    addSubjectTab(newSubject);
    addSubjectSection(newSubject);
    
    return newSubject;
}

function getCheckpoints(subjectId) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return data[subjectId] || [];
}

function saveCheckpoint(subjectId, checkpoint) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!data[subjectId]) {
        data[subjectId] = [];
    }

    const index = data[subjectId].findIndex(c => c.id === checkpoint.id);
    if (index > -1) {
        data[subjectId][index] = checkpoint;
    } else {
        data[subjectId].push(checkpoint);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function deleteCheckpoint(subjectId, checkpointId) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data[subjectId]) {
        data[subjectId] = data[subjectId].filter(c => c.id !== checkpointId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

function removeSubject(subjectId) {
    console.log('🗑️ Removing subject:', subjectId);
    
    // Remove from subjects list
    const subjects = getSubjects();
    const updatedSubjects = subjects.filter(s => s.id !== subjectId);
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updatedSubjects));
    
    // Remove from checkpoint data
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete data[subjectId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Remove tab from UI
    const wrapper = document.querySelector(`[data-subject="${subjectId}"]`);
    if (wrapper) wrapper.remove();
    
    // Remove section from UI
    const section = document.getElementById(subjectId);
    if (section) section.remove();
    
    // Switch to first available tab
    const remaining = document.querySelector('.nav-tab');
    if (remaining) {
        const nextTabId = remaining.getAttribute('data-tab');
        switchToTab(nextTabId);
    }
    
    console.log('✅ Subject removed successfully');
    alert('Subject deleted successfully!');
}

// ============================================
// UI UPDATES
// ============================================

function addSubjectTab(subject) {
    const navTabs = document.querySelector('.nav-tabs');
    if (!navTabs) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'nav-tab-wrapper';
    wrapper.setAttribute('data-subject', subject.id);

    // Create button
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.setAttribute('data-tab', subject.id);
    btn.textContent = `${subject.emoji} ${subject.name}`;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchToTab(subject.id);
    });

    wrapper.appendChild(btn);

    // Add delete button (will be created by attachDeleteHandlers for consistency)
    navTabs.appendChild(wrapper);
    attachDeleteHandlers();
}

function addSubjectSection(subject) {
    const container = document.querySelector('.content');
    if (!container) return;
    
    const section = document.createElement('div');
    section.className = 'section';
    section.id = subject.id;
    section.innerHTML = `
        <div class="input-section">
            <h3>Add New Checkpoint</h3>
            <div class="input-group">
                <div class="form-field">
                    <label>Title</label>
                    <input type="text" class="checkpoint-title-input-${subject.id}" placeholder="Enter checkpoint title">
                </div>
                <div class="form-field">
                    <label>Priority</label>
                    <select class="checkpoint-priority-${subject.id}">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-field">
                    <label>Due Date</label>
                    <input type="date" class="checkpoint-date-${subject.id}">
                </div>
            </div>
            <div class="form-field">
                <label>Description</label>
                <textarea class="checkpoint-desc-input-${subject.id}" placeholder="Add details..."></textarea>
            </div>
            <button class="btn btn-primary add-checkpoint-btn" data-subject="${subject.id}">➕ Add Checkpoint</button>
        </div>

        <div class="filter-section">
            <div class="search-box">
                <input type="text" class="search-input-${subject.id}" placeholder="Search checkpoints...">
            </div>
            <button class="btn btn-secondary filter-all-${subject.id}" data-subject="${subject.id}" data-filter="all">All</button>
            <button class="btn btn-secondary filter-high-${subject.id}" data-subject="${subject.id}" data-filter="high">🔴 High</button>
            <button class="btn btn-secondary filter-med-${subject.id}" data-subject="${subject.id}" data-filter="medium">🟡 Medium</button>
            <button class="btn btn-secondary filter-low-${subject.id}" data-subject="${subject.id}" data-filter="low">🟢 Low</button>
        </div>

        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-value" id="total-${subject.id}">0</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="completed-${subject.id}">0</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="progress-${subject.id}">0%</div>
                <div class="stat-label">Progress</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progress-bar-${subject.id}" style="width: 0%;"></div>
                </div>
                <div class="progress-text" id="progress-text-${subject.id}">0 of 0 completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="overdue-${subject.id}">0</div>
                <div class="stat-label">Overdue</div>
            </div>
        </div>

        <div class="checkpoints-list" id="checkpointsList-${subject.id}">
            <div class="empty-state">
                <h3>No checkpoints yet</h3>
                <p>Create your first checkpoint above!</p>
            </div>
        </div>
    `;

    container.appendChild(section);
    attachFormHandlers(subject.id);
    renderCheckpoints(subject.id);
    updateStats(subject.id);
}

// ============================================
// CHECKPOINT RENDERING
// ============================================

function renderCheckpoints(subjectId) {
    // Find container within the section
    const section = document.getElementById(subjectId);
    if (!section) {
        console.warn('Section not found:', subjectId);
        return;
    }

    const container = section.querySelector('.checkpoints-list');
    if (!container) {
        console.warn('Checkpoints list container not found in section:', subjectId);
        return;
    }

    const checkpoints = getCheckpoints(subjectId);

    container.innerHTML = '';

    if (checkpoints.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No checkpoints yet</h3><p>Create your first checkpoint above!</p></div>';
        return;
    }

    checkpoints.forEach(checkpoint => {
        const item = createCheckpointElement(checkpoint, subjectId);
        container.appendChild(item);
    });
}

function createCheckpointElement(checkpoint, subjectId) {
    const item = document.createElement('div');
    item.className = 'checkpoint-item';
    
    const priorityColors = {
        'high': '#ef4444',
        'medium': '#f59e0b',
        'low': '#10b981'
    };

    const color = priorityColors[checkpoint.priority] || '#3b82f6';

    // Format description as vertical bullet points
    let descriptionHTML = '';
    if (checkpoint.description && checkpoint.description.trim()) {
        // Split by newlines or commas and create bullet list
        const descItems = checkpoint.description
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        if (descItems.length > 0) {
            descriptionHTML = `
                <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0; list-style-type: disc;">
                    ${descItems.map(item => `<li style="margin: 0.25rem 0;">${item}</li>`).join('')}
                </ul>
            `;
        }
    }

    item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
            <div style="flex: 1;">
                <input type="checkbox" class="complete-checkbox" data-id="${checkpoint.id}" data-subject="${subjectId}" style="margin-right: 0.75rem; cursor: pointer;" ${checkpoint.completed ? 'checked' : ''}>
                <span class="checkpoint-title" style="${checkpoint.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${checkpoint.title}</span>
                ${descriptionHTML || '<p class="checkpoint-desc" style="margin: 0.5rem 0 0 0; opacity: 0.7;">No description</p>'}
                <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.7;">${checkpoint.date}</p>
            </div>
            <span style="padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background-color: ${color}22; color: ${color}; white-space: nowrap;">
                ${checkpoint.priority?.toUpperCase() || 'MEDIUM'}
            </span>
        </div>
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="edit-checkpoint-btn" data-id="${checkpoint.id}" data-subject="${subjectId}" style="padding: 0.5rem 1rem; border: 1px solid #3b82f6; background: transparent; color: #3b82f6; border-radius: 6px; cursor: pointer; font-weight: 500;">✏️ Edit</button>
            <button class="delete-checkpoint-btn" data-id="${checkpoint.id}" data-subject="${subjectId}" style="padding: 0.5rem 1rem; border: 1px solid #ef4444; background: transparent; color: #ef4444; border-radius: 6px; cursor: pointer; font-weight: 500;">🗑️ Delete</button>
        </div>
    `;

    // Add event listeners
    item.querySelector('.complete-checkbox').addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const subject = e.target.dataset.subject;
        const checkpoints = getCheckpoints(subject);
        const cp = checkpoints.find(c => c.id === id);
        if (cp) {
            cp.completed = e.target.checked;
            saveCheckpoint(subject, cp);
            renderCheckpoints(subject);
            updateStats(subject);
        }
    });

    item.querySelector('.delete-checkpoint-btn').addEventListener('click', (e) => {
        if (confirm('Delete this checkpoint?')) {
            deleteCheckpoint(subjectId, parseInt(e.target.dataset.id));
            renderCheckpoints(subjectId);
            updateStats(subjectId);
        }
    });

    item.querySelector('.edit-checkpoint-btn').addEventListener('click', (e) => {
        const checkpointId = parseInt(e.target.dataset.id);
        showEditCheckpointDialog(checkpoint, subjectId);
    });

    return item;
}

// ============================================
// STATS
// ============================================

function updateStats(subjectId) {
    const section = document.getElementById(subjectId);
    if (!section) return;

    const checkpoints = getCheckpoints(subjectId);
    const total = checkpoints.length;
    const completed = checkpoints.filter(c => c.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    const today = new Date().toISOString().split('T')[0];
    const overdue = checkpoints.filter(c => !c.completed && c.date < today).length;

    // Get stat elements from within the section
    const totalEl = section.querySelector(`#total-${subjectId}`);
    const completedEl = section.querySelector(`#completed-${subjectId}`);
    const progressEl = section.querySelector(`#progress-${subjectId}`);
    const progressBarEl = section.querySelector(`#progress-bar-${subjectId}`);
    const progressTextEl = section.querySelector(`#progress-text-${subjectId}`);
    const overdueEl = section.querySelector(`#overdue-${subjectId}`);

    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (progressEl) progressEl.textContent = progress + '%';
    
    // Update progress bar animation
    if (progressBarEl) {
        progressBarEl.style.width = progress + '%';
    }
    
    // Update progress text
    if (progressTextEl) {
        progressTextEl.textContent = `${completed} of ${total} completed`;
    }
    
    if (overdueEl) overdueEl.textContent = overdue;
}

// ============================================
// FORM HANDLERS
// ============================================

function attachFormHandlers(subjectId) {
    // Get the section
    const section = document.getElementById(subjectId);
    if (!section) {
        console.warn('Section not found:', subjectId);
        return;
    }

    // Map subject IDs to button IDs (they use specific camelCase patterns)
    const buttonIdMap = {
        'dsa': 'addCheckpoint',
        'java': 'addCheckpointJava',
        'webdev': 'addCheckpointWebDev',
        'projects': 'addCheckpointProjects'
    };

    let button = document.getElementById(buttonIdMap[subjectId] || `addCheckpoint${subjectId}`);
    if (!button) {
        button = section.querySelector('.btn-primary');
    }
    if (!button) {
        console.warn('Add button not found in section:', subjectId);
        return;
    }

    console.log('🔗 Attaching handler to button:', button.id, 'for section:', subjectId);

    // Remove existing listeners by cloning the button
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    button = newButton;

    // Add click handler to button
    button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🖱️ Button clicked for subject:', subjectId);
        
        // Get inputs from within this section using dynamic class selectors
        const titleInput = section.querySelector(`[class*="checkpoint-title-input-"]`);
        const descInput = section.querySelector(`[class*="checkpoint-desc-input-"]`);
        const dateInput = section.querySelector(`[class*="checkpoint-date-"]`);
        const priorityInput = section.querySelector(`[class*="checkpoint-priority-"]`);

        if (!titleInput || !dateInput || !priorityInput) {
            console.error('❌ Form inputs not found in section:', subjectId);
            console.error('Available elements in section:', section.querySelectorAll('input, select, textarea'));
            alert('Form elements not found!');
            return;
        }

        const title = titleInput.value?.trim();
        const desc = descInput?.value?.trim() || '';
        const date = dateInput.value;
        const priority = priorityInput.value || 'medium';

        console.log('📝 Form data:', { title, date, priority, desc });

        if (!title) {
            alert('Please enter a title');
            return;
        }
        if (!date) {
            alert('Please select a date');
            return;
        }

        const checkpoint = {
            id: Date.now(),
            title,
            description: desc,
            date,
            priority,
            completed: false
        };

        console.log('💾 Saving checkpoint:', checkpoint, 'to subject:', subjectId);
        saveCheckpoint(subjectId, checkpoint);
        renderCheckpoints(subjectId);
        updateStats(subjectId);

        // Clear form
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
        if (dateInput) dateInput.value = '';
        if (priorityInput) priorityInput.value = 'medium';

        console.log('✅ Checkpoint added successfully');
        alert('✅ Checkpoint added!');
    });

    // Search input
    const searchInput = section.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            const checkpoints = getCheckpoints(subjectId);
            const filtered = checkpoints.filter(c => 
                c.title.toLowerCase().includes(term) || 
                c.description.toLowerCase().includes(term)
            );
            
            const container = section.querySelector('.checkpoints-list');
            container.innerHTML = '';
            
            if (filtered.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No checkpoints found</p></div>';
            } else {
                filtered.forEach(cp => {
                    container.appendChild(createCheckpointElement(cp, subjectId));
                });
            }
        });
    }

    // Filter buttons - use wildcard selector to match dynamic button classes
    let filterButtons = section.querySelectorAll('[class*="filter-"]');
    if (filterButtons.length === 0) {
        console.warn('⚠️ No filter buttons found for subject:', subjectId);
    }
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            let checkpoints = getCheckpoints(subjectId);
            
            if (filter !== 'all') {
                checkpoints = checkpoints.filter(c => c.priority === filter);
            }

            const container = section.querySelector('.checkpoints-list');
            container.innerHTML = '';

            if (checkpoints.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No checkpoints with this priority</p></div>';
            } else {
                checkpoints.forEach(cp => {
                    container.appendChild(createCheckpointElement(cp, subjectId));
                });
            }
        });
    });
}

// ============================================
// ADD SUBJECT DIALOG
// ============================================

function showAddSubjectDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    dialog.innerHTML = `
        <div style="background: var(--color-neutral-800); padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%;">
            <h2 style="margin-top: 0;">Add New Subject</h2>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Subject Name</label>
                <input type="text" id="newSubjectName" placeholder="e.g., DevOps" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100);">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Emoji</label>
                <input type="text" id="newSubjectEmoji" placeholder="🚀" maxlength="2" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100);">
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100); cursor: pointer; font-weight: 600;">Cancel</button>
                <button id="addBtn" style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: #6366f1; color: white; cursor: pointer; font-weight: 600;">Add</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('#cancelBtn').addEventListener('click', () => {
        dialog.remove();
    });

    dialog.querySelector('#addBtn').addEventListener('click', () => {
        const name = dialog.querySelector('#newSubjectName').value.trim();
        const emoji = dialog.querySelector('#newSubjectEmoji').value.trim();

        if (!name) {
            alert('Please enter a subject name');
            return;
        }
        if (!emoji) {
            alert('Please enter an emoji');
            return;
        }

        addNewSubject(name, emoji);
        dialog.remove();
        alert('✅ Subject added!');
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
}

// ============================================
// EDIT CHECKPOINT DIALOG
// ============================================

function showEditCheckpointDialog(checkpoint, subjectId) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    dialog.innerHTML = `
        <div style="background: var(--color-neutral-800); padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h2 style="margin-top: 0;">Edit Checkpoint</h2>
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Title</label>
                <input type="text" id="editTitle" value="${checkpoint.title}" placeholder="Enter checkpoint title" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100);">
            </div>

            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                <textarea id="editDesc" placeholder="Add details... (separate with newlines or commas)" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100); min-height: 100px; font-family: inherit;">${checkpoint.description || ''}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Priority</label>
                    <select id="editPriority" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100);">
                        <option value="low" ${checkpoint.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${checkpoint.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${checkpoint.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Due Date</label>
                    <input type="date" id="editDate" value="${checkpoint.date}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-neutral-600); border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100);">
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="cancelEditBtn" style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: var(--color-neutral-700); color: var(--color-neutral-100); cursor: pointer; font-weight: 600;">Cancel</button>
                <button id="saveEditBtn" style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: #10b981; color: white; cursor: pointer; font-weight: 600;">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('#cancelEditBtn').addEventListener('click', () => {
        dialog.remove();
    });

    dialog.querySelector('#saveEditBtn').addEventListener('click', () => {
        const title = dialog.querySelector('#editTitle').value.trim();
        const description = dialog.querySelector('#editDesc').value.trim();
        const date = dialog.querySelector('#editDate').value;
        const priority = dialog.querySelector('#editPriority').value;

        if (!title) {
            alert('Please enter a title');
            return;
        }
        if (!date) {
            alert('Please select a date');
            return;
        }

        // Update checkpoint
        checkpoint.title = title;
        checkpoint.description = description;
        checkpoint.date = date;
        checkpoint.priority = priority;

        // Save updated checkpoint
        saveCheckpoint(subjectId, checkpoint);
        console.log('✅ Checkpoint updated:', checkpoint);
        
        // Close dialog and refresh display
        dialog.remove();
        renderCheckpoints(subjectId);
        updateStats(subjectId);
        alert('✅ Checkpoint updated!');
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
}

// ============================================
// EXPORT DATA FEATURE
// ============================================

function exportData() {
    console.log('📥 Starting PDF export...');
    
    // Collect all data
    const subjects = getSubjects();
    const exportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create HTML content for PDF
    let htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h1 style="text-align: center; color: #6366f1; margin-bottom: 0.5rem;">📚 Checkpoint Tracker Report</h1>
            <p style="text-align: center; color: #666; margin-bottom: 2rem; font-size: 14px;">
                Generated on ${exportDate}
            </p>
            
            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0;">
    `;
    
    let totalCheckpoints = 0;
    let totalCompleted = 0;
    
    // Add content for each subject
    subjects.forEach((subject, index) => {
        const checkpoints = getCheckpoints(subject.id);
        const completed = checkpoints.filter(c => c.completed).length;
        const progress = checkpoints.length === 0 ? 0 : Math.round((completed / checkpoints.length) * 100);
        
        totalCheckpoints += checkpoints.length;
        totalCompleted += completed;
        
        htmlContent += `
            <div style="margin-bottom: 2.5rem; page-break-inside: avoid;">
                <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    ${subject.emoji} ${subject.name}
                </h2>
                
                <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div>
                        <span style="font-weight: bold; color: #6366f1;">Total:</span> ${checkpoints.length}
                    </div>
                    <div>
                        <span style="font-weight: bold; color: #10b981;">Completed:</span> ${completed}
                    </div>
                    <div>
                        <span style="font-weight: bold; color: #666;">Progress:</span> ${progress}%
                    </div>
                </div>
        `;
        
        if (checkpoints.length === 0) {
            htmlContent += `<p style="color: #999; font-style: italic;">No checkpoints yet</p>`;
        } else {
            htmlContent += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                <tr style="background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 0.75rem; text-align: left; border: 1px solid #e5e7eb;">✓</th>
                    <th style="padding: 0.75rem; text-align: left; border: 1px solid #e5e7eb;">Title</th>
                    <th style="padding: 0.75rem; text-align: center; border: 1px solid #e5e7eb;">Priority</th>
                    <th style="padding: 0.75rem; text-align: center; border: 1px solid #e5e7eb;">Due Date</th>
                </tr>
            `;
            
            checkpoints.forEach(cp => {
                const priorityColor = cp.priority === 'high' ? '#ef4444' : cp.priority === 'medium' ? '#f59e0b' : '#10b981';
                htmlContent += `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 0.75rem; text-align: center; border: 1px solid #e5e7eb;">
                            ${cp.completed ? '✓' : '○'}
                        </td>
                        <td style="padding: 0.75rem; border: 1px solid #e5e7eb; ${cp.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                            ${cp.title}
                            ${cp.description ? `<br><span style="color: #666; font-size: 12px;">📝 ${cp.description}</span>` : ''}
                        </td>
                        <td style="padding: 0.75rem; text-align: center; border: 1px solid #e5e7eb; color: ${priorityColor}; font-weight: bold;">
                            ${cp.priority?.toUpperCase() || 'MEDIUM'}
                        </td>
                        <td style="padding: 0.75rem; text-align: center; border: 1px solid #e5e7eb;">
                            ${cp.date}
                        </td>
                    </tr>
                `;
            });
            
            htmlContent += `</table>`;
        }
        
        htmlContent += `</div>`;
        
        // Add page break between subjects (except last one)
        if (index < subjects.length - 1) {
            htmlContent += `<div style="page-break-after: always;"></div>`;
        }
    });
    
    // Add summary at the end
    const totalProgress = totalCheckpoints === 0 ? 0 : Math.round((totalCompleted / totalCheckpoints) * 100);
    
    htmlContent += `
        <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0;">
        <div style="background-color: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
            <h3 style="color: #6366f1; margin-top: 0;">📊 Overall Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div>
                    <span style="font-weight: bold; color: #6366f1;">Total Checkpoints:</span><br>
                    <span style="font-size: 24px; font-weight: bold; color: #6366f1;">${totalCheckpoints}</span>
                </div>
                <div>
                    <span style="font-weight: bold; color: #10b981;">Completed:</span><br>
                    <span style="font-size: 24px; font-weight: bold; color: #10b981;">${totalCompleted}</span>
                </div>
                <div>
                    <span style="font-weight: bold; color: #666;">Pending:</span><br>
                    <span style="font-size: 24px; font-weight: bold; color: #666;">${totalCheckpoints - totalCompleted}</span>
                </div>
                <div>
                    <span style="font-weight: bold; color: #6366f1;">Overall Progress:</span><br>
                    <span style="font-size: 24px; font-weight: bold; color: #6366f1;">${totalProgress}%</span>
                </div>
            </div>
        </div>
        </div>
    `;
    
    // Generate PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    const opts = {
        margin: 10,
        filename: `checkpoint-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opts).from(element).save();
    
    console.log('✅ PDF exported successfully');
    alert('✅ Report exported as PDF!');
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    console.log('🚀 Initializing checkpoint app...');

    // Initialize theme
    initializeTheme();
    console.log('✅ Theme initialized');

    // Get all subjects from localStorage
    const subjects = getSubjects();
    console.log('Found subjects:', subjects);

    // Render all tabs from localStorage
    const navTabs = document.querySelector('.nav-tabs');
    navTabs.innerHTML = ''; // Clear any existing tabs
    
    subjects.forEach((subject, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-tab-wrapper';
        wrapper.setAttribute('data-subject', subject.id);

        const btn = document.createElement('button');
        btn.className = 'nav-tab';
        if (index === 0) btn.classList.add('active'); // Make first tab active
        btn.setAttribute('data-tab', subject.id);
        btn.textContent = `${subject.emoji} ${subject.name}`;
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchToTab(subject.id);
        });

        wrapper.appendChild(btn);
        navTabs.appendChild(wrapper);

        // Create section for this subject
        addSubjectSection(subject);
    });

    // Attach delete handlers after creating tabs
    attachDeleteHandlers();

    // Initialize all sections
    subjects.forEach(subject => {
        attachFormHandlers(subject.id);
        renderCheckpoints(subject.id);
        updateStats(subject.id);
    });

    // Set first subject as active if available
    if (subjects.length > 0) {
        switchToTab(subjects[0].id);
    }

    // Add subject button to header
    const headerControls = document.querySelector('.header-controls');
    if (headerControls) {
        const existingAddBtn = headerControls.querySelector('[data-add-subject]');
        if (!existingAddBtn) {
            const addSubjectBtn = document.createElement('button');
            addSubjectBtn.className = 'btn btn-secondary';
            addSubjectBtn.textContent = '+ Add Subject';
            addSubjectBtn.setAttribute('data-add-subject', 'true');
            addSubjectBtn.style.marginLeft = '1rem';
            addSubjectBtn.addEventListener('click', showAddSubjectDialog);
            headerControls.appendChild(addSubjectBtn);
            console.log('✅ Add Subject button added');
        }
    }

    // Attach export button handler
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
        console.log('✅ Export button attached');
    }

    console.log('✅ App fully initialized!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    console.log('Waiting for DOM to load...');
} else {
    init();
}

