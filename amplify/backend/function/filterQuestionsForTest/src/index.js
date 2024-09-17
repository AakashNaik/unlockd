const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const { testType, topicId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.STORAGE_MCQDBTABLE_NAME,
        FilterExpression: '#testType = :testType and #topicId = :topicId',
        ExpressionAttributeNames: {
            '#testType': 'testType',
            '#topicId': 'topicId'
        },
        ExpressionAttributeValues: {
            ':testType': testType,
            ':topicId': topicId
        }
    };

    try {
        const data = await docClient.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve questions' })
        };
    }
};
