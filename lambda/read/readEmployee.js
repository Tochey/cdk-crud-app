const { DynamoDB } = require('aws-sdk');

exports.handler = async function (event) {
    const dynamo = new DynamoDB()
    if (event.pathParameters) {
        const params = {
            Key: {
                'id': {
                    S: `${event.pathParameters?.userId}`
                }
            },
            TableName: process.env.EMPLOYEE_TABLE_NAME
        }
        const employee = await dynamo.getItem(params).promise()
        return {
            statusCode: 200,
            body: `${JSON.stringify(employee)}`
        };
    }

    const params = {
        TableName: process.env.EMPLOYEE_TABLE_NAME
    }

    const employees = await dynamo.scan(params).promise()


    return {
        statusCode: 200,
        body: `${JSON.stringify(employees.Items)}`
    };
}