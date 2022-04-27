import { App, Stack, StackProps, Construct } from '@aws-cdk/core';
import { Vpc, SubnetType } from '@aws-cdk/aws-ec2'

export interface VpcProps extends StackProps {
    maxAzs: number;
}

export class VPCStack extends Stack {
    readonly vpc: Vpc;

    constructor(scope: Construct, id: string, props: VpcProps) {
        super(scope, id, props);

        if (props.maxAzs !== undefined && props.maxAzs <= 1) {
            throw new Error('maxAzs must be at least 2.');
        }

        this.vpc = new Vpc(this, 'ecsWorkshopVPC', {
            cidr: "10.0.0.0/16",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'private',
                    subnetType: SubnetType.PRIVATE,
                },
            ],
        });
    }
}