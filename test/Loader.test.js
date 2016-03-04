describe('Loader', function() {

  beforeEach(function() {
    // TODO: mock logger
    // TODO: mock config file (uses logger)
  });

  describe('#initConfig()', function() {
    it('logs data at log level \'gear\'');
    it('calls \'next\' function w/ error when given invalid config');
    it('calls \'next\' function w/ null value upon successful completion');
  });

  describe('#initGear()', function() {
    it('logs data at log level \'gear\'');
    it('creates a DataStore');
    it('creates a client');
    it('calls \'next\' function with null value upon successful completion');
  });

  describe('#initCogs()', function() {
    it('logs data at log level \'gear\'');
    it('calls \'next\' function with null value upon successful completion');
  });

  describe('#initListeners()', function() {
    it('logs data at log level \'gear\'');
    it('calls \'next\' function with null value upon successful completion');
  });
});