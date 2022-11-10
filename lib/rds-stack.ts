import { App, StackProps, Stack, Duration, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';

export interface RDSStackProps extends StackProps {
    vpc: ec2.Vpc
}

export class RDSStack extends Stack {

    readonly dbSecret: rds.DatabaseSecret;
    readonly postgresRDSserverless: rds.ServerlessCluster;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

        const dbUser = this.node.tryGetContext("dbUser");
        const dbName = this.node.tryGetContext("dbName");
        const dbPort = this.node.tryGetContext("dbPort") || 5432;

        this.dbSecret = new sm.Secret(this, 'dbCredentialsSecret', {
            secretName: "ecsworkshop/test/todo-app/aurora-pg",
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: dbUser,
                }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password'
            }
        });

        this.postgresRDSserverless = new rds.ServerlessCluster(this, 'postgresRdsServerless', {
            engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
            parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
            vpc: props.vpc,
            enableDataApi: true,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
            credentials: rds.Credentials.fromSecret(this.dbSecret, dbUser),
            scaling: {
                autoPause: Duration.minutes(10), // default is to pause after 5 minutes of idle time
                minCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 2 Aurora capacity units (ACUs)
                maxCapacity: rds.AuroraCapacityUnit.ACU_32, // default is 16 Aurora capacity units (ACUs)
            },
            defaultDatabaseName: dbName,
            deletionProtection: false,
            removalPolicy: RemovalPolicy.DESTROY
        });

        this.postgresRDSserverless.connections.allowDefaultPortFromAnyIpv4;

        new sm.SecretRotation(
            this,
            `ecsworkshop/test/todo-app/aurora-pg`,
            {
                secret: this.dbSecret,
                application: sm.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
                vpc: props.vpc,
                vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
                target: this.postgresRDSserverless,
                automaticallyAfter: Duration.days(30),
            }
        );

        new CfnOutput(this, 'SecretName', { value: this.dbSecret.secretName });
    }
}