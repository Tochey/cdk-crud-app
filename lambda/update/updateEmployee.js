const { DynamoDB } = require('aws-sdk');

exports.handler = async function (event) {
   const dbb = new DynamoDB()
   const userId = event.pathParameters.userId
   const req = JSON.parse(event.body)

   if (req.fullName) {
      const params = {
         ExpressionAttributeNames: {
            "#AT": "fullName"
         },
         ExpressionAttributeValues: {
            ":t": {
               S: req.fullName
            }
         },
         Key: {
            "id": {
               S: userId
            }
         },
         TableName: process.env.EMPLOYEE_TABLE_NAME,
         UpdateExpression: "SET #AT = :t"
      };

      await dbb.updateItem(params).promise()
   }

   if (req.age) {
      const params = {
         ExpressionAttributeNames: {
            "#AT": "age"
         },
         ExpressionAttributeValues: {
            ":t": {
               S: req.age
            }
         },
         Key: {
            "id": {
               S: userId
            }
         },
         TableName: process.env.EMPLOYEE_TABLE_NAME,
         UpdateExpression: "SET #AT = :t"
      };

      await dbb.updateItem(params).promise()
   }

   if (req.position) {
      const params = {
         ExpressionAttributeNames: {
            "#AT": "position"
         },
         ExpressionAttributeValues: {
            ":t": {
               S: req.position
            }
         },
         Key: {
            "id": {
               S: userId
            }
         },
         TableName: process.env.EMPLOYEE_TABLE_NAME,
         UpdateExpression: "SET #AT = :t"
      };

      await dbb.updateItem(params).promise()
   }

   return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: "Employee Successfully Updated"
   }

}