const shouldLog = process.env.FUNKALLERO_DEBUG_MODE === 'on';

const devLogger = (msg: string, ...context: any[]) => {
    if (shouldLog) console.log('DEV LOGGER:', msg, ...context);
};

export default devLogger;
