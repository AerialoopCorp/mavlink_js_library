var should = require('should');
var lib = require('../mavlink-lib.js');

describe('Test module exports:', function () {

  it('access mavlink enums', function () {
    lib.mavlink.MAV_CMD_NAV_WAYPOINT.should.eql(16);
  });

  it('access MavlinkLib', function () {
    var a = new lib.MavlinkLib(255, 0);
    should.exist(a);
  });

});

describe('Test message handling:', function () {

  it('create message with enum values', function () {
    var msg = new lib.messages.heartbeat(
        lib.mavlink.MAV_TYPE_GCS, // type
        lib.mavlink.MAV_AUTOPILOT_INVALID, // autopilot
        0, // base mode
        0, // custom mode
        lib.mavlink.MAV_STATE_ACTIVE, // system status
        lib.mavlink.WIRE_PROTOCOL_VERSION
    );

    msg.name.should.eql("HEARTBEAT");
  });

});

describe('Test param functions:', function () {

  it('create positive float', function () {
    var a = new lib.MavlinkLib(255, 0);
    var f = a.createFloatParamValue(123.456789);
    f.should.be.eql([224, 233, 246, 66]);
  });

  it('create negative float', function () {
    var a = new lib.MavlinkLib(255, 0);
    var f = a.createFloatParamValue(-987.654321);
    f.should.be.eql([224, 233, 118, 196]);
  });

  it('create positive int', function () {
    var a = new lib.MavlinkLib(255, 0);
    var f = a.createIntParamValue(123);
    f.should.be.eql([123, 0, 0, 0]);
  });

  it('create negative int', function () {
    var a = new lib.MavlinkLib(255, 0);
    var f = a.createIntParamValue(-987);
    f.should.be.eql([37, 252, 255, 255]);
  });

  it('create negative int -1', function () {
    var a = new lib.MavlinkLib(255, 0);
    var f = a.createIntParamValue(-1);
    f.should.be.eql([255, 255, 255, 255]);
  });

  it('read positive float from msg', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.parseData(Buffer.from("fe19c6010116e0e9f6421704a1014d41565f504f535f4652455100000000096345", 'hex'));
    var r = a.readParamValue(msg[0]);
    r.should.be.eql(123.456787109375);
  });

  it('read negative float from msg', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.parseData(Buffer.from("fe19c0010116e0e976c417049b014d41565f4855445f4652455100000000092dbb", 'hex'));
    var r = a.readParamValue(msg[0]);
    r.should.be.eql(-987.654296875);
  });

  it('read positive int from msg', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.parseData(Buffer.from("fe19cb0101167b0000001704a6014d41565f544553545f5041520000000006ba4a", 'hex'));
    var r = a.readParamValue(msg[0]);
    r.should.be.eql(123);
  });

  it('read negative int from msg', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.parseData(Buffer.from("fe19ce01011625fcffff1704a9014d41565f5649535f4445425547000000060ebd", 'hex'));
    var r = a.readParamValue(msg[0]);
    r.should.be.eql(-987);
  });

  it('create float param_set message', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.createParamSetMessage("MAV_HUD_FREQ", -987.654321, true);

    msg.param_type.should.be.eql(9);
    msg.param_value.should.be.eql([224, 233, 118, 196]);
    msg.param_id.should.be.eql("MAV_HUD_FREQ");
  });

  it('create int param_set message', function () {
    var a = new lib.MavlinkLib(255, 0, null, 1);
    var msg = a.createParamSetMessage("MAV_TEST_PAR", 123, false);

    msg.param_type.should.be.eql(6);
    msg.param_value.should.be.eql([123, 0, 0, 0]);
    msg.param_id.should.be.eql("MAV_TEST_PAR");
  });

});

// test send and check sequence number, sys and comp ID
// test array
// test message with "payload" field
// test message with "id" field
