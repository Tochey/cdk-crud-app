import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
export class CrudCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const employeeTable = new dynamodb.Table(this, "employeeRecords", {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const createEmployee = new lambda.Function(this, "createEmployee", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/create'),
      handler: 'createEmployee.handler',
      environment: {
        EMPLOYEE_TABLE_NAME: employeeTable.tableName
      }
    })

    const readEmployee = new lambda.Function(this, "readEmployee", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/read'),
      handler: 'readEmployee.handler',
      environment: {
        EMPLOYEE_TABLE_NAME: employeeTable.tableName
      }
    })

    const deleteEmployee = new lambda.Function(this, "deleteEmployee", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/delete'),
      handler: 'deleteEmployee.handler',
      environment: {
        EMPLOYEE_TABLE_NAME: employeeTable.tableName
      }
    })

    const updateEmployee = new lambda.Function(this, "updateEmployee", {
        runtime : lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset('lambda/update'),
        handler: 'updateEmployee.handler',
        environment: {
          EMPLOYEE_TABLE_NAME: employeeTable.tableName
        }
    })

    employeeTable.grantWriteData(createEmployee)
    employeeTable.grantReadData(readEmployee)
    employeeTable.grantReadWriteData(deleteEmployee)
    employeeTable.grantReadWriteData(updateEmployee)

    const api = new apigw.LambdaRestApi(this, "lambdaApi", {
      handler: createEmployee,
      proxy: false,
      restApiName: "employeeRecords"
    })

    const createEmployeeEDP = api.root.addResource('createEmployee')
    const readEmployeeEDP = api.root.addResource('readEmployee')
    const updateEmployeeEDP = api.root.addResource('updateEmployee')
    const deleteEmployeeEDP = api.root.addResource('deleteEmployee')
    const readByIdEDP = readEmployeeEDP.addResource('{userId}')
    const deleteByIdEDP = deleteEmployeeEDP.addResource('{userId}')
    const updateByIdEDP = updateEmployeeEDP.addResource('{userId}')

    createEmployeeEDP.addMethod('POST', new apigw.LambdaIntegration(createEmployee))
    readEmployeeEDP.addMethod('GET', new apigw.LambdaIntegration(readEmployee))
    deleteByIdEDP.addMethod('DELETE', new apigw.LambdaIntegration(deleteEmployee))
    readByIdEDP.addMethod('GET', new apigw.LambdaIntegration(readEmployee))
    updateByIdEDP.addMethod('POST', new apigw.LambdaIntegration(updateEmployee))

  }
}
