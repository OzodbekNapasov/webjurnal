// Dars Jadvali App Logic - Version 8.0 (Excel Calendar Grid & Cohort Management)

// ==========================================
// 1. DATABASE & STATE MANAGEMENT (localStorage)
// ==========================================

const DEFAULT_SECTIONS = [
    { id: 1, name: "Tibbiyotda axborot texnologiyalari" }
];

const CALENDAR_MON_LIST = [
    "2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28", // Sep
    "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", // Oct
    "2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30", // Nov
    "2026-12-07", "2026-12-14", "2026-12-21", "2026-12-28", // Dec
    "2026-01-04", "2026-01-11", "2026-01-18", "2026-01-25", // Jan
    "2026-02-01", "2026-02-08", "2026-02-15", "2026-02-22", // Feb
    "2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", // Mar
    "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26", // Apr
    "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24", "2026-05-31", // May
    "2026-06-01", "2026-06-08", "2026-06-15", "2026-06-22", "2026-06-29"  // June
];

const DEFAULT_ACADEMIC_GRAPHS = [
    {
        id: 1,
        name: "201",
        weeks: {
            "2026-09-07": "1", "2026-09-14": "2", "2026-09-21": "3", "2026-09-28": "4",
            "2026-10-05": "5", "2026-10-12": "6", "2026-10-19": "7", "2026-10-26": "8",
            "2026-11-02": "9", "2026-11-09": "10", "2026-11-16": "11", "2026-11-23": "12", "2026-11-30": "13",
            "2026-12-07": "14", "2026-12-14": "15", "2026-12-21": "16", "2026-12-28": "T",
            "2026-01-04": "T", "2026-01-11": "17", "2026-01-18": "18", "2026-01-25": "19",
            "2026-02-01": "20", "2026-02-08": "T", "2026-02-15": "T",
            "2026-02-22": "1", "2026-03-01": "2", "2026-03-08": "3", "2026-03-15": "4", "2026-03-22": "5", "2026-03-29": "6",
            "2026-04-05": "7", "2026-04-12": "8", "2026-04-19": "9", "2026-04-26": "10",
            "2026-05-03": "11", "2026-05-10": "12", "2026-05-17": "13", "2026-05-24": "14", "2026-05-31": "15"
        }
    }
];

const DEFAULT_GROUPS = [
    { id: 1, name: "25-19", graphId: 1 },
    { id: 2, name: "25-20", graphId: 1 },
    { id: 3, name: "25-21", graphId: 1 },
    { id: 4, name: "25-22", graphId: 1 }
];

const CARD_GRADIENTS = [
    "bg-gradient-to-r from-[#ff6b00] to-[#ff3b30] text-white shadow-[0_4px_20px_rgba(255,59,48,0.25)]",
    "bg-gradient-to-r from-[#00c853] to-[#00b0ff] text-white shadow-[0_4px_20px_rgba(0,176,255,0.25)]",
    "bg-gradient-to-r from-[#d500f9] to-[#7c4dff] text-white shadow-[0_4px_20px_rgba(124,77,255,0.25)]",
    "bg-gradient-to-r from-[#00b0ff] to-[#00e5ff] text-white shadow-[0_4px_20px_rgba(0,229,255,0.25)]",
    "bg-gradient-to-r from-[#ffaa00] to-[#ff5500] text-white shadow-[0_4px_20px_rgba(255,85,0,0.25)]"
];

// Helper to expand ranges like "1-17" to "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17"
function expandRange(rangeStr) {
    const parts = rangeStr.split("-");
    if (parts.length === 2) {
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);
        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr.join(",");
    }
    return rangeStr;
}

// Start with completely empty lessons for the teacher's fresh setup
const DEFAULT_LESSONS = [];

const DEFAULT_SETTINGS = {
    themeMode: "system",
    currentWeek: 1,
    teacherName: "Napasov O.",
    teacherSubject: "Tibbiyotda axborot texnologiyalari",
    widgetStyle: "full",
    semesterStartDate: "2026-09-07",
    bellSchedule: {
        "1": {
            "1": { start: "08:30", end: "09:50" },
            "2": { start: "10:00", end: "11:20" },
            "3": { start: "11:40", end: "13:00" }, // 20-min break
            "4": { start: "13:10", end: "14:50" },
            "5": { start: "15:00", end: "16:20" },
            "6": { start: "16:30", end: "17:50" }
        },
        "2": {
            "1": { start: "13:30", end: "14:50" },
            "2": { start: "15:00", end: "16:20" },
            "3": { start: "16:30", end: "17:50" },
            "4": { start: "18:00", end: "19:20" },
            "5": { start: "19:30", end: "20:50" },
            "6": { start: "21:00", end: "22:20" }
        }
    }
};

// State Object
let state = {
    sections: [],
    groups: [],
    lessons: [],
    academicGraphs: [],
    settings: {},
    activeTab: "home",
    scheduleSelectedDay: new Date().getDay() || 1,
    scheduleViewMode: "daily"
};

// Global variables to track dragging for week selection
let isDraggingWeeks = false;
let dragSelectMode = true; // true = select, false = deselect

// Auto calculate current week number based on start date
function calculateCurrentWeek() {
    if (!state.settings.semesterStartDate) return 1;
    
    const start = new Date(state.settings.semesterStartDate);
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diffToMonday); // normalize start to Monday
    start.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffTime = now - start;
    if (diffTime < 0) return 1; // Before semester start
    
    const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.min(20, Math.max(1, diffWeeks));
}

// Helper to fetch groups from Supabase REST API
async function fetchSupabaseGroups() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('supabaseUrl');
    const key = params.get('supabaseKey');
    if (!url || !key) return null;
    
    try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;
        const response = await fetch(`${url}/rest/v1/groups?select=id,name`, {
            method: 'GET',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            },
            signal: controller ? controller.signal : undefined
        });
        if (timeoutId) clearTimeout(timeoutId);
        if (response.ok) {
            const data = await response.json();
            return data.map(g => ({
                id: Number(g.id),
                name: g.name,
                graphId: 1
            }));
        }
    } catch (e) {
        console.warn("Failed to fetch groups from Supabase REST API:", e);
    }
    return null;
}

function isSupabaseEnabled() {
    const params = new URLSearchParams(window.location.search);
    return !!(params.get('supabaseUrl') && params.get('supabaseKey'));
}

