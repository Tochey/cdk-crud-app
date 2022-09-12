const { DynamoDB } = require('aws-sdk')

exports.handler = async (event) => {
    const userId = event.pathParameters.userId
    const dynamo = new DynamoDB()
    let user;
    const params = {
        Key: {
            'id': {
                S: `${userId}`
            }
        },
        TableName: process.env.EMPLOYEE_TABLE_NAME
    }

    console.log(userId)

    await dynamo.getItem(params, (err, data) => {
        if (err) console.log(err)
        user = data
    }).promise()


    await dynamo.deleteItem(params, (err, data) => {
        if (err) console.log(err)
    }).promise()

    return {
        statusCode: 200,
        body: `Employee ${JSON.stringify(userId)} has been successfully deleted`
    }
}   