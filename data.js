```javascript
/* =========================================================
   VIJAY JEE JOURNEY
   UNIVERSAL DATA ENGINE
   data.js

   Add this file to EVERY HTML page:

   <script src="data.js"></script>

   All pages use the same localStorage database.
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DATABASE KEY
    ===================================================== */

    const DB_KEY = "VIJAY_JEE_JOURNEY_DATABASE";


    /* =====================================================
       DEFAULT DATABASE
    ===================================================== */

    const DEFAULT_DATA = {

        profile: {
            name: "Vijay",
            exam: "JEE Main + Advanced",
            attempt: "JEE 2027",
            targetAIR: 99
        },


        preparation: {

            physics: {
                total: 0,
                completed: 0
            },

            chemistry: {
                total: 0,
                completed: 0
            },

            maths: {
                total: 0,
                completed: 0
            }

        },


        daily: {

            targetHours: 10,
            completedHours: 0,

            targetPYQs: 50,
            completedPYQs: 0,

            targetTasks: 0,
            completedTasks: 0

        },


        pyq: {

            main: {

                solved: 0,
                correct: 0,
                incorrect: 0,
                skipped: 0,

                accuracy: 0

            },

            advanced: {

                solved: 0,
                correct: 0,
                incorrect: 0,
                skipped: 0,

                accuracy: 0

            },

            totalSolved: 0,
            totalCorrect: 0,
            totalIncorrect: 0,
            totalSkipped: 0,
            overallAccuracy: 0

        },


        mocks: {

            total: 0,
            attempted: 0,

            bestScore: 0,
            averageScore: 0,

            bestPercentile: 0,

            main: {

                attempted: 0,
                bestScore: 0,
                averageScore: 0

            },

            advanced: {

                attempted: 0,
                bestScore: 0,
                averageScore: 0

            },

            history: []

        },


        mistakes: {

            total: 0,

            physics: 0,
            chemistry: 0,
            maths: 0,

            solved: 0,
            pending: 0,

            history: []

        },


        revision: {

            totalTopics: 0,
            completedTopics: 0,

            cycle1: 0,
            cycle2: 0,
            cycle3: 0,

            pending: 0

        },


        study: {

            totalHours: 0,
            todayHours: 0,
            weeklyHours: 0,
            monthlyHours: 0,

            currentStreak: 0,
            longestStreak: 0,

            studyDays: 0,

            history: []

        },


        journal: {

            entries: 0,

            history: []

        },


        achievements: {

            unlocked: [],

            points: 0

        },


        rank: {

            targetAIR: 99,

            estimatedAIR: null,

            lastMockAIR: null,

            trend: "STARTING"

        },


        settings: {

            theme: "dark",

            strictMode: true,

            notifications: true,

            autoSave: true

        },


        activity: []

    };


    /* =====================================================
       DEEP COPY
    ===================================================== */

    function clone(object) {

        return JSON.parse(
            JSON.stringify(object)
        );

    }


    /* =====================================================
       DEEP MERGE
    ===================================================== */

    function merge(defaultObject, savedObject) {

        const result = clone(defaultObject);


        function recursive(target, source) {

            if (!source) {
                return target;
            }


            Object.keys(source).forEach(function (key) {

                if (

                    source[key] !== null &&

                    typeof source[key] === "object" &&

                    !Array.isArray(source[key]) &&

                    typeof target[key] === "object"

                ) {

                    recursive(
                        target[key],
                        source[key]
                    );

                }

                else {

                    target[key] = source[key];

                }

            });


            return target;

        }


        return recursive(
            result,
            savedObject
        );

    }


    /* =====================================================
       LOAD DATABASE
    ===================================================== */

    function load() {

        try {

            const saved =
                localStorage.getItem(DB_KEY);


            if (!saved) {

                const fresh =
                    clone(DEFAULT_DATA);

                save(fresh);

                return fresh;

            }


            const parsed =
                JSON.parse(saved);


            return merge(
                DEFAULT_DATA,
                parsed
            );

        }

        catch (error) {

            console.error(
                "JEE DATABASE LOAD ERROR:",
                error
            );


            return clone(
                DEFAULT_DATA
            );

        }

    }


    /* =====================================================
       SAVE DATABASE
    ===================================================== */

    function save(data) {

        try {

            localStorage.setItem(

                DB_KEY,

                JSON.stringify(data)

            );

        }

        catch (error) {

            console.error(
                "JEE DATABASE SAVE ERROR:",
                error
            );

        }

    }


    /* =====================================================
       GET COMPLETE DATA
    ===================================================== */

    function getData() {

        return load();

    }


    /* =====================================================
       GET VALUE USING PATH
    ===================================================== */

    function get(path) {

        const data =
            load();


        return path
            .split(".")
            .reduce(

                function (object, key) {

                    if (
                        object === null ||
                        object === undefined
                    ) {

                        return undefined;

                    }

                    return object[key];

                },

                data

            );

    }


    /* =====================================================
       SET VALUE USING PATH
    ===================================================== */

    function set(path, value) {

        const data =
            load();


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
                !current[keys[i]] ||
                typeof current[keys[i]] !== "object"
            ) {

                current[keys[i]] = {};

            }


            current =
                current[keys[i]];

        }


        current[
            keys[keys.length - 1]
        ] = value;


        calculate();


        save(data);


        return data;

    }


    /* =====================================================
       INCREASE VALUE
    ===================================================== */

    function increase(
        path,
        amount = 1
    ) {

        const current =
            Number(
                get(path) || 0
            );


        return set(
            path,
            current + Number(amount)
        );

    }


    /* =====================================================
       CALCULATE ALL DERIVED STATISTICS
    ===================================================== */

    function calculate() {

        const data =
            load();


        /* -----------------------------------------------
           PYQ — MAIN
        ------------------------------------------------ */

        if (
            data.pyq.main.solved > 0
        ) {

            data.pyq.main.accuracy =
                Math.round(

                    (
                        data.pyq.main.correct /
                        data.pyq.main.solved
                    ) * 100

                );

        }

        else {

            data.pyq.main.accuracy = 0;

        }


        /* -----------------------------------------------
           PYQ — ADVANCED
        ------------------------------------------------ */

        if (
            data.pyq.advanced.solved > 0
        ) {

            data.pyq.advanced.accuracy =
                Math.round(

                    (
                        data.pyq.advanced.correct /
                        data.pyq.advanced.solved
                    ) * 100

                );

        }

        else {

            data.pyq.advanced.accuracy = 0;

        }


        /* -----------------------------------------------
           PYQ — TOTAL
        ------------------------------------------------ */

        data.pyq.totalSolved =

            data.pyq.main.solved +

            data.pyq.advanced.solved;


        data.pyq.totalCorrect =

            data.pyq.main.correct +

            data.pyq.advanced.correct;


        data.pyq.totalIncorrect =

            data.pyq.main.incorrect +

            data.pyq.advanced.incorrect;


        data.pyq.totalSkipped =

            data.pyq.main.skipped +

            data.pyq.advanced.skipped;


        if (
            data.pyq.totalSolved > 0
        ) {

            data.pyq.overallAccuracy =
                Math.round(

                    (
                        data.pyq.totalCorrect /
                        data.pyq.totalSolved
                    ) * 100

                );

        }

        else {

            data.pyq.overallAccuracy = 0;

        }


        /* -----------------------------------------------
           REVISION
        ------------------------------------------------ */

        data.revision.pending =

            Math.max(

                0,

                data.revision.totalTopics -
                data.revision.completedTopics

            );


        /* -----------------------------------------------
           MISTAKES
        ------------------------------------------------ */

        data.mistakes.pending =

            Math.max(

                0,

                data.mistakes.total -
                data.mistakes.solved

            );


        /* -----------------------------------------------
           DAILY TASK %
        ------------------------------------------------ */

        data.daily.taskCompletion =

            data.daily.targetTasks > 0

            ?

            Math.round(

                (
                    data.daily.completedTasks /
                    data.daily.targetTasks
                ) * 100

            )

            :

            0;


        /* -----------------------------------------------
           DAILY STUDY %
        ------------------------------------------------ */

        data.daily.studyCompletion =

            data.daily.targetHours > 0

            ?

            Math.min(

                100,

                Math.round(

                    (
                        data.daily.completedHours /
                        data.daily.targetHours
                    ) * 100

                )

            )

            :

            0;


        /* -----------------------------------------------
           SYLLABUS
        ------------------------------------------------ */

        let totalSyllabus = 0;

        let completedSyllabus = 0;


        [
            "physics",
            "chemistry",
            "maths"

        ].forEach(function (subject) {

            const item =
                data.preparation[subject];


            item.percentage =

                item.total > 0

                ?

                Math.round(

                    (
                        item.completed /
                        item.total
                    ) * 100

                )

                :

                0;


            totalSyllabus +=
                Number(item.total);


            completedSyllabus +=
                Number(item.completed);

        });


        data.preparation.total =

            totalSyllabus;


        data.preparation.completed =

            completedSyllabus;


        data.preparation.percentage =

            totalSyllabus > 0

            ?

            Math.round(

                (
                    completedSyllabus /
                    totalSyllabus
                ) * 100

            )

            :

            0;


        /* -----------------------------------------------
           MOCK AVERAGE
        ------------------------------------------------ */

        if (
            data.mocks.history.length > 0
        ) {

            let totalScore = 0;


            data.mocks.history.forEach(
                function (test) {

                    totalScore +=
                        Number(
                            test.score || 0
                        );

                }
            );


            data.mocks.averageScore =
                Math.round(

                    totalScore /
                    data.mocks.history.length

                );

        }

        else {

            data.mocks.averageScore = 0;

        }


        /* -----------------------------------------------
           SAVE
        ------------------------------------------------ */

        save(data);


        return data;

    }


    /* =====================================================
       ADD PYQ RESULT
    ===================================================== */

    function addPYQ(

        exam = "main",

        correct = 0,

        incorrect = 0,

        skipped = 0

    ) {

        exam =
            exam.toLowerCase();


        if (
            exam !== "main" &&
            exam !== "advanced"
        ) {

            console.error(
                "Exam must be main or advanced."
            );

            return;

        }


        const data =
            load();


        const section =
            data.pyq[exam];


        correct =
            Number(correct);


        incorrect =
            Number(incorrect);


        skipped =
            Number(skipped);


        section.correct +=
            correct;


        section.incorrect +=
            incorrect;


        section.skipped +=
            skipped;


        section.solved +=

            correct +
            incorrect +
            skipped;


        addActivityToData(

            data,

            "PYQ",

            `${exam.toUpperCase()} PYQ updated`

        );


        calculate();


        checkAchievements();


        return load();

    }


    /* =====================================================
       ADD MOCK
    ===================================================== */

    function addMock({

        exam = "main",

        score = 0,

        percentile = 0,

        accuracy = 0,

        rank = null

    } = {}) {


        exam =
            exam.toLowerCase();


        const data =
            load();


        score =
            Number(score);


        percentile =
            Number(percentile);


        accuracy =
            Number(accuracy);


        const test = {

            id:
                Date.now(),

            exam,

            score,

            percentile,

            accuracy,

            rank,

            date:
                new Date().toISOString()

        };


        data.mocks.history.unshift(
            test
        );


        data.mocks.attempted++;


        data.mocks.total++;


        data.mocks.bestScore =
            Math.max(

                data.mocks.bestScore,

                score

            );


        data.mocks.bestPercentile =
            Math.max(

                data.mocks.bestPercentile,

                percentile

            );


        if (
            data.mocks[exam]
        ) {

            data.mocks[exam].attempted++;


            data.mocks[exam].bestScore =
                Math.max(

                    data.mocks[exam].bestScore,

                    score

                );

        }


        if (
            rank !== null &&
            rank > 0
        ) {

            data.rank.lastMockAIR =
                Number(rank);

        }


        addActivityToData(

            data,

            "MOCK",

            `${exam.toUpperCase()} mock completed`

        );


        calculate();


        checkAchievements();


        return load();

    }


    /* =====================================================
       ADD STUDY HOURS
    ===================================================== */

    function addStudyHours(
        hours
    ) {

        hours =
            Number(hours);


        if (
            !Number.isFinite(hours) ||
            hours <= 0
        ) {

            return;

        }


        const data =
            load();


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


        data.study.history.unshift({

            hours,

            date:
                new Date().toISOString()

        });


        addActivityToData(

            data,

            "STUDY",

            `Studied ${hours} hour(s)`

        );


        calculate();


        checkAchievements();


        return load();

    }


    /* =====================================================
       ADD MISTAKE
    ===================================================== */

    function addMistake(

        subject = "general",

        topic = "",

        type = "Conceptual",

        solved = false

    ) {


        const data =
            load();


        subject =
            subject.toLowerCase();


        data.mistakes.total++;


        if (
            data.mistakes[subject] !== undefined
        ) {

            data.mistakes[subject]++;

        }


        if (solved) {

            data.mistakes.solved++;

        }


        data.mistakes.history.unshift({

            id:
                Date.now(),

            subject,

            topic,

            type,

            solved,

            date:
                new Date().toISOString()

        });


        addActivityToData(

            data,

            "MISTAKE",

            `Mistake added: ${subject}`

        );


        calculate();


        return load();

    }


    /* =====================================================
       ADD REVISION
    ===================================================== */

    function addRevision(

        total = 0,

        completed = 0,

        cycle = 1

    ) {

        const data =
            load();


        data.revision.totalTopics +=
            Number(total);


        data.revision.completedTopics +=
            Number(completed);


        if (
            cycle === 1
        ) {

            data.revision.cycle1++;

        }

        else if (
            cycle === 2
        ) {

            data.revision.cycle2++;

        }

        else if (
            cycle === 3
        ) {

            data.revision.cycle3++;

        }


        calculate();


        addActivityToData(

            data,

            "REVISION",

            `Revision cycle ${cycle} updated`

        );


        return load();

    }


    /* =====================================================
       JOURNAL ENTRY
    ===================================================== */

    function addJournal(

        text = "",

        mood = "",

        discipline = 0

    ) {


        const data =
            load();


        data.journal.entries++;


        data.journal.history.unshift({

            id:
                Date.now(),

            text,

            mood,

            discipline,

            date:
                new Date().toISOString()

        });


        addActivityToData(

            data,

            "JOURNAL",

            "Journal entry added"

        );


        return load();

    }


    /* =====================================================
       UPDATE SYLLABUS
    ===================================================== */

    function updateSyllabus(

        subject,

        total,

        completed

    ) {


        subject =
            subject.toLowerCase();


        if (
            !dataSubjectExists(subject)
        ) {

            console.error(
                "Invalid subject."
            );

            return;

        }


        const data =
            load();


        data.preparation[subject].total =
            Number(total);


        data.preparation[subject].completed =
            Number(completed);


        calculate();


        addActivityToData(

            data,

            "SYLLABUS",

            `${subject.toUpperCase()} syllabus updated`

        );


        return load();

    }


    function dataSubjectExists(subject) {

        return [

            "physics",
            "chemistry",
            "maths"

        ].includes(subject);

    }


    /* =====================================================
       DAILY TASK
    ===================================================== */

    function completeDailyTask() {

        const data =
            load();


        data.daily.completedTasks++;


        addActivityToData(

            data,

            "DAILY",

            "Daily task completed"

        );


        calculate();


        checkAchievements();


        return load();

    }


    /* =====================================================
       SET STREAK
    ===================================================== */

    function setStreak(
        streak
    ) {

        const data =
            load();


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


        calculate();


        checkAchievements();


        return load();

    }


    /* =====================================================
       ACTIVITY
    ===================================================== */

    function addActivityToData(

        data,

        type,

        message

    ) {


        data.activity.unshift({

            id:
                Date.now(),

            type,

            message,

            time:
                new Date().toISOString()

        });


        data.activity =
            data.activity.slice(
                0,
                100
            );


        save(data);

    }


    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    const ACHIEVEMENTS = [

        {
            id: "PYQ_100",
            name: "First 100 PYQs",
            requirement: data =>
                data.pyq.totalSolved >= 100,
            points: 10
        },

        {
            id: "PYQ_500",
            name: "PYQ Warrior",
            requirement: data =>
                data.pyq.totalSolved >= 500,
            points: 25
        },

        {
            id: "PYQ_1000",
            name: "PYQ Machine",
            requirement: data =>
                data.pyq.totalSolved >= 1000,
            points: 50
        },

        {
            id: "PYQ_5000",
            name: "PYQ Beast",
            requirement: data =>
                data.pyq.totalSolved >= 5000,
            points: 100
        },

        {
            id: "STUDY_100",
            name: "100 Hour Grind",
            requirement: data =>
                data.study.totalHours >= 100,
            points: 25
        },

        {
            id: "STUDY_500",
            name: "500 Hour Grind",
            requirement: data =>
                data.study.totalHours >= 500,
            points: 50
        },

        {
            id: "STUDY_1000",
            name: "1000 Hour Grind",
            requirement: data =>
                data.study.totalHours >= 1000,
            points: 100
        },

        {
            id: "MOCK_10",
            name: "10 Mock Tests",
            requirement: data =>
                data.mocks.attempted >= 10,
            points: 25
        },

        {
            id: "MOCK_50",
            name: "50 Mock Tests",
            requirement: data =>
                data.mocks.attempted >= 50,
            points: 75
        },

        {
            id: "STREAK_7",
            name: "7 Day Streak",
            requirement: data =>
                data.study.currentStreak >= 7,
            points: 10
        },

        {
            id: "STREAK_30",
            name: "30 Day Streak",
            requirement: data =>
                data.study.currentStreak >= 30,
            points: 30
        },

        {
            id: "STREAK_100",
            name: "100 Day Streak",
            requirement: data =>
                data.study.currentStreak >= 100,
            points: 100
        }

    ];


    function checkAchievements() {

        const data =
            load();


        ACHIEVEMENTS.forEach(
            function (achievement) {

                if (

                    achievement.requirement(
                        data
                    )

                    &&

                    !data.achievements.unlocked
                        .includes(
                            achievement.id
                        )

                ) {

                    data.achievements.unlocked.push(
                        achievement.id
                    );


                    data.achievements.points +=
                        achievement.points;


                    addActivityToData(

                        data,

                        "ACHIEVEMENT",

                        `Unlocked: ${achievement.name}`

                    );

                }

            }
        );


        save(data);


        return data;

    }


    /* =====================================================
       EXPORT
    ===================================================== */

    function exportData() {

        const data =
            load();


        const backup = {

            application:
                "Vijay JEE Journey",

            version:
                "1.0",

            exportedAt:
                new Date().toISOString(),

            data

        };


        const blob =
            new Blob(

                [
                    JSON.stringify(
                        backup,
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
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "vijay-jee-backup.json";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }


    /* =====================================================
       IMPORT
    ===================================================== */

    function importData(file) {

        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                try {

                    const backup =
                        JSON.parse(
                            event.target.result
                        );


                    const imported =
                        backup.data ||
                        backup;


                    const merged =
                        merge(
                            DEFAULT_DATA,
                            imported
                        );


                    save(merged);


                    alert(
                        "JEE backup restored successfully."
                    );


                    location.reload();

                }

                catch (error) {

                    alert(
                        "Invalid JEE backup file."
                    );

                }

            };


        reader.readAsText(file);

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetData() {

        const confirmation =
            confirm(

                "This will permanently delete your complete JEE Journey data. Continue?"

            );


        if (!confirmation) {

            return false;

        }


        localStorage.removeItem(
            DB_KEY
        );


        location.reload();


        return true;

    }


    /* =====================================================
       GET ACHIEVEMENT LIST
    ===================================================== */

    function getAchievements() {

        return ACHIEVEMENTS;

    }


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.JEE = {

        /* Database */

        getData:
            getData,

        load:
            load,

        save:
            save,

        get:
            get,

        set:
            set,

        increase:
            increase,

        calculate:
            calculate,


        /* Preparation */

        updateSyllabus:
            updateSyllabus,


        /* Daily */

        addStudyHours:
            addStudyHours,

        completeDailyTask:
            completeDailyTask,

        setStreak:
            setStreak,


        /* PYQ */

        addPYQ:
            addPYQ,


        /* Mock */

        addMock:
            addMock,


        /* Mistakes */

        addMistake:
            addMistake,


        /* Revision */

        addRevision:
            addRevision,


        /* Journal */

        addJournal:
            addJournal,


        /* Achievements */

        achievements:
            getAchievements,

        checkAchievements:
            checkAchievements,


        /* Backup */

        export:
            exportData,

        import:
            importData,


        /* Reset */

        reset:
            resetData

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    calculate();

    checkAchievements();


    console.log(
        "🧠 Vijay JEE Data Engine Loaded"
    );

    console.log(
        "Use JEE.getData() to inspect your database."
    );


})();
```