async function supabaseGroupMutate(action, id, payload) {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('supabaseUrl');
    const key = params.get('supabaseKey');
    const techSchool = params.get('techSchool') || 'shahrisabz';
    if (!url || !key) return null;

    const headers = {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
    };

    try {
        if (action === 'insert') {
            headers['Prefer'] = 'return=representation';
            const response = await fetch(`${url}/rest/v1/groups`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: payload.name,
                    tech_school: techSchool
                })
            });
            if (response.ok) {
                const data = await response.json();
                return data[0];
            }
        } else if (action === 'update') {
            const response = await fetch(`${url}/rest/v1/groups?id=eq.${id}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    name: payload.name
                })
            });
            if (response.ok) {
                return true;
            }
        } else if (action === 'delete') {
            const response = await fetch(`${url}/rest/v1/groups?id=eq.${id}`, {
                method: 'DELETE',
                headers: headers
            });
            if (response.ok) {
                return true;
            }
        }
    } catch (e) {
        console.error(`Supabase group mutation error (${action}):`, e);
    }
    return null;
}


function setupBackButtons() {
    const params = new URLSearchParams(window.location.search);
    const techSchool = params.get('techSchool') || 'shahrisabz';
    
    const backBtn = document.getElementById("back-to-journal-btn");
    if (backBtn) {
        backBtn.href = `/?techSchool=${encodeURIComponent(techSchool)}`;
    }
    
    const backMobileBtn = document.getElementById("back-to-journal-mobile");
    if (backMobileBtn) {
        backMobileBtn.href = `/?techSchool=${encodeURIComponent(techSchool)}`;
    }
}

// Initialize Database from Server (data.json) or LocalStorage fallback
async function initDb() {
    setupBackButtons();
    
    // Fetch Supabase groups dynamically
    const supabaseGroups = await fetchSupabaseGroups();
    
    let serverData = null;
    try {
        const response = await fetch("data.json");
        if (response.ok) {
            serverData = await response.json();
        }
    } catch (e) {
        console.warn("Could not load data.json from server.", e);
    }

    const defaultSecs = serverData?.sections || DEFAULT_SECTIONS;
    const defaultGrps = serverData?.groups || DEFAULT_GROUPS;
    const defaultLess = serverData?.lessons || DEFAULT_LESSONS;
    const defaultSets = serverData?.settings || DEFAULT_SETTINGS;
    const defaultGphs = serverData?.academicGraphs || DEFAULT_ACADEMIC_GRAPHS;

    // Read saved data from localStorage first
    const localSecsRaw = localStorage.getItem("dars_sections");
    const localGrpsRaw = localStorage.getItem("dars_groups");
    const localLessRaw = localStorage.getItem("dars_lessons");
    const localSetsRaw = localStorage.getItem("dars_settings");
    const localGphsRaw = localStorage.getItem("dars_academic_graphs");

    // Sections (Fanlar)
    if (localSecsRaw) {
        try { state.sections = JSON.parse(localSecsRaw); } catch(e) { state.sections = defaultSecs; }
    } else {
        state.sections = defaultSecs;
    }

    // Lessons (Darslar)
    if (localLessRaw) {
        try { state.lessons = JSON.parse(localLessRaw); } catch(e) { state.lessons = defaultLess; }
    } else {
        state.lessons = defaultLess;
    }

    // Settings (Sozlamalar & O'qituvchi ma'lumotlari)
    let mergedSettings = defaultSets;
    if (localSetsRaw) {
        try {
            const parsed = JSON.parse(localSetsRaw);
            if (parsed && typeof parsed === 'object') {
                mergedSettings = { ...defaultSets, ...parsed };
            }
        } catch(e) {}
    }
    state.settings = mergedSettings;

    // Academic Graphs (Grafiklar)
    if (localGphsRaw) {
        try { state.academicGraphs = JSON.parse(localGphsRaw); } catch(e) { state.academicGraphs = defaultGphs; }
    } else {
        state.academicGraphs = defaultGphs;
    }

    // Groups (Guruhlar)
    let baseGroups = defaultGrps;
    if (supabaseGroups && supabaseGroups.length > 0) {
        baseGroups = supabaseGroups;
    } else if (localGrpsRaw) {
        try { baseGroups = JSON.parse(localGrpsRaw); } catch(e) {}
    }

    state.groups = baseGroups.map(g => ({
        id: g.id,
        name: g.name,
        graphId: g.graphId || 1
    }));

    // Update settings.currentWeek dynamically
    state.settings.currentWeek = calculateCurrentWeek();

    // Persist current state to localStorage
    saveStateToStorage();
}

function loadStateFromStorage() {
    state.sections = JSON.parse(localStorage.getItem("dars_sections"));
    state.groups = (JSON.parse(localStorage.getItem("dars_groups")) || []).map(g => {
        return {
            id: g.id,
            name: g.name,
            graphId: g.graphId || 1
        };
    });
    state.settings = JSON.parse(localStorage.getItem("dars_settings"));
    state.academicGraphs = JSON.parse(localStorage.getItem("dars_academic_graphs")) || DEFAULT_ACADEMIC_GRAPHS;

    // Ensure settings are default if missing
    if (!state.settings.bellSchedule) {
        state.settings.bellSchedule = DEFAULT_SETTINGS.bellSchedule;
    }
    if (!state.settings.semesterStartDate) {
        state.settings.semesterStartDate = DEFAULT_SETTINGS.semesterStartDate;
    }
    
    // Auto calculate current week
    state.settings.currentWeek = calculateCurrentWeek();

    // Map lessons and clean up any remaining room references
    let rawLessons = JSON.parse(localStorage.getItem("dars_lessons")) || [];
    state.lessons = rawLessons.map(l => {
        return {
            id: l.id,
            sectionId: l.sectionId,
            groupId: l.groupId,
            weeks: l.weeks,
            dayOfWeek: l.dayOfWeek,
            shift: l.shift || 1,
            period: l.period || 1,
            teacher: state.settings.teacherName,
            note: l.note || ""
        };
    });

    saveStateToStorage();
}

function saveStateToStorage() {
    // 1. Save locally as backup
    localStorage.setItem("dars_sections", JSON.stringify(state.sections));
    localStorage.setItem("dars_groups", JSON.stringify(state.groups));
    localStorage.setItem("dars_lessons", JSON.stringify(state.lessons));
    localStorage.setItem("dars_settings", JSON.stringify(state.settings));
    localStorage.setItem("dars_academic_graphs", JSON.stringify(state.academicGraphs));

    // 2. Post payload to backend server
    const payload = {
        sections: state.sections,
        groups: state.groups,
        lessons: state.lessons,
        settings: state.settings,
        academicGraphs: state.academicGraphs
    };
    
    fetch("api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            updateSaveStatus(true);
        } else {
            updateSaveStatus(false);
        }
    })
    .catch(err => {
        console.warn("Failed to post updates to server api. Saving to browser fallback.", err);
        updateSaveStatus(false);
    });
}

function updateSaveStatus(isSynced) {
    const badgeText = document.getElementById("offline-badge-text");
    const badgeDot = document.getElementById("offline-badge-dot");
    if (!badgeText || !badgeDot) return;
    
    if (isSynced) {
        badgeText.textContent = "Loyiha fayliga saqlandi";
        badgeDot.className = "w-2.5 h-2.5 rounded-full bg-[#00d2ff] animate-pulse";
    } else {
        badgeText.textContent = "Brauzerga saqlandi";
        badgeDot.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse";
    }
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function getDayName(dayNum) {
    const days = {
        1: "Dushanba",
        2: "Seshanba",
        3: "Chorshanba",
        4: "Payshanba",
        5: "Juma",
        6: "Shanba",
        7: "Yakshanba",
        0: "Yakshanba"
    };
    return days[dayNum] || "";
}

function getMonthNameUz(monthNum) {
    const months = {
        1: "Yanvar", 2: "Fevral", 3: "Mart", 4: "Aprel",
        5: "May", 6: "Iyun", 7: "Iyul", 8: "Avgust",
        9: "Sentabr", 10: "Oktabr", 11: "Noyabr", 12: "Dekabr"
    };
    return months[monthNum] || "";
}

function formatSimpleDateUz(dateStr) {
    if (!dateStr) return "Kiritilmagan";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()}-${getMonthNameUz(d.getMonth() + 1)} ${d.getFullYear()}-y.`;
}

function getSectionName(sectionId) {
    const section = state.sections.find(s => s.id === parseInt(sectionId));
    return section ? section.name : "Noma'lum Fan";
}

function getGroupName(groupId) {
    const group = state.groups.find(g => g.id === parseInt(groupId));
    return group ? group.name : "Noma'lum Guruh";
}

function getLessonWithDetails(lesson) {
    const shiftSchedule = state.settings.bellSchedule[lesson.shift] || {};
    const periodTimes = shiftSchedule[lesson.period] || { start: "08:00", end: "09:20" };

    return {
        ...lesson,
        sectionName: getSectionName(lesson.sectionId),
        groupName: getGroupName(lesson.groupId),
        startTime: periodTimes.start,
        endTime: periodTimes.end
    };
}

// Academic week calendar helpers
function getMondayOfDate(dateObj) {
    const d = new Date(dateObj);
    const day = d.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diffToMonday);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateISO(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function showCustomConfirm(message, title = "Tasdiqlash") {
    return new Promise((resolve) => {
        const dialog = document.getElementById("custom-confirm-dialog");
        const titleEl = document.getElementById("confirm-title");
        const messageEl = document.getElementById("confirm-message");
        const okBtn = document.getElementById("confirm-ok-btn");
        const cancelBtn = document.getElementById("confirm-cancel-btn");
        
        if (!dialog || !titleEl || !messageEl || !okBtn || !cancelBtn) {
            resolve(confirm(message));
            return;
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        const cleanup = (value) => {
            dialog.classList.add("hidden");
            okBtn.replaceWith(okBtn.cloneNode(true));
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
            resolve(value);
        };
        
        const newOkBtn = document.getElementById("confirm-ok-btn");
        const newCancelBtn = document.getElementById("confirm-cancel-btn");
        
        newOkBtn.addEventListener("click", () => cleanup(true));
        newCancelBtn.addEventListener("click", () => cleanup(false));
        
        dialog.classList.remove("hidden");
    });
}

function showCustomAlert(message, title = "Diqqat") {
    return new Promise((resolve) => {
        const dialog = document.getElementById("custom-alert-dialog");
        const titleEl = document.getElementById("alert-title");
        const messageEl = document.getElementById("alert-message");
        const okBtn = document.getElementById("alert-ok-btn");
        
        if (!dialog || !titleEl || !messageEl || !okBtn) {
            resolve(alert(message));
            return;
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        const cleanup = () => {
            dialog.classList.add("hidden");
            okBtn.replaceWith(okBtn.cloneNode(true));
            resolve();
        };
        
        const newOkBtn = document.getElementById("alert-ok-btn");
        newOkBtn.addEventListener("click", cleanup);
        
        dialog.classList.remove("hidden");
    });
}

function getGroupAcademicWeek(group, targetDate) {
    if (!group) return null;
    
    const graphId = parseInt(group.graphId || 1);
    const graph = state.academicGraphs.find(g => g.id === graphId);
    if (!graph) return "-";
    
    const targetMon = getMondayOfDate(new Date(targetDate));
    const targetMonStr = formatDateISO(targetMon);
    
    const val = graph.weeks[targetMonStr];
    if (val === undefined || val === "-") return "-";
    if (val === "T") return "T";
    
    const num = parseInt(val);
    return isNaN(num) ? val : num;
}

function getLessonsForDayOnDate(dayOfWeek, targetDate) {
    return state.lessons
        .filter(l => {
            if (l.dayOfWeek !== dayOfWeek) return false;
            const group = state.groups.find(g => g.id === l.groupId);
            if (!group) return false;
            const currentWeekVal = getGroupAcademicWeek(group, targetDate);
            if (typeof currentWeekVal === "number") {
                const weeks = l.weeks.split(",").map(Number);
                const isCurrent = weeks.includes(currentWeekVal);
                const isFuture = Math.min(...weeks) > currentWeekVal;
                return isCurrent || isFuture;
            }
            return false;
        })
        .map(getLessonWithDetails)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function getLessonsForDay(dayOfWeek, weekNum) {
    return state.lessons
        .filter(l => {
            if (l.dayOfWeek !== dayOfWeek) return false;
            const weeks = l.weeks.split(",").map(Number);
            const isCurrent = weeks.includes(Number(weekNum));
            const isFuture = Math.min(...weeks) > Number(weekNum);
            return isCurrent || isFuture;
        })
        .map(getLessonWithDetails)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function getLessonsForDayAllWeeks(dayOfWeek) {
    return state.lessons
        .filter(l => l.dayOfWeek === dayOfWeek)
        .map(getLessonWithDetails);
}

function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

function compressWeeks(weeksStr) {
    if (!weeksStr) return "";
    const weeks = weeksStr.split(",").map(Number).sort((a,b) => a-b);
    if (weeks.length === 0) return "";
    
    const ranges = [];
    let start = weeks[0];
    let prev = weeks[0];
    
    for (let i = 1; i < weeks.length; i++) {
        if (weeks[i] === prev + 1) {
            prev = weeks[i];
        } else {
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
            start = weeks[i];
            prev = weeks[i];
        }
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    return ranges.join(", ");
}

// ==========================================
// 3. THEME MANAGEMENT
// ==========================================

function applyTheme(theme) {
    const html = document.documentElement;
    html.classList.add("dark");
    html.classList.remove("light");
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.settings.themeMode === "system") {
        applyTheme("system");
    }
});

// ==========================================
// 4. NAVIGATION / ROUTER
// ==========================================

function navigateToTab(tabName) {
    state.activeTab = tabName;

    document.querySelectorAll(".tab-content").forEach(el => {
        el.classList.add("hidden");
    });

    const activeScreen = document.getElementById(`${tabName}-screen`);
    if (activeScreen) {
        activeScreen.classList.remove("hidden");
        activeScreen.classList.add("animate-fade-in");
    }

    // Bottom Navigation (Mobile)
    document.querySelectorAll("#bottom-nav-bar button").forEach(btn => {
        const isCurrent = btn.dataset.tab === tabName;
        const iconEl = btn.querySelector(".material-symbols-outlined");

        if (isCurrent) {
            btn.className = "w-11 h-11 rounded-full bg-[#0088ff] text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,136,255,0.5)] transition-all duration-300 scale-110";
            if (iconEl) {
                iconEl.className = "material-symbols-outlined text-[22px] filled";
            }
        } else {
            btn.className = "w-11 h-11 rounded-full bg-transparent text-slate-400 flex items-center justify-center transition-all duration-300 hover:text-white";
            if (iconEl) {
                iconEl.className = "material-symbols-outlined text-[22px]";
            }
        }
    });

    // Sidebar Navigation (Desktop)
    document.querySelectorAll(".desktop-sidenav a").forEach(link => {
        const isCurrent = link.dataset.tab === tabName;
        const iconEl = link.querySelector(".material-symbols-outlined");

        if (isCurrent) {
            link.className = "w-11 h-11 rounded-full bg-[#0088ff] text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,136,255,0.5)] transition-all duration-300 scale-110";
            if (iconEl) iconEl.className = "material-symbols-outlined text-[22px] filled";
        } else {
            link.className = "w-11 h-11 rounded-full bg-transparent text-slate-400 flex items-center justify-center transition-all duration-300 hover:text-white";
            if (iconEl) iconEl.className = "material-symbols-outlined text-[22px]";
        }
    });

    if (tabName === "home") {
        renderHomeScreen();
    } else if (tabName === "schedule") {
        renderScheduleScreen();
    } else if (tabName === "editor") {
        renderEditorScreen();
    } else if (tabName === "widgets") {
        renderWidgetsScreen();
    } else if (tabName === "settings") {
        renderSettingsScreen();
    }
}

// ==========================================
// 5. SCREEN RENDERERS
// ==========================================

// --- HOME SCREEN ---
let homeIntervalId = null;

function renderHomeScreen() {
    if (homeIntervalId) clearInterval(homeIntervalId);

    const updateHomeUi = () => {
        const now = new Date();
        const localTimeStr = now.toTimeString().substring(0, 5); // "HH:mm"
        const currentDayNum = now.getDay();
        const mappedDayNum = currentDayNum === 0 ? 7 : currentDayNum;

        const dateStr = `${getDayName(mappedDayNum)}, ${now.getDate()}-${getMonthNameUz(now.getMonth() + 1)}`;
        document.getElementById("home-today-date").textContent = dateStr;
        
        const startDateText = state.settings.semesterStartDate 
            ? `1-hafta boshlanishi: ${formatSimpleDateUz(state.settings.semesterStartDate)}`
            : "1-hafta boshlanishi: kiritilmagan";
        document.getElementById("home-start-date-label").textContent = startDateText;

        document.getElementById("home-week-badge").textContent = `${state.settings.currentWeek}-hafta`;
        document.getElementById("home-teacher-name").textContent = state.settings.teacherName;
        document.getElementById("home-teacher-subject").textContent = state.settings.teacherSubject;

        const todayLessons = mappedDayNum <= 6 ? getLessonsForDayOnDate(mappedDayNum, now) : [];
        const container = document.getElementById("home-lessons-container");
        container.innerHTML = "";

        if (todayLessons.length === 0) {
            container.innerHTML = `
                <div class="col-span-4 md:col-span-12 flex flex-col items-center justify-center p-12 bg-gradient-to-tr from-[#0a1122]/65 to-[#12254f]/45 backdrop-blur-xl border border-[#1e2f55]/45 rounded-3xl text-center shadow-2xl w-full max-w-lg mx-auto animate-fade-in my-4">
                    <div class="w-full max-w-sm aspect-[16/9] mb-6 overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ6OWRHlk8ZTJ0fh4jWDKj9FIdm_axVhcW5ryZk6gfOOqm7Rzu9tX5in-i_hEM5nc6nLDQ2rUnKIyUB3CiHzpFlT9pUO23JkqrUxMZgNY6eI76C3D5gw2D6nFKsXTT6USlA1CXKeSO2VN_qpYZWcrxYk31VQqNLZAIRmjAOhqlo5hPaK0z6ONu1_lwRhKEasfl88ao_9YVsNdHIMB4HO-KZK7jSO0779ZyPV0tx9IA1sLjTLfxo0HsIw" alt="Cozy Study Desk" />
                    </div>
                    <h5 class="text-white text-lg font-bold mb-2">Darslar tugadi</h5>
                    <p class="text-xs text-slate-400 max-w-sm leading-relaxed">Bugungi barcha rejalashtirilgan darslar yakunlandi yoki bugun dam olish kuni. Hordiq olishingiz mumkin!</p>
                </div>
            `;
            return;
        }

        const currentMinutes = timeToMinutes(localTimeStr);
        let ongoingLesson = null;
        let upcomingLesson = null;

        for (const lesson of todayLessons) {
            const startMin = timeToMinutes(lesson.startTime);
            const endMin = timeToMinutes(lesson.endTime);

            if (currentMinutes >= startMin && currentMinutes < endMin) {
                ongoingLesson = lesson;
            } else if (currentMinutes < startMin && !upcomingLesson) {
                upcomingLesson = lesson;
            }
        }

        if (ongoingLesson) {
            const startMin = timeToMinutes(ongoingLesson.startTime);
            const endMin = timeToMinutes(ongoingLesson.endTime);
            const totalDuration = endMin - startMin;
            const elapsed = currentMinutes - startMin;
            const remaining = totalDuration - elapsed;
            const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

            const card = document.createElement("div");
            // Premium blue gradient glowing card
            card.className = "col-span-4 md:col-span-8 bg-gradient-to-tr from-[#0052d4] via-[#4364f7] to-[#6fb1fc] text-white rounded-2xl p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(67,100,247,0.3)] flex flex-col justify-between min-h-[220px] transition-all hover:scale-[1.01]";
            card.innerHTML = `
                <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-5"></div>
                <div class="flex justify-between items-start z-10 relative">
                    <div>
                        <span class="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs mb-3 shadow-sm font-bold">
                            <span class="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse"></span>
                            DARSDA
                        </span>
                        <h4 class="font-headline-sm text-xl font-bold mb-1 leading-tight text-white">${ongoingLesson.sectionName}</h4>
                        <p class="text-sm opacity-90">Guruh: ${ongoingLesson.groupName} • ${ongoingLesson.shift}-smena, ${ongoingLesson.period}-para</p>
                    </div>
                    <div class="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <span class="material-symbols-outlined text-2xl text-white">school</span>
                    </div>
                </div>
                <div class="z-10 relative mt-8 flex justify-between items-end">
                    <div>
                        ${ongoingLesson.note ? `<p class="text-xs font-medium opacity-80">Izoh: ${ongoingLesson.note}</p>` : ''}
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-base text-white">${remaining} daqiqa qoldi</p>
                        <p class="text-xs opacity-75">${ongoingLesson.endTime} da tugaydi</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

        if (upcomingLesson) {
            const card = document.createElement("div");
            // Premium orange-red gradient glowing card
            card.className = "col-span-4 md:col-span-4 bg-gradient-to-tr from-[#ff6b00] to-[#ff3b30] text-white rounded-2xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(255,107,0,0.25)] relative overflow-hidden min-h-[220px] transition-all hover:scale-[1.01]";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4 relative z-10 w-full">
                    <div class="w-full">
                        <span class="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">KEYINGISI • ${upcomingLesson.startTime}</span>
                        <h4 class="font-title-lg text-lg text-white font-bold mb-1 leading-tight">${upcomingLesson.sectionName}</h4>
                        <p class="text-xs text-white/90">Guruh: ${upcomingLesson.groupName} • ${upcomingLesson.shift}-smena, ${upcomingLesson.period}-para</p>
                    </div>
                </div>
                <div class="flex flex-col gap-1 text-[11px] text-white/80 relative z-10 mt-6">
                    ${upcomingLesson.note ? `<div class="font-semibold text-xs truncate">Izoh: ${upcomingLesson.note}</div>` : ''}
                </div>
            `;
            container.appendChild(card);
        }

        if (!ongoingLesson && !upcomingLesson) {
            container.innerHTML = `
                <div class="col-span-4 md:col-span-12 flex flex-col items-center justify-center p-12 bg-gradient-to-tr from-[#0a1122]/60 to-[#12254f]/40 backdrop-blur-md border border-[#1e2f55]/40 rounded-3xl text-center shadow-lg w-full max-w-md mx-auto animate-fade-in my-6">
                    <div class="w-16 h-16 rounded-full bg-[#0088ff]/10 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,136,255,0.15)]">
                        <span class="material-symbols-outlined text-3xl text-[#00d2ff] animate-pulse">task_alt</span>
                    </div>
                    <h5 class="text-white text-lg font-bold mb-2">Barcha darslar tugadi</h5>
                    <p class="text-xs text-slate-400 max-w-xs leading-relaxed">Bugungi barcha rejalashtirilgan mashg'ulotlaringiz yakunlandi. Hordiq oling!</p>
                </div>
            `;
        }
    };

    updateHomeUi();
    homeIntervalId = setInterval(updateHomeUi, 10000);
}

// --- SCHEDULE SCREEN ---
function setScheduleViewMode(mode) {
    state.scheduleViewMode = mode;
    
    const btnDaily = document.getElementById("schedule-view-daily");
    const btnWeekly = document.getElementById("schedule-view-weekly");
    const btnGrafik = document.getElementById("schedule-view-grafik");

    const containers = {
        daily: document.getElementById("schedule-daily-container"),
        weekly: document.getElementById("schedule-weekly-container"),
        grafik: document.getElementById("schedule-grafik-container")
    };

    [
        { btn: btnDaily, m: 'daily' },
        { btn: btnWeekly, m: 'weekly' },
        { btn: btnGrafik, m: 'grafik' }
    ].forEach(({ btn, m }) => {
        if (!btn) return;
        if (m === mode) {
            btn.className = "px-4 py-1.5 rounded-lg text-xs font-semibold bg-surface text-on-surface dark:bg-surface-dark dark:text-white shadow-sm transition-all";
        } else {
            btn.className = "px-4 py-1.5 rounded-lg text-xs transition-all text-on-surface-variant dark:text-outline-variant hover:bg-surface/30";
        }
    });

    Object.keys(containers).forEach(k => {
        if (containers[k]) {
            containers[k].classList.toggle("hidden", k !== mode);
        }
    });

    if (mode === "weekly") {
        renderWeeklyTable();
    } else if (mode === "grafik") {
        renderGrafikTable();
    }
}

function renderScheduleScreen() {
    setScheduleViewMode(state.scheduleViewMode);

    const daySelector = document.getElementById("schedule-day-selector");
    daySelector.innerHTML = "";

    const currentDay = state.scheduleSelectedDay;

    for (let day = 1; day <= 6; day++) {
        const isSelected = day === currentDay;
        const btn = document.createElement("button");
        btn.className = isSelected 
            ? "flex-1 py-2.5 rounded-full text-xs font-bold bg-[#0088ff] text-white shadow-[0_0_12px_rgba(0,136,255,0.45)] transition-all duration-300 scale-105 cursor-pointer"
            : "flex-1 py-2.5 rounded-full text-xs font-semibold bg-[#0a1122]/60 text-slate-400 border border-white/10 hover:text-white transition-all duration-300 cursor-pointer";
        
        let label = "";
        switch (day) {
            case 1: label = "Du"; break;
            case 2: label = "Se"; break;
            case 3: label = "Chor"; break;
            case 4: label = "Pay"; break;
            case 5: label = "Jum"; break;
            case 6: label = "Shan"; break;
        }

        btn.textContent = label;
        btn.addEventListener("click", () => {
            state.scheduleSelectedDay = day;
            renderScheduleScreen();
        });
        daySelector.appendChild(btn);
    }

    document.getElementById("schedule-week-label").textContent = `${state.settings.currentWeek}-hafta`;
    
    const lessonsList = document.getElementById("schedule-lessons-list");
    lessonsList.innerHTML = "";

    const activeLessons = getLessonsForDay(currentDay, state.settings.currentWeek);

    // Dynamic list of periods to show (always at least 1, 2, 3, 4)
    let parasToShow = [1, 2, 3, 4];
    activeLessons.forEach(l => {
        if (!parasToShow.includes(l.period)) {
            parasToShow.push(l.period);
        }
    });
    parasToShow.sort((a, b) => a - b);

    const romanNumerals = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" };

    parasToShow.forEach((para) => {
        const periodLessons = activeLessons.filter(l => l.period === para);
        const roman = romanNumerals[para] || para;

        if (periodLessons.length > 0) {
            // Render active lessons for this period
            periodLessons.forEach((lesson) => {
                const gradientClass = CARD_GRADIENTS[lesson.sectionId % CARD_GRADIENTS.length];
                const card = document.createElement("article");
                card.className = `${gradientClass} rounded-2xl p-5 flex relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-in`;
                card.innerHTML = `
                    <div class="flex-grow flex flex-col justify-between z-10">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">${roman}-para</span>
                                    <span class="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">${lesson.groupName}</span>
                                </div>
                                <h2 class="font-headline-sm text-lg text-white font-bold leading-tight">${lesson.sectionName}</h2>
                                <p class="text-xs text-white/90 mt-1">${lesson.shift}-smena</p>
                                ${lesson.note ? `<p class="text-xs text-white/80 italic mt-1.5">Izoh: ${lesson.note}</p>` : ''}
                            </div>
                            <div class="text-right flex flex-col items-end">
                                <p class="font-title-md text-sm text-white font-bold bg-black/15 px-2.5 py-1 rounded-lg">${lesson.startTime} - ${lesson.endTime}</p>
                                <div class="flex gap-2 mt-6">
                                    <button onclick="handleEditLesson(${lesson.id})" class="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="Tahrirlash">
                                        <span class="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button onclick="handleDeleteLesson(${lesson.id})" class="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="O'chirish">
                                        <span class="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                lessonsList.appendChild(card);
            });
        } else {
            // Render "No Lesson" placeholder for this period
            const shift1 = state.settings.bellSchedule["1"] || {};
            const shift2 = state.settings.bellSchedule["2"] || {};
            const t1 = shift1[para] || { start: "08:30", end: "09:50" };
            const t2 = shift2[para] || { start: "13:30", end: "14:50" };

            const card = document.createElement("article");
            card.className = "border border-outline/20 bg-[#0a1122]/30 backdrop-blur-md rounded-2xl p-5 flex relative overflow-hidden group transition-all duration-300 animate-fade-in";
            card.innerHTML = `
                <div class="flex-grow flex flex-col justify-between z-10 opacity-60">
                    <div class="flex justify-between items-center w-full">
                        <div>
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="inline-block px-2.5 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">${roman}-para</span>
                                <span class="text-slate-500 text-[10px] font-medium">1-sm: ${t1.start}-${t1.end} | 2-sm: ${t2.start}-${t2.end}</span>
                            </div>
                            <h2 class="font-headline-sm text-sm text-slate-400 font-bold leading-tight mt-2 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                Dars yo'q
                            </h2>
                        </div>
                        <div class="text-right flex items-center justify-end">
                            <svg class="w-5 h-5 text-slate-400 opacity-40 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                        </div>
                    </div>
                </div>
            `;
            lessonsList.appendChild(card);
        }
    });
}

// Renders the weekly table without the Xona column
function renderWeeklyTable() {
    const tbody = document.getElementById("schedule-weekly-tbody");
    tbody.innerHTML = "";

    const days = [1, 2, 3, 4, 5, 6];
    const paras = [1, 2, 3, 4];

    days.forEach(day => {
        const dayLessons = getLessonsForDayAllWeeks(day);
        const dayName = getDayName(day);

        paras.forEach((para, paraIdx) => {
            const slotLessons = dayLessons.filter(l => l.period === para);
            
            const tr = document.createElement("tr");
            tr.className = "hover:bg-surface-container-low/40 dark:hover:bg-surface-container-high/20 transition-colors";

            let dayTdHtml = "";
            if (paraIdx === 0) {
                dayTdHtml = `<td rowspan="4" class="px-4 py-3 border border-outline-variant/30 align-middle font-bold text-center bg-surface-container-low dark:bg-surface-container-high w-24 text-on-surface dark:text-white">${dayName}</td>`;
            }

            const timeRange = state.settings.bellSchedule["1"][para] || { start: "08:30", end: "09:50" };
            const timeStr = `${timeRange.start} - ${timeRange.end}`;

            const romanNumerals = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" };
            const roman = romanNumerals[para] || para;

            let subjectsHtml = `<span class="text-slate-400 opacity-60">-</span>`;
            let groupsHtml = `<span class="text-slate-400 opacity-60">-</span>`;

            if (slotLessons.length > 0) {
                subjectsHtml = `<div class="space-y-2">`;
                groupsHtml = `<div class="space-y-2 text-center">`;

                slotLessons.forEach(l => {
                    const compressedWeeksStr = compressWeeks(l.weeks);
                    const indicator = getLessonFutureIndicatorWeekly(l);
                    subjectsHtml += `<div class="font-medium text-on-surface dark:text-white">${l.sectionName} (${compressedWeeksStr})${indicator}</div>`;
                    groupsHtml += `<div class="font-bold text-primary dark:text-primary-fixed">${l.groupName}</div>`;
                });

                subjectsHtml += `</div>`;
                groupsHtml += `</div>`;
            }

            tr.innerHTML = `
                ${dayTdHtml}
                <td class="px-3 py-3 border border-outline-variant/30 text-center font-bold text-on-surface dark:text-white">${roman}</td>
                <td class="px-4 py-3 border border-outline-variant/30 text-center text-xs font-semibold text-on-surface-variant dark:text-slate-300 whitespace-nowrap">${timeStr}</td>
                <td class="px-5 py-3 border border-outline-variant/30">${subjectsHtml}</td>
                <td class="px-5 py-3 border border-outline-variant/30">${groupsHtml}</td>
            `;

            tbody.appendChild(tr);
        });
    });
}

function exportWeeklyToExcel() {
    try {
        const table = document.querySelector("#schedule-weekly-container table");
        if (!table) {
            showCustomAlert("Haftalik dars jadvali topilmadi!");
            return;
        }

        // Clone the table to customize content for Excel without affecting the screen
        const clonedTable = table.cloneNode(true);
        clonedTable.querySelectorAll("span.text-slate-400").forEach(span => {
            if (span.textContent.trim() === "-") {
                span.replaceWith("-");
            }
        });

        // Convert the cloned table structure to Excel Worksheet
        const ws = XLSX.utils.table_to_sheet(clonedTable);
        
        // Set specific column widths to prevent content wrapping
        ws['!cols'] = [
            { wch: 15 }, // Kun
            { wch: 8 },  // Para
            { wch: 18 }, // Vaqti
            { wch: 45 }, // Fanlar nomi (Haftalari)
            { wch: 15 }  // Guruh
        ];

        // Ensure grid lines are visible in generated spreadsheet
        ws['!views'] = [{ showGridLines: true }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dars Jadvali");
        
        // Trigger download
        XLSX.writeFile(wb, "Haftalik_Dars_Jadvali.xlsx");
    } catch(err) {
        console.error("Excel export error:", err);
        showCustomAlert("Excelga eksport qilishda xatolik yuz berdi: " + err.message);
    }
}

function handleEditLesson(id) {
    state.activeTab = "editor";
    navigateToTab("editor");
    loadLessonIntoForm(id);
}

function handleDeleteLesson(id) {
    showCustomConfirm("Rostdan ham ushbu darsni o'chirmoqchisiz?").then(confirmed => {
        if (confirmed) {
            state.lessons = state.lessons.filter(l => l.id !== id);
            saveStateToStorage();
            
            if (state.activeTab === "editor") {
                renderEditorLessons();
            } else if (state.activeTab === "schedule") {
                renderScheduleScreen();
            } else if (state.activeTab === "home") {
                renderHomeScreen();
            }
            
            showNotification("Dars o'chirildi");
        }
    });
}

// --- EDITOR SCREEN ---
let editorActiveSubTab = "lessons"; 
let selectedWeeks = new Set();
let editingLessonId = null;
let editingSectionId = null;
let editingGroupId = null;

function renderEditorScreen() {
    document.querySelectorAll(".editor-tab-btn").forEach(btn => {
        const subTab = btn.dataset.editorTab;
        const isActive = subTab === editorActiveSubTab;
        
        if (isActive) {
            btn.className = "editor-tab-btn flex-1 py-3 text-center rounded-xl transition-all duration-200 bg-primary/15 text-primary dark:text-primary-fixed font-bold shadow-sm select-none cursor-pointer";
        } else {
            btn.className = "editor-tab-btn flex-1 py-3 text-center rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:bg-surface-container-low/40 font-semibold select-none cursor-pointer";
        }
    });

    document.getElementById("editor-sections-container").classList.toggle("hidden", editorActiveSubTab !== "sections");
    document.getElementById("editor-groups-container").classList.toggle("hidden", editorActiveSubTab !== "groups");
    document.getElementById("editor-lessons-container").classList.toggle("hidden", editorActiveSubTab !== "lessons");
    document.getElementById("editor-grafik-container").classList.toggle("hidden", editorActiveSubTab !== "grafik");

    if (editorActiveSubTab === "sections") {
        renderEditorSections();
    } else if (editorActiveSubTab === "groups") {
        renderEditorGroups();
    } else if (editorActiveSubTab === "lessons") {
        renderEditorLessons();
    } else if (editorActiveSubTab === "grafik") {
        renderEditorGrafik();
    }
}
// --- ACADEMIC GRAPH SCREEN (O'QUV GRAFIGI) ---
let activeEditingCell = null; // { graphId, dateStr, cellEl }

function renderEditorGrafik() {
    const thead = document.getElementById("grafik-table-thead");
    const tbody = document.getElementById("grafik-table-tbody");
    if (!thead || !tbody) return;

    thead.innerHTML = "";
    tbody.innerHTML = "";

    // 1. Group CALENDAR_MON_LIST by months for colspan headers
    const monthSpans = [];
    let currentMonthName = "";
    let currentSpan = 0;

    CALENDAR_MON_LIST.forEach(dateStr => {
        const d = new Date(dateStr);
        const mName = getMonthNameUz(d.getMonth() + 1);
        if (mName !== currentMonthName) {
            if (currentSpan > 0) {
                monthSpans.push({ name: currentMonthName, span: currentSpan });
            }
            currentMonthName = mName;
            currentSpan = 1;
        } else {
            currentSpan++;
        }
    });
    if (currentSpan > 0) {
        monthSpans.push({ name: currentMonthName, span: currentSpan });
    }

    // 2. Build Month Header Row
    let monthRowHtml = `<tr>
        <th class="border border-outline-variant/30 px-3 py-2 bg-surface-container text-on-surface dark:text-white font-bold text-center text-xs">Hafta / Kun</th>
    `;
    monthSpans.forEach(m => {
        monthRowHtml += `<th colspan="${m.span}" class="border border-outline-variant/30 px-2 py-2 bg-surface-container text-on-surface dark:text-white font-bold text-center text-[10px] uppercase tracking-wider">${m.name}</th>`;
    });
    monthRowHtml += `</tr>`;
    thead.innerHTML += monthRowHtml;

    // 4. Build Days of the Week Rows (Dush - Yaks) showing exact calendar dates
    const dayNames = ["Dush", "Sesh", "Chor", "Pays", "Juma", "Shan", "Yaks"];
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        let trHtml = `<tr class="border-b border-outline-variant/10">`;
        const dayLabel = dayNames[dayOffset];
        const isSunday = dayOffset === 6;
        const labelClass = isSunday 
            ? "px-2 py-1.5 border border-outline-variant/30 font-bold bg-error-container/10 text-error text-center"
            : "px-2 py-1.5 border border-outline-variant/30 font-semibold bg-surface-container-lowest dark:bg-surface-container-high text-on-surface-variant dark:text-slate-300 text-center";
        
        trHtml += `<td class="${labelClass}">${dayLabel}</td>`;
        
        CALENDAR_MON_LIST.forEach(monStr => {
            const mon = new Date(monStr);
            const currentDay = new Date(mon);
            currentDay.setDate(mon.getDate() + dayOffset);
            
            const cellClass = isSunday
                ? "border border-outline-variant/20 text-center py-1 text-[10px] text-error/85 bg-error-container/5"
                : "border border-outline-variant/20 text-center py-1 text-[10px] text-slate-400 dark:text-slate-300 bg-surface-container-lowest/50 dark:bg-surface-dark";
            
            trHtml += `<td class="${cellClass}">${currentDay.getDate()}</td>`;
        });
        
        trHtml += `</tr>`;
        tbody.innerHTML += trHtml;
    }

    // 5. Build Divider Row
    let dividerHtml = `<tr><td colspan="${CALENDAR_MON_LIST.length + 1}" class="bg-outline-variant/20 h-2 border-y border-outline-variant/30"></td></tr>`;
    tbody.innerHTML += dividerHtml;

    // 6. Build Grafik Row Headers & Cells
    state.academicGraphs.forEach(graph => {
        let trHtml = `<tr class="hover:bg-primary/5 transition-colors">`;
        
        // Find associated groups for this academic graph to display them
        const associatedGroups = state.groups.filter(group => parseInt(group.graphId || 1) === graph.id);

        // Row Header showing graph name and its groups
        trHtml += `<td class="px-2 py-2 border border-outline-variant/30 bg-primary/10 text-primary dark:text-primary-fixed font-bold text-center">
            <div class="flex flex-col items-center justify-center gap-1 w-full min-w-[100px]">
                <span class="text-xs uppercase tracking-wide">${graph.name}</span>
                ${associatedGroups.map(g => {
                    const parts = g.name.split(",");
                    return parts.map(p => `<span class="text-[10px] text-slate-400 font-normal block leading-tight mt-0.5">${p.trim()}</span>`).join("");
                }).join("")}
                <button onclick="handleDeleteAcademicGraph(${graph.id})" class="text-error hover:text-error/80 shrink-0 p-0.5 rounded hover:bg-error-container/20 transition-colors mt-1" title="Grafikni o'chirish">
                    <span class="material-symbols-outlined text-xs">delete</span>
                </button>
            </div>
        </td>`;
        
        // Cells
        CALENDAR_MON_LIST.forEach(monStr => {
            const val = graph.weeks[monStr] || "-";
            let cellBg = "";
            
            if (val === "T") {
                cellBg = "bg-error-container/40 border-error/50 text-error font-bold";
            } else if (val === "-") {
                cellBg = "bg-surface-container-low dark:bg-surface-container-high/40 text-slate-500 opacity-60";
            } else {
                cellBg = "bg-primary-container/20 border-primary/30 text-primary dark:text-primary-fixed font-bold hover:bg-primary-container/40";
            }
            
            trHtml += `<td class="border border-outline-variant/30 text-center p-0 font-bold ${cellBg}">
                <input type="text" 
                       value="${val}" 
                       class="table-input w-full text-center py-2 bg-transparent border-none outline-none text-on-surface dark:text-white font-bold text-xs cursor-pointer focus:bg-slate-800/80 transition-colors"
                       style="box-shadow: none !important;"
                       onchange="updateGrafikCellValue(${graph.id}, '${monStr}', this.value)" />
            </td>`;
        });
        
        trHtml += `</tr>`;
        tbody.innerHTML += trHtml;
    });
}

function updateGrafikCellValue(graphId, dateStr, value) {
    const graph = state.academicGraphs.find(g => g.id === graphId);
    if (graph) {
        let val = value.trim();
        if (val.toLowerCase() === "t") val = "T";
        if (val === "") val = "-";
        
        graph.weeks[dateStr] = val;
        saveStateToStorage();
        renderEditorGrafik();
    }
}

function handleAddAcademicGraph() {
    const input = document.getElementById("new_graph_name_input");
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
        showCustomAlert("Grafik nomini kiriting!");
        return;
    }
    
    // Check for duplicates
    if (state.academicGraphs.some(g => g.name.toLowerCase() === name.toLowerCase())) {
        showCustomAlert("Ushbu nomli grafik allaqachon mavjud!");
        return;
    }
    
    const newId = state.academicGraphs.length > 0 ? Math.max(...state.academicGraphs.map(g => g.id)) + 1 : 1;
    
    // Populate weeks with defaults
    const weeks = {};
    let weekCounter = 1;
    CALENDAR_MON_LIST.forEach(monStr => {
        const d = new Date(monStr);
        const dateISO = formatDateISO(d);
        
        // Dec 28, Jan 4 are T
        // Feb 8, Feb 15 are T
        if (dateISO === "2026-12-28" || dateISO === "2027-01-04" || dateISO === "2027-02-08" || dateISO === "2027-02-15") {
            weeks[dateISO] = "T";
        } else {
            weeks[dateISO] = weekCounter.toString();
            weekCounter++;
            if (weekCounter > 20) weekCounter = 1;
        }
    });
    
    state.academicGraphs.push({
        id: newId,
        name: name,
        weeks: weeks
    });
    
    input.value = "";
    saveStateToStorage();
    renderEditorGrafik();
    renderEditorGroups(); // Refresh group dropdown
    showNotification("Yangi o'quv grafigi yaratildi!");
}

function handleDeleteAcademicGraph(id) {
    if (state.academicGraphs.length <= 1) {
        showCustomAlert("Kamida bitta o'quv grafigi bo'lishi shart!");
        return;
    }
    
    // Check if any group is associated with this graph
    const assignedGroups = state.groups.filter(g => parseInt(g.graphId) === id);
    if (assignedGroups.length > 0) {
        const groupNames = assignedGroups.map(g => g.name).join(", ");
        showCustomAlert(`Ushbu grafikni o'chirib bo'lmaydi! U quyidagi guruhlarga biriktirilgan: ${groupNames}`);
        return;
    }
    
    showCustomConfirm("Rostdan ham ushbu o'quv grafigini o'chirmoqchisiz?").then(confirmed => {
        if (confirmed) {
            state.academicGraphs = state.academicGraphs.filter(g => g.id !== id);
            saveStateToStorage();
            renderEditorGrafik();
            renderEditorGroups(); // Refresh group dropdown
            showNotification("Grafik o'chirildi");
        }
    });
}

function selectEditorSubTab(subTabName) {
    editorActiveSubTab = subTabName;
    renderEditorScreen();
}

function renderEditorSections() {
    const list = document.getElementById("editor-sections-list");
    list.innerHTML = "";

    state.sections.forEach(sec => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl border border-outline-variant/30 animate-fade-in";
        item.innerHTML = `
            <span class="font-body-lg text-body-lg text-on-surface dark:text-white">${sec.name}</span>
            <div class="flex gap-2">
                <button onclick="handleEditSection(${sec.id}, '${sec.name}')" class="p-2 rounded-full hover:bg-surface-container-low text-primary transition-colors">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button onclick="handleDeleteSection(${sec.id})" class="p-2 rounded-full hover:bg-error-container text-error transition-colors">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function handleEditSection(id, name) {
    editingSectionId = id;
    document.getElementById("section_name_input").value = name;
    document.getElementById("section-submit-btn-text").textContent = "Bo'limni yangilash";
    document.getElementById("section-cancel-btn").classList.remove("hidden");
}

function cancelSectionEdit() {
    editingSectionId = null;
    document.getElementById("section_name_input").value = "";
    document.getElementById("section-submit-btn-text").textContent = "Bo'lim qo'shish";
    document.getElementById("section-cancel-btn").classList.add("hidden");
}

function handleDeleteSection(id) {
    showCustomConfirm("Bu fanni o'chirsangiz unga bog'liq barcha darslar ham o'chib ketadi! Rozimisiz?").then(confirmed => {
        if (confirmed) {
            state.sections = state.sections.filter(s => s.id !== id);
            state.lessons = state.lessons.filter(l => l.sectionId !== id);
            
            saveStateToStorage();
            
            renderEditorSections();
            renderEditorLessons(); // Refresh lessons editor list immediately
            
            showNotification("Fan o'chirildi");
        }
    });
}

function renderEditorGroups() {
    const list = document.getElementById("editor-groups-list");
    if (!list) return;
    list.innerHTML = "";

    // Populate cohort selector
    const graphSelect = document.getElementById("group_graph_select");
    if (graphSelect) {
        graphSelect.innerHTML = "";
        state.academicGraphs.forEach(g => {
            graphSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
        });
    }

    state.groups.forEach(g => {
        const graph = state.academicGraphs.find(x => x.id === parseInt(g.graphId || 1));
        const graphName = graph ? graph.name : "201";

        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl border border-outline-variant/30 animate-fade-in";
        item.innerHTML = `
            <div class="flex flex-col">
                <span class="font-body-lg text-body-lg text-on-surface dark:text-white font-bold">${g.name}</span>
                <span class="text-xs text-slate-400 mt-0.5">Grafik: ${graphName}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="handleEditGroup(${g.id}, '${g.name}')" class="p-2 rounded-full hover:bg-surface-container-low text-primary transition-colors">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button onclick="handleDeleteGroup(${g.id})" class="p-2 rounded-full hover:bg-error-container text-error transition-colors">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function handleEditGroup(id, name) {
    editingGroupId = id;
    const g = state.groups.find(x => x.id === id);
    document.getElementById("group_name_input").value = name;
    if (g && document.getElementById("group_graph_select")) {
        document.getElementById("group_graph_select").value = g.graphId || 1;
    }
    document.getElementById("group-submit-btn-text").textContent = "Guruhni yangilash";
    document.getElementById("group-cancel-btn").classList.remove("hidden");
}

function cancelGroupEdit() {
    editingGroupId = null;
    document.getElementById("group_name_input").value = "";
    document.getElementById("group-submit-btn-text").textContent = "Guruh qo'shish";
    document.getElementById("group-cancel-btn").classList.add("hidden");
}

function handleDeleteGroup(id) {
    showCustomConfirm("Bu guruhni o'chirsangiz unga bog'liq barcha darslar ham o'chib ketadi! Rozimisiz?").then(async confirmed => {
        if (confirmed) {
            if (isSupabaseEnabled()) {
                showNotification("Sinxronizatsiya ketmoqda...");
                const ok = await supabaseGroupMutate('delete', id);
                if (!ok) {
                    showNotification("Tarmoq xatosi! Guruh o'chirilmadi.");
                    return;
                }
            }
            state.groups = state.groups.filter(g => g.id !== id);
            state.lessons = state.lessons.filter(l => l.groupId !== id);
            
            saveStateToStorage();
            
            renderEditorGroups();
            renderEditorLessons(); // Refresh lessons editor list immediately
            renderEditorGrafik();  // Update associated groups in the graph table
            
            showNotification(isSupabaseEnabled() ? "Guruh o'chirildi va sinxronlandi" : "Guruh o'chirildi");
        }
    });
}



function handleEditLesson(id) {
    loadLessonIntoForm(id);
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function renderEditorLessons() {
    const sectionSelect = document.getElementById("lesson_section_select");
    const groupSelect = document.getElementById("lesson_group_select");
    
    // 1. Preserve current dropdown selections to prevent wipes on checkbox interaction
    const currentSectionId = sectionSelect ? sectionSelect.value : "";
    const currentGroupId = groupSelect ? groupSelect.value : "";

    sectionSelect.innerHTML = '<option value="">Fanni tanlang</option>';
    state.sections.forEach(s => {
        sectionSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });

    groupSelect.innerHTML = '<option value="">Guruhni tanlang</option>';
    state.groups.forEach(g => {
        groupSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });

    // Restore dropdown options correctly
    if (editingLessonId !== null) {
        const lesson = state.lessons.find(l => l.id === editingLessonId);
        if (lesson) {
            sectionSelect.value = lesson.sectionId;
            groupSelect.value = lesson.groupId;
        }
    } else {
        sectionSelect.value = currentSectionId;
        groupSelect.value = currentGroupId;
    }

    // 2. Generate 1-20 Weeks grid checkboxes supporting DRAG selection gestures
    const weekGrid = document.getElementById("editor-week-selectors-grid");
    weekGrid.innerHTML = "";
    for (let w = 1; w <= 20; w++) {
        const isChecked = selectedWeeks.has(w);
        const item = document.createElement("button");
        item.type = "button";
        item.dataset.week = w; // Touch selector lookup
        item.className = isChecked
            ? "py-2 text-center rounded-lg border bg-primary text-on-primary border-primary font-semibold transition-all select-none"
            : "py-2 text-center rounded-lg border bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all select-none";
        item.textContent = w;

        // Desktop Mouse Drag events
        item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isDraggingWeeks = true;
            dragSelectMode = !selectedWeeks.has(w);
            if (dragSelectMode) selectedWeeks.add(w);
            else selectedWeeks.delete(w);
            renderEditorLessons();
        });

        item.addEventListener("mouseenter", () => {
            if (isDraggingWeeks) {
                if (dragSelectMode) selectedWeeks.add(w);
                else selectedWeeks.delete(w);
                renderEditorLessons();
            }
        });

        // Mobile Touch Drag events
        item.addEventListener("touchstart", (e) => {
            e.preventDefault();
            isDraggingWeeks = true;
            dragSelectMode = !selectedWeeks.has(w);
            if (dragSelectMode) selectedWeeks.add(w);
            else selectedWeeks.delete(w);
            renderEditorLessons();
        });

        weekGrid.appendChild(item);
    }

    // Render list of lessons below form
    const list = document.getElementById("editor-lessons-list");
    list.innerHTML = "";

    if (state.lessons.length === 0) {
        list.innerHTML = `
            <div class="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 bg-slate-900/60 border border-slate-800 rounded-xl border-dashed">
                <span class="material-symbols-outlined text-3xl text-outline mb-2">event_busy</span>
                <p class="font-body-md text-body-md text-slate-400 text-center">Hali darslar kiritilmagan.</p>
            </div>
        `;
        return;
    }

    const sortedLessons = [...state.lessons].map(getLessonWithDetails).sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
        if (a.shift !== b.shift) return a.shift - b.shift;
        return a.period - b.period;
    });

    sortedLessons.forEach(lesson => {
        const gradientClass = CARD_GRADIENTS[lesson.sectionId % CARD_GRADIENTS.length];
        const compressedWeeksStr = compressWeeks(lesson.weeks);
        
        const item = document.createElement("div");
        item.className = `${gradientClass} rounded-2xl p-5 shadow-sm flex relative overflow-hidden animate-fade-in hover:scale-[1.01] transition-all`;
        item.innerHTML = `
            <div class="flex-grow pl-1 z-10">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">${getDayName(lesson.dayOfWeek)}</span>
                        <h4 class="font-title-md text-title-md text-white font-bold leading-tight">${lesson.sectionName}</h4>
                        <p class="text-xs text-white/90 mt-1.5">Guruh: ${lesson.groupName} • ${lesson.shift}-smena, ${lesson.period}-para</p>
                        <p class="text-[11px] text-white/80 mt-1">Haftalar: ${compressedWeeksStr}</p>
                        ${lesson.note ? `<p class="text-[10px] text-white/70 italic mt-1.5">Izoh: ${lesson.note}</p>` : ''}
                    </div>
                    <div class="flex gap-1.5 ml-2">
                        <button onclick="loadLessonIntoForm(${lesson.id}); window.scrollTo({top: 0, behavior: 'smooth'});" class="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="Tahrirlash">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="handleDeleteLesson(${lesson.id}); renderEditorLessons();" class="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="O'chirish">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function handleWeeksShortcut(type) {
    selectedWeeks.clear();
    if (type === "all") {
        for (let w = 1; w <= 20; w++) selectedWeeks.add(w);
    } else if (type === "odd") {
        for (let w = 1; w <= 20; w += 2) selectedWeeks.add(w);
    } else if (type === "even") {
        for (let w = 2; w <= 20; w += 2) selectedWeeks.add(w);
    } else if (type === "first_half") {
        for (let w = 1; w <= 10; w++) selectedWeeks.add(w);
    } else if (type === "second_half") {
        for (let w = 11; w <= 20; w++) selectedWeeks.add(w);
    }
    renderEditorLessons();
}

function loadLessonIntoForm(id) {
    const lesson = state.lessons.find(l => l.id === id);
    if (!lesson) return;

    editingLessonId = id;
    
    editorActiveSubTab = "lessons";
    renderEditorScreen();

    document.getElementById("lesson_section_select").value = lesson.sectionId;
    document.getElementById("lesson_group_select").value = lesson.groupId;
    document.getElementById("lesson_day_select").value = lesson.dayOfWeek;
    document.getElementById("lesson_shift_select").value = lesson.shift || 1;
    document.getElementById("lesson_period_select").value = lesson.period || 1;
    document.getElementById("lesson_note_input").value = lesson.note || "";

    selectedWeeks.clear();
    lesson.weeks.split(",").forEach(w => {
        const val = parseInt(w);
        if (val) selectedWeeks.add(val);
    });

    document.getElementById("lesson-submit-btn-text").textContent = "Darsni yangilash";
    document.getElementById("lesson-cancel-btn").classList.remove("hidden");

    renderEditorLessons();
}

function clearLessonForm() {
    editingLessonId = null;
    document.getElementById("lesson_section_select").value = "";
    document.getElementById("lesson_group_select").value = "";
    document.getElementById("lesson_day_select").value = "";
    document.getElementById("lesson_shift_select").value = "1";
    document.getElementById("lesson_period_select").value = "1";
    document.getElementById("lesson_note_input").value = "";
    selectedWeeks.clear();

    document.getElementById("lesson-submit-btn-text").textContent = "Darsni saqlash";
    document.getElementById("lesson-cancel-btn").classList.add("hidden");
    
    renderEditorLessons();
}

// --- WIDGETS PREVIEW SCREEN ---
function renderWidgetsScreen() {
    const now = new Date();
    const currentDayNum = now.getDay();
    const mappedDayNum = currentDayNum === 0 ? 7 : currentDayNum;
    
    const todayLessons = mappedDayNum <= 6 ? getLessonsForDayOnDate(mappedDayNum, now) : [];
    const localTimeStr = now.toTimeString().substring(0, 5);
    const currentMinutes = timeToMinutes(localTimeStr);

    let ongoing = null;
    let upcoming = null;

    for (const lesson of todayLessons) {
        const startMin = timeToMinutes(lesson.startTime);
        const endMin = timeToMinutes(lesson.endTime);

        if (currentMinutes >= startMin && currentMinutes < endMin) {
            ongoing = lesson;
        } else if (currentMinutes < startMin && !upcoming) {
            upcoming = lesson;
        }
    }

    if (!ongoing && todayLessons.length > 0) ongoing = todayLessons[0];
    if (!upcoming && todayLessons.length > 1) upcoming = todayLessons[1];

    const isTransparent = state.settings.widgetStyle === "transparent";
    const bgClass = isTransparent 
        ? "bg-surface/60 backdrop-blur-md text-on-surface" 
        : "bg-surface-container-lowest text-on-surface";
    const headerClass = isTransparent ? "text-primary dark:text-primary-fixed" : "text-primary";

    // 1. Small Widget (2x2)
    const smallWidget = document.getElementById("widget-small-preview");
    if (ongoing) {
        smallWidget.className = `${bgClass} widget-radius p-4 w-40 h-40 widget-shadow flex flex-col relative overflow-hidden`;
        smallWidget.innerHTML = `
            <div class="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
            <div class="flex items-center justify-between mb-3">
                <span class="font-label-md text-label-md text-primary font-bold">Hozir</span>
                <span class="material-symbols-outlined text-primary text-[18px]">schedule</span>
            </div>
            <div class="flex-1 flex flex-col justify-center">
                <h4 class="font-title-md text-title-md leading-tight mb-1 truncate">${ongoing.groupName}</h4>
                <p class="font-body-md text-body-md text-on-surface-variant text-[10px]">${ongoing.startTime}</p>
            </div>
            <div class="mt-auto pt-2 border-t border-outline-variant/30">
                <div class="flex items-center gap-1">
                    <span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Keyingi:</span>
                    <span class="font-label-md text-label-md text-on-surface text-[10px] truncate">${upcoming ? upcoming.groupName : "Yo'q"}</span>
                </div>
            </div>
        `;
    } else {
        smallWidget.innerHTML = `<div class="flex items-center justify-center h-full text-center p-4 text-on-surface-variant text-xs">Darslar tugadi</div>`;
    }

    // 2. Medium Widget (4x2)
    const mediumWidget = document.getElementById("widget-medium-preview");
    const dateFormattedStr = `${now.getDate()}-${getMonthNameUz(now.getMonth() + 1).substring(0,3)}`;
    if (ongoing) {
        mediumWidget.className = `${bgClass} widget-radius p-4 w-full max-w-[320px] h-40 widget-shadow flex flex-col relative overflow-hidden`;
        mediumWidget.innerHTML = `
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div class="flex justify-between items-center mb-3">
                <h4 class="font-title-md text-title-md ${headerClass} font-semibold">Joriy Dars</h4>
                <span class="font-label-md text-label-md text-on-surface-variant">${dateFormattedStr}</span>
            </div>
            <div class="flex-1 flex flex-col justify-center">
                <h3 class="font-headline-sm text-headline-sm leading-tight text-on-surface truncate">${ongoing.sectionName}</h3>
                <p class="font-body-md text-body-md text-on-surface-variant truncate">Guruh: ${ongoing.groupName} • ${ongoing.period}-para</p>
            </div>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
                <span>Vaqt: ${ongoing.startTime} - ${ongoing.endTime}</span>
                <span class="font-semibold text-primary">Keyingisi: ${upcoming ? upcoming.groupName : "Yo'q"}</span>
            </div>
        `;
    } else {
        mediumWidget.innerHTML = `<div class="flex items-center justify-center h-full text-center p-4 text-on-surface-variant">Darslar tugadi</div>`;
    }

    // 3. Large Widget (4x3)
    const largeWidget = document.getElementById("widget-large-preview");
    if (todayLessons.length > 0) {
        largeWidget.className = `${bgClass} widget-radius p-5 w-full max-w-[320px] h-56 widget-shadow flex flex-col relative overflow-hidden`;
        
        let lessonsHtml = "";
        todayLessons.slice(0, 3).forEach(l => {
            const isOngoing = ongoing && l.id === ongoing.id;
            const itemClass = isOngoing 
                ? "bg-primary-container/30 border border-primary/20 p-2 rounded-lg"
                : "p-1.5";
            
            lessonsHtml += `
                <div class="flex justify-between items-center ${itemClass}">
                    <div class="truncate">
                        <p class="font-title-md text-title-md text-on-surface leading-tight truncate">${l.groupName}</p>
                        <p class="font-label-md text-label-md text-on-surface-variant text-[11px]">${l.sectionName} • ${l.period}-para</p>
                    </div>
                    <span class="font-label-md text-label-md text-on-surface font-semibold shrink-0 ml-2">${l.startTime}</span>
                </div>
            `;
        });

        largeWidget.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">calendar_today</span>
                    <h4 class="font-title-lg text-title-lg ${headerClass} font-bold">Bugun</h4>
                </div>
                <span class="bg-tertiary-container text-on-tertiary-container px-2.5 py-0.5 rounded-full font-label-md text-label-md font-semibold">${state.settings.currentWeek}-hafta</span>
            </div>
            <div class="space-y-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
                ${lessonsHtml}
            </div>
        `;
    } else {
        largeWidget.innerHTML = `<div class="flex items-center justify-center h-full text-center p-4 text-on-surface-variant">Bugun darslar rejalashtirilmagan</div>`;
    }

    const btnFull = document.getElementById("widget-style-full");
    const btnTrans = document.getElementById("widget-style-transparent");
    if (isTransparent) {
        btnTrans.className = "px-4 py-2 bg-surface text-on-surface rounded shadow-sm font-label-md text-label-md transition-all font-semibold";
        btnFull.className = "px-4 py-2 text-on-surface-variant hover:bg-surface/50 rounded font-label-md text-label-md transition-all";
    } else {
        btnFull.className = "px-4 py-2 bg-surface text-on-surface rounded shadow-sm font-label-md text-label-md transition-all font-semibold";
        btnTrans.className = "px-4 py-2 text-on-surface-variant hover:bg-surface/50 rounded font-label-md text-label-md transition-all";
    }
}

function setWidgetStyle(style) {
    state.settings.widgetStyle = style;
    saveStateToStorage();
    renderWidgetsScreen();
}

// --- SETTINGS SCREEN ---
function renderSettingsScreen() {
    const weekLabel = document.getElementById("settings-week-label");
    if (weekLabel) weekLabel.textContent = `${state.settings.currentWeek}-hafta`;
    
    const nameLabel = document.getElementById("settings-teacher-name-label");
    if (nameLabel) nameLabel.textContent = state.settings.teacherName;
    
    const subjectLabel = document.getElementById("settings-teacher-subject-label");
    if (subjectLabel) subjectLabel.textContent = state.settings.teacherSubject;

    const startDateInput = document.getElementById("settings-start-date-input");
    if (startDateInput && state.settings.semesterStartDate) {
        startDateInput.value = state.settings.semesterStartDate;
    }

    const editName = document.getElementById("edit_teacher_name");
    if (editName) editName.value = state.settings.teacherName;
    
    const editSubject = document.getElementById("edit_teacher_subject");
    if (editSubject) editSubject.value = state.settings.teacherSubject;
}

// Manual Week picker Dialog
function openWeekDialog() {
    const grid = document.getElementById("dialog-weeks-grid");
    grid.innerHTML = "";
    for (let w = 1; w <= 20; w++) {
        const isCurrent = w === state.settings.currentWeek;
        const btn = document.createElement("button");
        btn.className = isCurrent
            ? "py-3 rounded-lg border bg-primary text-on-primary border-primary font-bold text-center transition-all active:scale-95 duration-100"
            : "py-3 rounded-lg border bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low text-center transition-all active:scale-95 duration-100";
        btn.textContent = `${w}-hafta`;
        btn.addEventListener("click", () => {
            state.settings.currentWeek = w;
            saveStateToStorage();
            closeWeekDialog();
            renderSettingsScreen();
            showNotification(`Joriy hafta ${w}-haftaga o'rnatildi`);
        });
        grid.appendChild(btn);
    }
    document.getElementById("week-dialog").classList.remove("hidden");
}

function closeWeekDialog() {
    document.getElementById("week-dialog").classList.add("hidden");
}

// Profile dialog
function openProfileDialog() {
    document.getElementById("profile-dialog").classList.remove("hidden");
}

function closeProfileDialog() {
    document.getElementById("profile-dialog").classList.add("hidden");
}

function saveProfileSettings() {
    const name = document.getElementById("edit_teacher_name").value.trim();
    const subject = document.getElementById("edit_teacher_subject").value.trim();

    if (!name || !subject) {
        showCustomAlert("Barcha maydonlarni to'ldiring");
        return;
    }

    state.settings.teacherName = name;
    state.settings.teacherSubject = subject;
    saveStateToStorage();
    closeProfileDialog();
    renderSettingsScreen();
    showNotification("Profil yangilandi");
}

// Semester Start Date selection
function saveSemesterStartDate() {
    const inputVal = document.getElementById("settings-start-date-input").value;
    state.settings.semesterStartDate = inputVal;
    
    // Recalculate week
    state.settings.currentWeek = calculateCurrentWeek();
    
    saveStateToStorage();
    renderSettingsScreen();
    showNotification("Semestr boshlanish sanasi saqlandi!");
}

// Bell Schedule Dialog
function openBellDialog() {
    const grid1 = document.getElementById("bell-smena1-grid");
    const grid2 = document.getElementById("bell-smena2-grid");
    
    grid1.innerHTML = "";
    grid2.innerHTML = "";

    const schedule = state.settings.bellSchedule;

    for (let p = 1; p <= 6; p++) {
        const pTimes = schedule["1"][p] || { start: "08:30", end: "09:50" };
        const row = document.createElement("div");
        row.className = "flex items-center gap-3 p-3 bg-surface-container-low dark:bg-surface-container-high rounded-xl";
        row.innerHTML = `
            <span class="font-bold text-sm w-12 text-on-surface dark:text-white">${p}-para:</span>
            <div class="flex items-center gap-1.5 flex-grow">
                <input type="time" value="${pTimes.start}" id="bell-1-${p}-start" class="w-full px-2 py-1 text-xs rounded border border-outline bg-transparent dark:text-white" />
                <span class="text-xs">-</span>
                <input type="time" value="${pTimes.end}" id="bell-1-${p}-end" class="w-full px-2 py-1 text-xs rounded border border-outline bg-transparent dark:text-white" />
            </div>
        `;
        grid1.appendChild(row);
    }

    for (let p = 1; p <= 6; p++) {
        const pTimes = schedule["2"][p] || { start: "13:30", end: "14:50" };
        const row = document.createElement("div");
        row.className = "flex items-center gap-3 p-3 bg-surface-container-low dark:bg-surface-container-high rounded-xl";
        row.innerHTML = `
            <span class="font-bold text-sm w-12 text-on-surface dark:text-white">${p}-para:</span>
            <div class="flex items-center gap-1.5 flex-grow">
                <input type="time" value="${pTimes.start}" id="bell-2-${p}-start" class="w-full px-2 py-1 text-xs rounded border border-outline bg-transparent dark:text-white" />
                <span class="text-xs">-</span>
                <input type="time" value="${pTimes.end}" id="bell-2-${p}-end" class="w-full px-2 py-1 text-xs rounded border border-outline bg-transparent dark:text-white" />
            </div>
        `;
        grid2.appendChild(row);
    }

    document.getElementById("bell-dialog").classList.remove("hidden");
}

function closeBellDialog() {
    document.getElementById("bell-dialog").classList.add("hidden");
}

function saveBellSchedule() {
    const updatedSchedule = { "1": {}, "2": {} };

    for (let p = 1; p <= 6; p++) {
        updatedSchedule["1"][p] = {
            start: document.getElementById(`bell-1-${p}-start`).value,
            end: document.getElementById(`bell-1-${p}-end`).value
        };
        updatedSchedule["2"][p] = {
            start: document.getElementById(`bell-2-${p}-start`).value,
            end: document.getElementById(`bell-2-${p}-end`).value
        };
    }

    state.settings.bellSchedule = updatedSchedule;
    saveStateToStorage();
    closeBellDialog();
    navigateToTab(state.activeTab);
    showNotification("Qo'ng'iroqlar jadvali yangilandi!");
}

// --- DATA IMPORT / EXPORT HANDLERS ---
function exportDataBackup() {
    const backupObj = {
        sections: state.sections,
        groups: state.groups,
        lessons: state.lessons,
        settings: state.settings,
        version: "6.0.0",
        timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const dateStr = new Date().toISOString().slice(0,10);
    downloadAnchor.setAttribute("download", `dars_jadvali_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Zaxira nusxasi yuklab olindi");
}

function triggerImportFileInput() {
    document.getElementById("backup-file-input").click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.sections && data.groups && data.lessons && data.settings) {
                state.sections = data.sections;
                state.groups = data.groups;
                state.lessons = data.lessons;
                state.settings = { ...state.settings, ...data.settings };
                
                saveStateToStorage();
                loadStateFromStorage();
                
                applyTheme(state.settings.themeMode);
                navigateToTab(state.activeTab);
                
                showNotification("Ma'lumotlar qayta tiklandi!");
            } else {
                showCustomAlert("Xato zaxira nusxa fayli. Kerakli ma'lumotlar topilmadi.");
            }
        } catch(err) {
            showCustomAlert("Faylni o'qishda xatolik yuz berdi. JSON fayl formatini tekshiring.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// --- NOTIFICATION BANNER ---
function showNotification(message) {
    const toast = document.getElementById("toast-notification");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.remove("hidden", "translate-y-24");
    toast.classList.add("translate-y-0");

    setTimeout(() => {
        toast.classList.remove("translate-y-0");
        toast.classList.add("translate-y-24", "hidden");
    }, 3000);
}

// ==========================================
// 6. FORM HANDLERS (SUBMISSIONS)
// ==========================================

function registerFormListeners() {
    // Add Section Form
    document.getElementById("section-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const input = document.getElementById("section_name_input");
        const name = input.value.trim();
        if (!name) return;

        if (editingSectionId !== null) {
            const index = state.sections.findIndex(s => s.id === editingSectionId);
            if (index !== -1) {
                state.sections[index].name = name;
                showNotification("Fan nomi yangilandi");
            }
            cancelSectionEdit();
        } else {
            const newId = state.sections.length > 0 ? Math.max(...state.sections.map(s => s.id)) + 1 : 1;
            state.sections.push({ id: newId, name: name });
            input.value = "";
            showNotification("Yangi fan qo'shildi");
        }
        
        saveStateToStorage();
        renderEditorSections();
    });

    // Add Group Form
    document.getElementById("group-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        const input = document.getElementById("group_name_input");
        const graphSelect = document.getElementById("group_graph_select");
        const name = input.value.trim();
        const graphId = parseInt(graphSelect.value || 1);
        if (!name) return;

        if (editingGroupId !== null) {
            if (isSupabaseEnabled()) {
                showNotification("Sinxronizatsiya ketmoqda...");
                const ok = await supabaseGroupMutate('update', editingGroupId, { name });
                if (!ok) {
                    showNotification("Tarmoq xatosi! Guruh yangilanmadi.");
                    return;
                }
            }
            const index = state.groups.findIndex(g => g.id === editingGroupId);
            if (index !== -1) {
                state.groups[index].name = name;
                state.groups[index].graphId = graphId;
                showNotification(isSupabaseEnabled() ? "Guruh yangilandi va sinxronlandi" : "Guruh yangilandi");
            }
            cancelGroupEdit();
        } else {
            if (isSupabaseEnabled()) {
                showNotification("Sinxronizatsiya ketmoqda...");
                const inserted = await supabaseGroupMutate('insert', null, { name });
                if (inserted) {
                    state.groups.push({ id: Number(inserted.id), name: inserted.name, graphId: graphId });
                    input.value = "";
                    showNotification("Yangi guruh qo'shildi va sinxronlandi");
                } else {
                    showNotification("Tarmoq xatosi! Yangi guruh qo'shilmadi.");
                    return;
                }
            } else {
                const newId = state.groups.length > 0 ? Math.max(...state.groups.map(g => g.id)) + 1 : 1;
                state.groups.push({ id: newId, name: name, graphId: graphId });
                input.value = "";
                showNotification("Yangi guruh qo'shildi");
            }
        }

        saveStateToStorage();
        renderEditorGroups();
        renderEditorGrafik();  // Update associated groups in the graph table
    });

    // Save Lesson Button
    document.getElementById("save-lesson-btn").addEventListener("click", function() {
        const sectionId = parseInt(document.getElementById("lesson_section_select").value);
        const groupId = parseInt(document.getElementById("lesson_group_select").value);
        const dayOfWeek = parseInt(document.getElementById("lesson_day_select").value);
        const shift = parseInt(document.getElementById("lesson_shift_select").value);
        const period = parseInt(document.getElementById("lesson_period_select").value);
        const note = document.getElementById("lesson_note_input").value.trim();

        if (!sectionId) {
            showCustomAlert("Iltimos, fanni tanlang.");
            return;
        }
        if (!groupId) {
            showCustomAlert("Iltimos, guruhni tanlang.");
            return;
        }
        if (selectedWeeks.size === 0) {
            showCustomAlert("Kamida bitta haftani tanlang.");
            return;
        }
        if (!dayOfWeek) {
            showCustomAlert("Iltimos, hafta kuni tanlang.");
            return;
        }

        const weeksStr = Array.from(selectedWeeks).sort((a,b) => a-b).join(",");

        if (editingLessonId !== null) {
            const index = state.lessons.findIndex(l => l.id === editingLessonId);
            if (index !== -1) {
                state.lessons[index] = {
                    id: editingLessonId,
                    sectionId,
                    groupId,
                    weeks: weeksStr,
                    dayOfWeek,
                    shift,
                    period,
                    teacher: state.settings.teacherName,
                    note
                };
                showNotification("Dars jadvali yangilandi!");
            }
            clearLessonForm();
        } else {
            const newId = state.lessons.length > 0 ? Math.max(...state.lessons.map(l => l.id)) + 1 : 1;
            state.lessons.push({
                id: newId,
                sectionId,
                groupId,
                weeks: weeksStr,
                dayOfWeek,
                shift,
                period,
                teacher: state.settings.teacherName,
                note
            });
            showNotification("Dars jadvali saqlandi!");
            clearLessonForm();
        }

        saveStateToStorage();
        
        setTimeout(() => {
            state.scheduleSelectedDay = dayOfWeek;
            navigateToTab("schedule");
        }, 300);
    });

    // Touch dragging selection handlers on Week selectors Grid container
    const weekGrid = document.getElementById("editor-week-selectors-grid");
    
    weekGrid.addEventListener("touchmove", (e) => {
        if (!isDraggingWeeks) return;
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.dataset && element.dataset.week) {
            const w = parseInt(element.dataset.week);
            if (dragSelectMode) selectedWeeks.add(w);
            else selectedWeeks.delete(w);
            renderEditorLessons();
        }
    });

    // Global reset variables on MouseUp / TouchEnd
    document.addEventListener("mouseup", () => {
        isDraggingWeeks = false;
    });
    document.addEventListener("touchend", () => {
        isDraggingWeeks = false;
    });
}

// ==========================================
// 7. INITIALIZATION ON DOCUMENT LOAD
// ==========================================

function startApp() {
    initDb().then(() => {
        applyTheme(state.settings?.themeMode || "system");
        
        document.querySelectorAll("[data-tab]").forEach(el => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                navigateToTab(el.dataset.tab);
            });
        });

        registerFormListeners();
        navigateToTab("home");
    }).catch(err => {
        console.error("Initialization error:", err);
        navigateToTab("home");
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
} else {
    startApp();
}

function loadGeneratedAiSchedule() {
    const inputArea = document.getElementById("ai-generator-json-input");
    if (!inputArea) return;
    const rawVal = inputArea.value.trim();
    if (!rawVal) {
        showCustomAlert("Iltimos, avval AI tomonidan taqdim etilgan dars jadvali JSON matnini joylashtiring!");
        return;
    }
    
    try {
        const parsed = JSON.parse(rawVal);
        
        // Basic schema validations
        if (!parsed.sections || !parsed.groups || !parsed.lessons || !parsed.academicGraphs || !parsed.settings) {
            showCustomAlert("Xatolik! Joylashtirilgan matn dars jadvali zaxira fayli talablariga mos kelmaydi. Qatorlarni tekshirib ko'ring.");
            return;
        }
        
        showCustomConfirm("Rostdan ham ushbu AI dars jadvalini yuklamoqchimisiz? Hozirgi ma'lumotlaringiz o'chib ketadi.").then((approved) => {
            if (approved) {
                // Apply database updates
                state.sections = parsed.sections;
                state.groups = parsed.groups;
                state.lessons = parsed.lessons;
                state.academicGraphs = parsed.academicGraphs;
                state.settings = { ...state.settings, ...parsed.settings };
                
                saveToDb();
                
                // Show notification and go to home
                showNotification("AI dars jadvali muvaffaqiyatli o'rnatildi!");
                inputArea.value = "";
                navigateToTab("home");
            }
        });
    } catch(err) {
        console.error("JSON parse error in AI generator load:", err);
        showCustomAlert("Joylashtirilgan matnda xatolik bor (JSON formati noto'g'ri): " + err.message);
    }
}

function getLessonFutureIndicator(lesson) {
    const weeks = lesson.weeks.split(",").map(Number);
    const minWeek = Math.min(...weeks);
    if (minWeek > state.settings.currentWeek) {
        if (state.settings.semesterStartDate) {
            try {
                const firstOccurDate = new Date(state.settings.semesterStartDate);
                const startMonday = getMondayOfDate(firstOccurDate);
                const targetDate = new Date(startMonday);
                targetDate.setDate(targetDate.getDate() + (minWeek - 1) * 7 + (lesson.dayOfWeek - 1));
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffTime = targetDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 0) {
                    return `<div class="text-[11px] bg-yellow-500/20 text-yellow-300 font-bold px-2 py-0.5 rounded-lg mt-1.5 w-fit animate-pulse">${diffDays} kun qoldi (${minWeek}-haftada)</div>`;
                }
            } catch (e) {
                console.warn(e);
            }
        }
        return `<div class="text-[11px] bg-yellow-500/20 text-yellow-300 font-bold px-2 py-0.5 rounded-lg mt-1.5 w-fit animate-pulse">${minWeek}-haftadan boshlanadi</div>`;
    }
    return "";
}

function getLessonFutureIndicatorWeekly(lesson) {
    const weeks = lesson.weeks.split(",").map(Number);
    const minWeek = Math.min(...weeks);
    if (minWeek > state.settings.currentWeek) {
        if (state.settings.semesterStartDate) {
            try {
                const firstOccurDate = new Date(state.settings.semesterStartDate);
                const startMonday = getMondayOfDate(firstOccurDate);
                const targetDate = new Date(startMonday);
                targetDate.setDate(targetDate.getDate() + (minWeek - 1) * 7 + (lesson.dayOfWeek - 1));
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffTime = targetDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 0) {
                    return `<span class="inline-block text-[9px] bg-yellow-500/10 text-yellow-400 font-bold px-1 py-0.2 rounded ml-1 animate-pulse">${diffDays} kun qoldi (${minWeek}-h)</span>`;
                }
            } catch (e) {
                console.warn(e);
            }
        }
        return `<span class="inline-block text-[9px] bg-yellow-500/10 text-yellow-400 font-bold px-1 py-0.2 rounded ml-1 animate-pulse">${minWeek}-h.dan</span>`;
    }
    return "";
}

function renderGrafikTable() {
    const thead = document.getElementById("schedule-matrix-thead");
    const tbody = document.getElementById("schedule-matrix-tbody");
    if (!thead || !tbody) return;

    thead.innerHTML = "";
    tbody.innerHTML = "";

    // 1. Sort groups by name
    const sortedGroups = [...state.groups].sort((a, b) => a.name.localeCompare(b.name, 'uz', { sensitivity: 'base' }));

    // 2. Build header row
    const headerTr = document.createElement("tr");
    headerTr.className = "bg-[#0d1b3e] text-white font-bold text-xs uppercase tracking-wider";
    
    // Day label column header
    const thDay = document.createElement("th");
    thDay.className = "px-4 py-3 border border-outline-variant/30 text-center bg-slate-950 w-24";
    thDay.textContent = "";
    headerTr.appendChild(thDay);

    // Group headers
    sortedGroups.forEach(group => {
        const thGroup = document.createElement("th");
        thGroup.className = "px-4 py-3 border border-outline-variant/30 text-center font-black text-sm whitespace-nowrap bg-blue-950/60 text-blue-300";
        thGroup.textContent = group.name;
        headerTr.appendChild(thGroup);
    });
    thead.appendChild(headerTr);

    // 3. Build rows for each day of the week
    const days = [1, 2, 3, 4, 5, 6];
    const dayNames = ["Du", "Se", "Ch", "Pa", "Ju", "Sh"];
    const romanNumerals = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI" };

    days.forEach((day, idx) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-surface-container-low/20 transition-colors";

        // Day cell (first column)
        const tdDay = document.createElement("td");
        tdDay.className = "px-4 py-4 border border-outline-variant/30 text-center font-black bg-slate-950 text-white w-24 text-sm";
        tdDay.textContent = dayNames[idx];
        tr.appendChild(tdDay);

        // Group cells
        sortedGroups.forEach(group => {
            const td = document.createElement("td");
            td.className = "px-3 py-3 border border-outline-variant/30 align-middle min-w-[120px]";

            // Find lessons for this group and day
            const groupLessons = state.lessons
                .filter(l => l.groupId === group.id && l.dayOfWeek === day)
                .map(getLessonWithDetails)
                .sort((a, b) => a.period - b.period);

            if (groupLessons.length > 0) {
                const wrapper = document.createElement("div");
                wrapper.className = "flex flex-col gap-2";

                groupLessons.forEach(l => {
                    const roman = romanNumerals[l.period] || l.period;
                    const compressedWeeks = compressWeeks(l.weeks);
                    
                    // Choose gradient based on sectionId
                    const gradientClass = CARD_GRADIENTS[l.sectionId % CARD_GRADIENTS.length];
                    const futureIndicator = getLessonFutureIndicatorWeekly(l);
                    
                    const lessonDiv = document.createElement("div");
                    lessonDiv.className = `${gradientClass} text-white p-2.5 rounded-xl text-center shadow-md font-bold text-xs flex flex-col items-center justify-center min-h-[60px] relative overflow-hidden group/item hover:scale-[1.03] transition-all`;
                    
                    // Format note
                    let noteHtml = "";
                    if (l.note) {
                        noteHtml = `<div class="text-[10px] text-white/90 font-medium mt-1 leading-snug">${l.note}</div>`;
                    }

                    lessonDiv.innerHTML = `
                        <div class="text-[11px] font-extrabold uppercase tracking-wide">${roman}</div>
                        <div class="text-[10px] opacity-90 mt-0.5">(${compressedWeeks})</div>
                        ${noteHtml}
                        ${futureIndicator}
                    `;
                    wrapper.appendChild(lessonDiv);
                });
                td.appendChild(wrapper);
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function exportGrafikToExcel() {
    try {
        const table = document.getElementById("schedule-matrix-table");
        if (!table) {
            showCustomAlert("Grafik jadvali topilmadi!");
            return;
        }

        // Clone the table
        const clonedTable = table.cloneNode(true);

        // Convert the cloned table structure to Excel Worksheet
        const ws = XLSX.utils.table_to_sheet(clonedTable);
        
        // Ensure grid lines are visible in generated spreadsheet
        ws['!views'] = [{ showGridLines: true }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Grafik Jadval");
        
        // Trigger download
        XLSX.writeFile(wb, "Oquv_Grafik_Jadvali.xlsx");
    } catch(err) {
        console.error("Excel export error:", err);
        showCustomAlert("Excelga eksport qilishda xatolik yuz berdi: " + err.message);
    }
}
