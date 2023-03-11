const Snowflake = require('snowflake-id').default;

class IdGenerator {
  constructor(workerId, datacenterId) {
    this.snowflake = new Snowflake({ workerId, datacenterId });
  }

  generate() {
    const id = this.snowflake.generate().toString().substr(-9);
    return parseInt(id, 10);
  }
}

module.exports = IdGenerator;
