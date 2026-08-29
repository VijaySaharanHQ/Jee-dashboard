```javascript
/* =========================================================
   VIJAY JEE JOURNEY — CENTRAL DATA ENGINE
   Version 1.0

   This file is the single source of truth for your
   complete IIT-JEE preparation website.

   All pages can read/write data through JEE_DATA.
========================================================= */

const JEE_DATA_KEY = "VIJAY_JEE_MASTER_DATA";


/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_JEE_DATA = {

    profile: {
        name: "Vijay",
        exam: "IIT-JEE",
        target: "2-Digit AIR",
        attempt: "JEE 2027"
    },


    /* -----------------------------------------------------
       SYLLABUS
    ----------------------------------------------------- */

    syllabus: {

        physics: {
            total: 0,
            completed: 0,
            percentage: 0
        },

        chemistry: {
            total: 0,
            completed: 0,
            percentage: 0
        },

        maths: {
            total: 0,
            completed: 0,
            percentage: 0
        },

        overall: {
            total: 0,
            completed: 0,
            percentage: 0
        }

    },


    /* -----------------------------------------------------
       PYQ
    ----------------------------------------------------- */

    pyq: {

        main: {
            total: 0,
            solved: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        },

        advanced: {
            total: 0,
            solved: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        },

        totalSolved: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        accuracy: 0

    },


    /* -----------------------------------------------------
       MOCK TESTS
    ----------------------------------------------------- */

    mocks: {

        total: 0,

        attempted: 0,

        averageScore: 0,

        bestScore: 0,

        averageAccuracy: 0,

        bestPercentile: 0,

        bestRank: null,

        main: {
            attempted: 0,
            bestScore: 0,
            averageScore: 0
        },

        advanced: {
            attempted: 0,
            bestScore: 0,
            averageScore: 0
        }

    },


    /* -----------------------------------------------------
       STUDY
    ----------------------------------------------------- */

    study: {

        totalHours: 0,

        todayHours: 0,

        weeklyHours: 0,

        monthlyHours: 0,

        currentStreak: 0,

        longestStreak: 0,

        studyDays: 0

    },


    /* -----------------------------------------------------
       REVISION
    ----------------------------------------------------- */

    revision: {

        totalTopics: 0,

        revisedTopics: 0,

        revisionCycles: 0,

        pending: 0

    },


    /* -----------------------------------------------------
       MISTAKES
    ----------------------------------------------------- */

    mistakes: {

        total: 0,

        physics: 0,

        chemistry: 0,

        maths: 0,

        solved: 0,

        pending: 0

    },


    /* -----------------------------------------------------
       JOURNAL
    ----------------------------------------------------- */

    journal: {

        entries: 0,

        lastEntry: null,

        disciplineScore: 0,

        moodScore: 0

    },


    /* -----------------------------------------------------
       DAILY TARGET
    ----------------------------------------------------- */

    daily: {

        targetHours: 10,

        completedHours: 0,

        tasksTotal: 0,

        tasksCompleted: 0,

        completion: 0

    },


    /* -----------------------------------------------------
       ACHIEVEMENTS
    ----------------------------------------------------- */

    achievements: {

        unlocked: [],

        custom: []

    },


    /* -----------------------------------------------------
       RANK STRATEGY
    ----------------------------------------------------- */

    rank: {

        targetAIR: 99,

        currentEstimatedAIR: null,

        lastMockAIR: null,

        trend: "STARTING",

        confidence: 0

    },


    /* -----------------------------------------------------
       ACTIVITY LOG
    ----------------------------------------------------- */

    activity: []

};


/* =========================================================
   LOAD DATA
========================================================= */

function loadJEEData() {

    try {

        const saved =
            localStorage.getItem(
                JEE_DATA_KEY
            );


        if (!saved) {

            const fresh =
                JSON.parse(
                    JSON.stringify(
                        DEFAULT_JEE_DATA
                    )
                );

            saveJEEData(fresh);

            return fresh;

        }


        const parsed =
            JSON.parse(saved);


        return mergeObjects(
            DEFAULT_JEE_DATA,
            parsed
        );

    }

    catch (error) {

        console.error(
            "JEE DATA LOAD ERROR:",
            error
        );

        return JSON.parse(
            JSON.stringify(
                DEFAULT_JEE_DATA
            )
        );

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveJEEData(data) {

    try {

        localStorage.setItem(

            JEE_DATA_KEY,

            JSON.stringify(data)

        );

    }

    catch (error) {

        console.error(
            "JEE DATA SAVE ERROR:",
            error
        );

    }

}


/* =========================================================
   MERGE OBJECTS
========================================================= */

function mergeObjects(defaultObj, savedObj) {

    const result =
        Array.isArray(defaultObj)
        ? [...defaultObj]
        : {...defaultObj};


    Object.keys(savedObj || {})
    .forEach(key => {

        if (

            savedObj[key] !== null &&

            typeof savedObj[key] === "object" &&

            !Array.isArray(savedObj[key]) &&

            typeof result[key] === "object"

        ) {

            result[key] =
                mergeObjects(
                    result[key],
                    savedObj[key]
                );

        }

        else {

            result[key] =
                savedObj[key];

        }

    });


    return result;

}


/* =========================================================
   GET VALUE
========================================================= */

function getJEEValue(path) {

    const data =
        loadJEEData();


    return path
        .split(".")
        .reduce(

            (object, key) => {

                if (
                    object === undefined ||
                    object === null
                ) {

                    return undefined;

                }

                return object[key];

            },

            data

        );

}


/* =========================================================
   SET VALUE
========================================================= */

function setJEEValue(path, value) {

    const data =
        loadJEEData();


    const keys =
        path.split(".");


    let current =
        data;


    for (
        let i = 0;
        i < keys.length - 1;
        i++
    ) {

        if (
            typeof current[keys[i]]
            !== "object"
        ) {

            current[keys[i]] = {};

        }


        current =
            current[keys[i]];

    }


    current[
        keys[keys.length - 1]
    ] = value;


    saveJEEData(data);


    updateDerivedData();


    return data;

}


/* =========================================================
   INCREASE VALUE
========================================================= */

function increaseJEEValue(path, amount = 1) {

    const current =
        Number(
            getJEEValue(path) || 0
        );


    return setJEEValue(

        path,

        current + Number(amount)

    );

}


/* =========================================================
   PYQ UPDATE
========================================================= */

function addPYQResult(

    exam,
    correct = 0,
    incorrect = 0

) {

    exam =
        exam.toLowerCase();


    if (
        exam !== "main" &&
        exam !== "advanced"
    ) {

        console.error(
            "Exam must be 'main' or 'advanced'."
        );

        return;

    }


    const data =
        loadJEEData();


    const section =
        data.pyq[exam];


    const c =
        Number(correct);


    const i =
        Number(incorrect);


    section.solved +=
        c + i;


    section.correct +=
        c;


    section.incorrect +=
        i;


    section.accuracy =
        section.solved > 0
        ? Math.round(
            section.correct /
            section.solved *
            100
        )
        : 0;


    updateDerivedData(data);


    addActivity(

        "PYQ",

        `${exam.toUpperCase()} PYQ: +${c} correct, +${i} incorrect`

    );

}


/* =========================================================
   MOCK TEST UPDATE
========================================================= */

function addMockResult({

    exam = "main",

    score = 0,

    accuracy = 0,

    percentile = 0,

    rank = null

} = {}) {


    exam =
        exam.toLowerCase();


    const data =
        loadJEEData();


    const scoreNumber =
        Number(score);


    const accuracyNumber =
        Number(accuracy);


    data.mocks.attempted++;


    data.mocks.total++;


    data.mocks.bestScore =
        Math.max(
            data.mocks.bestScore,
            scoreNumber
        );


    if (
        data.mocks.attempted === 1
    ) {

        data.mocks.averageScore =
            scoreNumber;

    }

    else {

        data.mocks.averageScore =
            Math.round(

                (

                    data.mocks.averageScore *
                    (
                        data.mocks.attempted - 1
                    )

                    +

                    scoreNumber

                )

                /

                data.mocks.attempted

            );

    }


    data.mocks.bestPercentile =
        Math.max(

            data.mocks.bestPercentile,

            Number(percentile)

        );


    if (
        rank !== null &&
        rank > 0
    ) {

        if (
            data.mocks.bestRank === null
            ||
            rank <
            data.mocks.bestRank
        ) {

            data.mocks.bestRank =
                Number(rank);

        }

    }


    const section =
        data.mocks[exam];


    if (section) {

        section.attempted++;


        section.bestScore =
            Math.max(
                section.bestScore,
                scoreNumber
            );


        if (
            section.attempted === 1
        ) {

            section.averageScore =
                scoreNumber;

        }

        else {

            section.averageScore =
                Math.round(

                    (

                        section.averageScore *
                        (
                            section.attempted - 1
                        )

                        +

                        scoreNumber

                    )

                    /

                    section.attempted

                );

        }

    }


    if (
        exam === "main"
        &&
        Number(rank) > 0
    ) {

        data.rank.lastMockAIR =
            Number(rank);

    }


    updateDerivedData(data);


    addActivity(

        "MOCK",

        `${exam.toUpperCase()} mock completed — Score ${scoreNumber}`

    );


}


/* =========================================================
   STUDY HOURS
========================================================= */

function addStudyHours(hours) {

    hours =
        Number(hours);


    if (
        !Number.isFinite(hours)
        ||
        hours <= 0
    ) {

        return;

    }


    const data =
        loadJEEData();


    data.study.totalHours +=
        hours;


    data.study.todayHours +=
        hours;


    data.study.weeklyHours +=
        hours;


    data.study.monthlyHours +=
        hours;


    data.daily.completedHours +=
        hours;


    updateDerivedData(data);


    addActivity(

        "STUDY",

        `Studied ${hours} hour(s)`

    );

}


/* =========================================================
   DAILY TASK
========================================================= */

function completeDailyTask() {

    const data =
        loadJEEData();


    data.daily.tasksCompleted =
        Math.min(

            data.daily.tasksCompleted + 1,

            data.daily.tasksTotal

        );


    updateDerivedData(data);


    addActivity(

        "DAILY",

        "Daily task completed"

    );

}


/* =========================================================
   SET DAILY TARGET
========================================================= */

function setDailyTarget(hours) {

    const data =
        loadJEEData();


    data.daily.targetHours =
        Number(hours);


    updateDerivedData(data);

}


/* =========================================================
   SYLLABUS UPDATE
========================================================= */

function updateSyllabus(

    subject,

    total,

    completed

) {

    subject =
        subject.toLowerCase();


    if (
        ![
            "physics",
            "chemistry",
            "maths"
        ].includes(subject)
    ) {

        return;

    }


    const data =
        loadJEEData();


    data.syllabus[subject].total =
        Number(total);


    data.syllabus[subject].completed =
        Number(completed);


    updateDerivedData(data);


    addActivity(

        "SYLLABUS",

        `${subject.toUpperCase()} syllabus updated`

    );

}


/* =========================================================
   REVISION UPDATE
========================================================= */

function addRevision(

    totalTopics = 0,

    revisedTopics = 0

) {

    const data =
        loadJEEData();


    data.revision.totalTopics +=
        Number(totalTopics);


    data.revision.revisedTopics +=
        Number(revisedTopics);


    data.revision.revisionCycles++;


    updateDerivedData(data);


    addActivity(

        "REVISION",

        "Revision cycle completed"

    );

}


/* =========================================================
   MISTAKE UPDATE
========================================================= */

function addMistake(

    subject = "general",

    solved = false

) {

    const data =
        loadJEEData();


    data.mistakes.total++;


    subject =
        subject.toLowerCase();


    if (
        ["physics","chemistry","maths"]
        .includes(subject)
    ) {

        data.mistakes[subject]++;

    }


    if (solved) {

        data.mistakes.solved++;

    }


    updateDerivedData(data);


    addActivity(

        "MISTAKE",

        `New ${subject} mistake recorded`

    );

}


/* =========================================================
   JOURNAL
========================================================= */

function addJournalEntry({

    discipline = 0,

    mood = 0

} = {}) {


    const data =
        loadJEEData();


    data.journal.entries++;


    data.journal.lastEntry =
        new Date().toISOString();


    data.journal.disciplineScore =
        Number(discipline);


    data.journal.moodScore =
        Number(mood);


    updateDerivedData(data);


    addActivity(

        "JOURNAL",

        "Daily reflection recorded"

    );

}


/* =========================================================
   STREAK
========================================================= */

function updateStreak(streak) {

    const data =
        loadJEEData();


    streak =
        Number(streak);


    data.study.currentStreak =
        streak;


    data.study.longestStreak =
        Math.max(

            data.study.longestStreak,

            streak

        );


    data.study.studyDays =
        Math.max(

            data.study.studyDays,

            streak

        );


    updateDerivedData(data);

}


/* =========================================================
   DERIVED DATA
========================================================= */

function updateDerivedData(
    data = loadJEEData()
) {


    /* ---------------------------------------------
       SYLLABUS
    --------------------------------------------- */

    let syllabusTotal = 0;

    let syllabusCompleted = 0;


    [

        "physics",
        "chemistry",
        "maths"

    ].forEach(subject => {

        const section =
            data.syllabus[subject];


        section.percentage =
            section.total > 0
            ? Math.round(

                section.completed /
                section.total *
                100

            )
            : 0;


        syllabusTotal +=
            section.total;


        syllabusCompleted +=
            section.completed;

    });


    data.syllabus.overall.total =
        syllabusTotal;


    data.syllabus.overall.completed =
        syllabusCompleted;


    data.syllabus.overall.percentage =
        syllabusTotal > 0
        ? Math.round(

            syllabusCompleted /
            syllabusTotal *
            100

        )
        : 0;


    /* ---------------------------------------------
       PYQ
    --------------------------------------------- */

    data.pyq.totalSolved =

        data.pyq.main.solved
        +
        data.pyq.advanced.solved;


    data.pyq.totalCorrect =

        data.pyq.main.correct
        +
        data.pyq.advanced.correct;


    data.pyq.totalIncorrect =

        data.pyq.main.incorrect
        +
        data.pyq.advanced.incorrect;


    data.pyq.accuracy =

        data.pyq.totalSolved > 0

        ?

        Math.round(

            data.pyq.totalCorrect /
            data.pyq.totalSolved *
            100

        )

        :

        0;


    /* ---------------------------------------------
       DAILY
    --------------------------------------------- */

    data.daily.completion =

        data.daily.targetHours > 0

        ?

        Math.min(

            100,

            Math.round(

                data.daily.completedHours /
                data.daily.targetHours *
                100

            )

        )

        :

        0;


    /* ---------------------------------------------
       REVISION
    --------------------------------------------- */

    data.revision.pending =

        Math.max(

            0,

            data.revision.totalTopics
            -
            data.revision.revisedTopics

        );


    /* ---------------------------------------------
       MISTAKES
    --------------------------------------------- */

    data.mistakes.pending =

        Math.max(

            0,

            data.mistakes.total
            -
            data.mistakes.solved

        );


    /* ---------------------------------------------
       SAVE
    --------------------------------------------- */

    saveJEEData(data);


    return data;

}


/* =========================================================
   ACTIVITY LOG
========================================================= */

function addActivity(
    type,
    message
) {

    const data =
        loadJEEData();


    data.activity.unshift({

        id:
            Date.now(),

        type,

        message,

        time:
            new Date().toISOString()

    });


    /* Keep latest 100 events */

    data.activity =
        data.activity.slice(
            0,
            100
        );


    saveJEEData(data);

}


/* =========================================================
   RESET
========================================================= */

function resetJEEData() {

    const confirmation =
        confirm(

            "This will permanently delete ALL JEE Journey data from this browser. Continue?"

        );


    if (!confirmation) {

        return false;

    }


    localStorage.removeItem(
        JEE_DATA_KEY
    );


    location.reload();


    return true;

}


/* =========================================================
   EXPORT DATA
========================================================= */

function exportJEEData() {

    const data =
        loadJEEData();


    const blob =
        new Blob(

            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "vijay-jee-backup.json";


    document.body.appendChild(link);


    link.click();


    link.remove();


    URL.revokeObjectURL(url);

}


/* =========================================================
   IMPORT DATA
========================================================= */

function importJEEData(file) {

    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const imported =
                    JSON.parse(
                        event.target.result
                    );


                const merged =
                    mergeObjects(

                        DEFAULT_JEE_DATA,

                        imported

                    );


                saveJEEData(merged);


                alert(
                    "JEE data imported successfully."
                );


                location.reload();

            }

            catch(error) {

                alert(
                    "Invalid JEE backup file."
                );

            }

        };


    reader.readAsText(file);

}


/* =========================================================
   ACHIEVEMENT HELPER
========================================================= */

function unlockAchievement(id) {

    const data =
        loadJEEData();


    if (
        !data.achievements.unlocked
        .includes(id)
    ) {

        data.achievements.unlocked.push(
            id
        );


        saveJEEData(data);


        addActivity(

            "ACHIEVEMENT",

            `Achievement unlocked: ${id}`

        );

    }

}


/* =========================================================
   CHECK ACHIEVEMENTS
========================================================= */

function checkAchievements() {

    const data =
        loadJEEData();


    /* PYQ */

    if (
        data.pyq.totalSolved >= 100
    ) {

        unlockAchievement(
            "pyq100"
        );

    }


    if (
        data.pyq.totalSolved >= 500
    ) {

        unlockAchievement(
            "pyq500"
        );

    }


    if (
        data.pyq.totalSolved >= 1000
    ) {

        unlockAchievement(
            "pyq1000"
        );

    }


    if (
        data.pyq.totalSolved >= 5000
    ) {

        unlockAchievement(
            "pyq5000"
        );

    }


    /* STUDY HOURS */

    if (
        data.study.totalHours >= 100
    ) {

        unlockAchievement(
            "hours100"
        );

    }


    if (
        data.study.totalHours >= 500
    ) {

        unlockAchievement(
            "hours500"
        );

    }


    if (
        data.study.totalHours >= 1000
    ) {

        unlockAchievement(
            "hours1000"
        );

    }


    /* MOCKS */

    if (
        data.mocks.attempted >= 1
    ) {

        unlockAchievement(
            "mock1"
        );

    }


    if (
        data.mocks.attempted >= 10
    ) {

        unlockAchievement(
            "mock10"
        );

    }


    if (
        data.mocks.attempted >= 50
    ) {

        unlockAchievement(
            "mock50"
        );

    }


    /* STREAK */

    if (
        data.study.currentStreak >= 7
    ) {

        unlockAchievement(
            "streak7"
        );

    }


    if (
        data.study.currentStreak >= 30
    ) {

        unlockAchievement(
            "streak30"
        );

    }


    if (
        data.study.currentStreak >= 100
    ) {

        unlockAchievement(
            "streak100"
        );

    }


    /* SYLLABUS */

    if (
        data.syllabus.overall.percentage >= 50
    ) {

        unlockAchievement(
            "syllabus50"
        );

    }


    if (
        data.syllabus.overall.percentage >= 100
    ) {

        unlockAchievement(
            "syllabus100"
        );

    }


    return loadJEEData();

}


/* =========================================================
   PUBLIC API
========================================================= */

window.JEE = {

    /* Data */

    getData:
        loadJEEData,

    saveData:
        saveJEEData,


    /* Values */

    get:
        getJEEValue,

    set:
        setJEEValue,

    increase:
        increaseJEEValue,


    /* PYQ */

    addPYQ:
        addPYQResult,


    /* Mock */

    addMock:
        addMockResult,


    /* Study */

    addStudyHours:
        addStudyHours,


    /* Daily */

    completeTask:
        completeDailyTask,

    setDailyTarget:
        setDailyTarget,


    /* Syllabus */

    updateSyllabus:
        updateSyllabus,


    /* Revision */

    addRevision:
        addRevision,


    /* Mistakes */

    addMistake:
        addMistake,


    /* Journal */

    addJournal:
        addJournalEntry,


    /* Streak */

    updateStreak:
        updateStreak,


    /* Achievements */

    unlock:
        unlockAchievement,

    checkAchievements:
        checkAchievements,


    /* Backup */

    export:
        exportJEEData,

    import:
        importJEEData,


    /* Reset */

    reset:
        resetJEEData

};


/* =========================================================
   START ENGINE
========================================================= */

updateDerivedData();

checkAchievements();


console.log(
    "🧠 Vijay JEE Central Data Engine loaded."
);

console.log(
    "Use JEE.getData() to inspect your complete data."
);
```
