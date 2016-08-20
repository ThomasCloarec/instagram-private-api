var util = require("util");
var _ = require("underscore");
var Resource = require("./resource");


function Location(session, params) { 
    Resource.apply(this, arguments);
}

util.inherits(Location, Resource);
module.exports = Location;

var Request = require('./request');
var Helpers = require('../../helpers');


Location.prototype.parseParams = function (json) {
    var hash = {};
    hash.title = json.title;
    hash.subtitle = json.subtitle;
    hash.address = json.location.address;
    hash.city = json.location.city;
    hash.state = json.location.state;
    hash.id = json.location.id || json.location.pk;
    hash.lat = parseFloat(json.lat) || 0;
    hash.lng = parseFloat(json.lng) || 0;
    return hash;
};


Location.search = function (session, query) {
    var that = this;
    return session.getAccountId()
        .then(function(id) {
            var rankToken = Helpers.buildRankToken(id);
            return new Request(session)
                .setMethod('GET')
                .setResource('locationsSearch', {
                    query: query,
                    rankToken: rankToken
                })
                .send();
        })
        .then(function(data) {
            return _.map(data.items, function (location) {
                return new Location(session, location);
            });
        });
};