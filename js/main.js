// main.js
(async function() {
    // Initialize engine
    EngineStart.init();

    // Initialize game (async)
    await GameStart.init();

    // Run validation tests
    setTimeout(() => {
        TestStart.init();
    }, 100); // Small delay to ensure everything settled

    console.log('Initialization complete');
})();