// ==========================================
// ADVANCED UTILITIES & HELPER FUNCTIONS
// ==========================================

// 1. LOCAL STORAGE MANAGER
const StorageManager = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch(e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch(e) {
            console.error('Retrieval error:', e);
            return defaultValue;
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear();
    }
};

// 2. DATE UTILITIES
const DateUtils = {
    formatDate: (date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    },
    
    getDaysDiff: (date1, date2 = new Date()) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
    },
    
    isOverdue: (dueDate) => this.getDaysDiff(dueDate) < 0,
    
    daysUntil: (date) => {
        const diff = this.getDaysDiff(date);
        return diff < 0 ? `Overdue by ${Math.abs(diff)} days` : `${diff} days left`;
    }
};

// 3. ARRAY UTILITIES
const ArrayUtils = {
    unique: (arr) => [...new Set(arr)],
    
    shuffle: (arr) => {
        const shuffled = [...arr];
        for(let i = shuffled.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    chunk: (arr, size) => {
        const chunks = [];
        for(let i = 0; i < arr.length; i += size){
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    
    groupBy: (arr, key) => {
        return arr.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }
};

// 4. STRING UTILITIES
const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    
    slugify: (str) => str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    
    truncate: (str, length) => str.length > length ? str.slice(0, length) + '...' : str,
    
    reverse: (str) => str.split('').reverse().join(''),
    
    isPalindrome: (str) => {
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === clean.split('').reverse().join('');
    }
};

// 5. MATH UTILITIES
const MathUtils = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    
    sum: (arr) => arr.reduce((a, b) => a + b, 0),
    
    average: (arr) => arr.length ? MathUtils.sum(arr) / arr.length : 0,
    
    factorial: (n) => n <= 1 ? 1 : n * MathUtils.factorial(n - 1),
    
    fibonacci: (n) => n <= 1 ? n : MathUtils.fibonacci(n - 1) + MathUtils.fibonacci(n - 2),
    
    isPrime: (n) => {
        if(n <= 1) return false;
        if(n <= 3) return true;
        if(n % 2 === 0 || n % 3 === 0) return false;
        for(let i = 5; i * i <= n; i += 6){
            if(n % i === 0 || n % (i + 2) === 0) return false;
        }
        return true;
    }
};

// 6. VALIDATION UTILITIES
const Validators = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    
    isPhoneNumber: (phone) => /^\d{10,}$/.test(phone.replace(/\D/g, '')),
    
    isStrongPassword: (pwd) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
    },
    
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch(e) {
            return false;
        }
    },
    
    isEmpty: (val) => !val || (typeof val === 'string' && !val.trim())
};

// 7. TIMER & DEBOUNCE
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const throttle = (func, limit) => {
    let isThrottled = false;
    return (...args) => {
        if(!isThrottled){
            func(...args);
            isThrottled = true;
            setTimeout(() => isThrottled = false, limit);
        }
    };
};

// 8. PERFORMANCE MONITOR
const PerformanceMonitor = {
    measure: (name, fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// 9. CONSOLE LOGGER
const Logger = {
    log: (msg) => console.log(`[LOG] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    success: (msg) => console.log(`%c[SUCCESS] ${msg}`, 'color: green; font-weight: bold;'),
    info: (msg) => console.log(`%c[INFO] ${msg}`, 'color: blue;')
};

// 10. API HELPER
const API = {
    async get(url, headers = {}) {
        try {
            const response = await fetch(url, { method: 'GET', headers });
            return await response.json();
        } catch(e) {
            Logger.error(`GET request failed: ${e.message}`);
            throw e;
        }
    },
    
    async post(url, data, headers = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch(e) {
            Logger.error(`POST request failed: ${e.message}`);
            throw e;
        }
    }
};

Logger.success('Advanced utilities loaded!');
