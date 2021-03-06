const dbConnection = require('../database').createDbConnection();
const IntrusionServiceError = require('../error/intrusionServiceError');
const PROPERTY_UPDATE_ERROR = 'INTRUSION_SERVICE_PROPERTY_UPDATE_ERROR';

const PROPERTIES_VIEW_TABLE = 'IntrusionServicePropertiesView';

exports.updateProperty = (property)=> {

  const queryCriteria = {
    tenantId: {
      S: property.tenantId
    },
    propertyId: {
      S: property.propertyId
    }
  };
  const updateCriteria = {
    ":alarmEnabledVal": {"BOOL": property.alarmEnabled || false},
    ":intrusionInProgressVal": {"BOOL": property.intrusionInProgress || false}
  };
  const updateExpression = 'set alarmEnabled = :alarmEnabledVal, intrusionInProgress = :intrusionInProgressVal';

  const params = {
    Key: queryCriteria,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: updateCriteria,
    TableName: PROPERTIES_VIEW_TABLE
  };

  return new Promise((resolve, reject) => {
    dbConnection.updateItem(params, (err, data) => {
      if (err) {
        reject(new IntrusionServiceError(`Error updating property ${property.propertyId} alarm status for tenant ${property.tenantId}: ${err.message}`, PROPERTY_UPDATE_ERROR));
      }
      resolve(data);
    });
  });
};