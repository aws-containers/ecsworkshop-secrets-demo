import { Construct } from 'constructs';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface VpcProps extends StackProps {
    maxAzs: number;
}

export class VPCStack extends Stack {
    readonly vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: VpcProps) {
        super(scope, id, props);

        if (props.maxAzs !== undefined && props.maxAzs <= 1) {
            throw new Error('maxAzs must be at least 2.');
        }

        this.vpc = new ec2.Vpc(this, 'ecsWorkshopVPC', {
            cidr: "10.0.0.0/16",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
            ],
        });
    }
}