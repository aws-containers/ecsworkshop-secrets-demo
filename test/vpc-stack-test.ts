import { SynthUtils , expect as expectCDK, haveResource, countResources } from '@aws-cdk/assert';
import { App } from 'aws-cdk-lib';
import { VPCStack } from '../lib/vpc-stack'
import '@aws-cdk/assert/jest';

const iVpc = {
  maxAzs: 2
}

test('Fine-Grained Assertions', () => {
    const app = new App();
    // WHEN
    const stack = new VPCStack(app, 'VPCStack', iVpc);
    // THEN
    expectCDK(stack).to(haveResource('AWS::EC2::VPC', {
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: "default",
    }));
});

test('Snapshot Tests', () => {
  const app = new App();
  const stack = new VPCStack(app, 'VPCStack', iVpc);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('Validation Tests - maxAzs = 0 is Error', () => {
  const app = new App();
  expect(() => {
    new VPCStack(app, 'VPCStack', {
      maxAzs: 0
    });
  }).toThrowError('maxAzs must be at least 2.');
});

test('Validation Tests - maxAzs = 1 is Error', () => {
  const app = new App();
  expect(() => {
    new VPCStack(app, 'VPCStack', {
      maxAzs: 1
    });
  }).toThrowError('maxAzs must be at least 2.');
});

test('countResources', () => {
  const app = new App();
  const stack = new VPCStack(app, 'VPCStack', iVpc);
  expectCDK(stack).to(countResources('AWS::EC2::Subnet', 4));
});