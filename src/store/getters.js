const getters = {
  domain: state => state.app.domain,
  TOKEN: state => state.app.TOKEN,
  errorLogs: state => state.errorLog.logs
};
// gettes should be a function
export default getters;
