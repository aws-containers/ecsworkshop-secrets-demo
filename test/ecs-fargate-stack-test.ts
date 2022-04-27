import { SynthUtils, expect as expectCDK, haveResource, countResources } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { ECSStack } from '../lib/ecs-fargate-stack';
import { RDSStack } from '../lib/rds-stack';
import { VPCStack } from '../lib/vpc-stack';
import '@aws-cdk/assert/jest';

const iVpc = {
    maxAzs: 2
}

test('Fine-Grained Assertions', () => {
    const app = new App();
    // WHEN
    const vpcStack = new VPCStack(app, 'VPCStack', iVpc);
    const rdsStack = new RDSStack(app, 'RDSStack', {
        vpc: vpcStack.vpc
    });
    const ecsStack = new ECSStack(app, 'ECSStack', {
        vpc: vpcStack.vpc,
        dbSecretArn: rdsStack.dbSecret.secretArn,
    });
    // THEN
    expectCDK(vpcStack).to(haveResource('AWS::EC2::VPC', {
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: "default",
    }));
    expectCDK(rdsStack).to(haveResource('AWS::RDS::DBCluster', {
        EnableHttpEndpoint: true,
        EngineMode: "serverless",
    }));
    expectCDK(ecsStack).to(haveResource('AWS::ECS::Cluster', {
        ClusterName: "fargateClusterDemo"
    }));
});


test('Snapshot Tests', () => {
    const app = new App();
    const vpcStack = new VPCStack(app, 'VPCStack', iVpc);
    const rdsStack = new RDSStack(app, 'RDSStack', {
        vpc: vpcStack.vpc
    });
    const ecsStack = new ECSStack(app, 'ECSStack', {
        vpc: vpcStack.vpc,
        dbSecretArn: rdsStack.dbSecret.secretArn,
    });
    expect(SynthUtils.toCloudFormation(ecsStack)).toMatchSnapshot();
});

