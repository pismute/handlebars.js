/*global CompilerContext, Handlebars, shouldThrow */
var Exception = Handlebars.Exception;

describe('strict', function() {
  describe('strict mode', function() {
    it('should error on missing property lookup', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello}}', {strict: true});

        template({});
      }, Exception, /"hello" not defined in/);
    });
    it('should error on missing child', function() {
      var template = CompilerContext.compile('{{hello.bar}}', {strict: true});
      equals(template({hello: {bar: 'foo'}}), 'foo');

      shouldThrow(function() {
        template({hello: {}});
      }, Exception, /"bar" not defined in/);
    });
    it('should handle explicit undefined', function() {
      var template = CompilerContext.compile('{{hello.bar}}', {strict: true});

      equals(template({hello: {bar: undefined}}), '');
    });
    it('should error on missing property lookup in known helpers mode', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello}}', {strict: true, knownHelpersOnly: true});

        template({});
      }, Exception, /"hello" not defined in/);
    });
    it('should error on missing context', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello}}', {strict: true});

        template();
      }, Error);
    });

    it('should error on missing data lookup', function() {
      var template = CompilerContext.compile('{{@hello}}', {strict: true});
      equals(template(undefined, {data: {hello: 'foo'}}), 'foo');

      shouldThrow(function() {
        template();
      }, Error);
    });

    it('should not run helperMissing for helper calls', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello foo}}', {strict: true});

        template({foo: true});
      }, Exception, /"hello" not defined in/);

      shouldThrow(function() {
        var template = CompilerContext.compile('{{#hello foo}}{{/hello}}', {strict: true});

        template({foo: true});
      }, Exception, /"hello" not defined in/);
    });
    it('should throw on ambiguous blocks', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{#hello}}{{/hello}}', {strict: true});

        template({});
      }, Exception, /"hello" not defined in/);

      shouldThrow(function() {
        var template = CompilerContext.compile('{{^hello}}{{/hello}}', {strict: true});

        template({});
      }, Exception, /"hello" not defined in/);

      shouldThrow(function() {
        var template = CompilerContext.compile('{{#hello.bar}}{{/hello.bar}}', {strict: true});

        template({hello: {}});
      }, Exception, /"bar" not defined in/);
    });
  });

  describe('assume objects', function() {
    it('should ignore missing property', function() {
      var template = CompilerContext.compile('{{hello}}', {assumeObjects: true});

      equal(template({}), '');
    });
    it('should ignore missing child', function() {
      var template = CompilerContext.compile('{{hello.bar}}', {assumeObjects: true});

      equal(template({hello: {}}), '');
    });
    it('should error on missing object', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello.bar}}', {assumeObjects: true});

        template({});
      }, Error);
    });
    it('should error on missing context', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{hello}}', {assumeObjects: true});

        template();
      }, Error);
    });

    it('should error on missing data lookup', function() {
      shouldThrow(function() {
        var template = CompilerContext.compile('{{@hello.bar}}', {assumeObjects: true});

        template();
      }, Error);
    });

    it('should execute blockHelperMissing', function() {
      var template = CompilerContext.compile('{{^hello}}foo{{/hello}}', {assumeObjects: true});

      equals(template({}), 'foo');
    });
  });
});
