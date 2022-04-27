import { App } from '@aws-cdk/core';
import { VPCStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { ECSStack } from '../lib/ecs-fargate-stack';

const app = new App();

const vpcStack = new VPCStack(app, 'VPCStack', {
    maxAzs: 2
});

const rdsStack = new RDSStack(app, 'RDSStack', {
    vpc: vpcStack.vpc,
});

rdsStack.addDependency(vpcStack);

const ecsStack = new ECSStack(app, "ECSStack", {
    vpc: vpcStack.vpc,
    dbSecretArn: rdsStack.dbSecret.secretArn,
});

ecsStack.addDependency(rdsStack);