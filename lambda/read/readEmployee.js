const { DynamoDB } = require('aws-sdk');

exports.handler = async function (event) {
    const dynamo = new DynamoDB()
    const params = {
        TableName : process.env.EMPLOYEE_TABLE_NAME
    }

    const data = await dynamo.scan(params, (err, data) => {
        if(err) console.log(err)
        console.log(data)   
    }).promise()


    return {
        statusCode: 200,
        body: `${JSON.stringify(data.Items)}`
    };
}