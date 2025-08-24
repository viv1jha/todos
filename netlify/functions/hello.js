exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Habit Tracker API!",
      timestamp: new Date().toISOString(),
    }),
  };
};