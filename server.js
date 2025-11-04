const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const config = require('./src/config/environment');
const colors = require('colors');

/**
 * Server Startup File
 * Connects to database and starts the Express server
 */

// Configure colors
colors.setTheme({
  success: 'green',
  error: 'red',
  info: 'cyan',
  warning: 'yellow',
});

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start listening
    const server = app.listen(config.PORT, () => {
      console.log('\n' + colors.success('='.repeat(60)));
      console.log(colors.success('🚀 SERVER STARTED SUCCESSFULLY'));
      console.log(colors.success('='.repeat(60)));
      console.log(colors.info('📍 Port:        ') + colors.white(config.PORT));
      console.log(colors.info('🌍 Environment: ') + colors.white(config.NODE_ENV));
      console.log(colors.info('🔗 URL:         ') + colors.white(`http://localhost:${config.PORT}`));
      console.log(colors.info('💚 Health:      ') + colors.white(`http://localhost:${config.PORT}/health`));
      console.log(colors.info('📡 API Base:    ') + colors.white(`http://localhost:${config.PORT}${config.API_PREFIX}`));
      console.log(colors.success('='.repeat(60)));
      console.log(colors.info('📝 Available Routes:'));
      console.log(colors.white(`   POST   ${config.API_PREFIX}/auth/signup`));
      console.log(colors.white(`   POST   ${config.API_PREFIX}/auth/signin`));
      console.log(colors.white(`   POST   ${config.API_PREFIX}/auth/logout`));
      console.log(colors.white(`   POST   ${config.API_PREFIX}/auth/refresh`));
      console.log(colors.white(`   GET    ${config.API_PREFIX}/auth/profile`));
      console.log(colors.success('='.repeat(60)));
      console.log(colors.warning('⏳ Waiting for requests...\n'));
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(colors.error(`❌ Port ${config.PORT} is already in use`));
      } else {
        console.error(colors.error('❌ Server error:'), error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(colors.warning(`\n\n⚠️  ${signal} received. Starting graceful shutdown...`));

      server.close(async () => {
        console.log(colors.info('✅ HTTP server closed'));

        // Close database connection
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        console.log(colors.info('✅ Database connection closed'));

        console.log(colors.success('👋 Graceful shutdown complete'));
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error(colors.error('⚠️  Forceful shutdown after timeout'));
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error(colors.error('❌ Uncaught Exception:'), error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error(colors.error('❌ Unhandled Rejection at:'), promise);
      console.error(colors.error('Reason:'), reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error(colors.error('❌ Failed to start server:'), error);
    process.exit(1);
  }
};

// Start the server
startServer();
