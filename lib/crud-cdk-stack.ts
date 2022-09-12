import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
export class CrudCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const employeeTable = new dynamodb.Table(this, "employeeRecords", {
      partitionKey : {
        name : 'id', 
        type : dynamodb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
    
    const createEmployee = new lambda.Function(this, "createEmployee", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler : 'createEmployee.handler',
      environment : {
        EMPLOYEE_TABLE_NAME : employeeTable.tableName
      }
    })
    
    const api = new apigw.LambdaRestApi(this, "lambdaApi", {
      handler : createEmployee,
      proxy: true
    })

    employeeTable.grantWriteData(createEmployee)
  }
}
