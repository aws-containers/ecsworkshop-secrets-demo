import { SynthUtils, expect as expectCDK, haveResource, countResources } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
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
    })
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
});


test('Snapshot Tests', () => {
    const app = new App();
    const vpcStack = new VPCStack(app, 'VPCStack', iVpc);
    const rdsStack = new RDSStack(app, 'RDSStack', {
        vpc: vpcStack.vpc
    })
    expect(SynthUtils.toCloudFormation(rdsStack)).toMatchSnapshot();
});

