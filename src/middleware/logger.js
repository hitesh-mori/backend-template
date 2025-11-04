const morgan = require('morgan');
const colors = require('colors');

colors.setTheme({
  success: 'green',
  redirect: 'yellow',
  clientError: 'red',
  serverError: 'brightRed',
  info: 'cyan',
  debug: 'blue',
});

const getStatusColor = (status) => {
  if (status >= 500) return 'serverError';
  if (status >= 400) return 'clientError';
  if (status >= 300) return 'redirect';
  if (status >= 200) return 'success';
  return 'info';
};

morgan.token('colored-status', (req, res) => {
  return colors[getStatusColor(res.statusCode)](res.statusCode);
});

morgan.token('timestamp', () => new Date().toLocaleTimeString());
morgan.token('user-type', (req) => (req.user ? req.user.userType : 'guest'));

const logFormat = [
  colors.gray('['),
  colors.cyan(':timestamp'),
  colors.gray(']'),
  colors.blue(':method'),
  colors.white(':url'),
  ':colored-status',
  colors.yellow(':response-time ms'),
  colors.gray('-'),
  colors.magenta(':user-type'),
].join(' ');

const requestLogger = morgan(logFormat, {
  skip: (req) => req.url === '/health' || req.url === '/ping',
});

const errorLogger = (err, req, res, next) => {
  console.error('\n' + colors.red('='.repeat(80)));
  console.error(colors.brightRed('❌ ERROR'));
  console.error(colors.red('='.repeat(80)));
  console.error(colors.white('Time:   ') + colors.gray(new Date().toISOString()));
  console.error(colors.white('Method: ') + colors.blue(req.method));
  console.error(colors.white('URL:    ') + colors.white(req.url));
  console.error(colors.white('Error:  ') + colors.red(err.message));
  console.error(colors.white('Stack:  ') + colors.gray(err.stack));
  console.error(colors.red('='.repeat(80)) + '\n');
  next(err);
};

module.exports = { requestLogger, errorLogger };
