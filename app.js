/* ==========================================================================
   APPLICATION LOGIC - SAMDECH OUV HIGH SCHOOL TEACHER MANAGEMENT
   ========================================================================== */

// Register Service Worker for Progressive Web App (PWA)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("Service Worker registered successfully:", reg.scope))
            .catch(err => console.log("Service Worker registration failed:", err));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Safe LocalStorage Wrapper to prevent crashes on file:// protocol
    const safeStorage = {
        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn("localStorage getItem failed:", e);
                return null;
            }
        },
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn("localStorage setItem failed:", e);
                return false;
            }
        },
        removeItem(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn("localStorage removeItem failed:", e);
                return false;
            }
        }
    };

    // ---------------------------------------------------------
    // 1. DICTIONARY & I18N SUPPORT
    // ---------------------------------------------------------
    const TRANSLATIONS = {
        km: {
            schoolName: "វិទ្យាល័យសម្តេចឪ",
            schoolLocation: "ខេត្តបន្ទាយមានជ័យ",
            schoolNameFull: "វិទ្យាល័យសម្ដេចឪ ខេត្តបន្ទាយមានជ័យ",
            menuDashboard: "ផ្ទាំងគ្រប់គ្រង",
            menuTeachers: "បញ្ជីឈ្មោះគ្រូ",
            menuAddTeacher: "បន្ថែមគ្រូបង្រៀន",
            menuSettings: "ការកំណត់ & រក្សាទុក",
            menuAttendance: "ស្រង់អវត្តមានគ្រូ",
            menuAttendanceLogs: "កំណត់ត្រាអវត្តមាន",
            welcomeTitle: "ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិកវិទ្យាល័យសម្ដេចឪ",
            allYears: "-- គ្រប់ឆ្នាំសិក្សា --",
            allMonthsFilter: "-- គ្រប់ខែ --",
            btnPrintReport: "បោះពុម្ពរបាយការណ៍",
            labelAttDate: "កាលបរិច្ឆេទ",
            labelAttHour: "ម៉ោងសិក្សា",
            selectHour: "-- ជ្រើសរើសម៉ោង --",
            welcomeSub: "សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងសាលារៀនបែបឌីជីថល ងាយស្រួល រហ័ស និងមានសុវត្ថិភាព។",
            totalTeachers: "គ្រូបង្រៀនសរុប",
            femaleTeachers: "គ្រូបង្រៀនជាស្ត្រី",
            maleTeachers: "គ្រូបង្រៀនជាបុរស",
            activeStatus: "កំពុងបង្រៀន",
            subjectChartTitle: "ស្ថិតិគ្រូបង្រៀនតាមមុខវិជ្ជា",
            quickStats: "ស្ថិតិសង្ខេបបន្ថែម",
            avgExp: "បទពិសោធន៍បង្រៀនមធ្យម",
            onLeaveStatus: "កំពុងសម្រាកច្បាប់",
            techLeads: "ប្រធានក្រុមបច្ចេកទេស",
            schoolMottoTitle: "បាវចនាសាលា",
            schoolMotto: '"វិន័យ គុណភាព គុណធម៌ នវានុវត្តន៍"',
            searchPlaceholder: "ស្វែងរកតាមឈ្មោះគ្រូ ឬលេខទូរស័ព្ទ...",
            allSubjects: "-- គ្រប់មុខវិជ្ជា --",
            allGenders: "-- គ្រប់ភេទ --",
            allStatus: "-- គ្រប់ស្ថានភាព --",
            genderMale: "ប្រុស",
            genderFemale: "ស្រី",
            statusActive: "កំពុងបង្រៀន",
            statusLeave: "ច្បាប់",
            clearFilters: "សម្អាត",
            actionsHeader: "សកម្មភាព",
            noResults: "រកមិនឃើញទិន្នន័យគ្រូបង្រៀនទេ",
            noResultsSub: "សូមកែប្រែពាក្យគន្លឹះ ឬលក្ខខណ្ឌស្វែងរកឡើងវិញ",
            formTitleAdd: "បញ្ចូលព័ត៌មានគ្រូបង្រៀនថ្មី",
            formTitleEdit: "កែប្រែព័ត៌មានគ្រូបង្រៀន",
            formSub: "សូមបំពេញព័ត៌មានលម្អិតខាងក្រោមឱ្យបានត្រឹមត្រូវ។ ព័ត៌មានដែលមានសញ្ញា (*) គឺចាំបាច់ត្រូវបំពេញ។",
            labelNameKh: "ឈ្មោះភាសាខ្មែរ",
            labelNameEn: "ឈ្មោះឡាតាំង",
            labelGender: "ភេទ",
            selectGender: "-- ជ្រើសរើសភេទ --",
            labelDob: "ថ្ងៃខែឆ្នាំកំណើត",
            labelPhone: "លេខទូរស័ព្ទ",
            labelEmail: "អ៊ីមែល",
            labelSubject: "មុខវិជ្ជាបង្រៀន",
            selectSubject: "-- ជ្រើសរើសមុខវិជ្ជា --",
            labelGrade: "ទទួលបន្ទុកថ្នាក់",
            selectGrade: "-- ជ្រើសរើសថ្នាក់ --",
            labelPosition: "តួនាទី",
            selectPosition: "-- ជ្រើសរើសតួនាទី --",
            posTeacher: "គ្រូបង្រៀន",
            posTechLead: "ប្រធានក្រុមបច្ចេកទេស",
            posViceLead: "អនុប្រធានក្រុមកម្រិត",
            labelExperience: "បទពិសោធន៍ការងារ (ឆ្នាំ)",
            labelStatus: "ស្ថានភាពបច្ចុប្បន្ន",
            labelJoinDate: "ថ្ងៃចូលបម្រើការងារ",
            btnCancel: "បោះបង់",
            btnSave: "រក្សាទុក",
            btnEdit: "កែប្រែ",
            btnClose: "បិទ",
            backupTitle: "ការគ្រប់គ្រង និងរក្សាទុកទិន្នន័យ",
            backupDesc: "រក្សាទុកទិន្នន័យគ្រូបង្រៀនទាំងអស់របស់អ្នក ឬស្តារទិន្នន័យត្រឡប់មកវិញតាមរយៈឯកសារកុំព្យូទ័រ (JSON)។",
            exportTitle: "ទាញយកទិន្នន័យ (Backup/Export)",
            exportDesc: "ទាញយកទិន្នន័យគ្រូបង្រៀនទាំងអស់មករក្សាទុកក្នុងឯកសារ JSON លើម៉ាស៊ីនរបស់អ្នក។",
            btnExport: "ទាញយកទិន្នន័យ",
            importTitle: "បញ្ចូលទិន្នន័យឡើងវិញ (Restore/Import)",
            importDesc: "ជ្រើសរើសឯកសារទិន្នន័យ JSON ដែលបានរក្សាទុកពីមុន ដើម្បីបញ្ចូលទៅក្នុងប្រព័ន្ធឡើងវិញ។",
            btnImport: "បញ្ចូលទិន្នន័យ",
            resetTitle: "កំណត់ឡើងវិញរោងចក្រ (Reset Database)",
            resetDesc: "លុបចោលទិន្នន័យដែលបានកែប្រែទាំងអស់ ហើយដាក់បញ្ចូលទិន្នន័យគំរូដើមរបស់សាលាមកវិញ។",
            btnReset: "សម្អាតទិន្នន័យឡើងវិញ",
            systemInfoTitle: "ព័ត៌មានប្រព័ន្ធ",
            sysVersion: "ជំនាន់ប្រព័ន្ធ៖",
            sysDeveloper: "អភិវឌ្ឍន៍ដោយ៖",
            sysPlatform: "បច្ចេកវិទ្យា៖",
            cambodianMotto: "ជាតិ សាសនា ព្រះមហាក្សត្រ",
            personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
            academicInfo: "ព័ត៌មានបង្រៀន និងការងារ",
            deleteConfirmTitle: "បញ្ជាក់ការលុបទិន្នន័យ",
            deleteConfirmDesc: "តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រូបង្រៀនឈ្មោះ",
            deleteConfirmDesc2: "នេះមែនទេ? ការលុបនេះមិនអាចយកមកវិញបានឡើយ។",
            btnConfirmDelete: "យល់ព្រមលុប",
            
            // Attendance Specific Translations
            attendanceFormTitle: "កត់ត្រាអវត្តមានគ្រូបង្រៀន",
            attendanceFormSub: "សម្រាប់ប្រធានថ្នាក់ស្រង់វត្តមានគ្រូបង្រៀនប្រចាំថ្ងៃ។ ទិន្នន័យនឹងត្រូវសមកាលកម្មទៅកាន់ការិយាល័យកណ្តាល។",
            labelAttClass: "ថ្នាក់របស់អ្នក",
            labelAttTeacher: "គ្រូបង្រៀន",
            labelAttPin: "លេខកូដប្រធានថ្នាក់ (PIN)",
            labelNotes: "មូលហេតុ ឬកំណត់សម្គាល់ផ្សេងៗ",
            btnSubmitAttendance: "រក្សាទុកការស្រង់វត្តមាន",
            statusPresent: "វត្តមាន",
            statusLate: "មកយឺត",
            statusAbsent: "អវត្តមាន",
            setupGuideTitle: "របៀបដំឡើង Google Sheets Sync",
            sheetsConfigTitle: "ការភ្ជាប់ជាមួយ Google Sheets (Cloud Sync)",
            sheetsConfigDesc: "បញ្ចូលតំណភ្ជាប់ Google Apps Script Web App URL ដើម្បីសមកាលកម្មទិន្នន័យអវត្តមានស្វ័យប្រវត្តិ។",
            roleAdmin: "អ្នកគ្រប់គ្រង (Admin)",
            roleMonitor: "ប្រធានថ្នាក់ (Monitor)",
            syncOk: "សមកាលកម្មរួច",
            syncPending: "រង់ចាំសមកាលកម្ម",
            invalidPin: "លេខកូដប្រធានថ្នាក់មិនត្រឹមត្រូវទេ! (លំនាំដើម: 1234)",

            // Toasts & JS Alerts
            toastSaveSuccess: "រក្សាទុកទិន្នន័យបានជោគជ័យ!",
            toastDeleteSuccess: "បានលុបទិន្នន័យគ្រូបង្រៀនរួចរាល់!",
            toastImportSuccess: "បានបញ្ចូលទិន្នន័យជោគជ័យ!",
            toastImportError: "ឯកសារទិន្នន័យមិនត្រឹមត្រូវទេ!",
            toastResetSuccess: "បានកំណត់ទិន្នន័យឡើងវិញជោគជ័យ!",
            validationErr: "សូមបំពេញព័ត៌មានដែលចាំបាច់ឱ្យបានត្រឹមត្រូវ!",
            emailErr: "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ!",
            phoneErr: "លេខទូរស័ព្ទត្រូវតែមានចន្លោះពី ៩ ទៅ ១១ខ្ទង់!",
            yearsExp: " ឆ្នាំ",
            activeLabel: "កំពុងបង្រៀន",
            leaveLabel: "ច្បាប់",
            selectTeacher: "-- ជ្រើសរើសគ្រូបង្រៀន --",
            absenteeSummaryTitle: "សេចក្តីសង្ខេបគ្រូអវត្តមានប្រចាំខែ"
        },
        en: {
            schoolName: "Samdech Ouv HS",
            schoolLocation: "Banteay Meanchey",
            schoolNameFull: "Samdech Ouv High School, Banteay Meanchey",
            menuDashboard: "Dashboard",
            menuTeachers: "Teachers List",
            menuAddTeacher: "Add Teacher",
            menuSettings: "Settings & Backup",
            menuAttendance: "Log Attendance",
            menuAttendanceLogs: "Attendance History",
            welcomeTitle: "Staff Management System",
            allYears: "-- All Academic Years --",
            allMonthsFilter: "-- All Months --",
            btnPrintReport: "Print Report",
            labelAttDate: "Date",
            labelAttHour: "Study Hour",
            selectHour: "-- Select Study Hour --",
            welcomeSub: "Welcome to the digital school management system. Simple, fast, and secure.",
            totalTeachers: "Total Teachers",
            femaleTeachers: "Female Teachers",
            maleTeachers: "Male Teachers",
            activeStatus: "Active Status",
            subjectChartTitle: "Teachers by Subject",
            quickStats: "Quick Insights",
            avgExp: "Average Experience",
            onLeaveStatus: "On Leave",
            techLeads: "Technical Leads",
            schoolMottoTitle: "School Motto",
            schoolMotto: '"Discipline, Quality, Virtue, Innovation"',
            searchPlaceholder: "Search by name or phone...",
            allSubjects: "-- All Subjects --",
            allGenders: "-- All Genders --",
            allStatus: "-- All Status --",
            genderMale: "Male",
            genderFemale: "Female",
            statusActive: "Active",
            statusLeave: "On Leave",
            clearFilters: "Clear",
            actionsHeader: "Actions",
            noResults: "No records found",
            noResultsSub: "Please adjust your search keywords or filters",
            formTitleAdd: "Register New Teacher",
            formTitleEdit: "Edit Teacher Profile",
            formSub: "Please fill in all details carefully. Fields with (*) are mandatory.",
            labelNameKh: "Khmer Name",
            labelNameEn: "Latin Name",
            labelGender: "Gender",
            selectGender: "-- Select Gender --",
            labelDob: "Date of Birth",
            labelPhone: "Phone Number",
            labelEmail: "Email Address",
            labelSubject: "Teaching Subject",
            selectSubject: "-- Select Subject --",
            labelGrade: "Grade Responsibility",
            selectGrade: "-- Select Grade --",
            labelPosition: "Role/Position",
            selectPosition: "-- Select Position --",
            posTeacher: "Teacher",
            posTechLead: "Technical Lead",
            posViceLead: "Vice Level Lead",
            labelExperience: "Experience (Years)",
            labelStatus: "Current Status",
            labelJoinDate: "Employment Date",
            btnCancel: "Cancel",
            btnSave: "Save Profile",
            btnEdit: "Edit Info",
            btnClose: "Close",
            backupTitle: "Data Management & Backup",
            backupDesc: "Download backup copies of all teacher data or import a backup file (JSON format).",
            exportTitle: "Backup Database (Export JSON)",
            exportDesc: "Save all teacher profiles to a local JSON data file on your computer.",
            btnExport: "Export JSON",
            importTitle: "Restore Database (Import JSON)",
            importDesc: "Select a previously exported JSON backup file to overwrite/update system records.",
            btnImport: "Import JSON",
            resetTitle: "Factory Reset Database",
            resetDesc: "Wipe all current changes and reload the default Cambodian teacher directory data.",
            btnReset: "Factory Reset",
            systemInfoTitle: "System Information",
            sysVersion: "System Version:",
            sysDeveloper: "Developed by:",
            sysPlatform: "Platform Stack:",
            cambodianMotto: "Nation, Religion, King",
            personalInfo: "Personal Profile",
            academicInfo: "Academic & Employment Info",
            deleteConfirmTitle: "Confirm Record Deletion",
            deleteConfirmDesc: "Are you sure you want to permanently delete the profile of",
            deleteConfirmDesc2: "This action cannot be undone.",
            btnConfirmDelete: "Confirm Delete",

            // Attendance Specific Translations
            attendanceFormTitle: "Record Teacher Attendance",
            attendanceFormSub: "Daily attendance submission screen for Class Monitors. Data will sync centrally.",
            labelAttClass: "Your Class Room",
            labelAttTeacher: "Teacher Name",
            labelAttPin: "Class Monitor PIN",
            labelNotes: "Reason / Notes",
            btnSubmitAttendance: "Submit Attendance Logs",
            statusPresent: "Present",
            statusLate: "Late",
            statusAbsent: "Absent",
            setupGuideTitle: "How to setup Google Sheets Sync",
            sheetsConfigTitle: "Google Sheets Cloud Sync Integration",
            sheetsConfigDesc: "Insert your Google Apps Script Web App URL to enable automatic spreadsheet sync.",
            roleAdmin: "Administrator (Admin)",
            roleMonitor: "Class Monitor",
            syncOk: "Synced",
            syncPending: "Pending Sync",
            invalidPin: "Invalid Class Monitor PIN! (Default is 1234)",
            
            // Toasts & JS Alerts
            toastSaveSuccess: "Teacher profile saved successfully!",
            toastDeleteSuccess: "Teacher profile deleted successfully!",
            toastImportSuccess: "Database imported successfully!",
            toastImportError: "Invalid backup JSON file layout!",
            toastResetSuccess: "Database reset to initial mock data!",
            validationErr: "Please fill in all required fields correctly!",
            emailErr: "Invalid email format!",
            phoneErr: "Phone number must be between 9 and 11 digits!",
            yearsExp: " Years",
            activeLabel: "Active",
            leaveLabel: "On Leave",
            selectTeacher: "-- Select Teacher --",
            absenteeSummaryTitle: "Monthly Absent Teachers Summary"
        }
    };

    // Predefined Cambodian Ministry Curriculum subjects
    const CAMBODIAN_SUBJECTS = [
        "គណិតវិទ្យា",
        "អក្សរសាស្ត្រខ្មែរ",
        "រូបវិទ្យា",
        "គីមីវិទ្យា",
        "ជីវវិទ្យា",
        "ប្រវត្តិវិទ្យា",
        "ភូមិវិទ្យា",
        "សីលធម៌-ពលរដ្ឋវិទ្យា",
        "ផែនដីវិទ្យា",
        "គេហវិទ្យា",
        "ភាសាបរទេស",
        "ព័ត៌មានវិទ្យា",
        "កាយវប្បកម្ម-កីឡា",
        "សេដ្ឋកិច្ច"
    ];

    const SUBJECT_TRANSLATIONS = {
        "គណិតវិទ្យា": { km: "គណិតវិទ្យា", en: "Mathematics" },
        "អក្សរសាស្ត្រខ្មែរ": { km: "អក្សរសាស្ត្រខ្មែរ", en: "Khmer Literature" },
        "រូបវិទ្យា": { km: "រូបវិទ្យា", en: "Physics" },
        "គីមីវិទ្យា": { km: "គីមីវិទ្យា", en: "Chemistry" },
        "ជីវវិទ្យា": { km: "ជីវវិទ្យា", en: "Biology" },
        "ប្រវត្តិវិទ្យា": { km: "ប្រវត្តិវិទ្យា", en: "History" },
        "ភូមិវិទ្យា": { km: "ភូមិវិទ្យា", en: "Geography" },
        "សីលធម៌-ពលរដ្ឋវិទ្យា": { km: "សីលធម៌-ពលរដ្ឋវិទ្យា", en: "Morality-Civics" },
        "ផែនដីវិទ្យា": { km: "ផែនដីវិទ្យា", en: "Earth Science" },
        "គេហវិទ្យា": { km: "គេហវិទ្យា", en: "Home Economics" },
        "ភាសាបរទេស": { km: "ភាសាបរទេស", en: "Foreign Language" },
        "ព័ត៌មានវិទ្យា": { km: "ព័ត៌មានវិទ្យា", en: "ICT" },
        "កាយវប្បកម្ម-កីឡា": { km: "កាយវប្បកម្ម-កីឡា", en: "Physical Education" },
        "សេដ្ឋកិច្ច": { km: "សេដ្ឋកិច្ច", en: "Economics" }
    };

    const POSITION_TRANSLATIONS = {
        "គ្រូបង្រៀន": { km: "គ្រូបង្រៀន", en: "Teacher" },
        "ប្រធានក្រុមបច្ចេកទេស": { km: "ប្រធានក្រុមបច្ចេកទេស", en: "Technical Lead" },
        "អនុប្រធានក្រុមកម្រិត": { km: "អនុប្រធានក្រុមកម្រិត", en: "Vice Level Lead" }
    };

    // Predefined classrooms list based on high school grades structure
    const CAMBODIAN_CLASSROOMS = [
        "7A", "7B", "7C", "7D",
        "8A", "8B", "8C", "8D",
        "9A", "9B", "9C", "9D",
        "10A", "10B", "10C", "10D", "10E", "10F",
        "11A", "11B", "11C", "11D", "11E", "11F",
        "12A", "12B", "12C", "12D", "12E", "12F"
    ];

    // ---------------------------------------------------------
    // 2. STATE INITIALIZATION
    // ---------------------------------------------------------
    let teachers = [];
    let attendanceLogs = [];
    let currentLanguage = safeStorage.getItem("so_lang") || "km";
    let currentTheme = safeStorage.getItem("so_theme") || "light";
    let currentRole = safeStorage.getItem("so_role") || "admin";
    let sheetsUrl = safeStorage.getItem("so_sheets_url") || "https://script.google.com/macros/s/AKfycbxRbRgNRrjB5v42pMy_7Yhm7JSf5EQ2poJBt5t5TAWtbAEPjOzABPTdMoXgPCENuAnM2w/exec";
    let currentAcademicYear = safeStorage.getItem("so_academic_year") || "2026-2027";
    let activePage = "#dashboard";
    let editingTeacherId = null;
    let deleteTargetId = null;
    
    let sorting = {
        key: "id",
        direction: "asc"
    };

    let filters = {
        search: "",
        subject: "",
        gender: "",
        status: ""
    };

    let logFilters = {
        class: "",
        academicYear: safeStorage.getItem("so_academic_year") || "2026-2027",
        month: String(new Date().getMonth() + 1).padStart(2, "0"),
        status: ""
    };

    // ---------------------------------------------------------
    // 3. CACHED DOM ELEMENTS
    // ---------------------------------------------------------
    const body = document.body;
    const langBtnKm = document.getElementById("lang-km");
    const langBtnEn = document.getElementById("lang-en");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
    const sidebar = document.querySelector(".sidebar");
    const pageTitle = document.getElementById("current-page-title");
    const roleSelect = document.getElementById("role-select");
    const academicYearSelect = document.getElementById("academic-year-select");
    const logFilterYear = document.getElementById("log-filter-year");
    
    // Pages
    const pageDashboard = document.getElementById("page-dashboard");
    const pageTeachers = document.getElementById("page-teachers");
    const pageAddTeacher = document.getElementById("page-add-teacher");
    const pageAttendance = document.getElementById("page-attendance");
    const pageAttendanceLogs = document.getElementById("page-attendance-logs");
    const pageSettings = document.getElementById("page-settings");

    // Dashboard Statistics
    const statTotal = document.getElementById("stat-total");
    const statFemale = document.getElementById("stat-female");
    const statMale = document.getElementById("stat-male");
    const statActive = document.getElementById("stat-active");
    const insightAvgExp = document.getElementById("insight-avg-exp");
    const insightLeave = document.getElementById("insight-leave");
    const insightLeads = document.getElementById("insight-leads");
    const subjectsChartBars = document.getElementById("subjects-chart-bars");

    // Directory elements
    const searchInput = document.getElementById("search-input");
    const filterSubject = document.getElementById("filter-subject");
    const filterGender = document.getElementById("filter-gender");
    const filterStatus = document.getElementById("filter-status");
    const btnClearFilters = document.getElementById("btn-clear-filters");
    const teachersTableBody = document.getElementById("teachers-table-body");
    const tableEmptyState = document.getElementById("table-empty-state");

    // Attendance Monitor Form Elements
    const attendanceForm = document.getElementById("attendance-form");
    const attClass = document.getElementById("att-class");
    const attTeacher = document.getElementById("att-teacher");
    const attSubject = document.getElementById("att-subject");
    const attPin = document.getElementById("att-pin");
    const attNotes = document.getElementById("att-notes");
    const attDate = document.getElementById("att-date");
    const attHour = document.getElementById("att-hour");

    // Admin Logs elements
    const logsTableBody = document.getElementById("logs-table-body");
    const logsEmptyState = document.getElementById("logs-empty-state");
    const logFilterClass = document.getElementById("log-filter-class");
    const logFilterStatus = document.getElementById("log-filter-status");
    const btnClearLogFilters = document.getElementById("btn-clear-log-filters");
    const btnPrintLogs = document.getElementById("btn-print-logs");
    const logFilterMonth = document.getElementById("log-filter-month");
    const printYearVal = document.getElementById("print-year-val");
    const printMonthVal = document.getElementById("print-title-month");
    const printClassVal = document.getElementById("print-class-val");
    const printStatusVal = document.getElementById("print-status-val");
    const absenteeSummaryCard = document.getElementById("absentee-summary-card");
    const absenteeSummaryContent = document.getElementById("absentee-summary-content");

    // Login and Logout elements
    const loginOverlay = document.getElementById("login-overlay");
    const loginForm = document.getElementById("login-form");
    const loginPassword = document.getElementById("login-password");
    const btnLoginTogglePassword = document.getElementById("btn-login-toggle-password");
    const loginErrorMsg = document.getElementById("login-error-msg");
    const btnLogout = document.getElementById("btn-logout");

    // Form elements
    const teacherForm = document.getElementById("teacher-form");
    const formTitle = document.getElementById("form-title");
    const teacherIdHidden = document.getElementById("teacher-id-hidden");
    const inputNameKh = document.getElementById("input-name-kh");
    const inputNameEn = document.getElementById("input-name-en");
    const inputGender = document.getElementById("input-gender");
    const inputDob = document.getElementById("input-dob");
    const inputPhone = document.getElementById("input-phone");
    const inputEmail = document.getElementById("input-email");
    const inputSubject = document.getElementById("input-subject");
    const inputGrade = document.getElementById("input-grade");
    const inputPosition = document.getElementById("input-position");
    const inputExperience = document.getElementById("input-experience");
    const inputStatus = document.getElementById("input-status");
    const inputJoinDate = document.getElementById("input-join-date");
    const btnFormCancel = document.getElementById("btn-form-cancel");

    // Modals
    const profileModal = document.getElementById("profile-modal");
    const btnCloseProfileModal = document.getElementById("btn-close-profile-modal");
    const btnModalClose = document.getElementById("btn-modal-close");
    const btnModalEdit = document.getElementById("btn-modal-edit");
    const modalProfileAvatar = document.getElementById("modal-profile-avatar");
    const modalNameKh = document.getElementById("modal-name-kh");
    const modalNameEn = document.getElementById("modal-name-en");
    const modalPosition = document.getElementById("modal-position");
    const modalGender = document.getElementById("modal-gender");
    const modalDob = document.getElementById("modal-dob");
    const modalPhone = document.getElementById("modal-phone");
    const modalEmail = document.getElementById("modal-email");
    const modalSubject = document.getElementById("modal-subject");
    const modalGrade = document.getElementById("modal-grade");
    const modalJoinDate = document.getElementById("modal-join-date");
    const modalExperience = document.getElementById("modal-experience");
    const modalStatus = document.getElementById("modal-status");

    const deleteModal = document.getElementById("delete-modal");
    const deleteTeacherName = document.getElementById("delete-teacher-name");
    const btnDeleteCancel = document.getElementById("btn-delete-cancel");
    const btnDeleteConfirm = document.getElementById("btn-delete-confirm");

    // Settings elements
    const settingsSheetsUrl = document.getElementById("settings-sheets-url");
    const btnSaveSheetsUrl = document.getElementById("btn-save-sheets-url");
    const sheetsConnectionStatus = document.getElementById("sheets-connection-status");
    const btnExport = document.getElementById("btn-export");
    const btnTriggerImport = document.getElementById("btn-trigger-import");
    const importFileInput = document.getElementById("import-file-input");
    const btnResetDb = document.getElementById("btn-reset-db");
    const toastContainer = document.getElementById("toast-container");

    // ---------------------------------------------------------
    // 4. THEME & LANGUAGE CONFIGURATION
    // ---------------------------------------------------------
    function initThemeAndLang() {
        // Set theme
        if (currentTheme === "dark") {
            body.classList.add("theme-dark");
            body.classList.remove("theme-light");
        } else {
            body.classList.add("theme-light");
            body.classList.remove("theme-dark");
        }

        // Set language buttons
        if (currentLanguage === "km") {
            langBtnKm.classList.add("active");
            langBtnEn.classList.remove("active");
        } else {
            langBtnEn.classList.add("active");
            langBtnKm.classList.remove("active");
        }

        // Initialize role select dropdown value
        roleSelect.value = currentRole;
        applyRoleTheme(currentRole);

        // Initialize academic year select dropdown value
        academicYearSelect.value = currentAcademicYear;
        logFilterYear.value = logFilters.academicYear;
        logFilterMonth.value = logFilters.month;

        // Pre-fill Webhook settings
        settingsSheetsUrl.value = sheetsUrl;
        updateWebhookStatusIndicator();

        translatePageContent();
        populateSubjectsDropdowns();
        populateAttendanceTeachers();
        populateClassroomsDropdowns();
    }

    function translatePageContent() {
        // Find all elements with data-i18n attribute
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (TRANSLATIONS[currentLanguage][key]) {
                element.textContent = TRANSLATIONS[currentLanguage][key];
            }
        });

        // Find placeholder translations
        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
            const key = element.getAttribute("data-i18n-placeholder");
            if (TRANSLATIONS[currentLanguage][key]) {
                element.setAttribute("placeholder", TRANSLATIONS[currentLanguage][key]);
            }
        });

        // HTML head title translation
        document.title = currentLanguage === "km" 
            ? "ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិកវិទ្យាល័យសម្ដេចឪ" 
            : "Staff Management System - Samdech Ouv HS";

        // Update page title text based on current route
        updatePageTitle();
    }

    function populateSubjectsDropdowns() {
        const currentSubjectFilterVal = filterSubject.value;
        const currentFormSubjectVal = inputSubject.value;
        const currentAttSubjectVal = attSubject.value;

        // Subject Filter Options
        filterSubject.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage].allSubjects}</option>`;
        CAMBODIAN_SUBJECTS.forEach(sub => {
            const subName = SUBJECT_TRANSLATIONS[sub] ? SUBJECT_TRANSLATIONS[sub][currentLanguage] : sub;
            filterSubject.innerHTML += `<option value="${sub}">${subName}</option>`;
        });
        filterSubject.value = currentSubjectFilterVal;

        // Subject Form Options
        inputSubject.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage].selectSubject}</option>`;
        CAMBODIAN_SUBJECTS.forEach(sub => {
            const subName = SUBJECT_TRANSLATIONS[sub] ? SUBJECT_TRANSLATIONS[sub][currentLanguage] : sub;
            inputSubject.innerHTML += `<option value="${sub}">${subName}</option>`;
        });
        inputSubject.value = currentFormSubjectVal;

        // Attendance Subject Selector
        attSubject.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage].selectSubject}</option>`;
        CAMBODIAN_SUBJECTS.forEach(sub => {
            const subName = SUBJECT_TRANSLATIONS[sub] ? SUBJECT_TRANSLATIONS[sub][currentLanguage] : sub;
            attSubject.innerHTML += `<option value="${sub}">${subName}</option>`;
        });
        attSubject.value = currentAttSubjectVal;
    }

    // Dynamic populate attendance teachers selector dropdown
    function populateAttendanceTeachers() {
        const selectedVal = attTeacher.value;
        attTeacher.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage].selectTeacher}</option>`;
        
        // Only load active teachers
        teachers.filter(t => t && t.status === "Active").forEach(t => {
            const nameDisplay = currentLanguage === "km" ? t.nameKh : t.nameEn;
            const subDisplay = (t.subject && SUBJECT_TRANSLATIONS[t.subject]) ? SUBJECT_TRANSLATIONS[t.subject][currentLanguage] : t.subject;
            attTeacher.innerHTML += `<option value="${t.id}">${nameDisplay} (${subDisplay})</option>`;
        });

        attTeacher.value = selectedVal;
    }

    // Dynamic populate classrooms selector dropdowns
    function populateClassroomsDropdowns() {
        const currentAttClassVal = attClass.value;
        const currentFilterClassVal = logFilterClass.value;

        // Class Selector
        attClass.innerHTML = `<option value="">${currentLanguage === 'km' ? '-- ជ្រើសរើសថ្នាក់ --' : '-- Select Class --'}</option>`;
        CAMBODIAN_CLASSROOMS.forEach(cls => {
            const label = currentLanguage === 'km' ? `ថ្នាក់ទី ${cls}` : `Grade ${cls}`;
            attClass.innerHTML += `<option value="${cls}">${label}</option>`;
        });
        attClass.value = currentAttClassVal;

        // Log Filter Class Selector
        logFilterClass.innerHTML = `<option value="">${currentLanguage === 'km' ? '-- គ្រប់ថ្នាក់ --' : '-- All Classes --'}</option>`;
        CAMBODIAN_CLASSROOMS.forEach(cls => {
            const label = currentLanguage === 'km' ? `ថ្នាក់ទី ${cls}` : `Grade ${cls}`;
            logFilterClass.innerHTML += `<option value="${cls}">${label}</option>`;
        });
        logFilterClass.value = currentFilterClassVal;
    }

    // Toggle language
    function setLanguage(lang) {
        currentLanguage = lang;
        safeStorage.setItem("so_lang", lang);
        
        langBtnKm.classList.toggle("active", lang === "km");
        langBtnEn.classList.toggle("active", lang === "en");
        
        translatePageContent();
        populateSubjectsDropdowns();
        populateAttendanceTeachers();
        populateClassroomsDropdowns();
        renderDashboardStats();
        renderTeachersDirectory();
        renderAttendanceLogs();
        updateWebhookStatusIndicator();
    }

    // Toggle theme
    function toggleTheme() {
        if (body.classList.contains("theme-light")) {
            body.classList.replace("theme-light", "theme-dark");
            currentTheme = "dark";
        } else {
            body.classList.replace("theme-dark", "theme-light");
            currentTheme = "light";
        }
        safeStorage.setItem("so_theme", currentTheme);
    }

    // ---------------------------------------------------------
    // 5. TOAST NOTIFICATION SYSTEM
    // ---------------------------------------------------------
    function showToast(messageKey, type = "success") {
        const message = TRANSLATIONS[currentLanguage][messageKey] || messageKey;
        
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let iconSvg = "";
        if (type === "success") {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                       </svg>`;
        } else if (type === "danger") {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                       </svg>`;
        } else {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                       </svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <span class="toast-msg">${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // ---------------------------------------------------------
    // 6. ROLE CONFIGURATION & TRANSITIONS
    // ---------------------------------------------------------
    function applyRoleTheme(role) {
        currentRole = role;
        safeStorage.setItem("so_role", role);

        if (role === "monitor") {
            body.classList.add("role-monitor");
        } else {
            body.classList.remove("role-monitor");
        }
    }

    roleSelect.addEventListener("change", (e) => {
        const nextRole = e.target.value;
        applyRoleTheme(nextRole);
        
        // Handle Routing redirect on Role change
        if (nextRole === "monitor") {
            navigateToPage("#attendance");
            window.location.hash = "#attendance";
        } else {
            navigateToPage("#dashboard");
            window.location.hash = "#dashboard";
        }
        showToast("toastSaveSuccess", "success");
    });

    // ---------------------------------------------------------
    // 7. ROUTING SYSTEM (SPA NAVIGATION)
    // ---------------------------------------------------------
    function navigateToPage(hash) {
        if (!hash) hash = "#dashboard";
        
        // Force monitors to stay in permitted views (dashboard or attendance)
        if (currentRole === "monitor" && hash !== "#attendance" && hash !== "#dashboard") {
            hash = "#dashboard";
        }

        activePage = hash;

        // Reset sidebar selection active state
        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === hash) {
                item.classList.add("active");
            }
        });

        // Hide all pages, show active
        document.querySelectorAll(".app-page").forEach(page => {
            page.classList.remove("active");
        });

        const targetPage = document.getElementById("page-" + hash.substring(1));
        if (targetPage) {
            targetPage.classList.add("active");
        }

        updatePageTitle();

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("active");
        }

        // Action triggers when loading page
        if (hash === "#dashboard") {
            renderDashboardStats();
        } else if (hash === "#teachers") {
            renderTeachersDirectory();
        } else if (hash === "#add-teacher" && !editingTeacherId) {
            resetTeacherForm();
        } else if (hash === "#attendance-logs") {
            renderAttendanceLogs();
        } else if (hash === "#attendance") {
            resetAttendanceForm();
            populateAttendanceTeachers();
        }
    }

    function updatePageTitle() {
        const rawKey = activePage.substring(1);
        let titleKey = "menu" + rawKey.charAt(0).toUpperCase() + rawKey.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase());
        if (titleKey === "menuAttendance") {
            titleKey = "attendanceFormTitle";
        }
        const mappedKey = titleKey === "menuAddTeacher" && editingTeacherId ? "formTitleEdit" : titleKey;
        pageTitle.textContent = TRANSLATIONS[currentLanguage][mappedKey] || TRANSLATIONS[currentLanguage].menuDashboard;
    }

    // ---------------------------------------------------------
    // 8. DATA PERSISTENCE & LOAD
    // ---------------------------------------------------------
    function loadData() {
        // 1. Load Teachers
        const storedTeachers = safeStorage.getItem("so_teachers");
        if (storedTeachers) {
            try {
                const parsed = JSON.parse(storedTeachers);
                if (Array.isArray(parsed)) {
                    teachers = parsed;
                } else {
                    teachers = [...INITIAL_TEACHERS];
                }
            } catch (e) {
                console.error("Error loading teachers data", e);
                teachers = [...INITIAL_TEACHERS];
            }
        } else {
            teachers = [...INITIAL_TEACHERS];
            saveData();
        }

        // 2. Load Attendance Logs
        const storedLogs = safeStorage.getItem("so_attendance_logs");
        if (storedLogs) {
            try {
                const parsed = JSON.parse(storedLogs);
                if (Array.isArray(parsed)) {
                    attendanceLogs = parsed;
                } else {
                    attendanceLogs = [];
                }
            } catch (e) {
                console.error("Error loading attendance logs", e);
                attendanceLogs = [];
            }
        } else {
            attendanceLogs = [];
        }
    }

    function saveData() {
        try {
            safeStorage.setItem("so_teachers", JSON.stringify(teachers));
        } catch (e) {
            console.error("Failed to save teachers to localStorage", e);
            alert("មិនអាចរក្សាទុកទិន្នន័យគ្រូបានឡើយ (Storage Full/Disabled)!");
        }
    }

    function saveAttendanceLogs() {
        try {
            safeStorage.setItem("so_attendance_logs", JSON.stringify(attendanceLogs));
        } catch (e) {
            console.error("Failed to save attendance logs to localStorage", e);
            alert("មិនអាចរក្សាទុកកំណត់ត្រាអវត្តមានបានឡើយ (Storage Full/Disabled)!");
        }
    }

    // ---------------------------------------------------------
    // 9. DASHBOARD LOGIC (STATISTICS & CHART)
    // ---------------------------------------------------------
    function renderDashboardStats() {
        const validTeachers = teachers.filter(t => t);
        const totalCount = validTeachers.length;
        const femaleCount = validTeachers.filter(t => t.gender === "F").length;
        const maleCount = totalCount - femaleCount;
        const activeCount = validTeachers.filter(t => t.status === "Active").length;
        const leaveCount = totalCount - activeCount;

        // Calculate Experience
        let totalExp = 0;
        let leadCount = 0;
        validTeachers.forEach(t => {
            totalExp += parseInt(t.experienceYears || 0);
            if (t.position === "ប្រធានក្រុមបច្ចេកទេស" || t.position === "Technical Lead") {
                leadCount++;
            }
        });
        const avgExpVal = totalCount > 0 ? Math.round(totalExp / totalCount) : 0;

        statTotal.textContent = totalCount;
        statFemale.textContent = femaleCount;
        statMale.textContent = maleCount;
        statActive.textContent = activeCount;

        insightAvgExp.textContent = avgExpVal + TRANSLATIONS[currentLanguage].yearsExp;
        insightLeave.textContent = leaveCount + ` ${currentLanguage === 'km' ? 'នាក់' : ''}`;
        insightLeads.textContent = leadCount + ` ${currentLanguage === 'km' ? 'នាក់' : ''}`;

        renderSubjectDistributionChart();
    }

    function renderSubjectDistributionChart() {
        subjectsChartBars.innerHTML = "";

        const subjectCounts = {};
        CAMBODIAN_SUBJECTS.forEach(sub => {
            subjectCounts[sub] = 0;
        });

        teachers.filter(t => t).forEach(t => {
            if (t.subject && subjectCounts[t.subject] !== undefined) {
                subjectCounts[t.subject]++;
            } else if (t.subject) {
                subjectCounts[t.subject] = 1;
            }
        });

        let maxCount = 0;
        const sortedSubjects = Object.keys(subjectCounts).map(sub => {
            const count = subjectCounts[sub];
            if (count > maxCount) maxCount = count;
            return { name: sub, count: count };
        }).sort((a, b) => b.count - a.count);

        if (maxCount === 0) maxCount = 1;

        sortedSubjects.forEach(item => {
            if (item.count === 0) return;

            const percentage = (item.count / maxCount) * 100;
            const subLabel = SUBJECT_TRANSLATIONS[item.name] 
                ? SUBJECT_TRANSLATIONS[item.name][currentLanguage] 
                : item.name;

            const chartRow = document.createElement("div");
            chartRow.className = "chart-row";
            chartRow.innerHTML = `
                <div class="chart-label" title="${subLabel}">${subLabel}</div>
                <div class="chart-bar-wrapper">
                    <div class="chart-bar-fill" style="width: 0%"></div>
                </div>
                <div class="chart-value">${item.count}</div>
            `;

            subjectsChartBars.appendChild(chartRow);

            setTimeout(() => {
                const fillBar = chartRow.querySelector(".chart-bar-fill");
                if (fillBar) fillBar.style.width = `${percentage}%`;
            }, 100);
        });
    }

    // ---------------------------------------------------------
    // 10. TEACHER DIRECTORY LOGIC (TABLE & FILTERS)
    // ---------------------------------------------------------
    function renderTeachersDirectory() {
        const filteredTeachers = getFilteredTeachers();
        teachersTableBody.innerHTML = "";
        
        if (filteredTeachers.length === 0) {
            tableEmptyState.classList.remove("hidden");
        } else {
            tableEmptyState.classList.add("hidden");
            
            filteredTeachers.forEach(t => {
                const tr = document.createElement("tr");
                tr.dataset.id = t.id;
                
                const statusClass = t.status === "Active" ? "badge-active" : "badge-leave";
                const statusLabel = t.status === "Active" 
                    ? TRANSLATIONS[currentLanguage].statusActive 
                    : TRANSLATIONS[currentLanguage].statusLeave;

                const genderLabel = t.gender === "F" ? TRANSLATIONS[currentLanguage].genderFemale : TRANSLATIONS[currentLanguage].genderMale;
                const subjectLabel = SUBJECT_TRANSLATIONS[t.subject] ? SUBJECT_TRANSLATIONS[t.subject][currentLanguage] : t.subject;
                const positionLabel = POSITION_TRANSLATIONS[t.position] ? POSITION_TRANSLATIONS[t.position][currentLanguage] : t.position;
                
                const nameDisplay = currentLanguage === "km" ? t.nameKh : t.nameEn;

                tr.innerHTML = `
                    <td class="col-id">${t.id}</td>
                    <td class="col-name">${nameDisplay}</td>
                    <td class="col-gender">${genderLabel}</td>
                    <td class="col-subject">${subjectLabel}</td>
                    <td class="col-grade">${t.grade}</td>
                    <td class="col-position">${positionLabel}</td>
                    <td class="col-status">
                        <span class="badge-status ${statusClass}">${statusLabel}</span>
                    </td>
                    <td class="col-actions">
                        <div class="action-btn-grp">
                            <button class="action-btn btn-view" title="មើលគំរូប្រវត្តិរូប">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                            <button class="action-btn btn-edit" title="កែសម្រួលព័ត៌មាន">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9"/>
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                            </button>
                            <button class="action-btn btn-delete" title="លុបទិន្នន័យ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;

                tr.querySelector(".btn-view").addEventListener("click", () => openProfileModal(t.id));
                tr.querySelector(".btn-edit").addEventListener("click", () => startEditTeacher(t.id));
                tr.querySelector(".btn-delete").addEventListener("click", () => openDeleteModal(t.id));

                teachersTableBody.appendChild(tr);
            });
        }
    }

    function getFilteredTeachers() {
        let result = [...teachers].filter(t => t);

        if (filters.search) {
            const query = filters.search.toLowerCase().trim();
            result = result.filter(t => 
                t.id.toLowerCase().includes(query) ||
                t.nameKh.toLowerCase().includes(query) ||
                t.nameEn.toLowerCase().includes(query) ||
                t.phone.replace(/\s+/g, "").includes(query.replace(/\s+/g, ""))
            );
        }

        if (filters.subject) {
            result = result.filter(t => t.subject === filters.subject);
        }

        if (filters.gender) {
            result = result.filter(t => t.gender === filters.gender);
        }

        if (filters.status) {
            result = result.filter(t => t.status === filters.status);
        }

        result.sort((a, b) => {
            let valA = a[sorting.key] || "";
            let valB = b[sorting.key] || "";

            if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
            if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }

    // Header Sort Triggers
    document.querySelectorAll(".data-table th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const key = th.getAttribute("data-sort");
            if (sorting.key === key) {
                sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
            } else {
                sorting.key = key;
                sorting.direction = "asc";
            }

            document.querySelectorAll(".data-table th .sort-icon").forEach(icon => {
                icon.textContent = "↕";
            });
            const indicator = th.querySelector(".sort-icon");
            indicator.textContent = sorting.direction === "asc" ? "▲" : "▼";

            renderTeachersDirectory();
        });
    });

    searchInput.addEventListener("input", (e) => {
        filters.search = e.target.value;
        renderTeachersDirectory();
    });

    filterSubject.addEventListener("change", (e) => {
        filters.subject = e.target.value;
        renderTeachersDirectory();
    });

    filterGender.addEventListener("change", (e) => {
        filters.gender = e.target.value;
        renderTeachersDirectory();
    });

    filterStatus.addEventListener("change", (e) => {
        filters.status = e.target.value;
        renderTeachersDirectory();
    });

    btnClearFilters.addEventListener("click", () => {
        searchInput.value = "";
        filterSubject.value = "";
        filterGender.value = "";
        filterStatus.value = "";
        filters = { search: "", subject: "", gender: "", status: "" };
        renderTeachersDirectory();
    });

    // ---------------------------------------------------------
    // 11. ADD/EDIT TEACHER FORM LOGIC
    // ---------------------------------------------------------
    function resetTeacherForm() {
        editingTeacherId = null;
        teacherIdHidden.value = "";
        teacherForm.reset();
        document.querySelectorAll(".error-msg").forEach(span => span.textContent = "");
        document.querySelectorAll(".form-input, .form-select").forEach(input => input.classList.remove("invalid"));
        formTitle.textContent = TRANSLATIONS[currentLanguage].formTitleAdd;
        updatePageTitle();
    }

    function startEditTeacher(id) {
        const teacher = teachers.find(t => t.id === id);
        if (!teacher) return;

        editingTeacherId = id;
        teacherIdHidden.value = teacher.id;

        inputNameKh.value = teacher.nameKh;
        inputNameEn.value = teacher.nameEn;
        inputGender.value = teacher.gender;
        inputDob.value = teacher.dob || "";
        inputPhone.value = teacher.phone;
        inputEmail.value = teacher.email || "";
        inputSubject.value = teacher.subject;
        inputGrade.value = teacher.grade;
        inputPosition.value = teacher.position;
        inputExperience.value = teacher.experienceYears || 0;
        inputStatus.value = teacher.status;
        inputJoinDate.value = teacher.joinDate || "";

        document.querySelectorAll(".error-msg").forEach(span => span.textContent = "");
        formTitle.textContent = TRANSLATIONS[currentLanguage].formTitleEdit;
        navigateToPage("#add-teacher");
    }

    teacherForm.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
            let isValid = true;
            
            function setError(inputEl, spanId, messageKey) {
                const span = document.getElementById(spanId);
                if (span) span.textContent = TRANSLATIONS[currentLanguage][messageKey] || messageKey;
                inputEl.classList.add("invalid");
                isValid = false;
            }

            document.querySelectorAll(".error-msg").forEach(span => span.textContent = "");
            document.querySelectorAll(".form-input, .form-select").forEach(input => input.classList.remove("invalid"));

            if (!inputNameKh.value.trim()) setError(inputNameKh, "err-name-kh", "validationErr");
            if (!inputGender.value) setError(inputGender, "err-gender", "validationErr");

            // Strip spaces, plus sign, hyphens, and parentheses for validation
            const rawPhone = inputPhone.value.trim().replace(/[\s\+\-\(\)]/g, "");
            if (rawPhone && !/^\d{9,12}$/.test(rawPhone)) {
                setError(inputPhone, "err-phone", "phoneErr");
            }

            const emailVal = inputEmail.value.trim();
            if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                setError(inputEmail, "err-email", "emailErr");
            }

            if (!inputSubject.value) setError(inputSubject, "err-subject", "validationErr");
            if (!inputPosition.value) setError(inputPosition, "err-position", "validationErr");

            if (!isValid) {
                showToast("validationErr", "danger");
                return;
            }

            const teacherData = {
                nameKh: inputNameKh.value.trim(),
                nameEn: inputNameEn.value.trim() || "-",
                gender: inputGender.value,
                dob: inputDob.value || null,
                phone: inputPhone.value.trim() || "-",
                email: inputEmail.value.trim() || null,
                subject: inputSubject.value,
                grade: inputGrade.value.trim() || "-",
                position: inputPosition.value,
                experienceYears: parseInt(inputExperience.value) || 0,
                status: inputStatus.value,
                joinDate: inputJoinDate.value || null
            };

            if (editingTeacherId) {
                const index = teachers.findIndex(t => t.id === editingTeacherId);
                if (index !== -1) {
                    teachers[index] = { ...teachers[index], ...teacherData };
                    showToast("toastSaveSuccess", "success");
                }
            } else {
                const maxIdNum = teachers.reduce((max, t) => {
                    if (t && t.id) {
                        const match = String(t.id).match(/TCH-(\d+)/);
                        if (match) {
                            const num = parseInt(match[1], 10);
                            return num > max ? num : max;
                        }
                    }
                    return max;
                }, 0);

                const nextIdStr = "TCH-" + String(maxIdNum + 1).padStart(3, "0");
                const newTeacher = { id: nextIdStr, ...teacherData };
                
                teachers.push(newTeacher);
                showToast("toastSaveSuccess", "success");
            }

            saveData();
            resetTeacherForm();
            navigateToPage("#teachers");
        } catch (error) {
            console.error("Error saving teacher profile:", error);
            alert("មានបញ្ហាក្នុងការរក្សាទុក៖ " + error.message);
        }
    });

    btnFormCancel.addEventListener("click", () => {
        resetTeacherForm();
        navigateToPage("#teachers");
    });

    // ---------------------------------------------------------
    // 12. CLASS MONITOR ATTENDANCE SYSTEM LOGIC
    // ---------------------------------------------------------
    function resetAttendanceForm() {
        attendanceForm.reset();
        attSubject.value = "";
        
        // Set today's date in local YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        attDate.value = `${year}-${month}-${day}`;

        document.querySelectorAll("#page-attendance .error-msg").forEach(span => span.textContent = "");
        document.querySelectorAll("#page-attendance .form-input, #page-attendance .form-select").forEach(input => input.classList.remove("invalid"));
    }

    // Auto-load subject when teacher is selected
    attTeacher.addEventListener("change", (e) => {
        const id = e.target.value;
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            attSubject.value = teacher.subject;
        } else {
            attSubject.value = "";
        }
    });

    // Submit Attendance Form Handler
    attendanceForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let isValid = true;

        function setAttError(inputEl, spanId, messageKey) {
            const span = document.getElementById(spanId);
            if (span) span.textContent = TRANSLATIONS[currentLanguage][messageKey] || messageKey;
            inputEl.classList.add("invalid");
            isValid = false;
        }

        // Reset errors
        document.querySelectorAll("#page-attendance .error-msg").forEach(span => span.textContent = "");
        document.querySelectorAll("#page-attendance .form-input, #page-attendance .form-select").forEach(input => input.classList.remove("invalid"));

        if (!attClass.value) setAttError(attClass, "err-att-class", "validationErr");
        if (!attTeacher.value) setAttError(attTeacher, "err-att-teacher", "validationErr");
        if (!attDate.value) setAttError(attDate, "err-att-date", "validationErr");
        if (!attHour.value) setAttError(attHour, "err-att-hour", "validationErr");
        
        // Simple security check (PIN code default is 1234)
        if (attPin.value !== "1234") {
            setAttError(attPin, "err-att-pin", "invalidPin");
        }

        if (!isValid) {
            showToast("validationErr", "danger");
            return;
        }

        const teacher = teachers.find(t => t.id === attTeacher.value);
        const statusVal = document.querySelector('input[name="att-status"]:checked').value;
        
        const timestamp = new Date().toLocaleString(currentLanguage === "km" ? "km-KH" : "en-US");
        const isoString = new Date().toISOString();

        const logEntry = {
            id: "LOG-" + Date.now(),
            timestamp: timestamp,
            isoString: isoString,
            className: attClass.value,
            academicYear: currentAcademicYear,
            date: attDate.value,
            studyHour: attHour.value,
            teacherId: teacher.id,
            teacherName: currentLanguage === "km" ? teacher.nameKh : teacher.nameEn,
            teacherNameKh: teacher.nameKh,
            teacherNameEn: teacher.nameEn,
            subject: attSubject.value || teacher.subject,
            status: statusVal,
            notes: attNotes.value.trim() || "-",
            syncStatus: "Pending"
        };

        // Add to local state and save
        attendanceLogs.unshift(logEntry);
        saveAttendanceLogs();

        showToast("toastSaveSuccess", "success");
        resetAttendanceForm();

        // Trigger Async Cloud Webhook post request
        syncAttendanceRecord(logEntry);
    });

    async function syncAttendanceRecord(log) {
        if (!sheetsUrl) {
            // Not configured
            return;
        }

        try {
            // Send fetch request (JSON payload)
            const response = await fetch(sheetsUrl, {
                method: "POST",
                mode: "no-cors", // Required for Google Web App redirection bounds
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    timestamp: log.timestamp,
                    academicYear: log.academicYear,
                    className: log.className,
                    date: log.date,
                    studyHour: log.studyHour,
                    teacherId: log.teacherId,
                    teacherName: log.teacherNameKh + " (" + log.teacherNameEn + ")",
                    subject: log.subject,
                    status: log.status,
                    notes: log.notes
                })
            });

            // With no-cors, fetch resolves but response status is 0. 
            // We assume success if it didn't throw an error.
            const index = attendanceLogs.findIndex(l => l.id === log.id);
            if (index !== -1) {
                attendanceLogs[index].syncStatus = "Synced";
                saveAttendanceLogs();
            }
            console.log("Attendance record synced successfully to Google Sheets!");
        } catch (error) {
            console.error("Failed to sync attendance record to Google Sheets", error);
        }
    }

    // ---------------------------------------------------------
    // 13. ADMIN ATTENDANCE LOGS HISTORY TABLE
    // ---------------------------------------------------------
    function renderAttendanceLogs() {
        logsTableBody.innerHTML = "";
        
        let filteredLogs = [...attendanceLogs];

        if (logFilters.class) {
            filteredLogs = filteredLogs.filter(l => l.className === logFilters.class);
        }

        if (logFilters.academicYear) {
            filteredLogs = filteredLogs.filter(l => !l.academicYear || l.academicYear === logFilters.academicYear);
        }

        if (logFilters.month) {
            filteredLogs = filteredLogs.filter(l => {
                if (!l.date) return false;
                const normalizedDate = l.date.replace(/\//g, "-");
                const parts = normalizedDate.split("-");
                if (parts.length !== 3) return false;
                
                const m1 = parseInt(parts[1], 10);
                const m2 = parseInt(parts[0], 10);
                const targetMonth = parseInt(logFilters.month, 10);
                
                return m1 === targetMonth || (parts[2].length === 4 && m2 === targetMonth);
            });
        }

        if (logFilters.status) {
            filteredLogs = filteredLogs.filter(l => l.status === logFilters.status);
        }

        // Sort chronologically ascending (from 1st of month to end of month)
        filteredLogs.sort((a, b) => {
            const dateA = (a.date || "").replace(/\//g, "-");
            const dateB = (b.date || "").replace(/\//g, "-");
            return dateA.localeCompare(dateB);
        });

        // Build Absentee Summary
        const absentSummary = {};
        filteredLogs.forEach(l => {
            if (l.status === "Absent") {
                const teacherKey = l.teacherId || l.teacherNameKh;
                if (!absentSummary[teacherKey]) {
                    absentSummary[teacherKey] = {
                        name: currentLanguage === "km" ? l.teacherNameKh : l.teacherNameEn,
                        subject: l.subject,
                        count: 0,
                        details: []
                    };
                }
                absentSummary[teacherKey].count++;
                
                // Format date for details list
                let dateDisplay = l.date || "-";
                const normalizedDate = dateDisplay.replace(/\//g, "-");
                const dp = normalizedDate.split("-");
                let formattedDate = dateDisplay;
                if (dp.length === 3) {
                    formattedDate = dp[0].length === 4 ? `${dp[2]}-${dp[1]}-${dp[0]}` : dateDisplay;
                }
                
                const classLabel = currentLanguage === "km" ? `ថ្នាក់ ${l.className}` : `Class ${l.className}`;
                const hourLabel = currentLanguage === "km" ? `ម៉ោងទី ${l.studyHour}` : `Hour ${l.studyHour}`;
                const noteText = l.notes && l.notes !== "-" ? ` (${l.notes})` : "";
                
                absentSummary[teacherKey].details.push(`${formattedDate} - ${classLabel} - ${hourLabel}${noteText}`);
            }
        });

        const absentTeachers = Object.values(absentSummary);
        if (absentTeachers.length > 0) {
            absenteeSummaryCard.classList.remove("hidden");
            
            let summaryHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">`;
            absentTeachers.forEach(t => {
                const subDisplay = SUBJECT_TRANSLATIONS[t.subject] ? SUBJECT_TRANSLATIONS[t.subject][currentLanguage] : t.subject;
                const timesText = currentLanguage === "km" ? `${t.count} ដង` : `${t.count} time(s)`;
                summaryHTML += `
                    <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 12px 16px; border-radius: 8px; font-size: 14px;">
                        <div style="font-weight: 700; color: var(--text-color); margin-bottom: 4px;">
                            ${t.name} <span style="font-weight: 400; color: var(--text-muted); font-size: 13px;">(${subDisplay})</span>
                        </div>
                        <div style="font-size: 13px; font-weight: 600; color: #ef4444; margin-bottom: 8px;">
                            ${currentLanguage === "km" ? "អវត្តមានសរុប" : "Total Absences"}: ${timesText}
                        </div>
                        <ul style="margin: 0; padding-left: 18px; line-height: 1.5; color: var(--text-muted); font-size: 12px;">
                            ${t.details.map(d => `<li>${d}</li>`).join("")}
                        </ul>
                    </div>
                `;
            });
            summaryHTML += `</div>`;
            absenteeSummaryContent.innerHTML = summaryHTML;
        } else {
            absenteeSummaryCard.classList.add("hidden");
            absenteeSummaryContent.innerHTML = "";
        }

        if (filteredLogs.length === 0) {
            logsEmptyState.classList.remove("hidden");
            absenteeSummaryCard.classList.add("hidden");
            absenteeSummaryContent.innerHTML = "";
        } else {
            logsEmptyState.classList.add("hidden");

            filteredLogs.forEach(l => {
                const tr = document.createElement("tr");
                
                // Status mapping
                let statusLabel = "";
                let statusClass = "";
                if (l.status === "Present") {
                    statusLabel = TRANSLATIONS[currentLanguage].statusPresent;
                    statusClass = "badge-active";
                } else if (l.status === "Late") {
                    statusLabel = TRANSLATIONS[currentLanguage].statusLate;
                    statusClass = "badge-leave"; // yellow
                } else {
                    statusLabel = TRANSLATIONS[currentLanguage].statusAbsent;
                    statusClass = "btn-danger"; // red
                }

                // Sync status indicator badge
                const syncClass = l.syncStatus === "Synced" ? "badge-sync-ok" : "badge-sync-pending";
                const syncText = l.syncStatus === "Synced" 
                    ? TRANSLATIONS[currentLanguage].syncOk 
                    : TRANSLATIONS[currentLanguage].syncPending;

                const nameDisplay = currentLanguage === "km" ? l.teacherNameKh : l.teacherNameEn;
                const subjectLabel = SUBJECT_TRANSLATIONS[l.subject] ? SUBJECT_TRANSLATIONS[l.subject][currentLanguage] : l.subject;

                // Format selected class date (YYYY-MM-DD -> DD-MM-YYYY)
                let dateDisplay = l.date || "-";
                const normalizedDate = dateDisplay.replace(/\//g, "-");
                const dp = normalizedDate.split("-");
                if (dp.length === 3) {
                    if (dp[0].length === 4) {
                        dateDisplay = `${dp[2]}-${dp[1]}-${dp[0]}`;
                    } else {
                        dateDisplay = `${dp[0]}-${dp[1]}-${dp[2]}`;
                    }
                }
                const hourDisplay = l.studyHour ? ` (${l.studyHour})` : "";
                const dateTimeDisplay = `${dateDisplay}${hourDisplay}`;

                tr.innerHTML = `
                    <td style="font-family: var(--font-english); font-size: 11px;" title="ពេលវេលាស្នើសុំ៖ ${l.timestamp}">${dateTimeDisplay}</td>
                    <td style="font-family: var(--font-english); font-weight: bold;">${l.className}</td>
                    <td><strong>${nameDisplay}</strong> (${l.teacherId})</td>
                    <td>${subjectLabel}</td>
                    <td><span class="badge-status ${statusClass}" style="width:100%; text-align:center;">${statusLabel}</span></td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${l.notes}">${l.notes}</td>
                    <td>
                        <span class="badge-sync ${syncClass}">${syncText}</span>
                    </td>
                `;

                logsTableBody.appendChild(tr);
            });
        }
    }

    logFilterClass.addEventListener("change", (e) => {
        logFilters.class = e.target.value;
        renderAttendanceLogs();
    });

    logFilterYear.addEventListener("change", (e) => {
        logFilters.academicYear = e.target.value;
        renderAttendanceLogs();
    });

    logFilterMonth.addEventListener("change", (e) => {
        logFilters.month = e.target.value;
        renderAttendanceLogs();
    });

    logFilterStatus.addEventListener("change", (e) => {
        logFilters.status = e.target.value;
        renderAttendanceLogs();
    });

    btnClearLogFilters.addEventListener("click", () => {
        const currentMonthCode = String(new Date().getMonth() + 1).padStart(2, "0");
        logFilterClass.value = "";
        logFilterYear.value = currentAcademicYear;
        logFilterMonth.value = currentMonthCode;
        logFilterStatus.value = "";
        logFilters = { class: "", academicYear: currentAcademicYear, month: currentMonthCode, status: "" };
        renderAttendanceLogs();
    });

    academicYearSelect.addEventListener("change", (e) => {
        currentAcademicYear = e.target.value;
        safeStorage.setItem("so_academic_year", currentAcademicYear);
        logFilters.academicYear = currentAcademicYear;
        logFilterYear.value = currentAcademicYear;
        renderAttendanceLogs();
        showToast("toastSaveSuccess", "success");
    });

    btnPrintLogs.addEventListener("click", () => {
        // Set dynamic metadata for printed header
        printYearVal.textContent = logFilters.academicYear || (currentLanguage === "km" ? "គ្រប់ឆ្នាំសិក្សា" : "All Academic Years");
        printMonthVal.textContent = logFilters.month ? getMonthName(logFilters.month) : (currentLanguage === "km" ? "គ្រប់ខែ" : "All Months");
        printClassVal.textContent = logFilters.class || (currentLanguage === "km" ? "គ្រប់ថ្នាក់" : "All Classes");
        
        if (logFilters.status) {
            printStatusVal.textContent = TRANSLATIONS[currentLanguage]["status" + logFilters.status];
        } else {
            printStatusVal.textContent = currentLanguage === "km" ? "គ្រប់ស្ថានភាព" : "All Statuses";
        }

        window.print();
    });

    function getMonthName(monthCode) {
        const monthNames = {
            "01": { km: "ខែមករា", en: "January" },
            "02": { km: "ខែកុម្ភៈ", en: "February" },
            "03": { km: "ខែមីនា", en: "March" },
            "04": { km: "ខែមេសា", en: "April" },
            "05": { km: "ខែឧសភា", en: "May" },
            "06": { km: "ខែមិថុនា", en: "June" },
            "07": { km: "ខែកក្កដា", en: "July" },
            "08": { km: "ខែសីហា", en: "August" },
            "09": { km: "ខែកញ្ញា", en: "September" },
            "10": { km: "ខែតុលា", en: "October" },
            "11": { km: "ខែវិច្ឆិកា", en: "November" },
            "12": { km: "ខែធ្នូ", en: "December" }
        };
        return monthNames[monthCode] ? monthNames[monthCode][currentLanguage] : monthCode;
    }

    // ---------------------------------------------------------
    // 14. WEBHOOK SETTINGS AND SYNC LOGIC
    // ---------------------------------------------------------
    btnSaveSheetsUrl.addEventListener("click", () => {
        const urlValue = settingsSheetsUrl.value.trim();
        sheetsUrl = urlValue;
        safeStorage.setItem("so_sheets_url", urlValue);
        
        updateWebhookStatusIndicator();
        showToast("toastSaveSuccess", "success");
        
        // Auto-retry syncing any pending logs since Webhook is now configured
        if (sheetsUrl) {
            attendanceLogs.filter(l => l.syncStatus === "Pending").forEach(log => {
                syncAttendanceRecord(log);
            });
        }
    });

    function updateWebhookStatusIndicator() {
        if (sheetsUrl) {
            sheetsConnectionStatus.innerHTML = `
                <span style="color: var(--color-success); font-weight: bold; display: flex; align-items: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ${currentLanguage === 'km' ? 'បានភ្ជាប់អនឡាញ (Connected)' : 'Connected'}
                </span>
            `;
        } else {
            sheetsConnectionStatus.innerHTML = `
                <span style="color: var(--color-warning); font-weight: bold; display: flex; align-items: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    ${currentLanguage === 'km' ? 'មិនទាន់រៀបចំសមកាលកម្មទេ (Not Synced)' : 'Cloud Sync Off'}
                </span>
            `;
        }
    }

    // ---------------------------------------------------------
    // 15. PROFILE MODAL CV VIEW
    // ---------------------------------------------------------
    function openProfileModal(id) {
        const teacher = teachers.find(t => t.id === id);
        if (!teacher) return;

        const initials = teacher.nameEn.split(" ").map(w => w.charAt(0).toUpperCase()).join("").substring(0, 2);
        modalProfileAvatar.textContent = initials;
        
        if (teacher.gender === "F") {
            modalProfileAvatar.style.backgroundColor = "var(--color-female)";
        } else {
            modalProfileAvatar.style.backgroundColor = "var(--primary-color)";
        }

        modalNameKh.textContent = teacher.nameKh;
        modalNameEn.textContent = teacher.nameEn;
        
        const positionLabel = POSITION_TRANSLATIONS[teacher.position] ? POSITION_TRANSLATIONS[teacher.position][currentLanguage] : teacher.position;
        modalPosition.textContent = positionLabel;

        modalGender.textContent = teacher.gender === "F" ? TRANSLATIONS[currentLanguage].genderFemale : TRANSLATIONS[currentLanguage].genderMale;
        
        function formatDate(dateStr) {
            if (!dateStr) return "-";
            const parts = dateStr.split("-");
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
        }

        modalDob.textContent = formatDate(teacher.dob);
        modalPhone.textContent = teacher.phone;
        modalEmail.textContent = teacher.email || "-";
        
        const subjectLabel = SUBJECT_TRANSLATIONS[teacher.subject] ? SUBJECT_TRANSLATIONS[teacher.subject][currentLanguage] : teacher.subject;
        modalSubject.textContent = subjectLabel;
        modalGrade.textContent = teacher.grade;
        modalJoinDate.textContent = formatDate(teacher.joinDate);
        modalExperience.textContent = (teacher.experienceYears || 0) + TRANSLATIONS[currentLanguage].yearsExp;

        modalStatus.textContent = teacher.status === "Active" 
            ? TRANSLATIONS[currentLanguage].statusActive 
            : TRANSLATIONS[currentLanguage].statusLeave;
        modalStatus.className = "status-indicator " + (teacher.status === "Active" ? "active" : "leave");

        btnModalEdit.onclick = () => {
            closeModal(profileModal);
            startEditTeacher(teacher.id);
        };

        openModal(profileModal);
    }

    function openModal(modalEl) {
        modalEl.classList.remove("hidden");
    }

    function closeModal(modalEl) {
        modalEl.classList.add("hidden");
    }

    btnCloseProfileModal.addEventListener("click", () => closeModal(profileModal));
    btnModalClose.addEventListener("click", () => closeModal(profileModal));
    profileModal.addEventListener("click", (e) => {
        if (e.target === profileModal) closeModal(profileModal);
    });

    // ---------------------------------------------------------
    // 16. DELETE RECORD MODAL
    // ---------------------------------------------------------
    function openDeleteModal(id) {
        const teacher = teachers.find(t => t && t.id === id);
        if (!teacher) return;

        deleteTargetId = id;
        deleteTeacherName.textContent = currentLanguage === "km" ? teacher.nameKh : teacher.nameEn;
        openModal(deleteModal);
    }

    btnDeleteCancel.addEventListener("click", () => {
        closeModal(deleteModal);
        deleteTargetId = null;
    });

    btnDeleteConfirm.addEventListener("click", () => {
        if (!deleteTargetId) return;

        teachers = teachers.filter(t => t && t.id !== deleteTargetId);
        saveData();
        closeModal(deleteModal);
        showToast("toastDeleteSuccess", "success");
        
        deleteTargetId = null;
        renderTeachersDirectory();
    });

    deleteModal.addEventListener("click", (e) => {
        if (e.target === deleteModal) {
            closeModal(deleteModal);
            deleteTargetId = null;
        }
    });

    // ---------------------------------------------------------
    // 17. BACKUP / EXPORT / IMPORT / RESET
    // ---------------------------------------------------------
    btnExport.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teachers, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        const timestamp = new Date().toISOString().slice(0, 10);
        downloadAnchor.setAttribute("download", `samdech_ouv_teachers_backup_${timestamp}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    btnTriggerImport.addEventListener("click", () => {
        importFileInput.click();
    });

    importFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsedData = JSON.parse(event.target.result);
                if (Array.isArray(parsedData) && (parsedData.length === 0 || (parsedData[0].id && parsedData[0].nameKh))) {
                    teachers = parsedData;
                    saveData();
                    showToast("toastImportSuccess", "success");
                    importFileInput.value = "";
                } else {
                    showToast("toastImportError", "danger");
                    importFileInput.value = "";
                }
            } catch (err) {
                console.error("Failed to parse JSON file", err);
                showToast("toastImportError", "danger");
                importFileInput.value = "";
            }
        };
        reader.readAsText(file);
    });

    btnResetDb.addEventListener("click", () => {
        const confirmMsg = currentLanguage === "km" 
            ? "តើអ្នកចង់កំណត់ប្រព័ន្ធឡើងវិញ និងដាក់បញ្ចូលទិន្នន័យគំរូដើមមែនទេ?" 
            : "Are you sure you want to reset the database and reload default school records?";
            
        if (confirm(confirmMsg)) {
            teachers = [...INITIAL_TEACHERS];
            attendanceLogs = [];
            saveData();
            saveAttendanceLogs();
            showToast("toastResetSuccess", "success");
            navigateToPage("#dashboard");
        }
    });

    // ---------------------------------------------------------
    // 18. LAYOUT CONTROLS & EVENT LISTENERS
    // ---------------------------------------------------------
    sidebarToggleBtn.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle("active");
        } else {
            sidebar.classList.toggle("collapsed");
        }
    });

    langBtnKm.addEventListener("click", () => setLanguage("km"));
    langBtnEn.addEventListener("click", () => setLanguage("en"));
    themeToggleBtn.addEventListener("click", toggleTheme);

    // Sidebar navigation anchors
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const href = item.getAttribute("href");
            
            // Monitors shouldn't navigate to admin pages
            if (currentRole === "monitor" && href !== "#attendance" && href !== "#dashboard") {
                return;
            }
            
            window.location.hash = href;
            navigateToPage(href);
        });
    });

    window.addEventListener("hashchange", () => {
        navigateToPage(window.location.hash);
    });

    // ---------------------------------------------------------
    // 19. AUTHENTICATION & LOGIN SYSTEM
    // ---------------------------------------------------------
    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem("so_authenticated") === "true";
        if (isAuthenticated) {
            loginOverlay.classList.add("hidden");
        } else {
            loginOverlay.classList.remove("hidden");
            setTimeout(() => { loginPassword.focus(); }, 100);
        }
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd = loginPassword.value.trim();
        
        if (pwd === "88889999") {
            sessionStorage.setItem("so_authenticated", "true");
            loginOverlay.classList.add("hidden");
            loginErrorMsg.style.display = "none";
            loginPassword.value = "";
            showToast("toastSaveSuccess", "success");
        } else {
            loginErrorMsg.style.display = "block";
            loginPassword.value = "";
            loginPassword.focus();
            
            // Trigger shake animation by removing and re-adding class
            loginErrorMsg.style.animation = 'none';
            loginErrorMsg.offsetHeight; /* trigger reflow */
            loginErrorMsg.style.animation = null;
        }
    });

    btnLoginTogglePassword.addEventListener("click", () => {
        const isPassword = loginPassword.type === "password";
        loginPassword.type = isPassword ? "text" : "password";
        
        // Toggle icon style or content
        const svg = btnLoginTogglePassword.querySelector("svg");
        if (svg) {
            if (isPassword) {
                // Show closed eye icon
                svg.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                `;
            } else {
                // Show open eye icon
                svg.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                `;
            }
        }
    });

    btnLogout.addEventListener("click", () => {
        sessionStorage.removeItem("so_authenticated");
        window.location.reload();
    });

    // ---------------------------------------------------------
    // 20. INITIALIZATION RUN
    // ---------------------------------------------------------
    loadData();
    initThemeAndLang();
    checkAuth();
    
    // Read starting hash or default
    const startingHash = window.location.hash || "#dashboard";
    navigateToPage(startingHash);
});
