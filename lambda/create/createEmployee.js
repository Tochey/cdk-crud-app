const { DynamoDB } = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

exports.handler = async function (event) {

    const req = JSON.parse(event.body)


    if (!req.age || !req.fullName || !req.position) return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: 'please check your request and try again'
    }
    const userId = uuidv4()
    const db = new DynamoDB()
    const params = {
        Item: {
            'id': {
                S: userId
            },
            'fullName': {
                S: req.fullName
            },
            'age': {
                S: req.age
            },
            'position': {
                S: req.position
            }
        },
        TableName: process.env.EMPLOYEE_TABLE_NAME
    }

    await db.putItem(params, function (err, data) {
        if (err) console.log(err)
        console.log(data)
    }).promise()

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `${JSON.stringify(req.fullName)} has been successfully created with an Id of ${userId} `
    };
}