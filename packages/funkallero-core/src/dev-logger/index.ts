const devLogger = (msg: string, ...context: any[]) => {
    if (process.env.FUNKALLERO_DEBUG_MODE === 'on') {
        console.log('DEV LOGGER:', msg, ...context);
    }
};

export default devLogger;
